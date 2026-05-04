<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import PwaPrompts from '$lib/components/PwaPrompts.svelte';
	import { checkDueReminders } from '$lib/reminders';
	import { initAuth, logout, authState } from '$lib/auth';
	import { initSavedEvents, resetSavedEventsState } from '$lib/saved-events';

	let { children } = $props();

	const currentYear = new Date().getFullYear();
	type NavHref = '/' | '/events' | '/calendar' | '/map' | '/djs' | '/saved';

	const navItems: Array<{ href: NavHref; label: string }> = [
		{ href: '/', label: 'Now' },
		{ href: '/events', label: 'Events' },
		{ href: '/calendar', label: 'Calendar' },
		{ href: '/map', label: 'Map' },
		{ href: '/djs', label: 'DJs' },
		{ href: '/saved', label: 'Saved' }
	];

	onMount(async () => {
		await initAuth();
		await initSavedEvents();
		checkDueReminders();
	});

	function isActive(pathname: string, href: NavHref): boolean {
		return href === '/' ? pathname === '/' : pathname.startsWith(href);
	}

	function handleLogout(): void {
		logout();
		resetSavedEventsState();
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
	<header class="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
		<div class="px-4 py-4">
			<div class="flex items-center justify-between gap-4">
				<a href={resolve('/')} class="flex min-w-0 items-center gap-3" aria-label="TMD Mobile home">
					<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-panel bg-primary font-display text-xl font-bold text-white">
						T
					</div>
					<div class="min-w-0">
						<p class="font-display text-xl font-bold text-ink">TMD Mobile</p>
						<p class="truncate text-sm text-muted">Tango Marathon Directory</p>
					</div>
				</a>
				<div class="flex items-center gap-2">
					<a class="button-secondary min-h-11 px-3 py-2 text-sm" href={resolve('/settings')}>Setup</a>
					{#if $authState.authToken}
						<button
							class="button-secondary min-h-11 px-3 py-2 text-sm"
							type="button"
							onclick={handleLogout}
						>
							Log out
						</button>
					{:else}
						<a class="button-primary min-h-11 px-3 py-2 text-sm" href={resolve('/login')}>Log in</a>
					{/if}
				</div>
			</div>

			<nav class="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Primary navigation">
				{#each navItems as item (item.href)}
					<a
						href={resolve(item.href)}
						class="nav-link {isActive($page.url.pathname, item.href) ? 'nav-link-active' : 'nav-link-idle'}"
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

	<footer class="border-t border-line px-4 py-6">
		<div class="space-y-2 text-sm text-muted">
			<p>Version {typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : 'dev'}</p>
			<p>Prepared for Cloudflare Worker Assets as <span class="font-semibold text-ink">tmd-mobile</span>.</p>
			<p>Custom domain target: mobile.tangomarathons.com, pending Cloudflare DNS and route setup.</p>
			<p>&copy; {currentYear} Tango Marathon Directory</p>
		</div>
	</footer>
</div>
