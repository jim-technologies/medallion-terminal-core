import { describe, expect, it } from 'vitest'
import {
  cellValue,
  fitColumnWidths,
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

describe('fitColumnWidths', () => {
  const text = (width: number, min = 96) => ({ width, min, shrink: true })
  const rigid = (width: number) => ({ width, min: width, shrink: false })
  const sum = (widths: number[]) => widths.reduce((total, width) => total + width, 0)

  it('keeps natural widths when they fit', () => {
    expect(fitColumnWidths([text(120), rigid(90), rigid(80)], 420)).toEqual([120, 90, 80])
    // Unmeasured viewport: nothing to fit against.
    expect(fitColumnWidths([text(400), rigid(300)], 0)).toEqual([400, 300])
  })

  it('shrinks text columns in proportion to their room and lands exactly on the width', () => {
    const widths = fitColumnWidths([text(300), text(196), rigid(110), rigid(90)], 500)
    expect(sum(widths)).toBe(500)
    expect(widths.slice(2)).toEqual([110, 90])
    // 204 and 100 px of room give up the 196 px excess about 2:1.
    expect(widths[0]).toBe(168)
    expect(widths[1]).toBe(132)
  })

  it('shrinks a higher tier only once the lower tiers are at their minimum', () => {
    const name = { width: 170, min: 96, shrink: true, tier: 1 }
    // 192 px too wide: the other text columns give their 174 px first.
    expect(fitColumnWidths([name, text(90, 72), text(200, 72), rigid(70), rigid(150), text(100, 72)], 588))
      .toEqual([152, 72, 72, 70, 150, 72])
    // Enough room in the lower tier: the name keeps its width.
    expect(fitColumnWidths([name, text(200, 72), rigid(100)], 400)).toEqual([170, 130, 100])
  })

  it('never shrinks below a minimum or touches numbers, and scrolls the rest', () => {
    const widths = fitColumnWidths([text(300, 120), rigid(140), rigid(160)], 320)
    expect(widths).toEqual([120, 140, 160])
    expect(sum(widths)).toBeGreaterThan(320)
    expect(fitColumnWidths([rigid(200), rigid(200)], 300)).toEqual([200, 200])
  })
})
