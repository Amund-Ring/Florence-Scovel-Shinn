# iOS App Plan — Florence Scovel Shinn

Native SwiftUI app replicating the PWA. Reference the PWA source at
`~/Github_Repos/Florence-Scovel-Shinn` when building.

## Approach
Build phase by phase. Start with skeleton and data, then screen by screen,
then features, then polish.

## Phase 1 — Foundation
- Xcode project, SwiftUI (not UIKit)
- Data models: `Quote`, `Category`, `Book` — mirror the existing `quotes.json` structure
- Import `quotes.json` as a bundle resource
- Persistence: `@AppStorage` or SwiftData for favorites, today's slots, dark mode preference

## Phase 2 — Core screens
- Today screen
- Library screen with filtering and sorting
- Saved/Favorites screen
- Tab bar navigation between them

## Phase 3 — Features
- Focus mode (full-screen swipeable quote viewer)
- Lock/refresh slots on Today screen
- Favorites toggling
- Filter and sort controls (by category, A–Z, by category grouped)

## Phase 4 — Polish
- Dark/light mode (native SwiftUI makes this trivial and seamless)
- Category color system — recreate `CAT_COLORS` from `js/theme.js` as SwiftUI `Color` values
- Typography to match: DM Serif Display for quotes, DM Sans for UI
- Animations and transitions

## Key things to port from the PWA
- `quotes.json` — bring this as-is, it's the heart of the app
- `js/theme.js` — category colors and the two themes (ivory + night)
- `js/utils.js` — weighted random quote picker logic (port to Swift)
- `js/FocusMode.js` — swipe logic and looping behavior
- The slot system: 3 daily quotes, each lockable, refreshable independently

## Notes
- Status bar dark/light mode works perfectly in native iOS — no workarounds needed
- SwiftData is the modern choice for persistence on iOS 17+; use `@AppStorage`
  for simple values like dark mode preference
