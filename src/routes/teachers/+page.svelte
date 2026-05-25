<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { getTeachers } from '$lib/api/tmd';
	import type { TmdTeacher } from '$lib/types';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import SkeletonList from '$lib/components/SkeletonList.svelte';

	let teachers = $state<TmdTeacher[]>([]);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);

	onMount(() => {
		void load();
	});

	async function load() {
		isLoading = true;
		errorMessage = null;
		try {
			teachers = await getTeachers();
		} catch (err) {
			errorMessage =
				err instanceof Error ? err.message : 'Could not load teachers from TMD Core.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Teachers - TMD Mobile</title>
</svelte:head>

<section class="space-y-5">
	<PageHeader eyebrow="Directory" title="Teachers" />

	{#if isLoading}
		<SkeletonList label="Loading teachers" />
	{:else if errorMessage}
		<ErrorState accent title="Could not load teachers" message={errorMessage} onRetry={() => void load()} />
	{:else if teachers.length === 0}
		<div class="panel p-5">
			<p class="text-ink/60">No teachers found.</p>
		</div>
	{:else}
		<ul class="grid gap-3">
			{#each teachers as teacher (teacher.id)}
				<li>
					<a
						class="panel hover:bg-panel/80 flex items-center justify-between p-4"
						href={resolve(`/teachers/${teacher.id}`)}
					>
						<div>
							<p class="text-ink font-semibold">{teacher.title}</p>
							{#if teacher.city || teacher.country}
								<p class="text-ink/60 mt-0.5 text-sm">
									{[teacher.city, teacher.country].filter(Boolean).join(', ')}
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
