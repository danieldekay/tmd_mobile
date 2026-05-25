<script lang="ts">
	import { onMount } from 'svelte';
	import type { TmdEventFilters } from '$lib/types';
	import {
		readFiltersFromUrl,
		pushFiltersToUrl,
		pushViewModeToUrl,
		type RegState,
	} from '$lib/utils/filter-url';

	type Props = {
		filters: TmdEventFilters;
		countries?: string[];
		cities?: string[];
		onchange?: () => void;
		onViewChange?: (mode: 'cards' | 'table') => void;
	};

	let {
		filters = $bindable({}),
		countries = [],
		cities = [],
		onchange,
		onViewChange,
	}: Props = $props();

	// ── Internal state ─────────────────────────────────────────────────────────
	let filterCountry = $state('');
	let filterCity = $state('');
	let filterDateAfter = $state('');
	let filterDateBefore = $state('');
	let filterRegState = $state<RegState>('all');
	let filterSearch = $state('');
	let viewMode = $state<'cards' | 'table'>('cards');
	let isEventsPage = $state(false);
	let searchTimer: ReturnType<typeof setTimeout> | null = null;

	// ── Derived ────────────────────────────────────────────────────────────────
	const activeFilterCount = $derived(
		[filterCountry, filterCity, filterDateAfter, filterDateBefore, filterSearch].filter(Boolean)
			.length + (filterRegState !== 'all' ? 1 : 0)
	);
	const hasActiveFilters = $derived(activeFilterCount > 0);

	// ── Init from URL ──────────────────────────────────────────────────────────
	onMount(() => {
		isEventsPage = window.location.pathname === '/events';
		const urlState = readFiltersFromUrl();
		filterCountry = urlState.country;
		filterCity = urlState.city;
		filterDateAfter = urlState.dateAfter;
		filterDateBefore = urlState.dateBefore;
		filterRegState = urlState.regState;
		filterSearch = urlState.search;
		viewMode = urlState.viewMode;
	});

	// ── Helpers ────────────────────────────────────────────────────────────────
	function buildFilters(): TmdEventFilters {
		return {
			country: filterCountry || undefined,
			city: filterCity || undefined,
			dateAfter: filterDateAfter || undefined,
			dateBefore: filterDateBefore || undefined,
			registrationState: filterRegState === 'all' ? undefined : filterRegState,
			search: filterSearch || undefined,
		};
	}

	async function pushToUrl(): Promise<void> {
		await pushFiltersToUrl({
			country: filterCountry,
			city: filterCity,
			dateAfter: filterDateAfter,
			dateBefore: filterDateBefore,
			regState: filterRegState,
			search: filterSearch,
		});
	}

	async function applyFilters(): Promise<void> {
		filters = buildFilters();
		await pushToUrl();
		onchange?.();
	}

	async function clearAllFilters(): Promise<void> {
		filterCountry = '';
		filterCity = '';
		filterDateAfter = '';
		filterDateBefore = '';
		filterRegState = 'all';
		filterSearch = '';
		filters = {};
		await pushToUrl();
		onchange?.();
	}

	function handleSearchInput(): void {
		if (searchTimer) clearTimeout(searchTimer);
		searchTimer = setTimeout(() => {
			void applyFilters();
		}, 300);
	}

	async function toggleViewMode(mode: 'cards' | 'table'): Promise<void> {
		viewMode = mode;
		await pushViewModeToUrl(mode);
		onViewChange?.(mode);
	}
</script>

<div class="panel p-4" aria-label="Filter events">
	<!-- Search row + view toggle -->
	<div class="mb-3 flex gap-2">
		<div class="flex-1">
			<label for="ef-search" class="eyebrow mb-1 block">Search</label>
			<input
				id="ef-search"
				type="search"
				placeholder="Event name, city, country…"
				class="w-full border-2 border-ink bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
				bind:value={filterSearch}
				oninput={() => handleSearchInput()}
			/>
		</div>

		{#if isEventsPage}
			<div class="flex flex-col justify-end">
				<span class="eyebrow invisible mb-1 block" aria-hidden="true">View</span>
				<div class="flex border-2 border-ink" role="group" aria-label="View mode">
					<button
						type="button"
						class="px-3 py-2 transition-colors {viewMode === 'cards'
							? 'bg-primary text-ink'
							: 'bg-canvas hover:bg-panel'}"
						onclick={() => void toggleViewMode('cards')}
						aria-pressed={viewMode === 'cards'}
						aria-label="Card view"
						title="Card view"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="square"
							aria-hidden="true"
						>
							<rect x="3" y="3" width="7" height="7" />
							<rect x="14" y="3" width="7" height="7" />
							<rect x="3" y="14" width="7" height="7" />
							<rect x="14" y="14" width="7" height="7" />
						</svg>
					</button>
					<button
						type="button"
						class="border-l-2 border-ink px-3 py-2 transition-colors {viewMode === 'table'
							? 'bg-primary text-ink'
							: 'bg-canvas hover:bg-panel'}"
						onclick={() => void toggleViewMode('table')}
						aria-pressed={viewMode === 'table'}
						aria-label="Table view"
						title="Table view"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="square"
							aria-hidden="true"
						>
							<line x1="8" y1="6" x2="21" y2="6" />
							<line x1="8" y1="12" x2="21" y2="12" />
							<line x1="8" y1="18" x2="21" y2="18" />
							<circle cx="3" cy="6" r="1" fill="currentColor" />
							<circle cx="3" cy="12" r="1" fill="currentColor" />
							<circle cx="3" cy="18" r="1" fill="currentColor" />
						</svg>
					</button>
				</div>
			</div>
		{/if}
	</div>

	<!-- Country + City row -->
	<div class="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
		<div>
			<label for="ef-country" class="eyebrow mb-1 block">Country</label>
			{#if countries.length > 0}
				<select
					id="ef-country"
					class="w-full border-2 border-ink bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
					bind:value={filterCountry}
					onchange={() => void applyFilters()}
				>
					<option value="">All countries</option>
					{#each countries as country (country)}
						<option value={country}>{country}</option>
					{/each}
				</select>
			{:else}
				<input
					id="ef-country"
					type="text"
					placeholder="e.g. Germany"
					class="w-full border-2 border-ink bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
					bind:value={filterCountry}
					onchange={() => void applyFilters()}
				/>
			{/if}
		</div>

		<div>
			<label for="ef-city" class="eyebrow mb-1 block">City</label>
			{#if cities.length > 0}
				<select
					id="ef-city"
					class="w-full border-2 border-ink bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
					bind:value={filterCity}
					onchange={() => void applyFilters()}
				>
					<option value="">All cities</option>
					{#each cities as city (city)}
						<option value={city}>{city}</option>
					{/each}
				</select>
			{:else}
				<input
					id="ef-city"
					type="text"
					placeholder="e.g. Berlin"
					class="w-full border-2 border-ink bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
					bind:value={filterCity}
					onchange={() => void applyFilters()}
				/>
			{/if}
		</div>
	</div>

	<!-- Date range -->
	<div class="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
		<div>
			<label for="ef-after" class="eyebrow mb-1 block">From</label>
			<input
				id="ef-after"
				type="date"
				class="w-full border-2 border-ink bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
				bind:value={filterDateAfter}
				onchange={() => void applyFilters()}
			/>
		</div>
		<div>
			<label for="ef-before" class="eyebrow mb-1 block">To</label>
			<input
				id="ef-before"
				type="date"
				class="w-full border-2 border-ink bg-canvas px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
				bind:value={filterDateBefore}
				onchange={() => void applyFilters()}
			/>
		</div>
	</div>

	<!-- Registration state -->
	<div class="mb-3">
		<p class="eyebrow mb-1">Registration</p>
		<div class="flex flex-wrap gap-2" role="group" aria-label="Registration state filter">
			{#each [['all', 'All'], ['open', 'Open now'], ['upcoming', 'Opening soon']] as [val, label] (val)}
				<button
					type="button"
					class="border-2 border-ink px-3 py-1.5 text-xs font-semibold transition-colors {filterRegState ===
					val
						? 'bg-primary text-ink'
						: 'bg-canvas hover:bg-panel'}"
					onclick={() => {
						filterRegState = val as 'open' | 'upcoming' | 'all';
						void applyFilters();
					}}
					aria-pressed={filterRegState === val}
				>
					{label}
				</button>
			{/each}
		</div>
	</div>

	<!-- Active filter badge + clear -->
	{#if hasActiveFilters}
		<div class="flex items-center justify-between border-t-2 border-ink/20 pt-2">
			<span class="meta-text text-ink/60"
				>{activeFilterCount}
				{activeFilterCount === 1 ? 'filter' : 'filters'} active</span
			>
			<button type="button" class="button-secondary" onclick={() => void clearAllFilters()}>
				Clear all
			</button>
		</div>
	{/if}
</div>
