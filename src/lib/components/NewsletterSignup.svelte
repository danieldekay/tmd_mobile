<script lang="ts">
	import { trackEvent } from '$lib/matomo';

	let { className = '' }: { className?: string } = $props();

	let email = $state('');
	let loading = $state(false);
	let error = $state<string | null>(null);
	let success = $state(false);

	function doSubscribe(): void {
		if (!email) { error = 'Please enter your email.'; return; }
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			error = 'Please enter a valid email address.';
			return;
		}
		loading = true;
		error = null;
		success = false;

		const sendyUrl = import.meta.env.PUBLIC_SENDY_URL;
		if (!sendyUrl) {
			error = 'Newsletter is not configured.';
			loading = false;
			return;
		}

		const body = new URLSearchParams({
			email,
			list: import.meta.env.PUBLIC_SENDY_LIST ?? ''
		}).toString();

		const xhr = new XMLHttpRequest();
		xhr.open('POST', sendyUrl + '/subscribe', true);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onload = () => {
			if (xhr.status === 200 || xhr.status === 403) {
				loading = false;
				success = true;
				email = '';
				trackEvent('Newsletter', 'Subscribe');
			} else {
				loading = false;
				error = 'Subscription failed. Please try again.';
			}
		};
		xhr.onerror = () => {
			loading = false;
			error = 'Network error. Please check your connection.';
		};
		xhr.send(body);
	}

	function handleUnsubscribe(): void {
		const sendyUrl = import.meta.env.PUBLIC_SENDY_URL;
		if (!sendyUrl) { error = 'Newsletter service is not configured.'; return; }
		const list = import.meta.env.PUBLIC_SENDY_LIST ?? '';
		const emailParam = email ? `&email=${encodeURIComponent(email)}` : '';
		trackEvent('Newsletter', 'Unsubscribe', email || 'unknown');
		window.location.href = `${sendyUrl}/unsubscribe?list=${encodeURIComponent(list)}${emailParam}`;
	}
</script>

<div class={'space-y-4' + (className ? ' ' + className : '')}>
	{#if success}
		<div class="panel p-4 bg-canvas">
			<p class="font-semibold text-ink">✓ Subscribed!</p>
			<p class="text-sm text-ink/60">Check your inbox for confirmation.</p>
		</div>
	{:else}
		<form onsubmit={(e) => { e.preventDefault?.(); doSubscribe(); }}>
			<input
				bind:value={email}
				type="email"
				placeholder="your@email.com"
				class="w-full border-2 border-ink bg-canvas px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
				required
			/>
			<button type="button" disabled={loading} class="button-primary w-full mt-2"
				onclick={doSubscribe}>
				{loading ? 'Subscribing...' : 'Subscribe'}
			</button>
			{#if error}
				<p class="text-xs text-accent/80 mt-1">{error}</p>
			{/if}
		</form>
	{/if}

	{#if !success}
		<div class="text-center">
			<button
				onclick={handleUnsubscribe}
				class="text-xs text-ink/50 underline hover:text-ink/80 bg-transparent border-none cursor-pointer"
				type="button"
			>
				Unsubscribe
			</button>
		</div>
	{/if}
</div>
