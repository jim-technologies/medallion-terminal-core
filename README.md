# Medallion Terminal Core

Template-driven dashboard framework. Drop in a JSON template, get a dashboard.

## Quick Start

```bash
flox activate
pnpm install
pnpm dev
```

Open http://localhost:5173

## How It Works

Your backend serves a JSON template:

```json
{
  "title": "My Dashboard",
  "widgets": [
    { "component": "timeseries", "span": 8, "title": "Price", "source": { "url": "/api/prices" } },
    { "component": "metric", "span": 4, "title": "Volume", "source": { "url": "/api/volume" } },
    { "component": "table", "span": 12, "title": "Holdings", "source": { "url": "/api/holdings" } }
  ]
}
```

The framework renders it. Convention over configuration — you declare the component type and data shape, it handles the rest.

## Widgets

| Component | Data Shape | Source |
|-----------|-----------|--------|
| `timeseries` | `[{ timestamp, value }]` | Recharts |
| `candlestick` | `[{ timestamp, open, high, low, close, volume }]` | TradingView |
| `table` | `[{ key: value, ... }]` | Built-in |
| `metric` | `{ value, delta, unit }` | Built-in |
| `text` | `[{ title, body, source, tags }]` | Built-in |

## Data Sources

```json
{ "source": { "url": "/api/data" } }
{ "source": { "url": "/api/data", "refreshInterval": 5000 } }
{ "source": { "url": "/api/stream", "stream": true } }
{ "source": { "url": "wss://api.example.com/live", "stream": "ws" } }
{ "source": { "data": [{ "timestamp": "2024-01-01", "value": 42 }] } }
```

## Demo

[Live Storybook](https://jim-technologies.github.io/medallion-terminal-core/)

## License

MIT
