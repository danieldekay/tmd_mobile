<script lang="ts">
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
	import PageHeader from '$lib/components/PageHeader.svelte';
</script>

<svelte:head>
	<title>Newsletter - TMD Mobile</title>
	<meta name="description" content="Stay updated on upcoming tango marathons, events, and news." />
</svelte:head>

<section class="space-y-5">
				<PageHeader eyebrow="Newsletter" title="Stay Updated" />

				<p class="text-ink/60">Get weekly updates on upcoming marathons and events.</p>

				<NewsletterSignup />
</section>
