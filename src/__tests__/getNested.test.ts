import { describe, expect, it } from 'vitest'
import { getNested } from '../core/getNested'

describe('getNested', () => {
  it('returns the input when path is empty', () => {
    expect(getNested({ a: 1 }, '')).toEqual({ a: 1 })
  })

  it('walks plain object keys', () => {
    expect(getNested({ a: { b: { c: 42 } } }, 'a.b.c')).toBe(42)
  })

  it('indexes into arrays via numeric segments', () => {
    expect(getNested([10, 20, 30], '1')).toBe(20)
    expect(getNested({ rows: [{ x: 1 }, { x: 2 }] }, 'rows.1.x')).toBe(2)
  })

  it('returns undefined for missing intermediate keys', () => {
    expect(getNested({ a: { b: 1 } }, 'a.x.y')).toBeUndefined()
  })

  it('returns undefined for array indices that are non-integer', () => {
    expect(getNested([1, 2, 3], 'foo')).toBeUndefined()
  })

  it('returns undefined when stepping into a primitive', () => {
    expect(getNested({ a: 'string' }, 'a.foo')).toBeUndefined()
    expect(getNested({ a: 5 }, 'a.foo')).toBeUndefined()
  })

  it('handles null/undefined intermediates without throwing', () => {
    expect(getNested({ a: null }, 'a.b')).toBeUndefined()
    expect(getNested(undefined, 'a.b')).toBeUndefined()
    expect(getNested(null, 'a')).toBeUndefined()
  })

  it('walks a realistic paired_grid odds path', () => {
    const data = {
      rows: [
        { key: -3.5, left: { values: { odds: 1.91 } }, right: { values: { odds: 1.95 } } },
        { key:  0,   left: { values: { odds: 1.83 } }, right: { values: { odds: 2.05 } } },
      ],
    }
    expect(getNested(data, 'rows.1.left.values.odds')).toBe(1.83)
    expect(getNested(data, 'rows.1.right.values.odds')).toBe(2.05)
  })
})
