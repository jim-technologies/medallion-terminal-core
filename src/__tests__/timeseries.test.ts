import { describe, it, expect } from 'vitest'

// Test the normalize logic extracted from Timeseries widget
// We re-implement the pure normalization here to test it independently

const TS_KEYS = ['timestamp', 'date', 'time', 'datetime', 'ts', 'x', 't']

function findTimestampKey(obj: Record<string, unknown>): string | null {
  for (const k of TS_KEYS) {
    if (k in obj) return k
  }
  return null
}

function normalize(data: unknown) {
  if (!data) return null

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    const sample = data[0] as Record<string, unknown>
    const tsKey = findTimestampKey(sample)
    if (!tsKey) return null

    const numericKeys = Object.keys(sample).filter(
      k => k !== tsKey && typeof sample[k] === 'number'
    )
    if (numericKeys.length === 0) return null

    const points = data.map(item => {
      const row = item as Record<string, unknown>
      const entry: Record<string, unknown> = { _ts: row[tsKey] }
      for (const k of numericKeys) entry[k] = row[k]
      return entry
    })

    return { points, keys: numericKeys }
  }

  if (typeof data === 'object' && data !== null && 'series' in data) {
    const seriesArr = (data as Record<string, unknown>).series
    if (!Array.isArray(seriesArr)) return null

    const merged = new Map<string, Record<string, unknown>>()
    const keys: string[] = []

    for (const s of seriesArr) {
      const series = s as Record<string, unknown>
      const name = String(series.name || series.label || `s${keys.length}`)
      keys.push(name)
      const items = series.data as Record<string, unknown>[]
      if (!Array.isArray(items)) continue
      for (const pt of items) {
        const ts = String(pt.timestamp ?? pt.date ?? pt.time ?? pt.x ?? '')
        if (!merged.has(ts)) merged.set(ts, { _ts: ts })
        merged.get(ts)![name] = pt.value ?? pt.y ?? pt.v
      }
    }

    return { points: Array.from(merged.values()), keys }
  }

  return null
}

describe('Timeseries normalization', () => {
  it('handles single-series [{timestamp, value}]', () => {
    const data = [
      { timestamp: '2024-01-01', value: 100 },
      { timestamp: '2024-01-02', value: 200 },
    ]
    const result = normalize(data)
    expect(result).not.toBeNull()
    expect(result!.keys).toEqual(['value'])
    expect(result!.points).toHaveLength(2)
    expect(result!.points[0]).toEqual({ _ts: '2024-01-01', value: 100 })
  })

  it('handles multi-key [{timestamp, BTC, ETH}]', () => {
    const data = [
      { timestamp: '2024-01-01', BTC: 42000, ETH: 2800 },
      { timestamp: '2024-01-02', BTC: 43000, ETH: 2900 },
    ]
    const result = normalize(data)
    expect(result).not.toBeNull()
    expect(result!.keys).toEqual(['BTC', 'ETH'])
    expect(result!.points[0]).toEqual({ _ts: '2024-01-01', BTC: 42000, ETH: 2800 })
  })

  it('handles multi-series {series: [...]}', () => {
    const data = {
      series: [
        { name: 'A', data: [{ timestamp: '2024-01-01', value: 10 }] },
        { name: 'B', data: [{ timestamp: '2024-01-01', value: 20 }] },
      ],
    }
    const result = normalize(data)
    expect(result).not.toBeNull()
    expect(result!.keys).toEqual(['A', 'B'])
    expect(result!.points[0]).toEqual({ _ts: '2024-01-01', A: 10, B: 20 })
  })

  it('auto-detects alternate timestamp keys', () => {
    for (const key of ['date', 'time', 'ts', 'x']) {
      const data = [{ [key]: '2024-01-01', value: 100 }]
      const result = normalize(data)
      expect(result).not.toBeNull()
      expect(result!.points[0]._ts).toBe('2024-01-01')
    }
  })

  it('returns null for empty/invalid data', () => {
    expect(normalize(null)).toBeNull()
    expect(normalize([])).toBeNull()
    expect(normalize([{ foo: 'bar' }])).toBeNull() // no timestamp key
    expect(normalize([{ timestamp: '2024-01-01' }])).toBeNull() // no numeric keys
  })
})
