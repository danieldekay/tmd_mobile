<script lang="ts">
	import { consentRequired, setConsent, getConsent } from '$lib/consent';
	import { onMount } from 'svelte';
	import { initializeMatomo } from '$lib/matomo';

	let bannerVisible = $state(false);

	onMount(() => {
		// Check if consent is required (first visit)
		if (consentRequired()) {
			bannerVisible = true;
		} else {
			// User has already given consent - initialize Matomo
			if (getConsent('analytics')) {
				void initializeMatomo();
			}
		}
	});

	function acceptConsent() {
		setConsent(true);
		bannerVisible = false;
		// Initialize Matomo after consent
		void initializeMatomo();
		// Dispatch custom event for any listeners
		dispatchEvent(new CustomEvent('consent-accepted'));
	}

	function rejectConsent() {
		setConsent(false);
		bannerVisible = false;
		// Dispatch custom event for any listeners
		dispatchEvent(new CustomEvent('consent-rejected'));
	}
</script>

{#if bannerVisible}
	<div
		class="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-ink bg-canvas p-4 shadow-lg"
		role="dialog"
		aria-live="polite"
		aria-label="Cookie consent"
	>
		<div class="mx-auto max-w-lg space-y-3">
			<p class="text-sm">
				We use cookies to analyze traffic and improve your experience. 
				<a href="/datenschutz" class="underline hover:text-primary">Learn more</a>
			</p>
			<div class="flex gap-2">
				<button
					onclick={acceptConsent}
					class="button-primary px-4 py-2 text-sm"
				>
					Accept
				</button>
				<button
					onclick={rejectConsent}
					class="button-secondary px-4 py-2 text-sm"
				>
					Reject
				</button>
			</div>
			<div class="text-right">
				<a href="/cookie-preferences" class="text-xs underline hover:text-primary">
					Cookie preferences
				</a>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes slide-up {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}
	.fixed.bottom-0 {
		animation: slide-up 0.3s ease-out;
	}
</style>