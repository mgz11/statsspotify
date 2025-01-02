"use client";

import { useState } from "react";
import TopItems from "./TopItems";

interface Artist {
	name: string;
}
interface UserTopItems {
	name: string;
	artists?: Artist[];
}

interface HomepageProps {
	profile: {
		display_name: string;
	};
}
export default function Homepage({ profile }: HomepageProps) {
	const [topItems, setTopItems] = useState<UserTopItems[]>([]); // State for top tracks/artists
	const [loading, setLoading] = useState<boolean>(false);
	const [searchType, setSearchType] = useState<string>("tracks");

	const fetchTopItems = async (type: string, timeRange: string) => {
		try {
			setLoading(true);
			const response = await fetch(
				`/api/spotify/userTop?type=${type}&time_range=${timeRange}`
			);

			if (!response.ok) {
				throw new Error("Failed to fetch top items");
			}

			const data = await response.json();
			setTopItems(data.items || []);
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
			<h1 className="text-2xl font-bold mb-4">
				Welcome, {profile.display_name}!
			</h1>

			<div className="mb-8">
				<h2 className="text-xl font-medium mb-2">Fetch Top Items</h2>
				<div className="flex gap-4">
					<button
						className="py-2 px-4 rounded bg-blue-500 text-white"
						onClick={() => {
							setSearchType("tracks");
							fetchTopItems("tracks", "short_term");
						}}
					>
						Top Tracks (Short Term)
					</button>
					<button
						className="py-2 px-4 rounded bg-green-500 text-white"
						onClick={() => {
							setSearchType("artists");
							fetchTopItems("artists", "short_term");
						}}
					>
						Top Artists (Short Term)
					</button>
				</div>
			</div>
			{loading ? (
				<p>Loading...</p>
			) : (
				<TopItems items={topItems} searchType={searchType} />
			)}
		</div>
	);
}
