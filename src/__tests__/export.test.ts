import { describe, it, expect } from 'vitest'
import { parquetReadObjects } from 'hyparquet'
import { flatten } from '../export/flatten'
import {
  toCsv,
  toJson,
  toNdjson,
  toParquet,
  csvEscape,
  serializeText,
  MIME,
  EXTENSION,
} from '../export/serializers'
import { exportFilename, viewRowCount } from '../export/exportView'

// =============================================================
// Export serializers — flatten() + CSV / JSON / NDJSON / Parquet
// round-trips. These are the BI-standard export formats the terminal
// serves to BI and reporting tools.
// =============================================================

describe('flatten', () => {
  it('flattens a table array-of-objects', () => {
    const t = flatten([
      { asset: 'BTC', price: 73100 },
      { asset: 'ETH', price: 3980 },
    ], 'table')
    expect(t.columns).toEqual(['asset', 'price'])
    expect(t.rows).toHaveLength(2)
    expect(t.rows[0]).toEqual({ asset: 'BTC', price: 73100 })
  })

  it('flattens canonical TablePayload (column objects + keyed rows)', () => {
    const t = flatten({
      columns: [{ key: 'sym', label: 'Symbol' }, { key: 'px', format: 'currency' }],
      rows: [{ sym: 'BTC', px: 73100 }, { sym: 'ETH', px: 3980 }],
    }, 'table')
    expect(t.columns).toEqual(['sym', 'px'])
    expect(t.rows[1]).toEqual({ sym: 'ETH', px: 3980 })
  })

  it('flattens positional table rows', () => {
    const t = flatten({ columns: ['a', 'b'], rows: [[1, 2], [3, 4]] }, 'table')
    expect(t.columns).toEqual(['a', 'b'])
    expect(t.rows[0]).toEqual({ a: 1, b: 2 })
  })

  it('flattens single-series timeseries', () => {
    const t = flatten({ points: [{ timestamp: '2026-01-01', value: 10 }] }, 'timeseries')
    expect(t.columns).toEqual(['timestamp', 'value'])
    expect(t.rows[0]).toEqual({ timestamp: '2026-01-01', value: 10 })
  })

  it('pivots multi-series timeseries wide by timestamp', () => {
    const t = flatten({
      series: [
        { name: 'A', points: [{ timestamp: 't1', value: 1 }, { timestamp: 't2', value: 2 }] },
        { name: 'B', points: [{ timestamp: 't1', value: 9 }] },
      ],
    }, 'timeseries')
    expect(t.columns).toEqual(['timestamp', 'A', 'B'])
    expect(t.rows[0]).toEqual({ timestamp: 't1', A: 1, B: 9 })
    expect(t.rows[1]).toEqual({ timestamp: 't2', A: 2 })
  })

  it('flattens candles', () => {
    const t = flatten({ bars: [{ timestamp: 't', open: 1, high: 2, low: 0.5, close: 1.5, volume: 100 }] }, 'candlestick')
    expect(t.columns).toEqual(['timestamp', 'open', 'high', 'low', 'close', 'volume'])
    expect(t.rows[0].close).toBe(1.5)
  })

  it('flattens orderbook with a side column', () => {
    const t = flatten({ bids: [{ price: 100, size: 1 }], asks: [{ price: 101, size: 2 }] }, 'orderbook')
    expect(t.columns).toEqual(['side', 'price', 'size'])
    expect(t.rows[0]).toEqual({ side: 'bid', price: 100, size: 1 })
    expect(t.rows[1]).toEqual({ side: 'ask', price: 101, size: 2 })
  })

  it('flattens distribution slices', () => {
    const t = flatten({ slices: [{ label: 'x', value: 3 }] }, 'distribution')
    expect(t.rows[0]).toEqual({ label: 'x', value: 3 })
  })

  it('flattens a bare metric number', () => {
    const t = flatten(42, 'metric')
    expect(t.columns).toEqual(['value'])
    expect(t.rows[0]).toEqual({ value: 42 })
  })

  it('flattens governed asset catalog rows', () => {
    const t = flatten({
      items: [{
        id: 'dataset.customers',
        name: 'Customers',
        kind: 'dataset',
        owner: 'data-platform',
        tags: ['gold'],
        metadata: { rows: 12 },
      }],
    }, 'asset_catalog')
    expect(t.columns).toEqual(expect.arrayContaining(['id', 'name', 'kind', 'owner', 'metadata']))
    expect(t.rows[0]).toMatchObject({
      id: 'dataset.customers',
      kind: 'dataset',
      tags: '["gold"]',
      metadata: '{"rows":12}',
    })
  })

  it('flattens semantic object properties into one export row', () => {
    const t = flatten({
      object_type: 'Customer',
      object_id: 'cust-1',
      title: 'Acme',
      properties: [
        { key: 'arr', value: 1250000 },
        { key: 'active', value: true },
      ],
    }, 'object_view')
    expect(t.rows[0]).toMatchObject({
      object_type: 'Customer',
      object_id: 'cust-1',
      title: 'Acme',
      arr: 1250000,
      active: true,
    })
  })

  it('flattens graph nodes and edges with record_type tags', () => {
    const t = flatten({
      nodes: [{ id: 'a', label: 'A', kind: 'dataset' }],
      edges: [{ from: 'a', to: 'b', label: 'feeds' }],
    }, 'dag')
    expect(t.rows).toEqual(expect.arrayContaining([
      expect.objectContaining({ record_type: 'node', id: 'a', kind: 'dataset' }),
      expect.objectContaining({ record_type: 'edge', from: 'a', to: 'b', label: 'feeds' }),
    ]))
  })

  it('flattens repository listings with ref and size metadata', () => {
    const t = flatten({
      repository: 'analytics',
      ref: 'main',
      entries: [{
        path: 'src/index.ts',
        name: 'index.ts',
        kind: 'REPOSITORY_ENTRY_KIND_FILE',
        language: 'typescript',
        size_bytes: 42,
      }],
    }, 'code_browser')
    expect(t.rows[0]).toMatchObject({
      repository: 'analytics',
      ref: 'main',
      path: 'src/index.ts',
      kind: 'file',
      size_bytes: 42,
    })
  })

  it('flattens record sets while preserving identity and revision metadata', () => {
    const t = flatten({
      table_id: 'work_items',
      fields: [
        { key: 'name', type: 'RECORD_FIELD_TYPE_TEXT' },
        { key: 'customer', type: 'RECORD_FIELD_TYPE_LINK' },
      ],
      records: [{
        id: 'work-1',
        revision: '7',
        updated_at: '2026-07-16T12:00:00Z',
        values: {
          name: 'Northstar rollout',
          customer: { id: 'customer-7', label: 'Northstar' },
        },
      }],
    }, 'record_grid')
    expect(t.columns).toEqual(expect.arrayContaining([
      'id',
      'name',
      'customer',
      'updated_at',
      'revision',
    ]))
    expect(t.rows[0]).toMatchObject({
      id: 'work-1',
      name: 'Northstar rollout',
      customer: '{"id":"customer-7","label":"Northstar"}',
      revision: '7',
    })
  })

  it('auto-detects shape without a hint', () => {
    const t = flatten({ bars: [{ timestamp: 't', open: 1, high: 2, low: 1, close: 2 }] })
    expect(t.columns).toContain('open')
  })

  it('JSON-encodes nested cells so the table stays rectangular', () => {
    const t = flatten([{ id: 1, meta: { a: 1 } }], 'table')
    expect(t.rows[0].meta).toBe('{"a":1}')
  })

  it('returns empty for null', () => {
    expect(flatten(null)).toEqual({ columns: [], rows: [] })
  })
})

describe('csvEscape', () => {
  it('passes through plain values', () => {
    expect(csvEscape('BTC')).toBe('BTC')
    expect(csvEscape(73100)).toBe('73100')
  })
  it('quotes and doubles internal quotes', () => {
    expect(csvEscape('a,b')).toBe('"a,b"')
    expect(csvEscape('she said "hi"')).toBe('"she said ""hi"""')
    expect(csvEscape('line\nbreak')).toBe('"line\nbreak"')
  })
  it('null → empty field', () => {
    expect(csvEscape(null)).toBe('')
  })
})

const SAMPLE = [
  { asset: 'BTC', price: 73100, active: true },
  { asset: 'ETH', price: 3980, active: false },
]

describe('CSV serialization', () => {
  it('emits header + rows', () => {
    const csv = toCsv(flatten(SAMPLE, 'table'))
    expect(csv).toBe('asset,price,active\nBTC,73100,true\nETH,3980,false')
  })
  it('round-trips through a naive CSV parse', () => {
    const csv = toCsv(flatten(SAMPLE, 'table'))
    const [header, ...lines] = csv.split('\n')
    expect(header.split(',')).toEqual(['asset', 'price', 'active'])
    expect(lines).toHaveLength(2)
  })
})

describe('JSON / NDJSON serialization', () => {
  it('toJson round-trips to the original rows', () => {
    const json = toJson(flatten(SAMPLE, 'table'))
    expect(JSON.parse(json)).toEqual(SAMPLE)
  })
  it('toNdjson emits one JSON object per line', () => {
    const ndjson = toNdjson(flatten(SAMPLE, 'table'))
    const lines = ndjson.split('\n')
    expect(lines).toHaveLength(2)
    expect(JSON.parse(lines[0])).toEqual(SAMPLE[0])
    expect(JSON.parse(lines[1])).toEqual(SAMPLE[1])
  })
  it('serializeText dispatches by format', () => {
    expect(serializeText(flatten(SAMPLE, 'table'), 'csv')).toContain('asset,price')
    expect(serializeText(flatten(SAMPLE, 'table'), 'ndjson').split('\n')).toHaveLength(2)
  })
})

describe('Parquet serialization', () => {
  it('writes bytes that read back to the original rows', async () => {
    const bytes = await toParquet(flatten(SAMPLE, 'table'))
    expect(bytes).toBeInstanceOf(Uint8Array)
    expect(bytes.byteLength).toBeGreaterThan(0)
    // Parquet magic "PAR1" header + footer.
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('PAR1')
    const ab = bytes.slice().buffer as ArrayBuffer
    const rows = await parquetReadObjects({ file: ab })
    expect(rows).toEqual(SAMPLE)
  })

  it('writes a valid (empty) file for an empty table', async () => {
    const bytes = await toParquet(flatten(null))
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('PAR1')
  })
})

describe('export helpers', () => {
  it('exportFilename sanitizes and appends the extension', () => {
    expect(exportFilename('My Positions!', 'csv')).toBe('My_Positions.csv')
    expect(exportFilename(undefined, 'parquet')).toBe('export.parquet')
    expect(exportFilename('  ', 'json')).toBe('export.json')
  })
  it('viewRowCount counts flattened rows', () => {
    expect(viewRowCount({ data: SAMPLE, component: 'table' })).toBe(2)
    expect(viewRowCount({ data: null })).toBe(0)
  })
  it('MIME and EXTENSION cover every format', () => {
    for (const f of ['csv', 'json', 'ndjson', 'parquet'] as const) {
      expect(MIME[f]).toBeTruthy()
      expect(EXTENSION[f]).toBeTruthy()
    }
  })
})
