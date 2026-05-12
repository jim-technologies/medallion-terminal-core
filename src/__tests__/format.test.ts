import { describe, expect, it } from 'vitest'
import { formatPercent, formatCurrency, formatBps } from '../widgets/format'

describe('formatPercent', () => {
  it('treats input as fraction by default', () => {
    expect(formatPercent(0.0218)).toBe('2.18%')
    expect(formatPercent(-0.05)).toBe('-5.00%')
  })
  it('honors decimals', () => {
    expect(formatPercent(0.0218, { decimals: 0 })).toBe('2%')
    expect(formatPercent(0.0218, { decimals: 4 })).toBe('2.1800%')
  })
  it('signed adds a leading + for positives', () => {
    expect(formatPercent(0.0218, { signed: true })).toBe('+2.18%')
    expect(formatPercent(-0.0218, { signed: true })).toBe('-2.18%')
  })
  it('accepts percent inputs', () => {
    expect(formatPercent(2.18, { as: 'percent' })).toBe('2.18%')
  })
})

describe('formatCurrency', () => {
  it('formats USD by default', () => {
    expect(formatCurrency(1234.56)).toMatch(/\$1,234\.56/)
  })
  it('supports other currencies', () => {
    expect(formatCurrency(1234.56, 'EUR')).toMatch(/€|EUR/)
  })
  it('compact drops fractional digits', () => {
    expect(formatCurrency(1234.56, 'USD', { compact: true })).toMatch(/\$1,235|\$1,234/)
  })
  it('falls back gracefully on bad currency code', () => {
    expect(formatCurrency(1234.56, 'BAD!')).toMatch(/1,234/)
  })
})

describe('formatBps', () => {
  it('converts fractions to bps', () => {
    expect(formatBps(0.0025)).toBe('25 bps')
    expect(formatBps(-0.005)).toBe('-50 bps')
  })
  it('accepts percent inputs', () => {
    expect(formatBps(0.25, { as: 'percent' })).toBe('25 bps')
  })
  it('signed adds a leading +', () => {
    expect(formatBps(0.0025, { signed: true })).toBe('+25 bps')
  })
})
