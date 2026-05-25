# Design: TMD Mobile Feature Parity Foundation

## Architecture

The app remains a static SvelteKit application:

- `src/routes/+layout.ts` sets `prerender = true` and `ssr = false`.
- `src/lib/api/tmd.ts` contains the initial REST client and normalization layer.
- `src/lib/types.ts` defines mobile-facing DTOs.
- `worker.ts` delegates requests to Worker Assets.
- `wrangler.toml` configures the `tmd-mobile` Worker service.

## Data Flow

1. Route components request public data through `src/lib/api/tmd.ts`.
2. The API module builds URLs against `PUBLIC_TMD_API_BASE_URL` or the production default.
3. Responses are normalized into mobile DTOs before rendering.
4. Routes render explicit loading, empty, and error states.

## Routes

- `/`: overview, live API preview, roadmap phases
- `/events`: event browsing parity plan
- `/calendar`: calendar and registration feed plan
- `/map`: map discovery plan
- `/djs`: DJs, teachers, and series plan
- `/settings`: deployment and environment readiness

Future implementation should add detail routes such as:

- `/events/[id]`
- `/djs/[id]`
- `/teachers/[id]`
- `/series/[id]`

## API Strategy

Start with REST v3 because it matches TMD Core controller architecture and is easiest to debug. Introduce GraphQL only when a screen needs nested relationships that REST cannot deliver cleanly.

## Deployment Strategy

The project mirrors RNT mobile:

- SvelteKit static build writes to `build/`.
- Cloudflare Worker Assets serves `build/`.
- SPA fallback supports direct route loads.
- GitHub Actions deploys with `npx wrangler deploy` after `npm run build`.

The custom domain is deliberately not configured yet. DNS and Worker route setup are a separate operational task.

## Open Questions

- Dedicated event-location response shape for Leaflet map markers.
- Exact TMD Core query params for future events and registration dates.
- Legal-page strategy.
- Localization strategy.
- Analytics provider and consent copy.
