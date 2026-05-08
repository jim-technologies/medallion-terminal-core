# Reference TerminalService backend

Single-file Node http server (`server.mjs`) implementing every RPC the dashboard speaks. Use as a template for a real backend.

## Run

```bash
pnpm backend                    # listens on :3001
node examples/backend/server.mjs # equivalent
PORT=4000 pnpm backend          # custom port
```

Then open the matching dashboard:

```
http://localhost:5173/?template=/examples/reference-backend.json&backend=http://localhost:3001
```

The dashboard template is `public/examples/reference-backend.json`.

## What it implements

| RPC | What you'll see |
|-----|-----------------|
| `ListSources` | 6 sources: spot, candles, orderbook, options chain, fills, news |
| `Get` | One-shot fetch for any of the above |
| `Stream` | Per-connection streams. Spot ticks every 1s, orderbook every 500ms, fills every 2s, candles every 5s |
| `SubmitAction` | Idempotent on `client_request_id`. `place_order` returns `ACCEPTED` synchronously, then progresses async |
| `WatchAction` | Streams `ACTION_STATUS_ACCEPTED → PENDING (partial) → OK (filled)` over ~2.6s |
| `Generate` | Pattern-matches the prompt; emits real `WidgetAction`s + ctx updates |

## Forking it

The server is intentionally one file. To fork:

1. Copy `server.mjs` next to your real data sources.
2. Replace the `HANDLERS` map (lines ~145) with calls into your domain code. Each entry takes `params` and returns `{ <oneof_case>: <payload> }` matching `proto/medallion/terminal/v1/shapes.proto`.
3. Replace `SOURCES` (lines ~20) with your real catalog.
4. Replace `handleSubmit` and `scheduleOrderProgress` with calls into your order-routing code.
5. Replace `handleGenerate` with a real LLM call (or delete the route — `Generate` is optional).

Frame format for streams (`Stream` and `WatchAction`):
```
[flags(1)][length(4 BE)][payload(N JSON bytes)]
flags & 0x02 = end-of-stream
```

The frontend's `parseConnectEnvelopes` expects exactly this. The `frame()` and `endFrame()` helpers at the top of `server.mjs` are the canonical encoders.

## Integration test

`src/__tests__/backend.integration.test.ts` boots this backend on an ephemeral port and round-trips every RPC through the same client utilities the dashboard uses. Run via `pnpm test`. Failing CI on this file means the proto, the backend, or the client helpers drifted.
