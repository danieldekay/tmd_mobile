<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { TmdNotFoundError, getTeacher } from '$lib/api/tmd';
	import type { TmdTeacherDetail } from '$lib/types';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	const id = $derived(page.params.id ?? '');

	let teacher = $state<TmdTeacherDetail | null>(null);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);
	let notFound = $state(false);

	onMount(() => {
		void load(id);
	});

	async function load(teacherId: string) {
		isLoading = true;
		errorMessage = null;
		notFound = false;
		try {
			teacher = await getTeacher(teacherId);
		} catch (err) {
			if (err instanceof TmdNotFoundError) {
				notFound = true;
			} else {
				errorMessage = err instanceof Error ? err.message : 'Could not load teacher.';
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>{teacher ? `${teacher.title} - Teachers` : 'Teacher'} - TMD Mobile</title>
</svelte:head>

{#if isLoading}
	<div class="panel animate-pulse space-y-3 p-5" aria-busy="true" aria-label="Loading teacher">
		<div class="bg-panel h-6 w-2/3 rounded"></div>
		<div class="bg-panel h-4 w-1/3 rounded"></div>
	</div>
{:else if notFound}
	<ErrorState title="Teacher not found" message="No teacher exists with this ID." backHref={resolve('/teachers')} backLabel="Back to Teachers" />
{:else if errorMessage}
	<ErrorState accent title="Could not load teacher" message={errorMessage} onRetry={() => void load(id)} />
{:else if teacher}
	<article class="space-y-5">
		<PageHeader eyebrow="Teacher" title={teacher.title} subtitle={[teacher.city, teacher.country].filter(Boolean).join(', ') || undefined} />
	</article>
{/if}
