## Why

The TMD v3 API exposes more data than the mobile app currently surfaces: event categories (Marathon, Encuentro, Festival, etc.), edition numbers, and end dates are all available upstream but absent from the list and detail views. Users scanning the event list cannot quickly identify the event type or duration, making it harder to find relevant events at a glance.

## What Changes

- **Event list cards** gain: category pills (e.g. "Marathon", "Encuentro"), edition tag (e.g. "Ed. 11"), and correct date-range display (start → end) sourced from `end_date` via `meta_fields`
- **Event detail page** gains: category pills in the header section and edition displayed next to the title
- **API layer** (`src/lib/api/tmd.ts`): `getEvents` adds `?_embed=wp:term` to embed categories inline and `?meta_fields=end_date` to get end dates without a second request
- **Type layer** (`src/lib/types.ts`): `TmdEventSummary` and `TmdEventDetail` gain `categories: string[]` and `edition: string | null` fields

## Capabilities

### New Capabilities

- `event-categories`: Display event-type taxonomy (Marathon, Encuentro, Festival, etc.) on list cards and detail header, sourced from `_embedded['wp:term']` in the v3 events response

### Modified Capabilities

- `event-browsing`: List card now shows date range (start + end), edition, and category pills — expanding the required visible fields beyond title/date/location/badges
- `event-detail`: Detail header now includes category pills and edition — adding to the required fields the page must show

## Impact

- **`src/lib/api/tmd.ts`**: `getEvents` query params change; `normalizeTmdEvent` maps `edition` and `categories`
- **`src/lib/types.ts`**: `TmdEventSummary` and `TmdEventDetail` gain two new fields (additive, non-breaking)
- **`src/routes/events/+page.svelte`**: list card template updated
- **`src/routes/events/[id]/+page.svelte`**: detail header updated
- **API**: `?_embed=wp:term` adds ~10–15% response size to list requests; no auth required (public taxonomy)
- **Deployment**: static build only; no server-side changes
