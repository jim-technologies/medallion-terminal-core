import { describe, expect, it } from 'vitest'
import { evaluateAlert, canParsePredicate } from '../core/alerts'

describe('evaluateAlert', () => {
  it('returns false on empty / malformed predicate', () => {
    expect(evaluateAlert({ value: 100 }, '')).toBe(false)
    expect(evaluateAlert({ value: 100 }, 'value')).toBe(false)
    expect(evaluateAlert({ value: 100 }, 'not a real predicate')).toBe(false)
  })

  it('numeric > comparison', () => {
    expect(evaluateAlert({ value: 100 }, 'value > 50')).toBe(true)
    expect(evaluateAlert({ value: 100 }, 'value > 100')).toBe(false)
    expect(evaluateAlert({ value: 100 }, 'value > 200')).toBe(false)
  })

  it('numeric >=, <, <=', () => {
    expect(evaluateAlert({ x: 5 }, 'x >= 5')).toBe(true)
    expect(evaluateAlert({ x: 5 }, 'x <= 5')).toBe(true)
    expect(evaluateAlert({ x: 5 }, 'x < 6')).toBe(true)
    expect(evaluateAlert({ x: 5 }, 'x < 5')).toBe(false)
  })

  it('walks nested paths', () => {
    expect(evaluateAlert({ metric: { value: 67_842 } }, 'metric.value > 67000')).toBe(true)
    expect(evaluateAlert({ rows: [{ value: 0.85 }] }, 'rows.0.value > 0.7')).toBe(true)
  })

  it('walks paired_grid-style paths', () => {
    const data = {
      rows: [
        { left: { values: { iv: 0.62, delta: 0.66 } } },
        { left: { values: { iv: 0.78, delta: 0.94 } } },
      ],
    }
    expect(evaluateAlert(data, 'rows.0.left.values.iv > 0.7')).toBe(false)
    expect(evaluateAlert(data, 'rows.1.left.values.iv > 0.7')).toBe(true)
  })

  it('string equality with double-quoted literal', () => {
    expect(evaluateAlert({ status: 'EVENT_STATUS_ERROR' }, 'status == "EVENT_STATUS_ERROR"')).toBe(true)
    expect(evaluateAlert({ status: 'EVENT_STATUS_OK' }, 'status == "EVENT_STATUS_ERROR"')).toBe(false)
  })

  it('string inequality', () => {
    expect(evaluateAlert({ status: 'OK' }, 'status != "ERROR"')).toBe(true)
    expect(evaluateAlert({ status: 'ERROR' }, 'status != "ERROR"')).toBe(false)
  })

  it('boolean and null literals', () => {
    expect(evaluateAlert({ flag: true }, 'flag == true')).toBe(true)
    expect(evaluateAlert({ flag: false }, 'flag == true')).toBe(false)
    expect(evaluateAlert({ slot: null }, 'slot == null')).toBe(true)
  })

  it('returns false when path missing', () => {
    expect(evaluateAlert({ a: 1 }, 'b.c > 0')).toBe(false)
  })

  it('returns false when types don\'t coerce for numeric ops', () => {
    expect(evaluateAlert({ x: 'not a number' }, 'x > 5')).toBe(false)
    expect(evaluateAlert({ x: null }, 'x > 5')).toBe(false)
  })

  it('handles a realistic spot-price threshold', () => {
    expect(evaluateAlert({ metric: { value: 70_000, unit: 'USD' } }, 'metric.value > 67500')).toBe(true)
  })

  it('AND composition — both must hold', () => {
    const d = { value: 70_000, volume: 1.5e8 }
    expect(evaluateAlert(d, 'value > 67500 && volume > 1e8')).toBe(true)
    expect(evaluateAlert(d, 'value > 67500 && volume > 2e8')).toBe(false)
  })

  it('OR composition — either holds', () => {
    const d = { value: 60_000, volume: 2e8 }
    expect(evaluateAlert(d, 'value > 67500 || volume > 1e8')).toBe(true)
    expect(evaluateAlert(d, 'value > 67500 || volume > 3e8')).toBe(false)
  })

  it('AND binds tighter than OR', () => {
    // value>X AND volume>Y  OR  status=="ERROR"
    // Truth table: only the AND-pair or the status branch can win.
    const errored = { value: 0, volume: 0, status: 'ERROR' }
    const both    = { value: 100, volume: 100, status: 'OK' }
    const oneOnly = { value: 100, volume: 0, status: 'OK' }
    const pred = 'value > 50 && volume > 50 || status == "ERROR"'
    expect(evaluateAlert(errored, pred)).toBe(true)
    expect(evaluateAlert(both, pred)).toBe(true)
    expect(evaluateAlert(oneOnly, pred)).toBe(false)
  })

  it('canParsePredicate flags malformed composites', () => {
    expect(canParsePredicate('value > 50')).toBe(true)
    expect(canParsePredicate('value > 50 && volume > 100')).toBe(true)
    expect(canParsePredicate('value > 50 ||')).toBe(false)
    expect(canParsePredicate('&& value > 50')).toBe(false)
    expect(canParsePredicate('not a predicate')).toBe(false)
  })
})
