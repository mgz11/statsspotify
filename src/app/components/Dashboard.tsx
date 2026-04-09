"use client";

import { useState, useEffect } from "react";
import { clearCachePrefix, getCache, setCache } from "@/utils/cache";
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

	const handleLogout = () => {
		clearCachePrefix("spotify-top:");
		window.location.href = "/api/auth/logout";
	};

	return (
		<div className="mx-auto w-full max-w-7xl p-6 md:p-10">
			<div className="mb-6 flex items-center justify-between gap-4">
				<h1 className="text-2xl font-bold md:text-3xl">Stats</h1>
				<h1 className="text-2xl font-bold md:text-3xl">Welcome {profile.display_name}!</h1>
				<button
					onClick={handleLogout}
					className="rounded-full border border-red-200/50 bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/35"
				>
					Logout
				</button>
			</div>

			<div className="mb-10 flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-5 shadow-xl backdrop-blur-sm">
				<Link
					href={{ pathname: "/curate", query: { type: searchType, time_range: time_range } }}
					className="mb-5 rounded-full border border-emerald-200/60 bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5 hover:brightness-110"
				>
					Generate Playlist
				</Link>
				<div className="m-2 flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/15 bg-slate-900/40 p-2">
					<button
						className={`${
							searchType === "tracks"
								? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-900/40"
								: "text-slate-200 hover:bg-white/10"
						} rounded-full px-5 py-2 text-sm font-semibold transition-all`}
						onClick={() => {
							setSearchType("tracks");
						}}
					>
						Top Tracks
					</button>
					<button
						className={`${
							searchType === "artists"
								? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-900/40"
								: "text-slate-200 hover:bg-white/10"
						} rounded-full px-5 py-2 text-sm font-semibold transition-all`}
						onClick={() => {
							setSearchType("artists");
						}}
					>
						Top Artists
					</button>
				</div>
				<div className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/15 bg-slate-900/40 p-2">
					<button
						className={`${
							activeButton === 0
								? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-900/40"
								: "text-slate-200 hover:bg-white/10"
						} rounded-full px-5 py-2 text-sm font-semibold transition-all`}
						onClick={() => {
							setActiveButton(0);
						}}
					>
						Last 4 Weeks
					</button>
					<button
						className={`${
							activeButton === 1
								? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-900/40"
								: "text-slate-200 hover:bg-white/10"
						} rounded-full px-5 py-2 text-sm font-semibold transition-all`}
						onClick={() => {
							setActiveButton(1);
						}}
					>
						Last 6 Months
					</button>
					<button
						className={`${
							activeButton === 2
								? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-900/40"
								: "text-slate-200 hover:bg-white/10"
						} rounded-full px-5 py-2 text-sm font-semibold transition-all`}
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
