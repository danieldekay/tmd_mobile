<script lang="ts">
	type Props = {
		viewMode: 'cards' | 'table';
		onToggle: (mode: 'cards' | 'table') => void | Promise<void>;
	};

	const { viewMode, onToggle }: Props = $props();
</script>

<div class="flex border-2 border-ink" role="group" aria-label="View mode">
	<button
		type="button"
		class="px-3 py-2 transition-colors {viewMode === 'cards'
			? 'bg-primary text-ink'
			: 'bg-canvas hover:bg-panel'}"
		onclick={() => void onToggle('cards')}
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
		onclick={() => void onToggle('table')}
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
