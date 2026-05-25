<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { getEvent, TmdNotFoundError } from '$lib/api/tmd';
	import type { TmdEventDetail } from '$lib/types';
	import { formatDateRange, formatLocation, formatRegistrationDate } from '$lib/utils/format';
	import SaveToggle from '$lib/components/SaveToggle.svelte';
	import ReminderButton from '$lib/components/ReminderButton.svelte';
	import { incrementBrowseCount } from '$lib/pwa';

	let event = $state<TmdEventDetail | null>(null);
	let isLoading = $state(true);
	let isNotFound = $state(false);
	let errorMessage = $state<string | null>(null);

	const eventId = $derived(page.params.id ?? '');
	const allLinks = $derived(getAllLinks(event));
	const relationshipGroups = $derived(getRelationshipGroups(event));

	onMount(() => {
		void loadEvent();
	});

	async function loadEvent() {
		if (!eventId) {
			errorMessage = 'This event URL does not contain a valid event ID.';
			isLoading = false;
			return;
		}

		isLoading = true;
		isNotFound = false;
		errorMessage = null;

		try {
			event = await getEvent(eventId);
			incrementBrowseCount();
		} catch (error) {
			if (error instanceof TmdNotFoundError) {
				isNotFound = true;
			} else {
				errorMessage =
					error instanceof Error ? error.message : 'Could not load this event from TMD Core.';
			}
		} finally {
			isLoading = false;
		}
	}



	function getAllLinks(e: TmdEventDetail | null) {
		if (!e) return { contact: [], social: [] };
		return { contact: e.contactLinks, social: e.socialLinks };
	}

	function getRelationshipGroups(e: TmdEventDetail | null) {
		if (!e) return [];
		return [
			{
				label: 'DJs',
				people: e.djs.map((p) => ({ ...p, internalHref: resolve(`/djs/${p.id}`) }))
			},
			{
				label: 'Teachers',
				people: e.teachers.map((p) => ({ ...p, internalHref: resolve(`/teachers/${p.id}`) }))
			},
			{
				label: 'Series',
				people: e.series.map((p) => ({ ...p, internalHref: resolve(`/event-series/${p.id}`) }))
			}
		].filter((g) => g.people.length > 0);
	}

	function openExternalLink(href: string) {
		globalThis.open(href, href.startsWith('mailto:') ? '_self' : '_blank', 'noopener,noreferrer');
	}
</script>

<svelte:head>
	<title>{event ? `${event.title} - TMD Mobile` : 'Event - TMD Mobile'}</title>
</svelte:head>

<section class="space-y-5">
	<!-- Back navigation (task 3.7) -->
	<a class="text-sm font-semibold text-primary" href={resolve('/events')}>← Back to events</a>

	{#if isLoading}
		<!-- Skeleton loading state (task 3.4) -->
		<div class="panel animate-pulse overflow-hidden" aria-busy="true" aria-label="Loading event">
			<div class="bg-panel px-5 py-5">
				<div class="h-3 w-1/3 rounded bg-ink/10"></div>
				<div class="mt-3 h-7 w-3/4 rounded bg-ink/10"></div>
				<div class="mt-3 h-3 w-1/2 rounded bg-ink/10"></div>
			</div>
			<div class="grid gap-4 p-5">
				<div class="h-3 w-1/4 rounded bg-panel"></div>
				<div class="h-3 w-1/3 rounded bg-panel"></div>
				<div class="h-3 w-1/4 rounded bg-panel"></div>
			</div>
		</div>
	{:else if isNotFound}
		<!-- Not-found state (task 3.5) -->
		<div class="panel p-5" role="alert">
			<p class="font-semibold text-ink">Event not found</p>
			<p class="mt-1 text-sm text-ink/60">
				This event does not exist or may have been removed.
			</p>
			<a class="button-secondary mt-4 inline-flex text-sm" href={resolve('/events')}>
				Browse all events
			</a>
		</div>
	{:else if errorMessage}
		<!-- Retryable error state (task 3.6) -->
		<div class="panel border-accent p-5" role="alert">
			<p class="font-semibold text-accent">This event could not load</p>
			<p class="mt-1 text-sm text-ink/60">{errorMessage}</p>
			<button
				class="button-secondary mt-4 text-sm"
				type="button"
				onclick={() => void loadEvent()}
			>
				Try again
			</button>
		</div>
	{:else if event}
		<!-- Event detail (tasks 3.2 + 3.3) -->
		<article class="space-y-5">
			<!-- Header with dates and location -->
			<div class="panel overflow-hidden">
				<div class="bg-primary px-5 py-5 text-ink">
						<p class="text-sm font-semibold uppercase">{formatDateRange(event.dateStart, event.dateEnd)}</p>
					{#if event.categories.length > 0}
						<div class="mt-2 flex flex-wrap gap-1.5" aria-label="Categories">
							{#each event.categories as cat (cat)}
								<span class="border-2 border-ink/40 bg-ink/10 px-2 py-0.5 text-xs font-bold uppercase text-ink">
									{cat}
								</span>
							{/each}
						</div>
					{/if}
					<div class="mt-2 flex items-start gap-3">
						<div class="min-w-0 flex-1">
							<h1 class="font-display text-4xl font-bold">{event.title}</h1>
							{#if event.edition}
								<p class="mt-1 text-sm font-mono text-ink/70">Ed. {event.edition}</p>
							{/if}
						</div>
						<SaveToggle id={event.id} title={event.title} class="mt-1 shrink-0 !bg-ink/10 hover:!bg-ink/20 !text-ink" />
					</div>
					<p class="mt-3 text-sm text-ink/70">{formatLocation(event.city, event.country)}</p>
				</div>

				<div class="grid gap-4 p-5">
					{#if event.venue}
						<div>
							<p class="text-sm font-semibold text-ink/60">Venue</p>
							<p class="text-ink">{event.venue}</p>
						</div>
					{/if}

					<!-- Registration date near top (spec: visible near primary actions) -->
					{#if event.registrationDate}
						<div>
							<p class="text-sm font-semibold text-ink/60">Registration opens</p>
							<p class="text-ink">{formatRegistrationDate(event.registrationDate)}</p>
						</div>
						<ReminderButton
							eventId={event.id}
							eventTitle={event.title}
							registrationDate={event.registrationDate}
						/>
					{/if}

					{#if event.price || event.currency}
						<div>
							<p class="text-sm font-semibold text-ink/60">Price</p>
							<p class="text-ink">{[event.price, event.currency].filter(Boolean).join(' ')}</p>
						</div>
					{/if}
				</div>
			</div>

			<!-- Feature badges -->
			{#if event.features.length > 0}
				<section class="panel p-5" aria-labelledby="features-title">
					<h2 id="features-title" class="font-display text-2xl font-bold">Features</h2>
					<div class="mt-4 flex flex-wrap gap-2">
						{#each event.features as feature (feature)}
							<span class="rounded-control bg-panel px-3 py-2 text-sm font-semibold text-ink">
								{feature}
							</span>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Contact links (website + email) -->
			{#if allLinks.contact.length > 0}
				<section class="panel p-5" aria-labelledby="contact-title">
					<h2 id="contact-title" class="font-display text-2xl font-bold">Contact</h2>
					<div class="mt-4 grid gap-3">
						{#each allLinks.contact as link (link.label)}
							<button
								class="button-secondary"
								type="button"
								onclick={() => openExternalLink(link.href)}
							>{link.label}</button>
						{/each}
					</div>
				</section>
			{/if}

			<!-- Social links (Facebook etc) -->
			{#if allLinks.social.length > 0}
				<section class="panel p-5" aria-labelledby="social-title">
					<h2 id="social-title" class="font-display text-2xl font-bold">Social</h2>
					<div class="mt-4 grid gap-3">
						{#each allLinks.social as link (link.label)}
							<button
								class="button-secondary"
								type="button"
								onclick={() => openExternalLink(link.href)}
							>{link.label}</button>
						{/each}
					</div>
				</section>
			{/if}

			<!-- DJs, teachers, series -->
			{#if relationshipGroups.length > 0}
				<section class="panel p-5" aria-labelledby="relationships-title">
					<h2 id="relationships-title" class="font-display text-2xl font-bold">
						Connected people and series
					</h2>
					<div class="mt-4 grid gap-4">
						{#each relationshipGroups as group (group.label)}
							<div>
								<p class="text-sm font-semibold text-ink/60">{group.label}</p>
								<ul class="mt-2 grid gap-2 text-sm text-ink">
									{#each group.people as person (person.id)}
										<li>
											{#if person.internalHref}
												<a
													class="text-primary underline underline-offset-4"
													href={person.internalHref}
												>{person.name}</a
												>
											{:else if person.url}
												<button
													class="underline decoration-ink/30 underline-offset-4"
													type="button"
													onclick={() => openExternalLink(person.url ?? '')}
												>{person.name}</button
												>
											{:else}
												{person.name}
											{/if}
										</li>
									{/each}
								</ul>
							</div>
						{/each}
					</div>
				</section>
			{/if}
		</article>
	{/if}
</section>

