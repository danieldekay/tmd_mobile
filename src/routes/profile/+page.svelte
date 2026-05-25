<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authState, logout } from '$lib/auth';
	import { resetSavedEventsState } from '$lib/saved-events';

	// Set to true before logout() clears authToken so the auth guard below
	// doesn't navigate to /login while handleLogout is navigating to /.
	let navigated = $state(false);

	// Auth guard: redirect to login when not authenticated.
	$effect(() => {
		if ($authState.initialized && $authState.authToken === null && !navigated) {
			navigated = true;
			void goto(resolve('/login'));
		}
	});

	async function handleLogout(): Promise<void> {
		navigated = true; // block auth guard before authToken is cleared
		logout();
		resetSavedEventsState();
		await goto(resolve('/'));
	}

	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((part) => part[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<svelte:head>
	<title>Your Profile — TMD</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 py-12">
	{#if $authState.user}
		{@const user = $authState.user}
		<div class="mb-8 flex flex-col items-center gap-4">
			{#if user.avatarUrl}
				<img
					src={user.avatarUrl}
					alt="Avatar for {user.name}"
					class="h-20 w-20 rounded-full border-2 border-ink object-cover"
					onerror={(e) => {
						(e.currentTarget as HTMLImageElement).style.display = 'none';
					}}
				/>
			{:else}
				<div
					class="flex h-20 w-20 items-center justify-center rounded-full bg-primary font-display text-2xl font-bold text-ink"
					aria-hidden="true"
				>
					{getInitials(user.name)}
				</div>
			{/if}
			<div class="text-center">
				<h1 class="text-2xl font-semibold text-ink">{user.name}</h1>
				<p class="mt-1 text-sm text-ink/60">{user.email}</p>
			</div>
		</div>

		<button type="button" onclick={handleLogout} class="button-secondary w-full"> Log out </button>
	{:else}
		<p class="text-sm text-ink/60">Redirecting…</p>
	{/if}
</div>
