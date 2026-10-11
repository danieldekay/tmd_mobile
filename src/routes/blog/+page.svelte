<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { getWpPosts, type WpPostSummary } from '$lib/api/wp-core';
	import { sanitizeWpHtml } from '$lib/render/wp-html';

	let posts = $state<WpPostSummary[]>([]);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);
	let currentPage = $state(1);
	let totalPages = $state<number | undefined>();
	onMount(() => { void load(); });

	async function load() {
		isLoading = true;
		errorMessage = null;
		try {
			const result = await getWpPosts(20, currentPage);
			posts = result.items;
			totalPages = result.totalPages;
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Could not load articles.';
		} finally { isLoading = false; }
	}
	function changePage(next: number) {
		if (next < 1 || (totalPages !== undefined && next > totalPages)) return;
		currentPage = next;
		void load();
	}
	function formatDate(date: string) {
		const value = new Date(date);
		return Number.isNaN(value.getTime()) ? date :
			new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' }).format(value);
	}
</script>
<svelte:head>
	<title>Blog - TMD Mobile</title>
	<meta name="description" content="Read tango news and articles from the Tango Marathon Directory." />
</svelte:head>
<section class="space-y-5">
	<header>
		<p class="eyebrow">From the directory</p>
		<h1 class="font-display text-4xl font-bold">Blog</h1>
	</header>
	{#if isLoading}
		<p class="panel p-5 text-muted" aria-busy="true">Loading articles…</p>
	{:else if errorMessage}
		<div class="panel p-5" role="alert">
			<p class="font-semibold text-accent">Articles could not load</p>
			<p class="mt-2 text-sm text-muted">{errorMessage}</p>
			<button class="button-secondary mt-4" type="button" onclick={() => void load()}>Try again</button>
		</div>
	{:else if posts.length === 0}
		<p class="panel p-5 text-muted">No published articles found.</p>
	{:else}
		<ul class="grid gap-3">
			{#each posts as post (post.id)}
				<li class="panel p-5">
					<article>
						<p class="text-xs text-muted">{formatDate(post.date)}</p>
						<h2 class="font-display mt-1 text-2xl font-bold text-ink">
							<a class="text-primary hover:underline" href={resolve('/blog/[slug]', { slug: post.slug })}>{post.title.rendered.replace(/<[^>]*>/g, '')}</a>
						</h2>
						{#if post.excerpt?.rendered}
							<div class="mt-2 text-sm text-muted">{@html sanitizeWpHtml(post.excerpt.rendered)}</div>
						{/if}
						<a class="mt-3 inline-flex text-sm font-semibold text-primary" href={resolve('/blog/[slug]', { slug: post.slug })}>Read article →</a>
					</article>
				</li>
			{/each}
		</ul>
	{/if}
	{#if totalPages !== undefined && totalPages > 1}
		<nav class="flex items-center justify-between gap-3" aria-label="Blog pages">
			<button class="button-secondary" type="button" disabled={isLoading || currentPage <= 1} onclick={() => changePage(currentPage - 1)}>Previous</button>
			<p class="text-sm text-muted">Page {currentPage} of {totalPages}</p>
			<button class="button-secondary" type="button" disabled={isLoading || currentPage >= totalPages} onclick={() => changePage(currentPage + 1)}>Next</button>
		</nav>
	{/if}
</section>
