import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const code = searchParams.get("code");

	if (!code) {
		return NextResponse.json({ error: "No code provided" }, { status: 400 });
	}

	// Check for code verifier
	const cookies = req.headers.get("cookie") || "";
	const codeVerifierMatch = cookies.match(/spotify_code_verifier=([^;]+)/);
	const codeVerifier = codeVerifierMatch
		? decodeURIComponent(codeVerifierMatch[1])
		: null;

	if (!codeVerifier) {
		return NextResponse.json(
			{ error: "Missing code_verifier. PCKE authentication failed." },
			{ status: 400 }
		);
	}

	try {
		const response = await axios.post(
			"https://accounts.spotify.com/api/token",
			new URLSearchParams({
				code,
				redirect_uri: process.env.SPOTIFY_REDIRECT_URI || "",
				grant_type: "authorization_code",
				client_id: process.env.SPOTIFY_CLIENT_ID || "",
				code_verifier: codeVerifier,
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		const { access_token, refresh_token, expires_in } = response.data;

		const res = NextResponse.redirect(
			`${process.env.BASE_URL || "http://localhost:3000"}`
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

		// Remove stored verifier (no longer needed after exchange)
		res.cookies.set("spotify_code_verifier", "", {
			path: "/",
			httpOnly: true,
			maxAge: 0,
		});

		return res;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error fetching profile:", error.message || error);
			return NextResponse.json({
				error: error.message || "Unknown error occurred",
			});
		} else {
			console.error("Unexpected error:", error);
		}
	}
}
