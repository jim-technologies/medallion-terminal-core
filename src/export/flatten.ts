// flatten — collapse any canonical widget payload into a single
// tabular { columns, rows } shape so it can be serialized to a
// BI-standard format (CSV / Parquet / JSON).
//
// BI tools (Power BI, Looker Studio, Superset, Grafana) consume flat,
// columnar tables — not the rich nested shapes the terminal renders.
// This is the one place that knows how to project each shape down to
// rows. Widgets keep their convention-over-configuration data; export
// gets a predictable rectangle.
//
// Every canonical shape from shapes.proto is handled. An unrecognized
// shape falls back to a best-effort: an array becomes rows, an object
// becomes a single key/value row set. Nothing throws — export is a
// user-facing convenience, not a contract boundary.

// A cell is any JSON scalar. Nested values are JSON-stringified so a
// flat table never contains objects (which CSV/Parquet can't represent).
export type Cell = string | number | boolean | null

export interface FlatTable {
  // Ordered column keys. Stable across rows (union of all row keys,
  // first-seen order) so serializers can emit a consistent header.
  columns: string[]
  rows: Record<string, Cell>[]
}

const EMPTY: FlatTable = { columns: [], rows: [] }

// Coerce one value to a flat cell. Scalars pass through; everything
// else (arrays, objects) is JSON-encoded so the table stays rectangular.
function cell(v: unknown): Cell {
  if (v == null) return null
  const t = typeof v
  if (t === 'number' || t === 'boolean' || t === 'string') return v as Cell
  try {
    return JSON.stringify(v)
  } catch {
    return String(v)
  }
}

// Build a FlatTable from an array of row-objects, computing the column
// union in first-seen order. Rows are coerced cell-by-cell.
function fromRowObjects(rows: Record<string, unknown>[]): FlatTable {
  const columns: string[] = []
  const seen = new Set<string>()
  for (const row of rows) {
    for (const k of Object.keys(row)) {
      if (!seen.has(k)) {
        seen.add(k)
        columns.push(k)
      }
    }
  }
  const flatRows = rows.map((row) => {
    const out: Record<string, Cell> = {}
    for (const k of columns) out[k] = cell(row[k])
    return out
  })
  return { columns, rows: flatRows }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

// --- per-shape projections ---

// timeseries: [{timestamp,value}] | {points} | {series:[{name,data|points}]}
// Multi-series pivots wide: one column per series, keyed by timestamp,
// so a BI tool gets a tidy time × series matrix.
function flattenTimeseries(data: unknown): FlatTable | null {
  const points = (d: unknown): { timestamp: unknown; value: unknown }[] | null => {
    if (Array.isArray(d)) return d as { timestamp: unknown; value: unknown }[]
    if (isObject(d) && Array.isArray(d.points)) {
      return d.points as { timestamp: unknown; value: unknown }[]
    }
    return null
  }

  if (isObject(data) && Array.isArray(data.series)) {
    const series = data.series as { name?: string; data?: unknown[]; points?: unknown[] }[]
    const byTs = new Map<string, Record<string, Cell>>()
    const names: string[] = []
    for (let i = 0; i < series.length; i++) {
      const s = series[i]
      const name = s.name ?? `series_${i + 1}`
      names.push(name)
      const pts = (s.points ?? s.data ?? []) as { timestamp?: unknown; value?: unknown }[]
      for (const p of pts) {
        const ts = String(p.timestamp ?? '')
        const row = byTs.get(ts) ?? { timestamp: ts }
        row[name] = cell(p.value)
        byTs.set(ts, row)
      }
    }
    return { columns: ['timestamp', ...names], rows: [...byTs.values()] }
  }

  const pts = points(data)
  if (pts) {
    return {
      columns: ['timestamp', 'value'],
      rows: pts.map((p) => ({ timestamp: cell(p.timestamp), value: cell(p.value) })),
    }
  }
  return null
}

// candlestick: {bars:[{timestamp,open,high,low,close,volume?}]}
function flattenCandles(data: unknown): FlatTable | null {
  if (isObject(data) && Array.isArray(data.bars)) {
    return fromRowObjects(data.bars as Record<string, unknown>[])
  }
  return null
}

// table: [{col:val}] | {columns:[{key,label?}], rows} | {columns:[str], rows:[[...]]}
function flattenTable(data: unknown): FlatTable | null {
  if (Array.isArray(data) && data.length > 0 && isObject(data[0])) {
    return fromRowObjects(data as Record<string, unknown>[])
  }
  if (isObject(data) && 'rows' in data) {
    const d = data as { columns?: unknown[]; rows: unknown[] }
    const rawCols = Array.isArray(d.columns) ? d.columns : []
    // Canonical TablePayload — column objects.
    if (rawCols.length > 0 && isObject(rawCols[0])) {
      const cols = rawCols as { key: string }[]
      const keys = cols.map((c) => c.key)
      const rows = (d.rows as unknown[]).map((row) =>
        Array.isArray(row)
          ? Object.fromEntries(keys.map((k, i) => [k, cell((row as unknown[])[i])]))
          : pickKeys(row as Record<string, unknown>, keys),
      )
      return { columns: keys, rows }
    }
    // Legacy positional — string columns + array rows.
    if (rawCols.length > 0 && typeof rawCols[0] === 'string') {
      const keys = rawCols as string[]
      const rows = (d.rows as unknown[]).map((row) =>
        Array.isArray(row)
          ? Object.fromEntries(keys.map((k, i) => [k, cell((row as unknown[])[i])]))
          : pickKeys(row as Record<string, unknown>, keys),
      )
      return { columns: keys, rows }
    }
    // Rows only.
    const rows = d.rows as unknown[]
    if (rows.length > 0 && isObject(rows[0])) {
      return fromRowObjects(rows as Record<string, unknown>[])
    }
    return EMPTY
  }
  return null
}

function pickKeys(row: Record<string, unknown>, keys: string[]): Record<string, Cell> {
  const out: Record<string, Cell> = {}
  for (const k of keys) out[k] = cell(row[k])
  return out
}

// heatmap: {cells:[{row,col,value,label?}]} → one row per cell.
function flattenHeatmap(data: unknown): FlatTable | null {
  if (isObject(data) && Array.isArray(data.cells)) {
    return fromRowObjects(data.cells as Record<string, unknown>[])
  }
  return null
}

// distribution: {slices:[{label,value}]}
function flattenDistribution(data: unknown): FlatTable | null {
  if (isObject(data) && Array.isArray(data.slices)) {
    return fromRowObjects(data.slices as Record<string, unknown>[])
  }
  return null
}

// events: {events:[{timestamp,label,status?}]}
function flattenEvents(data: unknown): FlatTable | null {
  if (isObject(data) && Array.isArray(data.events)) {
    return fromRowObjects(data.events as Record<string, unknown>[])
  }
  return null
}

// text: {items:[{title?,body?,...}]}
function flattenText(data: unknown): FlatTable | null {
  if (isObject(data) && Array.isArray(data.items)) {
    return fromRowObjects(data.items as Record<string, unknown>[])
  }
  return null
}

// orderbook: {bids:[{price,size}], asks:[...]} → tagged side column.
function flattenOrderbook(data: unknown): FlatTable | null {
  if (isObject(data) && (Array.isArray(data.bids) || Array.isArray(data.asks))) {
    const bids = (data.bids as Record<string, unknown>[] | undefined) ?? []
    const asks = (data.asks as Record<string, unknown>[] | undefined) ?? []
    const rows = [
      ...bids.map((b) => ({ side: 'bid', ...b })),
      ...asks.map((a) => ({ side: 'ask', ...a })),
    ]
    return fromRowObjects(rows)
  }
  return null
}

// metric: {value,delta?,unit?,label?} | number → single-row table.
function flattenMetric(data: unknown): FlatTable | null {
  if (typeof data === 'number') {
    return { columns: ['value'], rows: [{ value: data }] }
  }
  if (isObject(data) && 'value' in data && typeof data.value !== 'object') {
    return fromRowObjects([data])
  }
  return null
}

// gauge: {value,min?,max?,bands?} → single-row table (bands JSON-encoded).
function flattenGauge(data: unknown): FlatTable | null {
  if (isObject(data) && 'value' in data) {
    const { value, min, max } = data as Record<string, unknown>
    return fromRowObjects([{ value, min, max }])
  }
  return null
}

// A registry of shape name → projector, so callers that know the shape
// (e.g. a widget that knows its component maps to a Shape) can pick the
// right one directly and skip the sniff. The map mirrors the canonical
// widget/component names used in templates.
const PROJECTORS: Record<string, (d: unknown) => FlatTable | null> = {
  timeseries: flattenTimeseries,
  area_chart: flattenTimeseries,
  sparkline: flattenTimeseries,
  candlestick: flattenCandles,
  table: flattenTable,
  heatmap: flattenHeatmap,
  distribution: flattenDistribution,
  events: flattenEvents,
  tape: flattenEvents,
  action_log: flattenEvents,
  alert_log: flattenEvents,
  text: flattenText,
  ticker: flattenText,
  orderbook: flattenOrderbook,
  metric: flattenMetric,
  gauge: flattenGauge,
}

// Best-effort fallback when the shape is unknown: arrays of objects
// become rows; a plain object becomes a one-row table; arrays of
// scalars become a single "value" column; scalars become one cell.
function flattenUnknown(data: unknown): FlatTable {
  if (data == null) return EMPTY
  if (Array.isArray(data)) {
    if (data.length === 0) return EMPTY
    if (isObject(data[0])) return fromRowObjects(data as Record<string, unknown>[])
    return { columns: ['value'], rows: data.map((v) => ({ value: cell(v) })) }
  }
  if (isObject(data)) {
    // If it has a single array property, treat that as the rows.
    const arrayProp = Object.entries(data).find(([, v]) => Array.isArray(v))
    if (arrayProp && isObject((arrayProp[1] as unknown[])[0])) {
      return fromRowObjects(arrayProp[1] as Record<string, unknown>[])
    }
    return fromRowObjects([data])
  }
  return { columns: ['value'], rows: [{ value: cell(data) }] }
}

// Flatten a widget payload to a tabular table.
//
// `componentOrShape` is an optional hint (the widget's component name
// or a canonical shape name) that selects the exact projector. When
// omitted or unrecognized, every projector is tried in turn and the
// first that matches wins; if none match, the best-effort fallback runs.
export function flatten(data: unknown, componentOrShape?: string): FlatTable {
  if (data == null) return EMPTY

  if (componentOrShape) {
    const projector = PROJECTORS[componentOrShape]
    if (projector) {
      const out = projector(data)
      if (out) return out
    }
  }

  // Sniff: try each projector; first non-null match wins. Table is
  // tried last among array-shaped projectors via the explicit order
  // below so a bare array of objects is treated generically only if no
  // structured shape claims it.
  for (const projector of [
    flattenTimeseries,
    flattenCandles,
    flattenHeatmap,
    flattenDistribution,
    flattenEvents,
    flattenText,
    flattenOrderbook,
    flattenGauge,
    flattenMetric,
    flattenTable,
  ]) {
    const out = projector(data)
    if (out && out.rows.length > 0) return out
  }

  return flattenUnknown(data)
}
