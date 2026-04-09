import { NextResponse } from "next/server";

export async function GET() {
	const redirectUrl = `${process.env.BASE_URL || "http://127.0.0.1:3000"}`;
	const response = NextResponse.redirect(redirectUrl);

	response.cookies.set("spotifyAccessToken", "", {
		path: "/",
		httpOnly: true,
		maxAge: 0,
	});

	response.cookies.set("spotifyRefreshToken", "", {
		path: "/",
		httpOnly: true,
		maxAge: 0,
	});

	response.cookies.set("spotify_code_verifier", "", {
		path: "/",
		httpOnly: true,
		maxAge: 0,
	});

	return response;
}
