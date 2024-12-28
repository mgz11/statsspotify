"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
	const [profile, setProfile] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

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
				setError("Failed to load profile. Please log in again.");
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []); // Run only once on component mount

	const handleLogin = () => {
		window.location.href = "/api/auth";
	};

	if (loading) {
		return (
			<div className="flex flex-col justify-center items-center h-screen">
				<p>Loading...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center h-screen">
				<p>{error}</p>
				<button
					className="py-3 px-12 rounded bg-spotify-green font-roboto font-medium mt-5"
					onClick={handleLogin}
				>
					Login
				</button>
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
					onClick={handleLogin}
				>
					Login
				</button>
			</div>
		);
	}

	return (
		<div>
			<h1>Welcome {profile.display_name}</h1>
		</div>
	);
}
