/**
 * PWA install prompt utilities.
 *
 * Tracks how many event detail pages the user has browsed.
 * Exposes the install prompt once threshold is reached (>= 2 events).
 */

const BROWSE_COUNT_KEY = 'tmd_event_browse_count';
const INSTALL_DISMISSED_KEY = 'tmd_install_dismissed';
const BROWSE_THRESHOLD = 2;

/** Increment the event browse counter. */
export function incrementBrowseCount(): void {
	try {
		const current = parseInt(localStorage.getItem(BROWSE_COUNT_KEY) ?? '0', 10);
		localStorage.setItem(BROWSE_COUNT_KEY, String(current + 1));
	} catch {
		// ignore
	}
}

/** Returns true if the user has browsed enough events to show the install prompt. */
export function shouldShowInstallPrompt(): boolean {
	try {
		const count = parseInt(localStorage.getItem(BROWSE_COUNT_KEY) ?? '0', 10);
		const dismissed = localStorage.getItem(INSTALL_DISMISSED_KEY) === '1';
		return count >= BROWSE_THRESHOLD && !dismissed;
	} catch {
		return false;
	}
}

/** Persist that the user dismissed the install prompt. */
export function dismissInstallPrompt(): void {
	try {
		localStorage.setItem(INSTALL_DISMISSED_KEY, '1');
	} catch {
		// ignore
	}
}
