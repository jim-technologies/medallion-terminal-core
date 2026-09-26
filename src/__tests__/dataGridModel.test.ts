import { describe, expect, it } from 'vitest'
import {
  cellValue,
  moveFocus,
  nextSort,
  rangeKeys,
  rowWindow,
  scrollOffsetFor,
  sortRows,
} from '../workbench/dataGridModel'

interface Row { id: string; amount: number | null; name: string; due?: string }

const rows: Row[] = [
  { id: 'a', amount: 30, name: 'file10', due: '2026-10-18' },
  { id: 'b', amount: null, name: 'file9', due: '2026-01-02' },
  { id: 'c', amount: 5, name: 'File2' },
  { id: 'd', amount: 30, name: 'file1', due: '2025-12-31' },
]

describe('sortRows', () => {
  it('sorts numbers by value, stable, with empties last in both directions', () => {
    const column = { id: 'amount' }
    expect(sortRows(rows, column, 'ascending').map(row => row.id)).toEqual(['c', 'a', 'd', 'b'])
    expect(sortRows(rows, column, 'descending').map(row => row.id)).toEqual(['a', 'd', 'c', 'b'])
  })

  it('sorts text naturally and dates by time', () => {
    expect(sortRows(rows, { id: 'name' }, 'ascending').map(row => row.name))
      .toEqual(['file1', 'File2', 'file9', 'file10'])
    expect(sortRows(rows, { id: 'due', kind: 'date' as const }, 'ascending').map(row => row.id))
      .toEqual(['d', 'b', 'a', 'c'])
  })

  it('uses accessors and sort keys when given', () => {
    const byLength = { id: 'x', accessor: (row: Row) => row.name, sortValue: (row: Row) => row.name.length }
    expect(cellValue(byLength, rows[0]!)).toBe('file10')
    expect(sortRows(rows, byLength, 'ascending').map(row => row.id)).toEqual(['b', 'c', 'd', 'a'])
    expect(sortRows(rows, undefined, 'ascending')).toBe(rows)
  })
})

describe('nextSort', () => {
  it('cycles ascending, descending, off, and restarts on a new column', () => {
    const asc = nextSort(null, 'amount')
    expect(asc).toEqual({ columnId: 'amount', direction: 'ascending' })
    expect(nextSort(asc, 'amount')).toEqual({ columnId: 'amount', direction: 'descending' })
    expect(nextSort({ columnId: 'amount', direction: 'descending' }, 'amount')).toBeNull()
    expect(nextSort({ columnId: 'amount', direction: 'descending' }, 'name'))
      .toEqual({ columnId: 'name', direction: 'ascending' })
  })
})

describe('rowWindow', () => {
  it('renders every row without virtualisation', () => {
    expect(rowWindow(50, 400, 300, 32, 8, false)).toEqual({ start: 0, end: 50 })
  })

  it('keeps ten thousand rows to the viewport plus overscan', () => {
    const top = rowWindow(10_000, 0, 480, 32, 8, true)
    expect(top).toEqual({ start: 0, end: 24 })
    const middle = rowWindow(10_000, 160_000, 480, 32, 8, true)
    expect(middle.start).toBe(5000 - 8)
    expect(middle.end - middle.start).toBeLessThanOrEqual(16 + 8 + 8)
    expect(rowWindow(10_000, 10_000 * 32, 480, 32, 8, true).end).toBe(10_000)
  })
})

describe('scrollOffsetFor', () => {
  it('scrolls just enough to show a row below the sticky header', () => {
    expect(scrollOffsetFor(0, 320, 480, 32, 32)).toBe(0)
    expect(scrollOffsetFor(20, 0, 480, 32, 32)).toBe(21 * 32 - 448)
    expect(scrollOffsetFor(5, 0, 480, 32, 32)).toBe(0)
  })
})

describe('rangeKeys and moveFocus', () => {
  it('selects inclusive ranges in either direction', () => {
    const keys = ['a', 'b', 'c', 'd']
    expect(rangeKeys(keys, 'b', 'd')).toEqual(['b', 'c', 'd'])
    expect(rangeKeys(keys, 'd', 'b')).toEqual(['b', 'c', 'd'])
    expect(rangeKeys(keys, 'x', 'c')).toEqual(['c'])
  })

  it('moves within the grid, the header being row -1', () => {
    const dims = { rowCount: 100, columnCount: 5, pageRows: 10, ctrl: false }
    expect(moveFocus({ row: 0, column: 0 }, 'ArrowUp', dims)).toEqual({ row: -1, column: 0 })
    expect(moveFocus({ row: 99, column: 4 }, 'ArrowDown', dims)).toEqual({ row: 99, column: 4 })
    expect(moveFocus({ row: 5, column: 2 }, 'PageDown', dims)).toEqual({ row: 15, column: 2 })
    expect(moveFocus({ row: 5, column: 2 }, 'PageUp', dims)).toEqual({ row: 0, column: 2 })
    expect(moveFocus({ row: 5, column: 2 }, 'Home', dims)).toEqual({ row: 5, column: 0 })
    expect(moveFocus({ row: 5, column: 2 }, 'End', { ...dims, ctrl: true })).toEqual({ row: 99, column: 4 })
    expect(moveFocus({ row: 5, column: 2 }, 'x', dims)).toBeNull()
  })
})
