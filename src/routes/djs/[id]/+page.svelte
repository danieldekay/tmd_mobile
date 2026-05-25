<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getDj, TmdNotFoundError } from '$lib/api/tmd';
	import type { TmdDjDetail } from '$lib/types';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';

	let dj = $state<TmdDjDetail | null>(null);
	let isLoading = $state(true);
	let isNotFound = $state(false);
	let errorMessage = $state<string | null>(null);

	const djId: string = $derived(page.params.id ?? '');

	onMount(() => {
		void load();
	});

	async function load() {
		if (!djId) {
			errorMessage = 'This DJ URL does not contain a valid ID.';
			isLoading = false;
			return;
		}

		isLoading = true;
		isNotFound = false;
		errorMessage = null;

		try {
			dj = await getDj(djId);
		} catch (err) {
			if (err instanceof TmdNotFoundError) {
				isNotFound = true;
			} else {
				errorMessage =
					err instanceof Error ? err.message : 'Could not load this DJ from TMD Core.';
			}
		} finally {
			isLoading = false;
		}
	}

	function openExternal(href: string) {
		globalThis.open(
			href,
			href.startsWith('mailto:') ? '_self' : '_blank',
			'noopener,noreferrer'
		);
	}
</script>

<svelte:head>
	<title>{dj ? `${dj.title} - TMD Mobile` : 'DJ - TMD Mobile'}</title>
</svelte:head>

<section class="space-y-5">
	<a class="text-primary text-sm font-semibold" href={resolve('/djs')}>← Back to DJs</a>

	{#if isLoading}
		<div class="panel animate-pulse overflow-hidden" aria-busy="true" aria-label="Loading DJ">
			<div class="bg-panel px-5 py-5">
				<div class="bg-ink/10 h-3 w-1/3 rounded"></div>
				<div class="bg-ink/10 mt-3 h-7 w-2/4 rounded"></div>
				<div class="bg-ink/10 mt-3 h-3 w-1/4 rounded"></div>
			</div>
		</div>
	{:else if isNotFound}
		<ErrorState title="DJ not found" message="No DJ exists with this ID." backHref={resolve('/djs')} backLabel="Back to DJs" />
	{:else if errorMessage}
		<ErrorState accent title="Could not load DJ" message={errorMessage} onRetry={() => void load()} />
	{:else if dj}
		<article class="space-y-5">
			<PageHeader eyebrow="DJ" title={dj.title} />

			{#if dj.bio}
				<section class="panel p-5" aria-labelledby="bio-heading">
					<h2 id="bio-heading" class="font-display text-2xl font-bold">Biography</h2>
					<p class="text-ink/60 mt-3">{dj.bio}</p>
				</section>
			{/if}

			{#if dj.socialLinks.length > 0}
				<section class="panel p-5" aria-labelledby="links-heading">
					<h2 id="links-heading" class="font-display text-2xl font-bold">Links</h2>
					<div class="mt-4 grid gap-3">
						{#each dj.socialLinks as link (link.label)}
							<button
								class="button-secondary"
								type="button"
								onclick={() => openExternal(link.href)}
							>
								{link.label}
							</button>
						{/each}
					</div>
				</section>
			{/if}
		</article>
	{/if}
</section>
