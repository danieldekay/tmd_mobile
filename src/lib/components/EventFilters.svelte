<script lang="ts">
	import { onMount } from 'svelte';
	import type { TmdEventFilters } from '$lib/types';
	import ViewToggle from './ViewToggle.svelte';
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

	async function applyFilters(): Promise<void> {
		filters = buildFilters();
		await pushFiltersToUrl({
			country: filterCountry,
			city: filterCity,
			dateAfter: filterDateAfter,
			dateBefore: filterDateBefore,
			regState: filterRegState,
			search: filterSearch,
		});
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
		await pushFiltersToUrl({
			country: filterCountry,
			city: filterCity,
			dateAfter: filterDateAfter,
			dateBefore: filterDateBefore,
			regState: filterRegState,
			search: filterSearch,
		});
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
				<ViewToggle {viewMode} onToggle={toggleViewMode} />
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
