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

export interface SpotifyTrack {
	id: string;
	name: string;
	uri: string;

	artists: {
		id: string;
		name: string;
	}[];

	album: {
		id: string;
		name: string;
		images: {
			url: string;
			height: number | null;
			width: number | null;
		}[];
	};
}
