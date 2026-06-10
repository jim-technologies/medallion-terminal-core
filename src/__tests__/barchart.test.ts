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
      { label: 'Mexico', Market: 55.1, 'GPT-5': 60, Elo: 58.2 },
      { label: 'Draw', Market: 24.0, 'GPT-5': 22, Elo: 23.1 },
      { label: 'South Africa', Market: 20.9, 'GPT-5': 18, Elo: 18.7 },
    ])
    expect(out?.kind).toBe('grouped')
    if (out?.kind === 'grouped') {
      expect(out.series).toEqual(['Market', 'GPT-5', 'Elo'])
      expect(out.rows).toHaveLength(3)
    }
  })

  it('unions series across rows with gaps', () => {
    const out = normalizeBars([
      { label: 'a', Market: 1 },
      { label: 'b', Claude: 2 },
    ])
    expect(out?.kind).toBe('grouped')
    if (out?.kind === 'grouped') {
      expect(out.series).toEqual(['Market', 'Claude'])
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
