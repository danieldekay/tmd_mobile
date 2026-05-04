<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getDj, TmdNotFoundError } from '$lib/api/tmd';
	import type { TmdDjDetail } from '$lib/types';

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
			<div class="bg-soft px-5 py-5">
				<div class="bg-muted/20 h-3 w-1/3 rounded"></div>
				<div class="bg-muted/20 mt-3 h-7 w-2/4 rounded"></div>
				<div class="bg-muted/20 mt-3 h-3 w-1/4 rounded"></div>
			</div>
		</div>
	{:else if isNotFound}
		<div class="panel p-5" role="alert">
			<p class="text-ink font-semibold">DJ not found</p>
			<p class="text-muted mt-1 text-sm">
				This DJ does not exist or may have been removed.
			</p>
			<a class="button-secondary mt-4 inline-flex text-sm" href={resolve('/djs')}>
				Browse all DJs
			</a>
		</div>
	{:else if errorMessage}
		<div class="panel border-accent p-5" role="alert">
			<p class="text-accent font-semibold">This DJ could not load</p>
			<p class="text-muted mt-1 text-sm">{errorMessage}</p>
			<button
				class="button-secondary mt-4 text-sm"
				type="button"
				onclick={() => void load()}
			>
				Try again
			</button>
		</div>
	{:else if dj}
		<article class="space-y-5">
			<div class="panel overflow-hidden">
				<div class="bg-primary px-5 py-5 text-white">
					<p class="eyebrow text-white/70">DJ</p>
					<h1 class="font-display mt-1 text-4xl font-bold">{dj.title}</h1>
					{#if dj.city || dj.country}
						<p class="mt-2 text-sm text-white/85">
							{[dj.city, dj.country].filter(Boolean).join(', ')}
						</p>
					{/if}
				</div>
			</div>

			{#if dj.bio}
				<section class="panel p-5" aria-labelledby="bio-heading">
					<h2 id="bio-heading" class="font-display text-2xl font-bold">Biography</h2>
					<p class="text-muted mt-3">{dj.bio}</p>
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
