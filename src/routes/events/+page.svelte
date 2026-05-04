<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { getEvents } from '$lib/api/tmd';
	import type { TmdEventFilters, TmdEventSummary } from '$lib/types';
	import SaveToggle from '$lib/components/SaveToggle.svelte';
	import { incrementBrowseCount } from '$lib/pwa';

	// ── State ──────────────────────────────────────────────────────────────────
	let events = $state<TmdEventSummary[]>([]);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);
	let isOffline = $state(false);

	// Filter state (mirrored to/from URL params)
	let filterCountry = $state('');
	let filterCity = $state('');
	let filterDateAfter = $state('');
	let filterDateBefore = $state('');
	let filterRegState = $state<TmdEventFilters['registrationState']>('all');

	// Derived: are any filters active?
	const hasActiveFilters = $derived(
		filterCountry !== '' ||
			filterCity !== '' ||
			filterDateAfter !== '' ||
			filterDateBefore !== '' ||
			(filterRegState !== 'all' && filterRegState !== undefined)
	);

	// Available country options derived from loaded events
	let availableCountries = $state<string[]>([]);

	// ── URL sync helpers ───────────────────────────────────────────────────────
	function readFiltersFromUrl(): void {
		const params = get(page).url.searchParams;
		filterCountry = params.get('country') ?? '';
		filterCity = params.get('city') ?? '';
		filterDateAfter = params.get('after') ?? '';
		filterDateBefore = params.get('before') ?? '';
		const reg = params.get('reg');
		filterRegState =
			reg === 'open' || reg === 'upcoming' ? reg : 'all';
	}

	function buildFilterParams(): TmdEventFilters {
		return {
			country: filterCountry || undefined,
			city: filterCity || undefined,
			dateAfter: filterDateAfter || undefined,
			dateBefore: filterDateBefore || undefined,
			registrationState: filterRegState
		};
	}

	async function pushFiltersToUrl(): Promise<void> {
		const url = new URL(get(page).url);
		url.searchParams.delete('country');
		url.searchParams.delete('city');
		url.searchParams.delete('after');
		url.searchParams.delete('before');
		url.searchParams.delete('reg');

		if (filterCountry) url.searchParams.set('country', filterCountry);
		if (filterCity) url.searchParams.set('city', filterCity);
		if (filterDateAfter) url.searchParams.set('after', filterDateAfter);
		if (filterDateBefore) url.searchParams.set('before', filterDateBefore);
		if (filterRegState && filterRegState !== 'all') url.searchParams.set('reg', filterRegState);

		// Navigate to /events with updated query params (typed route)
		const newPath = url.search ? `/events${url.search}` : '/events';
		await goto(newPath, {
			replaceState: true,
			keepFocus: true,
			noScroll: true
		});
	}

	// ── Load logic ─────────────────────────────────────────────────────────────
	async function loadEvents(): Promise<void> {
		isLoading = true;
		errorMessage = null;
		try {
			const filters = buildFilterParams();
			events = await getEvents(50, filters);
			incrementBrowseCount();
			// Derive available countries from the full unfiltered set when no country filter active
			if (!filterCountry) {
				const countries = [...new Set(events.map((e) => e.country).filter((c): c is string => Boolean(c)))].sort();
				availableCountries = countries;
			}
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : 'Could not load events from TMD Core.';
		} finally {
			isLoading = false;
		}
	}

	// ── Filter change handler ──────────────────────────────────────────────────
	async function applyFilters(): Promise<void> {
		await pushFiltersToUrl();
		void loadEvents();
	}

	async function clearFilters(): Promise<void> {
		filterCountry = '';
		filterCity = '';
		filterDateAfter = '';
		filterDateBefore = '';
		filterRegState = 'all';
		await pushFiltersToUrl();
		void loadEvents();
	}

	// ── Formatting helpers ─────────────────────────────────────────────────────
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

	// ── Mount ──────────────────────────────────────────────────────────────────
	onMount(() => {
		readFiltersFromUrl();

		isOffline = !navigator.onLine;
		// Always attempt load — SW cache serves events when offline
		void loadEvents();

		const handleOnline = () => {
			isOffline = false;
			if (events.length === 0 && !isLoading) void loadEvents();
		};
		const handleOffline = () => { isOffline = true; };

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
		<p class="mt-1 text-muted">Upcoming tango marathons and festivals</p>
	</div>

	<!-- Filter bar -->
	<div class="panel p-4 space-y-3" aria-label="Filter events">
		<div class="grid grid-cols-2 gap-2">
			<!-- Country filter -->
			<div>
				<label for="filter-country" class="eyebrow mb-1 block">Country</label>
				{#if availableCountries.length > 0}
					<select
						id="filter-country"
						class="w-full rounded-control border border-line bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
						bind:value={filterCountry}
						onchange={() => void applyFilters()}
					>
						<option value="">All countries</option>
						{#each availableCountries as country (country)}
							<option value={country}>{country}</option>
						{/each}
					</select>
				{:else}
					<input
						id="filter-country"
						type="text"
						placeholder="e.g. Germany"
						class="w-full rounded-control border border-line bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
						bind:value={filterCountry}
						onchange={() => void applyFilters()}
					/>
				{/if}
			</div>

			<!-- City filter -->
			<div>
				<label for="filter-city" class="eyebrow mb-1 block">City</label>
				<input
					id="filter-city"
					type="text"
					placeholder="e.g. Berlin"
					class="w-full rounded-control border border-line bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
					bind:value={filterCity}
					onchange={() => void applyFilters()}
				/>
			</div>

			<!-- Date after -->
			<div>
				<label for="filter-after" class="eyebrow mb-1 block">From</label>
				<input
					id="filter-after"
					type="date"
					class="w-full rounded-control border border-line bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
					bind:value={filterDateAfter}
					onchange={() => void applyFilters()}
				/>
			</div>

			<!-- Date before -->
			<div>
				<label for="filter-before" class="eyebrow mb-1 block">To</label>
				<input
					id="filter-before"
					type="date"
					class="w-full rounded-control border border-line bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
					bind:value={filterDateBefore}
					onchange={() => void applyFilters()}
				/>
			</div>
		</div>

		<!-- Registration state -->
		<div>
			<p class="eyebrow mb-1">Registration</p>
			<div class="flex gap-2" role="group" aria-label="Registration state filter">
				{#each [['all', 'All'], ['open', 'Open now'], ['upcoming', 'Opening soon']] as [val, label] (val)}
					<button
						type="button"
						class="rounded-control px-3 py-1.5 text-xs font-semibold transition-colors {filterRegState === val ? 'bg-primary text-white' : 'bg-soft text-ink hover:bg-line'}"
						onclick={() => { filterRegState = val as TmdEventFilters['registrationState']; void applyFilters(); }}
						aria-pressed={filterRegState === val}
					>
						{label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Clear button -->
		{#if hasActiveFilters}
			<button
				type="button"
				class="button-secondary w-full text-sm"
				onclick={() => void clearFilters()}
			>
				Clear all filters
			</button>
		{/if}
	</div>

	{#if isLoading}
		<!-- Skeleton loading state -->
		<div class="space-y-3" aria-busy="true" aria-label="Loading events">
			{#each { length: 6 } as _, i (i)}
				<div class="panel animate-pulse p-4">
					<div class="h-4 w-3/4 rounded bg-soft"></div>
					<div class="mt-3 h-3 w-1/2 rounded bg-soft"></div>
					<div class="mt-2 h-3 w-2/5 rounded bg-soft"></div>
					<div class="mt-3 flex gap-2">
						<div class="h-6 w-16 rounded-control bg-soft"></div>
						<div class="h-6 w-20 rounded-control bg-soft"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else if errorMessage}
		<!-- Error state -->
		<div class="panel border-accent p-5" role="alert">
			<p class="font-semibold text-accent">Events could not load</p>
			<p class="mt-1 text-sm text-muted">{errorMessage}</p>
			<button class="button-secondary mt-4 text-sm" type="button" onclick={() => void loadEvents()}>
				Try again
			</button>
		</div>
	{:else if events.length === 0 && hasActiveFilters}
		<!-- Filtered-empty state -->
		<div class="panel p-5" role="status">
			<p class="font-semibold text-ink">No events match your filters</p>
			<p class="mt-1 text-sm text-muted">Try adjusting or clearing your filters to see more events.</p>
			<button
				type="button"
				class="button-secondary mt-4 text-sm"
				onclick={() => void clearFilters()}
			>
				Clear filters
			</button>
		</div>
	{:else if events.length === 0}
		<!-- Global empty state -->
		<div class="panel p-5" role="status">
			<p class="font-semibold text-ink">No upcoming events</p>
			<p class="mt-1 text-sm text-muted">There are no tango marathons scheduled at the moment. Check back soon.</p>
		</div>
	{:else}
		<!-- Offline cache banner -->
		{#if isOffline}
			<div class="rounded-control border border-line bg-soft px-4 py-2 text-sm text-muted" role="status">
				You are offline. Showing cached events.
			</div>
		{/if}
		<!-- Event list -->
		<ul class="space-y-3" aria-label="Upcoming events">
			{#each events as event (event.id)}
				<li class="relative">
					<a
						href={resolve(`/events/${event.id}`)}
						class="panel block p-4 pr-14 transition-colors hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
						aria-label="View details for {event.title}"
					>
						<p class="eyebrow">{formatEventDateRange(event)}</p>
						<p class="mt-1 font-display text-xl font-bold text-ink">{event.title}</p>
						<p class="mt-1 text-sm text-muted">{formatEventLocation(event)}</p>
						{#if event.venue}
							<p class="mt-0.5 text-sm text-muted">{event.venue}</p>
						{/if}
						{#if event.badges.length > 0}
							<div class="mt-3 flex flex-wrap gap-1.5" aria-label="Features">
								{#each event.badges as badge (badge)}
									<span class="rounded-control bg-soft px-2.5 py-1 text-xs font-semibold text-ink">
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
</section>

