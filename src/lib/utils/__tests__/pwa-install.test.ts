import { describe, it, expect, beforeEach, vi } from "vitest";
import {
	getBrowser,
	getOS,
	supportsNativeInstallPrompt,
	isSafariStandalone,
	getInstallMethod,
	getPwaInstallState,
	getBrowserName,
	getInstallInstructions,
	isInstallable,
} from "$lib/utils/pwa-install";

describe("PWA Install Utilities", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getBrowser()", () => {
		it("should detect Chrome", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
				configurable: true,
			});
			expect(getBrowser()).toBe("chrome");
		});

		it("should detect Edge", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59",
				configurable: true,
			});
			expect(getBrowser()).toBe("edge");
		});

		it("should detect Firefox", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
				configurable: true,
			});
			expect(getBrowser()).toBe("firefox");
		});

		it("should detect Safari", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
				configurable: true,
			});
			expect(getBrowser()).toBe("safari");
		});

		it("should detect Samsung Internet", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/91.0.4472.120 Mobile Safari/537.36",
				configurable: true,
			});
			expect(getBrowser()).toBe("samsung");
		});

		it("should return unknown for unrecognized browser", () => {
			Object.defineProperty(navigator, "userAgent", {
				value: "UnknownBrowser/1.0",
				configurable: true,
			});
			expect(getBrowser()).toBe("unknown");
		});
	});

	describe("getOS()", () => {
		it("should detect iOS", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1",
				configurable: true,
			});
			expect(getOS()).toBe("ios");
		});

		it("should detect Android", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
				configurable: true,
			});
			expect(getOS()).toBe("android");
		});

		it("should detect Windows", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				configurable: true,
			});
			expect(getOS()).toBe("windows");
		});

		it("should detect macOS", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
				configurable: true,
			});
			expect(getOS()).toBe("macos");
		});

		it("should detect Linux", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
				configurable: true,
			});
			expect(getOS()).toBe("linux");
		});

		it("should return unknown for unrecognized OS", () => {
			Object.defineProperty(navigator, "userAgent", {
				value: "UnknownOS/1.0",
				configurable: true,
			});
			expect(getOS()).toBe("unknown");
		});
	});

	describe("supportsNativeInstallPrompt()", () => {
		it("should return true for Chrome", () => {
			Object.defineProperty(navigator, "userAgent", {
				value: "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 Chrome/91.0",
				configurable: true,
			});
			expect(supportsNativeInstallPrompt()).toBe(true);
		});

		it("should return true for Edge", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Edg/91.0",
				configurable: true,
			});
			expect(supportsNativeInstallPrompt()).toBe(true);
		});

		it("should return true for Opera", () => {
			Object.defineProperty(navigator, "userAgent", {
				value: "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 OPR/77.0",
				configurable: true,
			});
			expect(supportsNativeInstallPrompt()).toBe(true);
		});

		it("should return true for Samsung Internet", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 SamsungBrowser/14.2",
				configurable: true,
			});
			expect(supportsNativeInstallPrompt()).toBe(true);
		});

		it("should return false for Safari", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/14.1.1 Safari/605.1.15",
				configurable: true,
			});
			expect(supportsNativeInstallPrompt()).toBe(false);
		});

		it("should return false for Firefox", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
				configurable: true,
			});
			expect(supportsNativeInstallPrompt()).toBe(false);
		});
	});

	describe("isSafariStandalone()", () => {
		it("should return false when navigator.standalone is undefined (jsdom)", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)",
				configurable: true,
			});
			// jsdom doesn't support navigator.standalone, so this returns false
			expect(isSafariStandalone()).toBe(false);
		});

		it("should return false for non-iOS browser", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0",
				configurable: true,
			});
			expect(isSafariStandalone()).toBe(false);
		});
	});

	describe("getInstallMethod()", () => {
		it("should return native-prompt for Chrome on Android", () => {
			Object.defineProperty(navigator, "userAgent", {
				value: "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 Chrome/91.0",
				configurable: true,
			});
			expect(getInstallMethod()).toBe("native-prompt");
		});

		it("should return ios-instructions for Safari on iOS", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1",
				configurable: true,
			});
			expect(getInstallMethod()).toBe("ios-instructions");
		});

		it("should return firefox-link for Firefox", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
				configurable: true,
			});
			expect(getInstallMethod()).toBe("firefox-link");
		});

		it("should return native-prompt for Samsung Internet (supports native)", () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 SamsungBrowser/14.2",
				configurable: true,
			});
			// Samsung Internet supports native prompt
			expect(getInstallMethod()).toBe("native-prompt");
		});

		it("should return none for unknown browser", () => {
			Object.defineProperty(navigator, "userAgent", {
				value: "UnknownBrowser/1.0",
				configurable: true,
			});
			expect(getInstallMethod()).toBe("none");
		});
	});

	describe("getPwaInstallState()", () => {
		it("should return complete install state", async () => {
			Object.defineProperty(navigator, "userAgent", {
				value: "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 Chrome/91.0",
				configurable: true,
			});
			const state = await getPwaInstallState();
			expect(state.browser).toBe("chrome");
			expect(state.os).toBe("android");
			expect(state.canInstall).toBe(true);
			expect(state.installMethod).toBe("native-prompt");
			expect(state.supportsNativePrompt).toBe(true);
		});

		it("should have canInstall true for Firefox because firefox-link is not none", async () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0",
				configurable: true,
			});
			const state = await getPwaInstallState();
			expect(state.canInstall).toBe(true);
			expect(state.installMethod).toBe("firefox-link");
		});
	});

	describe("getBrowserName()", () => {
		it("should return human-readable name for Chrome", () => {
			expect(getBrowserName("chrome")).toBe("Chrome");
		});

		it("should return human-readable name for Safari", () => {
			expect(getBrowserName("safari")).toBe("Safari");
		});

		it("should return human-readable name for Firefox", () => {
			expect(getBrowserName("firefox")).toBe("Firefox");
		});

		it("should return generic name for unknown", () => {
			expect(getBrowserName("unknown")).toBe("Your browser");
		});
	});

	describe("getInstallInstructions()", () => {
		it("should return null for native-prompt", () => {
			expect(getInstallInstructions("native-prompt")).toBeNull();
		});

		it("should return iOS instructions", () => {
			const instructions = getInstallInstructions("ios-instructions");
			expect(instructions).toContain("Share");
			expect(instructions).toContain("Home Screen");
		});

		it("should return Firefox instructions", () => {
			const instructions = getInstallInstructions("firefox-link");
			expect(instructions).toContain("Firefox");
		});

		it("should return Samsung instructions", () => {
			const instructions = getInstallInstructions("samsung-native");
			expect(instructions).toContain("menu");
		});

		it("should return fallback for none", () => {
			const instructions = getInstallInstructions("none");
			expect(instructions).toContain("mobile");
		});
	});

	describe("isInstallable()", () => {
		it("should return true for Chrome on Android", async () => {
			Object.defineProperty(navigator, "userAgent", {
				value: "Mozilla/5.0 (Linux; Android 11) AppleWebKit/537.36 Chrome/91.0",
				configurable: true,
			});
			const installable = await isInstallable();
			expect(installable).toBe(true);
		});

		it("should return false for Safari on macOS", async () => {
			Object.defineProperty(navigator, "userAgent", {
				value:
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/14.1.1 Safari/605.1.15",
				configurable: true,
			});
			const installable = await isInstallable();
			expect(installable).toBe(false);
		});
	});
});
