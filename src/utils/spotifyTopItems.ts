import axios from "axios";

export async function getSpotifyTopItems(
	accessToken: string,
	type: string,
	time_range: string
) {
	const responseLimit = 10;
	try {
		// Spotify API endpoint for user's top items
		const response = await axios.get(
			`https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=${responseLimit}`,
			{ headers: { Authorization: `Bearer ${accessToken}` } }
		);

		return response.data;
	} catch (error: any) {
		console.error(
			"Error fetching user's top items:",
			error.response?.data || error.message
		);
		throw new Error("Failed to fetch user's top items");
	}
}
