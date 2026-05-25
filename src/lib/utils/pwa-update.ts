/**
 * PWA Update Detection Utilities
 *
 * Provides update detection for PWA apps. Checks if a new build is available
 * and triggers reload when updates are found.
 */

import { compareVersions } from "./build-version";

const BUILD_VERSION_CHECK_URL = "/build-version.json";
// Check interval: 1 hour (used for scheduling checks)
// const UPDATE_CHECK_INTERVAL = 1000 * 60 * 60;
const DISMISS_UNTIL_KEY = "tmd_pwa_update_dismissed_until";

/**
 * Check if update banner should be shown based on dismissal state
 *
 * @returns true if banner should be shown
 */
export function shouldShowUpdateBanner(): boolean {
	const dismissedUntil = localStorage.getItem(DISMISS_UNTIL_KEY);
	if (!dismissedUntil) return true;
	return Date.now() > parseInt(dismissedUntil, 10);
}

/**
 * Dismiss update banner until next check interval
 *
 * @param hours - Hours to dismiss for (default 24)
 */
export function dismissUpdateBanner(hours: number = 24): void {
	const until = Date.now() + hours * 60 * 60 * 1000;
	localStorage.setItem(DISMISS_UNTIL_KEY, String(until));
}

/**
 * Fetch the remote build version from the server
 *
 * @returns Remote build timestamp/hash, or null on failure
 */
export async function fetchRemoteBuildVersion(): Promise<string | null> {
	try {
		const response = await fetch(BUILD_VERSION_CHECK_URL);
		if (!response.ok) return null;
		const data = await response.json();
		return data.timestamp || data.hash || null;
	} catch {
		return null;
	}
}

/**
 * Check for build version update
 *
 * @param skipBanner - If true, don't show banner even if update found
 * @returns true if update is available
 */
export async function checkForBuildVersion(
	skipBanner: boolean = false,
): Promise<boolean> {
	if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
		return false;
	}

	const remoteVersion = await fetchRemoteBuildVersion();
	if (!remoteVersion) return false;

	const currentVersion = import.meta.env.__BUILD_TIMESTAMP__ || "dev";
	const result = compareVersions(currentVersion, remoteVersion);

	if (result === "update-available") {
		if (!skipBanner) {
			window.dispatchEvent(new CustomEvent("pwa-update-available"));
		}
		return true;
	}

	return false;
}

/**
 * Check for update via service worker registration
 *
 * @param skipBanner - If true, don't show banner even if update found
 * @returns true if update is available
 */
export async function checkForUpdate(
	skipBanner: boolean = false,
): Promise<boolean> {
	if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
		return false;
	}

	try {
		const reg = await navigator.serviceWorker.getRegistration();
		if (!reg) return false;

		// Check if there's a waiting worker (update ready but not active)
		if (reg.waiting) {
			if (!skipBanner) {
				window.dispatchEvent(new CustomEvent("pwa-update-available"));
			}
			return true;
		}

		// Listen for updatefound event
		return new Promise<boolean>((resolve) => {
			reg.addEventListener("updatefound", () => {
				const newWorker = reg.installing;
				if (!newWorker) {
					resolve(false);
					return;
				}
				newWorker.addEventListener("statechange", () => {
					if (
						newWorker.state === "installed" &&
						navigator.serviceWorker.controller
					) {
						if (!skipBanner) {
							window.dispatchEvent(new CustomEvent("pwa-update-available"));
						}
						resolve(true);
					}
				});
			});

			// Timeout after 5 seconds
			setTimeout(() => resolve(false), 5000);
		});
	} catch {
		return false;
	}
}

/**
 * Setup service worker update listener
 */
export function setupUpdateListener(): void {
	if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

	navigator.serviceWorker.addEventListener("controllerchange", () => {
		// Service worker updated, reload the page
		window.location.reload();
	});
}

/**
 * Trigger reload with waiting service worker
 */
export function triggerReload(): void {
	if (typeof navigator === "undefined" || !("serviceWorker" in navigator))
		return;

	navigator.serviceWorker
		.getRegistration()
		.then((reg) => {
			if (reg?.waiting) {
				reg.waiting.postMessage({ type: "SKIP_WAITING" });
				window.location.reload();
			}
		})
		.catch(() => {
			// Fallback: reload anyway
			window.location.reload();
		});
}
