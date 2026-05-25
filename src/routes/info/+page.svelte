<script lang="ts">
	import { authState } from '$lib/auth';
	import { apiBaseUrl } from '$lib/api/tmd';
	import { pwaInstallState } from '$lib/utils/pwa-install-state';
	import { page } from '$app/state';

	// API response sample state
	let apiResponse = $state<string>('');
	let apiLatency = $state<number | null>(null);
	let copying = $state(false);

	// Copy to clipboard function
	async function copyToClipboard(text: string): Promise<void> {
		await navigator.clipboard.writeText(text);
	}

	// Fetch sample API response
	async function fetchSampleEvent() {
		const startTime = performance.now();
		try {
			const res = await fetch(`${apiBaseUrl}/events?per_page=1`);
			const data = await res.json();
			apiLatency = Math.round(performance.now() - startTime);
			apiResponse = JSON.stringify(data, null, 2);
		} catch (e) {
			apiLatency = null;
			apiResponse = `Error: ${e instanceof Error ? e.message : String(e)}`;
		}
	}

	function copyResponse() {
		if (apiResponse) {
			copying = true;
			copyToClipboard(apiResponse);
			setTimeout(() => (copying = false), 2000);
		}
	}
</script>

<svelte:head>
	<title>App Info &ndash; TMD Mobile</title>
	<meta name="description" content="App version, build info, and debugging tools" />
</svelte:head>

<div class="mx-auto max-w-lg space-y-6">
	<h1 class="mb-6 font-display text-2xl font-bold text-ink">App Info</h1>

	<!-- Build Info -->
	<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
		<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">Build Information</h2>
		<dl class="space-y-2 text-sm">
			<div class="flex justify-between">
				<dt class="font-semibold text-ink">Version</dt>
				<dd class="text-ink/80">v{__APP_VERSION__}</dd>
			</div>
			<div class="flex justify-between">
				<dt class="font-semibold text-ink">Git Hash</dt>
				<dd class="font-mono text-ink/80">{__BUILD_HASH__}</dd>
			</div>
			<div class="flex justify-between">
				<dt class="font-semibold text-ink">Environment</dt>
				<dd class="text-ink/80">{import.meta.env.MODE}</dd>
			</div>
		</dl>
	</section>

	<!-- API Info -->
	<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
		<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">API Configuration</h2>
		<dl class="space-y-2 text-sm">
			<div>
				<dt class="font-semibold text-ink">Base URL</dt>
				<dd class="break-all font-mono text-xs text-ink/80">{apiBaseUrl}</dd>
			</div>
		</dl>
	</section>

	<!-- Authentication State -->
	<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
		<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">Authentication</h2>
		{#if $authState.user}
			<p class="text-sm text-ink">
				<span class="font-semibold text-ink">Logged in:</span> {$authState.user.name}
				<br />
				<span class="text-ink/60">{$authState.user.email}</span>
			</p>
		{:else}
			<p class="text-sm text-ink">
				<span class="font-semibold">Not logged in</span>
			</p>
		{/if}
	</section>

	<!-- PWA State -->
	<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
		<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">PWA Status</h2>
		<dl class="space-y-2 text-sm">
			<div class="flex justify-between">
				<dt class="font-semibold text-ink">Install Prompt</dt>
				<dd class="text-ink/80">{pwaInstallState.canInstall ? 'Available' : 'Not available'}</dd>
			</div>
		</dl>
	</section>

	<!-- Current Route Info -->
	<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
		<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">Current Route</h2>
		<dl class="space-y-2 text-sm">
			<div>
				<dt class="font-semibold text-ink">Pathname</dt>
				<dd class="font-mono text-xs text-ink/80">{page.url.pathname}</dd>
			</div>
			<div>
				<dt class="font-semibold text-ink">Search Params</dt>
				<dd class="font-mono text-xs text-ink/80">{page.url.search || '(none)'}</dd>
			</div>
		</dl>
	</section>

	<!-- API Response Inspection -->
	<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
		<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">API Inspector</h2>
		<div class="space-y-3">
			<button
				onclick={fetchSampleEvent}
				class="button-primary text-sm"
			>
				Fetch Sample Event
			</button>
			{#if apiLatency !== null}
				<p class="text-xs text-ink/60">Latency: {apiLatency}ms</p>
			{/if}
			{#if apiResponse}
				<div class="relative">
					<pre class="max-h-48 overflow-auto rounded border-2 border-ink bg-canvas p-2 text-xs">{apiResponse}</pre>
					<button
						onclick={copyResponse}
						class="absolute top-2 right-2 rounded-control border-2 border-ink bg-panel px-2 py-1 text-xs hover:bg-ink hover:text-canvas"
					>
						{copying ? 'Copied!' : 'Copy'}
					</button>
				</div>
			{/if}
		</div>
	</section>

	<div class="mt-6 flex items-center justify-between border-y-2 border-ink py-4">
		<a href="/" class="text-sm hover:text-primary">&larr; Home</a>
	</div>
</div>