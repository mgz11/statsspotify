import { NextResponse, NextRequest } from "next/server";
import { getSpotifyTopItems } from "@/utils/spotifyTopItems";

export async function GET(req: NextRequest) {
	const cookies = req.cookies;

	// Log available cookies
	console.log("Cookies available:", req.cookies.getAll());
	console.log("Access Token:", req.cookies.get("spotifyAccessToken")?.value);

	// Retrieve access token from cookies
	const accessToken = cookies.get("spotifyAccessToken")?.value;

	if (!accessToken) {
		console.log("No access token found in cookies");
		return NextResponse.json(
			{ error: "Access token is missing" },
			{ status: 401 }
		);
	}

	// Extract query parameters (type and time_range)
	const { searchParams } = new URL(req.url);
	const type = searchParams.get("type") || "tracks"; // Default to "tracks" if not provided
	const timeRange = searchParams.get("time_range") || "short_term"; // Default to "short_term" if not provided

	try {
		// Fetch user's top items using the access token, type, and time range
		const userTopItems = await getSpotifyTopItems(accessToken, type, timeRange);

		console.log("Fetched top items:", userTopItems);

		return NextResponse.json(userTopItems);
	} catch (error: any) {
		console.error("Error fetching Spotify profile:", error.message || error);
		return NextResponse.json(
			{ error: "Failed to fetch Spotify profile" },
			{ status: 500 }
		);
	}
}
