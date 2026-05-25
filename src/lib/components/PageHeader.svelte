<script lang="ts">
	type Props = {
		eyebrow?: string;
		title: string;
		subtitle?: string;
	};

	const { eyebrow, title, subtitle }: Props = $props();
</script>

{#if eyebrow}
	<p class="eyebrow">{eyebrow}</p>
{/if}
<h1 class="font-display text-4xl font-bold">{title}</h1>
{#if subtitle}
	<p class="mt-1 text-ink/60">{subtitle}</p>
{/if}
