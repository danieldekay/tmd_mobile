/**
 * Registration reminders via the Web Notifications API.
 *
 * Stores reminder metadata in localStorage under "tmd_reminders".
 * On app start, call `checkDueReminders()` to fire any overdue reminders.
 */

const STORAGE_KEY = 'tmd_reminders';

export type ReminderEntry = {
	eventId: number;
	eventTitle: string;
	remindAt: number; // Unix ms timestamp
};

/** Result of attempting to schedule a reminder. */
export type ReminderResult =
	| { ok: true }
	| { ok: false; reason: 'permission-denied' | 'not-supported' | 'already-set' };

// ── Storage helpers ────────────────────────────────────────────────────────

function readReminders(): ReminderEntry[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed as ReminderEntry[];
	} catch {
		return [];
	}
}

function writeReminders(entries: ReminderEntry[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
	} catch {
		// Ignore quota/unavailable errors
	}
}

// ── Public API ─────────────────────────────────────────────────────────────

/** Returns true if the Notifications API is available in this browser. */
export function notificationsSupported(): boolean {
	return typeof Notification !== 'undefined';
}

/** Returns the current notification permission state. */
export function notificationPermission(): NotificationPermission {
	if (!notificationsSupported()) return 'denied';
	return Notification.permission;
}

/**
 * Schedule a reminder notification for an event's registration date.
 *
 * Requests notification permission if not yet granted.
 * Stores the reminder in localStorage to be fired on next app load if the
 * date has passed, or via a setTimeout if the app stays open.
 */
export async function scheduleReminder(
	eventId: number,
	eventTitle: string,
	registrationDate: string
): Promise<ReminderResult> {
	if (!notificationsSupported()) {
		return { ok: false, reason: 'not-supported' };
	}

	// Check if already set
	const existing = readReminders();
	if (existing.some((r) => r.eventId === eventId)) {
		return { ok: false, reason: 'already-set' };
	}

	// Request permission if needed
	if (Notification.permission === 'default') {
		const granted = await Notification.requestPermission();
		if (granted !== 'granted') {
			return { ok: false, reason: 'permission-denied' };
		}
	} else if (Notification.permission === 'denied') {
		return { ok: false, reason: 'permission-denied' };
	}

	const remindAt = new Date(registrationDate).getTime();
	const entry: ReminderEntry = { eventId, eventTitle, remindAt };

	writeReminders([...existing, entry]);
	scheduleTimeout(entry);

	return { ok: true };
}

/** Remove a reminder for an event. */
export function removeReminder(eventId: number): void {
	const entries = readReminders().filter((r) => r.eventId !== eventId);
	writeReminders(entries);
}

/** Returns true if a reminder is already set for the given event. */
export function hasReminder(eventId: number): boolean {
	return readReminders().some((r) => r.eventId === eventId);
}

/**
 * Fire in-memory setTimeout for an entry if its time is still in the future.
 * Call on app start to rehydrate pending reminders.
 */
function scheduleTimeout(entry: ReminderEntry): void {
	const delay = entry.remindAt - Date.now();
	if (delay > 0 && delay < 2_147_483_647) {
		setTimeout(() => {
			fireNotification(entry);
		}, delay);
	}
}

function fireNotification(entry: ReminderEntry): void {
	if (!notificationsSupported() || Notification.permission !== 'granted') return;
	new Notification(`Registration opens: ${entry.eventTitle}`, {
		body: 'Registration is now open for this tango event.',
		icon: '/favicon.png'
	});
	// Clean up after firing
	removeReminder(entry.eventId);
}

/**
 * Called on app start to fire any overdue reminders and re-schedule future ones.
 */
export function checkDueReminders(): void {
	if (!notificationsSupported() || Notification.permission !== 'granted') return;
	const now = Date.now();
	const entries = readReminders();
	const remaining: ReminderEntry[] = [];

	for (const entry of entries) {
		if (entry.remindAt <= now) {
			fireNotification(entry);
		} else {
			remaining.push(entry);
			scheduleTimeout(entry);
		}
	}
	writeReminders(remaining);
}
