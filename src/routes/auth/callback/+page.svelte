<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { authState, exchangeSsoCode } from '$lib/auth';

	let status = $state<'loading' | 'error' | 'redirecting'>('loading');
	let errorMessage = $state<string | null>(null);

	// Redirect if already authenticated
	$effect(() => {
		if ($authState.authToken !== null) {
			void goto(resolve('/profile'));
		}
	});

	onMount(() => {
		void handleCallback();
	});

	async function handleCallback(): Promise<void> {
		const code = $page.url.searchParams.get('code');
		const state = $page.url.searchParams.get('state');

		// No code — direct navigation without SSO flow
		if (!code) {
			void goto(resolve('/login'));
			return;
		}

		// Verify CSRF nonce
		const storedNonce = sessionStorage.getItem('sso_nonce');
		if (!state || state !== storedNonce) {
			status = 'error';
			errorMessage = 'Login failed: invalid state parameter. Please try again.';
			return;
		}

		// Clean up nonce
		sessionStorage.removeItem('sso_nonce');

		try {
			await exchangeSsoCode(code);
			status = 'redirecting';
			void goto(resolve('/profile'));
		} catch (err) {
			status = 'error';
			errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
		}
	}
</script>

<svelte:head>
	<title>Completing sign-in — TMD</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 py-12 text-center">
	{#if status === 'loading' || status === 'redirecting'}
		<div class="flex flex-col items-center gap-4">
			<svg
				class="h-8 w-8 animate-spin text-primary"
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
			<p class="text-sm text-ink/60">Completing sign-in…</p>
		</div>
	{:else if status === 'error'}
		<div class="flex flex-col items-center gap-4">
			<p
				class="rounded-control border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
				role="alert"
			>
				{errorMessage}
			</p>
			<a href={resolve('/login')} class="button-secondary text-sm"> Back to login </a>
		</div>
	{/if}
</div>
