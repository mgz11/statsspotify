/**
 * Function to read from localStorage with expiration handling
 * @param key
 * @param timeToLive
 * @returns null if
 *           - item is not found
 *           - item has expired
 *           - running on server
 * otherwise returns the cached data
 *
 */
export function getCache<T>(key: string, timeToLive: number): T | null {
	// Check if not running in a browser environment
	if (typeof window === "undefined") return null;

	try {
		const cachedItem = localStorage.getItem(key);
		if (!cachedItem) return null;

		const { data, timeStamp } = JSON.parse(cachedItem);
		// Check if the cached item has expired
		if (Date.now() - timeStamp > timeToLive) {
			localStorage.removeItem(key);
			return null;
		}

		return data as T;
	} catch (error) {
		console.error("Error getting cache:", error);
		return null;
	}
}

/**
 * Function to write to localStorage with a timestamp
 * @param key
 * @param data
 * @returns None
 */

export function setCache<T>(key: string, data: T): void {
	// Check if not running in a browser environment
	if (typeof window === "undefined") return;

	try {
		localStorage.setItem(key, JSON.stringify({ data, timeStamp: Date.now() }));
	} catch (error) {
		console.error("Error setting cache:", error);
	}
}

/**
 * Function to clear a specific item from localStorage
 * @param key
 * @returns None
 */

export function clearCache(key: string): void {
	// Check if not running in a browser environment
	if (typeof window === "undefined") return;

	try {
		localStorage.removeItem(key);
	} catch (error) {
		console.error("Error clearing cache:", error);
	}
}

/**
 * Function to clear all entries in localStoragae w/ specifc prefix
 * Used to invalidate Spotify or Last.fm related cached data
 * @param prefix
 * @returns None
 */
export function clearCachePrefix(prefix: string): void {
	// Check if not running in a browser environment
	if (typeof window === "undefined") return;

	try {
		Object.keys(localStorage).forEach((key) => {
			if (key.startsWith(prefix)) {
				localStorage.removeItem(key);
			}
		});
	} catch (error) {
		console.error("Error clearing items from cache", error);
	}
}
