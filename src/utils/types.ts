export interface LastFmTrack {
	name: string;
	artist: {
		name: string;
	};
	match: number;
	url: string;
	duration?: number;
}
export interface LastFmSimilarTracksResponse {
	similartracks: {
		track: LastFmTrack[];
	};
}
