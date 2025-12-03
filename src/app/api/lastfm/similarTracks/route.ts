import { NextResponse } from "next/server";
import axios from "axios";
import { LastFmSimilarTracksResponse } from "@/utils/types";

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const artist = searchParams.get("artist");
	const track = searchParams.get("track");

	if (!artist || !track) {
		return NextResponse.json({ error: "Missing artist or track parameter" }, { status: 400 });
	}

	const params = new URLSearchParams({
		method: "track.getsimilar",
		artist,
		track,
		limit: "10",
		api_key: process.env.LASTFM_API_KEY || "",
		format: "json",
	});

	const url = `http://ws.audioscrobbler.com/2.0/?${params.toString()}`;

	try {
		const { data } = await axios.get<LastFmSimilarTracksResponse>(url);
		return NextResponse.json(data);
	} catch (error: unknown) {
		if (error instanceof Error) {
			return console.error("Error fetching last.fm data:", error.message);
		}
		return NextResponse.json({ error: "Failed to fetch last.fm data" }, { status: 500 });
	}
}
