/**
 * Reactive PWA Install State Store
 *
 * Provides a reactive Svelte 5 rune-based store for PWA install state.
 * Combines browser/OS detection with install readiness.
 */

import type { PwaInstallState, InstallMethod } from "$lib/types/pwa";
import {
	getBrowser,
	getOS,
	getInstallMethod,
	supportsNativeInstallPrompt,
	isSafariStandalone,
} from "./pwa-install";

// ── Reactive State ─────────────────────────────────────────────────────────────

let browser = $state<
	| "chrome"
	| "edge"
	| "opera"
	| "brave"
	| "firefox"
	| "safari"
	| "samsung"
	| "unknown"
>("unknown");
let os = $state<"ios" | "android" | "windows" | "macos" | "linux" | "unknown">(
	"unknown",
);
let canInstall = $state(false);
let installMethod = $state<InstallMethod>("none");
let supportsNativePrompt = $state(false);
let isInstalled = $state(false);

// ── Derived State ────────────────────────────────────────────────────────────

export const pwaInstallState = $derived<PwaInstallState>({
	browser,
	os,
	canInstall,
	installMethod,
	supportsNativePrompt,
});

// ── Initialization ───────────────────────────────────────────────────────────

/**
 * Initialize the install state by detecting browser/OS and checking installability.
 * Should be called once on app mount.
 */
export function initPwaInstallState(): void {
	if (typeof window === "undefined") return;

	browser = getBrowser() as typeof browser;
	os = getOS() as typeof os;
	installMethod = getInstallMethod();
	supportsNativePrompt = supportsNativeInstallPrompt();
	isInstalled = isSafariStandalone();
	canInstall = !isInstalled && installMethod !== "none";
}

/**
 * Refresh the install state (useful after user interaction or events).
 */
export function refreshPwaInstallState(): void {
	if (typeof window === "undefined") return;

	const wasInstalled = isInstalled;
	isInstalled = isSafariStandalone();

	// If app was just installed, update canInstall
	if (!wasInstalled && isInstalled) {
		canInstall = false;
	}
}

// ── Event Handlers ───────────────────────────────────────────────────────────

/**
 * Handle the beforeinstallprompt event.
 * Stores the event for later use and updates state.
 */
export function handleBeforeInstallPrompt(event: Event): void {
	event.preventDefault();
	// Store the event globally for use by requestInstall
	// @ts-expect-error setting deferredPrompt
	(window as Window & { deferredPrompt?: Event }).deferredPrompt = event;
}

/**
 * Handle the appinstalled event.
 * Updates state to reflect that the app is now installed.
 */
export function handleAppInstalled(): void {
	isInstalled = true;
	canInstall = false;
	// Clear the stored prompt
	(window as Window & { deferredPrompt?: Event }).deferredPrompt = undefined;
}

// ── Export Individual State Pieces ───────────────────────────────────────────

export {
	browser,
	os,
	canInstall,
	installMethod,
	supportsNativePrompt,
	isInstalled,
};
