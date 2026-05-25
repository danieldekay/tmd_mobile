<script lang="ts">
	import { onMount } from 'svelte';
	import { formatDateRange, formatLocation } from '$lib/utils/format';
	import { resolve } from '$app/paths';
	import { getEvents } from '$lib/api/tmd';
	import type { TmdEventFilters, TmdEventSummary } from '$lib/types';
	import SaveToggle from '$lib/components/SaveToggle.svelte';
	import EventFilters from '$lib/components/EventFilters.svelte';
	import EventTable from '$lib/components/EventTable.svelte';
	import { incrementBrowseCount } from '$lib/pwa';

	// ── State ──────────────────────────────────────────────────────────────────
	let events = $state<TmdEventSummary[]>([]);
	let allEvents = $state<TmdEventSummary[]>([]); // unfiltered set for dropdown derivation
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);
	let isOffline = $state(false);

	// Unified filter state (synced to/from URL by EventFilters component)
	let filters = $state<TmdEventFilters>({});
	let viewMode = $state<'cards' | 'table'>('cards');

	// Derived: country list from unfiltered event set
	const availableCountries = $derived(
		[...new Set(allEvents.map((e) => e.country).filter((c): c is string => Boolean(c)))].sort()
	);

	// Derived: city list for selected country
	const availableCities = $derived(
		filters.country
			? [
					...new Set(
						allEvents
							.filter((e) => e.country === filters.country)
							.map((e) => e.city)
							.filter((c): c is string => Boolean(c))
					)
				].sort()
			: []
	);

	// Derived: are any filters active?
	const hasActiveFilters = $derived(
		Object.values(filters).some((v) => v !== undefined && v !== '')
	);

	// ── Load logic ─────────────────────────────────────────────────────────────
	async function loadEvents(): Promise<void> {
		isLoading = true;
		errorMessage = null;
		try {
			events = await getEvents(100, filters);
			// Client-side search filter (spec: search matches title, city, country)
			if (filters.search?.trim()) {
				const q = filters.search.trim().toLowerCase();
				events = events.filter(
					(e) =>
						e.title.toLowerCase().includes(q) ||
						(e.city ?? '').toLowerCase().includes(q) ||
						(e.country ?? '').toLowerCase().includes(q)
				);
			}
			incrementBrowseCount();
			// Update allEvents when no country filter active (keep unfiltered baseline fresh)
			if (!filters.country) {
				allEvents = events;
			} else if (allEvents.length === 0) {
				// First load had a country filter — fetch unfiltered set for dropdowns
				allEvents = await getEvents(100);
			}
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : 'Could not load events from TMD Core.';
		} finally {
			isLoading = false;
		}
	}

	function clearFilters(): void {
		filters = {};
		void loadEvents();
	}

	function handleViewChange(mode: 'cards' | 'table'): void {
		viewMode = mode;
	}

	// ── Mount ──────────────────────────────────────────────────────────────────
	onMount(() => {
		// Read initial view mode and filters from URL
		const params = new URLSearchParams(window.location.search);
		viewMode = params.get('view') === 'table' ? 'table' : 'cards';
		const country = params.get('country') ?? undefined;
		const city = params.get('city') ?? undefined;
		const dateAfter = params.get('after') ?? undefined;
		const dateBefore = params.get('before') ?? undefined;
		const search = params.get('q') ?? undefined;
		const reg = params.get('reg');
		const registrationState = reg === 'open' || reg === 'upcoming' ? reg : undefined;
		filters = { country, city, dateAfter, dateBefore, search, registrationState };

		isOffline = !navigator.onLine;
		// Always attempt load — SW cache serves events when offline
		void loadEvents();

		const handleOnline = () => {
			isOffline = false;
			if (events.length === 0 && !isLoading) void loadEvents();
		};
		const handleOffline = () => {
			isOffline = true;
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);
		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	});
</script>

<svelte:head>
	<title>Events - TMD Mobile</title>
</svelte:head>

<section class="space-y-4">
	<div>
		<h1 class="font-display text-4xl font-bold">Events</h1>
		<p class="mt-1 text-ink/60">Upcoming tango marathons and festivals</p>
	</div>

	<!-- Filter bar -->
	<EventFilters
		bind:filters
		countries={availableCountries}
		cities={availableCities}
		onchange={loadEvents}
		onViewChange={handleViewChange}
	/>

	{#if isLoading}
		<!-- Skeleton loading state -->
		<div class="space-y-3" aria-busy="true" aria-label="Loading events">
			{#each { length: 6 } as _, i (i)}
				<div class="panel animate-pulse p-4">
					<div class="h-4 w-3/4 rounded bg-panel"></div>
					<div class="mt-3 h-3 w-1/2 rounded bg-panel"></div>
					<div class="mt-2 h-3 w-2/5 rounded bg-panel"></div>
					<div class="mt-3 flex gap-2">
						<div class="h-6 w-16 rounded-control bg-panel"></div>
						<div class="h-6 w-20 rounded-control bg-panel"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else if errorMessage}
		<!-- Error state -->
		<div class="panel border-accent p-5" role="alert">
			<p class="font-semibold text-accent">Events could not load</p>
			<p class="mt-1 text-sm text-ink/60">{errorMessage}</p>
			<button class="button-secondary mt-4 text-sm" type="button" onclick={() => void loadEvents()}>
				Try again
			</button>
		</div>
	{:else if events.length === 0 && hasActiveFilters}
		<!-- Filtered-empty state -->
		<div class="panel p-5" role="status">
			<p class="font-semibold text-ink">No events match your filters</p>
			<p class="mt-1 text-sm text-ink/60">Try adjusting or clearing your filters to see more events.</p>
		</div>
	{:else if events.length === 0}
		<!-- Global empty state -->
		<div class="panel p-5" role="status">
			<p class="font-semibold text-ink">No upcoming events</p>
			<p class="mt-1 text-sm text-ink/60">There are no tango marathons scheduled at the moment. Check back soon.</p>
		</div>
	{:else}
		<!-- Offline cache banner -->
		{#if isOffline}
			<div class="border-2 border-ink bg-panel px-4 py-2 text-sm text-ink/60" role="status">
				You are offline. Showing cached events.
			</div>
		{/if}
			<!-- Event list: table or cards -->
			{#if viewMode === 'table'}
				<EventTable {events} />
			{:else}
		<ul class="space-y-3" aria-label="Upcoming events">
			{#each events as event (event.id)}
				<li class="relative">
					<a
						href={resolve(`/events/${event.id}`)}
						class="panel block p-4 pr-14 transition-colors hover:bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						aria-label="View details for {event.title}"
					>
						<p class="eyebrow">{formatDateRange(event.dateStart, event.dateEnd)}</p>
						<div class="mt-1 flex flex-wrap items-baseline gap-2">
							<p class="font-display text-xl font-bold text-ink">{event.title}</p>
							{#if event.edition}
								<span class="text-xs font-mono text-ink/60">Ed. {event.edition}</span>
							{/if}
						</div>
						<p class="mt-1 text-sm text-ink/60">{formatLocation(event.city, event.country)}</p>
						{#if event.venue}
							<p class="mt-0.5 text-sm text-ink/60">{event.venue}</p>
						{/if}
						{#if event.categories.length > 0}
							<div class="mt-2 flex flex-wrap gap-1.5" aria-label="Categories">
								{#each event.categories as cat (cat)}
									<span class="border-2 border-ink bg-panel px-2 py-0.5 text-xs font-bold uppercase text-ink">
										{cat}
									</span>
								{/each}
							</div>
						{/if}
						{#if event.badges.length > 0}
							<div class="mt-2 flex flex-wrap gap-1.5" aria-label="Features">
								{#each event.badges as badge (badge)}
									<span class="rounded-control bg-panel px-2.5 py-1 text-xs font-semibold text-ink">
										{badge}
									</span>
								{/each}
							</div>
						{/if}
					</a>
					<SaveToggle id={event.id} title={event.title} class="absolute right-3 top-3" />
				</li>
			{/each}
		</ul>
			{/if}
	{/if}
</section>

