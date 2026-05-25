## Context

The app currently injects `__APP_VERSION__` from `package.json` via `vite.config.ts` and exposes it in the footer. The global is declared in `src/app.d.ts`. The footer sits inside `src/routes/+layout.svelte` and renders the version as plain text. There is no route for a changelog, and no commit hash is captured at build time.

The pattern to follow ("like rnt_mobile") is: inject the short git SHA at build time via a Vite `define`, show `v<semver> (short-sha)` in the footer, and link it to a lightweight in-app changelog listing. The changelog entries are static TypeScript data — no CMS, no API.

## Goals / Non-Goals

**Goals:**
- Inject `__BUILD_HASH__` (short git SHA) into the build via `vite.config.ts` using `child_process.execSync('git rev-parse --short HEAD')`
- Expose `__BUILD_HASH__` as a global TypeScript declaration in `src/app.d.ts`
- Update the footer version line to `v{version} ({hash})` where the hash is a link to `/changelog`
- Create `src/lib/changelog.ts` with a typed `ChangelogEntry[]` array holding the static release history
- Create `src/routes/changelog/+page.svelte` — a simple list page rendering the changelog data
- Create `src/routes/changelog/+page.ts` — minimal, no special prerender/SSR config needed (adapter-static handles it)
- Add "Changelog" link to nav items in `+layout.svelte`

**Non-Goals:**
- Dynamic changelog from CMS or API
- Version comparison or diff views
- Automated CHANGELOG.md parsing (entries are hand-authored in `src/lib/changelog.ts`)
- Any changes to service worker, build output names, or Wrangler config

## Decisions

### Decision 1 — Commit hash injection

Use `execSync('git rev-parse --short HEAD').toString().trim()` in `vite.config.ts` wrapped in a try/catch that falls back to `'dev'` when git is unavailable (CI environments or shallow clones).

```typescript
import { execSync } from 'node:child_process';

function getBuildHash(): string {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'dev';
  }
}
```

Then in `defineConfig`: `__BUILD_HASH__: JSON.stringify(getBuildHash())`.

**Alternative considered**: Reading from a `.build-hash` file generated in CI — rejected as unnecessary complexity; git is always available in the Cloudflare Workers deployment pipeline.

### Decision 2 — Changelog data structure

```typescript
// src/lib/changelog.ts
export type ChangelogEntry = {
  version: string;     // semver, e.g. "0.1.0"
  date: string;        // ISO date, e.g. "2026-05-04"
  title: string;       // one-line summary
  items: string[];     // bullet points (added/changed/fixed)
};

export const changelog: ChangelogEntry[] = [ ... ];
```

No external dependency. Sorted newest-first.

### Decision 3 — Footer display format

```
v0.1.0 (a1b2c3d)
```
The `(a1b2c3d)` text is an anchor tag linking to `/changelog`. If `__BUILD_HASH__` equals `'dev'` (fallback), render `(dev)` without a link.

### Decision 4 — Nav placement

Add "What's New" (or "Changelog") as the last nav item. `NavHref` union type must be extended to include `/changelog`.

**Alternative considered**: Placing changelog link only in the footer — rejected; users should be able to access it from the primary nav without scrolling.

### Decision 5 — Page layout

The `/changelog` page uses a simple vertical list of `<article>` elements — one per `ChangelogEntry`. Each shows the version badge, date, title, and bullet items. No pagination; the changelog is expected to stay short-to-medium. Uses existing `.panel` and `.eyebrow` component classes.

## Risks / Trade-offs

- **git not available at build time**: The try/catch fallback ensures builds don't fail. The hash shows as `dev` in those cases.
- **`execSync` in vite.config.ts runs at build time only** — correct; this is not a runtime syscall.
- **Nav item count grows**: Adding "Changelog" brings nav to 7 items. On very narrow screens (320px), horizontal scroll is already in use (`overflow-x-auto`), so this is acceptable.
- **Static data diverges from CHANGELOG.md**: Both will exist; the `src/lib/changelog.ts` is the in-app source of truth and must be updated alongside `CHANGELOG.md` on each release. → Mitigation: noted in tasks as a release checklist item.

## Migration Plan

1. Extend `vite.config.ts` with `__BUILD_HASH__` define
2. Extend `src/app.d.ts` with global declaration
3. Create `src/lib/changelog.ts` with initial entry for v0.1.0
4. Create `src/routes/changelog/+page.ts` and `+page.svelte`
5. Update `+layout.svelte`: extend `NavHref` type, add nav item, update footer version line
6. Run `npm run check` and `npm run build`
7. Deploy — verify footer shows `v0.1.0 (short-sha)` with working link
