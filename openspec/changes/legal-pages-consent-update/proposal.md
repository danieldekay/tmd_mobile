# Proposal: Legal Pages + Privacy Consent Enhancement

## Why

tmd_mobile currently has NO legal pages (impressum, datenschutz/Datenschutzerklärung, cookie
richtlinie) and NO privacy consent management. Unlike rnt_mobile which has a fully implemented
legal pages system with privacy consent, tmd_mobile is **non-compliant** with German and EU
law. German law (TMG/§5) requires an Impressum (legal notice). GDPR (DSGVO/Art. 13) requires
privacy policy transparency. E-Privacy directive requires cookie consent.

Without legal pages:
- Non-compliant with German/EU law (risk of fines)
- No way to explain data practices to users
- No mechanism for users to manage preferences
- No unsubscribe mechanism for newsletter (future)
- No cookie consent banner for analytics

Adding legal pages + privacy consent is essential for any production app serving German/EU users.

## What Changes

- NEW — `src/routes/impressum/+page.svelte`: Impressum (legal notice) page
- NEW — `src/routes/datenschutz/+page.svelte`: Datenschutzerklärung (privacy policy + consent)
- NEW — `src/routes/cookie-richtlinie/+page.svelte`: Cookie policy page
- NEW — `src/routes/was-ist-neu/+page.svelte`: Changelog / "What's New" page
- MODIFIED — `src/lib/matomo/offline.ts` or new `src/lib/matomo/consent.ts`: Consent-aware
  matomo tracking (only when user consents)
- NEW — `src/lib/api/legal.ts`: Optional: fetch legal pages from WordPress (if pages hosted there)
- MODIFIED — `src/routes/+layout.svelte`: Add "Cookie-Richtlinie" link in footer, and
  "Privacy" / "Impressum" links
- NO new dependencies — Uses static HTML text (or fetch from WP if pages hosted)

### Capabilities

#### New Capabilities
- `legal-pages`: Impressum, Datenschutzerklärung, Cookie-Richtlinie, Was ist neu
- `privacy-consent`: Cookie/privacy consent banner + storage (GDPR-compliant)
- `consent-gating`: Block analytics/matomo until user consents
- `cookie-management`: Allow user to manage cookie preferences

#### Existing Capabilities (Enhanced)
- `legal-content`: tmd_mobile currently has no legal pages — now fully implemented
- `matomo-tracking`: Already exists (from `matomo-offline-tracking`) — now gated by consent
- `newsletter-signup`: Already exists (from `newsletter-signup`) — now with unsubscribe link
- `legal-notice`: tmd_mobile has no "legal notice" pages — now complete
- `legal-gate`: tmd_mobile has no legal gate — now consent-gated analytics

## Impact

- `src/routes/impressum/+page.svelte`: NEW — Impressum page
- `src/routes/datenschutz/+page.svelte`: NEW — Privacy policy consent
- `src/routes/impressum/+page.svelte`: NEW — Impressum (legal notice)
- `src/routes/cookie-richtlinie/+page.svelte`: NEW -- Cookie policy
- `src/routes/was-ist-neu/+page.svelte`: NEW -- Changelog / "What's new"
- `src/lib/api/legal.ts`: NEW -- Optional: fetch legal pages from WordPress
- `src/lib/matomo/consent.ts`: NEW -- Consent-aware matomo tracking
- `src/routes/+layout.svelte`: Modified to add legal links in footer
- **No** API endpoint changes (legal pages served statically)
- **No** auth changes (legal pages are public)
- Prerender: All legal pages should be statically prerendered
