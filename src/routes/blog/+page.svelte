<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { getPosts } from '$lib/api/tmd';
	import type { TmdPost } from '$lib/types';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';

	let posts = $state<TmdPost[]>([]);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);

	onMount(() => {
		void load();
	});

	async function load() {
		isLoading = true;
		errorMessage = null;
		try {
			posts = await getPosts(20);
		} catch (err) {
			errorMessage =
				err instanceof Error ? err.message : 'Could not load posts from the server.';
		} finally {
			isLoading = false;
		}
	}

	function formatDate(iso?: string): string {
		if (!iso) return '';
		return new Date(iso).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Blog - TMD Mobile</title>
</svelte:head>

<section class="space-y-5">
	<PageHeader eyebrow="News" title="Blog" />

	{#if isLoading}
		<SkeletonList count={4} label="Loading posts" variant="post" />
	{:else if errorMessage}
		<ErrorState accent title="Could not load blog posts" message={errorMessage} onRetry={() => void load()} />
	{:else if posts.length === 0}
		<div class="panel p-5">
			<p class="text-ink/60">No posts found.</p>
		</div>
	{:else}
		<ul class="grid gap-4">
			{#each posts as post (post.id)}
				<li>
					<a
						class="panel hover:bg-panel/80 block p-4"
						href={resolve(`/blog/${post.slug}`)}
					>
						<p class="text-ink font-semibold">{post.title}</p>
						{#if post.date}
							<p class="text-ink/50 mt-0.5 text-xs">{formatDate(post.date)}</p>
						{/if}
						{#if post.excerpt}
							<p class="text-ink/70 mt-2 text-sm">{post.excerpt}</p>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>
