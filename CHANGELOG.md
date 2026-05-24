# Changelog

Notable changes to medallion-terminal-core. Versions follow semver.

## [0.3.1] — 2026-05-24

### Changed

- **FileBrowser idiom polish.** Drop three dead `PreviewOverlay` props (`mediaTemplate`, `namespace`, `backendUrl`) — vestigial from a pre-`onSelect` design where the overlay rebuilt next-track URLs itself. Tighter prop surface, no behavior change.
- **TypeScript type guards.** Replace `(err as Error).message` catches with a shared `errorMessage(err)` helper that handles non-Error throws (`unknown` is the actual catch type). Replace `as Record<string, unknown>` casts in `extractPagination` / `normalizeEntries` with a private `isMetaRow` type guard. Replace `res.body!.getReader()` non-null assertion in `parseConnectStream` with an explicit guard.

### Added

- `errorMessage(err: unknown): string` exported helper for safe error narrowing in catch blocks.

## [0.3.0] — 2026-05-24

### Added

- **FileBrowser pagination.** New `page_ctx` and `page_size_ctx` widget options route page state through dashboard context. Backends supply pagination totals via a sentinel `{ __meta__: true, total, page, page_size }` row at position 0 of TablePayload.rows; the widget strips it and renders `‹ Page N / M ›`. Helper `extractPagination(data)` exposes the same plucking for custom consumers.
- **FileBrowser gallery toggle.** Header button (or `view_mode_ctx` option) switches between Icons (default, filename + icon, zero image bytes) and Gallery (grid of thumbnails via lazy `<img loading="lazy">`). Browser-native viewport-driven lazy load — off-screen thumbnails don't fetch.
- **Keyboard navigation in the preview overlay.** `←` / `→` walk a navigable queue (audio + video + image + mkv + heic). `Space` toggles play/pause on audio/video. `Esc` closes the overlay (was already wired).
- **Helpers.** `navigableQueue(entries)` companion to `playableQueue` — returns the broader set used by arrow keys + toolbar prev/next, while `playableQueue` stays scoped to auto-advance (no images, no PDFs).

### Changed

- **FileBrowser preview overlay** now takes separate `autoAdvanceQueue` (audio/video for `onEnded`) and `navigableQueue` (broader set for arrows + toolbar) props. The single `queue` prop is gone — callers must pass both. Migration: `queue={playableQueue(sorted)}` → `autoAdvanceQueue={playableQueue(sorted)} navigableQueue={navigableQueue(sorted)}`.
- **`normalizeEntries`** now filters out the `__meta__: true` pagination sentinel so consumers see only real entries.

### Internal

- 16 vitest files, 244 tests; new coverage for `extractPagination`, `navigableQueue`, and `__meta__`-row filtering.
- TypeScript strict mode + buf lint clean.

## [0.2.5] and earlier

See git log (`git log --oneline v0.2.5..HEAD` summarises the 0.3.0 diff).
