<script lang="ts">
	import { onMount } from 'svelte';
	import { shouldShowInstallPrompt, dismissInstallPrompt } from '$lib/pwa';
	import { getPwaInstallState } from '$lib/utils/pwa-install';
	import type { PwaInstallState } from '$lib/types/pwa';
	import PwaInstallInstructions from './PwaInstallInstructions.svelte';

	// ── Types ──────────────────────────────────────────────────────────────────
	type BeforeInstallPromptEvent = Event & {
		prompt: () => Promise<void>;
		userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
	};

	// ── Install prompt state ───────────────────────────────────────────────────
	let installPromptEvent = $state<BeforeInstallPromptEvent | null>(null);
	let showInstallBanner = $state(false);
	let pwaInstallState = $state<PwaInstallState | null>(null);
	let showInstructionsModal = $state(false);

	// ── Update prompt state ────────────────────────────────────────────────────
	let showUpdateBanner = $state(false);
	let waitingWorker = $state<ServiceWorker | null>(null);

	onMount(() => {
		// Initialize PWA install state
		void getPwaInstallState().then((state) => {
			pwaInstallState = state;
		});

		// Install prompt — capture beforeinstallprompt
		const handleBeforeInstall = (e: Event) => {
			e.preventDefault();
			installPromptEvent = e as BeforeInstallPromptEvent;
			if (shouldShowInstallPrompt()) {
				showInstallBanner = true;
			}
		};
		window.addEventListener('beforeinstallprompt', handleBeforeInstall);

		// Service Worker update detection
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.getRegistration().then((reg) => {
				if (!reg) return;
				// Already a waiting worker?
				if (reg.waiting) {
					waitingWorker = reg.waiting;
					showUpdateBanner = true;
				}
				reg.addEventListener('updatefound', () => {
					const newWorker = reg.installing;
					if (!newWorker) return;
					newWorker.addEventListener('statechange', () => {
						if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
							waitingWorker = newWorker;
							showUpdateBanner = true;
						}
					});
				});
			}).catch(() => { /* ignore */ });
		}

		return () => {
			window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
		};
	});

	async function triggerInstall() {
		if (!installPromptEvent) return;
		await installPromptEvent.prompt();
		const { outcome } = await installPromptEvent.userChoice;
		if (outcome === 'accepted' || outcome === 'dismissed') {
			dismissInstallPrompt();
			showInstallBanner = false;
			installPromptEvent = null;
		}
	}

	function dismissInstall() {
		dismissInstallPrompt();
		showInstallBanner = false;
	}

	function openInstallInstructions() {
		showInstructionsModal = true;
	}

	function closeInstructions() {
		showInstructionsModal = false;
	}

	function applyUpdate() {
		if (!waitingWorker) return;
		waitingWorker.postMessage({ type: 'SKIP_WAITING' });
		showUpdateBanner = false;
		window.location.reload();
	}
</script>

{#if showInstructionsModal && pwaInstallState}
	<PwaInstallInstructions
		method={pwaInstallState.installMethod}
		onClose={closeInstructions}
	/>
{/if}

{#if showUpdateBanner}
	<!-- Update available banner -->
	<div
		class="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-ink bg-canvas p-4 shadow-panel"
		role="status"
		aria-live="polite"
	>
		<div class="flex items-center justify-between gap-4">
			<div>
				<p class="text-sm font-semibold text-ink">New version available</p>
				<p class="text-xs text-ink opacity-60">Reload to get the latest version.</p>
			</div>
			<div class="flex gap-2">
				<button
					type="button"
					class="px-3 py-2 text-xs text-ink opacity-60 hover:opacity-100"
					onclick={() => { showUpdateBanner = false; }}
				>
					Later
				</button>
				<button
					type="button"
					class="button-primary text-xs"
					onclick={applyUpdate}
				>
					Reload
				</button>
			</div>
		</div>
	</div>
{:else if showInstallBanner}
	<!-- Install prompt banner -->
	<div
		class="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-ink bg-canvas p-4 shadow-panel"
		role="status"
		aria-live="polite"
	>
		{#if pwaInstallState?.installMethod === 'native-prompt' && installPromptEvent}
			<!-- Native prompt supported -->
			<div class="flex items-center justify-between gap-4">
				<div>
					<p class="text-sm font-semibold text-ink">Install TMD Mobile</p>
					<p class="text-xs text-ink opacity-60">Add to your home screen for quick access.</p>
				</div>
				<div class="flex gap-2">
					<button
						type="button"
						class="px-3 py-2 text-xs text-ink opacity-60 hover:opacity-100"
						onclick={dismissInstall}
					>
						Not now
					</button>
					<button
						type="button"
						class="button-primary text-xs"
						onclick={() => void triggerInstall()}
					>
						Install
					</button>
				</div>
			</div>
		{:else if pwaInstallState && (pwaInstallState.installMethod === 'ios-instructions' || pwaInstallState.installMethod === 'firefox-link' || pwaInstallState.installMethod === 'samsung-native')}
			<!-- Platform-specific instructions -->
			<div class="flex items-center justify-between gap-4">
				<div>
					<p class="text-sm font-semibold text-ink">Install TMD Mobile</p>
					<p class="text-xs text-ink opacity-60">
						{pwaInstallState.installMethod === 'ios-instructions'
							? 'Add to Home Screen for iOS'
							: pwaInstallState.installMethod === 'samsung-native'
								? 'Add to Home Screen for Samsung'
								: 'Firefox support coming soon'}
					</p>
				</div>
				<div class="flex gap-2">
					<button
						type="button"
						class="px-3 py-2 text-xs text-ink opacity-60 hover:opacity-100"
						onclick={dismissInstall}
					>
						Not now
					</button>
					<button
						type="button"
						class="button-primary text-xs"
						onclick={openInstallInstructions}
					>
						{pwaInstallState.installMethod === 'firefox-link' ? 'Learn more' : 'Show how'}
					</button>
				</div>
			</div>
		{/if}
	</div>
{/if}
