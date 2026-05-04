// Client-side hooks — service worker registration
// SvelteKit auto-registers src/service-worker.ts via the Vite plugin, but we
// also register explicitly here so the scope and registration lifecycle are
// visible and controllable from the app entry point.

export async function init() {
	if (!('serviceWorker' in navigator)) return;

	try {
		const registration = await navigator.serviceWorker.register('/service-worker.js', {
			scope: '/',
			type: 'classic'
		});

		// Trigger update check on every page load so users get fresh SW quickly
		await registration.update().catch(() => {
			// Ignore update check failures (offline, etc.)
		});
	} catch {
		// SW registration failure is non-fatal — the app works without it
	}
}
