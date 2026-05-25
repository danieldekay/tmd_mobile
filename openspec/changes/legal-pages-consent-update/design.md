## Design: Legal Pages + Privacy Consent Enhancement

### Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                     Route Pages                                   │
│                                                                    │
│   impressum/+page.html    Impressum (legal notice)              │
│   datenschutz/+page.html  Privacy policy (DSGVO/GDPR consent)     │
│   cookie-richtlinie/+page.html Cookie policy                      │
│   was-ist-neu/+page.html  Changelog / What's in new               │
│                                                                    │
├──────────────────────┬──────────────────────┬─────────────────────┤
│                      │                      │                     │
│              src/routes/impressum/+page.md │              src/routes/datenschutz/+page.md   │
│              src/routes/cookie-richtlinie/+page.html             │              src/routes/was-ist-neu/+page.html       │
│                                                                    │
│              src/lib/legal.ts (legal data fetcher)                 │
│              src/lib/matomo/consent.ts (consent-aware matomo)      │
│                       (src/routes/+layout.svelte: footer links)    │
│                                                                    │
├──────────────────────┼──────────────────────┼─────────────────────┤
│                      │                      │                     │
│                   src/lib/legal.ts          │                      │
│                  (Legal page content)       │                  src/lib/matomo/consent.ts │
│                                       (Consent-aware matomo)         │
│                  (legal.ts: fetch)           │                  (matomo/consent.ts: consent-       │
│                  (fetch)                      │                  (consent-aware matomo)          │
│                  (legal.ts: fetch)              │                  (matomo/consent.ts: consent-    │
│                  (src/lib/legal.ts)            │                  (matomo/consent.ts: consent-    │
└──────────────────────┴──────────────────────┴─────────────────────┘
```

### File Descriptions

1. **`src/lib/legal.ts`**: Legal page fetching. Fetches static content from `src/components/legal-pages
`, or from WordPress if legal pages are hosted there. Provides `getLegalPages()` to return all
legal pages.

**Implementation:**
```typescript
import { legalPages } from '$lib/data/legal-data'
   * `getLegalPages(): Promise<LegalPage[]>`.
   * Fetch from local JSON or WordPress API (configurable).
   * Returns `LegalPage` objects

2. **`src/routes/impressum/+page.html`**: **`src/lib/legal.ts` is new. `src/lib/matomo/consent.ts` is new (from matomo-offline-tracking). **`routes/impressum/+page.html` is new. **`datenschutz/+page.html` is new. **`cookie-richtlinie/+page.html` is new. **`was-ist-neu/+page.html` is new.

### Legal Pages Flow

1. `src/routes/impressum/+page.html` → Fetch `legalPages` from `src/lib/legal.ts` (if pages) → Render:
`LegalPage` components
2. `src/routes/impressum/+page.html` → `legalPages` object → Render static content
3. `src/routes/datenschutz/+page.html` → Fetch `getLegalPages()` → Render `LegalPage` component
4. Render `LegalPage` component from `legal.ts` (if data) → Render static HTML
6. `src/routes/was-ist-neu/+page.html` → Fetch `getChangelog` → `legal.ts` → Render static HTML
7. `src/routes/+layout.svelte` → Render: `LegalPage` from `legal.ts`. → Render static HTML

### Privacy Consent Flow

1. User opens tmd_mobile app for first time
2. `src/lib/matomo/consent.ts` → `ConsentBanner` or `ConsentModal` renders → User sees: "We use
cookies for analytics. Accept / Reject / Configure"
3. User clicks "Accept" → `consent.ts` stores: `matomo/consent/accepted` → Matomo starts tracking
4. User clicks "Reject" → `consent.ts` stores: `matomo/consent/rejected` → Matomo disabled
5. User clicks "Configure" → `consent.ts` shows: "Cookie preferences" → User selects options
6. If user changes mind → `matomo/consent/config` → Consent can be re-enabled from `src/routes/legal.html`

### Consent Data Structure

**`matomo/consent/accepted`**: User accepts all cookies. Matomo active.
**`matomo/consent/rejected`**: User rejects analytics cookies. Matomo inactive. 
**`matomo/consent/config`**: User configures cookie preferences. Matomo active only for strict cookies.

## Architecture Summary

- **tmd_mobile**: No existing legal pages. All new.
- **tmd_mobile**: All new. No existing legal pages.
- **tmd_mobile**: All new. No existing legal pages.
- **tmd_mobile**: All new. No existing legal pages.
- **tmd_mobile**: All new. No existing legal pages.
