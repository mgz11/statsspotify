import axios from "axios";

export async function getSpotifyProfile(accessToken: string) {
	try {
		const response = await axios.get("https://api.spotify.com/v1/me", {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		return response.data;
	} catch (error: any) {
		console.error(
			"Error fetching Spotify profile:",
			error.response?.data || error.message
		);
		throw new Error("Failed to fetch Spotify profile");
	}
}
