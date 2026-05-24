# Changelog

Notable changes to medallion-terminal-core. Versions follow semver.

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
