# Proposal: PWA Update Detection

## Why

tmd_mobile currently has no automatic update detection for deployed PWAs. When the app
is redeployed to Cloudflare (via `wrangler deploy`), users keep the old version cached
in their browser until they manually close and reopen the app. Unlike rnt_mobile which
has a complete PWA update detection system, tmd_mobile has no user-facing mechanism to
notify about updates or force a reload.

This means:
- Users see stale UI after deployment
- Bug fixes take days/weeks to be visible
- No user feedback about new deployment
- Increased support requests about "not working"

Adding PWA update detection ensures users always have the latest version, critical for
bug fixes, new features, and security patches.

## What Changes

- MODIFIED — `src/lib/utils/pwa-install.ts`: Add `checkForBuildVersion()`, `checkForUpdate()`
  functions to detect new builds and trigger reload
- NEW — `src/lib/utils/build-version.ts`: Exports `__BUILD_TIMESTAMP__` at build time for
  comparing deployed versions (from `wrangler.toml` or `vite.config.ts`)
- MODIFIED — `src/routes/+page.svelte`: Add "New version available" banner + reload button
- MODIFIED — `src/routes/+layout.svelte`: Add update detection check on mount
- NO new dependencies — Uses `navigator.serviceWorker` which is built-in browser API

### Capabilities

#### New Capabilities
- `pwa-build-version`: Detects build timestamp/hash via fetch to `build-version.json` or
  via `serviceWorker.updatefound` event
- `pwa-update-banner`: Shows "New version available" banner in PWA with "Reload" button
- `pwa-auto-reload`: Optional auto-reload after user confirms update (force update)
- `pwa-skip-update`: Allow user to skip update for 24 hours

#### Existing Capabilities (Enhanced)
- `pwa-install-prompt`: Already exists (from `landing-page-pwa-install` change) — now with
  update detection to ensure users get latest version after install

## Impact

- `src/lib/utils/pwa-install.ts`: Enhanced with update detection
- `src/lib/utils/build-version.ts`: New build version module
- `src/routes/+page.svelte`: Add update banner in PWA mode
- `src/routes/+layout.svelte`: Add update check on layout mount
- `src/routes/+layout.svelte`: Add "Check for updates" in footer (optional)
- No API endpoint changes
- No auth changes
- No Cloudflare Worker configuration changes (update detection is client-side)
