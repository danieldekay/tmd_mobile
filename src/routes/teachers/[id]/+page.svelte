<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getV4Teacher, TmdV4ApiError } from '$lib/api/tmd-v4';
	import type { TmdTeacherDetail } from '$lib/types';

	const teacherId: string = $derived(page.params.id ?? '');
	let teacher = $state<TmdTeacherDetail | null>(null);
	let isLoading = $state(true);
	let isNotFound = $state(false);
	let errorMessage = $state<string | null>(null);

	onMount(() => { void load(); });
	async function load() {
		isLoading = true;
		isNotFound = false;
		errorMessage = null;
		try {
			if (!/^\d+$/.test(teacherId)) throw new TmdV4ApiError(404, '/teachers');
			teacher = await getV4Teacher(teacherId);
		} catch (error) {
			if (error instanceof TmdV4ApiError && error.status === 404) isNotFound = true;
			else errorMessage = error instanceof Error ? error.message : 'Teacher could not load.';
		} finally { isLoading = false; }
	}
</script>

<svelte:head>
	<title>{teacher ? `${teacher.title} - TMD Mobile` : 'Teacher - TMD Mobile'}</title>
</svelte:head>
<section class="space-y-5">
	<a class="text-sm font-semibold text-primary" href={resolve('/teachers')}>← Back to teachers</a>
	{#if isLoading}
		<p class="panel p-5 text-muted" aria-busy="true">Loading teacher…</p>
	{:else if isNotFound}
		<p class="panel p-5 text-muted" role="alert">Teacher not found.</p>
	{:else if errorMessage}
		<div class="panel p-5" role="alert">
			<p class="text-accent">{errorMessage}</p>
			<button class="button-secondary mt-4" type="button" onclick={() => void load()}>Try again</button>
		</div>
	{:else if teacher}
		<article class="space-y-5">
			<div class="panel overflow-hidden">
				<div class="bg-primary p-5 text-white">
					<p class="eyebrow text-white/70">Tango teacher</p>
					<h1 class="font-display mt-2 text-4xl font-bold">{teacher.title}</h1>
					{#if teacher.city || teacher.country}
						<p class="mt-2 text-white/85">{[teacher.city, teacher.country].filter(Boolean).join(', ')}</p>
					{/if}
				</div>
			</div>
			{#if teacher.bio}
				<section class="panel p-5">
					<h2 class="font-display text-2xl font-bold">About</h2>
					<p class="mt-3 whitespace-pre-wrap text-muted">{teacher.bio}</p>
				</section>
			{/if}
			{#if teacher.socialLinks.length > 0}
				<section class="panel p-5">
					<h2 class="font-display text-2xl font-bold">Links</h2>
					<ul class="mt-3 grid gap-2">
						{#each teacher.socialLinks as link (link.label)}
							<li><a class="button-secondary inline-flex" href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a></li>
						{/each}
					</ul>
				</section>
			{/if}
		</article>
	{/if}
</section>
