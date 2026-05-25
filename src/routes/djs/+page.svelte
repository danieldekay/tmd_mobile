<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { getDjs } from '$lib/api/tmd';
	import type { TmdDj } from '$lib/types';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';

	let djs = $state<TmdDj[]>([]);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);

	onMount(() => {
		void load();
	});

	async function load() {
		isLoading = true;
		errorMessage = null;
		try {
			djs = await getDjs();
		} catch (err) {
			errorMessage =
				err instanceof Error ? err.message : 'Could not load DJs from TMD Core.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>DJs - TMD Mobile</title>
</svelte:head>

<section class="space-y-5">
	<PageHeader eyebrow="Directory" title="DJs" />

	{#if isLoading}
		<SkeletonList label="Loading DJs" />
	{:else if errorMessage}
		<ErrorState accent title="Could not load DJs" message={errorMessage} onRetry={() => void load()} />
	{:else if djs.length === 0}
		<div class="panel p-5">
			<p class="text-ink/60">No DJs found.</p>
		</div>
	{:else}
		<ul class="grid gap-3">
			{#each djs as dj (dj.id)}
				<li>
					<a
						class="panel hover:bg-panel/80 flex items-center justify-between p-4"
						href={resolve(`/djs/${dj.id}`)}
					>
						<div>
							<p class="text-ink font-semibold">{dj.title}</p>
							{#if dj.city || dj.country}
								<p class="text-ink/60 mt-0.5 text-sm">
									{[dj.city, dj.country].filter(Boolean).join(', ')}
								</p>
							{/if}
						</div>
						<span class="text-primary" aria-hidden="true">→</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>

