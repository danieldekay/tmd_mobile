# Proposal: Newsletter Signup

## Why

tmd_mobile currently has no newsletter signup functionality. Unlike rnt_mobile which has a
working NewsletterSignup component integrated with Sendy, tmd_mobile is missing this feature entirely.

Adding newsletter signup enables:
- User engagement with event updates
- Direct communication with visitors  
- Marketing for events, workshops, etc.
- Community building around tango events

Without newsletter signup:
- Users can't receive event updates
- No way to notify about changes/new events
- Limited user engagement
- No channel for marketing events

## What Changes

- NEW — `src/routes/newsletter/+page.html`: Newsletter signup page
- NEW — `src/lib/components/NewsletterSignuo.svelte`: Newsletter signup component
- MODIFIED — `src/
  `src/lib/api/legal.ts`: Optional: fetch legal pages from WordPress

### Capabilities

- `newsletter-signup`: Newsletter signup form
- `sendy-integration`: Sendy integration (if Sendy configured)
- `newsletter-unsubscribe`: Newsletter unsubscribe flow

## Impact

- `src/lib/components/NewsletterSignup.svelte`: NEW — Newsletter signup component
- `src/
  `src/lib/api/legal.ts`: NEW — Legal page fetching
- `src/
  `src/routes/impressum`: NEW — Impressum page
- `src/
  `src/lib/matomo/consent.ts`: NEW — Matomo/consent integration
- `src/lib/components/NewsletterSignup.svelte`: NEW — Newsletter signup component
- `src/lib/
  `src/lib/api/legal.ts`: NEW — Legal page fetching
- `src/
  `src/routes/impressum/+page.svelte`: NEW — Impressum page
- `src/
  `src/lib/matomo/consent.ts`: NEW — Matomo/consent integration
- `src/
  `src/lib/api/legal.ts`: NEW — Legal page fetching
- `src/
  `src/routes/impressum/+page.svelte`: NEW — Impressum page
- `src/
  `src/lib/matomo/consent.ts`: NEW — Matomo/consent integration
- `src/
  `src/lib/api/legal.ts`: NEW — Legal page fetching
- `src/
  `src/routes/impressum/+page.svelte`: NEW — Impressum page
- `src/
  `src/lib/matomo/consent.ts`: NEW — Matomo/consent integration
