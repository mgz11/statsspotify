import axios from "axios";

export async function getSpotifyTopItems(
	accessToken: string,
	type: string,
	time_range: string
) {
	// Limit response to only 10 items
	const responseLimit = 10;
	try {
		// Spotify API endpoint for user's top items
		const response = await axios.get(
			`https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=${responseLimit}`,
			{ headers: { Authorization: `Bearer ${accessToken}` } }
		);

		return response.data;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error fetching user's top items:", error.message);
		} else {
			console.error("Unexpected error:", error);
		}

		throw new Error("Failed to fetch user's top items");
	}
}
