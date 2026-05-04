<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { apiBaseUrl, fetchEvents, formatDateRange, formatLocation } from '$lib/api/tmd';
	import type { RoadmapPhase, TmdEvent } from '$lib/types';

	let events = $state<TmdEvent[]>([]);
	let isLoading = $state(true);
	let errorMessage = $state<string | null>(null);

	const phases: RoadmapPhase[] = [
		{
			name: 'Phase 1',
			window: 'Weeks 1-2',
			outcome: 'Browse parity foundation',
			items: ['Event list', 'event detail', 'calendar feed', 'registration links']
		},
		{
			name: 'Phase 2',
			window: 'Weeks 3-4',
			outcome: 'Discovery parity',
			items: ['Country filters', 'map view', 'DJ and teacher relationships', 'series pages']
		},
		{
			name: 'Phase 3',
			window: 'Weeks 5-6',
			outcome: 'Personal utility',
			items: ['Saved events', 'registration reminders', 'offline-friendly cached data']
		},
		{
			name: 'Phase 4',
			window: 'Weeks 7-8',
			outcome: 'Operational polish',
			items: ['Auth-ready API client', 'import status surfaces', 'production deployment hardening']
		}
	];

	onMount(() => {
		void loadPreviewEvents();
	});

	async function loadPreviewEvents() {
		isLoading = true;
		errorMessage = null;

		try {
			events = await fetchEvents({ limit: 6, futureOnly: true });
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Could not load events from TMD Core.';
		} finally {
			isLoading = false;
		}
	}
</script>

<section class="space-y-5">
	<div class="panel overflow-hidden">
		<div class="border-b border-line bg-primary px-5 py-5 text-white">
			<p class="text-sm font-semibold uppercase">Feature parity planning shell</p>
			<h1 class="mt-2 font-display text-4xl font-bold">Tango marathons, shaped for mobile use.</h1>
		</div>
		<div class="space-y-4 p-5">
			<p class="text-muted">
				This SvelteKit PWA is wired for TMD Core data and planned around the public behavior already proven in TMD4: events, details, calendar, map, DJs, teachers, series, and registration flow visibility.
			</p>
			<div class="grid gap-3 sm:grid-cols-2">
				<a class="button-primary" href={resolve('/events')}>Open event plan</a>
				<a class="button-secondary" href={resolve('/settings')}>Check setup</a>
			</div>
		</div>
	</div>

	<section class="space-y-3" aria-labelledby="live-data-title">
		<div class="flex items-end justify-between gap-3">
			<div>
				<p class="eyebrow">TMD Core</p>
				<h2 id="live-data-title" class="font-display text-3xl font-bold">Live API preview</h2>
			</div>
			<button class="button-secondary min-h-11 px-3 py-2 text-sm" type="button" onclick={loadPreviewEvents}>Refresh</button>
		</div>

		<div class="soft-panel p-4 text-sm text-muted">
			API base: <span class="font-semibold text-ink">{apiBaseUrl}</span>
		</div>

		{#if isLoading}
			<div class="panel p-5 text-muted">Loading upcoming events from TMD Core...</div>
		{:else if errorMessage}
			<div class="panel border-accent p-5">
				<p class="font-semibold text-accent">The preview could not load yet.</p>
				<p class="mt-2 text-sm text-muted">{errorMessage}</p>
				<p class="mt-2 text-sm text-muted">This is expected until the API base URL and CORS behavior are confirmed for the mobile domain.</p>
			</div>
		{:else if events.length === 0}
			<div class="panel p-5 text-muted">No events were returned by the configured endpoint.</div>
		{:else}
			<div class="space-y-3">
				{#each events as event (event.id)}
					<a class="panel block p-4 transition-colors hover:bg-soft" href={resolve('/events/[id]', { id: String(event.id) })}>
						<p class="text-sm font-semibold text-primary">{formatDateRange(event)}</p>
						<h3 class="mt-1 font-display text-2xl font-bold">{event.title}</h3>
						<p class="mt-2 text-sm text-muted">{formatLocation(event)}</p>
						{#if event.features.length > 0}
							<div class="mt-3 flex flex-wrap gap-2">
								{#each event.features.slice(0, 4) as feature (feature)}
									<span class="rounded-control bg-soft px-2 py-1 text-xs font-semibold text-ink">{feature}</span>
								{/each}
							</div>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	</section>

	<section class="space-y-3" aria-labelledby="roadmap-title">
		<div>
			<p class="eyebrow">Roadmap</p>
			<h2 id="roadmap-title" class="font-display text-3xl font-bold">Feature parity phases</h2>
		</div>
		<div class="space-y-3">
			{#each phases as phase (phase.name)}
				<article class="panel p-4">
					<div class="flex items-start justify-between gap-3">
						<div>
							<p class="text-sm font-semibold text-primary">{phase.name} - {phase.window}</p>
							<h3 class="mt-1 font-display text-2xl font-bold">{phase.outcome}</h3>
						</div>
					</div>
					<ul class="mt-3 grid gap-2 text-sm text-muted">
						{#each phase.items as item (item)}
							<li>{item}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</section>
</section>
