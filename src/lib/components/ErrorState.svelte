<script lang="ts">
	type Props = {
		/** Main heading text */
		title: string;
		/** Optional detail message */
		message?: string;
		/** Use accent color for the title (retryable errors). Defaults to false (not-found). */
		accent?: boolean;
		/** For not-found states: href to navigate back */
		backHref?: string;
		/** Label for the back link. Defaults to "Go back". */
		backLabel?: string;
		/** For retryable errors: callback fired when "Try again" is clicked */
		onRetry?: () => void;
	};

	const { title, message, accent = false, backHref, backLabel = 'Go back', onRetry }: Props =
		$props();
</script>

<div class="panel p-5" role="alert">
	<p class="font-semibold" class:text-accent={accent}>{title}</p>
	{#if message}
		<p class="mt-1 text-sm text-ink/60">{message}</p>
	{/if}
	{#if onRetry}
		<button class="button-secondary mt-4 text-sm" type="button" onclick={onRetry}>Try again</button>
	{:else if backHref}
		<a class="button-secondary mt-4 inline-block text-sm" href={backHref}>{backLabel}</a>
	{/if}
</div>
