# Proposal: PWA Install Update Flow

## Why

tmd_mobile currently has NO PWA update detection or update flow. Unlike rnt_mobile which
has a fully implemented PWA install + update flow system, tmd_mobile is missing this
entirely.

## Capabilities

- `legal-pages`: Impressum, Datenschutzerklärung, Cookie-Richtlinie, Was ist neu
- `privacy-consent`: Cookie/privacy consent banner + storage
- `consent-gating`: Block analytics/matomo until user consents
- `cookie-management`: Allow user to manage cookie preferences

## Impact

- `src/` — NONE (legal pages are just static content).
