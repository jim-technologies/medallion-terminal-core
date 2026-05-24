// Reference TerminalService backend — single-file Node http server.
// Implements every RPC the dashboard speaks (Get, Stream, ListSources,
// SubmitAction, WatchAction, Generate) over Connect HTTP/JSON. Use as
// a template to fork for real backends.
//
// Run:   pnpm backend     (or: node examples/backend/server.mjs)
// View:  http://localhost:5173/?template=/examples/reference-backend.json&backend=http://localhost:3001
// The dashboard template that exercises this backend lives at
// public/examples/reference-backend.json.
//
// ╔══════════════════════════════════════════════════════════════════╗
// ║ DEMO-ONLY DEFAULTS — DO NOT DEPLOY AS-IS                         ║
// ║   • CORS: Access-Control-Allow-Origin: *                         ║
// ║   • No authentication                                             ║
// ║   • No rate limiting                                              ║
// ║   • Request body capped at 1 MiB (DoS guard)                     ║
// ║   • In-memory action store bounded at 1024 (LRU eviction)        ║
// ║ Replace each before any non-localhost deploy.                    ║
// ╚══════════════════════════════════════════════════════════════════╝

import { createServer } from 'node:http'

const PORT = Number(process.env.PORT ?? 3001)
const SERVICE = 'medallion.terminal.v1.TerminalService'

// -------------------------------------------------------------
// Source catalog — what this backend can serve.
// -------------------------------------------------------------

const SOURCES = [
  {
    id: 'files',
    name: 'Demo file store',
    description: 'In-memory object store. Lists immediate children at the given path. Pairs with the file_browser widget. Range-supporting /media/{ns}/{oid} endpoint makes <video> seek work on large uploads.',
    shape: 'SHAPE_UNSPECIFIED',
    streamable: false,
    tags: ['files', 'demo'],
    params: [
      { key: 'namespace', description: 'Tenant / bucket name', type: 'PARAM_TYPE_STRING', default_value: 'demo' },
      { key: 'path',      description: 'Folder prefix (empty = root)', type: 'PARAM_TYPE_STRING', default_value: '' },
    ],
  },
  {
    id: 'btc_spot',
    name: 'BTC spot price',
    description: 'Last trade price for BTC/USD. Streams a fresh tick every second.',
    shape: 'SHAPE_METRIC',
    streamable: true,
    tags: ['crypto', 'price'],
    params: [{ key: 'symbol', description: 'Ticker (BTCUSD, ETHUSD)', type: 'PARAM_TYPE_STRING', default_value: 'BTCUSD' }],
  },
  {
    id: 'btc_candles',
    name: 'BTC OHLCV bars',
    description: '1-minute candles. Streams an append every 5s.',
    shape: 'SHAPE_CANDLES',
    streamable: true,
    tags: ['crypto', 'price'],
    params: [
      { key: 'symbol', description: 'Ticker', type: 'PARAM_TYPE_STRING', default_value: 'BTCUSD' },
      { key: 'limit', description: 'Number of bars to return', type: 'PARAM_TYPE_INTEGER', default_value: '60' },
    ],
  },
  {
    id: 'btc_orderbook',
    name: 'BTC order book',
    description: 'Top-of-book bids and asks. Streams every 500ms.',
    shape: 'SHAPE_ORDERBOOK',
    streamable: true,
    tags: ['crypto', 'microstructure'],
    params: [{ key: 'symbol', description: 'Ticker', type: 'PARAM_TYPE_STRING', default_value: 'BTCUSD' }],
  },
  {
    id: 'btc_options',
    name: 'BTC options chain',
    description: 'Static options chain for the next monthly expiry.',
    shape: 'SHAPE_PAIRED_GRID',
    streamable: false,
    tags: ['crypto', 'options'],
    params: [{ key: 'expiry', description: 'Expiry date', type: 'PARAM_TYPE_DATE', default_value: '2026-06-27' }],
  },
  {
    id: 'fills',
    name: 'Recent fills',
    description: 'Latest executed trades. Streams a new event every 2s.',
    shape: 'SHAPE_EVENTS',
    streamable: true,
    tags: ['crypto', 'trades'],
    params: [],
  },
  {
    id: 'news',
    name: 'Market news',
    description: 'Curated headlines for the active symbol.',
    shape: 'SHAPE_TEXT',
    streamable: false,
    tags: ['news'],
    params: [{ key: 'symbol', description: 'Ticker', type: 'PARAM_TYPE_STRING', default_value: 'BTCUSD' }],
  },
  {
    id: 'nba_spread',
    name: 'NBA spread ladder',
    description: 'Live decimal odds across spread points for an NBA matchup. Streams every 1.5s.',
    shape: 'SHAPE_PAIRED_GRID',
    streamable: true,
    tags: ['sports', 'nba', 'odds'],
    params: [{ key: 'matchup', description: 'Matchup id', type: 'PARAM_TYPE_STRING', default_value: 'LAL-BOS' }],
  },
  {
    id: 'bankroll',
    name: 'Bankroll',
    description: 'Available capital for the active book.',
    shape: 'SHAPE_METRIC',
    streamable: false,
    tags: ['portfolio'],
    params: [],
  },
]

// -------------------------------------------------------------
// Generators — produce a DataResponse for each source.
// -------------------------------------------------------------

let spot = 67_842

function tickSpot() {
  spot += (Math.random() - 0.5) * 80
  return spot
}

function getBtcSpot() {
  const value = tickSpot()
  return { metric: { value, delta: (Math.random() - 0.5) * 0.02, unit: 'USD' } }
}

function getBtcCandles(limit = 60) {
  const bars = []
  let t = Math.floor(Date.now() / 60_000) * 60_000 - limit * 60_000
  let prev = spot - 200
  for (let i = 0; i < limit; i++) {
    const o = prev
    const c = o + (Math.random() - 0.5) * 120
    const h = Math.max(o, c) + Math.random() * 60
    const l = Math.min(o, c) - Math.random() * 60
    bars.push({
      timestamp: new Date(t).toISOString(),
      open: round(o), high: round(h), low: round(l), close: round(c),
      volume: round(Math.random() * 8 + 1, 2),
    })
    prev = c
    t += 60_000
  }
  return { candles: { bars } }
}

function getBtcOrderbook() {
  const mid = spot
  const bids = []
  const asks = []
  for (let i = 1; i <= 8; i++) {
    bids.push({ price: round(mid - i * 0.5), size: round(Math.random() * 3 + 0.1, 3) })
    asks.push({ price: round(mid + i * 0.5), size: round(Math.random() * 3 + 0.1, 3) })
  }
  return { orderbook: { bids, asks, mid: round(mid), spread: 1, venue: 'reference' } }
}

function getBtcOptions() {
  const measures = [
    { key: 'iv', label: 'IV', format: 'percent' },
    { key: 'delta', label: 'Δ' },
    { key: 'bid', label: 'Bid', format: 'compact' },
    { key: 'ask', label: 'Ask', format: 'compact' },
  ]
  const rows = []
  for (const strike of [50_000, 55_000, 60_000, 65_000, 67_500, 70_000, 72_500, 75_000, 80_000, 85_000]) {
    const moneyness = (spot - strike) / spot
    const callIntrinsic = Math.max(0, spot - strike)
    const putIntrinsic = Math.max(0, strike - spot)
    const tv = 1500 * Math.exp(-Math.abs(moneyness) * 4)
    rows.push({
      key: strike,
      left: { values: { iv: 0.55 + Math.random() * 0.2, delta: clamp(0.5 + moneyness * 2.4, 0.05, 0.97), bid: round(callIntrinsic + tv * 0.95), ask: round(callIntrinsic + tv * 1.05) } },
      right: { values: { iv: 0.55 + Math.random() * 0.2, delta: clamp(-0.5 + moneyness * 2.4, -0.97, -0.05), bid: round(putIntrinsic + tv * 0.95), ask: round(putIntrinsic + tv * 1.05) } },
    })
  }
  return {
    paired_grid: {
      subject: 'BTC', dimension: '2026-06-27', subject_value: round(spot), venue: 'reference',
      left_label: 'Calls', right_label: 'Puts', key_label: 'Strike',
      measures, rows,
    },
  }
}

function nextFill() {
  const side = Math.random() < 0.5 ? 'BUY ' : 'SELL'
  const px = round(spot + (Math.random() - 0.5) * 4)
  const sz = round(Math.random() * 0.5 + 0.005, 3)
  return {
    timestamp: new Date().toISOString().slice(11, 19),
    label: `${side} ${sz.toFixed(3)} @ ${px.toLocaleString()}`,
    status: 'EVENT_STATUS_OK',
    source: 'reference',
    tags: [side.trim().toLowerCase()],
  }
}

// Per-connection ring buffer factory: each Stream subscriber gets its
// own fills history so concurrent clients don't shift each other's
// state. Get-shaped reads use a transient buffer (one snapshot, no
// shared mutation).
function newFillsBuffer() {
  return Array.from({ length: 8 }, nextFill)
}

function getFillsSnapshot() {
  return { events: { events: newFillsBuffer().reverse() } }
}

// Sports book sources — drive the Kelly domain-pack demo.

let homeFav = -3.5  // current spread point favored by the home team
function tickSpread() {
  homeFav += (Math.random() - 0.5) * 0.4
  return homeFav
}

function getNbaSpread() {
  const center = tickSpread()
  const measures = [{ key: 'odds', label: 'Odds', format: 'number' }]
  const rows = []
  for (const offset of [-7.5, -5.5, -3.5, -1.5, 0, 1.5, 3.5, 5.5, 7.5]) {
    const line = round(center + offset, 1)
    // Exponential decay around the true line; convert to decimal odds with a 5% vig.
    const homeProb = 1 / (1 + Math.exp(-line / 4))
    const vig = 1.05
    const homeOdds = round(vig / homeProb, 2)
    const awayOdds = round(vig / (1 - homeProb), 2)
    rows.push({ key: line, left: { values: { odds: homeOdds } }, right: { values: { odds: awayOdds } } })
  }
  return {
    paired_grid: {
      subject: 'Lakers vs Celtics',
      dimension: 'Spread (pts)',
      subject_value: round(center, 1),
      venue: 'reference',
      left_label: 'Lakers',
      right_label: 'Celtics',
      key_label: 'Line',
      measures,
      rows,
    },
  }
}

let bankroll = 10_000
function getBankroll() {
  return { metric: { value: bankroll, unit: 'USD', label: 'available' } }
}

function getNews(symbol = 'BTCUSD') {
  return {
    text: {
      items: [
        { title: `${symbol} pulls back from intraday high`, body: 'Order flow data shows aggressive selling at the round number.', source: 'WireSim', date: 'just now', sentiment: -0.2 },
        { title: 'ETF inflows continue', body: 'Net inflows of $48M reported across the major spot ETFs.', source: 'WireSim', date: '5m ago', sentiment: 0.4 },
        { title: 'Volatility compresses ahead of Fed minutes', body: 'Implied vol grinds lower despite a steady realized print.', source: 'WireSim', date: '32m ago', sentiment: 0.1 },
      ],
    },
  }
}

const HANDLERS = {
  btc_spot:      () => getBtcSpot(),
  btc_candles:   p => getBtcCandles(parseInt(p.limit ?? '60', 10)),
  btc_orderbook: () => getBtcOrderbook(),
  btc_options:   () => getBtcOptions(),
  fills:         () => getFillsSnapshot(),
  news:          p => getNews(p.symbol ?? 'BTCUSD'),
  nba_spread:    () => getNbaSpread(),
  bankroll:      () => getBankroll(),
  files:         p => listFiles(p.namespace ?? 'demo', p.path ?? ''),
}

const STREAM_TICK_MS = {
  btc_orderbook: 500,
  btc_spot:      1000,
  fills:         2000,
  btc_candles:   5000,
  nba_spread:    1500,
}
const DEFAULT_TICK_MS = 1500

// -------------------------------------------------------------
// Connect framing — [flags(1)][length(4 BE)][payload N].
// -------------------------------------------------------------

/** @param {object} obj */
function frame(obj) {
  const payload = Buffer.from(JSON.stringify(obj))
  const buf = Buffer.alloc(5 + payload.length)
  buf.writeUInt8(0, 0)
  buf.writeUInt32BE(payload.length, 1)
  payload.copy(buf, 5)
  return buf
}

function endFrame(body = {}) {
  const trailer = Buffer.from(JSON.stringify(body))
  const buf = Buffer.alloc(5 + trailer.length)
  buf.writeUInt8(0x02, 0) // end-of-stream flag
  buf.writeUInt32BE(trailer.length, 1)
  trailer.copy(buf, 5)
  return buf
}

function errorTrailer(code, message) {
  return endFrame({ error: { code, message } })
}

// -------------------------------------------------------------
// Action state — tracks in-flight orders for WatchAction.
// -------------------------------------------------------------

// Cap the in-memory action log so a long-running reference backend
// doesn't leak. Real backends would persist + TTL via a real store.
const ACTIONS_CAP = 1024
const actions = new Map() // key: client_request_id -> { id, action_id, status, history }

function recordAction(req) {
  const existing = req.client_request_id && actions.get(req.client_request_id)
  if (existing) return existing // idempotent: same client_request_id returns the original
  const id = `ord-${Math.random().toString(36).slice(2, 10)}`
  const entry = {
    id,
    action_id: req.action_id,
    client_request_id: req.client_request_id ?? '',
    params: req.params ?? {},
    history: [{ status: 'ACTION_STATUS_ACCEPTED', timestamp: new Date().toISOString(), sequence: 0 }],
  }
  if (req.client_request_id) {
    if (actions.size >= ACTIONS_CAP) {
      // Map iterator preserves insertion order; drop the oldest.
      actions.delete(actions.keys().next().value)
    }
    actions.set(req.client_request_id, entry)
  }
  return entry
}

function appendAction(entry, update) {
  const seq = entry.history.length
  entry.history.push({ ...update, timestamp: new Date().toISOString(), sequence: seq })
}

// Simulate an order moving ACCEPTED → PENDING (partial) → OK (filled).
function scheduleOrderProgress(entry) {
  const params = entry.params || {}
  const totalAmount = Number(params.amount ?? 1)
  setTimeout(() => {
    appendAction(entry, { status: 'ACTION_STATUS_PENDING', status_detail: 'partial', message: `Filled ${(totalAmount * 0.4).toFixed(4)} / ${totalAmount}` })
  }, 800)
  setTimeout(() => {
    appendAction(entry, { status: 'ACTION_STATUS_PENDING', status_detail: 'partial', message: `Filled ${(totalAmount * 0.75).toFixed(4)} / ${totalAmount}` })
  }, 1700)
  setTimeout(() => {
    appendAction(entry, { status: 'ACTION_STATUS_OK', status_detail: 'filled', message: `Filled ${totalAmount} @ ${Math.round(spot)}`, data: { fill_price: round(spot), fill_qty: totalAmount } })
  }, 2600)
}

// -------------------------------------------------------------
// HTTP server.
// -------------------------------------------------------------

// Exported for the integration test (vitest) and any embedder. The
// CLI entrypoint at the bottom auto-starts on PORT when run directly.
export function createTerminalServer() {
  return createServer(handleRequest)
}

async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders())
    res.end()
    return
  }
  res.setHeader('Access-Control-Allow-Origin', '*')

  const path = req.url || ''

  // Bodyless routes — handled before body capture so a large GET (e.g.
  // a partial-content video range) doesn't trip the byte cap.
  if ((req.method === 'GET' || req.method === 'HEAD') && path.startsWith('/media/')) {
    return handleMedia(req, res, path)
  }

  if (!path.startsWith(`/${SERVICE}/`) && path !== '/files.v1.FileService/Download') {
    res.writeHead(404).end()
    return
  }

  // 32 MiB body cap — bumped from the 1 MiB CRUD default because file
  // uploads (base64-encoded) need headroom. Real backends route through
  // a reverse proxy with stricter, route-aware limits.
  const MAX_BODY = 32 << 20
  let body = ''
  let bodyBytes = 0
  let oversize = false
  for await (const chunk of req) {
    bodyBytes += chunk.length
    if (bodyBytes > MAX_BODY) { oversize = true; break }
    body += chunk
  }
  if (oversize) {
    res.writeHead(413, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ code: 'resource_exhausted', message: `body exceeds ${MAX_BODY} bytes` }))
    return
  }
  let parsed = {}
  try { parsed = body ? JSON.parse(body) : {} } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ code: 'invalid_argument', message: 'malformed JSON' }))
    return
  }

  // Connect-style Download lives outside the TerminalService namespace
  // because file_browser's default options.download_url targets it.
  if (path === '/files.v1.FileService/Download') {
    return handleFileDownload(res, parsed)
  }

  const rpc = path.slice(SERVICE.length + 2)
  switch (rpc) {
    case 'ListSources': return json(res, { sources: SOURCES })
    case 'Get':         return handleGet(res, parsed)
    case 'Stream':      return handleStream(res, parsed)
    case 'Generate':    return handleGenerate(res, parsed)
    case 'SubmitAction': return handleSubmit(res, parsed)
    case 'WatchAction':  return handleWatch(res, parsed)
    default:
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ code: 'not_found', message: `unknown RPC: ${rpc}` }))
  }
}

function handleGet(res, req) {
  const handler = HANDLERS[req.source_id]
  if (!handler) return notFound(res, `unknown source: ${req.source_id}`)
  json(res, handler(req.params ?? {}))
}

function handleStream(res, req) {
  // Synthetic source for testing the trailer-error path: emits N data
  // frames then closes with an error trailer instead of a clean one.
  // params: { count: int, code: string, message: string }
  // Count is capped to keep a malicious caller from forcing a huge
  // synchronous write loop.
  if (req.source_id === '__error_after') {
    const requested = parseInt(req.params?.count ?? '2', 10)
    const count = Math.max(0, Math.min(Number.isFinite(requested) ? requested : 0, 1000))
    const code = req.params?.code ?? 'internal'
    const message = req.params?.message ?? 'simulated stream error'
    res.writeHead(200, { 'Content-Type': 'application/connect+json', 'Access-Control-Allow-Origin': '*' })
    for (let i = 0; i < count; i++) {
      res.write(frame({ metric: { value: i, unit: 'count' } }))
    }
    res.write(errorTrailer(code, message))
    res.end()
    return
  }

  const handler = HANDLERS[req.source_id]
  if (!handler) return notFound(res, `unknown source: ${req.source_id}`)

  res.writeHead(200, {
    'Content-Type': 'application/connect+json',
    'Access-Control-Allow-Origin': '*',
  })

  // Per-connection state for sources that need to evolve a series.
  // fills owns its own ring buffer so concurrent clients don't shift
  // each other's history.
  const fillsBuf = req.source_id === 'fills' ? newFillsBuffer() : null
  const tickMs = STREAM_TICK_MS[req.source_id] ?? DEFAULT_TICK_MS

  const emit = () => {
    if (fillsBuf) {
      fillsBuf.shift()
      fillsBuf.push(nextFill())
      res.write(frame({ events: { events: fillsBuf.slice().reverse() } }))
    } else {
      res.write(frame(handler(req.params ?? {})))
    }
  }

  emit() // first frame: snapshot
  const interval = setInterval(emit, tickMs)
  res.on('close', () => clearInterval(interval))
}

// -------------------------------------------------------------
// Generate — pattern-match a prompt into widget actions + context.
// Real backends call an LLM here; the reference impl just shows the
// shape of a useful response, so the Prompt → Generate → applyActions
// loop is demonstrable end-to-end.
// -------------------------------------------------------------

const KNOWN_SYMBOLS = ['BTC', 'ETH', 'SOL', 'DOGE', 'BTCUSD', 'ETHUSD', 'SOLUSD', 'DOGEUSD']

function detectSymbol(promptUpper) {
  for (const s of KNOWN_SYMBOLS) {
    const re = new RegExp(`\\b${s}\\b`)
    if (re.test(promptUpper)) return s.endsWith('USD') ? s : `${s}USD`
  }
  return null
}

function widgetForIntent(intent, symbol) {
  switch (intent) {
    case 'candles':
      return { target_id: 'gen-px', component: 'candlestick', span: 8, height: 380, title: `${symbol} — 1m bars`,
        source: { source_id: 'btc_candles', params: { symbol, limit: '60' }, stream: true } }
    case 'orderbook':
      return { target_id: 'gen-book', component: 'orderbook', span: 4, height: 380, title: 'Order book',
        source: { source_id: 'btc_orderbook', params: { symbol }, stream: true } }
    case 'options':
      return { target_id: 'gen-chain', component: 'paired_grid', span: 12, height: 380, title: 'Options chain',
        source: { source_id: 'btc_options' } }
    case 'spot':
      return { target_id: 'gen-spot', component: 'metric', span: 3, height: 110, title: `${symbol} spot`,
        source: { source_id: 'btc_spot', params: { symbol }, stream: true } }
    case 'fills':
      return { target_id: 'gen-fills', component: 'events', span: 9, height: 110, title: 'Live fills',
        source: { source_id: 'fills', stream: true } }
    case 'news':
      return { target_id: 'gen-news', component: 'text', span: 12, height: 240, title: 'News',
        source: { source_id: 'news', params: { symbol } } }
    default: return null
  }
}

function fullDashboard(symbol) {
  return ['spot', 'fills', 'candles', 'orderbook', 'options', 'news']
    .map(intent => widgetForIntent(intent, symbol))
}

function handleGenerate(res, req) {
  const prompt = String(req.prompt ?? '')
  const promptLower = prompt.toLowerCase()
  const promptUpper = prompt.toUpperCase()
  const incomingCtx = req.context?.values ?? {}

  const detected = detectSymbol(promptUpper)
  const symbol = detected ?? incomingCtx.symbol ?? 'BTCUSD'

  const wantsRebuild = /\b(rebuild|fresh|reset|new dashboard|start over|show me everything)\b/.test(promptLower)
  const intentMatchers = {
    candles:   /\b(chart|candle|candles|ohlc|price)\b/,
    orderbook: /\b(order ?book|depth|book)\b/,
    options:   /\b(option|options|chain)\b/,
    spot:      /\b(spot|last|quote)\b/,
    fills:     /\b(fill|fills|trades|tape)\b/,
    news:      /\b(news|headline|headlines)\b/,
  }

  let actions
  let replaceAll = false
  if (wantsRebuild) {
    actions = fullDashboard(symbol)
    replaceAll = true
  } else {
    actions = []
    for (const [intent, re] of Object.entries(intentMatchers)) {
      if (re.test(promptLower)) {
        const widget = widgetForIntent(intent, symbol)
        if (widget) actions.push(widget)
      }
    }
    // Symbol-only prompt with no widget intent: just switch context.
    // Existing source_id widgets re-fetch via `${ctx.symbol}` substitution.
  }

  const ctxUpdate = detected ? { values: { symbol: detected } } : undefined
  const text = actions.length > 0
    ? `Wired ${actions.length} widget${actions.length === 1 ? '' : 's'} for ${symbol}${replaceAll ? ' (full rebuild).' : '.'}`
    : detected
      ? `Switched to ${symbol}.`
      : 'Try: "show me BTC candles", "options chain", "rebuild for ETH", or just a ticker like "SOL".'

  json(res, { text, actions, context: ctxUpdate, replace_all: replaceAll })
}

function handleSubmit(res, req) {
  if (!req.action_id) return badRequest(res, 'action_id is required')
  // File upload is stateless from a lifecycle perspective — synchronous
  // OK/FAILED, no watch stream needed. Skip the action ring entirely.
  if (req.action_id === 'upload') {
    const r = handleFileUpload(req)
    if (!r.ok) {
      return json(res, {
        id: '',
        status: 'ACTION_STATUS_FAILED',
        message: r.message,
      })
    }
    return json(res, {
      id: r.object_id,
      status: 'ACTION_STATUS_OK',
      message: `Uploaded ${r.size_bytes} bytes → ${r.path}`,
      data: { object_id: r.object_id, path: r.path, size_bytes: r.size_bytes },
    })
  }
  const entry = recordAction(req)
  // Async lifecycle for orders; messages just OK synchronously.
  if (entry.action_id === 'place_order' && entry.history.length === 1) {
    scheduleOrderProgress(entry)
  }
  json(res, {
    id: entry.id,
    status: entry.history[0].status,
    message: 'Order accepted',
  })
}

function handleWatch(res, req) {
  const entry = (req.client_request_id && actions.get(req.client_request_id))
    || [...actions.values()].find(e => e.id === req.id || e.action_id === req.action_id)
  if (!entry) return notFound(res, 'no matching action to watch')

  res.writeHead(200, {
    'Content-Type': 'application/connect+json',
    'Access-Control-Allow-Origin': '*',
  })

  let cursor = 0
  const flush = () => {
    while (cursor < entry.history.length) {
      const u = entry.history[cursor]
      res.write(frame({
        id: entry.id,
        action_id: entry.action_id,
        client_request_id: entry.client_request_id,
        status: u.status,
        status_detail: u.status_detail,
        message: u.message,
        data: u.data,
        timestamp: u.timestamp,
        sequence: u.sequence,
      }))
      cursor += 1
      if (isTerminal(u.status)) {
        res.write(endFrame())
        res.end()
        return true
      }
    }
    return false
  }

  if (flush()) return
  const interval = setInterval(() => { if (flush()) clearInterval(interval) }, 200)
  res.on('close', () => clearInterval(interval))
}

const TERMINAL = new Set(['ACTION_STATUS_OK', 'ACTION_STATUS_REJECTED', 'ACTION_STATUS_FAILED', 'ACTION_STATUS_CANCELLED'])
function isTerminal(s) { return TERMINAL.has(s) }

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Idempotency-Key, Range, Connect-Protocol-Version',
    'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length',
    'Access-Control-Max-Age': '86400',
  }
}

// =============================================================
// File storage demo — pairs with the file_browser widget.
//
// Hive-style partitioning convention: `key__value/` (double-
// underscore as the `=` replacement, since GitHub-friendly paths
// can't use `=`). Uploaded files dropped at the root are
// auto-partitioned by content type (`type__video/`, `type__image/`,
// `type__data/`, ...). Uploads into a subfolder are respected as-is
// so users can build their own taxonomy on top.
//
// `/media/{namespace}/{object_id}` serves bytes with Range support,
// which is what lets the file_browser preview overlay's <video>
// element seek to arbitrary positions in large uploads without
// downloading the whole file. Browsers send `Range: bytes=N-` when
// the user scrubs; we return `206 Partial Content`.
// =============================================================

const fileStore = new Map() // namespace -> Map<objectId, { name, path, contentType, bytes, modifiedAt }>

function getNamespace(name) {
  let m = fileStore.get(name)
  if (!m) { m = new Map(); fileStore.set(name, m) }
  return m
}

function categorize(contentType) {
  const ct = (contentType || '').toLowerCase().split(';')[0].trim()
  if (ct.startsWith('video/')) return 'video'
  if (ct.startsWith('audio/')) return 'audio'
  if (ct.startsWith('image/')) return 'image'
  if (ct === 'application/pdf') return 'doc'
  if (ct === 'application/json' || ct === 'text/csv' || ct === 'application/x-ndjson') return 'data'
  if (ct.startsWith('text/')) return 'doc'
  if (ct.includes('zip') || ct.includes('tar') || ct.includes('gzip')) return 'archive'
  if (ct.includes('javascript') || ct.includes('typescript')) return 'code'
  return 'other'
}

// Apply hive convention only when the user dropped a bare filename
// (no folder). If they navigated into a subfolder first, respect that
// — the existing path becomes the partition by convention.
function hivePartition(rawPath, contentType) {
  if (rawPath.includes('/')) return rawPath
  return `type__${categorize(contentType)}/${rawPath}`
}

function seedFile(namespace, path, contentType, bytes) {
  const oid = `obj-${Math.random().toString(36).slice(2, 10)}`
  getNamespace(namespace).set(oid, {
    name: path.split('/').pop(),
    path,
    contentType,
    bytes: Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes),
    modifiedAt: new Date().toISOString(),
  })
  return oid
}

// Initial fixtures so the file_browser shows something before the
// user uploads anything. All seeded paths use the hive convention.
seedFile('demo', 'type__doc/README.md', 'text/markdown',
  '# Medallion file_browser demo\n\n' +
  'Drag any file into this pane to upload. Bare filenames are auto-partitioned\n' +
  'by content type (e.g. `type__video/`); paths inside a subfolder are kept as-is.\n\n' +
  'Drop a video and scrub the preview — the backend serves `Range:` requests,\n' +
  'so seek works without downloading the whole file.\n')
seedFile('demo', 'type__data/tickers.json', 'application/json',
  JSON.stringify({ symbols: ['BTC', 'ETH', 'SOL'], updated: new Date().toISOString() }, null, 2))

// listFiles returns immediate children of `path` (folders and files).
// Pairs with the file_browser widget's expected shape.
function listFiles(namespace, path) {
  const ns = getNamespace(namespace)
  const prefix = path ? path + '/' : ''
  const folders = new Set()
  const files = []
  for (const [oid, f] of ns) {
    if (!f.path.startsWith(prefix)) continue
    const rest = f.path.slice(prefix.length)
    const slash = rest.indexOf('/')
    if (slash >= 0) {
      folders.add(rest.slice(0, slash))
    } else if (rest) {
      files.push({
        kind: 'file',
        name: f.name,
        object_id: oid,
        size_bytes: f.bytes.length,
        content_type: f.contentType,
        modified_at: f.modifiedAt,
      })
    }
  }
  const folderEntries = [...folders].sort().map(name => ({ kind: 'folder', name }))
  files.sort((a, b) => a.name.localeCompare(b.name))
  return { entries: [...folderEntries, ...files] }
}

function handleFileUpload(req) {
  const params = req.params ?? {}
  const namespace = String(params.namespace ?? 'demo')
  const rawPath = String(params.path ?? '').trim()
  if (!rawPath) return { ok: false, message: 'path is required' }
  const contentType = String(params.content_type ?? 'application/octet-stream')
  const dataB64 = String(params.data_b64 ?? '')
  const bytes = dataB64 ? Buffer.from(dataB64, 'base64') : Buffer.alloc(0)
  const finalPath = hivePartition(rawPath, contentType)
  const oid = `obj-${Math.random().toString(36).slice(2, 10)}`
  getNamespace(namespace).set(oid, {
    name: finalPath.split('/').pop(),
    path: finalPath,
    contentType,
    bytes,
    modifiedAt: new Date().toISOString(),
  })
  return { ok: true, object_id: oid, path: finalPath, size_bytes: bytes.length }
}

// GET / HEAD /media/{namespace}/{object_id}
//
// Range handling matters: <video> elements send `Range: bytes=N-` when
// the user scrubs. Without 206 responses, scrub would either re-download
// from byte 0 (slow) or simply not work (some browsers refuse). For
// open-ended `bytes=N-` we serve from N to EOF; for suffix `bytes=-N`
// we serve the last N bytes. Bare 416 on parse failure.
function handleMedia(req, res, urlPath) {
  const parts = urlPath.split('/').filter(Boolean)
  if (parts.length < 3 || parts[0] !== 'media') {
    return notFound(res, 'expected /media/{namespace}/{object_id}')
  }
  const namespace = decodeURIComponent(parts[1])
  const objectId = decodeURIComponent(parts[2])
  const file = getNamespace(namespace).get(objectId)
  if (!file) return notFound(res, `no object ${objectId} in ${namespace}`)

  const total = file.bytes.length
  const base = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'Content-Range, Accept-Ranges, Content-Length',
    'Accept-Ranges': 'bytes',
    'Content-Type': file.contentType,
    'Cache-Control': 'private, max-age=60',
  }
  const range = req.headers.range
  if (range) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range)
    if (!m) {
      res.writeHead(416, { ...base, 'Content-Range': `bytes */${total}` }).end()
      return
    }
    const [, startStr, endStr] = m
    let start, end
    if (startStr === '' && endStr !== '') {
      // suffix range: last N bytes
      const n = parseInt(endStr, 10)
      start = Math.max(0, total - n)
      end = total - 1
    } else {
      start = startStr === '' ? 0 : parseInt(startStr, 10)
      end = endStr === '' ? total - 1 : parseInt(endStr, 10)
    }
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end >= total || start > end) {
      res.writeHead(416, { ...base, 'Content-Range': `bytes */${total}` }).end()
      return
    }
    const chunk = file.bytes.subarray(start, end + 1)
    res.writeHead(206, {
      ...base,
      'Content-Length': String(chunk.length),
      'Content-Range': `bytes ${start}-${end}/${total}`,
    })
    if (req.method === 'HEAD') res.end()
    else res.end(chunk)
    return
  }
  res.writeHead(200, { ...base, 'Content-Length': String(total) })
  if (req.method === 'HEAD') res.end()
  else res.end(file.bytes)
}

// Connect server-streaming Download. Matches the path the file_browser
// uses by default (`options.download_url`). Streams in 64 KiB chunks
// so a large file doesn't have to fit into one envelope.
function handleFileDownload(res, req) {
  const namespace = String(req.namespace ?? req.params?.namespace ?? 'demo')
  const objectId = String(req.objectId ?? req.object_id ?? req.params?.objectId ?? '')
  res.writeHead(200, {
    'Content-Type': 'application/connect+json',
    'Access-Control-Allow-Origin': '*',
  })
  const file = getNamespace(namespace).get(objectId)
  if (!file) {
    res.write(errorTrailer('not_found', `no object ${objectId} in ${namespace}`))
    res.end()
    return
  }
  const CHUNK = 64 * 1024
  for (let off = 0; off < file.bytes.length; off += CHUNK) {
    const slice = file.bytes.subarray(off, Math.min(off + CHUNK, file.bytes.length))
    res.write(frame({ data: slice.toString('base64') }))
  }
  res.write(endFrame())
  res.end()
}

function json(res, obj) {
  res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  res.end(JSON.stringify(obj))
}

function notFound(res, msg) {
  res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  res.end(JSON.stringify({ code: 'not_found', message: msg }))
}

function badRequest(res, msg) {
  res.writeHead(400, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  res.end(JSON.stringify({ code: 'invalid_argument', message: msg }))
}

function round(n, p = 0) {
  const f = Math.pow(10, p)
  return Math.round(n * f) / f
}
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)) }

// CLI entrypoint: only auto-listen when this file is run directly.
// Tests import createTerminalServer() and bind to an ephemeral port.
import { fileURLToPath } from 'node:url'
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createTerminalServer()
  server.listen(PORT, () => {
    console.log(`[medallion-ref-backend] listening on http://localhost:${PORT}`)
    console.log(`[medallion-ref-backend] sources: ${SOURCES.map(s => s.id).join(', ')}`)
  })
}
