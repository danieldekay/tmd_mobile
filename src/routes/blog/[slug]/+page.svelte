<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { TmdNotFoundError, getPost } from '$lib/api/tmd';
	import type { TmdPostDetail } from '$lib/types';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	const slug = $derived(page.params.slug ?? '');

	let post = $state<TmdPostDetail | null>(null);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);
	let notFound = $state(false);

	onMount(() => {
		void load(slug);
	});

	async function load(postSlug: string) {
		isLoading = true;
		errorMessage = null;
		notFound = false;
		try {
			post = await getPost(postSlug);
		} catch (err) {
			if (err instanceof TmdNotFoundError) {
				notFound = true;
			} else {
				errorMessage = err instanceof Error ? err.message : 'Could not load post.';
			}
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
	<title>{post ? `${post.title} - Blog` : 'Post'} - TMD Mobile</title>
</svelte:head>

{#if isLoading}
	<div class="panel animate-pulse space-y-4 p-5" aria-busy="true" aria-label="Loading post">
		<div class="bg-panel h-7 w-2/3 rounded"></div>
		<div class="bg-panel h-3 w-1/4 rounded"></div>
		<div class="bg-panel h-24 rounded"></div>
	</div>
{:else if notFound}
	<ErrorState title="Post not found" message="This post does not exist or has been removed." backHref={resolve('/blog')} backLabel="Back to Blog" />
{:else if errorMessage}
	<ErrorState accent title="Could not load post" message={errorMessage} onRetry={() => void load(slug)} />
{:else if post}
	<article class="space-y-5">
		<PageHeader eyebrow="Blog" title={post.title} subtitle={post.date ? formatDate(post.date) : undefined} />
		<div class="prose prose-sm max-w-none">
			<!-- Content from trusted TMD origin — WordPress sanitizes on save -->
			{@html post.content}
		</div>
	</article>
{/if}
