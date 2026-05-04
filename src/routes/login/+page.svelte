<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { login, authState } from '$lib/auth';

	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let errorMessage = $state<string | null>(null);

	// Redirect if already authenticated (reactive — handles both initial state and
	// auth state set by the layout's initAuth)
	$effect(() => {
		if ($authState.authToken !== null) {
			void goto(resolve('/events'));
		}
	});

	async function handleSubmit(e: SubmitEvent): Promise<void> {
		e.preventDefault();
		isLoading = true;
		errorMessage = null;
		try {
			await login(username, password);
			void goto(resolve('/events'));
		} catch (err) {
			errorMessage =
				err instanceof Error ? err.message : 'Login failed. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Log in — TMD</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 py-12">
	<h1 class="mb-2 text-2xl font-semibold text-ink">Log in to TMD</h1>
	<p class="mb-8 text-sm text-muted">Save events and sync across devices.</p>

	<form class="flex flex-col gap-4" onsubmit={handleSubmit}>
		{#if errorMessage}
			<div
				class="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
				role="alert"
			>
				{errorMessage}
			</div>
		{/if}

		<div class="flex flex-col gap-1">
			<label class="text-sm font-medium text-ink" for="username">Username or email</label>
			<input
				id="username"
				type="text"
				autocomplete="username"
				required
				bind:value={username}
				class="rounded-control border border-line bg-canvas px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
			/>
		</div>

		<div class="flex flex-col gap-1">
			<label class="text-sm font-medium text-ink" for="password">Password</label>
			<input
				id="password"
				type="password"
				autocomplete="current-password"
				required
				bind:value={password}
				class="rounded-control border border-line bg-canvas px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-primary/40"
			/>
		</div>

		<button
			type="submit"
			disabled={isLoading}
			class="button-primary mt-2 flex h-11 items-center justify-center gap-2 disabled:opacity-60"
		>
			{#if isLoading}
				<svg
					class="h-4 w-4 animate-spin"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					/>
				</svg>
				Logging in…
			{:else}
				Log in
			{/if}
		</button>
	</form>

	<p class="mt-6 text-sm text-muted">
		Forgot your password?
		<a
			href="https://www.tangomarathons.com/wp-login.php?action=lostpassword"
			target="_blank"
			rel="noopener noreferrer"
			class="text-primary underline-offset-2 hover:underline"
		>
			Reset it on tangomarathons.com
		</a>
	</p>
</div>
