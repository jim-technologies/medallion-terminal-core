import { describe, it, expect } from 'vitest'
import { normalizeBars } from '../widgets/barNormalize'

describe('normalizeBars', () => {
  it('keeps classic single-series rows', () => {
    const out = normalizeBars([
      { label: 'a', value: 1 },
      { label: 'b', value: -2, color: 'danger' },
    ])
    expect(out?.kind).toBe('single')
    if (out?.kind === 'single') {
      expect(out.bars).toHaveLength(2)
      expect(out.bars[1].color).toBe('danger')
    }
  })

  it('detects grouped wide rows and series order', () => {
    const out = normalizeBars([
      { label: 'Mexico', Market: 55.1, Model: 60, Baseline: 58.2 },
      { label: 'Draw', Market: 24.0, Model: 22, Baseline: 23.1 },
      { label: 'South Africa', Market: 20.9, Model: 18, Baseline: 18.7 },
    ])
    expect(out?.kind).toBe('grouped')
    if (out?.kind === 'grouped') {
      expect(out.series).toEqual(['Market', 'Model', 'Baseline'])
      expect(out.rows).toHaveLength(3)
    }
  })

  it('unions series across rows with gaps', () => {
    const out = normalizeBars([
      { label: 'a', Market: 1 },
      { label: 'b', SeriesB: 2 },
    ])
    expect(out?.kind).toBe('grouped')
    if (out?.kind === 'grouped') {
      expect(out.series).toEqual(['Market', 'SeriesB'])
    }
  })

  it('returns null for empty or non-numeric data', () => {
    expect(normalizeBars([])).toBeNull()
    expect(normalizeBars([{ label: 'a', note: 'text only' }])).toBeNull()
    expect(normalizeBars(null)).toBeNull()
  })

  it('unwraps {bars} and {rows} wrappers', () => {
    expect(normalizeBars({ bars: [{ label: 'a', value: 1 }] })?.kind).toBe('single')
    expect(normalizeBars({ rows: [{ label: 'a', X: 1 }] })?.kind).toBe('grouped')
  })
})
