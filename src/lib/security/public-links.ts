/**
 * Treat all third-party URLs in legacy TMD REST metadata as untrusted.
 * This utility runs in SSR, service workers and browser contexts.
 */
export function safeHttpUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const raw = value.trim();
  if (!raw || /[\u0000-\u001f\u007f]/.test(raw)) return undefined;
  try {
    const url = new URL(raw);
    if ((url.protocol !== 'https:' && url.protocol !== 'http:') ||
      url.username || url.password) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

export function safeMailto(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const raw = value.trim();
  // Do not permit CRLF, mail headers, prefilled recipients or other parameters
  // from arbitrary user-supplied WordPress post metadata.
  const address = raw.startsWith('mailto:') ? raw.slice(7) : raw;
  if (!/^[^\s@?&:]+@[^\s@?&:]+\.[^\s@?&:]+$/.test(address)) return undefined;
  return 'mailto:' + address;
}

export function safeExternalHref(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  return value.trim().toLowerCase().startsWith('mailto:')
    ? safeMailto(value)
    : safeHttpUrl(value);
}
