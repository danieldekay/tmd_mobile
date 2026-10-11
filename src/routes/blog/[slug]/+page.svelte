<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { getWpPost, getWpMedia, type WpPostDetail, type WpMedia } from '$lib/api/wp-core';
	import { sanitizeWpHtml } from '$lib/render/wp-html';

	const slug: string = $derived(page.params.slug ?? '');
	let article = $state<WpPostDetail | null>(null);
	let media = $state<WpMedia | null>(null);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);

	onMount(() => { void load(); });
	async function load() {
		isLoading = true;
		errorMessage = null;
		try {
			article = await getWpPost(slug) ?? null;
			media = null;
			if (article?.featured_media) {
				try { media = await getWpMedia(article.featured_media); }
				catch { /* Editorial article can render without its image. */ }
			}
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Could not load this article.';
		} finally { isLoading = false; }
	}
</script>
<svelte:head>
	<title>{article ? `${article.title.rendered.replace(/<[^>]*>/g, '')} - TMD Mobile` : 'Article - TMD Mobile'}</title>
</svelte:head>
<section class="space-y-5">
	<a class="text-sm font-semibold text-primary" href={resolve('/blog')}>← Back to blog</a>
	{#if isLoading}
		<p class="panel p-5 text-muted" aria-busy="true">Loading article…</p>
	{:else if errorMessage}
		<div class="panel p-5" role="alert">
			<p class="text-accent">{errorMessage}</p>
			<button class="button-secondary mt-4" type="button" onclick={() => void load()}>Try again</button>
		</div>
	{:else if !article}
		<p class="panel p-5 text-muted" role="alert">Article not found.</p>
	{:else}
		<article class="panel overflow-hidden">
			{#if media}
				<img class="aspect-video w-full object-cover" src={media.media_details?.sizes?.large?.source_url ?? media.source_url} alt={media.alt_text ?? ''} loading="lazy" />
			{/if}
			<div class="space-y-4 p-5">
				<p class="text-sm text-muted">{article.date.slice(0, 10)}</p>
				<h1 class="font-display text-4xl font-bold">{article.title.rendered.replace(/<[^>]*>/g, '')}</h1>
				<div class="space-y-3 leading-relaxed text-ink">{@html sanitizeWpHtml(article.content.rendered)}</div>
			</div>
		</article>
	{/if}
</section>
