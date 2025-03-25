"use client";

import Image from "next/image";

interface Artist {
	name: string;
}

interface ImageType {
	url: string;
	height?: number;
	width?: number;
}

interface Album {
	images: ImageType[];
}

interface ExternalUrls {
	spotify: string;
}

interface Item {
	name: string;
	artists?: Artist[]; // Optional, as some items might not have artists
	album?: Album;
	images?: ImageType[];
	external_urls: ExternalUrls;
}

interface TopItemsProps {
	items: Item[];
	searchType: string;
}
export default function TopItems({ items, searchType }: TopItemsProps) {
	if (items.length === 0) return null;

	const getImages = (item: Item) => {
		return searchType === "tracks"
			? item.album?.images || []
			: item.images || [];
	};

	return (
		<div className="flex flex-col items-center">
			<h2 className="text-xl font-medium mb-4">
				Your Top {searchType.charAt(0).toUpperCase() + searchType.slice(1)}:
			</h2>
			<ul className="space-y-4 w-full">
				<div className="grid grid-cols-3 gap-4 mb-6 items-stretch">
					{items.slice(0, 3).map((item, index) => {
						const images = getImages(item);
						return (
							<li
								key={index}
								className="flex flex-col justify-between items-center text-center h-full list-none p-4 text-sm md:text-xl"
							>
								<div className="flex flex-col items-center">
									<p className="text-lg font-semibold mb-2">{index + 1}</p>
									{images[1] && (
										<Image
											src={images[0].url}
											width={images[0].width || 100}
											height={images[0].height || 100}
											alt="Picture of the album/artist"
											className="rounded shadow"
											quality={100} // force high quality
											priority // optional: load early
											unoptimized // optional: skip Next.js optimization if needed
										/>
									)}
									<p className="mt-2 text-center font-medium">{item.name}</p>
									{item.artists && searchType === "tracks" && (
										<p className="text-sm text-gray-600 text-center">
											{item.artists.map((artist) => artist.name).join(", ")}
										</p>
									)}
								</div>
								<a
									href={item.external_urls.spotify}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-4"
								>
									<Image
										src="/assets/Spotify_Primary_Logo.png"
										width={35}
										height={35}
										alt="Spotify logo that links to song / artist"
									/>
								</a>
							</li>
						);
					})}
				</div>
				<div className="flex flex-col space-y-4">
					{items.slice(3).map((item, index) => {
						const images = getImages(item);
						return (
							<li
								key={index + 3}
								className="flex items-center p-4 bg-gray-500 rounded shadow text-sm md:text-xl"
							>
								<p className="text-lg font-semibold mr-4 w-6 text-center">
									{index + 4}
								</p>
								{images[2] && (
									<div className="w-12 md:w-20 h-12 md:h-20 relative shrink-0 rounded shadow overflow-hidden">
										<Image
											src={images[0].url}
											alt="Picture of the album/artist"
											fill
											className="object-cover"
											quality={100} // force high quality
											priority // optional: load early
											unoptimized // optional: skip Next.js optimization if needed
										/>
									</div>
								)}
								<div className="ml-4">
									<p className="font-medium truncate w-24 md:w-full">
										{item.name}
									</p>
									{item.artists && searchType === "tracks" && (
										<p className="text-sm text-gray-600 truncate w-24 md:w-full">
											{item.artists.map((artist) => artist.name).join(", ")}
										</p>
									)}
								</div>
								<a
									href={item.external_urls.spotify}
									target="_blank"
									rel="noopener noreferrer"
									className="ml-auto shrink-0"
								>
									<Image
										src="/assets/Spotify_Primary_Logo.png"
										width={35}
										height={35}
										alt="Spotify logo that links to song / artist"
									/>
								</a>
							</li>
						);
					})}
				</div>
			</ul>
		</div>
	);
}
