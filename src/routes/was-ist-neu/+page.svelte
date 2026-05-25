<script lang="ts">
	import { changelog } from '$lib/changelog';
</script>

<svelte:head>
	<title>Was ist neu &ndash; TMD Mobile</title>
	<meta name="description" content="Was gibt's Neues in TMD Mobile – Changelog und Release Notes" />
</svelte:head>

<div class="mx-auto max-w-lg">
	<h1 class="mb-6 font-display text-2xl font-bold text-ink">Was ist neu?</h1>

	<div class="space-y-6">
		{#each changelog as entry (entry.version)}
			<article class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
				<div class="flex items-baseline gap-3">
					<span class="eyebrow">v{entry.version}</span>
					<span class="meta-text">{entry.date}</span>
				</div>
				<h2 class="font-display text-base font-bold text-ink">{entry.title}</h2>
				<ul class="space-y-2">
					{#each entry.items as item}
						<li class="flex gap-2 text-sm text-ink/70">
							<span class="shrink-0" aria-hidden="true">•</span>
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>

	<div class="mt-6 flex items-center justify-between border-y-2 border-ink py-4">
		<a href="/" class="text-sm hover:text-primary">&larr; Home</a>
		<nav class="flex gap-3 text-sm">
			<a href="/impressum" class="underline hover:text-primary">Impressum</a>
			<a href="/datenschutz" class="underline hover:text-primary">Datenschutz</a>
		</nav>
	</div>
</div>

<style>
	.eyebrow {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-text-muted, #666);
	}
	.meta-text {
		font-size: 0.875rem;
		color: var(--color-text-muted, #999);
	}
</style>
