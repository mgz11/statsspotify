import { NextResponse, NextRequest } from "next/server";
import { getSpotifyProfile } from "@/utils/spotifyProfile";

export async function GET(req: NextRequest) {
	const cookies = req.cookies;
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

	try {
		// Fetch Spotify profile using the access token
		const profile = await getSpotifyProfile(accessToken);

		console.log("Fetched Spotify Profile:", profile);

		return NextResponse.json(profile);
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error fetching Spotify profile:", error.message);
			return NextResponse.json(
				{ error: "Failed to fetch Spotify profile" },
				{ status: 500 }
			);
		} else {
			console.error("Unexpected error:", error);
		}
	}
}
