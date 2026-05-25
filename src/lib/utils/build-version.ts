/**
 * Build Version Utilities
 *
 * Provides build timestamp and hash for PWA update detection.
 * The BUILD_TIMESTAMP and BUILD_HASH are injected at build time via vite.config.ts.
 */

export const BUILD_TIMESTAMP = import.meta.env.__BUILD_TIMESTAMP__ || "dev";
export const BUILD_HASH = import.meta.env.__BUILD_HASH__ || "dev";

/**
 * Compare local and remote build versions
 *
 * @param current - Local build timestamp/hash
 * @param remote - Remote build timestamp/hash from server
 * @returns 'update-available' if versions differ, 'up-to-date' if same
 */
export function compareVersions(
	current: string,
	remote: string,
): "update-available" | "up-to-date" {
	if (current !== remote) return "update-available";
	return "up-to-date";
}
