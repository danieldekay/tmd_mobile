# Proposal: Server Sync Personal Data

## Why

tbd_mobile currently has no legal pages and no privacy consent management. Unlike rnt_mobile
which has a fully implemented legal pages feature, tbd_mobile is missing this feature
entirely.

## Capabilities

- `legal-pages`: Impressum, Datenschutzerklärung, Cookie-Richtlinie, Was ist neu
- `privacy-consent`: Cookie/privacy consent banner + storage
- `consent-gating`: Block analytics/matomo until user consents
- `cookie-management`: Allow user to manage cookie preferences

## Impact

- `src/` — NONE (legal pages are just static content).
