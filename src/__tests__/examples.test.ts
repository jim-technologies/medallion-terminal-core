import { describe, it, expect } from 'vitest'
import cryptoWatch from '../../public/examples/crypto-watch.json'
import tradingFloor from '../../public/examples/trading-floor.json'
import predictionMarket from '../../public/examples/prediction-market.json'
import botOperator from '../../public/examples/bot-operator.json'
import optionsDesk from '../../public/examples/options-desk.json'
import binanceClone from '../../public/examples/binance-clone.json'
import uniswapClone from '../../public/examples/uniswap-clone.json'
import grafanaOps from '../../public/examples/grafana-ops.json'
import workflowOrchestrator from '../../public/examples/workflow-orchestrator.json'
import sportsBetting from '../../public/examples/sports-betting.json'
import mlMonitoring from '../../public/examples/ml-monitoring.json'
import logisticsOps from '../../public/examples/logistics-ops.json'
import clinicalIcu from '../../public/examples/clinical-icu.json'
import energyGrid from '../../public/examples/energy-grid.json'
import medallionTerminal from '../../public/examples/medallion-terminal.json'
import fileBrowser from '../../public/examples/file-browser.json'

// =============================================================
// Contract validation — loads every public/examples/*.json and
// asserts that each widget's inline payload conforms to the
// shape its component expects.
//
// Acts as the TS-side mirror of the proto contract (shapes.proto).
// If you add a new example or a new shape, extend the validators
// below — the test will then refuse silently-broken fixtures.
// =============================================================

type Json = unknown

const EXAMPLES: Record<string, Json> = {
  'crypto-watch':       cryptoWatch,
  'trading-floor':      tradingFloor,
  'prediction-market':  predictionMarket,
  'bot-operator':       botOperator,
  'options-desk':       optionsDesk,
  'binance-clone':      binanceClone,
  'uniswap-clone':      uniswapClone,
  'grafana-ops':            grafanaOps,
  'workflow-orchestrator':  workflowOrchestrator,
  'sports-betting':         sportsBetting,
  'ml-monitoring':          mlMonitoring,
  'logistics-ops':          logisticsOps,
  'clinical-icu':           clinicalIcu,
  'energy-grid':            energyGrid,
  'medallion-terminal':     medallionTerminal,
  'file-browser':           fileBrowser,
}

// ----- Type guards -----

const isObj = (v: Json): v is Record<string, Json> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)
const isArr = (v: Json): v is Json[] => Array.isArray(v)
const isNum = (v: Json): v is number => typeof v === 'number' && Number.isFinite(v)
const isStr = (v: Json): v is string => typeof v === 'string'

// ----- Per-shape validators (one per DataResponse oneof case) -----
//
// Each takes the inline payload and returns a list of errors.
// Empty list = valid.

function validateTimeseries(p: Json): string[] {
  const errs: string[] = []
  if (isArr(p)) {
    if (p.length === 0) return errs
    const first = p[0]
    if (!isObj(first)) return ['array entries must be objects']
    const tsKey = ['timestamp', 'date', 'time', 'datetime', 'ts', 'x', 't'].find(k => k in first)
    if (!tsKey) errs.push('rows missing a recognized timestamp key')
    const numericKeys = Object.keys(first).filter(k => k !== tsKey && isNum(first[k]))
    if (numericKeys.length === 0) errs.push('rows missing any numeric value')
    return errs
  }
  if (isObj(p)) {
    if (isArr(p.points)) {
      for (const pt of p.points) {
        if (!isObj(pt) || !isStr(pt.timestamp) || !isNum(pt.value)) {
          errs.push('points entry must be {timestamp:string, value:number}')
          break
        }
      }
      return errs
    }
    if (isArr(p.series)) {
      for (const s of p.series) {
        if (!isObj(s) || !isStr(s.name)) errs.push('series entry must have name:string')
        const data = isObj(s) ? (s.data ?? s.points) : null
        if (!isArr(data)) errs.push(`series "${isObj(s) && isStr(s.name) ? s.name : '?'}" missing data/points array`)
      }
      return errs
    }
    return ['expected points[] or series[]']
  }
  return ['expected array or {points} or {series}']
}

function validateCandles(p: Json): string[] {
  const bars = isArr(p) ? p : isObj(p) && isArr(p.bars) ? p.bars : null
  if (!bars) return ['expected array or {bars: []}']
  for (const b of bars) {
    if (!isObj(b)) return ['bars entry must be object']
    if (!isStr(b.timestamp)) return ['bar.timestamp must be string']
    for (const k of ['open', 'high', 'low', 'close']) {
      if (!isNum(b[k])) return [`bar.${k} must be number`]
    }
    if (b.volume !== undefined && !isNum(b.volume)) return ['bar.volume must be number when set']
  }
  return []
}

function validateTable(p: Json): string[] {
  if (isArr(p)) {
    if (p.length === 0) return []
    if (!isObj(p[0])) return ['table rows must be objects']
    return []
  }
  if (isObj(p)) {
    if (!isArr(p.rows)) return ['expected rows[] (with optional columns[])']
    return []
  }
  return ['expected array or {columns?, rows}']
}

function validateMetric(p: Json): string[] {
  if (isNum(p)) return []
  if (!isObj(p)) return ['expected number or object']
  if (!isNum(p.value)) return ['value must be number']
  if (p.delta !== undefined && !isNum(p.delta)) return ['delta must be number when set']
  if (p.unit !== undefined && !isStr(p.unit)) return ['unit must be string when set']
  if (p.label !== undefined && !isStr(p.label)) return ['label must be string when set']
  if (p.trend !== undefined && (!isArr(p.trend) || !p.trend.every(isNum))) return ['trend must be number[] when set']
  return []
}

function validateGauge(p: Json): string[] {
  if (!isObj(p)) return ['expected object']
  if (!isNum(p.value)) return ['value must be number']
  for (const k of ['min', 'max']) if (p[k] !== undefined && !isNum(p[k])) return [`${k} must be number when set`]
  if (p.bands !== undefined) {
    if (!isArr(p.bands)) return ['bands must be array when set']
    for (const b of p.bands) {
      if (!isObj(b)) return ['band must be object']
      if (!isNum(b.from) || !isNum(b.to)) return ['band.from and band.to must be numbers']
      if (!isStr(b.color)) return ['band.color must be string']
    }
  }
  return []
}

function validateHeatmap(p: Json): string[] {
  if (!isObj(p)) return ['expected object']
  if (!isArr(p.rows) || !p.rows.every(isStr)) return ['rows must be string[]']
  if (!isArr(p.columns) || !p.columns.every(isStr)) return ['columns must be string[]']
  if (!isArr(p.cells)) return ['cells must be array']
  for (const c of p.cells) {
    if (!isObj(c)) return ['cell must be object']
    if (!isNum(c.row) || !isNum(c.col) || !isNum(c.value)) return ['cell needs {row, col, value} as numbers']
    if (c.row >= p.rows.length || c.col >= p.columns.length) return [`cell (${c.row},${c.col}) out of bounds`]
  }
  return []
}

function validateEvents(p: Json): string[] {
  const events = isArr(p) ? p : isObj(p) && isArr(p.events) ? p.events : null
  if (!events) return ['expected array or {events: []}']
  for (const e of events) {
    if (!isObj(e)) return ['event must be object']
    if (!isStr(e.timestamp)) return ['event.timestamp must be string']
    if (!isStr(e.label)) return ['event.label must be string']
    if (e.status !== undefined && !isStr(e.status)) return ['event.status must be string when set']
  }
  return []
}

function validateDistribution(p: Json): string[] {
  if (!isObj(p)) return ['expected object']
  if (!isArr(p.slices)) return ['slices must be array']
  for (const s of p.slices) {
    if (!isObj(s)) return ['slice must be object']
    if (!isStr(s.label)) return ['slice.label must be string']
    if (!isNum(s.value)) return ['slice.value must be number']
  }
  return []
}

function validateText(p: Json): string[] {
  if (isStr(p)) return []
  if (isArr(p)) {
    for (const it of p) if (!isObj(it)) return ['text items must be objects']
    return []
  }
  if (isObj(p)) {
    if (isArr(p.items)) {
      for (const it of p.items) if (!isObj(it)) return ['items must be objects']
      return []
    }
    return []
  }
  return ['expected string, array, or {items: []}']
}

function validateOrderBook(p: Json): string[] {
  if (!isObj(p)) return ['expected object']
  for (const side of ['bids', 'asks'] as const) {
    if (p[side] !== undefined) {
      if (!isArr(p[side])) return [`${side} must be array`]
      for (const l of p[side] as Json[]) {
        if (!isObj(l) || !isNum(l.price) || !isNum(l.size)) {
          return [`${side} entry needs {price:number, size:number}`]
        }
      }
    }
  }
  return []
}

function validatePairedGrid(p: Json): string[] {
  if (!isObj(p)) return ['expected object']
  if (!isStr(p.subject)) return ['subject must be string']
  if (!isArr(p.rows)) return ['rows must be array']
  for (const r of p.rows) {
    if (!isObj(r) || !isNum(r.key)) return ['row needs {key:number, left?, right?}']
  }
  return []
}

const VALIDATORS: Record<string, (p: Json) => string[]> = {
  timeseries:    validateTimeseries,
  candlestick:   validateCandles,
  table:         validateTable,
  metric:        validateMetric,
  gauge:         validateGauge,
  heatmap:       validateHeatmap,
  events:        validateEvents,
  distribution:  validateDistribution,
  text:          validateText,
  orderbook:     validateOrderBook,
  paired_grid:   validatePairedGrid,
  ticker:        validateEvents,
  volume_profile: validateVolumeProfile,
  stat_strip:    validateStatStrip,
  bar_chart:     validateBarChart,
  scatter:       validateScatter,
  treemap:       validateTreemap,
  histogram:     validateHistogram,
  area_chart:    validateTimeseries,
  boxplot:       validateBoxplot,
  radar:         validateRadar,
}

function validateRadar(p: Json): string[] {
  // Wide form
  if (isArr(p)) {
    if (p.length === 0) return ['expected non-empty array']
    for (const row of p) {
      if (!isObj(row) || !isStr(row.metric)) return ['rows need metric:string']
      const numCols = Object.keys(row).filter(k => k !== 'metric' && isNum(row[k]))
      if (numCols.length === 0) return ['rows need at least one numeric series column']
    }
    return []
  }
  // Long form
  if (isObj(p)) {
    if (!isArr(p.metrics) || !isArr(p.series)) {
      return ['expected wide form [{metric,...}] or long form {metrics, series}']
    }
    return []
  }
  return ['expected array or object']
}

function validateBoxplot(p: Json): string[] {
  if (!isArr(p)) return ['expected array of {label, values:[]} or pre-computed boxes']
  for (const b of p) {
    if (!isObj(b) || !isStr(b.label)) return ['box needs label string']
    const hasRaw = isArr(b.values) && b.values.every(isNum)
    const hasComputed = isNum(b.median)
    if (!hasRaw && !hasComputed) return ['box needs values:[number] or median:number']
  }
  return []
}

function validateHistogram(p: Json): string[] {
  // Raw numbers
  if (isArr(p)) {
    if (p.length === 0) return []
    if (p.every(isNum)) return []
    // Pre-binned shape
    for (const b of p) {
      if (!isObj(b) || !isStr(b.bin) || !isNum(b.count)) {
        return ['expected number[] or [{bin:string, count:number}]']
      }
    }
    return []
  }
  if (isObj(p) && isArr(p.values) && p.values.every(isNum)) return []
  return ['expected number[], {values:[]}, or [{bin, count}]']
}

function validateTreemap(p: Json): string[] {
  const arr = isArr(p)
    ? p
    : isObj(p) && (isArr(p.slices) ? p.slices : isArr(p.nodes) ? p.nodes : null)
  if (!arr) return ['expected array of {label, value} (with optional children)']
  const checkNode = (n: Json): string[] => {
    if (!isObj(n)) return ['node must be object']
    if (!isStr(n.label) && !isStr(n.name)) return ['node needs label or name']
    const children = isArr(n.children) ? n.children : isArr(n.slices) ? n.slices : null
    if (!children && !isNum(n.value)) return ['leaf node needs numeric value']
    if (children) {
      for (const c of children) {
        const errs = checkNode(c)
        if (errs.length) return errs
      }
    }
    return []
  }
  for (const n of arr) {
    const errs = checkNode(n)
    if (errs.length) return errs
  }
  return []
}

function validateScatter(p: Json): string[] {
  const arr = isArr(p) ? p : isObj(p) && isArr(p.points) ? p.points : null
  if (!arr) return ['expected array of {x, y}']
  for (const pt of arr) {
    if (!isObj(pt) || !isNum(pt.x) || !isNum(pt.y)) {
      return ['point needs {x:number, y:number}']
    }
  }
  return []
}

function validateBarChart(p: Json): string[] {
  const arr = isArr(p) ? p : isObj(p) && (isArr(p.bars) ? p.bars : isArr(p.rows) ? p.rows : null)
  if (!arr) return ['expected array of {label, value}']
  for (const b of arr) {
    if (!isObj(b) || !isStr(b.label ?? b.name) || !isNum(b.value)) {
      return ['bar needs {label:string, value:number}']
    }
  }
  return []
}

function validateStatStrip(p: Json): string[] {
  const arr = isArr(p)
    ? p
    : isObj(p) && (isArr(p.stats) ? p.stats : isArr(p.metrics) ? p.metrics : null)
  if (!arr) return ['expected array of {label, value} (or {stats: []})']
  for (const s of arr) {
    if (!isObj(s) || !isStr(s.label) || !isNum(s.value)) {
      return ['stat needs {label:string, value:number}']
    }
  }
  return []
}

function validateVolumeProfile(p: Json): string[] {
  const rows = isArr(p) ? p : isObj(p) && isArr(p.rows) ? p.rows : null
  if (!rows) return ['expected array of {price, volume}']
  for (const r of rows) {
    if (!isObj(r) || !isNum(r.price) || (!isNum(r.volume) && !isNum(r.size))) {
      return ['rows need {price:number, volume:number}']
    }
  }
  return []
}

// Components without a payload contract — Prompt reads options.url not
// source.data; Catalog calls ListSources directly via backendUrl;
// Trade is a form; Clock reads system time; Image/Iframe accept any URL string;
// Section is a pure layout primitive; Slider/Select read ctx + options.
const PAYLOAD_LESS = new Set([
  'prompt', 'catalog', 'trade', 'clock', 'image', 'iframe',
  'section', 'slider', 'select', 'multi_select', 'json', 'sparkline',
])

// ----- Top-level validators -----

function validateTemplate(t: Json): string[] {
  const errs: string[] = []
  if (!isObj(t)) return ['template must be object']
  if (t.title !== undefined && !isStr(t.title)) errs.push('title must be string when set')
  if (t.columns !== undefined && !isNum(t.columns)) errs.push('columns must be number when set')
  if (t.context !== undefined) {
    if (!isObj(t.context)) errs.push('context must be object')
    else if (t.context.values !== undefined && !isObj(t.context.values)) errs.push('context.values must be object')
  }
  if (!isArr(t.widgets)) {
    errs.push('widgets must be array')
    return errs
  }
  t.widgets.forEach((w, i) => {
    const prefix = `widgets[${i}]`
    if (!isObj(w)) { errs.push(`${prefix}: not an object`); return }
    if (!isStr(w.component)) { errs.push(`${prefix}: component must be string`); return }
    if (PAYLOAD_LESS.has(w.component)) return

    const validator = VALIDATORS[w.component]
    if (!validator) {
      // Unknown component name — fall through (Placeholder will render).
      return
    }
    if (!isObj(w.source)) { errs.push(`${prefix}(${w.component}): missing source`); return }
    const src = w.source as Record<string, Json>
    // Backend-served widgets (`source_id` or `url`) trust the runtime
    // fetch — there's nothing to validate at template-parse time.
    if (isStr(src.source_id) || isStr(src.url)) return
    const inline = src.inline ?? src.data
    if (inline === undefined) { errs.push(`${prefix}(${w.component}): missing source.inline`); return }
    const shapeErrs = validator(inline)
    for (const e of shapeErrs) errs.push(`${prefix}(${w.component}): ${e}`)
  })
  return errs
}

// ----- Tests -----

describe('public/examples/*.json', () => {
  for (const [name, t] of Object.entries(EXAMPLES)) {
    it(`${name}: parses and conforms`, () => {
      const errs = validateTemplate(t)
      expect(errs, `expected no contract violations:\n${errs.join('\n')}`).toEqual([])
    })
  }

  it('every example exercises at least 3 distinct widget shapes', () => {
    for (const [name, t] of Object.entries(EXAMPLES)) {
      const tt = t as { widgets: Array<{ component: string }> }
      const shapes = new Set(tt.widgets.map(w => w.component))
      expect(shapes.size, `${name} should mix shapes`).toBeGreaterThanOrEqual(3)
    }
  })

  it('collectively, the examples exercise every contract shape', () => {
    const used = new Set<string>()
    for (const t of Object.values(EXAMPLES)) {
      const tt = t as { widgets: Array<{ component: string }> }
      for (const w of tt.widgets) used.add(w.component)
    }
    for (const shape of Object.keys(VALIDATORS)) {
      expect(used.has(shape), `no example uses ${shape}`).toBe(true)
    }
  })
})
