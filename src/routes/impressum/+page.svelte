<script lang="ts">
	import LegalPage from '$lib/components/LegalPage.svelte';

	const disclaimerContent = `
**Haftungsausschluss**

Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
Vollständigkeit und Aktualität der Inhalte übernehmen wir keine Gewähr.

**Haftung für Links**

Dieses Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir
keinen Einfluss haben. Deshalb können wir für diese Fremdinhalte auch keine Gewähr
übernehmen.

**Urheberrecht**

Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen
dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen
Zustimmung des jeweiligen Autors bzw. Erstellers.
`.trim();
</script>

<svelte:head>
	<title>Impressum &ndash; TMD Mobile</title>
	<meta name="description" content="Impressum und rechtliche Hinweise TMD Mobile" />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="mx-auto max-w-lg">
	<h1 class="mb-6 font-display text-2xl font-bold text-ink">Impressum</h1>

	<div class="space-y-6">
		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				Angaben gemäß &sect; 5 TMG
			</h2>

			<dl class="space-y-2 text-sm">
				<div>
					<dt class="font-semibold text-ink">Anbieter der Seite</dt>
					<dd>Tango Marathon Directory e.V.</dd>
				</div>
				<div>
					<dt class="font-semibold text-ink">Adresse</dt>
					<dd>Mürkauerstraße 50, 53113 Bonn, Deutschland</dd>
				</div>
				<div>
					<dt class="font-semibold text-ink">Kontakt</dt>
					<dd>
						<a
							href="mailto:kontakt@tangomarathons.com"
							class="underline hover:text-primary"
							>kontakt@tangomarathons.com</a
						>
					</dd>
				</div>
				<div>
					<dt class="font-semibold text-ink">Handelsregister</dt>
					<dd>Amtsgericht Bonn, HRB 12345</dd>
				</div>
				<div>
					<dt class="font-semibold text-ink">Umsatzsteuer-Id.</dt>
					<dd>DE123456789</dd>
				</div>
			</dl>
		</section>

		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				Verantwortlich für den Inhalt
			</h2>
			<p class="text-sm">
				Dieselbe Verantwortlichkeit wie für die Homepage unter
				<a
					href="https://www.tangomarathons.com"
					target="_blank"
					rel="noopener noreferrer"
					class="underline hover:text-primary"
					>www.tangomarathons.com</a
				>.
			</p>
		</section>

		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				Online-Streitbeilegung
			</h2>
			<p class="text-sm">
				欧盟欧罗巴委员会提供在线争议解决平台：
				<a
					href="https://ec.europa.eu/consumers/odr"
					target="_blank"
					rel="noopener noreferrer"
					class="underline hover:text-primary"
					>https://ec.europa.eu/consumers/odr</a
				>
				.
			</p>
			<p class="text-sm text-ink/60">
				Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
				Verbraucherschlichtungsstelle teilzunehmen.
			</p>
		</section>

		<section class="space-y-3 rounded-control border-2 border-ink bg-panel p-4">
			<h2 class="font-display text-sm font-bold uppercase tracking-wider text-ink/60">
				Streitbeilegung
			</h2>
			<div class="whitespace-pre-line text-sm">{disclaimerContent}</div>
		</section>

		<div class="mt-6 flex items-center justify-between border-y-2 border-ink py-4">
			<a href="/" class="text-sm hover:text-primary">&larr; Home</a>

			<nav class="flex gap-3 text-sm">
				<a href="/datenschutz" class="underline hover:text-primary">Datenschutz</a>
				<a href="/cookie-richtlinie" class="underline hover:text-primary">Cookie-Richtlinie</a>
			</nav>
		</div>
	</div>
</div>
