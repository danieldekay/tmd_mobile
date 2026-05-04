## Why

TMD Mobile currently covers events, DJs, and event series — but misses teachers, WordPress blog posts, and static pages that the main TMD4 site exposes. Users browsing the mobile app cannot discover teacher profiles, read editorial content, or view informational pages without leaving the app.

## What Changes

- Add a **Teacher Directory** (`/teachers`, `/teachers/[id]`) backed by `/wp-json/tmd/v3/teachers`
- Add a **Blog Posts** list and detail view (`/blog`, `/blog/[slug]`) backed by the WordPress REST v2 `/wp/v2/posts` endpoint
- Add a **Pages** route (`/pages/[slug]`) backed by `/wp/v2/pages` for informational WordPress pages (e.g. About, FAQ)
- Extend `src/lib/api/tmd.ts` with fetch helpers for teachers, posts, and pages
- Add types `TmdTeacher`, `TmdTeacherDetail`, `TmdPost`, and `TmdPage` to `src/lib/types.ts`
- Link teacher names on event detail pages to `/teachers/[id]` (currently rendered as plain text)
- Add **Teachers** and **Blog** navigation entries to the main layout

## Capabilities

### New Capabilities

- `teacher-directory`: Browse all TMD teachers with profile pages; links from event details resolve to teacher profiles
- `blog-posts`: List and read WordPress blog posts from the TMD site
- `wordpress-pages`: Display WordPress static pages (About, FAQ, etc.) via slug-based routing

### Modified Capabilities

- `relationship-browsing`: Teacher names on event detail pages become navigation links once the teacher directory is live (requirement change: plain-text fallback → linked profile)

## Impact

- **API**: Adds calls to `/wp-json/tmd/v3/teachers`, `/wp-json/wp/v2/posts`, and `/wp-json/wp/v2/pages` — all public, no authentication required
- **Types**: New types in `src/lib/types.ts` for teachers, posts, and pages
- **Routes**: New route trees under `src/routes/teachers/`, `src/routes/blog/`, and `src/routes/pages/`
- **Navigation**: Layout updated to include links to Teachers and Blog sections
- **CORS**: WordPress REST v2 endpoints must allow cross-origin requests from the Cloudflare worker origin; no CORS changes to TMD Core v3 required
- **Deployment**: Static prerendering (adapter-static) — page routes with dynamic slugs require `entries()` or `prerender = false` (fetch-on-client)
