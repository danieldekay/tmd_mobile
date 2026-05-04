<script lang="ts">
	import { saveEvent, unsaveEvent, isSaved } from '$lib/saved-events';

	type Props = {
		id: number;
		title: string;
		class?: string;
	};

	let { id, title, class: className = '' }: Props = $props();

	let saved = $state(false);

	$effect(() => {
		saved = isSaved(id);
	});

	function toggle(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (saved) {
			void unsaveEvent(id);
			saved = false;
		} else {
			void saveEvent(id);
			saved = true;
		}
	}
</script>

<button
	type="button"
	class="flex h-9 w-9 items-center justify-center rounded-full transition-colors {saved ? 'bg-primary text-white' : 'bg-canvas/80 text-muted hover:text-primary'} {className}"
	aria-label={saved ? `Unsave ${title}` : `Save ${title}`}
	aria-pressed={saved}
	onclick={toggle}
>
	{#if saved}
		<!-- Filled bookmark -->
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5" aria-hidden="true">
			<path d="M6 2a2 2 0 0 0-2 2v17.586l8-4 8 4V4a2 2 0 0 0-2-2H6Z" />
		</svg>
	{:else}
		<!-- Outline bookmark -->
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true">
			<path d="M6 2a2 2 0 0 0-2 2v17.586l8-4 8 4V4a2 2 0 0 0-2-2H6Z" />
		</svg>
	{/if}
</button>
