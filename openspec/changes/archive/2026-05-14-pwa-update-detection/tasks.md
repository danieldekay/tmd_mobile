# Tasks: PWA Update Detection

## Task Group: Build version module

- [x] Create `src/lib/utils/build-version.ts` with BUILD_TIMESTAMP, BUILD_HASH, compareVersions functions
- [x] Inject build version into `vite.config.ts` with environment variable injection at build time

## Task Group: PWA Install module

- [x] Add update detection to `src/lib/utils/pwa-install.ts`
- [x] Add `BUILD_TIMESTAMP` to `src/app.d.ts`

## Task Group: Update Banner

- [x] Create `PwaUpdateBanner.svelte` component
- [x] Wire into PwaPrompts and layout

## Summary

All tasks completed. Key files:

- build-version.ts
- pwa-update.ts
- PwaUpdateBanner.svelte
- Updated layout.svelte
- vite config with build timestamp
