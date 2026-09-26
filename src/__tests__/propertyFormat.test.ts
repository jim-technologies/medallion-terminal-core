import { describe, expect, it } from 'vitest'
import {
  compareSortKeys,
  formatPropertyText,
  isEmptyValue,
  propertySortKey,
  relativeDateText,
  resolvePropertyKind,
  safeHttpUrl,
  toPropertyDate,
} from '../objects/propertyFormat'

const NOW = Date.parse('2026-09-25T17:00:00Z')

describe('resolvePropertyKind', () => {
  it('lets a format win over the kind and the value', () => {
    expect(resolvePropertyKind(284000, 'number', 'currency:eur')).toEqual({ kind: 'currency', currency: 'EUR' })
    expect(resolvePropertyKind(0.18, undefined, 'percent')).toEqual({ kind: 'percent' })
    expect(resolvePropertyKind('x', 'currency')).toEqual({ kind: 'currency', currency: 'USD' })
  })

  it('infers from the JavaScript type', () => {
    expect(resolvePropertyKind(true).kind).toBe('boolean')
    expect(resolvePropertyKind(3).kind).toBe('number')
    expect(resolvePropertyKind(['a']).kind).toBe('list')
    expect(resolvePropertyKind({ id: 'p1', title: 'Ada' }).kind).toBe('link')
    expect(resolvePropertyKind({ horizon: 90 }).kind).toBe('object')
    expect(resolvePropertyKind('2026-10-18').kind).toBe('string')
  })
})

describe('formatPropertyText', () => {
  it('formats numbers, currency and ratios as percentages', () => {
    expect(formatPropertyText(284000, { kind: 'currency', currency: 'USD' })).toBe('$284,000.00')
    expect(formatPropertyText(0.18, { kind: 'percent' })).toBe('18.0%')
    expect(formatPropertyText(48210.4, { kind: 'integer' })).toBe('48,210')
    expect(formatPropertyText('1234.5', { kind: 'number' })).toBe('1,234.5')
    expect(formatPropertyText(5, { kind: 'currency', currency: 'NOPE' })).toBe('5 NOPE')
  })

  it('keeps calendar dates on their day in every time zone', () => {
    for (const timeZone of ['America/Los_Angeles', 'Asia/Tokyo', 'UTC']) {
      expect(formatPropertyText('2026-10-18', { kind: 'date' }, { timeZone })).toBe('Oct 18, 2026')
    }
    expect(formatPropertyText('2026-09-25T15:42:00Z', { kind: 'datetime' }, { timeZone: 'UTC' }))
      .toBe('Sep 25, 2026, 3:42 PM')
    expect(formatPropertyText('not a date', { kind: 'date' })).toBe('not a date')
  })

  it('localises words and joins structured values without JSON', () => {
    expect(formatPropertyText(false, { kind: 'boolean' }, { no: 'Non' })).toBe('Non')
    expect(formatPropertyText(['a', 2], { kind: 'list' })).toBe('a, 2')
    expect(formatPropertyText({ id: 'p1', title: 'Ada' }, { kind: 'link' })).toBe('Ada')
    expect(formatPropertyText({ horizon: 90, live: true }, { kind: 'object' })).toBe('horizon: 90, live: Yes')
    expect(formatPropertyText(null, { kind: 'string' })).toBe('')
  })
})

describe('relative dates', () => {
  it('counts calendar days for dates and elapsed time for timestamps', () => {
    expect(relativeDateText(toPropertyDate('2026-10-18')!, NOW)).toBe('in 23 days')
    expect(relativeDateText(toPropertyDate('2026-09-26')!, NOW)).toBe('tomorrow')
    expect(relativeDateText(toPropertyDate('2026-09-25T15:42:00Z')!, NOW)).toBe('1 hour ago')
    expect(relativeDateText(toPropertyDate('2027-03-01')!, NOW)).toBe('in 5 months')
  })
})

describe('sorting', () => {
  it('sorts numbers and dates by value and keeps empties last', () => {
    const values = [10, null, 2, 33]
    const sorted = [...values].sort((a, b) => compareSortKeys(
      propertySortKey(a, { kind: 'number' }),
      propertySortKey(b, { kind: 'number' }),
    ))
    expect(sorted).toEqual([2, 10, 33, null])
    expect(propertySortKey('2026-10-18', { kind: 'date' })).toBe(Date.parse('2026-10-18T00:00:00Z'))
    expect(compareSortKeys('file10', 'file9')).toBeGreaterThan(0)
  })
})

describe('guards', () => {
  it('treats only http and https as links', () => {
    expect(safeHttpUrl('https://northstar.example/docs')).toBe('https://northstar.example/docs')
    expect(safeHttpUrl('javascript:alert(1)')).toBeNull()
    expect(safeHttpUrl('data:text/html,hi')).toBeNull()
    expect(safeHttpUrl('/relative')).toBeNull()
  })

  it('knows empty values', () => {
    expect(isEmptyValue('')).toBe(true)
    expect(isEmptyValue([])).toBe(true)
    expect(isEmptyValue(0)).toBe(false)
    expect(isEmptyValue(false)).toBe(false)
  })
})
