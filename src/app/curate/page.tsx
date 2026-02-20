"use client";

import { useState, useEffect } from "react";
import { getLastFmSimilarTracks } from "@/utils/lastfmSimilar";
import { getCache } from "@/utils/cache";
import { SpotifyTrack } from "@/utils/types";

export default function CuratePage() {
	const [playlist, setPlaylist] = useState<SpotifyTrack[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		generatePlaylist();
	}, []);

	async function generatePlaylist() {
		setLoading(true);

		const topTracks = getCache<any[]>("spotify-top:tracks:6mo", 24 * 60 * 60 * 1000);

		if (!topTracks || topTracks.length === 0) {
			setLoading(false);
			return;
		}

		const seeds = topTracks.slice(0, 3);

		const collected: SpotifyTrack[] = [];

		for (const seed of seeds) {
			const artist = seed.artists[0].name;
			const trackName = seed.name;

			const similar = await getLastFmSimilarTracks(artist, trackName);

			for (const simTrack of similar) {
				// Search Spotify for the track and add to collected
			}
		}
	}
}
