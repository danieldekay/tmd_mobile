<script lang="ts">
	import {
		scheduleReminder,
		hasReminder,
		notificationsSupported,
		removeReminder
	} from '$lib/reminders';

	type Props = {
		eventId: number;
		eventTitle: string;
		registrationDate: string;
	};

	const { eventId, eventTitle, registrationDate }: Props = $props();

	let reminderSet = $state(false);
	let reminderDenied = $state(false);
	let reminderLoading = $state(false);

	$effect(() => {
		reminderSet = hasReminder(eventId);
	});

	async function toggleReminder() {
		if (reminderSet) {
			removeReminder(eventId);
			reminderSet = false;
			return;
		}
		reminderLoading = true;
		reminderDenied = false;
		const result = await scheduleReminder(eventId, eventTitle, registrationDate);
		reminderLoading = false;
		if (result.ok) {
			reminderSet = true;
		} else if (result.reason === 'permission-denied') {
			reminderDenied = true;
		}
	}
</script>

<div class="mt-2">
	{#if reminderDenied}
		<p class="text-sm text-accent" role="alert">
			Notification permission denied. Enable notifications in your browser settings to use reminders.
		</p>
	{:else if reminderSet}
		<div class="flex items-center gap-3">
			<p class="text-sm text-ink/60">Reminder set ✓</p>
			<button
				type="button"
				class="text-xs text-accent underline underline-offset-2"
				onclick={() => {
					removeReminder(eventId);
					reminderSet = false;
				}}
			>
				Remove
			</button>
		</div>
	{:else if notificationsSupported()}
		<button
			type="button"
			class="button-secondary text-sm"
			disabled={reminderLoading}
			onclick={() => void toggleReminder()}
		>
			{reminderLoading ? 'Setting reminder…' : 'Remind me when registration opens'}
		</button>
	{/if}
</div>
