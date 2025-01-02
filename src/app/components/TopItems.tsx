"use client";

export default function TopItems({ items }) {
	if (items.length === 0) return null;
	return (
		<div>
			<h2 className="text-xl font-medium mb-4">Your Top Items:</h2>
			<ul className="space-y-4">
				{items.map((item, index) => (
					<li key={index} className="p-4 bg-gray-500 rounded shadow">
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
	);
}
