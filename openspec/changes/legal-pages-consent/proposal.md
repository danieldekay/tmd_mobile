# Proposal: Legal Pages + Privacy Consent

## Why

tmd_mobile currently has no legal pages (Impressum, Datenschutzerklärung, Cookie-Richtlinie) 
and no privacy consent management. Unlike rnt_mobile which has a fully implemented legal
pages feature, tmd_mobile is missing this entirely.

Adding legal pages + privacy consent is essential for:
- German/EU law compliance (TMG/§5, DSGVO/GDPR, E-Privacy)
- User trust and transparency  
- GDPR compliance for Matomo analytics
- User ability to manage data preferences
- Future newsletter signup (requires unsubscribe + privacy)

Without legal pages:
- Non-compliant with German/EU law
- No way to explain data practices
- No mechanism for users to manage preferences
- No unsubscribe mechanism for newsletter
- No cookie consent banner for analytics

## What Changes

- NEW — `src/routes/impressum/+page.html`: Impressum (legal notice)
- NEW — `src/routes/datenschutz/+page.html`: Datenschutzerklärung (privacy policy)
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/datenschutz/+page.svelte`: Datenschutzerklärung
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/datenschutz/+page.svelte`: Datenschutzerklärung
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/datenschutz/+page.svelte`: Datenschutzerklärung

## What Changes

- NEW — `src/routes/impressum/+page.html`: Impressum
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/impressum/+page.svelte`: Impressum

## What Changes

- NEW — `src/routes/impressum/+page.html`: Impressum
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/impressum/+page.svelte`: Impressum
- NEW — `src/routes/impressum/+page.svelte`: Impressum

## Capabilities

- `legal-pages`: Impressum, Datenschutzerklärung, Cookie-Richtlinie, Was ist neu
- `privacy-consent`: Cookie/privacy consent banner + storage
- `consent-gating`: Block analytics/matomo until user consents
- `cookie-management`: Allow user to manage cookie preferences

## Impact

- `src/` — NONE (legal pages are just static content).
