import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/svelte";
import NewsletterSignup from "$lib/components/NewsletterSignup.svelte";

// Singleton XHR instance — the component always gets this same object
class MockXhr {
	method: string | undefined;
	url: string | undefined;
	asyncFlag: boolean | undefined;
	headers: [string, string][] = [];
	body: string | undefined;
	_status = 200;
	onload: (() => void) | null = null;
	onerror: (() => void) | null = null;

	open(method: string, url: string, async = true) {
		this.method = method;
		this.url = url;
		this.asyncFlag = async;
	}
	setRequestHeader(key: string, value: string) {
		this.headers.push([key, value]);
	}
	get status() {
		return this._status;
	}
	set status(v: number) {
		this._status = v;
	}
	send(body: string) {
		this.body = body;
	}
}

let xhrInstance: MockXhr;

function XhrConstructor() {
	return xhrInstance;
}

beforeEach(() => {
	xhrInstance = new MockXhr();
	global.XMLHttpRequest =
		XhrConstructor as unknown as typeof window.XMLHttpRequest;
	vi.stubEnv("PUBLIC_SENDY_URL", "https://sendy.example.com");
	vi.stubEnv("PUBLIC_SENDY_LIST", "main");
});

afterEach(() => {
	vi.unstubAllEnvs();
});

// Helper to simulate XHR completion
function resolveXhr(status: number, isError = false) {
	xhrInstance.status = status;
	if (isError) {
		xhrInstance.onerror?.();
	} else {
		xhrInstance.onload?.();
	}
}

describe("NewsletterSignup Component", () => {
	it("should render email input and subscribe button", () => {
		render(NewsletterSignup);
		const input = screen.getByPlaceholderText("your@email.com");
		expect(input).toBeTruthy();
		const buttons = screen.getAllByRole("button");
		const subscribeBtn = buttons.find(
			(btn) => btn.textContent?.trim() === "Subscribe",
		);
		expect(subscribeBtn).toBeTruthy();
	});

	it("should show error when email is empty", async () => {
		render(NewsletterSignup);
		const buttons = screen.getAllByRole("button");
		const subscribeBtn = buttons.find(
			(btn) => btn.textContent?.trim() === "Subscribe",
		);
		await fireEvent.click(subscribeBtn!);
		expect(screen.getByText("Please enter your email.")).toBeTruthy();
	});

	it("should show error when email format is invalid", async () => {
		render(NewsletterSignup);
		const input = screen.getByPlaceholderText("your@email.com");
		await fireEvent.input(input, { target: { value: "not-an-email" } });
		const buttons = screen.getAllByRole("button");
		const subscribeBtn = buttons.find(
			(btn) => btn.textContent?.trim() === "Subscribe",
		);
		await fireEvent.click(subscribeBtn!);
		expect(
			screen.getByText("Please enter a valid email address."),
		).toBeTruthy();
	});

	it("should send XHR request when valid email is submitted", async () => {
		render(NewsletterSignup);
		const input = screen.getByPlaceholderText("your@email.com");
		await fireEvent.input(input, { target: { value: "test@example.com" } });
		const buttons = screen.getAllByRole("button");
		const subscribeBtn = buttons.find(
			(btn) => btn.textContent?.trim() === "Subscribe",
		);
		await fireEvent.click(subscribeBtn!);

		expect(xhrInstance.method).toBe("POST");
		expect(xhrInstance.url).toBe("https://sendy.example.com/subscribe");
		expect(xhrInstance.headers).toContainEqual([
			"Content-Type",
			"application/x-www-form-urlencoded",
		]);
		expect(xhrInstance.body).toContain("email=test%40example.com");
	});

	it("should show loading state during submission", async () => {
		render(NewsletterSignup);
		const input = screen.getByPlaceholderText("your@email.com");
		await fireEvent.input(input, { target: { value: "test@example.com" } });
		const buttons = screen.getAllByRole("button");
		const subscribeBtn = buttons.find(
			(btn) => btn.textContent?.trim() === "Subscribe",
		);
		await fireEvent.click(subscribeBtn!);

		expect(subscribeBtn).toBeDisabled();
	});

	it("should show success message on successful subscription", async () => {
		render(NewsletterSignup);
		const input = screen.getByPlaceholderText("your@email.com");
		await fireEvent.input(input, { target: { value: "test@example.com" } });
		const buttons = screen.getAllByRole("button");
		const subscribeBtn = buttons.find(
			(btn) => btn.textContent?.trim() === "Subscribe",
		);
		await fireEvent.click(subscribeBtn!);

		resolveXhr(200);

		await waitFor(() => {
			expect(screen.getByText("✓ Subscribed!")).toBeTruthy();
		});
	});

	it("should show error message on failed subscription", async () => {
		render(NewsletterSignup);
		const input = screen.getByPlaceholderText("your@email.com");
		await fireEvent.input(input, { target: { value: "test@example.com" } });
		const buttons = screen.getAllByRole("button");
		const subscribeBtn = buttons.find(
			(btn) => btn.textContent?.trim() === "Subscribe",
		);
		await fireEvent.click(subscribeBtn!);

		resolveXhr(500);

		await waitFor(() => {
			expect(
				screen.getByText("Subscription failed. Please try again."),
			).toBeTruthy();
		});
	});

	it("should show error on network failure", async () => {
		render(NewsletterSignup);
		const input = screen.getByPlaceholderText("your@email.com");
		await fireEvent.input(input, { target: { value: "test@example.com" } });
		const buttons = screen.getAllByRole("button");
		const subscribeBtn = buttons.find(
			(btn) => btn.textContent?.trim() === "Subscribe",
		);
		await fireEvent.click(subscribeBtn!);

		resolveXhr(0, true);

		await waitFor(() => {
			expect(
				screen.getByText("Network error. Please check your connection."),
			).toBeTruthy();
		});
	});

	it("should show error when Sendy is not configured", async () => {
		vi.stubEnv("PUBLIC_SENDY_URL", "");
		render(NewsletterSignup);
		const input = screen.getByPlaceholderText("your@email.com");
		await fireEvent.input(input, { target: { value: "test@example.com" } });
		const buttons = screen.getAllByRole("button");
		const subscribeBtn = buttons.find(
			(btn) => btn.textContent?.trim() === "Subscribe",
		);
		await fireEvent.click(subscribeBtn!);

		expect(screen.getByText("Newsletter is not configured.")).toBeTruthy();
	});

	it("should render unsubscribe button", () => {
		render(NewsletterSignup);
		const unsubscribeButton = screen.getByRole("button", {
			name: /Unsubscribe/i,
		});
		expect(unsubscribeButton).toBeTruthy();
	});

	it("should not show unsubscribe button after successful subscription", async () => {
		render(NewsletterSignup);
		const input = screen.getByPlaceholderText("your@email.com");
		await fireEvent.input(input, { target: { value: "test@example.com" } });
		const buttons = screen.getAllByRole("button");
		const subscribeBtn = buttons.find(
			(btn) => btn.textContent?.trim() === "Subscribe",
		);
		await fireEvent.click(subscribeBtn!);

		resolveXhr(200);

		await waitFor(() => {
			expect(
				screen.queryByRole("button", { name: /Unsubscribe/i }),
			).toBeFalsy();
		});
	});

	it("should redirect to Sendy unsubscribe URL", async () => {
		const originalLocation = window.location;
		Object.defineProperty(window, "location", {
			writable: true,
			value: { href: "http://localhost:3000/" },
		});

		try {
			render(NewsletterSignup);
			const input = screen.getByPlaceholderText("your@email.com");
			await fireEvent.input(input, { target: { value: "test@example.com" } });
			const unsubscribeButton = screen.getByRole("button", {
				name: /Unsubscribe/i,
			});
			await fireEvent.click(unsubscribeButton);

			expect(window.location.href).toContain(
				"https://sendy.example.com/unsubscribe",
			);
			expect(window.location.href).toContain("list=main");
			expect(window.location.href).toContain("email=test%40example.com");
		} finally {
			Object.defineProperty(window, "location", {
				value: originalLocation,
			});
		}
	});

	it("should apply custom className prop", () => {
		const { container } = render(NewsletterSignup, {
			props: { className: "custom-class" },
		});
		expect(container.querySelector(".custom-class")).toBeTruthy();
	});
});
