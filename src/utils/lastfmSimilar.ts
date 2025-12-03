import { getCache, setCache } from "./cache";
import { LastFmTrack, LastFmSimilarTracksResponse } from "./types";

/**
 * Function to get similar tracks from internal api route with caching
 * @param artist
 * @param track
 * @param limit
 * @returns [] of trimmed similar tracks
 */
export async function getLastFmSimilarTracks(artist: string, track: string, limit: number = 5): Promise<LastFmTrack[]> {
	const cacheKey = `lastfm-similar:${artist}-${track}`;

	// 7 days time to live
	const timeToLive = 7 * 24 * 60 * 60 * 1000;
	const cached = getCache<LastFmTrack[]>(cacheKey, timeToLive);
	if (cached) return cached;

	try {
		const res = await fetch(
			`/api/lastfm/similarTracks?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}`
		);

		if (!res.ok) {
			console.error("Failed to fetch similar tracks from last.fm:", res.statusText);
			return [];
		}

		const data: LastFmSimilarTracksResponse = await res.json();
		const similar = data.similartracks.track || [];

		const trimmed = similar.slice(0, limit);
		setCache(cacheKey, trimmed);

		return trimmed;
	} catch (error) {
		console.error("Error in getSimilarTracks: ", error);
		return [];
	}
}
