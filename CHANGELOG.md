# Changelog

Notable changes to medallion-terminal-core. Versions follow semver.

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
  selected renderer in a Compass pane, route, drawer, or portal. The default
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
