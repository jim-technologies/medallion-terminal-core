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
// ║   • Request body capped at 32 MiB (demo upload guard)            ║
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
    description: 'In-memory path-based object store. Lists immediate children at the given path. Range-supporting /media?namespace=…&path=… previews large media.',
    shape: 'SHAPE_TABLE',
    streamable: false,
    tags: ['files', 'demo'],
    params: [
      { key: 'namespace', description: 'Tenant / bucket name', type: 'PARAM_TYPE_STRING', default_value: 'demo' },
      { key: 'path',      description: 'Folder prefix (empty = root)', type: 'PARAM_TYPE_STRING', default_value: '' },
      { key: 'page',      description: 'One-based listing page', type: 'PARAM_TYPE_INTEGER', default_value: '1' },
      { key: 'page_size', description: 'Entries per listing page', type: 'PARAM_TYPE_INTEGER', default_value: '50' },
    ],
  },
  {
    id: 'platform_assets',
    name: 'Platform asset catalog',
    description: 'Governed discovery catalog spanning datasets, object types, pipelines, models, repositories, and dashboards.',
    shape: 'SHAPE_ASSET_CATALOG',
    streamable: false,
    tags: ['catalog', 'governance', 'platform'],
    params: [],
  },
  {
    id: 'platform_object',
    name: 'Platform object detail',
    description: 'Semantic detail, properties, links, and actions for the selected platform asset or ontology object.',
    shape: 'SHAPE_OBJECT',
    streamable: false,
    tags: ['ontology', 'metadata', 'platform'],
    params: [
      { key: 'asset_id', description: 'Selected asset/object id', type: 'PARAM_TYPE_STRING', default_value: 'dataset.customer_360' },
      { key: 'asset_kind', description: 'Selected asset kind', type: 'PARAM_TYPE_STRING', default_value: 'dataset' },
    ],
  },
  {
    id: 'platform_lineage',
    name: 'Platform lineage graph',
    description: 'Directed lineage and dependency graph around the selected asset.',
    shape: 'SHAPE_GRAPH',
    streamable: false,
    tags: ['lineage', 'graph', 'platform'],
    params: [
      { key: 'asset_id', description: 'Selected asset id', type: 'PARAM_TYPE_STRING', default_value: 'dataset.customer_360' },
    ],
  },
  {
    id: 'platform_repository',
    name: 'Platform code repository',
    description: 'Ref-aware source tree and text file content for the code_browser widget.',
    shape: 'SHAPE_REPOSITORY',
    streamable: false,
    tags: ['code', 'repository', 'platform'],
    params: [
      { key: 'repository', description: 'Repository id', type: 'PARAM_TYPE_STRING', default_value: 'analytics' },
      { key: 'ref', description: 'Branch, tag, or commit', type: 'PARAM_TYPE_STRING', default_value: 'main' },
      { key: 'path', description: 'Directory or file path', type: 'PARAM_TYPE_STRING', default_value: '' },
    ],
  },
  {
    id: 'business_records',
    name: 'Business work records',
    description: 'Typed, mutable work records with saved grid, board, calendar, and form views.',
    shape: 'SHAPE_RECORD_SET',
    streamable: false,
    tags: ['records', 'workflow', 'business'],
    params: [
      { key: 'table_id', description: 'Logical record table', type: 'PARAM_TYPE_STRING', default_value: 'work_items' },
    ],
  },
  {
    id: 'workspace_conversation',
    name: 'Workspace conversation',
    description: 'Product-neutral channel transcript with participants, replies, reactions, attachments, and selection context.',
    shape: 'SHAPE_CONVERSATION',
    streamable: false,
    tags: ['conversation', 'collaboration', 'demo'],
    params: [
      { key: 'conversation_id', description: 'Conversation or channel id', type: 'PARAM_TYPE_STRING', default_value: 'launch-room' },
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

// Sports book sources — drive the Kelly custom-widget demo.

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

const PLATFORM_ASSETS = [
  {
    id: 'dataset.customer_360',
    name: 'Customer 360',
    kind: 'dataset',
    owner: 'growth-data',
    status: 'healthy',
    description: 'Curated customer, account, product, and engagement facts.',
    updated_at: '2026-07-16T14:30:00Z',
    tags: ['gold', 'pii'],
    metadata: { rows: '18.4M', quality: '99.7%', classification: 'restricted' },
    context: { asset_id: 'dataset.customer_360', asset_kind: 'dataset' },
  },
  {
    id: 'object_type.Customer',
    name: 'Customer',
    kind: 'object_type',
    owner: 'ontology',
    status: 'published',
    description: 'Semantic customer type linked to accounts, contacts, orders, and support cases.',
    updated_at: '2026-07-15T18:10:00Z',
    tags: ['ontology', 'commercial'],
    metadata: { properties: 24, link_types: 6, actions: 3 },
    context: { asset_id: 'object_type.Customer', asset_kind: 'object_type' },
  },
  {
    id: 'pipeline.customer_features',
    name: 'Customer features',
    kind: 'pipeline',
    owner: 'ml-platform',
    status: 'warning',
    description: 'Hourly feature materialization used by retention models.',
    updated_at: '2026-07-16T14:12:00Z',
    tags: ['features', 'production'],
    metadata: { schedule: 'hourly', freshness: '18m', sla: '15m' },
    context: { asset_id: 'pipeline.customer_features', asset_kind: 'pipeline' },
  },
  {
    id: 'model.churn_v4',
    name: 'Churn risk v4',
    kind: 'model',
    owner: 'retention-ml',
    status: 'active',
    description: 'Production gradient-boosted churn classifier.',
    updated_at: '2026-07-16T09:00:00Z',
    tags: ['classification', 'production'],
    metadata: { auc: 0.91, version: '4.3.1' },
    context: { asset_id: 'model.churn_v4', asset_kind: 'model' },
  },
  {
    id: 'repository.analytics',
    name: 'analytics',
    kind: 'repository',
    owner: 'data-platform',
    status: 'active',
    description: 'Transformations, ontology mappings, and analytical services.',
    updated_at: '2026-07-16T13:45:00Z',
    tags: ['typescript', 'sql'],
    metadata: { default_ref: 'main', language: 'TypeScript' },
    context: {
      asset_id: 'repository.analytics',
      asset_kind: 'repository',
      repository: 'analytics',
      repo_ref: 'main',
      repo_path: '',
    },
  },
  {
    id: 'dashboard.retention_ops',
    name: 'Retention operations',
    kind: 'dashboard',
    owner: 'customer-success',
    status: 'published',
    description: 'Operational view over customer health, cases, renewals, and interventions.',
    updated_at: '2026-07-16T12:20:00Z',
    tags: ['operations'],
    metadata: { viewers_30d: 184 },
    context: { asset_id: 'dashboard.retention_ops', asset_kind: 'dashboard' },
  },
]

function getPlatformAssets() {
  return { assets: { items: PLATFORM_ASSETS, total: String(PLATFORM_ASSETS.length) } }
}

function getPlatformObject(params) {
  const assetId = params.asset_id ?? 'dataset.customer_360'
  const assetKind = params.asset_kind ?? PLATFORM_ASSETS.find(asset => asset.id === assetId)?.kind ?? 'asset'
  const asset = PLATFORM_ASSETS.find(candidate => candidate.id === assetId)
  const name = asset?.name ?? assetId
  return {
    object: {
      object_type: assetKind,
      object_id: assetId,
      title: name,
      description: asset?.description ?? 'Platform resource',
      status: asset?.status ?? 'active',
      updated_at: asset?.updated_at,
      tags: asset?.tags ?? [],
      properties: [
        { key: 'owner', label: 'Owner', value: asset?.owner ?? 'unassigned', group: 'Governance' },
        { key: 'kind', label: 'Kind', value: assetKind, group: 'Governance' },
        { key: 'classification', label: 'Classification', value: asset?.metadata?.classification ?? 'internal', group: 'Governance' },
        { key: 'metadata', label: 'Metadata', value: asset?.metadata ?? {}, format: 'json', group: 'Technical' },
      ],
      links: [
        {
          relation: 'upstream',
          target_type: 'dataset',
          target_id: 'dataset.raw_orders',
          label: 'Raw orders',
          context: { asset_id: 'dataset.raw_orders', asset_kind: 'dataset' },
        },
        {
          relation: 'used by',
          target_type: 'model',
          target_id: 'model.churn_v4',
          label: 'Churn risk v4',
          context: { asset_id: 'model.churn_v4', asset_kind: 'model' },
        },
      ],
      actions: [
        { id: 'acknowledge_asset', label: 'Acknowledge', style: 'primary', params: { asset_id: assetId } },
        { id: 'request_asset_review', label: 'Request review', confirm: true, params: { asset_id: assetId } },
      ],
    },
  }
}

function getPlatformLineage(params) {
  const selected = params.asset_id ?? 'dataset.customer_360'
  const nodes = [
    { id: 'dataset.raw_orders', label: 'raw_orders', kind: 'dataset', status: 'ok', subtitle: 'bronze' },
    { id: 'dataset.clean_orders', label: 'clean_orders', kind: 'dataset', status: 'ok', subtitle: 'silver' },
    { id: 'dataset.customer_360', label: 'customer_360', kind: 'dataset', status: 'warn', subtitle: 'gold' },
    { id: 'pipeline.customer_features', label: 'customer_features', kind: 'pipeline', status: 'running', subtitle: 'hourly' },
    { id: 'model.churn_v4', label: 'churn_v4', kind: 'model', status: 'ok', subtitle: 'production' },
    { id: 'dashboard.retention_ops', label: 'retention_ops', kind: 'dashboard', status: 'ok', subtitle: 'published' },
  ].map(node => ({
    ...node,
    status: node.id === selected ? 'info' : node.status,
    context: { asset_id: node.id, asset_kind: node.kind },
  }))
  return {
    graph: {
      nodes,
      edges: [
        { from: 'dataset.raw_orders', to: 'dataset.clean_orders', label: 'normalize' },
        { from: 'dataset.clean_orders', to: 'dataset.customer_360', label: 'join' },
        { from: 'dataset.customer_360', to: 'pipeline.customer_features', label: 'features' },
        { from: 'pipeline.customer_features', to: 'model.churn_v4', label: 'train/score' },
        { from: 'dataset.customer_360', to: 'dashboard.retention_ops', label: 'query' },
        { from: 'model.churn_v4', to: 'dashboard.retention_ops', label: 'risk' },
      ],
    },
  }
}

const REPOSITORY_FILES = new Map([
  ['README.md', '# analytics\n\nReference transformations and semantic mappings for the platform demo.\n'],
  ['src/index.ts', "export { customerHealth } from './customer.js'\n"],
  ['src/customer.ts', [
    "import type { Customer } from './types.js'",
    '',
    'export function customerHealth(customer: Customer): number {',
    '  const usage = Math.min(customer.activeUsers / customer.seats, 1)',
    '  const supportPenalty = Math.min(customer.openCases * 0.05, 0.3)',
    '  return Math.max(0, usage - supportPenalty)',
    '}',
  ].join('\n')],
  ['src/types.ts', [
    'export interface Customer {',
    '  activeUsers: number',
    '  seats: number',
    '  openCases: number',
    '}',
  ].join('\n')],
  ['sql/customer_360.sql', [
    'select',
    '  customer_id,',
    '  max_by(account_tier, observed_at) as account_tier,',
    '  sum(order_value) as lifetime_value',
    'from clean_orders',
    'group by customer_id',
  ].join('\n')],
])

function getPlatformRepository(params) {
  const repository = params.repository ?? 'analytics'
  const ref = params.ref ?? 'main'
  const requestedPath = normalizePath(params.path ?? '')
  const isFile = REPOSITORY_FILES.has(requestedPath)
  const directory = isFile ? parentPath(requestedPath) : requestedPath
  const entries = listRepositoryEntries(directory)
  const content = isFile ? REPOSITORY_FILES.get(requestedPath) : undefined
  return {
    repository: {
      repository,
      ref,
      path: requestedPath,
      refs: ['main', 'release/2026.07'],
      entries,
      ...(content != null ? {
        file: {
          path: requestedPath,
          content,
          language: languageFor(requestedPath),
          size_bytes: String(Buffer.byteLength(content)),
          truncated: false,
        },
      } : {}),
    },
  }
}

function listRepositoryEntries(directory) {
  const prefix = directory ? `${directory}/` : ''
  const seenDirectories = new Set()
  const entries = []
  for (const [path, content] of REPOSITORY_FILES) {
    if (!path.startsWith(prefix)) continue
    const rest = path.slice(prefix.length)
    if (!rest) continue
    const slash = rest.indexOf('/')
    if (slash >= 0) {
      const name = rest.slice(0, slash)
      if (seenDirectories.has(name)) continue
      seenDirectories.add(name)
      entries.push({
        path: joinPath(directory, name),
        name,
        kind: 'REPOSITORY_ENTRY_KIND_DIRECTORY',
      })
    } else {
      entries.push({
        path,
        name: rest,
        kind: 'REPOSITORY_ENTRY_KIND_FILE',
        language: languageFor(path),
        size_bytes: String(Buffer.byteLength(content)),
      })
    }
  }
  return entries
}

function languageFor(path) {
  if (/\.tsx?$/.test(path)) return 'typescript'
  if (/\.sql$/.test(path)) return 'sql'
  if (/\.md$/.test(path)) return 'markdown'
  return 'text'
}

// Generic record/work-management demo. The vocabulary is deliberately
// domain-neutral: the same payload can model projects, CRM opportunities,
// inventory, cases, approvals, or any other typed business records.
const WORK_FIELDS = [
  {
    key: 'name',
    label: 'Work item',
    type: 'RECORD_FIELD_TYPE_TEXT',
    description: 'Human-readable primary field.',
    required: true,
  },
  {
    key: 'customer',
    label: 'Customer',
    type: 'RECORD_FIELD_TYPE_LINK',
    linked_table_id: 'customers',
    choices: [
      { value: 'customer-northstar', label: 'Northstar Foods' },
      { value: 'customer-harbor', label: 'Harbor & Co.' },
      { value: 'customer-beacon', label: 'Beacon Retail' },
      { value: 'customer-alder', label: 'Alder Studio' },
      { value: 'customer-summit', label: 'Summit Works' },
      { value: 'customer-coral', label: 'Coral Health' },
      { value: 'customer-juniper', label: 'Juniper Supply' },
      { value: 'customer-forge', label: 'Forge Fabrication' },
    ],
  },
  {
    key: 'stage',
    label: 'Stage',
    type: 'RECORD_FIELD_TYPE_SINGLE_SELECT',
    required: true,
    choices: [
      { value: 'pipeline', label: 'Pipeline', color: 'info' },
      { value: 'delivery', label: 'Delivery', color: 'info' },
      { value: 'review', label: 'Review', color: 'warn' },
      { value: 'blocked', label: 'Blocked', color: 'danger' },
      { value: 'done', label: 'Done', color: 'ok' },
    ],
    default_value: 'pipeline',
  },
  {
    key: 'owner',
    label: 'Owner',
    type: 'RECORD_FIELD_TYPE_USER',
    choices: [
      { value: 'mina', label: 'Mina Patel' },
      { value: 'jules', label: 'Jules Chen' },
      { value: 'noah', label: 'Noah Williams' },
      { value: 'unassigned', label: 'Unassigned' },
    ],
    default_value: 'unassigned',
  },
  { key: 'value', label: 'Value', type: 'RECORD_FIELD_TYPE_CURRENCY', format: 'currency:USD' },
  { key: 'cost', label: 'Delivery cost', type: 'RECORD_FIELD_TYPE_CURRENCY', format: 'currency:USD' },
  {
    key: 'margin',
    label: 'Gross margin',
    type: 'RECORD_FIELD_TYPE_FORMULA',
    format: 'percent',
    description: '(value - delivery cost) / value; computed by the backend.',
  },
  { key: 'due_date', label: 'Due', type: 'RECORD_FIELD_TYPE_DATE' },
  {
    key: 'priority',
    label: 'Priority',
    type: 'RECORD_FIELD_TYPE_SINGLE_SELECT',
    choices: [
      { value: 'low', label: 'Low', color: 'neutral' },
      { value: 'normal', label: 'Normal', color: 'info' },
      { value: 'high', label: 'High', color: 'warn' },
      { value: 'urgent', label: 'Urgent', color: 'danger' },
    ],
    default_value: 'normal',
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'RECORD_FIELD_TYPE_MULTI_SELECT',
    allow_multiple: true,
    choices: [
      { value: 'onboarding', label: 'Onboarding' },
      { value: 'renewal', label: 'Renewal' },
      { value: 'implementation', label: 'Implementation' },
      { value: 'advisory', label: 'Advisory' },
    ],
  },
  { key: 'completed', label: 'Complete', type: 'RECORD_FIELD_TYPE_BOOLEAN' },
  {
    key: 'updated_at',
    label: 'Updated',
    type: 'RECORD_FIELD_TYPE_UPDATED_AT',
    format: 'datetime',
  },
]

const WORK_VIEWS = [
  {
    id: 'all_work',
    name: 'All work',
    type: 'RECORD_VIEW_TYPE_GRID',
    visible_fields: ['name', 'customer', 'stage', 'owner', 'value', 'margin', 'due_date', 'priority'],
    sorts: [{ field: 'due_date' }],
  },
  {
    id: 'active_board',
    name: 'Active delivery',
    type: 'RECORD_VIEW_TYPE_BOARD',
    visible_fields: ['customer', 'owner', 'value', 'due_date', 'priority'],
    group_by: 'stage',
    filters: [{ field: 'stage', operator: 'neq', value: 'done' }],
    sorts: [{ field: 'priority', descending: true }],
  },
  {
    id: 'delivery_calendar',
    name: 'Delivery calendar',
    type: 'RECORD_VIEW_TYPE_CALENDAR',
    visible_fields: ['name', 'customer', 'stage', 'owner'],
    date_field: 'due_date',
  },
  {
    id: 'high_value',
    name: 'High-value work',
    type: 'RECORD_VIEW_TYPE_LIST',
    visible_fields: ['name', 'customer', 'stage', 'value', 'margin'],
    filters: [{ field: 'value', operator: 'gte', value: 30000 }],
    sorts: [{ field: 'value', descending: true }],
  },
  {
    id: 'intake',
    name: 'New work intake',
    type: 'RECORD_VIEW_TYPE_FORM',
    visible_fields: ['name', 'customer', 'stage', 'owner', 'value', 'cost', 'due_date', 'priority', 'tags'],
  },
]

const WORK_RECORDS = [
  {
    id: 'work-101',
    revision: '3',
    created_at: '2026-07-02T16:10:00Z',
    updated_at: '2026-07-16T14:45:00Z',
    context: { customer_id: 'customer-northstar' },
    values: {
      name: 'Northstar onboarding',
      customer: { id: 'customer-northstar', label: 'Northstar Foods' },
      stage: 'delivery',
      owner: 'mina',
      value: 48000,
      cost: 30500,
      due_date: '2026-07-18',
      priority: 'high',
      tags: ['onboarding', 'implementation'],
      completed: false,
    },
  },
  {
    id: 'work-102',
    revision: '6',
    created_at: '2026-06-12T10:00:00Z',
    updated_at: '2026-07-16T12:20:00Z',
    context: { customer_id: 'customer-harbor' },
    values: {
      name: 'Harbor annual renewal',
      customer: { id: 'customer-harbor', label: 'Harbor & Co.' },
      stage: 'review',
      owner: 'jules',
      value: 36000,
      cost: 11200,
      due_date: '2026-07-21',
      priority: 'urgent',
      tags: ['renewal'],
      completed: false,
    },
  },
  {
    id: 'work-103',
    revision: '2',
    created_at: '2026-07-11T09:30:00Z',
    updated_at: '2026-07-15T17:40:00Z',
    context: { customer_id: 'customer-beacon' },
    values: {
      name: 'Beacon inventory rollout',
      customer: { id: 'customer-beacon', label: 'Beacon Retail' },
      stage: 'pipeline',
      owner: 'noah',
      value: 72000,
      cost: 46000,
      due_date: '2026-08-04',
      priority: 'high',
      tags: ['implementation'],
      completed: false,
    },
  },
  {
    id: 'work-104',
    revision: '8',
    created_at: '2026-05-20T13:15:00Z',
    updated_at: '2026-07-15T20:05:00Z',
    context: { customer_id: 'customer-alder' },
    values: {
      name: 'Alder website launch',
      customer: { id: 'customer-alder', label: 'Alder Studio' },
      stage: 'done',
      owner: 'mina',
      value: 19000,
      cost: 9800,
      due_date: '2026-07-15',
      priority: 'normal',
      tags: ['implementation'],
      completed: true,
    },
  },
  {
    id: 'work-105',
    revision: '4',
    created_at: '2026-06-28T11:45:00Z',
    updated_at: '2026-07-16T15:10:00Z',
    context: { customer_id: 'customer-summit' },
    values: {
      name: 'Summit process audit',
      customer: { id: 'customer-summit', label: 'Summit Works' },
      stage: 'blocked',
      owner: 'jules',
      value: 28500,
      cost: 17400,
      due_date: '2026-07-20',
      priority: 'urgent',
      tags: ['advisory'],
      completed: false,
    },
  },
  {
    id: 'work-106',
    revision: '2',
    created_at: '2026-07-05T08:20:00Z',
    updated_at: '2026-07-14T16:30:00Z',
    context: { customer_id: 'customer-coral' },
    values: {
      name: 'Coral support retainer',
      customer: { id: 'customer-coral', label: 'Coral Health' },
      stage: 'delivery',
      owner: 'noah',
      value: 24000,
      cost: 13200,
      due_date: '2026-07-24',
      priority: 'normal',
      tags: ['renewal'],
      completed: false,
    },
  },
  {
    id: 'work-107',
    revision: '1',
    created_at: '2026-07-15T12:05:00Z',
    updated_at: '2026-07-15T12:05:00Z',
    context: { customer_id: 'customer-juniper' },
    values: {
      name: 'Juniper operations proposal',
      customer: { id: 'customer-juniper', label: 'Juniper Supply' },
      stage: 'pipeline',
      owner: 'unassigned',
      value: 54000,
      cost: 34000,
      due_date: '2026-07-30',
      priority: 'high',
      tags: ['advisory'],
      completed: false,
    },
  },
  {
    id: 'work-108',
    revision: '5',
    created_at: '2026-06-20T14:40:00Z',
    updated_at: '2026-07-16T09:10:00Z',
    context: { customer_id: 'customer-forge' },
    values: {
      name: 'Forge systems migration',
      customer: { id: 'customer-forge', label: 'Forge Fabrication' },
      stage: 'review',
      owner: 'mina',
      value: 64000,
      cost: 41800,
      due_date: '2026-07-27',
      priority: 'high',
      tags: ['implementation'],
      completed: false,
    },
  },
]

function materializeWorkRecord(record) {
  const value = Number(record.values.value)
  const cost = Number(record.values.cost)
  const margin = Number.isFinite(value) && value !== 0 && Number.isFinite(cost)
    ? round((value - cost) / value, 4)
    : null
  return {
    ...record,
    values: {
      ...record.values,
      margin,
      updated_at: record.updated_at,
    },
  }
}

function getBusinessRecords(params) {
  const tableId = params.table_id ?? 'work_items'
  return {
    records: {
      workspace_id: 'business-ops',
      table_id: tableId,
      table_name: tableId === 'work_items' ? 'Work items' : tableId,
      primary_field: 'name',
      fields: WORK_FIELDS,
      records: tableId === 'work_items' ? WORK_RECORDS.map(materializeWorkRecord) : [],
      views: WORK_VIEWS,
      active_view_id: 'all_work',
      total: tableId === 'work_items' ? String(WORK_RECORDS.length) : '0',
      capabilities: {
        create: tableId === 'work_items',
        update: tableId === 'work_items',
        delete: tableId === 'work_items',
        create_action_id: 'record_create',
        update_action_id: 'record_update',
        delete_action_id: 'record_delete',
      },
    },
  }
}

function getWorkspaceConversation(params) {
  const conversationId = params.conversation_id ?? 'launch-room'
  return {
    conversation: {
      id: conversationId,
      title: conversationId === 'launch-room' ? '# launch-room' : conversationId,
      subtitle: 'Launch coordination · reference source',
      viewer_id: 'jun',
      unread_count: 2,
      participants: [
        { id: 'jun', name: 'Jun', role: 'owner', status: 'online' },
        { id: 'maya', name: 'Maya Chen', role: 'operations', status: 'online' },
        { id: 'lina', name: 'Lina Torres', role: 'customer success', status: 'away' },
      ],
      messages: [
        {
          id: 'reference-message-1',
          timestamp: '2026-07-18T16:02:00Z',
          sender_id: 'maya',
          body: 'The operating brief and open decisions are ready for review.',
          attachments: [{
            id: 'reference-brief',
            name: 'Launch operating brief.pdf',
            kind: 'file',
            url: '/files/launch-operating-brief.pdf',
            content_type: 'application/pdf',
            size_bytes: 2480000,
          }],
          reactions: [{ key: 'check', label: '✅', count: 3, viewer_reacted: true }],
          thread_reply_count: 1,
          context: { workstream: 'launch' },
        },
        {
          id: 'reference-message-2',
          timestamp: '2026-07-18T16:08:00Z',
          sender_id: 'jun',
          body: 'I’ll assign the remaining owner before the review.',
          status: 'read',
        },
        {
          id: 'reference-message-1-reply-1',
          timestamp: '2026-07-18T16:09:00Z',
          sender_id: 'lina',
          reply_to_id: 'reference-message-1',
          body: 'Customer communications are approved and staged.',
        },
      ],
      context: {
        workspace_id: 'jim-technologies',
        conversation_id: conversationId,
      },
    },
  }
}

const HANDLERS = {
  platform_assets:     () => getPlatformAssets(),
  platform_object:     p => getPlatformObject(p),
  platform_lineage:    p => getPlatformLineage(p),
  platform_repository: p => getPlatformRepository(p),
  business_records:    p => getBusinessRecords(p),
  workspace_conversation: p => getWorkspaceConversation(p),
  btc_spot:      () => getBtcSpot(),
  btc_candles:   p => getBtcCandles(parseInt(p.limit ?? '60', 10)),
  btc_orderbook: () => getBtcOrderbook(),
  btc_options:   () => getBtcOptions(),
  fills:         () => getFillsSnapshot(),
  news:          p => getNews(p.symbol ?? 'BTCUSD'),
  nba_spread:    () => getNbaSpread(),
  bankroll:      () => getBankroll(),
  files:         p => ({
    table: listFiles(
      p.namespace ?? 'demo',
      p.path ?? '',
      p.page ?? '1',
      p.page_size ?? '50',
    ),
  }),
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

function recordAction(req, initialStatus = 'ACTION_STATUS_ACCEPTED') {
  const existing = req.client_request_id && actions.get(req.client_request_id)
  if (existing) return existing // idempotent: same client_request_id returns the original
  const id = `ord-${Math.random().toString(36).slice(2, 10)}`
  const entry = {
    id,
    action_id: req.action_id,
    client_request_id: req.client_request_id ?? '',
    // Only asynchronous order progress needs the original params. Do not
    // retain large synchronous payloads such as base64 file uploads in the
    // bounded lifecycle ring.
    params: req.action_id === 'place_order' ? (req.params ?? {}) : {},
    progress_scheduled: false,
    history: [{ status: initialStatus, timestamp: new Date().toISOString(), sequence: 0 }],
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

function actionResponse(entry, fallbackMessage) {
  const first = entry.history[0]
  return {
    id: entry.id,
    status: first.status,
    message: first.message ?? fallbackMessage,
    data: first.data,
  }
}

function finishSynchronousAction(req, status, message, data) {
  const existing = req.client_request_id && actions.get(req.client_request_id)
  if (existing) return existing
  const entry = recordAction(req, status)
  entry.history[0].message = message
  if (data !== undefined) entry.history[0].data = data
  return entry
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const EDITABLE_WORK_FIELDS = new Set(
  WORK_FIELDS
    .filter(field => ![
      'RECORD_FIELD_TYPE_FORMULA',
      'RECORD_FIELD_TYPE_LOOKUP',
      'RECORD_FIELD_TYPE_ROLLUP',
      'RECORD_FIELD_TYPE_CREATED_AT',
      'RECORD_FIELD_TYPE_UPDATED_AT',
    ].includes(field.type))
    .map(field => field.key),
)

function validateWorkValues(values, partial) {
  if (!isPlainObject(values)) return { error: 'values must be an object' }
  const unknown = Object.keys(values).filter(key => !EDITABLE_WORK_FIELDS.has(key))
  if (unknown.length > 0) {
    return { error: `unknown or read-only field${unknown.length === 1 ? '' : 's'}: ${unknown.join(', ')}` }
  }
  const cleaned = Object.fromEntries(Object.entries(values))
  if (typeof cleaned.customer === 'string') {
    const customerField = WORK_FIELDS.find(field => field.key === 'customer')
    const choice = customerField?.choices?.find(candidate => candidate.value === cleaned.customer)
    cleaned.customer = choice
      ? { id: choice.value, label: choice.label }
      : { id: cleaned.customer, label: cleaned.customer }
  }
  if (!partial) {
    for (const field of WORK_FIELDS) {
      if (cleaned[field.key] == null && field.default_value !== undefined) {
        cleaned[field.key] = field.default_value
      }
    }
  }
  return { values: cleaned }
}

function requiredWorkFieldError(values) {
  for (const field of WORK_FIELDS) {
    if (!field.required) continue
    const value = values[field.key]
    if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
      return `${field.label} is required`
    }
  }
  return null
}

function contextFromWorkValues(values) {
  const customer = values.customer
  if (isPlainObject(customer) && customer.id != null) {
    return { customer_id: String(customer.id) }
  }
  return {}
}

let nextWorkRecord = 1000

function handleRecordMutation(req) {
  const existing = req.client_request_id && actions.get(req.client_request_id)
  if (existing) return existing

  const params = isPlainObject(req.params) ? req.params : {}
  if (params.workspace_id !== 'business-ops' || params.table_id !== 'work_items') {
    return finishSynchronousAction(
      req,
      'ACTION_STATUS_REJECTED',
      'Unknown or unauthorized workspace/table',
    )
  }

  if (req.action_id === 'record_create') {
    const validated = validateWorkValues(params.values, false)
    if (validated.error) {
      return finishSynchronousAction(req, 'ACTION_STATUS_REJECTED', validated.error)
    }
    const requiredError = requiredWorkFieldError(validated.values)
    if (requiredError) {
      return finishSynchronousAction(req, 'ACTION_STATUS_REJECTED', requiredError)
    }
    const now = new Date().toISOString()
    const id = `work-${Date.now().toString(36)}-${(++nextWorkRecord).toString(36)}`
    const record = {
      id,
      revision: '1',
      created_at: now,
      updated_at: now,
      context: contextFromWorkValues(validated.values),
      values: validated.values,
    }
    WORK_RECORDS.push(record)
    return finishSynchronousAction(
      req,
      'ACTION_STATUS_OK',
      `${validated.values.name} created`,
      { record_id: id, revision: record.revision },
    )
  }

  const recordId = String(params.record_id ?? '')
  const index = WORK_RECORDS.findIndex(record => record.id === recordId)
  if (index < 0) {
    return finishSynchronousAction(req, 'ACTION_STATUS_REJECTED', `Record not found: ${recordId}`)
  }
  const current = WORK_RECORDS[index]
  if (!params.revision || String(params.revision) !== current.revision) {
    return finishSynchronousAction(
      req,
      'ACTION_STATUS_REJECTED',
      `Revision conflict for ${recordId}; refresh and retry`,
      { record_id: recordId, current_revision: current.revision },
    )
  }

  if (req.action_id === 'record_delete') {
    WORK_RECORDS.splice(index, 1)
    return finishSynchronousAction(
      req,
      'ACTION_STATUS_OK',
      `${current.values.name ?? recordId} deleted`,
      { record_id: recordId, revision: current.revision },
    )
  }

  const validated = validateWorkValues(params.values, true)
  if (validated.error) {
    return finishSynchronousAction(req, 'ACTION_STATUS_REJECTED', validated.error)
  }
  if (Object.keys(validated.values).length === 0) {
    return finishSynchronousAction(req, 'ACTION_STATUS_REJECTED', 'No record changes supplied')
  }
  const nextValues = { ...current.values, ...validated.values }
  const requiredError = requiredWorkFieldError(nextValues)
  if (requiredError) {
    return finishSynchronousAction(req, 'ACTION_STATUS_REJECTED', requiredError)
  }
  const revision = String(Number(current.revision) + 1)
  const updated = {
    ...current,
    revision,
    updated_at: new Date().toISOString(),
    context: contextFromWorkValues(nextValues),
    values: nextValues,
  }
  WORK_RECORDS[index] = updated
  return finishSynchronousAction(
    req,
    'ACTION_STATUS_OK',
    `${nextValues.name ?? recordId} updated`,
    { record_id: recordId, revision },
  )
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

  const requestUrl = new URL(req.url || '/', 'http://localhost')
  const path = requestUrl.pathname

  // Bodyless routes — handled before body capture so a large GET (e.g.
  // a partial-content video range) doesn't trip the byte cap.
  if ((req.method === 'GET' || req.method === 'HEAD') &&
      (path === '/media' || path.startsWith('/media/'))) {
    return handleMedia(req, res, requestUrl)
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
  if (['record_create', 'record_update', 'record_delete'].includes(req.action_id)) {
    const entry = handleRecordMutation(req)
    return json(res, actionResponse(entry, `${req.action_id} completed`))
  }
  // File upload is stateless from a lifecycle perspective — synchronous
  // OK/FAILED, no watch stream needed. Keep only its compact result in the
  // action ring so retries with the same client_request_id are idempotent;
  // recordAction deliberately does not retain the base64 params.
  if (req.action_id === 'upload') {
    const existing = req.client_request_id && actions.get(req.client_request_id)
    if (existing) return json(res, actionResponse(existing, 'Upload completed'))
    const r = handleFileUpload(req)
    if (!r.ok) {
      const entry = finishSynchronousAction(req, 'ACTION_STATUS_FAILED', r.message)
      return json(res, actionResponse(entry, r.message))
    }
    const entry = finishSynchronousAction(
      req,
      'ACTION_STATUS_OK',
      `Uploaded ${r.size_bytes} bytes → ${r.path}`,
      { path: r.path, size_bytes: r.size_bytes },
    )
    // The file path is the useful backend identity for this action.
    entry.id = r.path
    return json(res, actionResponse(entry, 'Upload completed'))
  }
  const isOrder = req.action_id === 'place_order'
  const entry = recordAction(
    req,
    isOrder ? 'ACTION_STATUS_ACCEPTED' : 'ACTION_STATUS_OK',
  )
  if (!entry.history[0].message) {
    entry.history[0].message = isOrder ? 'Order accepted' : `${entry.action_id} completed`
  }
  if (isOrder && !entry.progress_scheduled) {
    entry.progress_scheduled = true
    scheduleOrderProgress(entry)
  }
  json(res, actionResponse(entry, isOrder ? 'Order accepted' : `${entry.action_id} completed`))
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
// underscore as the `=` replacement, since repository-friendly paths
// can't use `=`). Uploaded files dropped at the root are
// auto-partitioned by content type (`type__video/`, `type__image/`,
// `type__data/`, ...). Uploads into a subfolder are respected as-is
// so users can build their own taxonomy on top.
//
// `/media?namespace={namespace}&path={path}` serves bytes with Range
// support, which is what lets the file_browser preview overlay's
// <video> element seek to arbitrary positions in large uploads.
// =============================================================

const fileStore = new Map() // namespace -> Map<path, { name, path, contentType, bytes, modifiedAt }>

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

function normalizePath(value) {
  return String(value ?? '').replace(/^\/+|\/+$/g, '').replace(/\/{2,}/g, '/')
}

function joinPath(dir, name) {
  const left = normalizePath(dir)
  const right = normalizePath(name)
  if (!left) return right
  if (!right) return left
  return `${left}/${right}`
}

function parentPath(path) {
  const normalized = normalizePath(path)
  const slash = normalized.lastIndexOf('/')
  return slash < 0 ? '' : normalized.slice(0, slash)
}

function seedFile(namespace, path, contentType, bytes) {
  const normalized = normalizePath(path)
  getNamespace(namespace).set(normalized, {
    name: normalized.split('/').pop(),
    path: normalized,
    contentType,
    bytes: Buffer.isBuffer(bytes) ? bytes : Buffer.from(bytes),
    modifiedAt: new Date().toISOString(),
  })
  return normalized
}

// Initial fixtures so the file_browser shows something before the
// user uploads anything. All seeded paths use the hive convention.
seedFile('demo', 'type__doc/README.md', 'text/markdown',
  '# Medallion file_browser demo\n\n' +
  'Open a folder and drag files into it, or use Upload to choose a destination.\n' +
  'Paths inside a subfolder are preserved exactly as selected.\n\n' +
  'Drop a video and scrub the preview — the backend serves `Range:` requests,\n' +
  'so seek works without downloading the whole file.\n')
seedFile('demo', 'type__data/tickers.json', 'application/json',
  JSON.stringify({ symbols: ['BTC', 'ETH', 'SOL'], updated: new Date().toISOString() }, null, 2))

// listFiles returns immediate children of `path` (folders and files).
// Pairs with the file_browser widget's expected shape.
function listFiles(namespace, path, page = '1', pageSize = '50') {
  const ns = getNamespace(namespace)
  const normalizedPath = normalizePath(path)
  const prefix = normalizedPath ? normalizedPath + '/' : ''
  const folders = new Set()
  const files = []
  for (const [, f] of ns) {
    if (!f.path.startsWith(prefix)) continue
    const rest = f.path.slice(prefix.length)
    const slash = rest.indexOf('/')
    if (slash >= 0) {
      folders.add(rest.slice(0, slash))
    } else if (rest) {
      files.push({
        kind: 'file',
        name: f.name,
        size_bytes: f.bytes.length,
        content_type: f.contentType,
        modified_at: f.modifiedAt,
      })
    }
  }
  const folderEntries = [...folders].sort().map(name => ({ kind: 'folder', name }))
  files.sort((a, b) => a.name.localeCompare(b.name))
  const entries = [...folderEntries, ...files]
  const requestedPage = Number.parseInt(String(page), 10)
  const requestedPageSize = Number.parseInt(String(pageSize), 10)
  const safePage = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1
  const safePageSize = Number.isFinite(requestedPageSize)
    ? Math.max(1, Math.min(500, requestedPageSize))
    : 50
  const start = (safePage - 1) * safePageSize
  return { rows: entries.slice(start, start + safePageSize) }
}

function handleFileUpload(req) {
  const params = req.params ?? {}
  const namespace = String(params.namespace ?? params.org ?? params.bucket ?? 'demo')
  const repo = normalizePath(params.repo ?? '')
  const rawPath = normalizePath(params.path ?? '')
  if (!rawPath) return { ok: false, message: 'path is required' }
  const contentType = String(params.content_type ?? 'application/octet-stream')
  const dataB64 = String(params.data_b64 ?? '')
  const bytes = dataB64 ? Buffer.from(dataB64, 'base64') : Buffer.alloc(0)
  const finalPath = repo ? joinPath(repo, rawPath) : hivePartition(rawPath, contentType)
  getNamespace(namespace).set(finalPath, {
    name: finalPath.split('/').pop(),
    path: finalPath,
    contentType,
    bytes,
    modifiedAt: new Date().toISOString(),
  })
  return { ok: true, path: finalPath, size_bytes: bytes.length }
}

// GET / HEAD /media?namespace={namespace}&path={path}
//
// Range handling matters: <video> elements send `Range: bytes=N-` when
// the user scrubs. Without 206 responses, scrub would either re-download
// from byte 0 (slow) or simply not work (some browsers refuse). For
// open-ended `bytes=N-` we serve from N to EOF; for suffix `bytes=-N`
// we serve the last N bytes. Legacy /media/{namespace}/{path} remains
// accepted for old bookmarks, but query form avoids slash ambiguity.
function handleMedia(req, res, requestUrl) {
  const parts = requestUrl.pathname.split('/').filter(Boolean)
  const namespace = requestUrl.searchParams.get('namespace')
    ?? requestUrl.searchParams.get('org')
    ?? (parts[1] ? decodeURIComponent(parts[1]) : '')
  const filePath = normalizePath(
    requestUrl.searchParams.get('path')
      ?? (parts.length > 2 ? parts.slice(2).map(decodeURIComponent).join('/') : ''),
  )
  if (!namespace || !filePath) {
    return notFound(res, 'expected /media?namespace=<bucket>&path=<file>')
  }
  const file = getNamespace(namespace).get(filePath)
  if (!file) return notFound(res, `no file ${filePath} in ${namespace}`)

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
  const namespace = String(req.namespace ?? req.org ?? req.bucket ?? req.params?.namespace ?? 'demo')
  const filePath = normalizePath(req.path ?? req.params?.path ?? '')
  res.writeHead(200, {
    'Content-Type': 'application/connect+json',
    'Access-Control-Allow-Origin': '*',
  })
  const file = getNamespace(namespace).get(filePath)
  if (!file) {
    res.write(errorTrailer('not_found', `no file ${filePath} in ${namespace}`))
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
