import { describe, it, expect } from 'vitest'
import { assignSeriesColors, PALETTE } from '../widgets/colors'

describe('assignSeriesColors', () => {
  it('palette-cycles by original series index', () => {
    const out = assignSeriesColors(['North', 'South', 'Central'])
    expect(out[0]).toBe(PALETTE[0])
    expect(out[1]).toBe(PALETTE[1])
    expect(out[2]).toBe(PALETTE[2])
  })

  it('wraps once the fallback palette is exhausted', () => {
    const names = Array.from({ length: PALETTE.length + 1 }, (_, i) => `series-${i}`)
    const out = assignSeriesColors(names)
    expect(out[PALETTE.length]).toBe(PALETTE[0])
  })
})
