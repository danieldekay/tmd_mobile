<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { getWpPage, type WpPage } from '$lib/api/wp-core';
	import { sanitizeWpHtml } from '$lib/render/wp-html';

	const slug: string = $derived(page.params.slug ?? '');
	let contentPage = $state<WpPage | null>(null);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);

	onMount(() => { void load(); });
	async function load() {
		isLoading = true;
		errorMessage = null;
		try { contentPage = await getWpPage(slug) ?? null; }
		catch (error) { errorMessage = error instanceof Error ? error.message : 'Could not load this page.'; }
		finally { isLoading = false; }
	}
</script>
<svelte:head>
	<title>{contentPage ? `${contentPage.title.rendered.replace(/<[^>]*>/g, '')} - TMD Mobile` : 'Page - TMD Mobile'}</title>
</svelte:head>
<section class="space-y-5">
	<a class="text-sm font-semibold text-primary" href={resolve('/')}>← Home</a>
	{#if isLoading}
		<p class="panel p-5 text-muted" aria-busy="true">Loading page…</p>
	{:else if errorMessage}
		<div class="panel p-5" role="alert">
			<p class="text-accent">{errorMessage}</p>
			<button class="button-secondary mt-4" type="button" onclick={() => void load()}>Try again</button>
		</div>
	{:else if !contentPage}
		<p class="panel p-5 text-muted" role="alert">Page not found.</p>
	{:else}
		<article class="panel space-y-4 p-5">
			<h1 class="font-display text-4xl font-bold">{contentPage.title.rendered.replace(/<[^>]*>/g, '')}</h1>
			<div class="space-y-3 leading-relaxed text-ink">{@html sanitizeWpHtml(contentPage.content.rendered)}</div>
		</article>
	{/if}
</section>
