import { NextResponse } from "next/server";
import axios from "axios";

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

		const res = NextResponse.redirect(
			`${process.env.BASE_URL || "http://localhost:3000"}/login`
		);

		// Set cookies using NextResponse.cookies
		res.cookies.set("spotifyAccessToken", access_token, {
			path: "/",
			httpOnly: true,
			maxAge: expires_in,
		});

		res.cookies.set("spotifyRefreshToken", refresh_token, {
			path: "/",
			httpOnly: true,
		});

		console.log("Redirecting to /login");
		return res;
	} catch (error: any) {
		console.log("Error occurred:", error);
		return NextResponse.json({
			error: error.message || "Unknown error occurred",
		});
	}
}
