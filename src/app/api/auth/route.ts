import { NextResponse } from "next/server";

export async function GET() {
	const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
	const queryParams = new URLSearchParams({
		client_id: process.env.SPOTIFY_CLIENT_ID || "",
		response_type: "code",
		redirect_uri:
			process.env.SPOTIFY_REDIRECT_URI ||
			"http://localhost:3000/api/auth/callback",
		scope: "user-read-private user-read-email",
	});
	console.log(
		"Redirecting to Spotify Auth:",
		`${SPOTIFY_AUTH_URL}?${queryParams.toString()}`
	);

	return NextResponse.redirect(`${SPOTIFY_AUTH_URL}?${queryParams.toString()}`);
}
