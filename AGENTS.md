# Medallion Terminal Core

## What This Is

Proto-driven React framework for building composable, multi-domain analytical dashboards. Think "Bloomberg Terminal but domain-agnostic and open." Implement one ConnectRPC service (`TerminalService`), get a terminal.

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

## Built-in widgets

Charts: `timeseries`, `candlestick`, `area_chart`, `bar_chart`, `scatter`, `histogram`, `boxplot`, `radar`, `sparkline`, `volume_profile`, `treemap`, `heatmap`.

Tabular / metric: `table`, `metric`, `gauge`, `distribution`, `stat_strip`, `paired_grid`, `orderbook`.

Live feeds: `events`, `text` (news/articles, supports image_url + flash-on-new-item), `ticker` (auto-scrolling marquee), `tape` (time-and-sales / append-only event stream with ring buffer), `action_log` (order blotter), `alert_log` (alert feed).

Write surfaces: `trade` (order ticket — calls SubmitAction, watches via WatchAction), `prompt` (AI prompt — calls Generate).

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

## Cross-widget interaction

Widgets retarget each other via `ctx`:

- `table`: `options.row_context: { key, field? }` — clicking a row sets `ctx[key]` to the cell value.
- `heatmap`: `options.row_context`, `options.col_context` — clicking a cell sets one or both axis ctx keys.
- `paired_grid`: `options.row_context: { key }` — clicking a row sets `ctx[key]` to the row's `key` value.
- `orderbook`: `options.price_context: { key, side_key? }` — clicking a price level sets `ctx[key]` to the price; `side_key` also sets buy/sell (bid → buy, ask → sell). Pairs with `trade` for one-click book-to-ticket.
- `trade`: reads `ctx.price`, `ctx.side`, `ctx.symbol` and syncs them into the order form.

## Streaming UX

- Streaming sources show a green pulsing dot when connected, amber dot when disconnected, with a `retry Ns` countdown.
- `source.staleAfterMs` flips the timestamp badge amber and prepends `stale ·` when N ms passes without an update.
- Header `X ago` badge updates every second via a shared 1Hz `NowContext` that ref-counts subscribers.

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

`DashboardEvent` union: `alert` | `widget_error` | `action`. See `src/core/DashboardContext.tsx`.

## Architecture

```
proto/medallion/terminal/v1/
  shapes.proto           — payload shapes (Get/Stream return one of)
  template.proto         — dashboard config contract
  terminal.proto         — TerminalService RPCs + ActionRequest/Update
src/
  index.ts                — Library barrel
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
  hooks/
    useDataSource.ts      — Inline / fetch / SSE / Connect with reconnect
    useWatchAction.ts     — Subscribe to action lifecycle stream
    useBreakpoint.ts      — Mobile/tablet/desktop detection
    useAnimatedNumber.ts  — Smooth metric value transitions
  widgets/
    *.tsx                 — One file per built-in widget
    *.stories.tsx         — Storybook stories
    states.tsx            — Shared Empty/Skeleton/ErrorState
    format.ts             — Number/time formatters (currency, percent, bps, etc)
    colors.ts             — Semantic palette + chart color rotation
    WidgetShell.tsx       — Title bar, action menu, focus ring, alert effect,
                            stale/retry badges, telemetry emit
public/examples/         — Bundled example templates
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
- `pnpm ci` — install + lint + test + both builds + storybook build

## Tech stack

React 19 + TypeScript 5.9. Vite 7, Tailwind v4, Recharts 3, lightweight-charts 5 (for `candlestick`), Vitest, Storybook 10, Protobuf + Buf, pnpm, flox.

## Design principles

1. **Convention over configuration.** Strong defaults; no axis/color knobs unless the widget needs them.
2. **Template-driven.** One JSON renders the whole dashboard.
3. **Domain-agnostic core.** No "ticker"/"odds"/"patient" in widget code — only generic shapes.
4. **Thin and opinionated.** Drag-and-drop, light mode, and other "for everyone" features are intentional non-goals. The core is for finance terminals; refusing scope keeps it small (~50 KB gzipped).
5. **Backend = one ConnectRPC service.** Get/Stream/ListSources/Submit/Watch/Generate. Generated types from `proto/`.

## What this is NOT

- Not a backend.
- Not infinitely flexible — opinionated.
- Not a generative-UI system — AI returns template JSON, not generated React code.
- Not a drag-and-drop builder — templates are authored, not painted.

## Related context

Open-source core of the Medallion Terminal stack. A real deployment pairs this with:
- Go backend services (ConnectRPC for the service, anything for ingestion).
- TimescaleDB / Postgres for storage.
- Domain Packs (separate repos) that translate domain data into the canonical shapes.
- An AI router that returns typed `GenerateResponse` JSON, not generated code.

Those concerns live in separate repositories. This repo is the rendering engine.
