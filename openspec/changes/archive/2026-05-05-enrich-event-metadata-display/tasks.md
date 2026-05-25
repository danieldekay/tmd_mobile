## 1. Type Layer (`src/lib/types.ts`)

- [x] 1.1 Add `categories: string[]` to `TmdEventSummary` (default: `[]`)
- [x] 1.2 Add `edition: string | null` to `TmdEventSummary` (default: `null`)
- [x] 1.3 Add `categories: string[]` to `TmdEventDetail` (default: `[]`)
- [x] 1.4 Add `edition: string | null` to `TmdEventDetail` (default: `null`)

## 2. API Layer (`src/lib/api/tmd.ts`)

- [x] 2.1 Add `_embed=wp:term` to the `getEvents` query string so the list response includes embedded taxonomy terms
- [x] 2.2 Add `meta_fields=end_date` to the `getEvents` query string to expose `end_date` on list items
- [x] 2.3 In `normalizeTmdEvent`: extract `edition` from the raw record — use `getString(record, 'edition')` or numeric coercion; store as `string | null`
- [x] 2.4 In `normalizeTmdEvent`: extract `categories` from `record._embedded?.['wp:term']` — validate taxonomy is `event-categories-2020`, map term objects to `name: string[]`; default to `[]`
- [x] 2.5 Run `npm run check` — confirm no TypeScript errors in the API layer

## 3. Event List Card (`src/routes/events/+page.svelte`)

- [x] 3.1 Show `edition` tag near the title (e.g. "Ed. 11") using secondary muted style (`text-ink/60 text-xs font-mono`) when `event.edition` is not null
- [x] 3.2 Show `categories` as pills on each card using brutalist pill style (`border-2 border-ink px-2 py-0.5 text-xs font-bold uppercase bg-panel text-ink`); skip rendering if `categories` is empty
- [x] 3.3 Confirm that the date-range display already handles `event.dateEnd` correctly; if `event.dateEnd` is now populated from `meta_fields=end_date`, verify the date-range format renders correctly (start → end)
- [x] 3.4 Run `npm run check`

## 4. Event Detail Page (`src/routes/events/[id]/+page.svelte`)

- [x] 4.1 Show `categories` pills in the detail header section, above or alongside the event title, using the same pill style as the list card
- [x] 4.2 Show `edition` tag in the detail header near the title using the same secondary text style as the list card
- [x] 4.3 Run `npm run check`

## 5. Validation and Build

- [x] 5.1 Manually verify one event response with `curl` to confirm `_embedded['wp:term']` and `end_date` are present in the list endpoint response
- [x] 5.2 Run `npm run check` — confirm zero errors
- [x] 5.3 Run `npm run build` — confirm static build succeeds
- [x] 5.4 Deploy via `npx wrangler deploy` (Node 22) and smoke-test categories + edition on a live event card
