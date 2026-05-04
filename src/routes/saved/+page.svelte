<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { getSavedIds, initSavedEvents } from '$lib/saved-events';
	import { initAuth } from '$lib/auth';
	import { getEvents } from '$lib/api/tmd';
	import type { TmdEventSummary } from '$lib/types';
	import SaveToggle from '$lib/components/SaveToggle.svelte';

	let savedIds = $state<number[]>([]);
	let events = $state<TmdEventSummary[]>([]);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);

	onMount(async () => {
		// Ensure auth and server-synced IDs are available regardless of navigation order
		await initAuth();
		await initSavedEvents();
		savedIds = getSavedIds();
		if (savedIds.length > 0) {
			void loadSavedEvents();
		} else {
			isLoading = false;
		}
	});

	async function loadSavedEvents(): Promise<void> {
		isLoading = true;
		errorMessage = null;
		try {
			// Fetch all events, then filter to only saved ones
			const all = await getEvents(200);
			events = all.filter((e) => savedIds.includes(e.id));
		} catch (err) {
			errorMessage = err instanceof Error ? err.message : 'Could not load saved events.';
		} finally {
			isLoading = false;
		}
	}

	function formatEventDateRange(event: TmdEventSummary): string {
		if (!event.dateStart) return 'Date to be announced';
		const fmt = (d: string) =>
			new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(
				new Date(d)
			);
		const start = fmt(event.dateStart);
		const end = event.dateEnd ? fmt(event.dateEnd) : '';
		return end && end !== start ? `${start} – ${end}` : start;
	}

	function formatEventLocation(event: TmdEventSummary): string {
		return [event.city, event.country].filter(Boolean).join(', ') || 'Location to be announced';
	}
</script>

<svelte:head>
	<title>Saved Events - TMD Mobile</title>
</svelte:head>

<section class="space-y-4">
	<div>
		<h1 class="font-display text-4xl font-bold">Saved</h1>
		<p class="mt-1 text-muted">Events you've bookmarked</p>
	</div>

	{#if isLoading}
		<!-- Skeleton loading -->
		<div class="space-y-3" aria-busy="true" aria-label="Loading saved events">
			{#each { length: 3 } as _, i (i)}
				<div class="panel animate-pulse p-4">
					<div class="h-4 w-3/4 rounded bg-soft"></div>
					<div class="mt-3 h-3 w-1/2 rounded bg-soft"></div>
					<div class="mt-2 h-3 w-2/5 rounded bg-soft"></div>
				</div>
			{/each}
		</div>
	{:else if errorMessage}
		<!-- Error state -->
		<div class="panel border-accent p-5" role="alert">
			<p class="font-semibold text-accent">Could not load saved events</p>
			<p class="mt-1 text-sm text-muted">{errorMessage}</p>
			<button
				class="button-secondary mt-4 text-sm"
				type="button"
				onclick={() => void loadSavedEvents()}
			>
				Try again
			</button>
		</div>
	{:else if savedIds.length === 0}
		<!-- Empty state: no saved events (task 2.4) -->
		<div class="panel p-5" role="status">
			<p class="font-semibold text-ink">No saved events yet</p>
			<p class="mt-1 text-sm text-muted">
				Tap the bookmark icon on any event to save it for quick access.
			</p>
			<a class="button-secondary mt-4 inline-flex text-sm" href={resolve('/events')}>
				Browse events
			</a>
		</div>
	{:else if events.length === 0}
		<!-- Saved IDs exist but no matches from API (events may have been removed) -->
		<div class="panel p-5" role="status">
			<p class="font-semibold text-ink">Saved events not found</p>
			<p class="mt-1 text-sm text-muted">
				Some saved events may no longer be available.
			</p>
			<a class="button-secondary mt-4 inline-flex text-sm" href={resolve('/events')}>
				Browse events
			</a>
		</div>
	{:else}
		<!-- Saved events list (task 2.3) -->
		<ul class="space-y-3" aria-label="Saved events">
			{#each events as event (event.id)}
				<li class="relative">
					<a
						href={resolve(`/events/${event.id}`)}
						class="panel block p-4 pr-12 transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary"
					>
						<p class="font-semibold text-ink">{event.title}</p>
						<p class="mt-1 text-sm text-muted">{formatEventDateRange(event)}</p>
						<p class="text-sm text-muted">{formatEventLocation(event)}</p>
						{#if event.badges.length > 0}
							<div class="mt-3 flex flex-wrap gap-1.5">
								{#each event.badges.slice(0, 3) as badge (badge)}
									<span class="rounded-control bg-soft px-2 py-0.5 text-xs font-medium text-ink">
										{badge}
									</span>
								{/each}
							</div>
						{/if}
					</a>
					<SaveToggle
						id={event.id}
						title={event.title}
						class="absolute right-3 top-3"
					/>
				</li>
			{/each}
		</ul>
	{/if}
</section>
