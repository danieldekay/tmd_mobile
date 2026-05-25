/**
 * Consent management module for privacy/GDPR compliance.
 * Handles storage, retrieval, and gating of user consent preferences.
 */

const CONSENT_KEY = "tmd_consent";
const CONSENT_VERSION = 1;

export interface ConsentState {
	analytics: boolean;
	timestamp: string;
	version: number;
}

/**
 * Get consent status for a specific category.
 * Synchronous - reads from localStorage.
 */
export function getConsent(
	key: keyof Omit<ConsentState, "timestamp" | "version">,
): boolean {
	try {
		const stored = localStorage.getItem(CONSENT_KEY);
		if (!stored) return false;
		const consent: ConsentState = JSON.parse(stored);
		return consent[key] === true;
	} catch {
		return false;
	}
}

/**
 * Set consent state for analytics.
 * Persists to localStorage.
 */
export function setConsent(value: boolean): void {
	try {
		const stored = localStorage.getItem(CONSENT_KEY);
		const consent: ConsentState = stored
			? JSON.parse(stored)
			: {
					analytics: false,
					timestamp: "",
					version: CONSENT_VERSION,
				};
		consent.analytics = value;
		consent.timestamp = new Date().toISOString();
		consent.version = CONSENT_VERSION;
		localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
	} catch {
		// Silently fail if localStorage is unavailable
	}
}

/**
 * Check if consent is required (first visit with no recorded consent).
 * Returns true if user hasn't made a choice yet.
 */
export function consentRequired(): boolean {
	try {
		const stored = localStorage.getItem(CONSENT_KEY);
		if (!stored) return true;
		const consent: ConsentState = JSON.parse(stored);
		// Consent required if timestamp is missing (legacy)
		return !consent.timestamp;
	} catch {
		return true;
	}
}

/**
 * Get full consent state object.
 */
export function getConsentState(): ConsentState | null {
	try {
		const stored = localStorage.getItem(CONSENT_KEY);
		if (!stored) return null;
		return JSON.parse(stored);
	} catch {
		return null;
	}
}

/**
 * Reset all consent (for testing or user request).
 */
export function resetConsent(): void {
	try {
		localStorage.removeItem(CONSENT_KEY);
	} catch {
		// Silently fail
	}
}
