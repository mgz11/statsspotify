"use client";

interface Artist {
	name: string;
}

interface Item {
	name: string;
	artists?: Artist[]; // Optional, as some items might not have artists
}

interface TopItemsProps {
	items: Item[];
	searchType: string;
}
export default function TopItems({ items, searchType }: TopItemsProps) {
	if (items.length === 0) return null;
	return (
		<div>
			<h2 className="text-xl font-medium mb-4">
				Your Top {searchType.charAt(0).toUpperCase() + searchType.slice(1)}:
			</h2>
			<ul className="space-y-4">
				{items.map((item, index) => (
					<li key={index} className="p-4 bg-gray-500 rounded shadow">
						{item.name}
						{item.artists && (
							<p className="text-sm text-gray-600">
								{item.artists.map((artist) => artist.name).join(", ")}
							</p>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}
