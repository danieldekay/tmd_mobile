<script lang="ts">
	import { goto } from '$app/navigation';
	import type { TmdEventSummary } from '$lib/types';
	import { formatDateRange } from '$lib/utils/format';

	type Props = {
		events: TmdEventSummary[];
	};

	const { events }: Props = $props();

type RegStatus = 'open' | 'upcoming' | null;

	function regStatus(event: TmdEventSummary): RegStatus {
		if (!event.registrationDate) return null;
		const d = new Date(event.registrationDate);
		if (Number.isNaN(d.getTime())) return null;
		return d.getTime() <= Date.now() ? 'open' : 'upcoming';
	}

	async function handleRowClick(id: number): Promise<void> {
		await goto(`/events/${id}`);
	}
</script>

<div class="panel overflow-x-auto">
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b-2 border-ink text-left">
				<th class="px-3 py-2 font-bold">Event</th>
				<th class="px-3 py-2 font-bold">Dates</th>
				<th class="px-3 py-2 font-bold">Location</th>
				<th class="hidden px-3 py-2 font-bold sm:table-cell">Reg.</th>
			</tr>
		</thead>
		<tbody>
			{#each events as event (event.id)}
				{@const status = regStatus(event)}
				<tr
					class="cursor-pointer border-b border-ink/20 transition-colors hover:bg-panel"
					onclick={() => void handleRowClick(event.id)}
					tabindex="0"
					role="row"
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') void handleRowClick(event.id);
					}}
				>
					<td class="px-3 py-0">
						<a
							href="/events/{event.id}"
							class="flex min-h-[44px] items-center font-semibold text-ink hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
							aria-label="View details for {event.title}"
							onclick={(e) => e.stopPropagation()}
						>
							{event.title}
						</a>
					</td>
					<td class="whitespace-nowrap px-3 py-2 text-xs text-ink/70">{formatDateRange(event.dateStart, event.dateEnd)}</td>
					<td class="px-3 py-2 text-xs text-ink/70">
						{[event.city, event.country].filter(Boolean).join(', ') || 'TBD'}
					</td>
					<td class="hidden px-3 py-2 sm:table-cell">
					{#if status}
							<span
								class="border-2 border-ink px-2 py-0.5 text-xs font-semibold {status === 'open'
									? 'bg-primary text-ink'
									: 'bg-panel text-ink/60'}"
							>
								{status === 'open' ? 'Open' : 'Soon'}
							</span>
						{:else}
							<span class="text-xs text-ink/40">—</span>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
