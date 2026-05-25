/**
 * PWA Installation Types & Interfaces
 *
 * This module defines types for PWA browser/OS detection,
 * install state tracking, and installation methods.
 */

/**
 * Browser type detection result
 * Represents which browser is currently running
 */
export type Browser =
	| "chrome"
	| "edge"
	| "opera"
	| "brave"
	| "firefox"
	| "safari"
	| "samsung"
	| "unknown";

/**
 * Operating system type detection result
 * Represents which OS the device is running
 */
export type OS = "ios" | "android" | "windows" | "macos" | "linux" | "unknown";

/**
 * Install method type
 * Represents the appropriate install flow for current browser/OS combo
 */
export type InstallMethod =
	| "native-prompt" // Chrome, Edge, Brave, Opera, Samsung: native beforeinstallprompt
	| "ios-instructions" // Safari on iOS: manual Add to Home Screen steps
	| "firefox-link" // Firefox: link to MDN docs (not yet supported natively)
	| "samsung-native" // Samsung Internet: native support
	| "none"; // No install support

/**
 * Complete PWA install state
 * Aggregates all detection results and readiness information
 */
export interface PwaInstallState {
	/** Detected browser type */
	browser: Browser;

	/** Detected operating system */
	os: OS;

	/** Whether app is installable on this device */
	canInstall: boolean;

	/** Appropriate install method for this browser/OS */
	installMethod: InstallMethod;

	/** Whether native beforeinstallprompt event is supported */
	supportsNativePrompt: boolean;

	/** Whether the app is already installed (standalone mode) */
	isInstalled?: boolean;
}
