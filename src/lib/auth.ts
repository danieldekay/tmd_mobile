import { writable, get } from 'svelte/store';
import { graphqlUrl, LOGIN_MUTATION, REFRESH_TOKEN_MUTATION, GET_VIEWER_QUERY } from '$lib/api/graphql';

export type User = { id: string; name: string; email: string; avatarUrl: string | null };

type AuthState = {
	user: User | null;
	authToken: string | null;
	refreshToken: string | null;
	initialized: boolean;
};

const AUTH_TOKEN_KEY = 'tmd_auth_token';
const REFRESH_TOKEN_KEY = 'tmd_refresh_token';
const USER_KEY = 'tmd_auth_user';
const SESSION_TS_KEY = 'tmd_session_ts';
const SESSION_MAX_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export const authState = writable<AuthState>({
	user: null,
	authToken: null,
	refreshToken: null,
	initialized: false,
});

export function isAuthenticated(): boolean {
	return get(authState).authToken !== null;
}

let _authInitialized = false;

type ViewerResponse = {
	data?: {
		viewer?: { id: string; name: string; email: string; avatar?: { url?: string } };
	};
	errors?: Array<{ message: string }>;
};

async function fetchViewer(authToken: string): Promise<User | null> {
	try {
		const response = await fetch(graphqlUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
			body: JSON.stringify({ query: GET_VIEWER_QUERY }),
		});
		if (!response.ok) return null;
		const data = (await response.json()) as ViewerResponse;
		const v = data.data?.viewer;
		if (!v) return null;
		return { id: v.id, name: v.name, email: v.email, avatarUrl: v.avatar?.url ?? null };
	} catch {
		return null;
	}
}

function clearSession(): void {
	localStorage.removeItem(AUTH_TOKEN_KEY);
	localStorage.removeItem(REFRESH_TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
	localStorage.removeItem(SESSION_TS_KEY);
}

export async function initAuth(): Promise<void> {
	if (_authInitialized) return;
	_authInitialized = true;

	// Expire sessions older than 14 days
	const sessionTs = localStorage.getItem(SESSION_TS_KEY);
	if (sessionTs && Date.now() - Number(sessionTs) > SESSION_MAX_MS) {
		clearSession();
		authState.update((s) => ({ ...s, initialized: true }));
		return;
	}

	const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
	const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
	const storedUser = localStorage.getItem(USER_KEY);
	const user: User | null = storedUser ? (JSON.parse(storedUser) as User) : null;

	if (authToken) {
		authState.update((s) => ({ ...s, authToken, refreshToken, user }));
	} else if (refreshToken) {
		authState.update((s) => ({ ...s, refreshToken }));
		const refreshed = await refreshAuthToken();
		if (refreshed && !user) {
			const currentToken = get(authState).authToken;
			if (currentToken) {
				const fetchedUser = await fetchViewer(currentToken);
				if (fetchedUser) {
					localStorage.setItem(USER_KEY, JSON.stringify(fetchedUser));
					authState.update((s) => ({ ...s, user: fetchedUser }));
				}
			}
		}
	}
	authState.update((s) => ({ ...s, initialized: true }));
}

type LoginResponse = {
	data?: {
		login?: {
			authToken: string;
			refreshToken: string;
			user: { id: string; name: string; email: string; avatar?: { url?: string } };
		};
	};
	errors?: Array<{ message: string }>;
};

function storeAuthState(authToken: string, refreshToken: string, user: User): void {
	localStorage.setItem(AUTH_TOKEN_KEY, authToken);
	localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
	localStorage.setItem(USER_KEY, JSON.stringify(user));
	// Only write the timestamp on first login, not on token refresh
	if (!localStorage.getItem(SESSION_TS_KEY)) {
		localStorage.setItem(SESSION_TS_KEY, String(Date.now()));
	}
	authState.set({ user, authToken, refreshToken, initialized: true });
}

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

	const user: User = {
		id: result.user.id,
		name: result.user.name,
		email: result.user.email,
		avatarUrl: result.user.avatar?.url ?? null,
	};
	storeAuthState(result.authToken, result.refreshToken, user);
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
	clearSession();
	authState.set({ user: null, authToken: null, refreshToken: null, initialized: true });
}

export function loginWithTangoAtlas(): void {
	const initiationUrl = import.meta.env.PUBLIC_SSO_INITIATION_URL;
	if (!initiationUrl) return;

	const nonce = crypto.randomUUID();
	sessionStorage.setItem('sso_nonce', nonce);

	const callbackUrl = `${window.location.origin}/auth/callback`;
	const target = new URL(initiationUrl);
	target.searchParams.set('redirect_to', callbackUrl);
	target.searchParams.set('state', nonce);
	window.location.href = target.toString();
}

type SsoExchangeResponse = {
	authToken: string;
	refreshToken: string;
	user: { id: string; name: string; email: string; avatar?: { url?: string } };
};

export async function exchangeSsoCode(code: string): Promise<void> {
	const exchangeUrl = import.meta.env.PUBLIC_SSO_EXCHANGE_URL;
	if (!exchangeUrl) throw new Error('SSO exchange URL not configured');

	const response = await fetch(exchangeUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ code }),
	});

	if (!response.ok) {
		throw new Error(`SSO exchange failed (HTTP ${response.status})`);
	}

	const result = (await response.json()) as SsoExchangeResponse;
	const user: User = {
		id: result.user.id,
		name: result.user.name,
		email: result.user.email,
		avatarUrl: result.user.avatar?.url ?? null,
	};
	storeAuthState(result.authToken, result.refreshToken, user);
}
