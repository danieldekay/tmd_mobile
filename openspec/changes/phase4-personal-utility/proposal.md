## Why

After Phase 3 users can discover and research events on any device, but every session starts from scratch. Tango travelers plan months ahead and juggle multiple events; they need to save shortlisted events, set registration reminders, and have the app remain useful when offline. These features transform TMD Mobile from a read-only directory into a personal planning tool.

## What Changes

- Implement saved-events persistence using `localStorage` with explicit user consent.
- Add save/unsave toggle to event list cards and event detail pages.
- Implement registration reminders using the Web Notifications API (permission-gated).
- Add an offline-friendly recent-data cache so the last-seen event list is available without a network connection.
- Add a `/settings` or saved-events section for managing saved events and notification preferences.
- Improve PWA install and update prompts.

## Capabilities

### New Capabilities

- `saved-events`: Save/unsave events to local device storage with a dedicated saved-events view.
- `registration-reminders`: Opt-in Web Notification reminders for event registration-opening dates.
- `offline-cache`: Offline-friendly cache of recently viewed event data using the Service Worker cache API.

### Modified Capabilities

- `deployment-pwa`: PWA install and update prompt behaviour is being specified more concretely.

## Impact

- **Routes**: new saved-events section or `/settings` route; toggle UI on event list and detail
- **Storage**: `localStorage` for saved event IDs; Service Worker cache for offline data
- **Permissions**: Web Notifications API — permission requested only on explicit user action
- **Privacy**: no server-side storage; all data stays on the user's device
- **Access level**: fully client-side, no authentication required
- **Deployment**: Service Worker registration must be compatible with Cloudflare Worker Assets routing
