## Context

The TMD v3 REST API exposes several fields that the mobile app currently ignores:

- `edition` (integer) — available in the list endpoint response as a top-level field
- `end_date` (string) — available in the single-event endpoint; the list endpoint may expose it via `?meta_fields=end_date`
- `categories` (array) — available as an embeddable taxonomy via `?_embed=wp:term`; the `_links['wp:term'][0]` entry has `"embeddable": true` and `"taxonomy": "event-categories-2020"`

Currently, `getEvents` in `src/lib/api/tmd.ts` fetches the list without `_embed` or `meta_fields` parameters, so `TmdEventSummary.badges` is always empty from the list and `categories` does not exist on the type at all.

`normalizeTmdEvent` already reads `end_date` and `edition` from the raw record but neither field reaches the type definitions (`TmdEventSummary`).

## Goals / Non-Goals

**Goals:**
- Surface `categories`, `edition`, and `end_date` on both list cards and the detail header
- Make the data available in a single list request (no second per-event fetch)
- Keep all changes backward-compatible — new type fields are optional / nullable

**Non-Goals:**
- Filtering by category (scoped to `event-views-search-filters`)
- Fetching additional non-public meta fields that require authentication
- Introducing GraphQL (unnecessary for additive field access)

## Decisions

### 1. Embed categories via `?_embed=wp:term` on the list endpoint

**Decision**: Append `_embed=wp:term` to the `getEvents` query string.

**Rationale**: The `wp:term` link is marked `embeddable: true` in the events response `_links`. WordPress REST API's `_embed` mechanism resolves those links server-side, returning the taxonomy terms inline in `_embedded['wp:term'][0]`. This avoids N+1 category fetches per event.

**Alternative considered**: Fetch categories lazily on card hover/expand. Rejected: adds complexity, poor mobile UX.

**Response size impact**: ~10–15% larger list payload (taxonomy term objects are small). Acceptable.

### 2. Request `end_date` via `?meta_fields=end_date` on the list endpoint

**Decision**: Append `meta_fields=end_date` (comma-separated with any other needed fields) to `getEvents`.

**Rationale**: TMD Core v3 supports `meta_fields` on the collection endpoint to expose selected meta values at the top level. This avoids fetching each event individually just to get end dates.

**Risk**: If the list endpoint does not support `meta_fields`, `end_date` will be absent and `normalizeTmdEvent` will return `dateEnd: null`. The UI already handles `null` gracefully (shows only start date). No error.

**Alternative considered**: Rely on the detail page for end_date (current behavior). Rejected: users cannot see duration without opening each event.

### 3. Map `edition` as a nullable string field

**Decision**: Add `edition: string | null` to `TmdEventSummary` and `TmdEventDetail`. In `normalizeTmdEvent`, call `getString(record, ['edition'])` (already present in the raw record from both endpoints). Display in UI as `"Ed. ${edition}"`.

**Rationale**: `edition` is already in the list response — it's a zero-cost addition.

### 4. Normalize categories from embedded wp:term

**Decision**: In `normalizeTmdEvent`, read `record._embedded?.['wp:term']?.[0]` (array of term objects), extract `name` strings → `string[]`. Add `categories: string[]` to both summary and detail types (empty array default, never `null`).

**Token map for UI rendering** (in component layer, not normalizer):
- Category pill: `border-2 border-ink px-2 py-0.5 text-xs font-bold uppercase bg-panel text-ink`
- Edition tag: `text-ink/60 text-xs font-mono`

## Risks / Trade-offs

- **`meta_fields` not supported on collection** → `dateEnd: null` in list; graceful fallback to start-date-only display. Risk: low impact.
- **Large events list with `_embed=wp:term`** → slightly larger payloads on slow connections. Mitigation: categories are small (< 100 bytes per event); acceptable.
- **`normalizeTmdEvent` type widening** → adding fields to existing types is non-breaking; downstream consumers that destructure the type won't break.
- **Term array index** → `_embedded['wp:term']` is an array of term arrays (one per taxonomy requested). Index `[0]` gives `event-categories-2020`. If WP changes embed order this could break. Mitigation: guard with a check for the term's `taxonomy` field.
