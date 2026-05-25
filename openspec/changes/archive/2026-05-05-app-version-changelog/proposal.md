## Why

The TMD Mobile footer currently shows only the semver string from `package.json` (`Version 0.1.0`). There is no changelog page accessible in-app, and no way to tell which exact build is deployed. Adding a commit hash and a lightweight in-app changelog makes it possible to confirm the live deployment and communicate updates to users without requiring a separate release channel.

## What Changes

- NEW — In-app `/changelog` route: a scrollable list of versioned release entries (static, embedded at build time)
- NEW — `__BUILD_HASH__` Vite define: inject short git commit hash at build time alongside `__APP_VERSION__`
- MODIFIED — Footer: display version string AND short commit hash, e.g. `v0.1.0 (a1b2c3d)`, with the hash linking to `/changelog`
- MODIFIED — `vite.config.ts`: add `__BUILD_HASH__` define via `git rev-parse --short HEAD`
- MODIFIED — `src/app.d.ts`: declare `__BUILD_HASH__: string` global

## Capabilities

### New Capabilities
- `in-app-changelog`: Static changelog page at `/changelog` listing versioned release notes embedded at build time
- `build-version-hash`: Vite global inject for short commit SHA exposed in footer and changelog page

### Modified Capabilities
*(No existing spec-level requirements are changing — new additions only)*

## Impact

- `vite.config.ts`: add `__BUILD_HASH__` define (git shell exec)
- `src/app.d.ts`: add global declaration for `__BUILD_HASH__`
- `src/routes/+layout.svelte`: footer version line updated to include hash + changelog link
- `src/routes/changelog/+page.svelte`: new page (static, no API calls)
- `src/routes/changelog/+page.ts`: add to nav (no `prerender` needed — static content)
- `src/lib/changelog.ts`: static changelog data file (typed entries)
- `src/router/routes.ts`: no change needed (SvelteKit file-based routing)
- No API, authentication, or service worker changes
