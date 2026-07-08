import { describe, expect, it } from 'vitest'
import { kellyStake } from '../../examples/widgets/Kelly'

// Validates the custom widget's pure math. The widget itself is
// covered by the framework-side render tests; this nails down the
// formula so an over-eager refactor can't quietly change recommended
// stakes.

describe('kellyStake', () => {
  it('classic 60/40 coin at even odds → f* = 20%', () => {
    const r = kellyStake({ probability: 0.6, odds: 2, bankroll: 1000, fraction: 'full' })
    expect(r.kellyFraction).toBeCloseTo(0.2, 6)
    expect(r.stake).toBeCloseTo(200, 6)
    expect(r.ev).toBeCloseTo(40, 6) // 200 * (0.6*1 - 0.4)
  })

  it('half-Kelly halves the stake', () => {
    const full = kellyStake({ probability: 0.6, odds: 2, bankroll: 1000, fraction: 'full' })
    const half = kellyStake({ probability: 0.6, odds: 2, bankroll: 1000, fraction: 'half' })
    expect(half.stake).toBeCloseTo(full.stake / 2, 6)
  })

  it('quarter-Kelly quarters the stake', () => {
    const full = kellyStake({ probability: 0.6, odds: 2, bankroll: 1000, fraction: 'full' })
    const quarter = kellyStake({ probability: 0.6, odds: 2, bankroll: 1000, fraction: 'quarter' })
    expect(quarter.stake).toBeCloseTo(full.stake / 4, 6)
  })

  it('no edge → zero stake (clamped, not negative)', () => {
    // Implied probability at odds 2.0 = 0.5; if your p == implied, no edge.
    const r = kellyStake({ probability: 0.5, odds: 2, bankroll: 1000, fraction: 'full' })
    expect(r.kellyFraction).toBeCloseTo(0, 6)
    expect(r.stake).toBe(0)
    expect(r.ev).toBe(0)
  })

  it('negative-edge bet recommends zero stake (no shorting)', () => {
    const r = kellyStake({ probability: 0.4, odds: 2, bankroll: 1000, fraction: 'full' })
    expect(r.kellyFraction).toBeLessThan(0)
    expect(r.stake).toBe(0) // clamped at zero
    expect(r.ev).toBe(0)
  })

  it('edge percent is (your_p - implied_p) / implied_p', () => {
    // odds=2.5 → implied p=0.4; your p=0.5 → edge = (0.5-0.4)/0.4 = 25%
    const r = kellyStake({ probability: 0.5, odds: 2.5, bankroll: 1000, fraction: 'full' })
    expect(r.edgePercent).toBeCloseTo(0.25, 6)
  })

  it('positive growth rate when edged', () => {
    const r = kellyStake({ probability: 0.6, odds: 2, bankroll: 1000, fraction: 'full' })
    expect(r.growthRate).toBeGreaterThan(0)
  })
})
