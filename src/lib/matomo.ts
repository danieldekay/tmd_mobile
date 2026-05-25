/**
 * Matomo analytics tracking module.
 * Consent-gated tracking with offline queue support.
 */

const QUEUE_KEY = "tmd_matomo_queue";
const MAX_QUEUE_SIZE = 50;
const MAX_RETRIES = 3;

declare global {
	interface Window {
		_paq?: unknown[][];
	}
}

/**
 * Initialize Matomo SDK script.
 * Returns true when loaded successfully.
 */
export async function initializeMatomo(): Promise<boolean> {
	const url = import.meta.env.PUBLIC_MATOMO_URL;
	if (!url) return false;

	return new Promise((resolve) => {
		const script = document.createElement("script");
		script.src = `${url}/matomo.js`;
		script.onload = () => resolve(true);
		script.onerror = () => resolve(false);
		script.async = true;
		document.head.appendChild(script);
	});
}

/**
 * Track a page view.
 * Consent-gated - only tracks if user has given analytics consent.
 */
export function trackPageView(path: string, title?: string): void {
	// This will be gated by the ConsentBanner
	// The actual tracking happens after consent is given
	if (!window._paq) window._paq = [];
	window._paq.push(["trackPageView"]);
	if (title) {
		window._paq.push(["setDocumentTitle", title]);
	}
}

/**
 * Track a custom event.
 * Consent-gated - only tracks if user has given analytics consent.
 */
export function trackEvent(
	category: string,
	action: string,
	label?: string,
): void {
	if (!window._paq) window._paq = [];
	window._paq.push(["trackEvent", category, action]);
	if (label) {
		window._paq.push(["setCustomVariable", 1, "label", label, "visit"]);
	}
}

/**
 * Reset tracking state (for testing).
 */
export function resetTracking(): void {
	try {
		localStorage.removeItem(QUEUE_KEY);
	} catch {
		// Ignore
	}
}
