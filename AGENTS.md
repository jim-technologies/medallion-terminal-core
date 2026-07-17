# Medallion Terminal Core

## What This Is

Proto-driven React framework for building composable, multi-domain operating
intelligence and data-platform dashboards. Implement one ConnectRPC service
(`TerminalService`) and get a business workspace with operator-grade depth.

This repo is the **frontend framework only**. No backend (a reference Node implementation lives in `examples/backend/server.mjs`). Pure React + TypeScript.

## How It Works

1. A backend implements `TerminalService` (proto in `proto/medallion/terminal/v1/`):
   - `Get` / `Stream` — return one of the canonical payload shapes
   - `ListSources` — declare the catalog
   - `SubmitAction` / `WatchAction` — write side with idempotency + lifecycle
   - `Generate` — AI-generated dashboards (optional)
2. The dashboard loads a JSON template that wires widgets to source IDs (or arbitrary URLs, or inline data).
3. The framework renders. Cross-widget context (`ctx`) flows through `${ctx.<key>}` substitution.

Core principle: **convention over configuration**. A widget knows how to render its data shape — authors don't configure axes, colors, formatters unless they want to override.

## Template JSON

```jsonc
{
  "title": "${ctx.symbol} desk",
  "columns": 12,
  "context": { "values": { "symbol": "BTC", "range": "1d" } },
  "shortcuts": [
    { "key": "1", "ctx": { "symbol": "BTC" } },
    { "key": "2", "ctx": { "symbol": "ETH" } }
  ],
  "widgets": [
    {
      "id": "px",
      "component": "candlestick",
      "span": 8,
      "title": "${ctx.symbol}/USD",
      "source": {
        "source_id": "btc_candles",
        "params": { "range": "${ctx.range}" },
        "stream": true,
        "staleAfterMs": 10000
      },
      "alert": {
        "when": "bars.0.close > 70000 && bars.0.volume > 1e6",
        "message": "${ctx.symbol} ripping",
        "severity": "warn"
      }
    }
  ]
}
```

Key fields:
- `component`: built-in widget name (see registry below) or a custom name from `registerWidget`.
- `span`: 1..12 grid columns (tablet clamps to 6, mobile to full-width).
- `source.source_id`: pull from `TerminalService.Get`/`Stream`. Preferred.
- `source.url`: arbitrary URL (escape hatch / federation).
- `source.inline`: bake data into the template (demos, AI-generated dashboards).
- `source.stream`: `true` = SSE (url mode) or Connect server-streaming (source_id mode); `"connect"` = manually-encoded Connect stream over an arbitrary URL.
- `source.refreshIntervalMs`: polling interval for non-streaming sources.
- `source.throttleMs`: trailing-edge throttle for tick-firehose streams.
- `source.staleAfterMs`: flag the widget as stale when no update has arrived in N ms.
- `source.params`: passed as `TerminalService.params` for source_id mode, or as query string for url mode. Values get `${ctx.x}` substitution.
- `alert.when`: client-side predicate. Format: `<term> [&& <term> | || <term> ...]` where each term is `<path> <op> <literal>` and `op ∈ > >= < <= == !=`. `&&` binds tighter than `||`. Edge-triggered (fires once on false→true).
- `refresh_policy`: `"global"` (default) | `"self"` | `"manual"`. Controls whether the widget responds to pulse-driven refresh (`r` key, toolbar Refresh, sibling `requestRefresh`). Streaming and `refreshIntervalMs` polling are unaffected — only pulses are gated. Use `"manual"` for widgets whose local state (video preview, in-flight form) should never be torn down by a global Refresh.

## Built-in widgets

Charts: `timeseries`, `candlestick`, `area_chart`, `bar_chart`, `scatter`, `histogram`, `boxplot`, `radar`, `sparkline`, `volume_profile`, `treemap`, `heatmap`.

Tabular / metric: `table`, `metric`, `gauge`, `distribution`, `stat_strip`, `paired_grid`, `orderbook`.

Platform: `asset_catalog` (governed asset discovery), `object_view` (semantic
object properties, links, and actions), `code_browser` (repository/ref tree and
source viewer), plus `dag` with the canonical `GraphPayload` for lineage.

Records: `record_grid` (typed rows, saved grid/list views, inline edits),
`record_board` (grouped workflow lanes), `record_calendar` (date projection),
and `record_form` (context-driven create/edit/detail). All consume the same
domain-neutral `RecordSetPayload`.

Live feeds: `events`, `text` (news/articles, supports image_url + flash-on-new-item), `ticker` (auto-scrolling marquee), `tape` (time-and-sales / append-only event stream with ring buffer), `action_log` (order blotter), `alert_log` (alert feed).

Write surfaces: `trade` (order ticket — calls SubmitAction, watches via WatchAction), `prompt` (AI prompt — calls Generate), `file_browser` (object-store file pane — breadcrumb nav, drag-drop upload via SubmitAction, click-to-download or inline preview).

The file_browser previews video/audio inline via native
`<video src=options.media_url_template>` (default
`/media?namespace={namespace}&path={path}`). Seek on long files requires the
backend to honor HTTP `Range:` and respond `206 Partial Content`. The reference
backend implements this end-to-end. MP4 uploads should be encoded with
`-movflags +faststart` (moov atom at the front) so players can seek before
downloading the whole file.

Path convention used by the reference backend's file store: hive-style
`key__value/` partitions (double-underscore replacing `=`, since GitHub repo
names and most URL allowlists can't tolerate `=`). The backend auto-partitions
bare root-level API uploads by content type (`type__video/`, `type__data/`,
...); the file-browser UI asks for a destination folder, and drag-drop uploads
stay inside the folder being viewed.

Layout/input: `section`, `slider`, `select`, `multi_select`, `clock`, `dag`, `catalog`, `image`, `iframe`, `json`.

## Canonical data shapes

Proto-defined in `proto/medallion/terminal/v1/shapes.proto`. Widgets accept both the canonical shape and convenient shorthand:

- `timeseries`: `[{timestamp, value}]` or `{points}` or `{series: [{name, data}]}`. Optional `annotations` for point markers + range bands.
- `candlestick`: `{bars: [{timestamp, open, high, low, close, volume?}], annotations?}`.
- `table`: `[{col: val}]` or `{columns, rows}`.
- `metric`: `{value, delta?, unit?, label?, trend?}` (trend → inline sparkline) or a raw number.
- `gauge`: `{value, min?, max?, bands?}`.
- `heatmap`: `{rows, columns, cells: [{row, col, value, label?}], min?, max?, scale?}`.
- `events`: `{events: [{timestamp, label, status?}]}`.
- `distribution`: `{slices: [{label, value}]}`.
- `text`: `{items: [{title?, body?, source?, date?, tags?, image_url?, id?}]}`.
- `orderbook`: `{bids: [{price, size}], asks: [{price, size}], mid?, spread?, venue?}`.
- `paired_grid`: `{subject, dimension?, rows: [{key, left, right}], measures, key_label, left_label, right_label}` — options chains, sportsbook ladders.
- `asset_catalog`: `{items: [{id, name, kind, owner?, status?, metadata?, context?}], total?, next_page_token?}`.
- `object_view`: `{object_type, object_id, title, properties, links?, actions?}`.
- `dag`: `{nodes: [{id, label, kind?, status?, context?}], edges: [{from, to, label?}]}`.
- `code_browser`: `{repository, ref, path, refs?, entries, file?}`.
- Record widgets: `{workspace_id, table_id, primary_field, fields, records,
  views?, capabilities?}`. Formula/lookup/rollup/timestamp fields are
  backend-computed and read-only; updates/deletes carry `revision`.

## Cross-widget interaction

Widgets retarget each other via `ctx`:

- `table`: `options.row_context: { key, field? }` — clicking a row sets `ctx[key]` to the cell value.
- `heatmap`: `options.row_context`, `options.col_context` — clicking a cell sets one or both axis ctx keys.
- `paired_grid`: `options.row_context: { key }` — clicking a row sets `ctx[key]` to the row's `key` value.
- `orderbook`: `options.price_context: { key, side_key? }` — clicking a price level sets `ctx[key]` to the price; `side_key` also sets buy/sell (bid → buy, ask → sell). Pairs with `trade` for one-click book-to-ticket.
- `trade`: reads `ctx.price`, `ctx.side`, `ctx.symbol` and syncs them into the order form.
- `asset_catalog`: selecting an item applies its `context` map, then defaults
  `ctx.asset_id` and `ctx.asset_kind`.
- `dag`: graph nodes can carry a `context` map; `options.node_context` supplies
  fallback ID/kind keys.
- `code_browser`: navigation writes repository/ref/path context keys so the
  backend remains authoritative for tree contents and permissions.
- Record grid/board/calendar: selecting a record writes `ctx.record_id`,
  `ctx.table_id`, and its safe `context` map. `record_form` follows that
  selection; successful mutations refresh sibling projections.

## Streaming UX

- Streaming sources show a green pulsing dot when connected, amber dot when disconnected, with a `retry Ns` countdown.
- `source.staleAfterMs` flips the timestamp badge amber and prepends `stale ·` when N ms passes without an update.
- Header `X ago` badge updates every second via a shared 1Hz `NowContext` that ref-counts subscribers.

## Static snapshots (sharing)

- Toolbar **Share** freezes the live dashboard into a self-contained static `Template`: each widget's *current on-screen* data is baked into `source.inline`, every live source dropped. Capture is the in-memory frame — **never a re-fetch** — so AI-generated analysis/metrics are not regenerated for the recipient.
- Plumbing: each grid `WidgetShell` registers a ref-backed getter (`registerWidgetData`, keyed by `widgetSnapshotKey(widget, i)`); `Dashboard.snapshot()` reads them via `buildSnapshot(template, widgets, ctx, getData, frozenAt)` (`core/snapshot.ts`). Ref registry → no re-renders, no per-tick churn.
- `onShare?(snapshot)` prop receives the frozen template (upload to bucket → mint share URL, e.g. `embed.html?template=<url>`); with no handler, Share downloads the JSON. Hidden when already frozen.
- `Template.frozenAt` (ISO-8601) marks a snapshot → viewer shows a `Snapshot · <date>` badge and hides live controls. `isStaticTemplate(template)` detects one. Binary media stays URL-referenced (never inlined).

## Keyboard

| Key | Action |
|-----|--------|
| `⌘K` / `Ctrl-K` | Open command palette (set ctx, save/load views, paletteSuggest autocomplete) |
| `j` / `↓` | Focus next widget |
| `k` / `↑` | Focus previous widget |
| `f` | Fullscreen focused widget |
| `r` | Refresh focused widget |
| `?` | Shortcuts cheat sheet (includes template.shortcuts) |
| `Esc` | Clear focus / close overlays |
| `⌘1`..`⌘9` | Multi-tab dashboards: jump to tab N |

Template-defined hotkeys (`template.shortcuts: [{ key, ctx, label? }]`) take precedence over built-in nav keys.

Cmd-K palette grammar:
- `symbol:BTC` / `symbol=BTC` — single set
- `symbol:BTC range:1d venue:binance` — multi-pair set (no spaces in values)
- `BTC` — bare value goes to the first ctx key
- `1d` (or any of `1d 5d 1m 3m 1y max`) — bare range preset
- `/save name` — save current ctx as a named view (localStorage)
- `/load name` (or `/open name`) — restore a saved view
- `/delete name` (or `/rm name`) — delete a saved view

## Consumer-side hooks

`<Dashboard>` props:
- `template: Template`
- `backendUrl?: string` — Connect/HTTP host for source_id resolution + actions
- `onEvent?: (e: DashboardEvent) => void` — alerts, widget errors, action lifecycles
- `onCtxChange?: (ctx) => void` — fires when active ctx changes
- `paletteSuggest?: (query) => Promise<PaletteSuggestion[]>` — backend-driven autocomplete
- `theme?: "dark" | "operator" | "light"` — scoped visual preset; `dark` is the default

`DashboardEvent` union: `alert` | `widget_error` | `action`. See `src/core/DashboardContext.tsx`.

## Architecture

```
proto/medallion/terminal/v1/
  shapes.proto           — payload shapes (Get/Stream return one of)
  template.proto         — dashboard config contract
  terminal.proto         — TerminalService RPCs + ActionRequest/Update
src/
  index.ts                — Library barrel
  index.css               — Scoped theme tokens + shared product chrome
  types/template.ts       — Hand-rolled framework types (mirror proto)
  proto.ts                — Proto-derived JSON types (generated)
  core/
    Dashboard.tsx         — Grid layout, toolbar, status bar, keybindings
    MultiDashboard.tsx    — Multi-tab wrapper with Cmd-1..9 hotkeys
    DashboardContext.tsx  — Context shape, default value, action/alert ring types
    NowContext.tsx        — Ref-counted 1Hz tick (only ticks when subscribed)
    HoverContext.tsx      — Cross-chart crosshair sync
    WidgetRegistry.ts     — Lazy-loaded widget map (registerWidget for custom)
    CommandPalette.tsx    — Cmd-K modal + suggestions
    ShortcutsOverlay.tsx  — `?` cheat sheet
    Toaster.tsx           — Toast queue
    ErrorBoundary.tsx     — Per-widget render-crash isolation
    alerts.ts             — AND/OR predicate evaluator (no eval, no parens)
    sound.ts              — WebAudio beep on warn/error alerts (opt-in)
    resolveSource.ts      — ${ctx.x} interpolation + Connect URL builders
    validateTemplate.ts   — Template authoring validator
    applyActions.ts       — Merge WidgetAction[] into widgets[]
    savedViews.ts         — localStorage-backed named ctx snapshots
    urlState.ts           — ctx ↔ URL query string
    connectFraming.ts     — Connect-Web envelope parser
    getNested.ts          — dot-path walker for alerts + transforms
  export/
    flatten.ts            — canonical payloads → tidy rows for BI/export
  bi/
    connector.ts          — serializable BI connector descriptor
  hooks/
    useDataSource.ts      — Inline / fetch / SSE / Connect with reconnect
    useSubmitAction.ts    — Generic idempotent submit/watch/refresh lifecycle
    useWatchAction.ts     — Subscribe to action lifecycle stream
    useBreakpoint.ts      — Mobile/tablet/desktop detection
    useAnimatedNumber.ts  — Smooth metric value transitions
  widgets/
    *.tsx                 — One file per built-in widget
    *.stories.tsx         — Storybook stories
    states.tsx            — Shared Empty/Skeleton/ErrorState
    format.ts             — Number/time formatters (currency, percent, bps, etc)
    colors.ts             — Semantic palette + chart color rotation
    platformShapes.ts     — tolerant normalizers for platform payloads
    recordShapes.ts       — record schema normalization + saved-view helpers
    WidgetShell.tsx       — Title bar, action menu, focus ring, alert effect,
                            stale/retry badges, telemetry emit
public/examples/         — Bundled example templates
  business-operations.json — owner-facing finance/sales/operations workspace
  platform-foundation.json — catalog + object + lineage + repository demo
  work-management.json     — grid + board + calendar + governed record form
examples/
  backend/server.mjs       — Reference Node TerminalService
  widgets/                 — Sample custom widget (Kelly sizing)
```

## Grid system

12-column CSS Grid. Widgets declare `span` (1-12). Desktop: full 12. Tablet (768-1023): max 6. Mobile (<768): full-width. No drag-and-drop — fixed from template, predictable.

## Extending — custom widgets

```ts
import { registerWidget } from 'medallion-terminal-core'
import type { WidgetProps } from 'medallion-terminal-core'

function MyWidget({ data, options }: WidgetProps) {
  // render
}

registerWidget('my_widget', MyWidget)
```

Use in templates: `"component": "my_widget"`. The template validator accepts custom names if passed via `validateTemplate(template, ['my_widget'])`.

## Dev commands (run inside `flox activate`)

- `pnpm dev` — vite (http://localhost:5173)
- `pnpm backend` — reference TerminalService on :3001
- `pnpm lint` — `tsc --noEmit` + buf format/lint/build + regen proto types and check
- `pnpm test` — vitest
- `pnpm build` — standalone app
- `pnpm build:lib` — npm library (JS + CSS + .d.ts)
- `pnpm storybook` — storybook (http://localhost:6006)
- `pnpm run ci` — install + lint + test + both builds + storybook build
  (`pnpm ci` is pnpm 11's install alias, not this package script)

## Tech stack

React 19.2 + TypeScript 7.0. Vite 8, Tailwind 4.3, Recharts 3.9,
lightweight-charts 5.2 (for `candlestick`), Vitest 4.1, Storybook 10.5,
Protobuf + Buf 1.71, Node 24 LTS, pnpm 11, Flox.

## Design principles

1. **Convention over configuration.** Strong defaults; no axis/color knobs unless the widget needs them.
2. **Template-driven.** One JSON renders the whole dashboard.
3. **Domain-agnostic core.** No "ticker"/"odds"/"patient" in widget code — only generic shapes.
   Record concepts stay at field/record/view/link/revision level; CRM,
   projects, inventory, and case names belong in host schemas and templates.
4. **Owner-first product, operator-grade detail.** Business pulse, decisions,
   customers, operations, and finance lead. Ontology, lineage, data, and code
   provide progressive detail rather than forcing technical concepts onto SME
   owners.
5. **Operational calm.** Neutral surfaces carry the interface. Use scoped
   `--mtc-*` semantic/chart tokens; reserve color for selection, status, risk,
   and action. Do not hard-code production widget palettes except documented
   canvas fallbacks.
6. **Original identity.** Broad industrial-software cues are fine; copied
   logos, names, proprietary assets, and exact competitor trade dress are not.
7. **Thin and opinionated.** Drag-and-drop layout builders and other
   "for everyone" features are intentional non-goals. The core targets dense
   analytical, operational, and data-platform terminals.
8. **Backend = one ConnectRPC service.** Get/Stream/ListSources/Submit/Watch/Generate. Generated types from `proto/`.

See `DESIGN.md` for theme roles, typography/density rules, the SME product
hierarchy, and the UI definition of done.

## What this is NOT

- Not a backend.
- Not infinitely flexible — opinionated.
- Not a generative-UI system — AI returns template JSON, not generated React code.
- Not a drag-and-drop builder — templates are authored, not painted.

## Related context

This repo is the rendering engine. Host applications provide their own
backend service, storage, ingestion, authentication, and optional
generation layer.

For the recommended metadata/ontology/data/code backend boundaries and
production authorization invariants, see `PLATFORM.md`. For product and visual
guardrails, see `DESIGN.md`. For record schemas, saved views, linked values,
mutations, and extension rules, see `RECORDS.md`.
