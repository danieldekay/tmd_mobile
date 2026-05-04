# TMD Core and TMD4 Analysis for TMD Mobile

Date: 2026-05-01

## Purpose

This document captures the initial analysis of TMD Core and TMD4 for the new TMD Mobile Svelte app. TMD Core is the backend and API source of truth. TMD4 is the current WordPress theme that defines much of the public browsing experience on tangomarathons.com.

## Repositories Analyzed

- `/Users/danieldekay/Dokumente/projects/programmieren/tmd_core`
- `/Users/danieldekay/Dokumente/projects/programmieren/tmd4`
- `/Users/danieldekay/Dokumente/projects/programmieren/rnt_mobile` as the deployment and Svelte app reference

## Domain Model

TMD Core centers on these public content types:

- `tmd_event`: tango marathons and related events
- `tmd_dj`: DJs and music artists
- `tmd_teacher`: teachers and instructors
- `tmd_event_series`: recurring event brands or editions
- `tmd_venue`: venue/location records

Additional internal content types exist for imports, benchmarking, prompt configuration, and enrichment workflows, but the mobile app should begin with public browsing use cases.

## Event Data

Important event fields for mobile parity include:

- event title/name and edition
- start date and end date
- registration start date
- country, city, venue, street
- website, email, Facebook event/group/page links
- price and currency
- participant count and music hours
- flags such as role balanced, invitation only, registration available, milongas, tickets, live music, lessons, show, separated seating, folklore, and non-tango content
- service options such as food, sleep, and shopping when available

## Relationships

Events can connect to:

- DJs
- teachers
- event series
- venues or location metadata

TMD Core exposes relationship data through REST embedding and GraphQL relationship fields. The mobile app should prefer a single event detail request with relationships embedded when the endpoint contract is stable.

## API Surfaces

### REST API v3

The mobile app should target TMD Core REST v3 first:

```text
/wp-json/tmd/v3/events
/wp-json/tmd/v3/djs
/wp-json/tmd/v3/event-series
/wp-json/tmd/v3/teachers
/wp-json/tmd/v3/venues
```

Useful behaviors found in TMD Core:

- WordPress REST conventions
- HAL-style `_links` and `_embedded` response patterns
- pagination and filtering
- relationship inclusion via query parameters
- structured validation and error handling in shared controllers

### GraphQL

TMD Core also offers GraphQL, including event queries and relationship fields. GraphQL may become useful once the mobile UI needs to fetch nested event details with exact field selection.

Candidate mobile uses:

- event detail with DJs, teachers, and series
- future events by country
- profile or relationship-heavy views

### Compatibility Feeds

TMD4 currently consumes special event calendar and registration feeds for FullCalendar behavior. The mobile app should either replicate those needs through REST v3 or create a documented compatibility adapter.

## Authentication

TMD Core supports WordPress native auth and JWT-style bearer tokens through its authentication trait. Public browsing should remain anonymous. Authenticated mobile functionality should be deferred until specific user stories are defined.

Potential authenticated features:

- saved events
- registration reminders
- user-specific dashboard
- admin or importer status views

## TMD4 Public Feature Inventory

### Event Archive

TMD4 provides event archives with cards/tables, search, sorting, and filters. Mobile should preserve the core scan behavior with fewer controls visible at once.

Priority filters:

- date range or month
- country and city
- category/type
- weekend
- registration status
- role balance and invitation-only flags

### Event Detail

TMD4 event detail pages surface dates, location, registration state, contact links, website/social links, event features, services, maps, and connected entities. This is the primary Phase 1 detail parity target.

### Calendar

TMD4 uses a FullCalendar-style experience fed by event and registration endpoints. Mobile should use a compact agenda/month hybrid rather than a dense desktop calendar.

### Map

TMD4 includes Mapbox-based map behavior. RNT mobile uses Leaflet/OpenStreetMap. TMD Mobile still needs a design decision here: Mapbox for parity or Leaflet for lower operational dependency.

### DJs and Series

TMD4 exposes DJ archive/detail pages and event-series pages. These become Phase 2 after event browsing and event detail stabilize.

### SEO, i18n, and Accessibility

TMD4 follows WordPress i18n patterns and public SEO needs. The mobile PWA should preserve readable metadata, accessible navigation, and route-level titles even though it is a static client app.

## Admin and Import Capabilities

TMD Core includes a unified import pipeline, ICS parsing, AI enrichment, duplicate detection, and prompt tooling. These are not part of the first public mobile parity milestone. They matter later if the mobile app becomes an authenticated operator or organizer tool.

## RNT Mobile Reuse

Reusable RNT patterns:

- SvelteKit static app with `ssr = false`
- Tailwind CSS 4 design tokens
- Cloudflare Worker Assets deployment
- GitHub Actions CI and deploy workflows
- app shell and mobile-first route structure
- OpenSpec/Specfact folder layout

Not reused:

- Tribe Events API data model
- RNT branding
- newsletter worker endpoint
- RNT-specific legal, announcement, and communication docs

## Recommended Mobile Parity Sequence

1. Public event list and detail with resilient TMD Core API client.
2. Calendar and registration-date visibility.
3. Map and location discovery.
4. DJ, teacher, and event-series relationship browsing.
5. Saved events and reminders.
6. Auth-ready user flows and optional admin/import status surfaces.
7. Production deployment, analytics, and monitoring.

## Files Referenced During Analysis

TMD Core:

- `DESIGN.md`
- `README.md`
- `tmd_core.php`
- `src/API/V3/BaseController.php`
- `src/API/V3/EventsController.php`
- `src/API/V3/DjsController.php`
- `src/API/V3/SeriesController.php`
- `src/API/V3/UnifiedImportController.php`
- `src/API/V3/Traits/JWTAuthenticationTrait.php`
- `src/API/GraphQL/EventsGraphQL.php`
- `src/API/GraphQL/StandaloneGraphQL.php`
- `src/Models/Events/EventMetaFields.php`

TMD4:

- `README.md`
- `template-events-modern.php`
- `archive-tmd_event.php`
- `single-tmd_event.php`
- `archive-tmd_dj.php`
- `single-tmd_dj.php`
- `template-djs.php`
- `src/js/calendar.js`
- `src/js/map.js`
- `includes/setup_mapbox.php`
- `includes/post-types/tmd_view_event.php`

RNT Mobile:

- `package.json`
- `svelte.config.js`
- `vite.config.ts`
- `wrangler.toml`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `DEPLOY.md`
