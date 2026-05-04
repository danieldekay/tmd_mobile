import { writable, get } from 'svelte/store';
import { graphqlUrl, LOGIN_MUTATION, REFRESH_TOKEN_MUTATION } from '$lib/api/graphql';

type User = { id: string; name: string; email: string };

type AuthState = {
	user: User | null;
	authToken: string | null;
	refreshToken: string | null;
};

const AUTH_TOKEN_KEY = 'tmd_auth_token';
const REFRESH_TOKEN_KEY = 'tmd_refresh_token';

export const authState = writable<AuthState>({
	user: null,
	authToken: null,
	refreshToken: null,
});

export function isAuthenticated(): boolean {
	return get(authState).authToken !== null;
}

let _authInitialized = false;

export async function initAuth(): Promise<void> {
	if (_authInitialized) return;
	_authInitialized = true;
	const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
	const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

	if (authToken) {
		authState.update((s) => ({ ...s, authToken, refreshToken }));
	} else if (refreshToken) {
		authState.update((s) => ({ ...s, refreshToken }));
		await refreshAuthToken();
	}
}

type LoginResponse = {
	data?: {
		login?: {
			authToken: string;
			refreshToken: string;
			user: User;
		};
	};
	errors?: Array<{ message: string }>;
};

export async function login(username: string, password: string): Promise<void> {
	const response = await fetch(graphqlUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query: LOGIN_MUTATION,
			variables: { input: { clientMutationId: 'tmd-mobile', username, password } },
		}),
	});

	if (!response.ok) {
		throw new Error(`Login request failed (HTTP ${response.status})`);
	}

	const data = (await response.json()) as LoginResponse;
	if (data.errors?.length) {
		throw new Error(data.errors[0].message);
	}

	const result = data.data?.login;
	if (!result) throw new Error('Login returned no data');

	localStorage.setItem(AUTH_TOKEN_KEY, result.authToken);
	localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
	authState.set({ user: result.user, authToken: result.authToken, refreshToken: result.refreshToken });
}

type RefreshResponse = {
	data?: { refreshJwtAuthToken?: { authToken: string } };
	errors?: Array<{ message: string }>;
};

export async function refreshAuthToken(): Promise<boolean> {
	const { refreshToken } = get(authState);
	if (!refreshToken) return false;

	try {
		const response = await fetch(graphqlUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				query: REFRESH_TOKEN_MUTATION,
				variables: { input: { clientMutationId: 'tmd-mobile', jwtRefreshToken: refreshToken } },
			}),
		});

		if (!response.ok) return false;

		const data = (await response.json()) as RefreshResponse;
		const token = data.data?.refreshJwtAuthToken?.authToken;
		if (!token) return false;

		localStorage.setItem(AUTH_TOKEN_KEY, token);
		authState.update((s) => ({ ...s, authToken: token }));
		return true;
	} catch {
		return false;
	}
}

export function logout(): void {
	localStorage.removeItem(AUTH_TOKEN_KEY);
	localStorage.removeItem(REFRESH_TOKEN_KEY);
	authState.set({ user: null, authToken: null, refreshToken: null });
	// Reset init flag so initAuth() works correctly after the user logs in again
	_authInitialized = false;
}
