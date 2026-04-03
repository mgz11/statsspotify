import axios from "axios";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { LastFmSimilarTracksResponse } from "@/lib/lastfm/types";
import { GeneratePlaylistBody, SpotifyTrack } from "@/lib/spotify/types";
import {
	addTracksToSpotifyPlaylist,
	createSpotifyPlaylist,
	findExistingSpotifyPlaylist,
	searchTopTrackForArtist,
	searchSpotifyTrack,
} from "@/utils/spotifyPlaylist";

async function getSimilarTracksFromLastFm(artist: string, track: string, limit: number = 10) {
	const params = new URLSearchParams({
		method: "track.getsimilar",
		artist,
		track,
		limit: String(limit),
		api_key: process.env.LASTFM_API_KEY || "",
		format: "json",
	});

	try {
		const url = `https://ws.audioscrobbler.com/2.0/?${params.toString()}`;
		const { data } = await axios.get<LastFmSimilarTracksResponse>(url);
		return data.similartracks?.track || [];
	} catch (error) {
		throw new Error(
			`Failed to fetch similar tracks from Last.fm: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

function formatAxiosError(error: unknown, stage: string) {
	if (!axios.isAxiosError(error)) {
		if (error instanceof Error) {
			return {
				status: 500,
				body: { error: error.message, stage },
			};
		}

		return {
			status: 500,
			body: { error: "Unexpected error creating playlist", stage },
		};
	}

	const status = error.response?.status || 500;
	const spotifyMessage = error.response?.data?.error?.message || error.message;

	return {
		status,
		body: {
			error: spotifyMessage,
			stage,
		},
	};
}

export async function POST(req: NextRequest) {
	const accessToken = req.cookies.get("spotifyAccessToken")?.value;

	if (!accessToken) {
		return NextResponse.json({ error: "Access token is missing" }, { status: 401 });
	}

	let body: GeneratePlaylistBody;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
	}

	const seedType = body.seedType || "tracks";
	const sourceSeeds = (body.seeds || []).slice(0, 3);
	if (sourceSeeds.length === 0) {
		return NextResponse.json({ error: "No seed tracks provided" }, { status: 400 });
	}

	const today = new Date().toISOString().split("T")[0];
	const timeRange = body.timeRange || "medium_term";
	const sourceSignatureInput = sourceSeeds
		.map((seed) => {
			if ("artists" in seed) return seed.id || seed.name;
			return seed.id || seed.name;
		})
		.filter(Boolean)
		.sort()
		.join("|");
	const seedSignature = crypto
		.createHash("sha256")
		.update(`${seedType}:${timeRange}:${sourceSignatureInput}`)
		.digest("hex")
		.slice(0, 12);
	const playlistName = `StatsSpotify Curate ${today}`;
	const descriptionMarker = `[ss-seed:${seedSignature}][ss-type:${seedType}][ss-range:${timeRange}]`;
	const playlistDescription = `Generated from your top ${seedType} on ${today} ${descriptionMarker}`;

	try {
		const existingPlaylist = await findExistingSpotifyPlaylist(accessToken, playlistName, descriptionMarker);
		if (existingPlaylist) {
			return NextResponse.json({
				playlistId: existingPlaylist.id,
				playlistUrl: existingPlaylist.external_urls.spotify,
				seedCount: sourceSeeds.length,
				addedCount: 0,
				tracks: [],
				existing: true,
			});
		}
	} catch (error: unknown) {
		const { status, body } = formatAxiosError(error, "spotify-find-existing-playlist");
		return NextResponse.json(body, { status });
	}

	const seeds: SpotifyTrack[] = [];
	if (seedType === "artists") {
		for (const sourceSeed of sourceSeeds) {
			if (!("name" in sourceSeed)) continue;
			try {
				const topTrack = await searchTopTrackForArtist(accessToken, sourceSeed.name);
				if (topTrack) {
					seeds.push(topTrack);
				}
			} catch {
				continue;
			}
		}
	} else {
		for (const sourceSeed of sourceSeeds) {
			if ("artists" in sourceSeed && sourceSeed.uri) {
				seeds.push(sourceSeed);
			}
		}
	}

	if (seeds.length === 0) {
		return NextResponse.json({ error: "No usable seeds found for playlist generation" }, { status: 400 });
	}

	const candidateTracks = new Map<string, SpotifyTrack>();

	for (const seed of seeds) {
		const artistName = seed.artists?.[0]?.name;
		if (!artistName || !seed.name) continue;

		let similarTracks;
		try {
			similarTracks = await getSimilarTracksFromLastFm(artistName, seed.name, 10);
		} catch (error: unknown) {
			const { status, body } = formatAxiosError(error, "lastfm-similar");
			return NextResponse.json(body, { status });
		}

		for (const similarTrack of similarTracks) {
			try {
				const matchedSpotifyTrack = await searchSpotifyTrack(accessToken, similarTrack.artist.name, similarTrack.name);

				if (!matchedSpotifyTrack) continue;
				if (matchedSpotifyTrack.uri === seed.uri) continue;

				candidateTracks.set(matchedSpotifyTrack.uri, matchedSpotifyTrack);
			} catch {
				// Continue on individual track search failures so a single bad lookup doesn't fail the request.
				continue;
			}
		}
	}

	const matchedTracks = Array.from(candidateTracks.values()).slice(0, 30);
	const uris = matchedTracks.map((track) => track.uri);

	if (uris.length === 0) {
		return NextResponse.json({ error: "No matching Spotify tracks found from seeds" }, { status: 404 });
	}

	let playlist;
	try {
		playlist = await createSpotifyPlaylist(accessToken, playlistName, playlistDescription, false);
	} catch (error: unknown) {
		const { status, body } = formatAxiosError(error, "spotify-create-playlist");
		return NextResponse.json(body, { status });
	}

	try {
		await addTracksToSpotifyPlaylist(accessToken, playlist.id, uris);
	} catch (error: unknown) {
		const { status, body } = formatAxiosError(error, "spotify-add-tracks");
		return NextResponse.json(body, { status });
	}

	return NextResponse.json({
		playlistId: playlist.id,
		playlistUrl: playlist.external_urls.spotify,
		seedCount: sourceSeeds.length,
		addedCount: uris.length,
		tracks: matchedTracks,
	});
}
