# Medallion Terminal Core

Proto-driven dashboard framework. Implement one ConnectRPC service, get a Bloomberg-style terminal.

## Quick Start

```bash
pnpm install
pnpm backend &        # reference TerminalService on :3001
pnpm dev              # vite on :5173
```

Open `http://localhost:5173/?template=/examples/reference-backend.json&backend=http://localhost:3001`.

You'll see live BTC spot, candles, an order book, an options chain (paired-grid), an order ticket that streams lifecycle updates via WatchAction, and news.

## How It Works

1. Backend implements `TerminalService` (proto in `proto/medallion/terminal/v1/`):
   - `Get` / `Stream` — return one of the canonical [payload shapes](proto/medallion/terminal/v1/shapes.proto)
   - `ListSources` — declare the catalog of sources you can serve
   - `SubmitAction` / `WatchAction` — write side: orders, votes, swaps, with idempotency and lifecycle streaming
   - `Generate` — AI-generated dashboards (optional)
2. Dashboard reads a JSON template that wires widgets to those sources via `source_id`.
3. The framework renders.

`examples/backend/server.mjs` is a single-file Node reference implementation — fork it.

## Wiring data

```jsonc
{
  "widgets": [
    // Preferred: typed via TerminalService catalog
    { "component": "candlestick", "span": 8,
      "source": { "source_id": "btc_candles",
                  "params": { "symbol": "${ctx.symbol}", "limit": "60" },
                  "stream": true } },

    // Escape hatch: arbitrary URL
    { "component": "timeseries", "span": 4,
      "source": { "url": "https://my-api/prices.json",
                  "refreshIntervalMs": 5000 } },

    // Inline (demos, AI-generated dashboards)
    { "component": "metric",
      "source": { "inline": { "value": 67842, "delta": 0.0036, "unit": "USD" } } }
  ]
}
```

## Widget shapes

| Component | Payload shape | Notes |
|-----------|---------------|-------|
| `timeseries` | `{ points }` or `{ series: [{ name, points }] }` | Single or multi-line |
| `candlestick` | `{ bars: [{ timestamp, open, high, low, close, volume? }], annotations? }` | TradingView |
| `table` | `[{ key: val }]` or `{ columns, rows }` | Sort/page/export |
| `metric` | `{ value, delta?, unit?, trend? }` | Headline number |
| `gauge` | `{ value, min?, max?, bands? }` | Bounded scalar |
| `heatmap` | `{ rows, columns, cells }` | 2D color matrix |
| `events` | `{ events: [{ timestamp, label, status }] }` | Streamable timeline |
| `distribution` | `{ slices: [{ label, value }] }` | Pie/donut |
| `text` | `{ items: [{ title, body, ... }] }` | News, summaries |
| `orderbook` | `{ bids, asks, mid?, spread? }` | Depth ladder |
| `paired_grid` | `{ subject, dimension?, measures, rows: [{ key, left, right }] }` | Options chains, sportsbook ladders, A/B percentile grids |
| `embed` | `{ url, label?, sandbox? }` | Image / iframe |
| `trade` | (form) | Calls `SubmitAction`, watches via `WatchAction` |
| `prompt` | (form) | Calls `Generate` |
| `action_log` | (none) | Live order blotter — listens to `emit({type:'action'})` |

Layout primitives: `section`, `slider`, `select`, `multi_select`, `clock`, plus chart variants (`bar_chart`, `area_chart`, `scatter`, `histogram`, `boxplot`, `radar`, `treemap`, `sparkline`, `dag`, `volume_profile`).

## Live data

```jsonc
"source": { "source_id": "ticks", "stream": true }                        // Connect server-streaming
"source": { "url": "https://api/sse", "stream": true }                    // SSE
"source": { "source_id": "ticks", "stream": true, "throttleMs": 100 }     // Trailing-edge throttle
"source": { "source_id": "snapshots", "refreshIntervalMs": 5000 }         // Polling
"source": { "source_id": "ticks", "stream": true, "staleAfterMs": 10000 } // Stale-warn after 10s silence
```

When a streaming source disconnects, the widget header shows an amber `retry Ns` countdown. When data hasn't updated within `staleAfterMs`, the timestamp turns amber and the badge reads `stale · Xs ago` — data is still displayed; silent freeze is worse than visible staleness.

## Actions

`SubmitAction` is the generic write surface. `WatchAction` streams lifecycle updates back. Both carry a `client_request_id` for idempotency — the Trade widget generates one per click; backends MUST treat repeats as the same action.

Statuses: `OK`, `REJECTED`, `FAILED`, `CANCELLED` (terminal); `ACCEPTED`, `PENDING` (non-terminal — watch for the eventual outcome).

## Alerts

Any widget can declare a client-side alert that fires a toast when a predicate over the widget's data transitions false → true:

```jsonc
{ "component": "metric",
  "source": { "source_id": "btc_spot", "stream": true },
  "alert": { "when": "value > 70000 && volume > 1e8",
             "message": "${ctx.symbol} crossed 70k on heavy volume",
             "severity": "warn" } }
```

Predicate format: `<term> [&& <term> | || <term> ...]` where each term is `<path> <op> <literal>` (`op` ∈ `> >= < <= == !=`). `&&` binds tighter than `||`; no parens. `path` walks the widget's `data`. Edge-triggered: fires once on transition, clears when the predicate returns false. No backend rule engine required.

A toolbar 🔊/🔇 toggle plays a short WebAudio beep on `warn`/`error` severities. Off by default; pref persists in localStorage.

## Cross-widget selection

Clicking a row / cell / price level on certain widgets sets a `ctx` key, which retargets every other widget bound to it:

```jsonc
// Click a watchlist row → set ctx.symbol → all other widgets re-fetch.
{ "component": "table",
  "source": { "source_id": "watchlist" },
  "options": { "row_context": { "key": "symbol", "field": "Asset" } } }

// Click an option strike → set ctx.strike.
{ "component": "paired_grid", "options": { "row_context": { "key": "strike" } } }

// Click a price level → set ctx.price (e.g. to prefill the Trade widget).
// `side_key` also writes ctx.side ("buy" on bid click, "sell" on ask click)
// for a one-click book-to-ticket flow.
{ "component": "orderbook",
  "options": { "price_context": { "key": "price", "side_key": "side" } } }

// Heatmap cells map to one or both axes.
{ "component": "heatmap",
  "options": { "row_context": { "key": "asset" }, "col_context": { "key": "hour" } } }
```

## Keyboard

| Key | Action |
|-----|--------|
| `⌘K` / `Ctrl-K` | Command palette (set ctx, save/load views) |
| `j` / `↓` | Focus next widget |
| `k` / `↑` | Focus previous widget |
| `f` | Fullscreen focused widget |
| `r` | Refresh focused widget |
| `?` | Shortcuts cheat sheet |
| `Esc` | Clear focus / close overlays |

Widget focus is mouse-driven too — clicking a widget tile gives it the focus ring.

Templates can declare per-dashboard hotkeys for instant ctx switches:

```jsonc
{
  "shortcuts": [
    { "key": "1", "ctx": { "symbol": "BTC" }, "label": "Bitcoin" },
    { "key": "2", "ctx": { "symbol": "ETH" } },
    { "key": "3", "ctx": { "symbol": "SOL" } }
  ],
  "widgets": [/* ... */]
}
```

Pressing the key (outside an input, no modifier) merges its `ctx` into the active context. They appear in the `?` cheat sheet.

The toolbar `Reload` button refreshes every widget at once; per-widget refresh is still available via the widget action menu or `r` on the focused widget.

## Validation

`<Dashboard>` validates the template at mount and renders a banner for unknown components, conflicting source modes, out-of-range spans, and malformed alert predicates. Errors stay pinned; warnings dismiss for the session. You can run the validator yourself:

```ts
import { validateTemplate } from 'medallion-terminal-core'
const issues = validateTemplate(template, ['my_custom_widget']) // pass custom names
```

## Telemetry

Pass `onEvent` to `<Dashboard>` for a single sink covering alerts, widget errors, and action lifecycles:

```ts
<Dashboard
  template={tpl}
  backendUrl="…"
  onEvent={e => {
    switch (e.type) {
      case 'alert':         myAnalytics.track('alert', e); break
      case 'widget_error':  Sentry.captureMessage(e.message, { extra: e }); break
      case 'action':        if (e.terminal) myLedger.append(e); break
    }
  }}
  onCtxChange={ctx => router.replace({ query: ctx })}
  paletteSuggest={async q => {
    const hits = await fetch(`/api/symbol-search?q=${encodeURIComponent(q)}`).then(r => r.json())
    return hits.map(h => ({
      label: h.symbol,
      hint: `${h.name} · ${h.exchange}`,
      ctx: { symbol: h.symbol },
    }))
  }}
/>
```

## Context and URL state

Dashboard ships a `ctx` bag (e.g. `symbol`, `range`). Widgets reference values via `${ctx.symbol}` substitution in URLs and params. Context lives in the URL (`?ctx.symbol=BTC`) so any view is shareable. Saved layouts live in localStorage; load via `/load <name>` in the command palette (`Cmd-K`).

## TypeScript types

```ts
import type { Template, DataSource, WidgetProps } from 'medallion-terminal-core'        // friendly framework types
import type { DataResponseJson, ActionUpdateJson } from 'medallion-terminal-core'        // exact wire shapes (proto-derived)
```

Generate fresh proto types after editing protos: `pnpm gen:proto`. CI enforces they're up to date.

## Integration checklist

For wiring this into a real product, in order:

1. **Install + style.**
   ```ts
   import { Dashboard } from 'medallion-terminal-core'
   import 'medallion-terminal-core/styles'
   ```

2. **Implement `TerminalService`.** `buf generate` from `proto/medallion/terminal/v1/`. Required RPCs: `Get`, `Stream`, `ListSources`, `SubmitAction`, `WatchAction`. `Generate` is optional. Wire shapes from `shapes.proto`; backends do not invent shapes. Reference: `examples/backend/server.mjs` (one file, every RPC, fork-friendly).

3. **Connect HTTP/JSON framing.** Streaming RPCs use envelopes: `[flags(1)][length(4 BE)][payload N]`. `flags & 0x02` = trailer (end-of-stream). Trailer body is JSON `{ metadata?, error? }`; non-null `error` surfaces to the client widget.

4. **Mount `<Dashboard>`.** Pass `backendUrl` so widgets resolve `source_id`s through your service. Templates ship as JSON; `${ctx.symbol}` substitution links them to the dashboard's context bag.

5. **Custom widgets.** Implement once, `registerWidget('your_name', YourComponent)` at app startup. Same `WidgetProps` contract as built-ins. See `examples/widgets/` for the Kelly sizing widget reading live odds off a `paired_grid` source.

6. **Action idempotency.** Frontend generates a `client_request_id` per submit. Backend MUST treat repeats as the same action (return original `ActionResponse`). Non-terminal statuses (`ACCEPTED`, `PENDING`) trigger a `WatchAction` subscription; backend MUST close the stream after the first terminal status.

7. **URL state.** Context lives in URL params (`?ctx.symbol=BTC`). Saved layouts live in localStorage. Both are out-of-band from your backend.

8. **Before non-localhost deploy.** The reference backend ships with demo defaults that are NOT production-safe:
   - CORS is wide-open (`*`); restrict to your origin(s).
   - No authentication; gate every RPC.
   - No rate limits; add them at the proxy layer.
   - Action store is in-memory and bounded at 1024 entries; persist to your real store with TTL.
   - `__error_after` synthetic source exists for testing — remove or gate it.

9. **Types.** Generated proto-derived JSON types are available at `medallion-terminal-core/proto`. Friendlier framework types (`Template`, `WidgetProps`, `DataSource`) are at the package root. Run `pnpm gen:proto` after editing protos; the lint step refuses stale generated types.

## Demo

[Storybook](https://jim-technologies.github.io/medallion-terminal-core/)

## License

MIT
