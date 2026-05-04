<script lang="ts">
	import { apiBaseUrl } from '$lib/api/tmd';
</script>

<svelte:head>
	<title>Setup - TMD Mobile</title>
</svelte:head>

<section class="space-y-5">
	<div>
		<p class="eyebrow">Setup</p>
		<h1 class="font-display text-4xl font-bold">Project readiness</h1>
		<p class="mt-2 text-muted">Deployment is prepared for Worker Assets, while DNS and production routing remain pending until mobile.tangomarathons.com is available in Cloudflare.</p>
	</div>

	<div class="panel p-5">
		<h2 class="font-display text-2xl font-bold">Runtime configuration</h2>
		<dl class="mt-4 grid gap-3 text-sm">
			<div>
				<dt class="font-semibold text-muted">API base URL</dt>
				<dd class="break-all text-ink">{apiBaseUrl}</dd>
			</div>
			<div>
				<dt class="font-semibold text-muted">Cloudflare Worker</dt>
				<dd class="text-ink">tmd-mobile</dd>
			</div>
			<div>
				<dt class="font-semibold text-muted">Custom domain</dt>
				<dd class="text-ink">mobile.tangomarathons.com pending Cloudflare setup</dd>
			</div>
		</dl>
	</div>

	<div class="soft-panel p-5">
		<p class="font-semibold text-ink">Next operational step</p>
		<p class="mt-2 text-muted">Add the Cloudflare route and DNS record once the mobile subdomain is available, then enable the GitHub Actions secret CLOUDFLARE_API_TOKEN.</p>
	</div>
</section>
