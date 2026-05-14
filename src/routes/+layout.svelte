<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import PwaPrompts from '$lib/components/PwaPrompts.svelte';
	import PwaUpdateBanner from '$lib/components/PwaUpdateBanner.svelte';
	import ConsentBanner from '$lib/components/ConsentBanner.svelte';
	import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
	import { checkDueReminders } from '$lib/reminders';
	import { initAuth, authState } from '$lib/auth';
	import { initSavedEvents } from '$lib/saved-events';
	import { setupBeforeInstallPromptListener, setupAppInstalledListener } from '$lib/utils/pwa-install';

	let { children } = $props();

	const currentYear = new Date().getFullYear();
	type NavHref =
		| '/'
		| '/events'
		| '/calendar'
		| '/map'
		| '/djs'
		| '/teachers'
		| '/blog'
		| '/saved'
		| '/changelog'
			| '/newsletter';

	const navItems: Array<{ href: NavHref; label: string }> = [
		{ href: '/', label: 'Now' },
		{ href: '/events', label: 'Events' },
		{ href: '/calendar', label: 'Calendar' },
		{ href: '/map', label: 'Map' },
		{ href: '/djs', label: 'DJs' },
		{ href: '/teachers', label: 'Teachers' },
		{ href: '/blog', label: 'Blog' },
		{ href: '/saved', label: 'Saved' },
		{ href: '/changelog', label: "What's New" },
		{ href: '/newsletter', label: 'Newsletter' }
	];

	onMount(async () => {
		// Set up PWA install listeners
		setupBeforeInstallPromptListener();
		setupAppInstalledListener();

		await initAuth();
		await initSavedEvents();
		checkDueReminders();

		// Set up PWA update detection
		import('$lib/utils/pwa-update').then(({ checkForBuildVersion, setupUpdateListener }) => {
			checkForBuildVersion();
			setupUpdateListener();
		});
	});

	function isActive(pathname: string, href: NavHref): boolean {
		return href === '/' ? pathname === '/' : pathname.startsWith(href);
	}
</script>

<svelte:head>
	<title>TMD Mobile</title>
	<meta
		name="description"
		content="Mobile-first app shell for Tango Marathon Directory events, DJs, teachers, series, and registration data."
	/>
</svelte:head>

<a class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-panel focus:px-4 focus:py-3 focus:shadow-panel" href="#main-content">
	Skip to content
</a>

<div class="app-shell">
	<header class="sticky top-0 z-40 border-b-2 border-ink bg-canvas">
		<div class="px-4 py-4">
			<div class="flex items-center justify-between gap-4">
				<a href={resolve('/')} class="flex min-w-0 items-center gap-3" aria-label="TMD Mobile home">
					<div class="flex h-11 w-11 shrink-0 items-center justify-center bg-primary font-display text-xl font-bold text-ink">
						T
					</div>
					<div class="min-w-0">
						<p class="font-display text-xl font-bold text-ink">TMD Mobile</p>
						<p class="truncate text-sm text-ink/60">Tango Marathon Directory</p>
					</div>
				</a>
				<div class="flex items-center gap-2">
					<a class="button-secondary min-h-11 px-3 py-2 text-sm" href={resolve('/settings')}>Setup</a>
					{#if $authState.user}
						<a
							href={resolve('/profile')}
							class="flex min-h-11 items-center gap-2 rounded-control border-2 border-ink bg-canvas px-3 py-2 text-sm font-medium text-ink hover:bg-ink hover:text-canvas"
							aria-label="View profile for {$authState.user.name}"
						>
							{#if $authState.user.avatarUrl}
								<img
									src={$authState.user.avatarUrl}
									alt=""
									class="h-6 w-6 rounded-full border border-ink object-cover"
									aria-hidden="true"
								/>
							{:else}
								<span
									class="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-display text-xs font-bold text-ink"
									aria-hidden="true"
								>
									{$authState.user.name.slice(0, 1).toUpperCase()}
								</span>
							{/if}
							<span class="max-w-[8rem] truncate">{$authState.user.name}</span>
						</a>
					{:else}
						<a class="button-primary min-h-11 px-3 py-2 text-sm" href={resolve('/login')}>Log in</a>
					{/if}
				</div>
			</div>

			<nav class="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Primary navigation">
				{#each navItems as item (item.href)}
					<a
						href={resolve(item.href)}
						class="nav-link {isActive(page.url.pathname, item.href) ? 'nav-link-active' : 'nav-link-idle'}"
					>
						{item.label}
					</a>
				{/each}
			</nav>
		</div>
	</header>

	<main id="main-content" class="flex-1 px-4 py-5">
		{@render children()}
	</main>

	<PwaPrompts />
	<PwaUpdateBanner />
	<ConsentBanner />

	<footer class="border-t-2 border-ink px-4 py-6">
		<NewsletterSignup className="mb-4" />
		<div class="space-y-3 text-sm text-ink/60">
			<p>
				v{__APP_VERSION__} · <a href={resolve('/changelog')} class="underline hover:text-ink">{__BUILD_HASH__}</a>
			</p>
			<div class="flex flex-wrap gap-x-4 gap-y-1">
				<a href="https://www.tangomarathons.com" target="_blank" rel="noopener noreferrer" class="hover:text-ink">tangomarathons.com</a>
				<a href={resolve('/impressum')} class="hover:text-ink">Impressum</a>
				<a href={resolve('/datenschutz')} class="hover:text-ink">Datenschutz</a>
				<a href={resolve('/cookie-richtlinie')} class="hover:text-ink">Cookie-Richtlinie</a>
				<a href={resolve('/info')} class="hover:text-ink">App Info</a>
			</div>
			<p>&copy; {currentYear} Tango Marathon Directory</p>
		</div>
	</footer>
</div>
