<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { getV4Teachers } from '$lib/api/tmd-v4';
	import type { TmdTeacher } from '$lib/types';

	let teachers = $state<TmdTeacher[]>([]);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);
	let currentPage = $state(1);
	let totalPages = $state<number | undefined>();

	onMount(() => { void load(); });
	async function load() {
		isLoading = true;
		errorMessage = null;
		try {
			const result = await getV4Teachers(50, currentPage);
			teachers = result.items;
			totalPages = result.totalPages;
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Could not load teachers.';
		} finally {
			isLoading = false;
		}
	}
	function changePage(next: number) {
		if (next < 1 || (totalPages !== undefined && next > totalPages)) return;
		currentPage = next;
		void load();
	}
</script>

<svelte:head>
	<title>Teachers - TMD Mobile</title>
	<meta name="description" content="Explore tango teachers connected to Tango Marathon Directory events." />
</svelte:head>

<section class="space-y-5">
	<header>
		<p class="eyebrow">Directory</p>
		<h1 class="font-display text-4xl font-bold">Teachers</h1>
		<p class="mt-2 text-sm text-muted">Teachers appearing in Tango Marathon Directory.</p>
	</header>
	{#if isLoading}
		<p class="panel p-5 text-muted" aria-busy="true">Loading teachers…</p>
	{:else if errorMessage}
		<div class="panel p-5" role="alert">
			<p class="font-semibold text-accent">Teachers could not load</p>
			<p class="mt-2 text-sm text-muted">{errorMessage}</p>
			<button class="button-secondary mt-4" type="button" onclick={() => void load()}>Try again</button>
		</div>
	{:else if teachers.length === 0}
		<p class="panel p-5 text-muted">No teachers found on this page.</p>
	{:else}
		<ul class="grid gap-3">
			{#each teachers as teacher (teacher.id)}
				<li>
					<a class="panel flex items-center justify-between p-4 hover:bg-soft/50" href={resolve(`/teachers/${teacher.id}`)}>
						<div>
							<p class="font-semibold text-ink">{teacher.title}</p>
							{#if teacher.city || teacher.country}
								<p class="mt-1 text-sm text-muted">{[teacher.city, teacher.country].filter(Boolean).join(', ')}</p>
							{/if}
						</div>
						<span class="text-primary" aria-hidden="true">→</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
	{#if totalPages !== undefined && totalPages > 1}
		<nav class="flex items-center justify-between gap-3" aria-label="Teacher pages">
			<button class="button-secondary" type="button" disabled={isLoading || currentPage <= 1} onclick={() => changePage(currentPage - 1)}>Previous</button>
			<p class="text-sm text-muted">Page {currentPage} of {totalPages}</p>
			<button class="button-secondary" type="button" disabled={isLoading || currentPage >= totalPages} onclick={() => changePage(currentPage + 1)}>Next</button>
		</nav>
	{/if}
</section>
