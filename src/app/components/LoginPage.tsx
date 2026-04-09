"use client";

import Image from "next/image";

export default function LoginPage() {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-10">
			<div className="pointer-events-none absolute -left-24 top-12 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

			<div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/15 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-sm md:p-10">
				<div className="mb-6 inline-flex h-14 w-14 items-center justify-center">
					<Image src="/assets/Spotify_Primary_Logo.png" width={30} height={30} alt="Spotify Logo" />
				</div>

				<h1 className="text-3xl font-bold leading-tight text-slate-100 md:text-4xl">
					Explore your Spotify listening trends.
				</h1>
				<p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
					See your top artists and tracks, then build curated playlists from your favorites.
				</p>

				<button
					className="mt-8 inline-flex w-full items-center justify-center rounded-full border border-emerald-200/60 bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all hover:-translate-y-0.5 hover:brightness-110"
					onClick={() => (window.location.href = "/api/auth")}
				>
					Login with Spotify
				</button>
			</div>
		</div>
	);
}
