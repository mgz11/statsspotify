"use client";

import Image from "next/image";
import { TopItem, TopItemsProps } from "@/lib/ui/types";
export default function TopItems({ items, searchType }: TopItemsProps) {
	if (items.length === 0) return null;

	const getImages = (item: TopItem) => {
		return searchType === "tracks" ? item.album?.images || [] : item.images || [];
	};

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col items-center">
			<h2 className="mb-5 text-center text-xl font-semibold md:text-2xl">
				Your Top {searchType.charAt(0).toUpperCase() + searchType.slice(1)}
			</h2>
			<ol className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{items.slice(0, 3).map((item, index) => {
					const images = getImages(item);
					const rankBadgeClass =
						index === 0
							? "border-amber-200 bg-amber-400/90 text-amber-950"
							: index === 1
								? "border-slate-100 bg-slate-300/90 text-slate-900"
								: "border-orange-200 bg-orange-500/90 text-orange-950";
					return (
						<li
							key={index}
							className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-b from-slate-800/90 to-slate-900/95 p-4 shadow-xl"
						>
							{images[0] && (
								<div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl">
									<p
										className={`absolute left-3 top-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-black shadow-md ${rankBadgeClass}`}
									>
										{index + 1}
									</p>
									<Image
										src={images[0].url}
										width={400}
										height={400}
										alt="Picture of the album/artist"
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
										priority
										unoptimized
									/>
								</div>
							)}
							<p className="text-base font-semibold text-slate-100 md:text-lg">{item.name}</p>
							{item.artists && searchType === "tracks" && (
								<p className="mt-1 line-clamp-2 text-sm text-slate-300">
									{item.artists.map((artist) => artist.name).join(", ")}
								</p>
							)}
							<a
								href={item.external_urls.spotify}
								target="_blank"
								rel="noopener noreferrer"
								className="mt-4 inline-flex w-fit rounded-full transition-colors hover:bg-emerald-500/35"
							>
								<Image
									src="/assets/Spotify_Primary_Logo.png"
									width={30}
									height={30}
									alt="Spotify logo that links to song / artist"
								/>
							</a>
						</li>
					);
				})}
			</ol>

			<ol className="flex w-full flex-col gap-3">
				{items.slice(3).map((item, index) => {
					const images = getImages(item);
					return (
						<li
							key={index + 3}
							className="flex items-center gap-3 rounded-xl border border-white/15 bg-gradient-to-r from-slate-800/80 to-slate-900/85 p-3 shadow-lg"
						>
							<p className="w-8 text-center text-base font-bold text-cyan-100">{index + 4}</p>
							{images[0] && (
								<div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
									<Image
										src={images[0].url}
										alt="Picture of the album/artist"
										fill
										className="object-cover"
										priority
										unoptimized
									/>
								</div>
							)}
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold text-slate-100 md:text-base">{item.name}</p>
								{item.artists && searchType === "tracks" && (
									<p className="truncate text-xs text-slate-300 md:text-sm">
										{item.artists.map((artist) => artist.name).join(", ")}
									</p>
								)}
							</div>
							<a
								href={item.external_urls.spotify}
								target="_blank"
								rel="noopener noreferrer"
								className="ml-auto inline-flex shrink-0 rounded-full transition-colors hover:bg-emerald-500/35"
							>
								<Image
									src="/assets/Spotify_Primary_Logo.png"
									width={26}
									height={26}
									alt="Spotify logo that links to song / artist"
								/>
							</a>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
