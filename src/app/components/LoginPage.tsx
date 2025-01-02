"use client";

export default function LoginPage() {
	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<h1 className="text-4xl font-roboto">
				See Your Top Artists / Tracks On Spotify!
			</h1>
			<button
				className="py-3 px-12 rounded bg-spotify-green font-roboto font-medium mt-5"
				onClick={() => (window.location.href = "/api/auth")}
			>
				Login with Spotify
			</button>
		</div>
	);
}
