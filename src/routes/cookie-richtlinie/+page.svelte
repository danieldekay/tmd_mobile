<script lang="ts">
</script>

<svelte:head>
	<title>Cookie-Richtlinie &ndash; TMD Mobile</title>
	<meta name="description" content="Cookie-Richtlinie und Cookie-Einstellungen TMD Mobile" />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mx-auto max-w-lg">
	<h1 class="mb-6 font-display text-2xl font-bold text-ink">Cookie-Richtlinie</h1>

	<div class="space-y-6">
		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				Wichtige Hinweise
			</h2>
			<p class="text-sm">
				Diese App verwendet technisch notwendige Cookies sowie optionale analytische Cookies. 
				Sie können Ihre Präferenzen jederzeit über den Cookie-Banner oder die Fußzeile ändern.
			</p>
		</section>

		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				Cookie-Tabelle
			</h2>
			<table class="w-full text-xs">
				<thead>
					<tr class="border-b border-ink/20">
						<th class="text-left font-semibold">Name</th>
						<th class="text-left font-semibold">Zweck</th>
						<th class="text-left font-semibold">Laufzeit</th>
					</tr>
				</thead>
				<tbody class="space-y-2">
					<tr>
						<td class="font-mono">tmd_consent</td>
						<td>Einwilligungsstatus</td>
						<td>6 Monate</td>
					</tr>
					<tr>
						<td class="font-mono">tmd_matomo_queue</td>
						<td>Offline-Tracking-Warteschlange</td>
						<td>Sitzung</td>
					</tr>
				</tbody>
			</table>
		</section>

		<div class="mt-6 flex items-center justify-between border-y-2 border-ink py-4">
			<a href="/" class="text-sm hover:text-primary">&larr; Home</a>

			<nav class="flex gap-3 text-sm">
				<a href="/impressum" class="underline hover:text-primary">Impressum</a>
				<a href="/datenschutz" class="underline hover:text-primary">Datenschutz</a>
			</nav>
		</div>
	</div>
</div>