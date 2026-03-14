# Medallion Terminal Core

## What This Is

An open-source, template-driven React SPA framework for building composable, multi-domain analytical dashboards. Think "Bloomberg Terminal but domain-agnostic and open." Anyone can plug in their own data sources to create their own terminal — financial data, sports betting, odds aggregation, bot responses, plots, graphs, election analysis, web analytics, etc.

This repo is the **frontend framework only**. No backend. No Go. Pure React.

## How It Works

1. The app fetches a **template JSON** from any API endpoint (default: `/templates/demo.json`, override with `?template=URL`)
2. The template describes the dashboard layout: which widgets go where, and where each widget gets its data
3. The framework **dynamically renders** the entire dashboard from this template
4. For live data, widgets connect via SSE (Server-Sent Events) when `"stream": true`

The core principle is **convention over configuration**:
- You say `"component": "timeseries"` and provide data shaped as `[{timestamp, value}]` — you get a line chart. No configuration needed.
- You say `"component": "table"` with an array of objects — columns are auto-detected, sorting works out of the box.
- You say `"component": "metric"` with `{value, delta, unit}` — you get a formatted metric card with change indicator.
- The system does NOT try to support every possible way to draw a chart. It supports the common cases well with strong defaults.

## Template JSON Schema

```json
{
  "title": "Dashboard Title",
  "columns": 12,
  "widgets": [
    {
      "id": "unique-id",
      "component": "timeseries | table | metric",
      "span": 8,
      "height": 300,
      "title": "Widget Title",
      "source": {
        "url": "https://api.example.com/data",
        "data": [],
        "stream": false,
        "method": "GET",
        "headers": {},
        "refreshInterval": 5000,
        "transform": "data.items"
      },
      "options": {}
    }
  ]
}
```

Key fields:
- `component`: which widget to render (convention: name maps to a built-in widget)
- `span`: column span out of 12 (default 6). Mobile collapses to full-width.
- `source.url`: fetch data from this URL
- `source.data`: OR provide inline data directly (no fetch needed)
- `source.stream`: if true, connects via SSE for real-time updates
- `source.transform`: dot-path to extract nested data (e.g. `"data.items"`)
- `source.refreshInterval`: polling interval in ms for non-streaming sources

## Canonical Data Shapes (What Widgets Expect)

### Timeseries
Array of objects with a timestamp key and one or more numeric keys. Auto-detects timestamp field (`timestamp`, `date`, `time`, `ts`, `x`). Auto-detects all numeric fields as separate series.

```json
[
  { "timestamp": "2024-01-01", "value": 42000 },
  { "timestamp": "2024-01-02", "value": 43500 }
]
```

Multi-series (explicit):
```json
{
  "series": [
    { "name": "BTC", "data": [{ "timestamp": "2024-01-01", "value": 42000 }] },
    { "name": "ETH", "data": [{ "timestamp": "2024-01-01", "value": 2800 }] }
  ]
}
```

### Table
Array of objects (columns auto-detected from keys):
```json
[
  { "Asset": "BTC", "Price": 67500, "Volume": 1234567 },
  { "Asset": "ETH", "Price": 3456, "Volume": 987654 }
]
```

Or explicit columns + rows:
```json
{
  "columns": ["Asset", "Price", "Volume"],
  "rows": [["BTC", 67500, 1234567], ["ETH", 3456, 987654]]
}
```

### Metric
Single value with optional delta and unit:
```json
{ "value": 67842.50, "delta": 2.18, "unit": "USD", "label": "Current Price" }
```

Or just a raw number: `67842.50`

## Protobuf Contracts (Source of Truth)

The canonical payload shapes are defined in protobuf under `proto/medallion/terminal/v1/`. This is the **formal standard** — any backend serving data to Medallion Terminal should conform to these shapes. Backend developers can generate types in any language (Go, Python, Rust, etc.) from these definitions.

```
proto/medallion/terminal/v1/
  template.proto  — Template, Widget, DataSource (dashboard configuration contract)
  shapes.proto    — TimeseriesPayload, TablePayload, MetricPayload (data shape contracts)
buf.yaml          — Buf module configuration (lint + breaking change detection)
```

- `buf lint` validates the proto definitions
- The proto defines the shapes; the frontend accepts JSON conforming to these shapes
- Widgets also accept common shorthand formats (e.g. raw arrays) for convenience and normalize internally
- The TypeScript types in `src/types/template.ts` mirror the proto definitions for frontend use

## Architecture

```
proto/
  medallion/terminal/v1/
    template.proto        — Protobuf: template + widget + data source contracts
    shapes.proto          — Protobuf: canonical data shapes (timeseries, table, metric)
src/
  index.ts                — Library barrel export (npm package entry point)
  types/template.ts       — TypeScript types mirroring the proto definitions
  core/Dashboard.tsx      — Grid layout renderer, responsive breakpoints
  core/WidgetRegistry.ts  — Maps component name strings to React components
  core/ErrorBoundary.tsx  — Isolates widget crashes so one failure doesn't kill the dashboard
  hooks/useDataSource.ts  — Data fetching: inline, fetch, SSE streaming, polling
  hooks/useBreakpoint.ts  — Responsive breakpoint detection (mobile/tablet/desktop)
  widgets/WidgetShell.tsx  — Common wrapper: title bar, loading/error states, live indicator
  widgets/Timeseries.tsx  — Line chart (Recharts), auto-normalizes data shapes
  widgets/DataTable.tsx   — Sortable table, auto-generates columns from data
  widgets/Metric.tsx      — Single value display with delta indicator
  widgets/Text.tsx        — Text/news/article feed widget with title, body, metadata, tags
  widgets/Placeholder.tsx — Fallback for unknown widget types
  widgets/*.stories.tsx   — Storybook stories for each widget
  App.tsx                 — Template loader (fetches from URL or default demo)
.storybook/               — Storybook configuration
public/templates/demo.json — Demo template with inline sample data
buf.yaml                  — Buf module configuration
```

## Grid System

- 12-column CSS Grid (industry standard)
- Widgets declare `span` (1-12) for column width
- **Desktop** (>=1024px): full 12 columns
- **Tablet** (768-1023px): widgets clamped to max 6 columns (2-column layout)
- **Mobile** (<768px): everything stacks full-width
- No drag-and-drop. Fixed layout from template. Simple and predictable.

## Extending (Adding Custom Widgets)

```typescript
import { registerWidget } from './core/WidgetRegistry'
import type { WidgetProps } from './types/template'

function MyCustomWidget({ data, options }: WidgetProps) {
  // render your widget
}

registerWidget('my-custom', MyCustomWidget)
```

Then use in templates: `"component": "my-custom"`

## Using as npm Package

Consumers can install and import the library:

```typescript
import { Dashboard } from 'medallion-terminal-core'
import 'medallion-terminal-core/styles'
import type { Template } from 'medallion-terminal-core'

function App() {
  const template: Template = { /* ... */ }
  return <Dashboard template={template} />
}
```

Build the library with `pnpm build:lib`. Output goes to `dist/`.

## Dev Commands

- `pnpm dev` — Start the standalone demo app (http://localhost:5173)
- `pnpm lint` — TypeScript type check + buf lint protos
- `pnpm test` — Run tests (vitest)
- `pnpm build` — Build the standalone app
- `pnpm build:lib` — Build the npm library (JS + CSS + type declarations)
- `pnpm storybook` — Start Storybook (http://localhost:6006)
- `pnpm build:storybook` — Build static Storybook site
- `pnpm run ci` — Run everything: lint, test, build, build:lib, build:storybook

All commands run inside `flox activate` both locally and in CI to ensure identical environments.

## Tech Stack

- React 19 + TypeScript
- Vite 7 (build tooling)
- Tailwind CSS v4 (styling, dark theme)
- Recharts 3 (timeseries/line charts)
- lightweight-charts 5 (TradingView candlestick/OHLCV charts)
- Vitest (testing)
- Storybook 10 (component catalog + demo)
- Protobuf + Buf (canonical payload shape definitions)
- pnpm (package manager)
- flox (environment management — nodejs, pnpm, buf)
- No backend dependencies, no SSR, no heavy state management libraries

## Design Principles

1. **Convention over configuration** — Sensible defaults for everything. You don't configure chart axes, colors, or formatting unless you want to override. The widget knows how to render its data shape.
2. **Template-driven** — The entire dashboard is described by a single JSON. Drop in a template, get a dashboard.
3. **Domain-agnostic** — The core never uses domain-specific terms (no "ticker", "price", "odds"). Generic shapes: timeseries, table, metric. Any domain plugs into these.
4. **Mobile-friendly** — Responsive grid that works on phone, tablet, and desktop.
5. **Plug and play** — Point `source.url` at any API that returns the right shape. The framework handles fetching, streaming, and rendering.

## What This Is NOT

- Not a backend — no Go, no database, no ingestion pipelines
- Not a component library you npm install — it's a standalone SPA (may evolve to library later)
- Not infinitely flexible — it's opinionated. Convention over configuration.
- Not a generative UI system — no AI generates frontend code. AI (if integrated) returns template JSON, the framework renders it deterministically.

## Related Context

This is the open-source core of the Medallion Terminal ecosystem. The broader architecture (described in a separate planning doc) includes:
- Go backend services with ConnectRPC for API contracts
- PostgreSQL + TimescaleDB for storage
- River job queue for data ingestion
- Domain Packs (separate repos) that translate domain-specific data into canonical shapes
- AI assistant that acts as a semantic router, returning typed JSON config (not generated code)

Those concerns live in separate repositories. This repo is purely the rendering engine.
