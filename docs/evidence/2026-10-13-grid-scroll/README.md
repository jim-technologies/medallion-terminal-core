# Grid scrolling qualification

On 2026-10-13, Chromium 153.0.8010.12 (Playwright 1.63.0), Node 24.20.0
and pnpm 11.27.0 from the locked Flox environment reproduced keyboard focus
outside a horizontally scrolling grid on version 0.7.6 (`ceac6c9524ec5dab548de59a3cbb444d5ae6833b`).

At a 390 × 844 viewport, seven ArrowRight presses reached cell `2:8` at
x=945–1079 while the grid occupied x=34–356. Its horizontal offset stayed
zero. `core-before-keyboard-phone.png` records the hidden focus target.
The fix scrolls the grid's own viewport after keyboard focus moves and keeps
the leading pinned columns in place. A column wider than the available
space remains partially visible and retains its full focus tooltip.

Options were to let native focus scroll every ancestor, to hide horizontal
overflow, or to reveal the target within the existing grid viewport. The
deciding metric was visible overlap between the focus target and the
uncovered viewport, with pinned positions unchanged and no page overflow.
The third option preserves the existing vertical window and scroll owner.

`data-grid-scroll.spec.ts` passes four focused browser tests: both themes,
keyboard End/arrow navigation, header keyboard resizing and pinned position;
and headers at 1440, 1024, 768, 390 and 320 pixels in typed, narrow,
empty and loading tables. The before/after PNGs use synthetic Storybook data.

The reported separate header scrollbar did not reproduce: all 50 baseline
header instances had zero width and height overflow, with `overflow: visible`.
The viewport owns `overflow: auto`. Wide fixed and typed columns still
scroll horizontally; fitting text columns do not. `core-before.json` records
the measurements. No header overflow styling was changed.

The library entry bundle check measured 46.22 → 46.34 KiB static gzip for
the toolkit (+0.12 KiB for keyboard visibility), 24.95 KiB unchanged for app,
4.55 KiB unchanged for asset-open and 49.81 → 49.82 KiB for dashboard.
All existing entry budgets pass. No dependency or style change was needed.

The source change has no protobuf, configuration or persisted-data semantic
impact. The distribution is rebuilt from source; rollback selects the prior
immutable package commit. Version 0.7.7 is prepared. After independent review,
a green full gate and the reviewed commit reaching origin/main, the owner
publishes the tag from a clean checkout with `flox activate -- make release`.
No tag was created or pushed during this qualification.
