"use client";

import { useState, useEffect } from "react";
import { getCache, setCache } from "@/utils/cache";
import { HomepageProps, UserTopItems } from "@/lib/ui/types";
import TopItems from "./TopItems";
import Link from "next/link";
export default function Dashboard({ profile }: HomepageProps) {
	const [topItems, setTopItems] = useState<UserTopItems[]>([]); // State for top tracks/artists
	const [loading, setLoading] = useState<boolean>(false);
	const [searchType, setSearchType] = useState<string>("tracks");
	const [activeButton, setActiveButton] = useState<number>(1);

	let time_range = "medium_term";
	if (activeButton === 0) {
		time_range = "short_term";
	} else if (activeButton === 1) {
		time_range = "medium_term";
	} else {
		time_range = "long_term";
	}

	// Fetch top tracks / artists
	useEffect(() => {
		fetchTopItems(searchType, time_range);
	}, [searchType, time_range]);

	const fetchTopItems = async (type: string, timeRange: string) => {
		const cacheKey = `spotify-top:${type}:${timeRange}`;

		//24 Hour TTL
		const ttl = 24 * 60 * 60 * 1000;

		try {
			setLoading(true);

			const cached = getCache<UserTopItems[]>(cacheKey, ttl);
			if (cached) {
				console.log("Using cached top items:", cached);
				setTopItems(cached);
				setLoading(false);
				return;
			}

			console.log("Cache Miss - Fetching top items from API for type:", type, "and time range:", timeRange);

			const response = await fetch(`/api/spotify/userTop?type=${type}&time_range=${timeRange}`);

			if (!response.ok) {
				throw new Error("Failed to fetch top items");
			}

			const data = await response.json();
			const items = data.items || [];
			setCache(cacheKey, items);
			setTopItems(items);
			console.log("Top items fetched:", data);
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Error fetching top items:", error.message);
			} else {
				console.error("Unexpected error:", error);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4 flex justify-center">Welcome {profile.display_name}!</h1>

			<div className=" flex flex-col items-center mb-8">
				<Link
					href={{ pathname: "/curate", query: { type: searchType, time_range: time_range } }}
					className="mb-4 py-2 px-4 rounded border border-white font-medium bg-green-600 hover:bg-green-500 transition-colors"
				>
					Generate Playlist
				</Link>
				<div className="flex gap-4 m-4">
					<button
						className={`${
							searchType === "tracks" ? "bg-blue-500 text-white" : ""
						} py-2 px-4 rounded border border-white font-medium`}
						onClick={() => {
							setSearchType("tracks");
						}}
					>
						Top Tracks
					</button>
					<button
						className={`${
							searchType === "artists" ? "bg-blue-500 text-white" : ""
						} py-2 px-4 rounded border border-white font-medium`}
						onClick={() => {
							setSearchType("artists");
						}}
					>
						Top Artists
					</button>
				</div>
				<div className="flex gap-4 mt-4">
					<button
						className={`${
							activeButton === 0 ? "bg-blue-500 text-white" : ""
						} py-2 px-4 rounded border border-white font-medium`}
						onClick={() => {
							setActiveButton(0);
						}}
					>
						Last 4 Weeks
					</button>
					<button
						className={`${
							activeButton === 1 ? "bg-blue-500 text-white" : ""
						} py-2 px-4 rounded border border-white font-medium`}
						onClick={() => {
							setActiveButton(1);
						}}
					>
						Last 6 Months
					</button>
					<button
						className={`${
							activeButton === 2 ? "bg-blue-500 text-white" : ""
						} py-2 px-4 rounded border border-white font-medium`}
						onClick={() => {
							setActiveButton(2);
						}}
					>
						Last Year
					</button>
				</div>
			</div>
			{loading ? <p>Loading...</p> : <TopItems items={topItems} searchType={searchType} />}
		</div>
	);
}
