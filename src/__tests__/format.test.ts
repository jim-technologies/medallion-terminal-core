import { describe, expect, it } from 'vitest'
import { formatPercent, formatCurrency, formatBps, timeAxisMeta, makeTimestampTick, makeTimestampLabel } from '../widgets/format'

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

describe('span-aware time axis', () => {
  it('detects time-of-day from the raw string, not parse artifacts', () => {
    expect(timeAxisMeta(['2026-06-10', '2026-06-11']).hasTime).toBe(false)
    expect(timeAxisMeta(['2026-06-10T14:00:00Z']).hasTime).toBe(true)
  })

  it('intraday spans tick clock time', () => {
    const meta = timeAxisMeta(['2026-06-10T01:00:00Z', '2026-06-10T23:00:00Z'])
    const tick = makeTimestampTick(meta)(`2026-06-10T14:30:00Z`)
    expect(String(tick)).toMatch(/\d{1,2}:\d{2}/)
    expect(String(tick)).not.toMatch(/Jun/)
  })

  it('multi-day intraday spans tick date plus time', () => {
    const meta = timeAxisMeta(['2026-06-08T01:00:00Z', '2026-06-12T23:00:00Z'])
    expect(String(makeTimestampTick(meta)('2026-06-10T14:30:00Z'))).toMatch(/\d{1,2}:\d{2}/)
  })

  it('long spans and date-only data tick the date', () => {
    const long = timeAxisMeta(['2026-01-01T00:30:00Z', '2026-06-10T00:30:00Z'])
    expect(String(makeTimestampTick(long)('2026-06-10T14:30:00Z'))).not.toMatch(/:/)
    const dates = timeAxisMeta(['2026-06-01', '2026-06-10'])
    expect(String(makeTimestampTick(dates)('2026-06-10'))).not.toMatch(/:/)
  })

  it('tooltip label carries full datetime when data has time', () => {
    const meta = timeAxisMeta(['2026-06-10T01:00:00Z', '2026-06-10T23:00:00Z'])
    expect(String(makeTimestampLabel(meta)('2026-06-10T14:30:00Z'))).toMatch(/\d{1,2}:\d{2}/)
  })
})
