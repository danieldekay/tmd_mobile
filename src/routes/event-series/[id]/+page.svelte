<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getEventSeries, TmdNotFoundError } from '$lib/api/tmd';
	import type { TmdEventSeries } from '$lib/types';

	let series = $state<TmdEventSeries | null>(null);
	let isLoading = $state(true);
	let isNotFound = $state(false);
	let errorMessage = $state<string | null>(null);

	const seriesId: string = $derived(page.params.id ?? '');

	const upcomingEditions = $derived.by(() => {
		if (!series) return [];
		const now = new Date();
		return series.editions.filter((e) => !e.dateStart || new Date(e.dateStart) >= now);
	});

	const pastEditions = $derived.by(() => {
		if (!series) return [];
		const now = new Date();
		return series.editions
			.filter((e) => e.dateStart && new Date(e.dateStart) < now)
			.slice()
			.reverse();
	});

	onMount(() => {
		void load();
	});

	async function load() {
		if (!seriesId) {
			errorMessage = 'This URL does not contain a valid series ID.';
			isLoading = false;
			return;
		}

		isLoading = true;
		isNotFound = false;
		errorMessage = null;

		try {
			series = await getEventSeries(seriesId);
		} catch (err) {
			if (err instanceof TmdNotFoundError) {
				isNotFound = true;
			} else {
				errorMessage =
					err instanceof Error
						? err.message
						: 'Could not load this series from TMD Core.';
			}
		} finally {
			isLoading = false;
		}
	}

	function formatDateRange(dateStart?: string, dateEnd?: string): string {
		if (!dateStart) return 'Date to be announced';
		const fmt = (d: string) =>
			new Intl.DateTimeFormat('en', {
				day: 'numeric',
				month: 'short',
				year: 'numeric'
			}).format(new Date(d));
		const start = fmt(dateStart);
		const end = dateEnd ? fmt(dateEnd) : '';
		return end && end !== start ? `${start} – ${end}` : start;
	}
</script>

<svelte:head>
	<title>{series ? `${series.title} - TMD Mobile` : 'Series - TMD Mobile'}</title>
</svelte:head>

<section class="space-y-5">
	<a class="text-primary text-sm font-semibold" href={resolve('/events')}>← Back to events</a>

	{#if isLoading}
		<div
			class="panel animate-pulse overflow-hidden"
			aria-busy="true"
			aria-label="Loading series"
		>
			<div class="bg-soft px-5 py-5">
				<div class="bg-muted/20 h-3 w-1/3 rounded"></div>
				<div class="bg-muted/20 mt-3 h-7 w-3/4 rounded"></div>
			</div>
		</div>
	{:else if isNotFound}
		<div class="panel p-5" role="alert">
			<p class="text-ink font-semibold">Series not found</p>
			<p class="text-muted mt-1 text-sm">
				This event series does not exist or may have been removed.
			</p>
			<a class="button-secondary mt-4 inline-flex text-sm" href={resolve('/events')}>
				Browse all events
			</a>
		</div>
	{:else if errorMessage}
		<div class="panel border-accent p-5" role="alert">
			<p class="text-accent font-semibold">This series could not load</p>
			<p class="text-muted mt-1 text-sm">{errorMessage}</p>
			<button
				class="button-secondary mt-4 text-sm"
				type="button"
				onclick={() => void load()}
			>
				Try again
			</button>
		</div>
	{:else if series}
		<article class="space-y-5">
			<div class="panel overflow-hidden">
				<div class="bg-primary px-5 py-5 text-white">
					<p class="eyebrow text-white/70">Event Series</p>
					<h1 class="font-display mt-1 text-4xl font-bold">{series.title}</h1>
					{#if series.city || series.country}
						<p class="mt-2 text-sm text-white/85">
							{[series.city, series.country].filter(Boolean).join(', ')}
						</p>
					{/if}
				</div>
				{#if series.description}
					<div class="p-5">
						<p class="text-muted">{series.description}</p>
					</div>
				{/if}
			</div>

			{#if upcomingEditions.length > 0}
				<section class="panel p-5" aria-labelledby="upcoming-heading">
					<h2 id="upcoming-heading" class="font-display text-2xl font-bold">
						Upcoming editions
					</h2>
					<ul class="mt-4 grid gap-3">
						{#each upcomingEditions as edition (edition.id)}
							<li>
								<a
									class="rounded-control bg-soft hover:bg-soft/80 block p-3"
									href={resolve(`/events/${edition.id}`)}
								>
									<p class="text-ink font-semibold">{edition.title}</p>
									<p class="text-muted mt-0.5 text-sm">
										{formatDateRange(edition.dateStart, edition.dateEnd)}
									</p>
									{#if edition.city || edition.country}
										<p class="text-muted mt-0.5 text-sm">
											{[edition.city, edition.country].filter(Boolean).join(', ')}
										</p>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{:else}
				<div class="panel p-5">
					<p class="text-muted">No upcoming editions are scheduled for this series.</p>
				</div>
			{/if}

			{#if pastEditions.length > 0}
				<section class="panel p-5" aria-labelledby="past-heading">
					<h2 id="past-heading" class="font-display text-2xl font-bold">Past editions</h2>
					<ul class="mt-4 grid gap-3">
						{#each pastEditions as edition (edition.id)}
							<li>
								<a
									class="rounded-control bg-soft hover:bg-soft/80 block p-3"
									href={resolve(`/events/${edition.id}`)}
								>
									<p class="text-ink font-semibold">{edition.title}</p>
									<p class="text-muted mt-0.5 text-sm">
										{formatDateRange(edition.dateStart, edition.dateEnd)}
									</p>
									{#if edition.city || edition.country}
										<p class="text-muted mt-0.5 text-sm">
											{[edition.city, edition.country].filter(Boolean).join(', ')}
										</p>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		</article>
	{/if}
</section>
