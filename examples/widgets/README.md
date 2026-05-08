# Domain-pack widget example

This directory shows how to ship widgets *without forking the framework*. Each file is a self-contained widget that:

- imports only public types (`WidgetProps`)
- registers itself via `registerWidget(name, Component)`
- gets the same `DataSource` + `ctx` + `options` plumbing as a built-in widget

## Files

| File | What it is |
|------|------------|
| `Kelly.tsx` | Kelly criterion sizing widget. Pure function `kellyStake(...)` exported separately so it's testable in isolation. Reads live odds from a source payload at `options.odds_path`. |
| `registry.ts` | Side-effect import that wires custom widgets into the global registry. |

## Use it in your app

```tsx
// your-app/src/main.tsx
import { Dashboard } from 'medallion-terminal-core'
import './path-to/examples/widgets/registry'   // registers 'kelly'

// any template can now use { component: "kelly", ... }
```

## Use it in this repo's demo

The reference dashboard at `public/examples/sports-betting.json` exercises the Kelly widget against a paired-grid spread ladder source served by the reference backend.

```bash
pnpm backend &
pnpm dev
```

Open `http://localhost:5173/?template=/examples/sports-betting.json&backend=http://localhost:3001`.

## Writing your own

```tsx
import type { WidgetProps } from 'medallion-terminal-core'
import { registerWidget } from 'medallion-terminal-core'

function VigCalc({ data, options }: WidgetProps) {
  // data:    payload from useDataSource (when source is set)
  // options: per-widget overrides from the template's `options` field
  return <div>...</div>
}

registerWidget('vig_calc', VigCalc)
```

That's the contract. The framework calls your component with the same shape it uses for `metric`, `candlestick`, etc — no special API for "user widgets."
