// See https://svelte.dev/docs/kit/types#app.d.ts

interface ImportMetaEnv {
	readonly PUBLIC_TMD_API_BASE_URL?: string;
	readonly PUBLIC_SSO_INITIATION_URL?: string;
	readonly PUBLIC_SSO_EXCHANGE_URL?: string;
	readonly __BUILD_TIMESTAMP__?: string;
	readonly __BUILD_HASH__?: string;
}

/**
 * BeforeInstallPromptEvent interface for PWA install prompt
 * Dispatched before native install UI is shown (Chrome, Edge, Opera, Brave, Samsung)
 */
interface BeforeInstallPromptEvent extends Event {
	/**
	 * Triggers the browser's native install prompt UI
	 */
	prompt(): Promise<void>;

	/**
	 * Returns a promise that resolves with the user's choice
	 */
	userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
	const __APP_VERSION__: string;
	const __BUILD_HASH__: string;

	interface Window {
		/**
		 * Deferred install prompt event (set by beforeinstallprompt listener)
		 * Used to trigger native install on user action
		 */
		deferredPrompt?: BeforeInstallPromptEvent | null;
	}

	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
