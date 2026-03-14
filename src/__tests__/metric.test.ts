import { describe, it, expect } from 'vitest'

function normalize(data: unknown): { value: number; delta?: number; unit?: string; label?: string } {
  if (typeof data === 'number') return { value: data }
  if (typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>
    return {
      value: Number(d.value ?? 0),
      delta: d.delta != null ? Number(d.delta) : undefined,
      unit: d.unit != null ? String(d.unit) : undefined,
      label: d.label != null ? String(d.label) : undefined,
    }
  }
  return { value: 0 }
}

describe('Metric normalization', () => {
  it('handles raw number', () => {
    expect(normalize(42069)).toEqual({ value: 42069 })
  })

  it('handles full object', () => {
    const data = { value: 73100, delta: 2.18, unit: 'USD', label: 'Price' }
    const result = normalize(data)
    expect(result.value).toBe(73100)
    expect(result.delta).toBe(2.18)
    expect(result.unit).toBe('USD')
    expect(result.label).toBe('Price')
  })

  it('handles minimal object', () => {
    const result = normalize({ value: 42 })
    expect(result.value).toBe(42)
    expect(result.delta).toBeUndefined()
    expect(result.unit).toBeUndefined()
  })

  it('handles negative delta', () => {
    const result = normalize({ value: 100, delta: -5.5 })
    expect(result.delta).toBe(-5.5)
  })

  it('returns 0 for invalid data', () => {
    expect(normalize(null)).toEqual({ value: 0 })
    expect(normalize(undefined)).toEqual({ value: 0 })
    expect(normalize('string')).toEqual({ value: 0 })
  })
})
