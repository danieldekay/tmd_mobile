<script lang="ts">
	import { consentRequired, getConsent } from '$lib/consent';

	let showConsent = $state(false);

	if (consentRequired()) {
		showConsent = true;
	}
</script>

<svelte:head>
	<title>Datenschutzerklärung &ndash; TMD Mobile</title>
	<meta name="description" content="Datenschutzerklärung und Informationen zum Datenschutz TMD Mobile" />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mx-auto max-w-lg">
	<h1 class="mb-6 font-display text-2xl font-bold text-ink">Datenschutz&shy;erklärung</h1>

	{#if showConsent}
		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				Cookie-Einwilligung
			</h2>
			<p class="text-sm">
				Diese App verwendet Cookies. Analytische Cookies (Matomo) werden nur mit Ihrer
				Einwilligung eingesetzt. Sie können Ihre Einwilligung jederzeit über die
				<a href="/cookie-preferences" class="underline hover:text-primary">Cookie-Einstellungen</a>
				ändern.
			</p>
		</section>
	{/if}

	<div class="space-y-6">
		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				1. Verantwortlicher
			</h2>
			<p class="text-sm">
				Tango Marathon Directory e.V.<br>
				Mürkauerstraße 50, 53113 Bonn, Deutschland<br>
				E-Mail: <a href="mailto:kontakt@tangomarathons.com" class="underline hover:text-primary">kontakt@tangomarathons.com</a>
			</p>
		</section>

		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				2. Erhebung und Verarbeitung personenbezogener Daten
			</h2>
			<p class="text-sm">
				Diese App erhebt nur technisch notwendige Daten, die für den Betrieb erforderlich sind:
			</p>
			<ul class="list-disc space-y-1 pl-5 text-sm">
				<li>Gerätetyp und Browser (technisch notwendig für korrekte Darstellung)</li>
				<li>IP-Adresse (wird gekürzt, nur für technische Zwecke)</li>
				<li>Lokale Speicherung von Benutzerpräferenzen (z. B. Einwilligungsstatus)</li>
			</ul>
			<p class="text-sm text-ink/60">
				Keine dieser Daten wird an Dritte weitergegeben.
			</p>
		</section>

		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				3. Analytische Cookies (Matomo)
			</h2>
			<p class="text-sm">
				Wir verwenden <a href="https://matomo.org" target="_blank" rel="noopener noreferrer" class="underline hover:text-primary">Matomo</a>,
				eine First-Party-Analytics-Plattform, um die Nutzung dieser App zu analysieren und
				zu verbessern. Matomo wird auf unserem eigenen Server betrieben.
			</p>
			<p class="text-sm">
				Matomo sammelt folgende Daten:
			</p>
			<ul class="list-disc space-y-1 pl-5 text-sm">
				<li>Besuchte Seiten und Verweildauer</li>
				<li>Referrer (die Seite, von der Sie kamen)</li>
				<li>Geräteinformationen und Bildschirmauflösung</li>
				<li>Gekürzte IP-Adresse (wird innerhalb von 24 Stunden gelöscht)</li>
			</ul>
			<p class="text-sm">
				Die Nutzung von Matomo erfolgt nur mit Ihrer ausdrücklichen Einwilligung.
				Sie können diese jederzeit über die
				<a href="/cookie-preferences" class="underline hover:text-primary">Cookie-Einstellungen</a>
				widerrufen.
			</p>
		</section>

		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				4. Cookies
			</h2>
			<p class="text-sm">
				Diese App verwendet folgende Cookies:
			</p>
			<ul class="list-disc space-y-1 pl-5 text-sm">
				<li><strong>tmd_consent</strong>: Speichert Ihren Einwilligungsstatus (6 Monate)</li>
				<li><strong>tmd_matomo_queue</strong>: Warteschlange für Offline-Tracking (Sitzung)</li>
				<li><strong>tmd_saved_events</strong>: Gespeicherte Events (lokal, keine Serverübertragung)</li>
				<li><strong>tmd_reminders</strong>: Erinnerungs-Einstellungen (lokal)</li>
			</ul>
		</section>

		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				5. Ihre Rechte nach DSGVO
			</h2>
			<p class="text-sm">
				Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
			</p>
			<ul class="list-disc space-y-1 pl-5 text-sm">
				<li><strong>Recht auf Auskunft</strong> (Art. 15 DSGVO)</li>
				<li><strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)</li>
				<li><strong>Recht auf Löschung</strong> (Art. 17 DSGVO)</li>
				<li><strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
				<li><strong>Widerspruchsrecht</strong> (Art. 21 DSGVO)</li>
				<li><strong>Recht auf Widerruf der Einwilligung</strong> (Art. 7 Abs. 3 DSGVO)</li>
			</ul>
			<p class="text-sm">
				Bitte richten Sie Anfragen an: <a href="mailto:kontakt@tangomarathons.com" class="underline hover:text-primary">kontakt@tangomarathons.com</a>
			</p>
		</section>

		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				6. Datenschutzhinweise zum Einsatz von Matomo
			</h2>
			<p class="text-sm">
				Rechtsgrundlage für die Verarbeitung mittels Matomo ist Ihre Einwilligung
				(Art. 6 Abs. 1 lit. a DSGVO). Sie können diese jederzeit mit Wirkung für die Zukunft
				widerrufen über die <a href="/cookie-preferences" class="underline hover:text-primary">Cookie-Einstellungen</a>.
			</p>
		</section>

		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				7. Speicherdauer
			</h2>
			<p class="text-sm">
				Personenbezogene Daten werden nur so lange gespeichert, wie es für den jeweiligen
				Zweck erforderlich ist. Einwilligungsdaten werden für 6 Monate gespeichert.
				Matomo-Tracking-Daten werden nach 24 Stunden gekürzt.
			</p>
		</section>

		<div class="mt-6 flex items-center justify-between border-y-2 border-ink py-4">
			<a href="/" class="text-sm hover:text-primary">&larr; Home</a>

			<nav class="flex gap-3 text-sm">
				<a href="/impressum" class="underline hover:text-primary">Impressum</a>
				<a href="/cookie-richtlinie" class="underline hover:text-primary">Cookie-Richtlinie</a>
				<a href="/cookie-preferences" class="underline hover:text-primary">Cookie-Einstellungen</a>
			</nav>
		</div>
	</div>
</div>