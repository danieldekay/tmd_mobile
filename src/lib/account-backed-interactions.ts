/**
 * Account-backed interactions module.
 * Handles server-persisted bookmarks and reminders for authenticated users.
 * Works with /tmd/v3/user-interactions endpoint.
 */

import { get } from "svelte/store";
import { apiBaseUrl } from "$lib/api/tmd";
import { authState, isAuthenticated } from "$lib/auth";

export type InteractionType = "bookmark" | "reminder";
export type Interaction = {
	id: number;
	type: InteractionType;
	eventId: number;
	eventTitle?: string;
	remindAt?: number;
};

// In-memory cache
let interactionCache: Interaction[] | null = null;

/** Get auth token from store */
function getAuthToken(): string | null {
	return get(authState).authToken;
}

/** Fetch interactions from server */
export async function fetchServerInteractions(): Promise<Interaction[]> {
	const token = getAuthToken();
	if (!token) return [];

	try {
		const resp = await fetch(`${apiBaseUrl}/user-interactions`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!resp.ok) return [];

		const data = await resp.json();
		return (data?.interactions ?? []) as Interaction[];
	} catch {
		return [];
	}
}

/** Create an interaction on the server */
export async function createInteraction(
	type: InteractionType,
	eventId: number,
	eventTitle?: string,
): Promise<Interaction | null> {
	const token = getAuthToken();
	if (!token) return null;

	try {
		const resp = await fetch(`${apiBaseUrl}/user-interactions`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				interaction_type: type,
				target_post_id: eventId,
				target_post_type: "tmd_event",
				reminder_note: eventTitle
					? `Registration opens for ${eventTitle}`
					: undefined,
			}),
		});

		if (!resp.ok) return null;

		const data = await resp.json();
		return data?.interaction ?? null;
	} catch {
		return null;
	}
}

/** Delete an interaction on the server */
export async function deleteInteraction(
	interactionId: number,
): Promise<boolean> {
	const token = getAuthToken();
	if (!token) return false;

	try {
		const resp = await fetch(
			`${apiBaseUrl}/user-interactions/${interactionId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);

		return resp.ok;
	} catch {
		return false;
	}
}

/** Check if user has bookmarked an event (from cache or server) */
export async function hasBookmarked(eventId: number): Promise<boolean> {
	if (!isAuthenticated()) return false;

	if (!interactionCache) {
		interactionCache = await fetchServerInteractions();
	}

	return interactionCache.some(
		(i) => i.type === "bookmark" && i.eventId === eventId,
	);
}

/** Toggle bookmark for an event */
export async function toggleBookmark(
	eventId: number,
	eventTitle?: string,
): Promise<{ bookmarked: boolean; id?: number } | null> {
	if (!isAuthenticated()) return null;

	// Refresh cache
	if (!interactionCache) {
		interactionCache = await fetchServerInteractions();
	}

	const existing = interactionCache.find(
		(i) => i.type === "bookmark" && i.eventId === eventId,
	);

	if (existing) {
		// Delete
		const success = await deleteInteraction(existing.id);
		if (success) {
			interactionCache = interactionCache.filter((i) => i.id !== existing.id);
			return { bookmarked: false };
		}
		return null;
	} else {
		// Create
		const newInteraction = await createInteraction(
			"bookmark",
			eventId,
			eventTitle,
		);
		if (newInteraction) {
			interactionCache = [...interactionCache, newInteraction];
			return { bookmarked: true, id: newInteraction.id };
		}
		return null;
	}
}

/** Load interactions on login */
export async function loadInteractionsOnLogin(): Promise<void> {
	interactionCache = await fetchServerInteractions();
}

/** Clear cache on logout */
export function clearInteractionCache(): void {
	interactionCache = null;
}
