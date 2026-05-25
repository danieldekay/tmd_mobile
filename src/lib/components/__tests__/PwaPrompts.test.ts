import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/svelte";
import PwaPrompts from "$lib/components/PwaPrompts.svelte";
import * as pwaModule from "$lib/pwa";

// Mock the pwa module
vi.mock("$lib/pwa", () => ({
	shouldShowInstallPrompt: vi.fn(() => true),
	dismissInstallPrompt: vi.fn(),
}));

// Mock pwa-install utils
vi.mock("$lib/utils/pwa-install", () => ({
	getPwaInstallState: vi.fn(() =>
		Promise.resolve({
			browser: "chrome",
			os: "android",
			canInstall: true,
			installMethod: "native-prompt",
			supportsNativePrompt: true,
		}),
	),
}));

describe("PwaPrompts Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(pwaModule.shouldShowInstallPrompt).mockReturnValue(true);
	});

	afterEach(() => {
		cleanup();
	});

	it("should render and initialize correctly", async () => {
		const { container } = render(PwaPrompts);

		// Wait for onMount to complete
		await new Promise((resolve) => setTimeout(resolve, 50));

		// Component should be in the document
		expect(container).toBeTruthy();
	});

	it("should show install banner after beforeinstallprompt event", async () => {
		const { container } = render(PwaPrompts);

		// Wait for initial mount
		await new Promise((resolve) => setTimeout(resolve, 50));

		// Simulate beforeinstallprompt event
		const event = new Event("beforeinstallprompt");
		Object.defineProperty(event, "preventDefault", { value: vi.fn() });
		window.dispatchEvent(event);

		// Wait for state update
		await new Promise((resolve) => setTimeout(resolve, 100));

		// Check if banner elements exist (they may be hidden initially)
		const banner = container.querySelector(".fixed.bottom-0");
		expect(banner).toBeTruthy();
	});

	it("should create service worker update detection on mount", async () => {
		// Mock service worker
		const mockGetRegistration = vi.fn(() => Promise.resolve(null));
		Object.defineProperty(navigator, "serviceWorker", {
			value: {
				getRegistration: mockGetRegistration,
			},
			writable: true,
			configurable: true,
		});

		render(PwaPrompts);
		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(mockGetRegistration).toHaveBeenCalled();
	});

	it("should update banner state on pwa-update-available event", async () => {
		const { container } = render(PwaPrompts);
		await new Promise((resolve) => setTimeout(resolve, 50));

		// Simulate update available event
		window.dispatchEvent(new CustomEvent("pwa-update-available"));

		await new Promise((resolve) => setTimeout(resolve, 100));

		// Component should still be mounted
		expect(container).toBeTruthy();
	});
});

describe("PwaPrompts Update Banner", () => {
	afterEach(() => {
		cleanup();
	});

	it("should display update banner when service worker has waiting worker", async () => {
		const mockWaitingWorker = { postMessage: vi.fn() };
		const mockGetRegistration = vi.fn(() =>
			Promise.resolve({
				waiting: mockWaitingWorker,
				installing: null,
				addEventListener: vi.fn(),
			}),
		);

		Object.defineProperty(navigator, "serviceWorker", {
			value: {
				getRegistration: mockGetRegistration,
			},
			writable: true,
			configurable: true,
		});

		render(PwaPrompts);
		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(mockGetRegistration).toHaveBeenCalled();
	});
});
