<script lang="ts">
	import { onMount } from 'svelte';
	import { triggerReload, dismissUpdateBanner } from '$lib/utils/pwa-update';

	let visible = $state(false);

	onMount(() => {
		const handleUpdateAvailable = () => {
			visible = true;
		};

		window.addEventListener('pwa-update-available', handleUpdateAvailable);

		return () => {
			window.removeEventListener('pwa-update-available', handleUpdateAvailable);
		};
	});

	function handleReload() {
		triggerReload();
	}

	function handleLater() {
		dismissUpdateBanner(24);
		visible = false;
	}
</script>

{#if visible}
	<div
		class="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-ink bg-canvas p-4 shadow-panel"
		role="status"
		aria-live="polite"
	>
		<div class="flex items-center justify-between gap-4">
			<div>
				<p class="text-sm font-semibold text-ink">App update available</p>
				<p class="text-xs text-ink opacity-60">Reload to get the latest version.</p>
			</div>
			<div class="flex gap-2">
				<button
					type="button"
					class="px-3 py-2 text-xs text-ink opacity-60 hover:opacity-100"
					onclick={handleLater}
				>
					Later
				</button>
				<button
					type="button"
					class="button-primary text-xs"
					onclick={handleReload}
				>
					Reload
				</button>
			</div>
		</div>
	</div>
{/if}
