# Changelog

Notable changes to medallion-terminal-core. Versions follow semver.

## [Unreleased]

## [0.7.0] — 2026-09-26

The ontology components: typed property values and panels, object headers
and chips, one windowed `DataGrid` for every table, link panels and graphs,
navigation, search, feeds, toasts and paging, bounded file previews, an
`ObjectPage`, and a `ProductShell` with session, router, telemetry and embed
ports (`medallion-terminal-core/app`). The widgets that had their own
tables, headers, palettes and toasts now render through them, every size
is on the type scale (11 px minimum), and eight page templates built only
from toolkit exports are the reference for product pages.

### Migration

- **`useDataSource().error` is gone.** Read `sourceError` (a
  `SourceError`), render it with `SourceErrorState`, and call
  `describeSourceError(sourceError)` where a one-line summary is needed.
- **`Skeleton` is the toolkit placeholder.** The root entry's widget
  loading archetype is `WidgetSkeleton`; a host that imported `Skeleton`
  from the root for a widget body imports `WidgetSkeleton` instead.
- **The root `CommandPalette` is the host-driven toolkit palette**
  (`open`, `query`, `groups`, `onSelect`). The Dashboard-internal palette
  was never usable outside a `Dashboard` and is no longer exported;
  `PaletteSuggest` and `PaletteSuggestion` are unchanged.
- **`file_browser` markup is replaced.** The list is a `DataGrid`; target
  the stable `data-mtc-file-browser`, `data-mtc-part`, `data-mtc-entry-*`
  hooks or use `FileBrowserExtensions` (`entryIcon`, `entryHref`,
  `selection`, `contextActions`, `onOpen`) instead of class names or DOM
  rewriting. `fileBrowserDecoders` is removed; previews go through
  `FilePreview` and its limits.
- **`record_grid`, `table` and `object_view`** render through `DataGrid`,
  `ObjectHeader`, `PropertyPanel` and `LinkPanel`: payloads and options are
  unchanged, but tests that found cells as `<td>` or buttons should query
  `role="gridcell"` and `role="row"`. A click on a `record_grid` cell no
  longer starts an edit; F2 or a double-click does.
- **`PropertyList` values are typed.** Numbers group, booleans read Yes/No,
  lists are chips and nested objects are disclosures; pass `kind` or
  `format` on an item to choose the rendering.
- **`text` bodies are Markdown.** Pass `options.markdown: false` to keep the
  raw text of a feed that is not Markdown.
- **The `./app` entry is React.** It now exports `ProductShell` and its
  ports beside `createProductFetch`; it has `react` and `react-dom` as peer
  dependencies like the other entries.
- **`Badge` and `Tag` wrap their children** in `span.mtc-badge-label` and
  `span.mtc-tag-label`, so a label can end in an ellipsis. A host selector
  that expected the text as a direct child of the chip needs the wrapper in
  its path.

### Added

- **Display primitives**: `StatusBadge` (dot plus label, five tones),
  `Kbd`, `Avatar` (initials, optional image; `initialsOf`), `Skeleton`
  (line, block, circle, paragraph), `CopyButton` (injectable clipboard, a
  polite "Copied" status), `MetaRow`, `Panel` (the flat 36 px-header frame)
  and `HoverCard` (hover and focus, Escape, portalled into the scope).
- **Object components**: `PropertyValue` renders a value by kind or format
  (ids and code in monospace with copy, grouped tabular numbers, byte sizes
  such as `48.2 kB`, currency with its code as a separate word for
  assistive technology, 0–1 ratios as percentages, dates with relative time
  and no time-zone day shift, Yes/No with an icon, enum chips and tone
  badges, lists as chips with "+N", object references as chips, `http(s)`
  links only, nested objects in a disclosure); `PropertyPanel` (grouped,
  filterable, "n of m"); `ObjectHeader` (40 px glyph, type eyebrow in the
  type colour, monospace id with copy, title, status, metadata, actions;
  `compact` for inspectors); `ObjectChip` (link, button or text, optional
  hover card). Shared types `ObjectRef`, `ObjectTypeRef`, `PropertyKind`
  and helpers `typePresentation`, `isObjectRef`, `resolvePropertyKind`,
  `formatPropertyText`, `propertySortKey`, `compareSortKeys`.
- **`DataGrid`**, the toolkit table and the resource table the product UIs
  build on: a windowed WAI-ARIA grid with one tab stop and roving cell
  focus, typed cells, client or server sort (text compares with one shared
  `Intl.Collator`: ten thousand rows in about 30 ms), drag and Alt+arrow
  column resize, pinned leading columns, single or multi selection with
  ranges, row links (`rowHref`, `onNavigate`), row activation, context
  actions (right-click, Menu key, Shift+F10), `onEndReached` paging with
  `totalRows`, skeleton, loading-more and empty rows, and `rowProps` data
  hooks. Above 200 rows only the rows in view render; a browser test holds
  ten thousand rows under 1,500 DOM nodes at every scroll offset and
  `perf.bench.ts` times the window and the sorts.
  - *Column fit.* A column without a `width` is sized to its content (its
    header and the rows in view, at most 360 px) and fitted to the grid,
    spare width going to the `grow` column. Text columns (plain text, ids
    and code, URL and email links, and custom `cell` content unless the
    column declares a `kind`) give way, the primary column last and none
    below its `minWidth` (72 px, 96 for the primary column), but only when
    every column then fits; otherwise every column keeps its width and the
    grid scrolls sideways. Numbers, dates, Yes/No and chips (the `enum`,
    `list` and `link` kinds) never give way.
  - *Values cut short.* Whatever is still narrower than its content ends in
    an ellipsis: typed values (chip and badge labels too, a status dot
    keeping its size), and custom content, which sits in a one-line box
    (`span.mtc-data-grid-cell-text`), when it is inline; a block or flex
    layout inside that box is cut without one unless it truncates its own
    label. A list shows its first two chips and a "+N" chip whose title
    names the rest. A cell cut short gives a pointer its text as the cell's
    title and shows its content unclipped over the cell on keyboard focus
    (Escape hides it); its accessible name is its text.
  - *Editing.* F2 or a double-click calls `onCellEdit`, and `editingCell`
    names the open editor, which the column's `cell` renders with
    `editing: true`. An inline editor (the default) replaces the cell's
    content with one-line controls in `.mtc-data-grid-editor`, each the
    row's height less 2 px on each side, focus rings drawn inside them. An
    editor taller than a row (a list box, a text area) takes
    `layout: "overlay"`: the cell keeps its value and the editor opens in a
    dialog anchored over the cell (at least 320 px wide, inside the window,
    portalled into the scope), where Tab stays inside it and Escape or a
    press outside it calls `onEditCancel`. Either way the editor's controls
    hold the tab stop and their own keys, and focus returns to the cell
    when it closes.
- **Links**: `LinkPanel` (link groups by link type with direction, target
  type, count, previews with detail, "View all"), `LinkGraph` (a
  deterministic one-hop radial ego graph, one sector per link type, at most
  40 nodes with "+N", keyboard-focusable node links, pan and zoom) and
  `SchemaGraph` (object types and link types on the layered layout, with
  counts, selection and routed back edges). Plain SVG, no dependency. The
  graphs scale their geometry (fitted to at least 80%) but not their
  labels, which never render under 11 px, are truncated to the room they
  have and hide in a zoomed-out overview; a graph larger than its frame
  opens with the selected type (or the centre object) in view, zoom keeps
  the frame's centre, and a schema edge that skips ranks is routed through
  the gaps between the nodes it passes, its label on that straight run.
- **Navigation and search**: `NavRail` (sections, icons or type glyphs,
  counts, `aria-current`, 48 px collapsed mode), `PageHeader` (breadcrumbs,
  title or custom heading, actions, tab slot, sticky), `SearchField`
  (search landmark with removable scope tokens, clear, a `/` focus key),
  the toolkit `CommandPalette` (modal combobox over grouped results,
  keyboard highlight, Ctrl/⌘ K) and `FacetList` (single-select type facet
  with glyphs, checkbox value facets, counts, "Show more", clear).
- **Status and feedback**: `ActivityFeed` (feed and `timeline` variants),
  `StatTile` (value, unit, delta, status, link), `Toaster`,
  `ToastProvider` and `useToast` (intents, one action, pause on hover or
  focus, polite or assertive), and `Pagination` (numbered or cursor).
- **Files**: `FilePreview` with the Terminal's Common Files policy (a
  conservative allowlist, bounded Range reads, CSV/TSV into a windowed
  grid at 1,000 × 100, signature-checked PNG, JPEG, GIF, WebP and PDF from
  blobs, native audio and video, HTML, SVG and XML as source only,
  sanitised Markdown with typography, typed errors, too-large and blocked
  states with a download action) and `CodeView` (line numbers that are not
  copied, wrap, copy, highlighted lines, bounded lines; JSON, YAML and SQL
  coloured line by line with the `--mtc-code-*` tokens, while lines over
  2,000 characters and other languages stay plain). The policy is
  exported: `planPreview`, `DEFAULT_PREVIEW_LIMITS`, `readBounded`,
  `parseDelimited`, `hasRasterSignature`, `hasPdfSignature`.
- **Product shell** (`medallion-terminal-core/app`): `ProductShell` (top
  bar with product, scope, search palette and account menu; nav rail with a
  phone drawer; page; inspector; status bar; toasts; operations tray; skip
  link) over four ports: a `Router` (`createHistoryRouter`,
  `createMemoryRouter`, `matchPath`, `buildPath`, `matchRoutes`, typed
  `RouteParams`, `useRoute`, `useLocation`, `RouterLink`; a malformed
  percent escape is no match), a `SessionPort` (`createHttpSessionPort`,
  `renewViaFrame` through the Terminal launch URL, renewal a minute before
  expiry and after a 401, far expiries waited in steps, no polling and no
  timers while hidden, an expired-session dialog that keeps the page, a
  signed-out state; `SessionEnvironment` takes injectable `setTimeout` and
  `clearTimeout` with the `VisibilitySource` type, so hosts and tests drive
  the schedule without patching globals), a `TelemetryPort`
  (`requestTelemetry` for the product fetch; navigation and session
  summaries) and the embed handshake (`mode="embed"`,
  `createEmbedChannel`: versioned `mtc:*` messages with an origin
  allow-list, resize, navigate (never to `//host` or `/\host`), init).
  `useProductShell` exposes them to pages. On phones the operations tray is
  a summary bar above the status bar and the inspector sheet sits above
  it, so neither covers the other until the tray is opened.
- **`ObjectPage`**: breadcrumbs, `ObjectHeader` and section tabs
  (Overview, Properties, Links, History) composing the object components.
  The product plans' object anatomy maps onto one component per role: the
  linked-objects panel is `LinkPanel`, the activity timeline is
  `ActivityFeed variant="timeline"`, the facet rail is `FacetList`, and the
  resource table is `DataGrid`.
- **`OperationsTray`**: long-running operations with status, progress,
  Cancel, Retry, Dismiss, polite announcements, floating or inline; it
  starts collapsed on phones (720 px and narrower) unless `defaultOpen` is
  given.
- **Page templates** (`Templates/Pages`): Object explorer, Object view,
  Object type, Schema graph, Files, Operations, Storage and Connect, built
  only from toolkit exports inside one workspace frame, with dark and light
  baselines at 1440 px and 390 px, interaction tests (facets, selection
  preview, palette, phone drawers, file preview) and a unit test that
  rejects imports from anywhere but the toolkit entry. At 1440 px every
  template value is whole (the Object explorer scrolls its last column
  beside the inspector); at 390 px their grids scroll sideways with whole
  values. `DESIGN.md` documents each layout; products copy structure from
  these rather than the clones.
- **`useResource`** (`medallion-terminal-core/app`), the cached read
  product pages build on without a query library: one request per key
  however many components read it, a read nobody waits for is aborted,
  typed `SourceError` failures, stale-while-revalidate (`staleTimeMs`,
  `validating`), polling only while the page is visible
  (`refreshIntervalMs`) and a reload of stale data when it comes back,
  `mutate` after a write (older in-flight answers are ignored), `null` keys
  that wait, and `createResourceCache`, `ResourceCacheProvider`,
  `useResourceCache().invalidate` and `resourceKey`. Unread entries are
  dropped oldest first past `maxEntries` (100).
- `StatusTone` type; message keys for copy, values, property panels, the
  grid and its editor, links, graphs, navigation, search, paging, toasts
  and activity (en and zh-CN).
- Tests that measure layout, not only pixels: the table widget and the
  flagship watchlist must show every column with no sideways overflow and
  no cut number; graph text must land at 11 px or more on screen (fitted
  and zoomed out, desktop and phone); the schema graph must open with the
  selected type in view on a phone; every template grid at 1440 px and
  390 px, the `Narrow columns` DataGrid story and the `record_grid` stories
  at seven widths from 1440 px to 390 px fail on a box that clips a value
  unless it is a block container ending in `text-overflow: ellipsis`, on a
  value cut at its cell's top or bottom, on a chip label cut short and on a
  status dot or icon squeezed to nothing; and every `record_grid` editor
  (text, a choice, a user, a number, a date, a date and time, Yes/No, a
  multi-select, several users, long text, and each while a save is
  pending) must show its whole control and every focus ring inside the
  visible area in the standard and compact densities. Unit tests for the
  column fit, rank-skipping routes, session renewal timing and hidden-page
  timers, the resource cache, the code tokenizer, button hover contrast in
  every theme, the style guard's rules and where a record field's editor
  opens.
- Baselines (dark, light, and compact for the property panel and the
  DataGrid) and exact text snapshots for every new story, among them the
  table, `object_view`, `text` and `trade` widgets, `record_grid` lists and
  both of its editor layouts, CodeView highlighting and `useResource`.

### Changed

- `PropertyList` renders values through `PropertyValue`: numbers are
  grouped, booleans read Yes/No with an icon, lists are chips and nested
  objects open in a disclosure instead of printing JSON. Items accept
  `kind` and `format`. In the stacked phone layout its values no longer
  inherit the browser's 40 px definition indent, so they line up with
  their labels and use the full width.
- The root entry's archetype placeholder for loading widgets is now
  `WidgetSkeleton`; `Skeleton` is the toolkit placeholder.
- Declarations exclude every `*.fixture.ts`.
- **`file_browser` on the toolkit.** The list is a `DataGrid` (one tab stop,
  keyboard selection, sortable columns, typed and content-sized name, type,
  size and modified columns with formatted sizes and dates instead of raw
  ISO), the toolbar uses `Breadcrumbs`, `SearchField`, `Button` and
  `Pagination`, the upload dialog is the toolkit `Dialog` (focus trapped
  and restored), icons replace emoji, and the preview overlay renders
  through `FilePreview` (bounded, signature-checked). New extension points
  (`FileBrowserExtensions`: `entryIcon`, `entryHref`, `selection`,
  `selectedIds`, `onSelectionChange`, `contextActions`, `onOpen`) and
  stable `data-mtc-*` hooks replace host DOM surgery. Payloads and options
  are unchanged.
- **`record_grid` on `DataGrid`**: one tab stop instead of a button per
  cell, `aria-sort` headers, Enter selects the record, toolkit search, view
  and New controls, and `Pagination` for client pages. F2 or a
  double-click edits a cell instead of a click: text, numbers, dates, a
  single choice and Yes/No edit in the cell at the row's height, while a
  multi-select, several users or links, and long text open in a dialog
  over the cell (Shift+Enter adds a line to long text). Enter or Save
  saves, Escape or Cancel cancels, the field is named after its column,
  and focus returns to the cell.
- `record_grid`, `record_board`, `record_calendar` and `record_form`
  values render through `PropertyValue`: dates and times are Intl-formatted
  in the scope's locale and time zone (a bare date no longer shows as ISO),
  choices are filled chips or status badges like every other enum, Yes/No
  carry an icon, and links use the toolkit link style. A list in a grid row
  stays on one line: two chips and a "+N" chip whose title names the rest,
  instead of up to four chips wrapping in the cell, and choice and list
  columns keep their width instead of giving way like text. Board cards
  and forms still show up to four, with the same titled "+N" instead of an
  untitled 10 px one.
- A list box's chosen options (a `record_form` or `record_grid`
  multi-select) take the accent colours in every theme instead of the
  browser's system selection colours.
- The widgets' `CursorPager` renders the toolkit `Pagination` in cursor
  mode.
- The Dashboard's Ctrl/⌘ K palette is rebuilt on the toolkit
  `CommandPalette`: typed commands still apply on Enter, and suggestions,
  saved views and recent commands are keyboard-reachable options. Its
  toasts render through the toolkit `Toaster`.
- The `dag` widget's layered layout moved to a shared module and now breaks
  cycles where they block the traversal (the node with the fewest unmet
  incoming edges is released), so a cyclic graph lays out in layers instead
  of stacking its cycle in one final rank.
- **Widgets follow the v2 type scale.** No widget, dashboard chrome or
  toolkit-built example renders text under 11 px (the `--mtc-font-size-xs`
  step; the clone showcases are fidelity references with their own type,
  see `DESIGN.md`, Typography); SVG and chart axis labels are 11 px; small
  labels are sentence case without letter spacing instead of uppercase
  micro-caps (the catalog's "live" badge reads "Live").
- **`object_view` on the object components**: `ObjectHeader` (compact),
  `PropertyPanel` (typed values, filter) and `LinkPanel` (links grouped by
  link type) replace the bespoke header, key-value list and link list;
  action buttons are toolkit `Button`s. The payload is unchanged.
- **`table` on `DataGrid`**: one tab stop and keyboard navigation, windowed
  rows, `aria-sort` headers, typed number cells; heat shading, signed
  colours, row flashes, search, CSV export and paging keep their options.
  Its columns are sized to their content (only a sparkline column is
  fixed), the label column takes the spare width and gives way first, and
  text ends in an ellipsis, so the flagship dashboard's watchlist still
  shows Sym, Last, Chg%, Vol and Trend at 1440 px. Heat tints are at most
  25% (they were 35%), and a signed value on a tint uses its soft tone, so
  it keeps 4.5:1.
- **`text` bodies are Markdown** (sanitised with DOMPurify, loaded lazily,
  plain text until it loads); `options.markdown: false` keeps raw text.
- `trade` resolves `${ctx.*}` placeholders in `options.symbol` and
  `options.quote_unit`, like every other template string (the example
  ticket no longer shows a literal `${ctx.symbol}`); the amount and price
  inputs are labelled and shrink so a narrow ticket keeps its unit.
- Text that was drawn in the border colour (code browser line numbers,
  days outside the month, empty board lanes, path separators) uses the
  muted text colours, and decorative separators are hidden from assistive
  technology.
- The Kelly example widget is built on toolkit controls (`FormField`,
  `Input`, `ButtonGroup`, `StatTile`) with sentence-case labels and no text
  under 11 px.
- **The style guard is stricter.** Its legacy budget for sizes and
  tracking is zero, so any new sub-11 px size fails lint; it catches CSS
  `font-size` and `font` declarations, inline and SVG `fontSize` values
  under 11 px and Tailwind `text-[Nrem]` sizes, and rejects uppercase and
  letter-spaced labels; it scans `examples/` and holds the page templates
  (`src/templates/`, stories included) to every production rule, while
  other stories and the clone showcases (fidelity references with their own
  stylesheets; `DESIGN.md`, Typography, and `examples/clones/README.md`)
  keep only the story-frame rule. Its rules live in
  `scripts/style-token-rules.mjs` with unit tests.
- The browser suite waits for a story's play function to finish and the
  preview's loading overlay to clear before it compares or interacts, so no
  baseline captures a half-played story or a spinner, and it re-reads an
  empty accessibility tree for a few seconds before failing.
- Re-recorded baselines: the `dashboard-{mobile,tablet}`,
  `readiness-{dark,light}`, `toolkitAppSurface-*`, `toolkitDatabase-*`,
  `toolkitHostIntent-*`, `toolkitModelWorkbench-*`,
  `toolkitObjectWorkbench-*`, `toolkitPropertyList-*`,
  `toolkitScopedRegistry-*` and `toolkitTableViewer-*` screenshots, and
  the `dashboard-*`, `readiness`, `toolkitHostIntent` and
  `toolkitPropertyList` text snapshots.

### Fixed

- `source_id` sources keep `staleAfterMs` and `throttleMs`, so a backend
  panel goes stale (and a backend stream throttles) like a URL source.
- A hovered solid button keeps its on-colour (white on the primary blue was
  turning to the foreground colour, 1.96:1 in light and 3.49:1 in dark);
  hover moves the fill away from the text colour instead, and a unit test
  holds 4.5:1 in every theme.
- Several users or links in a record value are one chip each, by their
  choice labels, instead of one chip of the joined ids ("jules, noah").

### Removed

- The root entry's `CommandPalette` export was the Dashboard-internal
  palette, which only worked inside a `Dashboard`; the root and toolkit
  `CommandPalette` is now the host-driven palette. `PaletteSuggest` and
  `PaletteSuggestion` (the `Dashboard.paletteSuggest` types) remain.
- `src/core/Toaster.tsx`, replaced by the toolkit `Toaster`.
- `src/widgets/fileBrowserDecoders.ts` (`fetchText`, `parseCSV`,
  `prettyJSON`, `renderMarkdown`): unbounded reads and an unbounded CSV
  parser, replaced by `FilePreview` and its bounded policy.
- `useDataSource().error`, the one-line error string deprecated in 0.6.0.
  Read `sourceError` (a `SourceError`) and `describeSourceError` for a
  summary line.
- The widgets' bespoke `object_view` header and link list and the `table`
  widget's hand-built `<table>` markup (replaced by the toolkit components
  above).

## [0.6.0] — 2026-09-25

Foundations for the ontology-first look across the fleet: deterministic
visual regression, tokens v2 (slate neutrals and one azure accent), the
`standard` density, icon set v2 with type identity, typed transport failures
with access and session states, a product transport entry, a message catalog
with `Intl` formatters, and a JSON payload case. The ontology components
(`PropertyValue`, `ObjectHeader`, `DataGrid`, link panels and graphs,
`NavRail`, `ProductShell`) follow in 0.7.0.

### Migration

- **Errors.** Read `useDataSource().sourceError` (a `SourceError`) instead of
  the string `error`, which is deprecated and removed in 0.7.0. Render a
  failure with `SourceErrorState` (or `ErrorState error={…}`) rather than its
  message; hosts that matched on `"HTTP 403"` text should switch on `kind`.
  Expose `X-Request-Id` through CORS so request ids reach the UI.
- **Transport.** Pass `fetch={createProductFetch({ onUnauthenticated })}`
  (`medallion-terminal-core/app`) to `Dashboard` or `MultiDashboard` to get
  request ids, trace context and a session-expiry hook on backend calls.
  Tests and stories inject a fixture transport the same way instead of
  replacing `window.fetch`.
- **Density and shape.** `standard` (28 px controls, 32 px rows) is the
  default; pass `density="comfortable"` to keep the old spacing (now 32/40
  px). `--mtc-radius-lg` is 6 px and badges are no longer pills.
- **Strings.** Toolkit defaults come from the message catalog: pass
  `locale` (and `messages` overrides) to `DesignSystemProvider`. Component
  props such as `retryLabel` still win.
- **Portals.** Render menus, trays and toasts into `usePortalContainer()`
  so they keep the scope's theme and fonts.
- **FileBrowser markup is not API.** Hosts that restyle or rewrite the built-in
  widget's DOM by class name should register their own widget; the 0.7.0
  resource table replaces that markup.
- **Clone showcases.** `ProductShowcaseDefinition.shortName` is now
  `displayName`, a neutral name, and `mark` is `icon`; `NeutralMark` takes no
  `color`; `GoogleWorkspaceEditor.initialGeminiOpen` is
  `initialAssistantOpen`.

### Added

- **Vendored fonts.** Inter 4.1 and JetBrains Mono 2.304 ship as Latin and
  Latin Extended variable subsets (weights 400–600, 208 KB together) in
  `src/fonts/`, with their SIL OFL 1.1 texts and a provenance note. The
  library build prepends the `@font-face` rules to `dist/styles.css` and
  emits the files to `dist/fonts/`, so hosts resolve them as ordinary
  relative stylesheet assets (no `data:` fonts, CSP `font-src 'self'`
  suffices). `--mtc-font-sans` is Latin-first
  (`Inter, "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", system-ui`)
  and `--mtc-font-mono` starts with `"JetBrains Mono"`.
- **`useDesignSystem()`** reads the nearest scoped root's theme and density.
  `Dashboard` and `MultiDashboard` now inherit the enclosing
  `DesignSystemProvider` theme when their own `theme` prop is omitted
  (outside a provider the default is still `dark`), and publish their own
  scope to descendants.
- **Tokens v2 roles** (additive): `--mtc-border-control` (input and
  checkbox boundaries at 3:1), `--mtc-selection` / `--mtc-selection-hover`,
  `--mtc-link`, `--mtc-on-accent`, status tints `--mtc-{ok,warning,danger,
  info}-bg`, `--mtc-graph-edge` / `--mtc-graph-edge-active`, twelve object
  type identity slots `--mtc-type-{azure,cyan,teal,green,lime,olive,amber,
  orange,red,rose,magenta,violet}-{fg,bg}`, `--mtc-font-size-2xl|3xl`,
  per-size `--mtc-line-height-{xs…3xl}`, `--mtc-space-12|16`,
  `--mtc-radius-xs`, `--mtc-elevation-0|3`, and `--mtc-on-scrim` (text on
  a black scrim over media, light in every theme). Every existing `--mtc-*`
  name is kept.
- **Icon set v2 and `TypeGlyph`.** `Icon` grows from 22 to 93 first-party
  glyphs (`ICON_NAMES`): object nouns for type icons (`object`, `person`,
  `people`, `organization`, `building`, `contract`, `document`, `dataset`,
  `table`, `column`, `bucket`, `link`, `graph`, `event`, `calendar`,
  `clock`, `currency`, `order`, `package`, `truck`, `location`, `tag`,
  `flag`, `alert`, `shield`, `key`, `lock`, `server`, `cloud`, `branch`,
  `commit`, `workflow`, `play`, `pause`, `film`, `music`, `image`,
  `chart-line`, `chart-bar`, `globe`, `mail`, `phone`, `ticket`, `tool`,
  `badge`) and verbs and places (`copy`, `filter`, `columns`, `sort-asc`,
  `sort-desc`, `arrow-left`, `arrow-right`, `bolt`, `history`, `terminal`,
  `plug`, `topology`, `home`, `explore`, `ontology`, `activity`, `refresh`,
  `sign-in`, `sign-out`, `hourglass`, `eye`, `download`, `upload`, `edit`,
  `trash`, `star`). `IconName` only gains members. `TypeGlyph` renders a type
  icon on one of the twelve identity slots at 16/20/24/40 px;
  `TYPE_COLORS` lists the slots and `typeColorFor(typeId)` picks a stable
  fallback slot from a type id. Storybook adds Toolkit/Components/Iconography
  with dark and light baselines.
- **`usePortalContainer()`** returns a body-level element inside the
  nearest scope (`DesignSystemProvider` or a Dashboard) that carries its
  theme class, `data-theme` and `data-density`, so portalled menus, trays
  and toasts keep the scope's tokens and fonts instead of falling back to
  the host page's styles (serif portals). The host is created on first use,
  follows theme and density changes, and is removed when its last user
  unmounts; it returns `null` outside a scope and during server rendering.
- **Typed transport failures (`SourceError`).** Every entry point exports
  `SourceError` (`kind`: `unauthenticated | forbidden | not_found |
  rate_limited | unavailable | invalid | unknown`, plus `status`, Connect
  `code`, the server's reason as `message`, `requestId` and `retryAfterMs`),
  `sourceErrorFromResponse` (reads a bounded Connect JSON error body and the
  `x-request-id` / `Retry-After` headers; it stops reading an error body
  after 16 K characters and cancels the rest), `toSourceError` (generated Connect
  client errors by numeric or string code, a `SourceError` a transport
  wrapped as its error's `cause`, timeouts and network failures) and
  `describeSourceError`. `useDataSource()` returns `sourceError`; widgets
  render it through `ErrorState`, which takes `error` and leads with product
  copy for the kind while the server's reason, code and request id sit in a
  Details disclosure. A 403 now reads "You don't have access" with
  `payroll:read scope required` under Details instead of "HTTP 403".
- **`DataResponse.json` (`google.protobuf.Value`, field 21) and
  `SHAPE_JSON`.** A source can return any JSON document for the `json`
  widget, such as the ProtoJSON of a message the backend decoded with its own
  descriptors (workflow run payloads, for example); `useDataSource` unwraps
  the case like every other one. Additive: `buf breaking` passes against
  0.5.2. The reference backend serves a `platform_manifest` json source, so
  the conformance check covers the new case (17 sources).
- **Access, session and freshness states.** `AccessDeniedState`
  (`resource` names the scope and whom to ask), `SignedOutState`
  (`onSignIn`), `SessionExpiredState` (`onContinue` renews without leaving the
  route), `NotFoundState`, `RateLimitedState` (the wait from `retryAfterMs` or
  the error's `Retry-After`) and `StaleState` (`lastUpdated`, relative time,
  `onRefresh`, a `compact` form), plus `SourceErrorState`, which picks the
  state for a `SourceError`'s kind. Each keeps the server's reason, code and
  request id in a Details disclosure and renders catalog copy in `en` and
  `zh-CN`. Dashboard widgets render failed sources through
  `SourceErrorState`, so a denied source reads "You don't have access" inside
  its widget; compact states fill the widget body and scroll rather than clip
  their Details and Retry. Storybook adds Toolkit/Workbench/Primitives/Access, session and
  freshness states with dark and light baselines and a play test.
- **`medallion-terminal-core/app`: product transport.** `createProductFetch`
  wraps `fetch` for product UIs and stays a drop-in `fetch` (plain calls and
  connect-web's `createConnectTransport({ fetch })`): every request carries
  `x-request-id` and a W3C `traceparent` unless it already has them, aborts on
  the caller's signal or when its response headers have not arrived within
  `timeoutMs`, rejects with a `SourceError` (`unavailable`) on a timeout or
  network failure (a caller's own abort keeps the platform `AbortError`),
  reports each 401 to `onUnauthenticated` with its typed error, and reports
  every settled request to `onRequest` for telemetry. The timeout never cuts
  a body that is already streaming, so `Stream` sources, `WatchAction`
  lifecycles and slow downloads run past it. It bounds every request whose
  body is buffered (none, a string, `URLSearchParams`, an `ArrayBuffer` or a
  typed array), which includes every connect-web call, unary or streaming,
  JSON or binary, since connect-web serialises each message to a
  `Uint8Array`; only open-ended uploads (a `Blob`, `File`, `FormData` or
  `ReadableStream` body, or a `Request` object with a body) are unbounded.
  One call sets its own wait with `ProductRequestInit.timeoutMs` (`0` opts
  it out, a positive value bounds it, even an upload), and a connect-web
  call that passes its own `timeoutMs` call option (sent as
  `connect-timeout-ms`) is left to the deadline connect-web enforces. A hung
  backend rejects a connect-web call after `timeoutMs` with a `ConnectError`
  whose `cause` is the typed timeout; `toSourceError` returns that cause.
  The unit suite drives a generated `TerminalService` client through
  `createConnectTransport({ fetch: productFetch })` against a loopback server
  that never answers (`@connectrpc/connect` and `@connectrpc/connect-web`
  2.2 are dev dependencies for that test only). A `SourceError` built from a
  response it returned keeps the id the client sent when the server echoes
  none (in `ensureOk` and in the Dashboard's own data sources alike). No
  React and no runtime dependencies; the entry is budgeted at 4 KiB.
- **`Dashboard.fetch` (and `MultiDashboard.fetch`)** injects the host
  transport for exactly the requests `backendHeaders` covers: `Get`,
  `Stream`, `ListSources`, `Generate`, `SubmitAction`, `WatchAction` and
  backend-relative file operations. Template-authored URLs keep the platform
  `fetch`. `useDataSource(source, { fetch })` and a fourth `useWatchAction`
  argument take the same transport.
- **Message catalog and `Intl` formatters.** `DesignSystemProvider` takes
  `locale`, `timeZone` and `messages` (per-key overrides); nested scopes and
  Dashboards inherit what they do not set. Toolkit defaults (loading and
  error copy, retry, dialog and drawer close, tree expand and collapse, the
  combobox placeholder and empty text, tag remove, toolbar, breadcrumbs and
  split-pane labels, the button busy label) are keyed in `EN_MESSAGES`, with
  `ZH_CN_MESSAGES` selected for any Chinese locale. `useMessage()` and
  `useLocale()` expose the scope's catalog and locale; `formatNumber`,
  `formatBytes`, `formatDateTime`, `formatRelativeTime` and `formatDuration`
  format with an explicit locale and time zone. Explicit component props
  still win, and `lang` is emitted only when `locale` is passed.
- **`scripts/check-style-tokens.mjs`**, run by `pnpm lint`, fails when
  production source adds a colour literal outside a token declaration, a
  Tailwind arbitrary colour, a `text-[Npx]` below 11 px or off the scale, an
  arbitrary `tracking-[…]` or a `backdrop-filter` blur, and when a story
  (under `src/` or `examples/`) frames itself in any background string but
  one `--mtc-*` token (or `transparent`): a hex, `rgb()`/`hsl()`, a named
  colour such as `'black'` or `'white'`, or a gradient. Existing
  debt (documented canvas fallbacks and the widget type sizes the next
  release sweeps) is a ratchet in
  `scripts/style-token-budget.json`: a file can never exceed its budget, and a
  stale budget fails until it is lowered.
- **Exact text baselines beside the pixel ones.** Every pixel baseline test
  also compares the story's accessibility tree (roles, accessible names and
  text, numbers included) with `browser-tests/__aria__/${story}.yml`, with
  no tolerance, so a widget that changes state fails the gate even when the
  pixels move less than the 0.3% anti-aliasing tolerance. A themed story's
  dark and light renders compare the same `${story}.yml`, so its text may
  not change with the theme, and the dashboard's mobile and tablet
  screenshots have their own `dashboard-${viewport}.yml`. (A local revert of
  the typed-error rendering, which brings back "Unable to load · HTTP 403 ·
  Retry" in the payroll widget, differs from the readiness baseline by 0.12%
  of its pixels and passes the pixel check in both themes; the text check
  fails it in both.) Baseline stories render at one pinned wall-clock
  instant (`page.clock.setFixedTime`), so live clocks and relative times are
  identical on every run and every day, while behaviour and axe tests keep
  the real clock. A Storybook "failed to load the preview" page, or a story
  with an empty accessibility tree, fails the test instead of being compared
  or recorded as a baseline.
- **Light visual baselines.** The Playwright gate renders every themed
  toolkit story and the production-readiness workspace in dark and light
  (`browser-tests/__screenshots__/${story}-${theme}.png`) and runs axe on
  the toolkit stories in light as well. `openStory(page, id, {theme,
  density})` sets the Storybook globals and waits for `document.fonts`;
  the browser project emulates `prefers-reduced-motion` so axe never samples
  a control mid-transition.

### Changed

- **Toolkit and stylesheet budgets grow** to 20 KiB static gzip (was 16)
  and 19 KiB (was 18): the typed failures, access and session states, and
  the two-language catalog add about 4.7 KiB to the toolkit; tokens v2 and
  the vendored `@font-face` rules had used the old stylesheet headroom.
- **`useDataSource().error` is deprecated** in favour of `sourceError` and
  is removed in 0.7.0. It stays a one-line string (`permission_denied:
  payroll:read scope required`, `HTTP 503`); streamed failures lost their
  `ConnectRPC: ` prefix and an HTTP failure with a Connect body now carries the
  server's code and reason instead of the bare status.
- **`ErrorState.message` is optional** when `error` is given, and
  `intent` defaults from the error's kind (warning for `rate_limited` and
  `unavailable`).
- **`package.json` is `private` and declares `Apache-2.0`.** Distribution
  has been Git-only since 0.5.2, but nothing stopped a habitual
  `pnpm publish` from claiming the unscoped name on the public registry, and
  license scanners read the missing field as UNKNOWN. `pnpm check:package`
  now asserts both, matching Invariant Protocol and temporaless. Installing
  from Git is unaffected.
- **`scripts/public-surface-check --full-history` is clean.** A May 2026
  commit subject names the example dashboard in a spelling the content rule
  does not cover; `.public-surface-allow` gains a `COMMIT` exception pinned
  to that one exact subject line instead of a rewrite of published history.
- **Icons draw 1.75-unit strokes** (was 1.8) and every glyph is one path;
  `Icon` accepts a `strokeWidth` override (TypeGlyph uses 2 at 16 and
  20 px).
- **Density `standard` is the default.** `Density` gains `'standard'`
  (additive): 24/28/32 px controls and 32 px rows, between `compact`
  (20/24/28, 28) and `comfortable` (28/32/36, 40, which also loses 2 px per
  control). `DesignSystemProvider`, Storybook and a non-compact `Dashboard`
  now render `standard`; the dashboard toggle reads Compact / Standard.
- **Control restyle on the density model.** Buttons are 13/500 with 6 px
  icon gaps and never shrink inside a flex row, which fixes truncated toolbar
  actions ("Fil…"); inputs use 13 px text and the canvas fill inside
  toolbars; tabs are 32 px, 13/500, with an optional `TabItem.count`; tree
  rows sit one step below the row height with a 12 px indent and mark
  selection with `--mtc-selection` plus a 2 px accent bar; breadcrumbs keep
  12 px with a regular-weight current crumb; tags and badges are 20 px,
  11/500, 2 px radius on the status tints (badges are no longer pills);
  callouts are a tinted fill with a 2 px leading tone bar; the split-pane
  separator is a 1 px line with an 8 px hit area; menu items use 13 px.
- **`PropertyList` values read as text.** Values use the sans face at 13 px
  under 12 px labels in a 160–200 px column; arrays of plain values render
  as a comma-separated list. Only structured values fall back to monospace
  JSON (in a `code` element).
- **Tokens v2: slate neutrals and a single azure accent.** The four themes
  are re-derived in OKLCH at hue 255 (`operator` keeps its citrine accent on a
  one-step-darker slate; `high-contrast` keeps its black canvas). Solid
  primary actions and checked controls fill with `--mtc-accent-strong` and
  carry `--mtc-on-accent`; inputs, checkboxes and switches draw
  `--mtc-border-control`. Chart, code and signal colours are retuned to the
  same family. The type scale is 11/12/13/14/16/20/24 px with a 13 px base
  (`--mtc-font-size-md`, `-lg` and `-xl` move to 13, 14 and 16 px); radii are
  2/3/4/6 px (`--mtc-radius-lg` 10 → 6 px, `--mtc-radius` 6 → 4 px).
  Elevation is reserved for overlays: tooltips, menus and popovers use
  level 2, dialogs and drawers level 3. `WidgetShell` headers are 36 px with
  14/600 titles.
- **`themeColors.test.ts` covers every role in every theme**: text roles on
  the canvas, surfaces, quiet fill and selection; status text on its tint;
  `--mtc-on-accent` on `--mtc-accent-strong`; each type slot on its chip; code
  tokens; control boundaries, graph edges, the primary fill and chart
  colours at 3:1. The Candlestick and GeoMap canvas fallbacks are pinned to
  the dark token values (they had drifted).
- **`DESIGN.md` is rewritten** for the ontology-first language: principles,
  the role table, object type identity, the type scale, space, shape and
  elevation, and a product hierarchy in which the ontology language is the
  visual system everywhere while Home stays first. It states the originality
  rule (inspired by, never a copied name, logo, palette or layout).
- **Storybook renders every story inside `DesignSystemProvider` on a
  full-bleed canvas** (`layout: 'fullscreen'`), so the theme and density
  toolbar globals reach toolkit components and Dashboards alike. Visual
  baselines were regenerated as a pure font and harness change; the toolkit
  ones moved from `${story}.png` to `${story}-dark.png` beside the new
  `-light` files. The production-readiness baselines are regenerated again
  for the typed failure states: the denied payroll widget reads "You don't
  have access" with a Details disclosure (the committed images had kept the
  earlier "Unable to load · HTTP 403" widget inside the pixel tolerance), and
  the dashboards' status-bar clocks show the pinned time. The canvas is its
  own block formatting context (`display: flow-root`), so the 16 px margin
  of a widget story's frame stays inside the themed root instead of
  collapsing through it and leaving an unthemed (white) strip above the
  story in dark and light alike; a browser test checks that the theme
  paints the canvas edges of five framed stories in both themes.

- **Clone showcases no longer show third-party names, logos or wordmarks.**
  Every clone header renders a neutral name and `NeutralMark` (a generic
  glyph on one slate square, identical in every clone; it takes no colour,
  so no mark carries a brand colour) in place of the product's name and
  logo. That covers the archetype clones' lettermarks on brand fills, the
  streaming clone's red logotype, its red "N" series mark and "TOP 10"
  poster badge, the document suite's coloured file-type icons, its
  four-colour calendar tile and gradient assistant orb, the drive's gradient
  assistant mark, and the maps, code, notebook, support and platform clones'
  logo tiles. The streaming clone's poster badges ("New episode", "New
  season", "Limited series") and progress bars use the toolkit's azure
  accent instead of the reference's signature red. Product self-references
  and branded features in labels, placeholders and chrome copy are neutral
  ("Files", "Tracker", "Forecasts", "Search maps", "Processing fee",
  "Assistant", "Ask AI", "AI summary", "Governance", "Orchestration",
  "Search the portal", "Docs", "SQL editor", "Fraud screening", "Workflows",
  "Call", "Videos", "Messages", "AI agent", "Most watched today", "Start a
  group session"), card chips read "Card" instead of a payment network's
  logotype, the platform clone's code sample and resource ids use neutral
  dataset paths, and the proprietary typefaces are gone from the clone font
  stacks (system and open fonts only).
  `src/__tests__/cloneNeutrality.test.tsx` renders all 140 clone stories and
  fails when visible text or an accessible name says a referenced product,
  vendor or branded feature. Layouts are unchanged; the folders, Storybook
  titles, story names and `cloneVendor` / `cloneProduct` parameters still
  name the reference so it can be found. The archetype catalog's `shortName`
  is now `displayName` and its `mark` letter is an `icon`, `NeutralMark` has
  no `color` prop, and the document suite's `initialGeminiOpen` prop and
  stories are `initialAssistantOpen` and `Assisted*`. Clone baselines were
  regenerated.

### Fixed

- **README named the wrong license.** Its License section said MIT; it now
  names Apache-2.0 (the `LICENSE` file and `package.json`) and the fonts'
  OFL.
- **MediaGallery text on media was unreadable in the light theme.** Tile
  captions, the video duration badge and the viewer's previous and next
  arrows sat on a black scrim in `text-zinc-100` / `text-zinc-300`, which
  map to the theme's foreground and so turned dark in light. They use
  `--mtc-on-scrim` now, and the arrows' scrim is 70% black like the
  badge's (`themeColors.test.ts` checks the text on it over a white image
  at 4.5:1).
- **`pnpm build:lib` fed its own previous output back in.** `dist/` is
  committed, and Tailwind scanned it for class names, so a utility removed
  from `src/` (the gallery's old translucent arrow fills) survived one
  rebuild in `dist/styles.css` and `check:dist` then failed on the next.
  Tailwind scanned the root Markdown docs too, so a class named in prose
  landed in the published stylesheet. The stylesheet excludes `dist/` and
  the root `*.md` files from its sources, so one build is final and only
  code adds utilities.

### Removed

- **Decorative surface effects**: the workspace radial and linear gradients,
  inset highlights on toolbars, controls, widgets, buttons and inputs, the
  widget drop shadow, the `backdrop-filter` blur on overlays and sticky
  headers (the dashboard's fullscreen overlay is now an opaque canvas and the
  media gallery's day headers are solid), the dashboard title's signal bar, the button press translation, the landing-card hover
  lift, and the media thumbnail placeholder gradient. `--mtc-highlight` stays
  defined as `transparent` so host overrides remain valid.
- **Hard-coded Storybook canvas colours.** The 48 widget stories that framed
  themselves in a dark literal (`#18181b`, `#11151a` or `#0a0a0a`) use
  `--mtc-surface` and `--mtc-border` instead, so light and high-contrast
  themes preview correctly; the preview's fixed `backgrounds` swatches are
  disabled because the themed root paints the canvas.
- **The `minimumReleaseAgeExclude` entries for MapLibre GL JS 6.11.2 and
  Vite 8.3.1** in `pnpm-workspace.yaml`, and their comment. Both releases
  passed pnpm 11's one-day release age at 2026-09-25T12:46:30Z, after which
  the entries excused nothing.
- **The streaming clone's signature red** (`--nfx-red`, `#e50914`) on its
  poster badges and progress bars.
- **The `.shrink` utility in `dist/styles.css`**, which only the word
  "shrink" in the docs' prose generated; no component uses it.
- **Logo reproductions in the clone showcases**: the drawn marks and their
  CSS (the file, calendar, photo, chat, CRM, spreadsheet, ledger, merge and
  music logos, the lettered and script-font wordmarks, the four-colour mail
  mark, the archetype lettermarks, the streaming logotype, series mark and
  top-ten badge, the document suite's file-type icons, calendar tile and
  assistant gradients, and the maps pin, code, notebook, support and
  platform logo tiles), and the proprietary typeface names in clone font
  stacks.
- **`installReadinessTerminalMock`** (Storybook example helper). The
  production-readiness stories inject the fixture TerminalService through
  `Dashboard.fetch` instead of replacing `window.fetch`.

## [0.5.2] — 2026-09-25

### Changed

- **Dependency currency, round 3.** React 19.3 (and its typings), MapLibre
  GL JS 6.11.2, Vite 8.3.1, Storybook 10.6.0 (`storybook`, `@storybook/react`,
  `@storybook/react-vite`, `addon-a11y`, `addon-vitest`), protobuf-es 2.15
  (`@bufbuild/protobuf` and `protoc-gen-es`), Playwright 1.63.0, dompurify
  3.4.16, marked 18.0.14, hyparquet 1.31.1, hyparquet-writer 0.16.10, and
  `@types/node` 24.13.6. Vitest and `@vitest/browser-playwright` stay at
  4.1.11 because `@storybook/addon-vitest` 10.6 peers on Vitest 3 or 4;
  `@types/node` stays on the 24 line to match the runtime. `src/gen` and
  `dist/` are regenerated; the visual baselines hold unchanged under
  Playwright 1.63's Chromium 153. MapLibre 6.11.2 and Vite 8.3.1 are named
  in `pnpm-workspace.yaml`'s `minimumReleaseAgeExclude`, because pnpm 11
  enforces its one-day release age even on the gate's frozen install; the
  entries are dead config after 2026-09-25T12:46:30Z.
- **The toolchain is pinned, not inherited.** The Flox manifest moves to
  schema 1.12 and pins Node 24.20 (`nodejs_24`, in its own package group),
  pnpm 11.27.0 (equal to `packageManager`) and Buf 1.72.0, locked for the
  three systems the catalog serves them on (aarch64-darwin, aarch64-linux,
  x86_64-linux). `engines.node` is `>=24.18.0`, the fleet floor.
- **`buf breaking` compares against the newest reachable release tag**
  (`scripts/check-breaking.mjs`) instead of `origin/main`, which on main
  after a push compared HEAD to itself and could never fail; on the release
  commit the preceding release is the baseline.
- **CI.** `actions/checkout` v7.0.1, `actions/cache` v6.1.0,
  `actions/deploy-pages` v5.0.1, and the gate's Chromium is cached between
  runs keyed on the lockfile.
- **Releases are Git tags only.** `make release` runs the version gate in
  release mode, then creates and pushes the annotated `vVERSION` tag and
  nothing else: the registry publish step and the `prepack` hook are gone,
  because consumers install
  `github:jim-technologies/medallion-terminal-core#<sha of a vX.Y.Z tag>`
  and `dist/` and `src/gen` are committed for exactly that. The gate
  (`scripts/check-version.mjs`) now also checks that `CHANGELOG.md` opens
  with `[Unreleased]` and that its first release heading is `VERSION`
  (with an empty `[Unreleased]` at release time), that `packageManager`
  names the pnpm Flox locks, and that `engines.node` declares the runtime
  floor (`>=24.18.0`). README gains an Installing section.
- **Dependency currency, round 2.** dompurify 3.4.14, marked 18.0.11,
  hyparquet-writer 0.16.8, protobuf-es 2.14 (`@bufbuild/protobuf` and
  `protoc-gen-es`), Vite 8.2, `@vitejs/plugin-react` 6.1, and esbuild
  0.28.2. `src/gen` and `dist/` are regenerated under the new protobuf-es.

## [0.5.1] — 2026-08-29

### Changed

- **The public-surface guard is the shared fleet implementation.**
  `scripts/public-surface-check` replaces the repository-local
  `scripts/public-surface-check.mjs` and is byte-identical in every public
  jim-technologies repository. It scans tracked file content, tracked paths,
  and the commit messages a push would publish, refuses to run if any deny
  category stops matching its own probes, and ships with
  `scripts/public-surface-check-test`, which `validate` runs so the gate goes
  red if the guard itself stops working. Justified exceptions — this
  repository's own schema package, product name and browser storage key
  prefix, and the third-party product vocabulary the `examples/clones`
  reproduce — are one reasoned line each in `.public-surface-allow`.
- **The demo persona address and the sample production host are fictional.**
  The clone demo identity and the backend examples now use `jun@example.test`
  alongside the existing `maya@example.test`, and the CORS integration test
  and the Backstage clone's Production quick link point at
  `https://app.example.com`. Affected visual baselines are regenerated.
- **The public proto surface is fully documented and comment-linted.**
  `buf lint` now enforces the `COMMENTS` rules, every service, RPC, message,
  field, enum, and oneof in `proto/medallion/terminal/v1` carries doc
  comments, and the regenerated `src/gen` and `dist/gen` bindings are
  committed.
- **Browser-test screenshots rasterize identically on every machine.** The
  Flox manifest pins the fonts the visual baselines depend on (Lato, DejaVu,
  Inter, Noto Color Emoji) and the activation hook points fontconfig at
  them, so Chromium no longer falls back to whatever the host has installed.
  The visual baselines are regenerated under the pinned fonts.
- **`make help` is one screen.** The default target lists the daily verbs;
  `make help-all` keeps the full self-documenting listing.
- **The Makefile contract is the fleet-canonical text.**
  `MAKEFILE-CONTRACT.md` is rewritten to the version every public
  jim-technologies repository shares byte-for-byte, including the statement
  of the gate's floor.
- **Dependency currency.** MapLibre GL JS 6.6, Storybook 10.5.10, Playwright
  1.62, hyparquet 1.29, and `@axe-core/playwright` 4.13, plus patch bumps to
  the React typings, Recharts 3.10.1, lightweight-charts 5.2.1, and Vitest
  4.1.11.

## [0.5.0] — 2026-08-18

### Changed

- **The jim-technologies open-source Makefile contract is installed**
  (`MAKEFILE-CONTRACT.md`). The gate verb `check` is renamed to `validate`
  everywhere — Makefile, package scripts, CI, and docs — and `ci:verify`
  folds into it, so `make validate` is the one gate and exactly what CI
  runs. `validate` now also runs a public-surface guard
  (`scripts/public-surface-check.mjs`) and `VERSION`↔`package.json` parity
  (`scripts/check-version.mjs`). New `make fmt`, `make generate`, `make
  test-*` sub-verbs, and a fail-closed `make release`
  (`scripts/release.mjs`) that refuses a dirty or unpushed tree and only
  publishes with `RELEASE_CONFIRM=yes`. A root `VERSION` file is the single
  release version.
- **CI is Flox-only and runs one command.** The `ci` workflow is a single
  SHA-pinned job whose only step after checkout/Flox/cache is
  `flox activate -- make validate`; the gate itself installs dependencies
  (frozen lockfile) and Playwright's lockfile-pinned Chromium, so it cannot
  drift from a local run. The failure-artifact upload is gone (workflows
  never publish artifacts) and the Storybook Pages deployment is normalized
  to the same secretless skeleton via `make build-storybook`. `actionlint`
  joins the Flox manifest as the workflow linter.

- **Terminal Core is now the shared Medallion application UI toolkit.** The
  existing dashboard and widget SDK remains intact while public scoped
  foundations add dark, operator, light, and high-contrast presentation,
  compact/comfortable density, descriptive token aliases, reduced-motion
  behavior, and an SSR-stable `DesignSystemProvider`. File browser entries
  prefer stable object IDs, preserve path fallback, expose capabilities and
  unresolved-link metadata, and treat semantic kind/content type as
  authoritative over filename extensions.
- **Clone showcase visual polish.** Google Docs now uses a page-aligned,
  responsive ruler with quiet margin zones, measured ticks, and distinct
  indent controls. Mobile Shopify retains its complete account toolbar without
  page overflow, and Databricks notebooks reclaim the hidden navigation column
  so cells, result tables, and charts remain readable on narrow screens.
- **Vendor-first showcase catalog.** Storybook and `examples/clones` group
  product suites under their provider—including Google, Palantir, Atlassian,
  Meta, Microsoft, OpenAI, Apache, Grafana Labs, Interactive Brokers, and
  Intuit—then retain exact product names such as Drive, Photos, Jira,
  WhatsApp, Superset, Trader Workstation, and QuickBooks. Standalone products
  remain direct entries. Explicit vendor, product, and namespace metadata is
  enforced by tests and the built Storybook check.
- **Current reproducible toolchain.** Flox now locks Node 24.16, pnpm 11.9,
  and Buf 1.71 across supported platforms. The application stack moves to
  React 19.2, TypeScript 7.0, Vite 8.1, Tailwind 4.3, Recharts 3.10,
  lightweight-charts 5.2, MapLibre 6.0, Vitest 4.1, and Storybook 10.5. Node typings remain
  on the Node 24 line to match the runtime. pnpm's build allowlist lives only
  in `pnpm-workspace.yaml`, as required by pnpm 11. CI moves to the Node
  24-based checkout/cache and Pages action majors.
- **Generated-artifact checks work in dirty feature branches.** `pnpm lint`
  snapshots `src/gen` around Buf generation, and `pnpm check:dist` snapshots
  `dist/` around the library build. Both compare before/after content instead
  of comparing to Git HEAD, so synchronized source/proto/artifact edits can
  pass locally before they are committed.
- **Published-package contract is release-gated.** `pnpm check:package`
  imports the built entry, verifies the declared files and critical public
  exports/widget registrations, rejects accidental source/example
  publication, and enforces 96 KiB JavaScript / 18 KiB CSS gzip ceilings for
  the combined widget SDK and application toolkit.
- **Focused package entry points and enforced lazy isolation.** Toolkit,
  Dashboard, and asset-open consumers can import dedicated subpaths. Consumer
  bundle checks enforce static gzip budgets, retain lazy widget boundaries,
  and prevent chart, map, FFmpeg, or HEIC runtimes from leaking into unrelated
  applications. Chart and map engines are optional renderer peers. HEIC and
  MKV now resolve through an installed application or backend rendition
  instead of shipping browser transcoders in Terminal Core.
- **Professional scoped themes for SDK embedding.** Dashboard styles live
  under `.mtc-root`; `Dashboard` accepts `theme="dark" | "operator" |
  "light" | "high-contrast"`. Graphite/cobalt is the default, the optional
  operator preset uses a near-black/citrine language, the accessibility
  preset strengthens boundaries and focus, and public semantic/chart
  variables let hosts tune the identity without styling `html`, `body`, or
  their root.
- **Theme contrast guardrails.** Action, status, and ordinary text colors now
  maintain AA contrast across canvas, widget, and selected-panel surfaces in
  all four presets; non-essential metadata maintains at least 3:1. A focused
  test parses the public CSS tokens so future palette edits cannot silently
  weaken those guarantees.
- **Public examples stay generic.** Clone/vendor-specific example names,
  source labels, comments, and docs were replaced with neutral dashboard,
  monitoring, workflow, and analytics examples.

### Added

- **Focused Blueprint-category application primitives.** One dependency-free
  public layer now covers icons, actions, form controls, tags/badges/callouts,
  tooltips, popovers, menus/context menus, dialogs/drawers, tabs, and
  breadcrumbs. Data-dense workbench composition adds `AppSurface`, `Toolbar`,
  `Sidebar`, keyboard-resizable `SplitPane`, `Inspector`, `PropertyList`,
  controlled `Tree`, and generalized empty/loading/error states. Storybook
  includes light/dark and compact/comfortable states plus object and model
  three-pane compositions.
- **Backward-compatible host integration seams.** `Dashboard.onIntent` emits
  generic object-open, object-select, and command-invoke messages without
  authorizing host operations. `createWidgetRegistry()` provides isolated
  built-in-aware registries while legacy `registerWidget()` remains global and
  unchanged; supplied registries drive both rendering and template validation.
- **Semantic asset applications and host-controlled placement.** Asset
  references expose semantic kind, passive capabilities, and unresolved
  symlink targets directly. Installed applications can match MIME, intent, and
  semantic kind, while `assetApplicationFrame` lets a trusted host place the
  selected renderer in a host pane, route, drawer, or portal. The default
  remains an accessible fullscreen frame.
- **Complete provider-grouped product showcase catalog.** Storybook now adds
  dedicated suites for Google Gmail, Microsoft Outlook, Notion, Atlassian
  Confluence and Jira, Linear, GitHub, GitLab, Binance, CoinGecko, Polymarket,
  Interactive Brokers Trader Workstation, Grafana Labs Grafana, Apache
  Superset, Meta WhatsApp, and OpenAI ChatGPT. Representative states share
  neutral presentation contracts where appropriate so the examples remain
  maintainable and outside the published package while covering mail,
  knowledge, work tracking, code review, markets, analytics, and conversation.
- **Netflix product showcase.** `Clones/Netflix` provides host-data-injectable
  personalized browse rails, Continue Watching and Top 10 treatments, title
  search, My List, profiles, title and episode details, and player chrome.
  Original sample content keeps the example self-contained; catalog,
  recommendation, entitlement, delivery, and DRM services remain host-owned.
- **Spotify product showcase.** `Clones/Spotify` provides host-data-injectable
  personalized discovery, search and browse, Your Library, playlist and track
  detail, Now Playing, queue and Jam presentation, and a persistent responsive
  player. Original sample content keeps the example self-contained; audio
  delivery, recommendations, rights, and persistence remain host-owned.
- **Spotify Backstage developer-portal showcase.**
  `Clones/Spotify/Backstage` adds host-data-injectable Software Catalog,
  entity/plugin views, ownership, CI/CD, API relationships, Kubernetes status,
  system topology, Software Templates, and TechDocs compositions. Catalog
  ingestion, indexed search, authorization, scaffolder execution, secrets,
  infrastructure discovery, and documentation publication remain host-owned;
  no Backstage runtime or dependency enters the published package.
- **Google Calendar product showcase.** `Clones/Google/Calendar` provides
  host-data-injectable month, week, day, and schedule views plus multiple
  calendars, event details, guests, rooms, conferencing, tasks, appointment
  scheduling, and quick creation. The implementation remains example-only and
  projects neutral calendar sources and event records.
- **Snowflake and Databricks product showcases.** `Clones/Snowflake` models
  current file-based Workspaces, Horizon Catalog, SQL results, and query
  monitoring. `Clones/Databricks` covers collaborative notebooks, the new SQL
  editor, Lakeflow Jobs, Unity Catalog, compute context, and assistant
  presentation. Both accept host data and remain outside the published core.
- **Generic conversation foundation.** `ConversationPayload` and the
  `conversation` built-in cover channel history, direct messaging, support
  threads, and human/AI transcripts through one vendor-neutral contract.
  Channel, direct, and assistant modes render participants, replies,
  attachments, reactions, delivery states, system events, and tool turns;
  selection context, tidy export, BI descriptors, Storybook stories, and the
  complete `communications-hub.json` example are covered end to end.
- **Slack product showcase.** `Clones/Slack` provides a host-data-injectable
  product reference with workspace navigation, channels, presence, search,
  reactions, files, threaded replies, app messages, and composition. The
  generic conversation stories are explicitly named for Slack, WhatsApp, and
  ChatGPT so each supported presentation is easy to find.
- **Provider-neutral basemaps.** `geo_map` now accepts one normalized
  `options.basemap` contract: a curated network-free/OpenFreeMap/VersaTiles
  preset, any host-controlled MapLibre style URL, or generic XYZ/TMS raster
  tiles. Public services remain opt-in and swappable, legacy `style_url`
  remains compatible, untrusted templates require explicit preset/origin
  permission, and the default analytical grid still makes no network
  requests. The preset catalog and normalization helpers are public exports.

- **Owner-facing operating-intelligence direction.** `DESIGN.md` defines owner-first
  product hierarchy, visual roles, typography/density rules, originality
  guardrails, and a UI definition of done. `business-operations.json` adds an
  owner-facing workspace for revenue, cash, pipeline, capacity, customer
  health, and decisions; the example gallery now presents this product
  direction before the technical platform surfaces.

- **Generic record-work foundation.** `RecordSetPayload` adds typed fields,
  stable record identity, linked values, saved grid/board/calendar/list/
  gallery/timeline/form metadata, optimistic revision tokens, pagination,
  and declared create/update/delete capabilities. New `record_grid`,
  `record_board`, `record_calendar`, and `record_form` built-ins project the
  same payload into searchable rows, grouped workflow lanes, date planning,
  and context-driven create/edit/detail. Formula, lookup, rollup, and timestamp
  fields remain backend-computed and read-only.
- **Governed record lifecycle and reference workspace.** The generic
  `useSubmitAction` hook centralizes idempotency, lifecycle telemetry,
  asynchronous `WatchAction`, toasts, and coherent workspace refresh.
  The reference backend now demonstrates idempotent create, partial update,
  delete, field validation, computed margin, and stale-revision rejection.
  `work-management.json`, shared stories, export coverage, integration tests,
  and `RECORDS.md` make the seam runnable and extensible without introducing
  CRM/project/vendor concepts into framework code.

- **Data-platform foundation.** New canonical proto payloads and built-ins
  cover governed asset discovery (`AssetCatalogPayload` / `asset_catalog`),
  semantic object detail, links, and policy-gated actions
  (`ObjectPayload` / `object_view`), lineage/dependency graphs
  (`GraphPayload` / `dag`), and branch/ref-aware source browsing
  (`RepositoryPayload` / `code_browser`). All accept snake_case or Connect
  lowerCamelCase JSON, participate in context retargeting, export to tidy
  tables, appear in the BI descriptor, and ship with Storybook stories.
- **Platform reference stack.** The Node reference backend exposes catalog,
  object, lineage, and repository sources; `platform-foundation.json` composes
  them into a runnable dashboard. `PLATFORM.md` maps the frontend primitives to
  the metadata, ontology, policy, data, code, lineage, action, and AI services
  a production host still owns.
- **BI export / embedding surface.** The product-goal capability gap
  (export/serve to BI and reporting tools) is now
  built out:
  - **Unified export** — `exportView(view, format)` flattens any
    canonical widget payload to a tidy `{ columns, rows }` table
    (`flatten()`) and serializes it to **CSV**, **Parquet**, **JSON**,
    or **NDJSON**. Multi-series time-series pivot wide by timestamp;
    candles / heatmap cells / order-book levels / distribution slices /
    events / metrics all project to rows. Parquet uses the pure-JS
    `hyparquet-writer`, dynamically imported so it stays out of the core
    bundle (verified: the writer lands in a separate lazy chunk).
    `downloadView()` is the browser save wrapper; `<ExportMenu>` is the
    standalone UI affordance. Every data widget's action menu now has an
    **Export** submenu (CSV / Parquet / JSON / NDJSON) via `WidgetShell`.
  - **Embeddable mode** — `embed.html` is a standalone iframe entry
    driven entirely by the query string (`src`/`component`/`url`/
    `template`/`backend`/`ctx.*`/`stream`/`refreshMs`/`chrome`/`theme`), so a
    reporting panel or iframe, or BI report page can embed a single
    live widget or a whole dashboard. Backed by `<EmbedView>` +
    `parseEmbedConfig` / `buildEmbedUrl` (exported). `<Dashboard>` gained
    a non-breaking `chrome?: 'full' | 'minimal'` prop (default `full`)
    that hides the toolbar + status bar for embeds.
  - **BI-connector descriptor** — `buildBiDescriptor(sources, opts)`
    turns a `ListSources` catalog into a typed, serializable
    `BiConnectorDescriptor` (endpoint, `connect`|`sql` protocol,
    per-table column schema derived from each source's `Shape`, params,
    precomputed Get RPC URL). `connectionFields()` renders the
    human-pasteable connection settings for a config UI. The actual
    SQL/DuckDB gateway remains a separate backend concern; this is
    the client-side contract BI tools consume.
  - Adds `hyparquet-writer` (dependency) and `hyparquet` (devDependency,
    used only by the Parquet round-trip test). 41 new unit tests
    (export serializers + flatten projections + embed config + descriptor
    builder).

### Internal

- **Consistency/readability pass.** The
  Recharts tooltip `contentStyle`, duplicated inline across all eight
  chart widgets, is now a single shared `TOOLTIP_STYLE` in
  `widgets/colors.ts`. All production chart widgets now consume scoped
  semantic and `--mtc-chart-*` tokens instead of fixed dark-only palettes.
  The export-format menu list, previously duplicated in
  `ExportMenu` and `WidgetShell`, is now one `EXPORT_FORMATS` in
  `export/serializers.ts`. `Radar` dropped its widget-local color array in
  favor of the shared `PALETTE` (byte-identical colors). Minor whitespace
  tidy in the skeleton archetype map.

### Fixed

- **Action lifecycle correctness.** Generic writes now use a synchronous
  one-request lock, reject empty action ids, accept same-origin backends, fail
  closed on unknown statuses or streams that end before a terminal update,
  and always surface transport/watch failures. Object actions and Connect
  trades share that lifecycle; record edit/delete context only clears after
  terminal success, and asynchronous Share handlers are awaited with a busy
  guard and visible failure state.
- **Record projections preserve backend intent.** Edit forms no longer replace
  absent values with create defaults, explicit `null` remains distinct from an
  absent value, numeric fields reject non-finite input, board moves honor
  `allow_move: false`, and calendar colors come only from schema-declared
  choice semantics instead of business-word guesses.
- **File operations fail closed.** Search, ingest, dialog upload, and drop
  upload close same-turn duplicate-request windows; clearing search aborts the
  active request. Endpoint resolution preserves absolute CDN URLs and
  same-origin paths, Connect downloads surface error trailers and truncated
  streams, and HTTP-200 action failures can no longer be reported as uploads.
- **Runtime payload changes stay live.** Replaced inline sources now update
  without a source-mode change, slow polling requests cannot overlap, numeric
  protobuf enums normalize in repository and BI descriptors, and BI parameter
  metadata accepts canonical lower-camel ProtoJSON as well as legacy
  snake-case aliases.
- **Scoped Tailwind colors now resolve correctly.** Theme aliases use
  `@theme inline`, so utilities resolve `--mtc-*` variables on each mounted
  dashboard. Previously aliases were computed at document `:root`, where the
  scoped variables did not exist, causing invalid colors and browser-default
  white borders/backgrounds. The scoped reset also lives in Tailwind's base
  layer, preserving utility typography, radius, and background declarations.

- **File-browser contract drift.** The bundled example and reference backend
  now match the path-based FileBrowser contract introduced in 0.4.0:
  `bucket_ctx`/`bucket_param`, `{namespace}` + `{path}` media URLs,
  `TablePayload.rows` listings, path-based upload responses, pagination,
  HTTP Range preview, and Connect-framed download. The complete flow is covered
  by an integration test.
- **DataTable** now renders the canonical `TablePayload` — `columns` as
  `{ key, label?, format? }` objects with `rows` as keyed objects (Structs),
  using `label` for headers and the per-column `format` for cell formatting
  (author `options.column_formats` still override). Previously `normalize()`
  only handled string columns / positional rows, so a backend returning the
  documented explicit-column shape crashed with "Objects are not valid as a
  React child".
- **Candlestick** now creates its chart when data arrives after first paint.
  The create-chart effect runs once and bailed if the container wasn't
  mounted yet; an async (Connect/SSE) source whose first render is empty
  therefore never got a chart. The container is now always mounted and the
  empty state is overlaid.

## [0.4.0] — 2026-05-25

### Changed (breaking)

- **FileBrowser is now protocol-agnostic.** No more knowledge of any
  specific backend's identifier scheme. Concretely:

  - `FileBrowserEntry.object_id` is gone. Entries are
    `{ kind, name, size_bytes?, content_type?, modified_at? }`. The
    widget identifies entries by `name` (unique-per-directory, which
    any filesystem-shaped backend already guarantees) and computes
    full paths on the fly as `joinPath(currentPath, entry.name)`.
  - `buildMediaUrl(template, namespace, path)` now substitutes
    `{namespace}` and `{path}` instead of `{namespace}` and `{object_id}`.
    The default template changed from `/media/{namespace}/{object_id}`
    to `/media?namespace={namespace}&path={path}` (query-string form
    avoids path-segment ambiguity for paths with slashes).
  - Download POST body is now `{namespace, path}` instead of
    `{namespace, objectId}`. `options.download_url` no longer has a
    default — backends must set it explicitly.
  - `nextInQueue`/`prevInQueue` parameter renamed from `currentObjectID`
    to `currentName` (the stable identifier within a directory). Same
    semantics, generic key.

- **Pagination simplified.** The `__meta__: true` sentinel row + the
  `extractPagination` helper are gone — that was a backend-specific
  pagination shim that didn't belong in a generic widget. The
  FileBrowser now shows a simple Prev/Next pager: Next is enabled
  while the current page is full (entries.length === page_size);
  a partial page disables it. Backends wanting strict totals can
  compose their own pager above the widget.

### Added

- **`joinPath(dir, name)` helper** in fileBrowserHelpers — strips
  stray slashes and composes `dir/name` cleanly. Used internally to
  compute entry full paths; exported for consumers building their
  own URL templates.

### Migration

For consumers that were passing `object_id` on entries: drop it and
make sure the entry's `name` is unique per directory listing (it
already was). For consumers using the default media URL template:
either accept the new query-string default or set `media_url_template`
explicitly. For backends that were inserting `__meta__` rows: stop
doing that — the widget no longer reads them.

## [0.3.1] — 2026-05-24

### Changed

- **FileBrowser idiom polish.** Drop three dead `PreviewOverlay` props (`mediaTemplate`, `namespace`, `backendUrl`) — vestigial from a pre-`onSelect` design where the overlay rebuilt next-track URLs itself. Tighter prop surface, no behavior change.
- **TypeScript type guards.** Replace `(err as Error).message` catches with a shared `errorMessage(err)` helper that handles non-Error throws (`unknown` is the actual catch type). Replace `as Record<string, unknown>` casts in `extractPagination` / `normalizeEntries` with a local `isMetaRow` type guard. Replace `res.body!.getReader()` non-null assertion in `parseConnectStream` with an explicit guard.

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
