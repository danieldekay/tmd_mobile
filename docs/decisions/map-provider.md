# Map Provider Decision

Date: 2026-05-01

## Decision

Use Leaflet with OpenStreetMap-compatible tiles for the first TMD Mobile map implementation.

## Rationale

- TMD Mobile is a static SvelteKit PWA, and Leaflet has already worked in the RNT mobile reference app.
- TMD4 uses Mapbox, but matching TMD4 exactly is less important than reducing setup friction for the first mobile map milestone.
- Leaflet keeps the initial implementation independent from Mapbox tokens and account-level configuration.
- The decision can be revisited if TMD needs Mapbox-specific styling, clustering, or geocoding capabilities later.

## Consequences

- CSP must allow the selected tile provider once the map route becomes live.
- Consent copy should mention external map tiles.
- TMD Core still needs a reliable coordinate or GeoJSON contract for event locations.

## Revisit When

- TMD requires visual parity with an existing Mapbox style.
- Mapbox geocoding becomes part of the product requirement.
- Tile usage, attribution, or privacy constraints require a different provider.
