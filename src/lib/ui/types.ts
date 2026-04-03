import { Profile, SpotifyAlbum, SpotifyArtist, SpotifyExternalUrls, SpotifyImage } from "@/lib/spotify/types";

export interface TopItem {
	name: string;
	artists: SpotifyArtist[];
	album: SpotifyAlbum | null;
	images: SpotifyImage[];
	external_urls: SpotifyExternalUrls;
}

export interface TopItemsProps {
	items: TopItem[];
	searchType: string;
}

export interface UserTopItems {
	name: string;
	artists: SpotifyArtist[];
	album: SpotifyAlbum | null;
	images: SpotifyImage[];
	external_urls: SpotifyExternalUrls;
}

export interface HomepageProps {
	profile: Profile;
}
