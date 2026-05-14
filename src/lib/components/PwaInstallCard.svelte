<script lang="ts">
	import { onMount } from 'svelte';
	import { requestInstall } from '$lib/utils/pwa-install';
	import type { PwaInstallState } from '$lib/types/pwa';
	import PwaInstallInstructions from './PwaInstallInstructions.svelte';
	import NewsletterSignup from './NewsletterSignup.svelte';

	interface Props {
		pwaInstallState?: PwaInstallState | null;
		onInstallClick?: () => void;
		onDismiss?: () => void;
	}

	let {
		pwaInstallState = $bindable(),
		onInstallClick,
		onDismiss,
	}: Props = $props();

	let isVisible = $state(true);
	let showInstructions = $state(false);
	let isLoading = $state(false);
	let successMessage = $state('');

	onMount(() => {
		// Set up custom event listeners for PWA install ready
		const handleInstallReady = () => {
			// Trigger a state re-fetch or update UI
		};

		const handleInstalled = () => {
			isVisible = false;
		};

		window.addEventListener('pwa-install-ready', handleInstallReady);
		window.addEventListener('pwa-installed', handleInstalled);

		return () => {
			window.removeEventListener('pwa-install-ready', handleInstallReady);
			window.removeEventListener('pwa-installed', handleInstalled);
		};
	});

	async function handleInstall() {
		isLoading = true;
		onInstallClick?.();

		try {
			const success = await requestInstall();
			if (success) {
				successMessage = '✓ App installed! Check your home screen.';
				setTimeout(() => {
					isVisible = false;
					successMessage = '';
				}, 2000);
			}
		} catch (error) {
			console.error('Install failed:', error);
		} finally {
			isLoading = false;
		}
	}

	function dismissCard() {
		isVisible = false;
		onDismiss?.();
	}
</script>

{#if isVisible && pwaInstallState?.canInstall}
	<div class="pwa-install-card">
		<div class="pwa-card-header">
			<h3>Install TMD Mobile</h3>
			<button
				class="btn-close"
				onclick={dismissCard}
				aria-label="Close install card"
				type="button"
			>
				✕
			</button>
		</div>

		<div class="pwa-card-content">
			<NewsletterSignup className="mt-4" />
			{#if successMessage}
				<p class="success-message">{successMessage}</p>
			{:else if pwaInstallState.installMethod === 'native-prompt'}
				<p>Get instant access to tango marathons on your home screen.</p>
				<button
					class="btn btn-primary"
					onclick={handleInstall}
					disabled={isLoading}
					type="button"
				>
					{#if isLoading}
						Installing...
					{:else}
						Install Now
					{/if}
				</button>
			{:else if pwaInstallState.installMethod === 'ios-instructions'}
				<p>Add TMD Mobile to your home screen for quick access.</p>
				<button
					class="btn btn-primary"
					onclick={() => (showInstructions = true)}
					type="button"
				>
					Add to Home Screen
				</button>
			{:else if pwaInstallState.installMethod === 'firefox-link'}
				<p>Install support is coming to Firefox. In the meantime, you can use TMD Mobile in your browser.</p>
			{:else}
				<p>This app works best when installed on your device.</p>
			{/if}
		</div>
	</div>
{/if}

{#if showInstructions && pwaInstallState}
	<PwaInstallInstructions
		method={pwaInstallState.installMethod}
		onClose={() => (showInstructions = false)}
	/>
{/if}

<style>
	.pwa-install-card {
		background: var(--color-surface, #ffffff);
		border: 1px solid var(--color-border, #e5e7eb);
		border-radius: 8px;
		padding: 24px;
		max-width: 600px;
		width: 100%;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.pwa-card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
		gap: 8px;
	}

	.pwa-card-header h3 {
		font-size: 18px;
		font-weight: 600;
		margin: 0;
		color: var(--color-text, #000000);
	}

	.btn-close {
		background: none;
		border: none;
		font-size: 20px;
		cursor: pointer;
		color: var(--color-text-secondary, #666666);
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: color 0.2s ease;
	}

	.btn-close:hover {
		color: var(--color-text, #000000);
	}

	.pwa-card-content {
		margin-top: 12px;
	}

	.pwa-card-content p {
		font-size: 14px;
		line-height: 1.6;
		margin: 0 0 16px 0;
		color: var(--color-text-secondary, #666666);
	}

	.btn {
		padding: 12px 24px;
		border-radius: 4px;
		border: none;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-primary {
		background: var(--color-primary, #e74c3c);
		color: white;
		width: 100%;
		min-height: 48px;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--color-primary-dark, #c0392b);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.btn-primary:active:not(:disabled) {
		transform: translateY(0);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.success-message {
		color: var(--color-success, #27ae60);
		font-weight: 500;
		margin-bottom: 0 !important;
	}

	@media (prefers-reduced-motion: reduce) {
		.pwa-install-card {
			animation: none;
		}

		.btn-primary:hover:not(:disabled) {
			transform: none;
		}
	}

	@media (max-width: 480px) {
		.pwa-install-card {
			border-radius: 0;
			margin: 0 -24px;
			padding: 16px;
		}
	}
</style>
