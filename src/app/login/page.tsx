"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
	const [profile, setProfile] = useState<any>(null);
	const [topItems, setTopItems] = useState<any[]>([]); // State for top tracks/artists
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				console.log("Fetching profile...");
				const response = await fetch("/api/spotify/profile");

				if (!response.ok) {
					throw new Error("Failed to fetch profile");
				}

				const data = await response.json();
				setProfile(data);
				console.log("Profile fetched:", data);
			} catch (err: any) {
				console.error("Error fetching profile:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

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
			setTopItems(data.items || []); // Assuming the API returns an `items` array
			console.log("Top items fetched:", data);
		} catch (err: any) {
			console.error("Error fetching top items:", err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex flex-col justify-center items-center h-screen">
				<p>Loading...</p>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="flex flex-col justify-center items-center h-screen">
				<h1 className="text-4xl font-roboto">
					See Your Top Artists / Tracks On Spotify!
				</h1>
				<button
					className="py-3 px-12 rounded bg-spotify-green font-roboto font-medium mt-5"
					onClick={() => (window.location.href = "/api/auth")}
				>
					Login
				</button>
			</div>
		);
	}

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
						onClick={() => fetchTopItems("tracks", "short_term")}
					>
						Top Tracks (Short Term)
					</button>
					<button
						className="py-2 px-4 rounded bg-green-500 text-white"
						onClick={() => fetchTopItems("artists", "short_term")}
					>
						Top Artists (Short Term)
					</button>
				</div>
			</div>

			{topItems.length > 0 && (
				<div>
					<h2 className="text-xl font-medium mb-4">Your Top Items:</h2>
					<ul className="space-y-4">
						{topItems.map((item, index) => (
							<li key={index} className="p-4 bg-gray-100 rounded shadow">
								{item.name}
								{item.artists && (
									<p className="text-sm text-gray-600">
										{item.artists.map((artist: any) => artist.name).join(", ")}
									</p>
								)}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
