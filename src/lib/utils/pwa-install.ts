/**
 * PWA Install Utilities
 *
 * Provides browser/OS detection, install handling, and platform-specific guidance.
 * This module abstracts the complexity of different platform capabilities.
 */

import type {
	Browser,
	OS,
	InstallMethod,
	PwaInstallState,
} from "$lib/types/pwa";

/**
 * Detects the user's browser by parsing the user agent string
 *
 * @returns The detected browser type
 */
export function getBrowser(): Browser {
	if (typeof navigator === "undefined") return "unknown";

	const ua = navigator.userAgent;

	// Edge (Chromium) - must check before Chrome
	// Matches: Edge/91.0, Edg/91.0 (desktop & mobile), EdgiOS/14.0 (iOS)
	if (/Edg[eios]?\/|Edge\//i.test(ua)) return "edge";

	// Opera
	if (/OPR\//.test(ua)) return "opera";

	// Brave
	try {
		// @ts-expect-error navigator.brave might not be typed
		if (navigator.brave?.isBrave) {
			return "brave";
		}
	} catch {
		// ignore
	}

	// Samsung Internet
	if (/SamsungBrowser/.test(ua)) return "samsung";

	// Firefox
	if (/Firefox\//.test(ua)) return "firefox";

	// Safari (iOS or macOS) - must check before Chrome
	if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) return "safari";

	// Chrome (includes Chromium-based)
	if (/Chrome\//.test(ua)) return "chrome";

	return "unknown";
}

/**
 * Detects the user's operating system by parsing the user agent string
 *
 * @returns The detected OS type
 */
export function getOS(): OS {
	if (typeof navigator === "undefined") return "unknown";

	const ua = navigator.userAgent;

	// iOS (iPhone, iPad, iPod)
	if (/iPhone|iPad|iPod/.test(ua)) return "ios";

	// Android
	if (/Android/.test(ua)) return "android";

	// Windows
	if (/Windows NT/.test(ua)) return "windows";

	// macOS
	if (/Macintosh|Mac OS X/.test(ua)) return "macos";

	// Linux
	if (/Linux/.test(ua) && !/Android/.test(ua)) return "linux";

	return "unknown";
}

/**
 * Checks if the browser supports the native beforeinstallprompt event
 *
 * @returns true if native install prompt is supported
 */
export function supportsNativeInstallPrompt(): boolean {
	const browser = getBrowser();
	return ["chrome", "edge", "opera", "brave", "samsung"].includes(browser);
}

/**
 * Checks if the app is running as an installed standalone PWA on iOS
 *
 * This is used to hide install prompts for users who have already installed
 * the app via Add to Home Screen on Safari/iOS.
 *
 * @returns true if running as standalone PWA on iOS
 */
export function isSafariStandalone(): boolean {
	if (typeof navigator === "undefined" || typeof window === "undefined") {
		return false;
	}

	// Check for standalone mode (iOS Safari)
	// @ts-expect-error navigator.standalone is not standard but supported on iOS
	const isStandalone =
		navigator.standalone === true || window.navigator.standalone === true;

	// Verify we're on Safari and iOS
	const ua = navigator.userAgent;
	const isSafari = /Safari/.test(ua) && !/Chrome\//.test(ua);
	const isIos = /iPhone|iPad|iPod/.test(ua);

	return isStandalone && isSafari && isIos;
}

/**
 * Determines the appropriate install method for the current browser/OS combo
 *
 * @returns The install method to use
 */
export function getInstallMethod(): InstallMethod {
	const browser = getBrowser();
	const os = getOS();

	// Native prompt support (Chrome, Edge, Opera, Brave, Samsung)
	if (supportsNativeInstallPrompt()) {
		return "native-prompt";
	}

	// iOS Safari: manual Add to Home Screen instructions
	if (browser === "safari" && os === "ios") {
		return "ios-instructions";
	}

	// Firefox: link to documentation (native support coming)
	if (browser === "firefox") {
		return "firefox-link";
	}

	// Samsung Internet (in case not handled above)
	if (browser === "samsung") {
		return "samsung-native";
	}

	return "none";
}

/**
 * Aggregates all detection results into complete install state
 *
 * @returns Complete PWA install state
 */
export async function getPwaInstallState(): Promise<PwaInstallState> {
	const browser = getBrowser();
	const os = getOS();
	const installMethod = getInstallMethod();
	const supportsNative = supportsNativeInstallPrompt();
	const isStandalone = isSafariStandalone();

	return {
		browser,
		os,
		canInstall: !isStandalone && installMethod !== "none",
		installMethod,
		supportsNativePrompt: supportsNative,
	};
}

/**
 * Triggers the native install prompt (for Chromium browsers)
 *
 * Should only be called if getPwaInstallState().supportsNativePrompt is true.
 * The beforeinstallprompt event listener must have already fired and stored
 * the event in window.deferredPrompt.
 *
 * @returns true if user accepted, false otherwise
 */
export async function requestInstall(): Promise<boolean> {
	if (typeof window === "undefined") {
		return false;
	}

	// @ts-expect-error deferredPrompt is set by listener
	const deferredPrompt: BeforeInstallPromptEvent | null | undefined =
		window.deferredPrompt;

	if (!deferredPrompt) {
		console.warn("Install prompt not available");
		return false;
	}

	try {
		// Trigger the native install prompt UI
		await deferredPrompt.prompt();

		// Wait for user choice
		const { outcome } = await deferredPrompt.userChoice;

		// Clear the deferred prompt
		// @ts-expect-error setting deferredPrompt
		window.deferredPrompt = null;

		return outcome === "accepted";
	} catch (error) {
		console.error("Install prompt failed:", error);
		return false;
	}
}

/**
 * Sets up the beforeinstallprompt event listener
 *
 * This captures the native install prompt and stores it in window.deferredPrompt
 * for later use. Should be called early in app lifecycle (e.g., in +layout.svelte onMount).
 *
 * Dispatches a custom 'pwa-install-ready' event when ready.
 */
export function setupBeforeInstallPromptListener(): void {
	if (typeof window === "undefined") return;

	window.addEventListener("beforeinstallprompt", (event: Event) => {
		// Prevent the mini-infobar from appearing
		event.preventDefault();

		// Store the event for later use
		// @ts-expect-error setting deferredPrompt
		window.deferredPrompt = event as BeforeInstallPromptEvent;

		// Dispatch custom event so UI can react
		window.dispatchEvent(
			new CustomEvent("pwa-install-ready", { detail: { ready: true } }),
		);
	});
}

/**
 * Sets up the appinstalled event listener
 *
 * Listens for successful app installation and cleans up install prompts.
 * Should be called early in app lifecycle.
 */
export function setupAppInstalledListener(): void {
	if (typeof window === "undefined") return;

	window.addEventListener("appinstalled", () => {
		// Clear deferred prompt
		// @ts-expect-error setting deferredPrompt
		window.deferredPrompt = null;

		// Dispatch event for UI to hide install prompt
		window.dispatchEvent(new CustomEvent("pwa-installed"));
	});
}

/**
 * Returns human-readable browser name
 *
 * @param browser Browser type
 * @returns Human-readable name
 */
export function getBrowserName(browser: Browser): string {
	const names: Record<Browser, string> = {
		chrome: "Chrome",
		edge: "Microsoft Edge",
		opera: "Opera",
		brave: "Brave",
		firefox: "Firefox",
		safari: "Safari",
		samsung: "Samsung Internet",
		unknown: "Your browser",
	};

	return names[browser];
}

/**
 * Returns platform-specific install instructions as fallback text
 *
 * @param method Install method
 * @returns Instruction text or null if native prompt will be used
 */
export function getInstallInstructions(method: InstallMethod): string | null {
	const instructions: Record<InstallMethod, string | null> = {
		"native-prompt": null, // Handled by browser
		"ios-instructions":
			"Tap Share at the bottom of the screen, then scroll down and tap Add to Home Screen.",
		"firefox-link":
			"Firefox web app installation support is coming soon. Check your browser settings.",
		"samsung-native": "Tap the menu button, then tap Add to Home Screen.",
		none: "This app is optimized for mobile devices. For the best experience, please visit on a phone or tablet.",
	};

	return instructions[method] ?? null;
}

/**
 * Combined check: Is the app installable for this browser?
 *
 * @returns true if app can be installed
 */
export async function isInstallable(): Promise<boolean> {
	const state = await getPwaInstallState();
	return state.canInstall;
}
