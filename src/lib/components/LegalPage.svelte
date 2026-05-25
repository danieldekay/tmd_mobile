<script lang="ts">
	import { page } from '$app/state';

	let { title }: { title: string } = $props();
</script>

<svelte:head>
	<title>{title} &ndash; TMD Mobile</title>
	<meta name="description" content="Rechtliche Hinweise: {title}" />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mx-auto max-w-lg">
	<h1 class="mb-6 font-display text-2xl font-bold text-ink">{title}</h1>

	<slot />

	<div class="mt-6 rounded-control border-2 border-ink p-4">
		<div class="flex items-center justify-between border-b-2 border-ink pb-4">
			<a href="/" class="text-sm hover:text-primary">&larr; Home</a>

			<nav aria-label="Legal pages" class="flex gap-3 text-sm">
				{#if page.url.pathname !== '/impressum'}
					<a href="/impressum" class="underline hover:text-primary">Impressum</a>
				{/if}
				{#if page.url.pathname !== '/datenschutz'}
					<a href="/datenschutz" class="underline hover:text-primary">Datenschutz</a>
				{/if}
				{#if page.url.pathname !== '/cookie-richtlinie'}
					<a href="/cookie-richtlinie" class="underline hover:text-primary">Cookie-Richtlinie</a>
				{/if}
			</nav>
		</div>
	</div>
</div>

<style>
	@media print {
		nav,
		[aria-label='Legal pages'] {
			display: none;
		}
	}
</style>