"use client";

import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import Homepage from "./components/Homepage";

interface Profile {
	display_name: string;
}

export default function App() {
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setLoading(true);
				console.log("Fetching profile...");
				const response = await fetch("/api/spotify/profile");

				if (!response.ok) {
					throw new Error("Failed to fetch profile");
				}

				const data = await response.json();
				setProfile(data);
				console.log("Profile fetched:", data);
			} catch (error: unknown) {
				if (error instanceof Error) {
					console.error("Error fetching profile:", error.message);
				} else {
					console.error("Unexpected error:", error);
				}
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	return profile ? <Homepage profile={profile} /> : <LoginPage />;
}
