<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { InstallMethod } from '$lib/types/pwa';
	import PwaInstallInstructionsIos from './PwaInstallInstructionsIos.svelte';
	import PwaInstallInstructionsFirefox from './PwaInstallInstructionsFirefox.svelte';
	import PwaInstallInstructionsSamsung from './PwaInstallInstructionsSamsung.svelte';

	interface Props {
		method?: InstallMethod;
		onClose?: () => void;
	}

	let { method = 'ios-instructions', onClose }: Props = $props();

	let isVisible = $state(true);

	onMount(() => {
		// Prevent body scroll when modal is open
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		// Handle Escape key
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				closeModal();
			}
		};

		document.addEventListener('keydown', handleEscape);

		return () => {
			document.body.style.overflow = originalOverflow;
			document.removeEventListener('keydown', handleEscape);
		};
	});

	function closeModal() {
		isVisible = false;
		onClose?.();
	}

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
</script>

{#if isVisible}
	<!-- Overlay -->
	<div
		class="modal-overlay"
		on:click={handleOverlayClick}
		role="presentation"
	></div>

	<!-- Modal -->
	<div
		class="modal-container"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<div class="modal-content">
			<div class="modal-header">
				<h2 id="modal-title">Add to Home Screen</h2>
				<button
					class="btn-close"
					on:click={closeModal}
					aria-label="Close instructions"
					type="button"
				>
					✕
				</button>
			</div>

			<div class="modal-body">
				{#if method === 'ios-instructions'}
					<PwaInstallInstructionsIos />
				{:else if method === 'firefox-link'}
					<PwaInstallInstructionsFirefox />
				{:else if method === 'samsung-native'}
					<PwaInstallInstructionsSamsung />
				{:else}
					<p>For install instructions, visit your browser settings.</p>
				{/if}
			</div>

			<div class="modal-footer">
				<button
					class="btn btn-secondary"
					on:click={closeModal}
					type="button"
				>
					Got it
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 999;
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.modal-container {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-height: 80vh;
		max-width: 600px;
		width: 90%;
		background: var(--color-surface, #ffffff);
		border-radius: 12px;
		z-index: 1000;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translate(-50%, calc(-50% + 20px));
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%);
		}
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	.modal-header {
		padding: 24px;
		border-bottom: 1px solid var(--color-border, #e5e7eb);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		flex-shrink: 0;
	}

	.modal-header h2 {
		font-size: 20px;
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

	.modal-body {
		overflow-y: auto;
		padding: 24px;
		flex: 1;
		color: var(--color-text-secondary, #666666);
		line-height: 1.6;
	}

	.modal-footer {
		padding: 16px 24px;
		border-top: 1px solid var(--color-border, #e5e7eb);
		flex-shrink: 0;
		display: flex;
		gap: 12px;
		justify-content: flex-end;
	}

	.btn {
		padding: 12px 24px;
		border-radius: 4px;
		border: none;
		font-size: 16px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 44px;
	}

	.btn-secondary {
		background: var(--color-primary, #e74c3c);
		color: white;
	}

	.btn-secondary:hover {
		background: var(--color-primary-dark, #c0392b);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.btn-secondary:active {
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.modal-overlay,
		.modal-container {
			animation: none;
		}

		.btn-secondary:hover {
			transform: none;
		}
	}

	@media (max-width: 480px) {
		.modal-container {
			max-height: 90vh;
			width: 95%;
			border-radius: 8px;
		}

		.modal-header {
			padding: 16px;
		}

		.modal-body {
			padding: 16px;
		}

		.modal-footer {
			padding: 12px 16px;
		}
	}
</style>
