# UI behaviour qualification

This branch fixes vertical wheel chaining for horizontally overflowing,
content-sized grids. The original Chromium fixture stayed at zero after a
600-pixel wheel gesture; Firefox already chained vertically. A grid that
actually scrolls vertically continues to contain its own edge gestures.

The same browser campaign found lost shell/grid positions on Back, column
widths reverting from 216 to 200 pixels on refresh, Dashboard shortcuts
running while editing, and focused long-value tips extending beyond the
viewport. A real pointer drag across a row link also selected no text.
Each fixed behaviour has a browser regression; a DOM Range only measures
text geometry in the pointer test and never creates its selection.
Completed text drags also leave row selection unchanged. Growing columns
resize from their visible width and retain their existing fill floor.
Firefox's implicit focusable scroll viewport is removed from the Tab order,
leaving the roving gridcell as the grid's single stop.

The history regression uses a neutral Vite HTML fixture under StrictMode.
Storybook owns its iframe history state and replaces that state on reload,
so its iframe cannot qualify the router's refresh identity. The separate
host-provider fixture tests immediate same-key replacement and reload.

The added cross-browser scope covers:

- Native wheel, a small-delta wheel stream and horizontal wheel gestures at
  1440×900, 2560×1440 and 390×844, in both themes.
- Empty, single-row, 50-row and 10,001-row grids, bounded edge behaviour,
  keyboard movement, header/column alignment and retained inner offsets.
- Back/Forward, refresh, async rows, both scroll axes, distinct history
  entries, caller-owned history keys, blocked storage, interrupted restore,
  stale offsets and StrictMode owner replacement.
- Scoped width persistence and opt-out; editable shortcut ownership;
  palette dismissal/focus; pointer text selection and link activation.
- Axe serious/critical findings on representative row counts, reduced
  motion, and viewport-bounded hover/focus value disclosure.

**Open native-engine limitation:** Linux WebKitGTK 26.6 does not select
anchor text when a drag starts inside the anchor, including static HTML,
disabled native link dragging, explicit selection CSS, held gestures and
Alt/Shift modifiers. Starting in the cell padding just before the text
selects the complete value. That native path and all navigation modes are
asserted in every engine. The inside-link case remains an isolated expected
failure in Linux WebKit, while Chromium and Firefox assert it normally.
This does not characterize Safari on other platforms.
`webkit-native-link-selection.html` is the neutral manual fixture; the
three `webkit-neutral-*.json` receipts preserve the observed comparisons.

Scroll probes retain raw animation-frame coverage, blank-window counts and
Long Tasks support/durations. Chromium supports the Long Tasks timing
assertion; an unsupported API in another engine is reported as unsupported,
not as evidence that no task exceeded 50 ms. The 720×450 layout case is the
CSS reflow equivalent of 1440×900 at 200%; native browser zoom, physical
trackpads, screen readers and the operating-system clipboard still need
manual qualification.

The locked Flox environment supplies GSettings schemas for WebKit's network
process. Linux Flox test configs skip Playwright's library-name preflight
because Nix `ldd` disagrees with the browsers' host ELF loader. Actual engine
launches, assertions, screenshots and accessibility checks remain required.

No protobuf, backend contract, durable data or service configuration changes.
`DataGrid.stateKey` explicitly opts into tab-local widths. ProductShell uses
history entry identity for scroll state; host shells may use the exported
provider and owned refs. Storage is bounded and optional. Rolling a product
pin back ignores these UI-only session entries and needs no data migration.

Release note: let content-sized tables scroll the page, retain listing
positions and opt-in column widths, keep shortcuts out of editors, and make
long values and linked cell text usable with keyboard and pointer.
