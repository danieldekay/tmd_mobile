<script lang="ts">
	import { getConsentState, setConsent, resetConsent } from '$lib/consent';
	import type { ConsentState } from '$lib/consent';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';

	let consentState = $state(null as ConsentState | null);
	let saving = $state(false);

	onMount(() => {
		consentState = getConsentState();
	});

	function updateAnalytics(value: boolean) {
		saving = true;
		setConsent(value);
		consentState = getConsentState();
		saving = false;
	}

	function handleReset() {
		resetConsent();
		consentState = null;
	}
</script>

<svelte:head>
	<title>Cookie-Einstellungen &ndash; TMD Mobile</title>
	<meta name="description" content="Cookie- und Datenschutzeinstellungen verwalten" />
</svelte:head>

<div class="mx-auto max-w-lg">
	<h1 class="mb-6 font-display text-2xl font-bold text-ink">Cookie-Einstellungen</h1>

	<div class="space-y-6">
		{#if consentState}
			<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
				<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
					Analytische Cookies (Matomo)
				</h2>
				<p class="text-sm">
					{#if consentState.analytics}
						Sie haben analytische Cookies akzeptiert.
					{:else}
						Sie haben analytische Cookies abgelehnt.
					{/if}
				</p>
				<div class="flex gap-2">
					<button
						onclick={() => updateAnalytics(true)}
						class="button-primary px-4 py-2 text-sm"
						disabled={consentState.analytics || saving}
					>
						Akzeptieren
					</button>
					<button
						onclick={() => updateAnalytics(false)}
						class="button-secondary px-4 py-2 text-sm"
						disabled={!consentState.analytics || saving}
					>
						Ablehnen
					</button>
				</div>
			</section>

			<section class="rounded-control border-2 border-ink bg-panel p-4">
				<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
					Informationen
				</h2>
				<dl class="space-y-2 text-sm">
					<div>
						<dt class="font-semibold text-ink/60">Letzte Änderung</dt>
						<dd>{new Date(consentState.timestamp).toLocaleDateString('de-DE', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
							hour: '2-digit',
							minute: '2-digit'
						})}</dd>
					</div>
					<div>
						<dt class="font-semibold text-ink/60">Version</dt>
						<dd>{consentState.version}</dd>
					</div>
				</dl>
			</section>

			<section class="rounded-control border-2 border-ink bg-panel p-4">
				<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
					Zurücksetzen
				</h2>
				<p class="text-sm text-ink/60">
					Alle Einwilligungen löschen und neu gefragt werden.
				</p>
				<button
					onclick={handleReset}
					class="button-secondary px-4 py-2 text-sm text-red-600 hover:text-red-700"
				>
					Einwilligung zurücksetzen
				</button>
			</section>
		{:else}
			<section class="rounded-control border-2 border-ink bg-panel p-4">
				<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
					Keine Einstellungen gespeichert
				</h2>
				<p class="text-sm">
					Sie haben noch keine Cookie-Einstellungen getroffen.
					Bitte besuchen Sie die
					<a href={resolve('/')} class="underline hover:text-primary">Startseite</a>
					und nutzen Sie den Consent-Banner, um Ihre Präferenzen festzulegen.
				</p>
			</section>
		{/if}
	</div>

	<div class="mt-6 flex items-center justify-between border-y-2 border-ink py-4">
		<a href="/" class="text-sm hover:text-primary">&larr; Home</a>
		<nav class="flex gap-3 text-sm">
			<a href="/impressum" class="underline hover:text-primary">Impressum</a>
			<a href="/datenschutz" class="underline hover:text-primary">Datenschutz</a>
			<a href="/cookie-richtlinie" class="underline hover:text-primary">Cookie-Richtlinie</a>
		</nav>
	</div>
</div>
