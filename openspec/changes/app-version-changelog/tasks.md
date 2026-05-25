## 1. Build Infrastructure

- [x] 1.1 Edit `vite.config.ts` — add `import { execSync } from 'node:child_process'`, add `getBuildHash()` function with try/catch fallback to `'dev'`, add `__BUILD_HASH__: JSON.stringify(getBuildHash())` to the `define` block alongside the existing `__APP_VERSION__`
- [x] 1.2 Edit `src/app.d.ts` — add `const __BUILD_HASH__: string` to the global declarations block

## 2. Changelog Data Module

- [x] 2.1 Create `src/lib/changelog.ts` — export `ChangelogEntry` type (`version`, `date`, `title`, `items: string[]`) and the `changelog` array with an initial v0.1.0 entry summarising the features shipped so far (events, DJs, calendar, map, saved, PWA, auth, design system)

## 3. Changelog Route

- [x] 3.1 Create `src/routes/changelog/+page.ts` — minimal, just `export const prerender = true` (static content, no dynamic data)
- [x] 3.2 Create `src/routes/changelog/+page.svelte` — import `changelog` from `$lib/changelog`, render a header section + vertical list of entries using `.panel`, `.eyebrow`, and `.meta-text` component classes; each entry shows version badge, date, title, and bullet items

## 4. Layout Updates (`src/routes/+layout.svelte`)

- [x] 4.1 Extend `NavHref` union type to include `'/changelog'`
- [x] 4.2 Add `{ href: '/changelog', label: "What's New" }` to the `navItems` array
- [x] 4.3 Update the footer version paragraph: replace the plain `Version {…}` text with `v{__APP_VERSION__} ({__BUILD_HASH__})` where the hash is an anchor to `/changelog` (but rendered as plain text when hash equals `'dev'`)

## 5. Type Check and Build

- [x] 5.1 Run `npm run check` — confirm zero TypeScript/Svelte errors
- [x] 5.2 Run `npm run build` — confirm static build succeeds and `/changelog/index.html` is present in the `.svelte-kit/output` directory

## 6. Deploy and Verify

- [x] 6.1 Run `npx wrangler deploy` (with Node 22 active via `nvm use 22`)
- [x] 6.2 Open the live app footer — verify format is `v0.1.0 (a1b2c3d)` with working link to `/changelog`
- [x] 6.3 Navigate to `/changelog` in the live app — verify the page loads and all entries render
- [x] 6.4 Verify "What's New" appears in the primary nav bar
