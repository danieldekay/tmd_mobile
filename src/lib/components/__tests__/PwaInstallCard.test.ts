import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import PwaInstallCard from "$lib/components/PwaInstallCard.svelte";
import PwaInstallInstructions from "$lib/components/PwaInstallInstructions.svelte";
import type { PwaInstallState } from "$lib/types/pwa";

describe("PwaInstallCard Component", () => {
	const mockPwaInstallState: PwaInstallState = {
		browser: "chrome",
		os: "android",
		canInstall: true,
		installMethod: "native-prompt",
		supportsNativePrompt: true,
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render when canInstall is true", () => {
		render(PwaInstallCard, {
			props: { pwaInstallState: mockPwaInstallState },
		});
		expect(screen.getByText("Install TMD Mobile")).toBeTruthy();
	});

	it("should not render when canInstall is false", () => {
		const state = { ...mockPwaInstallState, canInstall: false };
		const { container } = render(PwaInstallCard, {
			props: { pwaInstallState: state },
		});
		expect(container.querySelector(".pwa-install-card")).toBeFalsy();
	});

	it("should render native prompt button for native-prompt method", () => {
		render(PwaInstallCard, {
			props: {
				pwaInstallState: {
					...mockPwaInstallState,
					installMethod: "native-prompt",
				},
			},
		});
		expect(screen.getByText("Install Now")).toBeTruthy();
	});

	it("should render iOS instructions button for ios-instructions method", () => {
		render(PwaInstallCard, {
			props: {
				pwaInstallState: {
					...mockPwaInstallState,
					installMethod: "ios-instructions",
				},
			},
		});
		expect(screen.getByText("Add to Home Screen")).toBeTruthy();
	});

	it("should close card when close button is clicked", async () => {
		const { container } = render(PwaInstallCard, {
			props: { pwaInstallState: mockPwaInstallState },
		});
		const closeButton = container.querySelector(".btn-close");
		expect(closeButton).toBeTruthy();
		await fireEvent.click(closeButton!);
		// Card should be hidden after close
		expect(container.querySelector(".pwa-install-card")).toBeFalsy();
	});

	it("should call onDismiss callback when dismissed", async () => {
		const onDismiss = vi.fn();
		const { container } = render(PwaInstallCard, {
			props: {
				pwaInstallState: mockPwaInstallState,
				onDismiss,
			},
		});
		const closeButton = container.querySelector(".btn-close");
		await fireEvent.click(closeButton!);
		expect(onDismiss).toHaveBeenCalled();
	});

	it("should have proper accessibility attributes", () => {
		const { container } = render(PwaInstallCard, {
			props: { pwaInstallState: mockPwaInstallState },
		});
		const closeButton = container.querySelector(".btn-close");
		expect(closeButton?.getAttribute("aria-label")).toBeTruthy();
		const installButton = screen.getByText("Install Now");
		expect(installButton?.getAttribute("type")).toBe("button");
	});
});

describe("PwaInstallInstructions Modal", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should render modal when visible", () => {
		render(PwaInstallInstructions, {
			props: { method: "ios-instructions" },
		});
		expect(screen.getByText("Add to Home Screen")).toBeTruthy();
	});

	it("should have proper modal structure", () => {
		const { container } = render(PwaInstallInstructions, {
			props: { method: "ios-instructions" },
		});
		expect(container.querySelector(".modal-overlay")).toBeTruthy();
		expect(container.querySelector(".modal-container")).toBeTruthy();
		expect(container.querySelector('[role="dialog"]')).toBeTruthy();
	});

	it("should close modal when close button is clicked", async () => {
		const { container } = render(PwaInstallInstructions, {
			props: { method: "ios-instructions" },
		});
		const closeButton = container.querySelector(".btn-close");
		await fireEvent.click(closeButton!);
		// Modal should be hidden
		expect(container.querySelector(".modal-container")).toBeFalsy();
	});

	it("should close modal when Got it button is clicked", async () => {
		const { container } = render(PwaInstallInstructions, {
			props: { method: "ios-instructions" },
		});
		const gotItButton = screen.getByText("Got it");
		await fireEvent.click(gotItButton);
		// Modal should be hidden
		expect(container.querySelector(".modal-container")).toBeFalsy();
	});

	it("should call onClose callback when closed", async () => {
		const onClose = vi.fn();
		const { container } = render(PwaInstallInstructions, {
			props: { method: "ios-instructions", onClose },
		});
		const closeButton = container.querySelector(".btn-close");
		await fireEvent.click(closeButton!);
		expect(onClose).toHaveBeenCalled();
	});

	it("should have proper accessibility", () => {
		const { container } = render(PwaInstallInstructions, {
			props: { method: "ios-instructions" },
		});
		const dialog = container.querySelector('[role="dialog"]');
		expect(dialog?.getAttribute("aria-modal")).toBe("true");
		expect(dialog?.getAttribute("aria-labelledby")).toBe("modal-title");
	});
});
