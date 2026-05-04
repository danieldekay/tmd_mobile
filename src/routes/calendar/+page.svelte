<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { getEvents } from '$lib/api/tmd';
	import type { TmdEventSummary } from '$lib/types';

	// ── State ──────────────────────────────────────────────────────────────────
	let events = $state<TmdEventSummary[]>([]);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);

	// ── Load ───────────────────────────────────────────────────────────────────
	async function loadEvents(): Promise<void> {
		isLoading = true;
		errorMessage = null;
		try {
			events = await getEvents(100);
		} catch (error) {
			errorMessage =
				error instanceof Error ? error.message : 'Could not load events from TMD Core.';
		} finally {
			isLoading = false;
		}
	}

	onMount(() => {
		void loadEvents();
	});

	// ── Date helpers ───────────────────────────────────────────────────────────
	function parseDate(value: string): Date | null {
		const d = new Date(value);
		return Number.isNaN(d.getTime()) ? null : d;
	}

	function formatMonthHeader(dateStr: string): string {
		const d = parseDate(dateStr);
		if (!d) return '';
		return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(d);
	}

	function formatDay(dateStr: string): string {
		const d = parseDate(dateStr);
		if (!d) return '';
		return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short' }).format(d);
	}

	function formatFullDate(dateStr: string): string {
		const d = parseDate(dateStr);
		if (!d) return '';
		return new Intl.DateTimeFormat('en', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(d);
	}

	// ── Group events by start-month ────────────────────────────────────────────
	type MonthGroup = {
		key: string;   // YYYY-MM
		label: string; // "June 2026"
		events: TmdEventSummary[];
	};

	const monthGroups: MonthGroup[] = $derived.by(() => {
		if (events.length === 0) return [];

		const map = new Map<string, TmdEventSummary[]>();

		for (const event of events) {
			const d = event.dateStart ? parseDate(event.dateStart) : null;
			const key = d
				? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
				: 'unknown';
			const group = map.get(key) ?? [];
			group.push(event);
			map.set(key, group);
		}

		return [...map.entries()]
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([key, groupEvents]) => ({
				key,
				label: groupEvents[0]?.dateStart ? formatMonthHeader(groupEvents[0].dateStart) : 'Date unknown',
				events: groupEvents.sort((a, b) => {
					if (!a.dateStart) return 1;
					if (!b.dateStart) return -1;
					return a.dateStart.localeCompare(b.dateStart);
				})
			}));
	});

	// ── Registration badge ─────────────────────────────────────────────────────
	type RegStatus = 'open' | 'upcoming' | null;

	function regStatus(event: TmdEventSummary): RegStatus {
		if (!event.registrationDate) return null;
		const regDate = parseDate(event.registrationDate);
		if (!regDate) return null;
		return regDate.getTime() <= Date.now() ? 'open' : 'upcoming';
	}
</script>

<svelte:head>
	<title>Calendar - TMD Mobile</title>
</svelte:head>

<section class="space-y-5">
	<div>
		<h1 class="font-display text-4xl font-bold">Calendar</h1>
		<p class="mt-1 text-muted">Upcoming tango events by month</p>
	</div>

	{#if isLoading}
		<!-- Skeleton -->
		<div class="space-y-6" aria-busy="true" aria-label="Loading calendar">
			{#each { length: 3 } as _, mi (mi)}
				<div>
					<div class="mb-3 h-5 w-36 animate-pulse rounded bg-soft"></div>
					{#each { length: 3 } as _, ei (ei)}
						<div class="panel mb-2 animate-pulse p-4">
							<div class="h-3 w-24 rounded bg-soft"></div>
							<div class="mt-2 h-4 w-3/4 rounded bg-soft"></div>
							<div class="mt-1 h-3 w-1/2 rounded bg-soft"></div>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	{:else if errorMessage}
		<!-- Error -->
		<div class="panel border-accent p-5" role="alert">
			<p class="font-semibold text-accent">Calendar could not load</p>
			<p class="mt-1 text-sm text-muted">{errorMessage}</p>
			<button class="button-secondary mt-4 text-sm" type="button" onclick={() => void loadEvents()}>
				Try again
			</button>
		</div>
	{:else if monthGroups.length === 0}
		<!-- Empty -->
		<div class="panel p-5" role="status">
			<p class="font-semibold text-ink">No upcoming events</p>
			<p class="mt-1 text-sm text-muted">There are no tango marathons scheduled at the moment. Check back soon.</p>
		</div>
	{:else}
		<!-- Agenda -->
		<div class="space-y-8" aria-label="Event calendar">
			{#each monthGroups as group (group.key)}
				<div>
					<!-- Month header -->
					<h2 class="mb-3 font-display text-lg font-bold text-primary sticky top-[130px] bg-canvas/95 backdrop-blur py-1 z-10">
						{group.label}
					</h2>

					<ul class="space-y-2">
						{#each group.events as event (event.id)}
							<li>
								<a
									href={resolve(`/events/${event.id}`)}
									class="panel flex gap-4 p-4 transition-colors hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
									aria-label="View details for {event.title}"
								>
									<!-- Date column -->
									<div class="w-12 shrink-0 text-center">
										{#if event.dateStart}
											<span class="block font-display text-2xl font-bold leading-none text-ink">
												{new Date(event.dateStart).getDate()}
											</span>
											<span class="mt-0.5 block text-xs text-muted">
												{new Intl.DateTimeFormat('en', { month: 'short' }).format(new Date(event.dateStart))}
											</span>
										{:else}
											<span class="block text-xs text-muted">TBA</span>
										{/if}
									</div>

									<!-- Event info -->
									<div class="min-w-0 flex-1">
										<p class="font-semibold leading-snug text-ink">{event.title}</p>

										{#if event.dateEnd && event.dateStart && event.dateEnd !== event.dateStart}
											<p class="mt-0.5 text-xs text-muted">
												{formatDay(event.dateStart)} – {formatFullDate(event.dateEnd)}
											</p>
										{/if}

										<p class="mt-0.5 text-sm text-muted">
											{[event.city, event.country].filter(Boolean).join(', ') || 'Location TBD'}
										</p>

										<!-- Registration date badge -->
										{#if event.registrationDate}
											{@const status = regStatus(event)}
											<div class="mt-2 flex items-center gap-1.5 text-xs">
												<span
													class="rounded-control px-2 py-0.5 font-semibold {status === 'open' ? 'bg-primary/10 text-primary' : 'bg-soft text-muted'}"
												>
													{status === 'open' ? 'Registration open' : 'Reg. from ' + formatDay(event.registrationDate)}
												</span>
											</div>
										{/if}
									</div>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	{/if}
</section>

