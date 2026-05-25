import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/svelte";
import PwaUpdateBanner from "$lib/components/PwaUpdateBanner.svelte";
import * as pwaUpdateModule from "$lib/utils/pwa-update";

// Mock the pwa-update utils
vi.mock("$lib/utils/pwa-update", () => ({
	triggerReload: vi.fn(),
	dismissUpdateBanner: vi.fn(),
}));

describe("PwaUpdateBanner Component", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		cleanup();
	});

	it("should not show banner initially", () => {
		render(PwaUpdateBanner);

		// Banner should be hidden initially
		expect(screen.queryByText("New version available")).toBeFalsy();
	});

	it("should show banner when pwa-update-available event fires", async () => {
		render(PwaUpdateBanner);

		// Simulate update available event
		window.dispatchEvent(new CustomEvent("pwa-update-available"));

		await new Promise((resolve) => setTimeout(resolve, 50));

		// Banner should now be visible
		expect(screen.getByText("New version available")).toBeTruthy();
	});

	it("should have reload button that calls triggerReload", async () => {
		render(PwaUpdateBanner);

		// Trigger update
		window.dispatchEvent(new CustomEvent("pwa-update-available"));
		await new Promise((resolve) => setTimeout(resolve, 50));

		const reloadButton = screen.getByText("Reload");
		await fireEvent.click(reloadButton);

		expect(pwaUpdateModule.triggerReload).toHaveBeenCalled();
	});

	it("should have later button that dismisses banner", async () => {
		render(PwaUpdateBanner);

		// Trigger update
		window.dispatchEvent(new CustomEvent("pwa-update-available"));
		await new Promise((resolve) => setTimeout(resolve, 50));

		const laterButton = screen.getByText("Later");
		await fireEvent.click(laterButton);

		expect(pwaUpdateModule.dismissUpdateBanner).toHaveBeenCalled();
	});

	it("should call dismissUpdateBanner with 24 hours default", async () => {
		render(PwaUpdateBanner);

		// Trigger update
		window.dispatchEvent(new CustomEvent("pwa-update-available"));
		await new Promise((resolve) => setTimeout(resolve, 50));

		const laterButton = screen.getByText("Later");
		await fireEvent.click(laterButton);

		expect(pwaUpdateModule.dismissUpdateBanner).toHaveBeenCalledWith(24);
	});

	it("should have proper accessibility attributes", async () => {
		const { container } = render(PwaUpdateBanner);

		// Trigger update
		window.dispatchEvent(new CustomEvent("pwa-update-available"));
		await new Promise((resolve) => setTimeout(resolve, 50));

		const banner = container.querySelector('[role="status"]');
		expect(banner).toBeTruthy();
		expect(banner?.getAttribute("aria-live")).toBe("polite");
	});

	it("should use button styling classes", async () => {
		render(PwaUpdateBanner);

		// Trigger update
		window.dispatchEvent(new CustomEvent("pwa-update-available"));
		await new Promise((resolve) => setTimeout(resolve, 50));

		const reloadButton = screen.getByText("Reload");
		expect(reloadButton.classList.contains("button-primary")).toBeTruthy();
	});
});
