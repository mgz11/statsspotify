import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
	const refreshToken = req.headers.get("refresh_token");

	if (!refreshToken) {
		return NextResponse.json(
			{ error: "No refresh token provided" },
			{ status: 400 }
		);
	}

	try {
		const response = await axios.post(
			"https://accounts.spotify.com/api/token",
			new URLSearchParams({
				grant_type: "refresh_token",
				refresh_token: refreshToken,
				client_id: process.env.SPOTIFY_CLIENT_ID || "",
				client_secret: process.env.SPOTIFY_CLIENT_SECRET || "",
			}).toString(),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		return NextResponse.json(response.data);
	} catch (error: any) {
		console.error(
			"Error refreshing token:",
			error.response?.data || error.message
		);
		return NextResponse.json(
			{ error: "Failed to refresh token" },
			{ status: 500 }
		);
	}
}
