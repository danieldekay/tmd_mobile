<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { getDjs } from '$lib/api/tmd';
	import type { TmdDj } from '$lib/types';

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
	<div>
		<p class="eyebrow">Directory</p>
		<h1 class="font-display text-4xl font-bold">DJs</h1>
	</div>

	{#if isLoading}
		<ul class="grid gap-3" aria-busy="true" aria-label="Loading DJs">
			{#each { length: 6 } as _, i (i)}
				<li class="panel animate-pulse p-4">
					<div class="bg-soft h-4 w-1/2 rounded"></div>
					<div class="bg-soft mt-2 h-3 w-1/3 rounded"></div>
				</li>
			{/each}
		</ul>
	{:else if errorMessage}
		<div class="panel p-5" role="alert">
			<p class="text-accent font-semibold">Could not load DJs</p>
			<p class="text-muted mt-1 text-sm">{errorMessage}</p>
			<button class="button-secondary mt-4 text-sm" type="button" onclick={() => void load()}>
				Try again
			</button>
		</div>
	{:else if djs.length === 0}
		<div class="panel p-5">
			<p class="text-muted">No DJs found.</p>
		</div>
	{:else}
		<ul class="grid gap-3">
			{#each djs as dj (dj.id)}
				<li>
					<a
						class="panel hover:bg-soft/50 flex items-center justify-between p-4"
						href={resolve(`/djs/${dj.id}`)}
					>
						<div>
							<p class="text-ink font-semibold">{dj.title}</p>
							{#if dj.city || dj.country}
								<p class="text-muted mt-0.5 text-sm">
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

