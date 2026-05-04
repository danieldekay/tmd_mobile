## Context

TMD Mobile already fetches events, DJs, and event series via TMD Core REST v3. Three content categories remain unexposed in the mobile app: **teachers** (a TMD Core custom post type at `/wp-json/tmd/v3/teachers`), **blog posts** (WordPress standard posts at `/wp-json/wp/v2/posts`), and **WordPress pages** (at `/wp-json/wp/v2/pages`).

Teacher names already appear as plain text on event detail pages (see `relationship-browsing` spec), but the teacher endpoints are not called and no teacher routes exist. Blog and page content is only accessible by navigating to the main WordPress site.

The app is deployed as a fully static SvelteKit build (adapter-static) via Cloudflare Worker Assets. All data fetching is client-side.

## Goals / Non-Goals

**Goals:**
- Expose a Teacher Directory at `/teachers` and `/teachers/[id]` with list + detail pages
- Expose a Blog list at `/blog` and individual post view at `/blog/[slug]`
- Expose WordPress pages at `/pages/[slug]` (client-side fetched; not prerendered)
- Promote teacher name text on event detail pages to navigation links
- Add Teachers and Blog entries to the app navigation
- Keep the implementation consistent with existing DJs pattern (same API layer, same component shape)

**Non-Goals:**
- WordPress admin or author-gated content
- Comment system or blog post reactions
- Full-text search across all content types
- GraphQL integration (REST v3 / WP REST v2 is sufficient for list + detail)
- Offline caching for blog/pages (events caching is handled separately)

## Decisions

### Decision 1 — API layer: two base URLs

TMD Core v3 (`/wp-json/tmd/v3`) and WordPress REST v2 (`/wp-json/wp/v2`) share the same WordPress installation.  Both will be fetched from the same configured `apiBaseUrl` origin but under different path prefixes.

Rather than a single `apiBaseUrl` export, add a `wpBaseUrl` helper alongside the existing `apiBaseUrl` so each fetch call makes the path origin explicit.

**Alternative considered**: A single unified abstraction hiding both prefixes — rejected as over-engineering for two fetch helpers.

### Decision 2 — Static compatibility for pages with dynamic slugs

WordPress pages and blog posts have arbitrary slugs that are not known at build time. Using `adapter-static` with `prerender = true` (the project default) is not viable without an explicit `entries()` list.

**Decision**: Set `export const prerender = false` on the `+page.ts` loader files for `/blog/[slug]` and `/pages/[slug]`. The list pages (`/blog`, `/pages`) can be prerendered with a small entry set or left as client-side fetched. This is consistent with how the project already handles map and calendar content.

**Alternative considered**: Pre-fetching all slugs and generating `entries()` — rejected as brittle; slug list changes without a new build.

### Decision 3 — Teacher endpoint

Use `/wp-json/tmd/v3/teachers` (TMD Core v3) rather than the raw `/wp/v2/tmd_teacher` endpoint. TMD Core normalises relationship data and metadata shapes consistently with events and DJs. If v3 teacher endpoint is unavailable or returns an error, fall back gracefully with an empty list.

### Decision 4 — WP REST v2 field selection

WordPress REST v2 posts/pages return large payloads. Append `?_fields=id,slug,title,excerpt,content,date,modified,_links` to reduce transfer size. Content arrives as rendered HTML; display with `{@html}` in Svelte with appropriate sanitization note.

### Decision 5 — Navigation

Add a **Teachers** link (alongside DJs) and a **Blog** link to the main layout navigation. Pages are not listed in the nav; they are accessed by direct URL or linked from content. This mirrors TMD4 behavior.

## Risks / Trade-offs

- **WP REST v2 CORS**: WordPress REST v2 endpoints must emit `Access-Control-Allow-Origin` headers for the Cloudflare worker origin. If CORS is not configured server-side, blog/page fetches will fail silently in the browser. → Mitigation: Verify CORS headers on `https://www.tangomarathons.com/wp-json/wp/v2/posts` during implementation; if missing, raise as a TMD Core / server config task.
- **HTML content rendering**: Blog post and page bodies are rendered HTML. Using `{@html}` is XSS-safe here because the content origin is our own trusted WordPress, but the pattern should be documented. → Mitigation: Comment the usage clearly; do not render HTML from unknown sources.
- **Teacher endpoint availability**: If TMD Core v3 has no `/teachers` endpoint, the directory page must show a graceful empty/unavailable state. → Mitigation: Defensive fetch with try/catch and empty state UI.
- **Static build / slug routes**: Dynamic `[slug]` routes opt out of prerendering. Cloudflare Worker Assets serves the SPA shell for unknown routes. If Cloudflare routing is not set up for these paths, direct deep-links will 404. → Mitigation: Confirm Cloudflare worker `_routes.json` or fallback routing covers `/*`.

## Migration Plan

1. Add new types and API helpers (non-breaking — no existing code removed)
2. Add new routes (additive only)
3. Update navigation layout to include Teachers and Blog links
4. Update event detail page to link teacher names to `/teachers/[id]` (replaces plain text — backward-compatible; link degrades if teacher fetch fails)
5. Deploy via existing `npx wrangler deploy` pipeline

No rollback strategy needed — all changes are additive. Teacher link promotion can be toggled off by reverting a single template change if teacher endpoint is unavailable.

## Open Questions

- Does `/wp-json/tmd/v3/teachers` currently exist and return a consistent shape? (verify against local dev at `http://localhost:10014`)
- Are there WordPress pages worth surfacing? (e.g., About, FAQ) — list TBD with product owner
- Should blog posts be paginated, or is a fixed `per_page=20` sufficient for MVP?
