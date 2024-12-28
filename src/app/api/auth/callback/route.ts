import { NextResponse } from "next/server";
import axios from "axios";
import { access } from "fs";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const code = searchParams.get("code");

	if (!code) {
		return NextResponse.json({ error: "No code provided" }, { status: 400 });
	}

	try {
		const response = await axios.post(
			"https://accounts.spotify.com/api/token",
			new URLSearchParams({
				code,
				redirect_uri: process.env.SPOTIFY_REDIRECT_URI || "",
				grant_type: "authorization_code",
				client_id: process.env.SPOTIFY_CLIENT_ID || "",
				client_secret: process.env.SPOTIFY_CLIENT_SECRET || "",
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);
		const { access_token, refresh_token, expires_in } = response.data;

		// Save token in cookies
		const responseHeaders = new Headers();
		responseHeaders.append(
			"Set-Cookie",
			`spotifyAccessToken=${access_token}; Path=/; HttpOnly; Max-Age=${expires_in}`
		);
		responseHeaders.append(
			"Set-Cookie",
			`spotifyRefreshToken=${refresh_token}; Path=/; HttpOnly;`
		);

		console.log("Redirecting to /login");
		return NextResponse.redirect(
			`${process.env.BASE_URL || "http://localhost:3000"}/login`
		);
	} catch (error: any) {
		console.log("Error occurred:", error);
		return NextResponse.json({
			error: error.message || "Unknown error occurred",
		});
	}
}
