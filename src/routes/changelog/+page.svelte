<script lang="ts">
	import { changelog } from '$lib/changelog';
</script>

<svelte:head>
	<title>What's New</title>
</svelte:head>

<main class="content-wrapper">
	<header class="mb-8">
		<h1 class="mb-2">What's New</h1>
		<p class="text-ink/60">Release notes and changelog for TMD Mobile</p>
	</header>

	<div class="space-y-6">
		{#each changelog as entry (entry.version)}
			<article class="panel">
				<div class="mb-4 flex items-baseline gap-3">
					<span class="eyebrow">v{entry.version}</span>
					<span class="meta-text">{entry.date}</span>
				</div>
				<h2 class="mb-3 text-lg font-semibold">{entry.title}</h2>
				<ul class="space-y-2">
					{#each entry.items as item}
						<li class="flex gap-2 text-sm text-ink/70">
							<span class="shrink-0">•</span>
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>
</main>

<style>
	:global {
		.panel {
			border: 1px solid var(--color-border, #ddd);
			padding: 1.5rem;
			background: var(--color-bg-secondary, #fafafa);
		}

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
	}

	main {
		padding: 1.5rem;
		max-width: 600px;
		margin: 0 auto;
	}

	h1 {
		font-size: 1.875rem;
		font-weight: 700;
		color: var(--color-text, #000);
	}
</style>
