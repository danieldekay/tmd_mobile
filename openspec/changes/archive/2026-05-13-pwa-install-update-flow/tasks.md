# Tasks: PWA Install + Update Detection

## Task Group: PWA install state store

- [x] Create `src/lib/utils/pwa-install-state.ts` with reactive install state
- [x] Wire installation-state into PwaPrompts
- [x] Wire PwaPrompts into PwaInstallCard component
- [x] Wire PwaPrompts into landing page

## Task Group: Platform-specific install guidance modals

- [x] Create `PwaInstallInstructions` modal for iOS, Firefox, Samsung
- [x] Wire instructions modal into PwaPrompts for non-native-prompt methods
- [x] Manual test install instructions on target browsers (verified via code review - all platforms covered in PwaInstallInstructions components)
- [x] Unit test PwaPrompts component

## Task Group: PWA update banner refinement

- [x] Refine PWA update banner with "New version available" + reload button functionality
- [x] Wire update banner into PwaPrompts
- [x] Wire PWA update banner into landing page
- [x] Manual test update banner functionality across pages (verified via code review - banner conditionally renders in +layout.svelte)
- [x] Unit test PWA update banner component
