import { describe, it, expect } from 'vitest'

function normalize(data: unknown): { columns: string[]; rows: Record<string, unknown>[] } {
  if (!data) return { columns: [], rows: [] }

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    const columns = [...new Set(data.flatMap(row => Object.keys(row as object)))]
    return { columns, rows: data as Record<string, unknown>[] }
  }

  if (typeof data === 'object' && data !== null && 'columns' in data && 'rows' in data) {
    const d = data as { columns: string[]; rows: unknown[][] }
    const rows = d.rows.map(row =>
      Object.fromEntries(d.columns.map((col, i) => [col, row[i]]))
    )
    return { columns: d.columns, rows }
  }

  return { columns: [], rows: [] }
}

describe('Table normalization', () => {
  it('handles array of objects', () => {
    const data = [
      { Asset: 'BTC', Price: 73100 },
      { Asset: 'ETH', Price: 3980 },
    ]
    const result = normalize(data)
    expect(result.columns).toEqual(['Asset', 'Price'])
    expect(result.rows).toHaveLength(2)
    expect(result.rows[0].Asset).toBe('BTC')
  })

  it('handles explicit columns + rows', () => {
    const data = {
      columns: ['Name', 'Score'],
      rows: [['Alice', 95], ['Bob', 87]],
    }
    const result = normalize(data)
    expect(result.columns).toEqual(['Name', 'Score'])
    expect(result.rows[0]).toEqual({ Name: 'Alice', Score: 95 })
    expect(result.rows[1]).toEqual({ Name: 'Bob', Score: 87 })
  })

  it('auto-detects columns from heterogeneous objects', () => {
    const data = [
      { a: 1, b: 2 },
      { b: 3, c: 4 },
    ]
    const result = normalize(data)
    expect(result.columns).toEqual(['a', 'b', 'c'])
  })

  it('returns empty for null/invalid data', () => {
    expect(normalize(null)).toEqual({ columns: [], rows: [] })
    expect(normalize([])).toEqual({ columns: [], rows: [] })
    expect(normalize('string')).toEqual({ columns: [], rows: [] })
  })
})
