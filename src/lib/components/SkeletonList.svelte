<script lang="ts">
	/**
	 * Animated loading skeleton for list pages.
	 * variant="compact" — 2-row skeleton (DJs, Teachers)
	 * variant="post"    — 3-row skeleton with excerpt area (Blog)
	 */
	type Props = {
		count?: number;
		label?: string;
		variant?: 'compact' | 'post';
	};

	const { count = 6, label = 'Loading', variant = 'compact' }: Props = $props();
</script>

<ul class="grid {variant === 'post' ? 'gap-4' : 'gap-3'}" aria-busy="true" aria-label={label}>
	{#each { length: count } as _, i (i)}
		{#if variant === 'post'}
			<li class="panel animate-pulse space-y-2 p-4">
				<div class="h-5 w-2/3 rounded bg-panel"></div>
				<div class="h-3 w-1/4 rounded bg-panel"></div>
				<div class="h-10 rounded bg-panel"></div>
			</li>
		{:else}
			<li class="panel animate-pulse p-4">
				<div class="h-4 w-1/2 rounded bg-panel"></div>
				<div class="mt-2 h-3 w-1/3 rounded bg-panel"></div>
			</li>
		{/if}
	{/each}
</ul>
