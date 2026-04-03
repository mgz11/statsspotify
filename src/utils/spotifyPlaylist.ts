import axios from "axios";
import {
	SpotifyCreatePlaylistResponse,
	SpotifyCurrentUserPlaylistsResponse,
	SpotifyPlaylistSummary,
	SpotifyTrack,
	SpotifyTrackSearchResponse,
} from "@/lib/spotify/types";

export async function searchSpotifyTrack(
	accessToken: string,
	artist: string,
	track: string,
): Promise<SpotifyTrack | null> {
	const query = `track:${track} artist:${artist}`;

	const response = await axios.get<SpotifyTrackSearchResponse>("https://api.spotify.com/v1/search", {
		headers: { Authorization: `Bearer ${accessToken}` },
		params: {
			q: query,
			type: "track",
			limit: 1,
		},
	});

	return response.data.tracks.items[0] || null;
}

export async function searchTopTrackForArtist(
	accessToken: string,
	artist: string,
): Promise<SpotifyTrack | null> {
	const response = await axios.get<SpotifyTrackSearchResponse>("https://api.spotify.com/v1/search", {
		headers: { Authorization: `Bearer ${accessToken}` },
		params: {
			q: `artist:${artist}`,
			type: "track",
			limit: 1,
		},
	});

	return response.data.tracks.items[0] || null;
}

export async function createSpotifyPlaylist(
	accessToken: string,
	name: string,
	description: string,
	isPublic: boolean = false,
): Promise<SpotifyCreatePlaylistResponse> {
	const response = await axios.post<SpotifyCreatePlaylistResponse>(
		"https://api.spotify.com/v1/me/playlists",
		{
			name,
			description,
			public: isPublic,
		},
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		},
	);

	return response.data;
}

export async function findExistingSpotifyPlaylist(
	accessToken: string,
	name: string,
	descriptionMarker: string,
): Promise<SpotifyPlaylistSummary | null> {
	let nextUrl: string | null = "https://api.spotify.com/v1/me/playlists?limit=50";

	while (nextUrl) {
		const response: { data: SpotifyCurrentUserPlaylistsResponse } = await axios.get(nextUrl, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});

		const match = response.data.items.find((playlist: SpotifyPlaylistSummary) => {
			return playlist.name === name && (playlist.description || "").includes(descriptionMarker);
		});

		if (match) {
			return match;
		}

		nextUrl = response.data.next;
	}

	return null;
}

export async function addTracksToSpotifyPlaylist(
	accessToken: string,
	playlistId: string,
	trackUris: string[],
): Promise<void> {
	if (trackUris.length === 0) return;

	const chunkSize = 100;

	for (let i = 0; i < trackUris.length; i += chunkSize) {
		const chunk = trackUris.slice(i, i + chunkSize);

		await axios.post(
			`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
			{ uris: chunk },
			{ headers: { Authorization: `Bearer ${accessToken}` } },
		);
	}
}
