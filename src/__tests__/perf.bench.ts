import { bench, describe } from 'vitest'
import { applyActions } from '../core/applyActions'
import { resolveSource, interpolate } from '../core/resolveSource'
import { readCtxFromUrl, writeCtxToUrl } from '../core/urlState'
import { parseConnectEnvelopes } from '../core/connectFraming'
import { evaluateAlert } from '../core/alerts'
import { getNested } from '../core/getNested'
import type { WidgetConfig } from '../types/template'
import type { WidgetAction } from '../core/DashboardContext'

// ---------------------------------------------------------------
// Hot-path benchmarks. Targets documented in PRD iteration 34.
// All five of these run on every dispatch / ctx change / fetch;
// if any drops below ~50% of target, treat as a regression.
// ---------------------------------------------------------------

// applyActions — simulated dashboard mutation: 100 widgets, 50 mixed actions.
// Target: ≥ 50,000 ops/sec
describe('applyActions', () => {
  const widgets: WidgetConfig[] = Array.from({ length: 100 }, (_, i) => ({
    id: `w${i}`, component: 'metric', title: `Widget ${i}`, span: 4,
  }))
  const actions: WidgetAction[] = [
    ...Array.from({ length: 25 }, (_, i) => ({ targetId: `w${i}`, title: `Updated ${i}` })),
    ...Array.from({ length: 15 }, (_, i) => ({ targetId: `new${i}`, component: 'gauge' })),
    ...Array.from({ length: 10 }, (_, i) => ({ targetId: `w${90 + i}`, remove: true })),
  ]

  bench('100 widgets + 50 mixed actions', () => {
    applyActions(widgets, actions)
  })

  bench('100 widgets + replaceAll 50 actions', () => {
    applyActions(widgets, actions, { replaceAll: true })
  })
})

// resolveSource — substitution + URL building over realistic ctx.
// Target: ≥ 500,000 ops/sec
describe('resolveSource', () => {
  const ctx = {
    symbol: 'BTC', range: '1d', from: '2026-04-01', to: '2026-05-01',
    venue: 'deribit', strategy: 'mom', confidence: '0.7', bot: 'alpha-1',
  }

  bench('source_id mode with backendUrl', () => {
    resolveSource(
      { source_id: 'ohlcv', params: { symbol: '${ctx.symbol}', range: '${ctx.range}' } },
      ctx,
      'https://api.example.com',
    )
  })

  bench('url mode with substitution + params', () => {
    resolveSource(
      { url: '/api/${ctx.symbol}/data', params: { from: '${ctx.from}', to: '${ctx.to}' } },
      ctx,
    )
  })

  bench('interpolate (single token)', () => {
    interpolate('symbol=${ctx.symbol}&range=${ctx.range}', ctx)
  })
})

// urlState — every ctx mutation triggers a write; URL load triggers a read.
// Target: ≥ 200,000 ops/sec
describe('urlState', () => {
  const ctx = {
    symbol: 'BTC', range: '1d', from: '2026-04-01',
    to: '2026-05-01', venue: 'deribit', strategy: 'mom',
  }
  const search = '?template=demo.json&ctx.symbol=BTC&ctx.range=1d&ctx.from=2026-04-01&ctx.to=2026-05-01&ctx.venue=deribit&ctx.strategy=mom'

  bench('readCtxFromUrl', () => {
    readCtxFromUrl(search)
  })

  bench('writeCtxToUrl', () => {
    writeCtxToUrl(search, ctx)
  })
})

// Normalizers — re-run when payload identity changes (live updates,
// streaming ticks). The most expensive normalizers are timeseries
// (multi-series merge) and histogram (binning).
// Targets: ≥ 5,000 ops/sec each.
describe('normalizers', () => {
  const tsPoints = Array.from({ length: 1000 }, (_, i) => ({
    timestamp: `2026-04-01T${String(i % 24).padStart(2, '0')}:00:00Z`,
    BTC: 67000 + Math.sin(i / 30) * 2000,
    ETH: 3400 + Math.cos(i / 30) * 200,
    SOL: 168 + Math.sin(i / 40) * 8,
  }))

  // Inline the timeseries normalize logic so we don't pull in React types
  // from the widget file. Same shape; benchmarks the equivalent work.
  const TS_KEYS = ['timestamp', 'date', 'time', 'datetime', 'ts', 'x', 't']
  function normalizeTs(data: unknown) {
    if (!Array.isArray(data) || data.length === 0) return null
    const sample = data[0] as Record<string, unknown>
    const tsKey = TS_KEYS.find(k => k in sample)
    if (!tsKey) return null
    const numericKeys = Object.keys(sample).filter(
      k => k !== tsKey && typeof sample[k] === 'number'
    )
    return data.map(item => {
      const row = item as Record<string, unknown>
      const entry: Record<string, unknown> = { _ts: row[tsKey] }
      for (const k of numericKeys) entry[k] = row[k]
      return entry
    })
  }

  bench('timeseries normalize (1k points × 3 series)', () => {
    normalizeTs(tsPoints)
  })

  // Histogram binning: 10k samples → 20 bins.
  const samples = Array.from({ length: 10000 }, () => Math.random() * 100 - 50)
  function binValues(values: number[], n: number) {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const step = (max - min) / n
    const buckets = Array.from({ length: n }, () => 0)
    for (const v of values) {
      let idx = Math.floor((v - min) / step)
      if (idx >= n) idx = n - 1
      buckets[idx] += 1
    }
    return buckets
  }

  bench('histogram bin (10k values → 20 bins)', () => {
    binValues(samples, 20)
  })
})

// parseConnectEnvelopes — the hot path for any streaming widget.
// At firehose rates (1k+ msg/s) the buffer-concat strategy could dominate;
// this bench quantifies the cost so regressions show up.
describe('parseConnectEnvelopes', () => {
  function frame(obj: unknown): Uint8Array {
    const payload = new TextEncoder().encode(JSON.stringify(obj))
    const buf = new Uint8Array(5 + payload.length)
    buf[0] = 0
    new DataView(buf.buffer).setUint32(1, payload.length)
    buf.set(payload, 5)
    return buf
  }

  // Build a single concatenated buffer of N pre-encoded frames.
  function buildBatch(n: number): Uint8Array {
    const frames = Array.from({ length: n }, (_, i) =>
      frame({ metric: { value: 67000 + i * 0.1, delta: 0.001, unit: 'USD' } }),
    )
    const total = frames.reduce((acc, f) => acc + f.length, 0)
    const out = new Uint8Array(total)
    let offset = 0
    for (const f of frames) { out.set(f, offset); offset += f.length }
    return out
  }

  function makeReader(chunks: Uint8Array[]): ReadableStreamDefaultReader<Uint8Array> {
    let i = 0
    return {
      read: async () => i < chunks.length
        ? { done: false, value: chunks[i++] }
        : { done: true, value: undefined },
      releaseLock: () => {},
      cancel: async () => {},
      closed: Promise.resolve(undefined),
    } as unknown as ReadableStreamDefaultReader<Uint8Array>
  }

  // Whole batch in one read — best case (no buffer growth pain).
  const batchOne = buildBatch(10_000)
  bench('10k frames in one chunk', async () => {
    let count = 0
    await parseConnectEnvelopes(makeReader([batchOne]), {
      onMessage: () => { count++ },
      isDisposed: () => false,
    })
    if (count !== 10_000) throw new Error(`expected 10k, got ${count}`)
  })

  // Many small chunks — worst case for the buffer-concat strategy.
  // Splits the same payload into 256-byte slices, simulating a slow
  // network where each `read()` returns a partial envelope.
  const SLICE = 256
  const chunks = Array.from(
    { length: Math.ceil(batchOne.length / SLICE) },
    (_, i) => batchOne.slice(i * SLICE, (i + 1) * SLICE),
  )
  bench('10k frames across 256-byte chunks', async () => {
    let count = 0
    await parseConnectEnvelopes(makeReader(chunks), {
      onMessage: () => { count++ },
      isDisposed: () => false,
    })
    if (count !== 10_000) throw new Error(`expected 10k, got ${count}`)
  })
})

// getNested — runs on every alert eval, transform, and odds-path
// resolve. Bench depth + array indexing since those paths are common
// in real payloads (paired_grid `rows.N.left.values.X`).
describe('getNested', () => {
  const flat = { value: 67_842, delta: 0.0036, unit: 'USD' }
  bench('flat 1-level path', () => { getNested(flat, 'value') })

  const deep = { metric: { telemetry: { sample: { value: 42 } } } }
  bench('deep 4-level path', () => { getNested(deep, 'metric.telemetry.sample.value') })

  const pairedGrid = {
    rows: Array.from({ length: 12 }, (_, i) => ({
      key: i * 1000,
      left: { values: { iv: 0.5 + i * 0.02, delta: 0.5 + i * 0.05, bid: i * 100, ask: i * 100 + 50 } },
      right: { values: { iv: 0.5 + i * 0.02, delta: -0.5 + i * 0.05, bid: i * 90, ask: i * 90 + 50 } },
    })),
  }
  bench('paired_grid array-indexed path (rows.6.left.values.iv)', () => {
    getNested(pairedGrid, 'rows.6.left.values.iv')
  })
})

// evaluateAlert — fires on every data update for any widget with an
// alert configured. With 20 widgets × 1k msg/sec firehose, this is
// 20k evals/sec. Each eval also runs getNested, so the combined
// cost matters.
describe('evaluateAlert', () => {
  const metricData = { value: 67_842, delta: 0.0036, unit: 'USD' }

  bench('numeric > on flat path (typical metric alert)', () => {
    evaluateAlert(metricData, 'value > 67000')
  })

  const eventData = { events: [{ status: 'EVENT_STATUS_OK' }] }
  bench('string == on nested path (event status alert)', () => {
    evaluateAlert(eventData, 'events.0.status == "EVENT_STATUS_ERROR"')
  })

  const grid = {
    rows: Array.from({ length: 20 }, (_, i) => ({
      key: i * 5000,
      left: { values: { iv: 0.4 + i * 0.03, delta: 0.5 - i * 0.02 } },
      right: { values: { iv: 0.4 + i * 0.03, delta: -0.5 + i * 0.02 } },
    })),
  }
  bench('paired_grid alert (rows.10.left.values.iv > 0.7)', () => {
    evaluateAlert(grid, 'rows.10.left.values.iv > 0.7')
  })

  // Worst case: 20 alerts evaluated against the same payload (one
  // dashboard tick fanning out to every alerting widget).
  const alerts = [
    'value > 60000', 'value > 65000', 'value > 67000', 'value > 67500',
    'value > 68000', 'value > 68500', 'value > 69000', 'value > 69500',
    'value > 70000', 'value > 70500', 'delta > 0', 'delta < 0',
    'delta > 0.01', 'delta > 0.02', 'unit == "USD"', 'unit != "BTC"',
    'value < 100000', 'value > 0', 'value >= 67842', 'value <= 67842',
  ]
  bench('20 alerts × 1 metric payload (per-tick fan-out)', () => {
    for (const a of alerts) evaluateAlert(metricData, a)
  })
})
