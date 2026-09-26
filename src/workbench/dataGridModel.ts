/**
 * Pure model for DataGrid: the rendered window, client sorting, range
 * selection and keyboard movement. The React component owns state and DOM;
 * these functions are unit-tested without a browser.
 */
import {
  compareSortKeys,
  propertySortKey,
  resolvePropertyKind,
  type PropertyKind,
} from '../objects/propertyFormat'

/** The sort a grid applies (or a server applied). */
export interface DataGridSort {
  columnId: string
  direction: 'ascending' | 'descending'
}

/** The part of a column the model needs. */
export interface SortableColumn<Row> {
  id: string
  accessor?: (row: Row) => unknown
  sortValue?: (row: Row) => string | number | null
  kind?: PropertyKind
  format?: string
}

/** A column's value for a row: its accessor, else the row's own field. */
export function cellValue<Row>(column: SortableColumn<Row>, row: Row): unknown {
  if (column.accessor) return column.accessor(row)
  return row && typeof row === 'object' ? (row as Record<string, unknown>)[column.id] : undefined
}

/**
 * Rows sorted by a column. Stable, and empty values stay last in both
 * directions.
 */
export function sortRows<Row>(
  rows: readonly Row[],
  column: SortableColumn<Row> | undefined,
  direction: DataGridSort['direction'],
  locale = 'en',
): readonly Row[] {
  if (!column) return rows
  const keyed = rows.map((row, index) => {
    const value = cellValue(column, row)
    const key = column.sortValue
      ? column.sortValue(row)
      : propertySortKey(value, resolvePropertyKind(value, column.kind, column.format), { locale })
    return { row, index, key }
  })
  keyed.sort((left, right) => {
    if (left.key == null || right.key == null) {
      return compareSortKeys(left.key, right.key) || left.index - right.index
    }
    const order = compareSortKeys(left.key, right.key)
    return (direction === 'ascending' ? order : -order) || left.index - right.index
  })
  return keyed.map(entry => entry.row)
}

/** The next sort after activating a column header: ascending, descending, off. */
export function nextSort(current: DataGridSort | null, columnId: string): DataGridSort | null {
  if (current?.columnId !== columnId) return { columnId, direction: 'ascending' }
  return current.direction === 'ascending' ? { columnId, direction: 'descending' } : null
}

/** First and last (exclusive) row index to render. */
export interface RowWindow {
  start: number
  end: number
}

/**
 * The rows intersecting the viewport plus `overscan` rows on each side.
 * With virtualisation off every row is in the window.
 */
export function rowWindow(
  rowCount: number,
  scrollTop: number,
  viewportHeight: number,
  rowHeight: number,
  overscan: number,
  virtualize: boolean,
): RowWindow {
  if (!virtualize || rowHeight <= 0) return { start: 0, end: rowCount }
  const first = Math.floor(Math.max(0, scrollTop) / rowHeight)
  const visible = Math.ceil(Math.max(viewportHeight, rowHeight) / rowHeight) + 1
  return {
    start: Math.max(0, first - overscan),
    end: Math.min(rowCount, first + visible + overscan),
  }
}

/** The scroll offset that brings a row fully into view below a sticky header. */
export function scrollOffsetFor(
  rowIndex: number,
  scrollTop: number,
  viewportHeight: number,
  rowHeight: number,
  headerHeight: number,
): number {
  const top = rowIndex * rowHeight
  const bottom = top + rowHeight
  const visibleHeight = Math.max(rowHeight, viewportHeight - headerHeight)
  if (top < scrollTop) return top
  if (bottom > scrollTop + visibleHeight) return bottom - visibleHeight
  return scrollTop
}

/** Keys between an anchor and a target, inclusive, in row order. */
export function rangeKeys(orderedKeys: readonly string[], anchor: string, target: string): string[] {
  const from = orderedKeys.indexOf(anchor)
  const to = orderedKeys.indexOf(target)
  if (from < 0 || to < 0) return [target]
  const [low, high] = from <= to ? [from, to] : [to, from]
  return orderedKeys.slice(low, high + 1)
}

/** The focused cell: row -1 is the header row. */
export interface GridPosition {
  row: number
  column: number
}

/**
 * The cell a navigation key moves to, or null for keys the grid does not
 * handle. Rows run from -1 (header) to `rowCount - 1`.
 */
export function moveFocus(
  position: GridPosition,
  key: string,
  { rowCount, columnCount, pageRows, ctrl }: { rowCount: number; columnCount: number; pageRows: number; ctrl: boolean },
): GridPosition | null {
  const lastRow = rowCount - 1
  const lastColumn = columnCount - 1
  const clampRow = (row: number) => Math.max(-1, Math.min(lastRow, row))
  switch (key) {
    case 'ArrowDown': return { ...position, row: clampRow(position.row + 1) }
    case 'ArrowUp': return { ...position, row: clampRow(position.row - 1) }
    case 'ArrowRight': return { ...position, column: Math.min(lastColumn, position.column + 1) }
    case 'ArrowLeft': return { ...position, column: Math.max(0, position.column - 1) }
    case 'PageDown': return { ...position, row: clampRow(Math.max(0, position.row) + pageRows) }
    case 'PageUp': return { ...position, row: Math.max(rowCount > 0 ? 0 : -1, position.row - pageRows) }
    case 'Home': return ctrl ? { row: rowCount > 0 ? 0 : -1, column: 0 } : { ...position, column: 0 }
    case 'End': return ctrl ? { row: lastRow, column: lastColumn } : { ...position, column: lastColumn }
    default: return null
  }
}

/** A column as the width fit sees it. */
export interface FitColumn {
  /** Its natural width: set, resized, or measured from its content. */
  width: number
  /** The narrowest it may give way to. */
  min: number
  /** Whether it gives way when the grid is too narrow (content-sized text). */
  shrink: boolean
  /** Columns of a higher tier give way only once lower tiers are at their minimum. */
  tier?: number
}

/**
 * Column widths that fit the available width. Columns keep their natural
 * width when they all fit; otherwise the columns that may shrink give way,
 * lowest tier first, each in proportion to how far it can (never below its
 * minimum), and whatever still does not fit scrolls. Numbers, dates and set
 * widths never shrink, so a value is never cut mid-number.
 */
export function fitColumnWidths(columns: readonly FitColumn[], available: number): number[] {
  const widths = columns.map(column => Math.max(0, Math.round(column.width)))
  let excess = widths.reduce((total, width) => total + width, 0) - Math.floor(available)
  if (available <= 0 || excess <= 0) return widths
  const tiers = [...new Set(columns.filter(column => column.shrink).map(column => column.tier ?? 0))].sort((a, b) => a - b)
  for (const tier of tiers) {
    if (excess <= 0) break
    const room = columns.map((column, index) => (
      column.shrink && (column.tier ?? 0) === tier ? Math.max(0, widths[index]! - Math.round(column.min)) : 0
    ))
    const total = room.reduce((sum, value) => sum + value, 0)
    if (total === 0) continue
    const take = Math.min(excess, total)
    // Hand out the reduction in proportion, then settle the rounding on the
    // columns with the most room so the tier gives exactly `take`.
    const cuts = room.map(value => Math.floor((value * take) / total))
    let remaining = take - cuts.reduce((sum, value) => sum + value, 0)
    const byRoom = room.map((value, index) => ({ value, index })).sort((a, b) => b.value - a.value || a.index - b.index)
    for (const { index } of byRoom) {
      if (remaining <= 0) break
      if (cuts[index]! < room[index]!) {
        cuts[index]! += 1
        remaining -= 1
      }
    }
    cuts.forEach((cut, index) => { widths[index]! -= cut })
    excess -= take
  }
  return widths
}
