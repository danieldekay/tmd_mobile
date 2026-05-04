# AGENTS.md - TMD Mobile

Instructions for AI agents working on the TMD Mobile app.

## Project Overview

TMD Mobile is a SvelteKit 5 + Svelte 5 TypeScript PWA for The Tango Marathon Directory. It uses TMD Core as the source of truth and aims for mobile feature parity with the public browsing functionality currently implemented in TMD4.

## Stack

- SvelteKit 2 and Svelte 5
- TypeScript strict mode
- Tailwind CSS 4
- Cloudflare Worker Assets via `worker.ts` and `wrangler.toml`
- OpenSpec artifacts under `openspec/`

## Commands

```bash
nvm use
npm install
npm run dev
npm run check
npm run build
npm run openspec -- --help
```

## Critical Rules

- Keep the app static-compatible: `src/routes/+layout.ts` exports `prerender = true` and `ssr = false`.
- Use Svelte 5 runes and validate changed `.svelte` files with `npx @sveltejs/mcp svelte-autofixer`.
- Keep TMD Core as the data source. Do not reintroduce RNT/Tribe API dependencies.
- Use `PUBLIC_TMD_API_BASE_URL` for alternate API environments.
- Preserve the Worker Assets deployment model from RNT, but use Worker name `tmd-mobile`.
- Treat `mobile.tangomarathons.com` as pending until Cloudflare DNS and routes exist.
- Update `docs/analysis/tmd-core-tmd4-analysis.md` and OpenSpec artifacts when feature scope changes.

## Data Source

Default API base:

```text
https://www.tangomarathons.com/wp-json/tmd/v3
```

Local development can point to:

```text
http://localhost:10014/wp-json/tmd/v3
```

## Feature Parity Priorities

1. Event list, detail, calendar, and registration visibility.
2. Country/date/category filters plus map discovery.
3. DJs, teachers, and event series relationship browsing.
4. Saved events, reminders, offline-friendly caching, and auth-ready API access.
5. Deployment hardening and production observability.
