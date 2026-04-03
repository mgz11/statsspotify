import { SeedType, TimeRange } from "@/lib/common/types";

export interface SpotifyImage {
	url: string;
	height: number | null;
	width: number | null;
}

export interface SpotifyArtist {
	id: string | null;
	name: string;
}

export interface SpotifyAlbum {
	id: string | null;
	name: string | null;
	images: SpotifyImage[];
}

export interface SpotifyExternalUrls {
	spotify: string;
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

export interface SpotifyPlaylistSummary {
	id: string;
	name: string;
	description: string | null;
	external_urls: SpotifyExternalUrls;
}

export interface Profile {
	display_name: string;
}

export interface SpotifyArtistSeed {
	id: string | null;
	name: string;
	images: SpotifyImage[];
}

export type CurateSeed = SpotifyTrack | SpotifyArtistSeed;

export interface GeneratePlaylistBody {
	seeds: CurateSeed[];
	seedType: SeedType;
	timeRange: TimeRange;
}

export interface GeneratePlaylistResponse {
	playlistId: string;
	playlistUrl: string;
	seedCount: number;
	addedCount: number;
	tracks: SpotifyTrack[];
}

export interface GeneratePlaylistErrorResponse {
	error: string | null;
	stage: string | null;
	hint: string | null;
}

export interface SpotifyCreatePlaylistResponse {
	id: string;
	name: string;
	description: string | null;
	external_urls: SpotifyExternalUrls;
}

export interface SpotifyTrackSearchResponse {
	tracks: {
		items: SpotifyTrack[];
	};
}

export interface SpotifyCurrentUserPlaylistsResponse {
	items: SpotifyPlaylistSummary[];
	next: string | null;
}
