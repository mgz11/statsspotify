"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SeedType, TimeRange } from "@/lib/common/types";
import { getCache } from "@/utils/cache";
import { CurateSeed, GeneratePlaylistErrorResponse, GeneratePlaylistResponse, SpotifyTrack } from "@/lib/spotify/types";

function isTrackSeed(seed: CurateSeed): seed is SpotifyTrack {
	return "artists" in seed && "album" in seed;
}

export default function CuratePage() {
	const searchParams = useSearchParams();
	const queryType = searchParams.get("type");
	const queryTimeRange = searchParams.get("time_range");
	const selectedSeedType: SeedType = queryType === "artists" ? "artists" : "tracks";
	const selectedTimeRange: TimeRange =
		queryTimeRange === "short_term" || queryTimeRange === "long_term" ? queryTimeRange : "medium_term";

	const [seeds, setSeeds] = useState<CurateSeed[]>([]);
	const [generatedTracks, setGeneratedTracks] = useState<SpotifyTrack[]>([]);
	const [playlistUrl, setPlaylistUrl] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const seedTypeLabel = selectedSeedType === "artists" ? "Top Artists" : "Top Tracks";
	const timeRangeLabel =
		selectedTimeRange === "short_term"
			? "Last 4 Weeks"
			: selectedTimeRange === "long_term"
				? "Last Year"
				: "Last 6 Months";

	useEffect(() => {
		const cacheKey = `spotify-top:${selectedSeedType}:${selectedTimeRange}`;
		const cachedItems = getCache<CurateSeed[]>(cacheKey, 24 * 60 * 60 * 1000);
		setSeeds((cachedItems || []).slice(0, 3));
	}, [selectedSeedType, selectedTimeRange]);

	async function generatePlaylist() {
		setLoading(true);
		setError("");
		setPlaylistUrl("");
		setGeneratedTracks([]);

		if (seeds.length === 0) {
			setError("No cached seeds found. Load your selected top items on the dashboard first.");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/spotify/playlist/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					seeds,
					seedType: selectedSeedType,
					timeRange: selectedTimeRange,
				}),
			});

			const data = (await response.json()) as GeneratePlaylistResponse | GeneratePlaylistErrorResponse;

			if (!response.ok) {
				const errorData = data as GeneratePlaylistErrorResponse;
				const message = [errorData.error, errorData.stage ? `(stage: ${errorData.stage})` : "", errorData.hint]
					.filter(Boolean)
					.join(" ");
				throw new Error(message || "Failed to generate playlist");
			}

			const result = data as GeneratePlaylistResponse;
			setGeneratedTracks(result.tracks);
			setPlaylistUrl(result.playlistUrl);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError("Unexpected error generating playlist");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="p-6 md:p-8 max-w-5xl mx-auto">
			<div className="flex flex-wrap items-center justify-between gap-3 mb-6">
				<Link
					href="/"
					className="inline-block py-2 px-4 rounded-full border border-white font-medium hover:bg-neutral-800 transition-colors"
				>
					Back to Dashboard
				</Link>
				{playlistUrl && (
					<a
						href={playlistUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block py-2 px-4 rounded-full border border-green-400 text-green-300 font-medium hover:bg-green-900/30 transition-colors"
					>
						Open Playlist in Spotify
					</a>
				)}
			</div>

			<div className="rounded-xl border border-neutral-700 bg-neutral-900/50 p-5 md:p-6 mb-6">
				<h1 className="text-2xl font-bold mb-2">Curate Playlist</h1>
				<p className="text-sm text-gray-300 mb-4">
					Build a playlist from your current dashboard selection. We use your top 3 seeds from this view.
				</p>
				<div className="flex flex-wrap gap-2 text-xs">
					<span className="px-3 py-1 rounded-full border border-blue-400 text-blue-300">{seedTypeLabel}</span>
					<span className="px-3 py-1 rounded-full border border-emerald-400 text-emerald-300">{timeRangeLabel}</span>
				</div>
			</div>

			<div className="rounded-xl border border-neutral-700 bg-neutral-900/40 p-5 md:p-6 mb-6">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold">Seed Preview</h2>
					<span className="text-xs text-gray-400">Top {seeds.length} loaded</span>
				</div>

				{seeds.length === 0 ? (
					<p className="text-sm text-red-400">
						No cached seeds found. Visit dashboard and load your selected top items first.
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						{seeds.map((seed) => {
							const imageUrl = isTrackSeed(seed) ? seed.album?.images?.[0]?.url : seed.images?.[0]?.url;
							const subtitle = isTrackSeed(seed) ? seed.artists.map((artist) => artist.name).join(", ") : "Artist seed";

							return (
								<div key={seed.id || seed.name} className="rounded-lg border border-neutral-700 p-3 bg-neutral-900/40">
									<div className="flex items-center gap-3">
										{imageUrl ? (
											<img
												src={imageUrl}
												alt={`${seed.name} artwork`}
												className="w-14 h-14 rounded object-cover shrink-0"
											/>
										) : (
											<div className="w-14 h-14 rounded bg-neutral-800 shrink-0" />
										)}
										<div className="min-w-0">
											<p className="text-sm font-medium truncate">{seed.name}</p>
											<p className="text-xs text-gray-400 truncate">{subtitle}</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}

				<div className="mt-5">
					<button
						onClick={generatePlaylist}
						disabled={loading || seeds.length === 0}
						className="py-2 px-4 rounded-full border border-white font-medium disabled:opacity-50 hover:bg-neutral-800 transition-colors"
					>
						{loading ? "Generating playlist..." : "Generate Playlist"}
					</button>
				</div>
			</div>

			{error && <p className="mb-6 text-sm text-red-400">{error}</p>}

			{generatedTracks.length > 0 && (
				<div className="rounded-xl border border-neutral-700 bg-neutral-900/40 p-5 md:p-6">
					<h2 className="text-lg font-semibold mb-3">Playlist Preview ({generatedTracks.length} tracks)</h2>
					<p className="text-xs text-gray-400 mb-4">Showing the first 12 tracks added to your generated playlist.</p>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{generatedTracks.slice(0, 12).map((track) => (
							<div key={track.uri} className="rounded-lg border border-neutral-700 p-3 bg-neutral-900/40">
								<div className="flex items-center gap-3">
									{track.album?.images?.[0]?.url ? (
										<img
											src={track.album.images[0].url}
											alt={`${track.name} album art`}
											className="w-14 h-14 rounded object-cover shrink-0"
										/>
									) : (
										<div className="w-14 h-14 rounded bg-neutral-800 shrink-0" />
									)}
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium truncate">{track.name}</p>
										<p className="text-xs text-gray-400 truncate">
											{track.artists.map((artist) => artist.name).join(", ")}
										</p>
										<p className="text-xs text-gray-500 truncate">{track.album?.name}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
