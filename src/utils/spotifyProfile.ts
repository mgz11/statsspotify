import axios from "axios";

export async function getSpotifyProfile(accessToken: string) {
	try {
		const response = await axios.get("https://api.spotify.com/v1/me", {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		return response.data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error fetching Spotify profile:", error.message);
		} else {
			console.error("Unexpected error:", error);
		}
		throw new Error("Failed to fetch Spotify profile");
	}
}
