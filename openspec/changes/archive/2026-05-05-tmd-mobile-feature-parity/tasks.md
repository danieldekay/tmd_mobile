# Tasks: TMD Mobile Feature Parity Foundation

## 1. Foundation

- [x] Copy RNT mobile scaffold without generated artifacts.
- [x] Rename package and deployment identity to TMD Mobile.
- [x] Replace RNT app source with TMD-specific Svelte shell.
- [x] Add initial TMD Core REST client.
- [x] Prepare Worker Assets deployment as `tmd-mobile`.
- [x] Write TMD Core and TMD4 analysis docs.

## 2. OpenSpec Setup

- [x] Add OpenSpec project config.
- [x] Add feature parity proposal artifacts.
- [x] Run `openspec init` or `openspec update` after dependency install to refresh IDE slash command integration.
- [x] Confirm the IDE exposes `/opsx:propose` for future changes.

## 3. Validation

- [x] Install dependencies and update package lock.
- [x] Run Svelte autofixer on changed `.svelte` files.
- [x] Run `npm run check`.
- [x] Run `npm run build`.

## 4. Next Implementation Change

- [x] Define event list response fixtures from local and production TMD Core.
- [x] Implement `/events/[id]` detail route.
- [x] Decide map provider.
- [x] Confirm Cloudflare DNS and route requirements for `mobile.tangomarathons.com`.
