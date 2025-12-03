import { NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Using PCKE Flow from https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
 */
const generateCodeVerifier = (length: number) => {
	const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const values = crypto.randomBytes(length);
	return Array.from(values, (x) => possible[x % possible.length]).join("");
};

const sha256 = async (plain: string) => {
	return crypto.createHash("sha256").update(plain).digest();
};

const base64encode = (input: Buffer) => {
	return input.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
};

export async function GET() {
	const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
	const codeVerifier = generateCodeVerifier(64);
	const hashed = await sha256(codeVerifier);
	const codeChallenge = base64encode(hashed);

	const queryParams = new URLSearchParams({
		client_id: process.env.SPOTIFY_CLIENT_ID || "",
		response_type: "code",
		redirect_uri: process.env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:3000/api/auth/callback",
		scope: "user-read-private user-read-email user-top-read",
		code_challenge: codeChallenge,
		code_challenge_method: "S256",
	});

	console.log("Redirecting to Spotify Auth:", `${SPOTIFY_AUTH_URL}?${queryParams.toString()}`);

	const response = NextResponse.redirect(`${SPOTIFY_AUTH_URL}?${queryParams.toString()}`);
	// Save code verifier in cookie
	response.cookies.set("spotify_code_verifier", codeVerifier, {
		httpOnly: true,
		path: "/",
		maxAge: 600,
	});

	return response;
}
