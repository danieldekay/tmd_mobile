<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { TmdNotFoundError, getPage } from '$lib/api/tmd';
	import type { TmdPage } from '$lib/types';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	const slug = $derived(page.params.slug ?? '');

	let wpPage = $state<TmdPage | null>(null);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);
	let notFound = $state(false);

	onMount(() => {
		void load(slug);
	});

	async function load(pageSlug: string) {
		isLoading = true;
		errorMessage = null;
		notFound = false;
		try {
			wpPage = await getPage(pageSlug);
		} catch (err) {
			if (err instanceof TmdNotFoundError) {
				notFound = true;
			} else {
				errorMessage = err instanceof Error ? err.message : 'Could not load page.';
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>{wpPage ? wpPage.title : 'Page'} - TMD Mobile</title>
</svelte:head>

{#if isLoading}
	<div class="panel animate-pulse space-y-4 p-5" aria-busy="true" aria-label="Loading page">
		<div class="bg-panel h-7 w-2/3 rounded"></div>
		<div class="bg-panel h-24 rounded"></div>
	</div>
{:else if notFound}
	<ErrorState title="Page not found" message="This page does not exist or has been removed." backHref={resolve('/')} backLabel="Back to Home" />
{:else if errorMessage}
	<ErrorState accent title="Could not load page" message={errorMessage} onRetry={() => void load(slug)} />
{:else if wpPage}
	<article class="space-y-5">
		<PageHeader eyebrow="Info" title={wpPage.title} />
		<div class="prose prose-sm max-w-none">
			<!-- Content from trusted TMD origin — WordPress sanitizes on save -->
			{@html wpPage.content}
		</div>
	</article>
{/if}
