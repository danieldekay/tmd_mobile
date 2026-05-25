/**
 * Offline-aware Matomo tracking module.
 *
 * - initializeMatomo: injects the Matomo SDK script
 * - trackPageView / trackEvent: consent-gated, online/offline logic
 * - Queue: 50-entry cap, retry up to 3 times, flush on reconnect
 * - startHeartbeat: 30s interval for standalone PWA mode
 * - getConsent: reads from localStorage (consent default: false)
 */
const qKey = 'tmd_matomo_queue';

export function getConsent(key: string): boolean {
	try {
		const r = localStorage.getItem('tmd_consent');
		if (!r) return false;
		return JSON.parse(r)[key] === true;
	} catch { return false; }
}

/** Enqueue a tracking command (offline-safe, 50-entry cap). */
export function queueEvent(cmd: string): void {
	try {
		const r = localStorage.getItem(qKey);
		const q: Array<{ c: string; r: number }> = r ? JSON.parse(r) : [];
		if (q.length >= 50) q.shift();
		q.push({ c: cmd, r: 0 });
		localStorage.setItem(qKey, JSON.stringify(q));
	} catch { /* no-op */ }
}

/** Flush the queue. Returns true if at least one item was sent. */
export async function flushQueue(): Promise<boolean> {
	try {
		const r = localStorage.getItem(qKey);
		if (!r) return false;
		const q: Array<{ c: string; r: number }> = JSON.parse(r);
		if (!q.length) return false;
		const b = import.meta.env.PUBLIC_MATOMO_URL ?? 'https://example.com/matomo';
		let s = false;
		const rem: typeof q = [];
		for (const e of q) {
			if (await doTrack(b, e.c)) s = true;
			else { e.r++; if (e.r < 3) rem.push(e); }
					}
		localStorage.setItem(qKey, JSON.stringify(rem));
		return s;
	} catch { return false; }
}

/** Inject the Matomo SDK. Returns true when loaded. */
export function initializeMatomo(): Promise<boolean> {
	const u = import.meta.env.PUBLIC_MATOMO_URL;
	if (!u) return Promise.resolve(false);
	return new Promise((res) => {
		const s = document.createElement('script');
		s.src = u + '/matomo.js';
		s.onload = () => res(true); s.onerror = () => res(false);
		document.head.appendChild(s);
	});
}

/** Track page view (consent-gated). */
export function trackPageView(urlPath: string, title?: string): void {
	if (!getConsent('analytics')) return;
	const b = import.meta.env.PUBLIC_MATOMO_URL;
	if (!b) return;
	const p = 'url=' + encodeURIComponent(urlPath) + (title ? '&action=' + encodeURIComponent(title) : '');
	if ('sendBeacon' in navigator) {
		navigator.sendBeacon(b + '/matomo.php', new Blob([p]));
	} else { queueEvent(p); }
}

/** Track custom event (consent-gated). */
export function trackEvent(cat: string, act: string, label?: string): void {
	if (!getConsent('analytics')) return;
	const b = import.meta.env.PUBLIC_MATOMO_URL;
	if (!b) return;
	const p = 'category=' + encodeURIComponent(cat) + '&action=' + encodeURIComponent(act) + (label ? '&label=' + encodeURIComponent(label) : '');
	if ('sendBeacon' in navigator) {
		navigator.sendBeacon(b + '/matomo.php', new Blob([p]));
	} else { queueEvent(p); }
}

/** Start a 30s heartbeat in standalone mode. Returns cleanup or null. */
export function startHeartbeat(): (() => void) | null {
	if (!getConsent('analytics')) return null;
	if (!navigator.standalone) return null;
	let tid: number | undefined;
	const tick = async () => {
		try {
			const u = import.meta.env.PUBLIC_MATOMO_URL;
			if (!u) return;
			navigator.sendBeacon(u + '/matomo.php', new Blob(['action=heartbeat.ping']));
					} catch { }
					};
	tick();
	tid = window.setInterval(tick, 30_000);
	return () => tid && window.clearInterval(tid);
}

/** Internal: track HTTP with XmlHttpRequest. */
async function doTrack(base: string, params: string): Promise<boolean> {
	try {
		const ok = await doHttp(base + '/matomo.php', params);
		return ok;
	} catch { return false; }
}

/** HTTP POST with XmlHttpRequest. Returns true when ok. */
function doHttp(u: string, p: string): Promise<boolean> {
	return new Promise(function (res) {
		var x = new XMLHttpRequest();
		x.open('POST', u, true);
		x.ontimeout = function () { res(false); };
		x.send(p);
	});
}
