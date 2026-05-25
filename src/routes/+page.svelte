<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import PwaInstallCard from '$lib/components/PwaInstallCard.svelte';
	import { getPwaInstallState } from '$lib/utils/pwa-install';
	import { LANDING_FEATURES } from '$lib/data/landing-features';
	import type { PwaInstallState } from '$lib/types/pwa';
	import HeroSection from '$lib/components/landing/HeroSection.svelte';
	import FeaturesSection from '$lib/components/landing/FeaturesSection.svelte';
	import DirectorySection from '$lib/components/landing/DirectorySection.svelte';
	import ExploreSection from '$lib/components/landing/ExploreSection.svelte';

	let pwaInstallState: PwaInstallState | null = $state(null);

	onMount(async () => {
		pwaInstallState = await getPwaInstallState();
	});
</script>

<svelte:head>
	<title>TMD Mobile - Discover Tango Marathons</title>
	<meta
		name="description"
		content="Browse curated tango marathons, teachers, and DJs. Install the free PWA app for offline access and instant notifications."
	/>
	<meta name="theme-color" content="#e74c3c" />
	<meta property="og:title" content="TMD Mobile - Discover Tango Marathons" />
	<meta
		property="og:description"
		content="Browse curated tango marathons, teachers, and DJs. Install the free PWA app for offline access and instant notifications."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://mobile.tangomarathons.com/" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="TMD Mobile" />
	<meta name="twitter:description" content="Discover Tango Marathons" />
</svelte:head>

<main class="landing-page">
	<HeroSection eventsHref={resolve('/events')} />
	<FeaturesSection features={LANDING_FEATURES} />
	<DirectorySection />
	<section class="install-section">
		<PwaInstallCard {pwaInstallState} />
	</section>
	<ExploreSection eventsHref={resolve('/events')} />
</main>

<style>
	:global(:root) {
		--color-primary: #e74c3c;
		--color-primary-dark: #c0392b;
		--color-primary-light: #f4685a;
		--color-text: #1f2937;
		--color-text-secondary: #6b7280;
		--color-background: #ffffff;
		--color-background-secondary: #f9fafb;
		--color-surface: #ffffff;
		--color-border: #e5e7eb;
		--color-success: #27ae60;
	}

	.landing-page {
		display: flex;
		flex-direction: column;
		gap: 0;
		padding: 0;
		background: var(--color-background);
		animation: fadeIn 0.4s ease-out;
	}

	.install-section {
		background: var(--color-background-secondary);
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 60px 40px;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.landing-page {
			animation: none;
		}
	}
</style>
