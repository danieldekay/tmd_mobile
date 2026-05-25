import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	shouldShowUpdateBanner,
	dismissUpdateBanner,
	fetchRemoteBuildVersion,
	checkForBuildVersion,
	checkForUpdate,
	setupUpdateListener,
	triggerReload,
} from "../pwa-update";

// Mock localStorage
const mockLocalStorage = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
};

// Mock fetch
const mockFetch = vi.fn();

// Mock navigator.serviceWorker
const mockServiceWorker = {
	addEventListener: vi.fn(),
	getRegistration: vi.fn(),
	postMessage: vi.fn(),
};

beforeEach(() => {
	vi.clearAllMocks();
	// Mock global objects
	global.localStorage = mockLocalStorage;
	global.fetch = mockFetch;
	(global as any).navigator = {
		serviceWorker: mockServiceWorker,
		userAgent: "Chrome/1.0",
	};
});

describe("shouldShowUpdateBanner", () => {
	it("should return true when no dismissal timestamp exists", () => {
		mockLocalStorage.getItem.mockReturnValue(null);
		expect(shouldShowUpdateBanner()).toBe(true);
	});

	it("should return false when dismissed within 24 hours", () => {
		const oneHourAgo = Date.now() - 60 * 60 * 1000;
		mockLocalStorage.getItem.mockReturnValue(oneHourAgo.toString());
		expect(shouldShowUpdateBanner()).toBe(false);
	});

	it("should return true when dismissed more than 24 hours ago", () => {
		const twoDaysAgo = Date.now() - 48 * 60 * 60 * 1000;
		mockLocalStorage.getItem.mockReturnValue(twoDaysAgo.toString());
		expect(shouldShowUpdateBanner()).toBe(true);
	});
});

describe("dismissUpdateBanner", () => {
	it("should store dismissal timestamp for 24 hours", () => {
		const now = Date.now();
		vi.spyOn(Date, "now").mockReturnValue(now);

		dismissUpdateBanner();

		const expectedTimestamp = now + 24 * 60 * 60 * 1000;
		mockLocalStorage.setItem.mockCalledWith(
			"tmd_pwa_update_dismissed_until",
			expectedTimestamp.toString(),
		);
	});

	it("should store dismissal timestamp for custom hours", () => {
		const now = Date.now();
		vi.spyOn(Date, "now").mockReturnValue(now);

		dismissUpdateBanner(12);

		const expectedTimestamp = now + 12 * 60 * 60 * 1000;
		mockLocalStorage.setItem.mockCalledWith(
			"tmd_pwa_update_dismissed_until",
			expectedTimestamp.toString(),
		);
	});
});

describe("fetchRemoteBuildVersion", () => {
	it("should return version from successful fetch", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce({
				timestamp: "2024-01-01T00:00:00.000Z",
				hash: "abc123",
			}),
		});

		const result = await fetchRemoteBuildVersion();
		expect(result).toBe("2024-01-01T00:00:00.000Z");
	});

	it("should return hash if timestamp not present", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce({
				hash: "abc123",
			}),
		});

		const result = await fetchRemoteBuildVersion();
		expect(result).toBe("abc123");
	});

	it("should return null on failed response", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			json: vi.fn(),
		});

		const result = await fetchRemoteBuildVersion();
		expect(result).toBeNull();
	});

	it("should return null on fetch error", async () => {
		mockFetch.mockRejectedValueOnce(new Error("Network error"));

		const result = await fetchRemoteBuildVersion();
		expect(result).toBeNull();
	});
});

describe("checkForBuildVersion", () => {
	beforeEach(() => {
		vi.spyOn(require("../build-version"), "BUILD_TIMESTAMP").mockReturnValue(
			"dev",
		);
	});

	it("should return false when serviceWorker not available", async () => {
		(global as any).navigator = { userAgent: "Chrome/1.0" };

		const result = await checkForBuildVersion();
		expect(result).toBe(false);
	});

	it("should return false when no remote version available", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce({}),
		});

		const result = await checkForBuildVersion();
		expect(result).toBe(false);
	});

	it("should return true when version mismatch found", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce({
				timestamp: "2024-01-02T00:00:00.000Z",
			}),
		});

		const result = await checkForBuildVersion();
		expect(result).toBe(true);
	});

	it("should return false when versions match", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: vi.fn().mockResolvedValueOnce({
				timestamp: "dev",
			}),
		});

		const result = await checkForBuildVersion();
		expect(result).toBe(false);
	});
});

describe("checkForUpdate", () => {
	it("should return false when serviceWorker not available", async () => {
		(global as any).navigator = { userAgent: "Chrome/1.0" };

		const result = await checkForUpdate();
		expect(result).toBe(false);
	});

	it("should return true when waiting service worker exists", async () => {
		const mockWaitingWorker = { state: "installed" };
		mockServiceWorker.getRegistration.mockResolvedValueOnce({
			waiting: mockWaitingWorker,
			installing: null,
		});

		const result = await checkForUpdate();
		expect(result).toBe(true);
	});

	it("should handle updatefound event correctly", async () => {
		const mockWorker = {
			state: "installing",
			addEventListener: vi.fn((event, callback) => {
				if (event === "statechange") {
					// Simulate state change after timeout
					setTimeout(() => {
						mockWorker.state = "installed";
						callback();
					}, 10);
				}
			}),
		};

		mockServiceWorker.getRegistration.mockResolvedValueOnce({
			waiting: null,
			installing: mockWorker,
			addEventListener: vi.fn(),
		});

		const result = await checkForUpdate();
		expect(result).toBe(true);
	});
});

describe("setupUpdateListener", () => {
	it("should set up controllerchange event listener", () => {
		setupUpdateListener();

		expect(mockServiceWorker.addEventListener).toHaveBeenCalledWith(
			"controllerchange",
			expect.any(Function),
		);
	});

	it("should not set up listener when serviceWorker not available", () => {
		(global as any).navigator = { userAgent: "Chrome/1.0" };

		setupUpdateListener();
		expect(mockServiceWorker.addEventListener).not.toHaveBeenCalled();
	});
});

describe("triggerReload", () => {
	it("should reload via service worker waiting message", () => {
		const mockWaitingWorker = { postMessage: vi.fn() };
		mockServiceWorker.getRegistration.mockResolvedValueOnce({
			waiting: mockWaitingWorker,
		});

		// Mock window.location.reload
		global.window.location = { reload: vi.fn() };

		triggerReload();

		expect(mockWaitingWorker.postMessage).toHaveBeenCalledWith({
			type: "SKIP_WAITING",
		});
		expect(window.location.reload).toHaveBeenCalled();
	});

	it("should fall back to direct reload when no waiting worker", () => {
		mockServiceWorker.getRegistration.mockResolvedValueOnce({
			waiting: null,
		});

		// Mock window.location.reload
		global.window.location = { reload: vi.fn() };

		triggerReload();

		expect(window.location.reload).toHaveBeenCalled();
	});
});
