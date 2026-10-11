<script lang="ts">
  import { onMount } from "svelte";
  import { resolve } from "$app/paths";
  import { getEvents, useTmdV4 } from "$lib/api/tmd";
  import { getV4EventRange } from "$lib/api/tmd-v4";
  import type { TmdEventLocation, TmdEventSummary } from "$lib/types";

  // ── State ──────────────────────────────────────────────────────────────────
  let isLoading = $state(true);
  let errorMessage = $state<string | null>(null);
  let tileError = $state(false);
  let mapEl = $state<HTMLDivElement | null>(null);
  let mappedCount = $state(0);
  let omittedCount = $state(0);
  let resultTruncated = $state(false);

  // ── Helpers ────────────────────────────────────────────────────────────────
  function toLocation(event: TmdEventSummary): TmdEventLocation | null {
    if (typeof event.lat !== "number" || typeof event.lng !== "number")
      return null;
    if (!Number.isFinite(event.lat) || !Number.isFinite(event.lng)) return null;
    return {
      id: event.id,
      title: event.title,
      lat: event.lat,
      lng: event.lng,
      city: event.city,
      country: event.country,
    };
  }

  // ── Mount ──────────────────────────────────────────────────────────────────
  onMount(() => {
    let map: import("leaflet").Map | undefined;

    const loadLocations = async () => {
      const events = useTmdV4
        ? await (async () => {
            const result = await getV4EventRange(400);
            resultTruncated = result.truncated;
            return result.items;
          })()
        : await getEvents(100);
      if (!useTmdV4) resultTruncated = events.length === 100;
      const locations: TmdEventLocation[] = [];
      let omitted = 0;
      for (const event of events) {
        const loc = toLocation(event);
        if (loc) {
          locations.push(loc);
        } else {
          omitted++;
        }
      }
      mappedCount = locations.length;
      omittedCount = omitted;
      return locations;
    };

    const setupMap = (
      L: typeof import("leaflet"),
      locations: TmdEventLocation[],
    ) => {
      if (!mapEl) return undefined;

      // Fix default icon path for bundlers
      // @ts-expect-error _getIconUrl is not in types
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const newMap = L.map(mapEl, {
        center:
          locations.length > 0
            ? [locations[0].lat, locations[0].lng]
            : [48.0, 14.0],
        zoom: locations.length > 0 ? 4 : 3,
      });

      // OpenStreetMap tile layer
      const tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        },
      );

      tileLayer.on("tileerror", () => {
        tileError = true;
      });

      tileLayer.addTo(newMap);
      return newMap;
    };

    const addMarkers = (
      L: typeof import("leaflet"),
      locations: TmdEventLocation[],
    ) => {
      if (!map) return;

      for (const loc of locations) {
        // Leaflet interprets a string setContent() as raw HTML. Construct DOM
        // nodes and use textContent for API-controlled title/location instead.
        const container = document.createElement("div");
        container.style.minWidth = "140px";

        const title = document.createElement("strong");
        title.textContent = loc.title;
        title.style.display = "block";
        title.style.marginBottom = "4px";
        container.appendChild(title);

        if (loc.city || loc.country) {
          const where = document.createElement("span");
          where.textContent = [loc.city, loc.country].filter(Boolean).join(", ");
          where.style.fontSize = "0.8em";
          where.style.color = "#666";
          container.appendChild(where);
          container.appendChild(document.createElement("br"));
        }

        const link = document.createElement("a");
        link.href = resolve("/events/[id]", { id: String(loc.id) });
        link.textContent = "View details →";
        link.style.fontSize = "0.85em";
        link.style.color = "#4f46e5";
        container.appendChild(link);

        L.marker([loc.lat, loc.lng]).bindPopup(L.popup().setContent(container)).addTo(map);
      }

      // Fit bounds if we have markers
      if (locations.length > 1) {
        const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    };

    const init = async () => {
      try {
        const locations = await loadLocations();

        // Dynamically import Leaflet to avoid SSR issues
        const L = (await import("leaflet")).default;

        map = setupMap(L, locations);
        addMarkers(L, locations);
      } catch (error) {
        errorMessage =
          error instanceof Error ? error.message : "Could not load map data.";
      } finally {
        isLoading = false;
      }
    };

    void init();

    return () => {
      map?.remove();
    };
  });
</script>

<svelte:head>
  <title>Map - TMD Mobile</title>
  <!-- Leaflet CSS -->
  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""
  />
</svelte:head>

<section class="space-y-4">
  <div>
    <h1 class="font-display text-4xl font-bold">Map</h1>
    <p class="mt-1 text-muted">Events with location data</p>
  </div>

  {#if errorMessage}
    <!-- Error state -->
    <div class="panel border-accent p-5" role="alert">
      <p class="font-semibold text-accent">Map could not load</p>
      <p class="mt-1 text-sm text-muted">{errorMessage}</p>
    </div>
  {/if}

  <!-- Map container (always rendered so Leaflet can attach) -->
  <div class="relative">
    {#if isLoading}
      <!-- Loading overlay -->
      <div
        class="absolute inset-0 z-10 flex items-center justify-center rounded-panel bg-canvas/90"
        aria-live="polite"
        aria-label="Loading map"
      >
        <div class="text-center">
          <div
            class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-soft border-t-primary"
          ></div>
          <p class="mt-3 text-sm text-muted">Loading map…</p>
        </div>
      </div>
    {/if}

    <div
      bind:this={mapEl}
      class="h-[60vh] min-h-[320px] w-full rounded-panel border border-line"
      aria-label="Event map"
    ></div>
  </div>

  {#if !isLoading && resultTruncated}
    <p class="panel p-3 text-sm text-muted" role="status">
      More events exist than this map has loaded. <a class="text-primary underline" href={resolve("/events")}>Browse all events</a> to continue through the directory.
    </p>
  {/if}

  {#if tileError}
    <!-- Tile unavailable fallback -->
    <div class="panel p-4" role="status">
      <p class="text-sm font-semibold text-ink">Map tiles unavailable</p>
      <p class="mt-1 text-xs text-muted">
        OpenStreetMap tiles could not load. Check your connection or try again
        later.
      </p>
    </div>
  {/if}

  {#if !isLoading && mappedCount === 0 && !errorMessage}
    <!-- No geocoded events -->
    <div class="panel p-5" role="status">
      <p class="font-semibold text-ink">No geocoded events</p>
      <p class="mt-1 text-sm text-muted">
        None of the current events have location coordinates. As location data
        is added to events, markers will appear here.
      </p>
    </div>
  {/if}

  {#if !isLoading && omittedCount > 0}
    <p class="text-xs text-muted" aria-live="polite">
      {omittedCount} event{omittedCount === 1 ? "" : "s"} without location data {omittedCount ===
      1
        ? "is"
        : "are"} not shown on the map.
      <a href={resolve("/events")} class="text-primary underline"
        >Browse all events →</a
      >
    </p>
  {/if}
</section>
