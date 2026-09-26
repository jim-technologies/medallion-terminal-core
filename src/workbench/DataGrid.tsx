import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { Skeleton } from '../components/Display'
import { Icon } from '../components/Icon'
import { navigateOnPlainClick } from '../components/navigation'
import { MenuPopup, useDismissableLayer, type MenuItem } from '../components/Overlays'
import { cx } from '../components/utils'
import {
  useDesignSystem,
  useLocale,
  useMessage,
  usePortalContainer,
} from '../foundations/DesignSystemProvider'
import type { Density, StatusTone } from '../foundations/types'
import { PropertyValue } from '../objects/PropertyValue'
import {
  formatPropertyText,
  isNumericKind,
  resolvePropertyKind,
  type PropertyKind,
} from '../objects/propertyFormat'
import {
  cellValue,
  fitColumnWidths,
  moveFocus,
  nextSort,
  rangeKeys,
  rowWindow,
  scrollOffsetFor,
  sortRows,
  type DataGridSort,
  type GridPosition,
} from './dataGridModel'
import { EmptyState } from './States'

export type { DataGridSort } from './dataGridModel'

/** What a custom cell renderer receives besides the row. */
export interface DataGridCellContext {
  /** The column's value for this row. */
  value: unknown
  /** Position in the displayed (sorted) rows. */
  rowIndex: number
  /** Whether the row is selected. */
  selected: boolean
}

/** One grid column. */
export interface DataGridColumn<Row> {
  /** Stable id; also the row field read when there is no accessor. */
  id: string
  /** Header text and the column's accessible name. */
  header: string
  /** Reads the value; defaults to `row[id]`. */
  accessor?: (row: Row) => unknown
  /** Typed rendering and alignment when there is no custom `cell`. */
  kind?: PropertyKind
  /** Kind refinement such as `currency:USD`. */
  format?: string
  /** Status tones for enum values. */
  tones?: Readonly<Record<string, StatusTone>>
  /** Custom cell content. Keep it one line; rows have a fixed height. */
  cell?: (row: Row, context: DataGridCellContext) => ReactNode
  /**
   * Width in pixels. Unset, the column is sized to its content (its header
   * and the rows in view, at most 360 px), and a text column gives way when
   * the grid is narrower than its columns; numbers, dates and Yes/No never
   * do, so the grid scrolls rather than cut a value.
   */
  width?: number
  /**
   * Narrowest width: a resize stops here (48 when unset), and a
   * content-sized text column never gives way below it (72 when unset, 96
   * for the primary column, which gives way last).
   */
  minWidth?: number
  /** Takes the remaining width; the last column grows when none does. */
  grow?: boolean
  /** Alignment; numeric kinds align to the end. */
  align?: 'start' | 'end'
  /** Allows sorting by this column (true when unset). */
  sortable?: boolean
  /** Sort key; defaults to the typed value. */
  sortValue?: (row: Row) => string | number | null
  /** Sticks to the start while scrolling horizontally (leading columns only). */
  pinned?: boolean
  /** Carries the row link; the first column does when none is primary. */
  primary?: boolean
}

/** Props for the windowed data grid. */
export interface DataGridProps<Row> {
  /** Accessible name of the grid. */
  label: string
  /** Column definitions. */
  columns: readonly DataGridColumn<Row>[]
  /** Rows, in order (or already sorted, with `sortMode="server"`). */
  rows: readonly Row[]
  /** Stable row identity. */
  rowKey: (row: Row, index: number) => string
  /** Row name for selection checkboxes and menus; defaults to the first column's text. */
  rowLabel?: (row: Row) => string
  /** `multi` adds a checkbox column and range selection. */
  selection?: 'none' | 'single' | 'multi'
  /** Controlled selection. */
  selectedKeys?: readonly string[]
  /** Initial selection when uncontrolled. */
  defaultSelectedKeys?: readonly string[]
  /** Called with the full selection after every change. */
  onSelectionChange?: (keys: string[]) => void
  /** Controlled sort; `null` is unsorted. */
  sort?: DataGridSort | null
  /** Initial sort when uncontrolled. */
  defaultSort?: DataGridSort | null
  /** Called when a header asks for a new sort. */
  onSortChange?: (sort: DataGridSort | null) => void
  /** `server` shows rows as given and only reports the requested sort. */
  sortMode?: 'client' | 'server'
  /** Enter or double-click on a row. Without it, a row link is followed. */
  onRowActivate?: (row: Row) => void
  /** One link per row, on the primary column. */
  rowHref?: (row: Row) => string | undefined
  /** Host navigation for a plain click on the row link. */
  onNavigate?: (row: Row, event: MouseEvent<HTMLAnchorElement>) => void
  /** Commands for the context menu (right-click, the Menu key, Shift+F10). */
  contextActions?: (row: Row) => readonly MenuItem[]
  /** F2 on a cell, or a double-click on it: rename or edit it. */
  onCellEdit?: (row: Row, columnId: string) => void
  /** Called once per page when the last rows come into view. */
  onEndReached?: () => void
  /** Known total, when larger than the rows loaded so far. */
  totalRows?: number
  /** Shows skeleton rows (no rows yet) or a loading-more row. */
  loading?: boolean
  /** Shown when there are no rows and nothing is loading. */
  empty?: ReactNode
  /** Row density; the scope's when unset. */
  density?: Density
  /** Fixed row height in pixels; the density's when unset. */
  rowHeight?: number
  /** Viewport height (CSS or pixels); fills the parent by default. */
  height?: number | string
  /** Renders only the rows in view (`auto`: above 200 rows). */
  virtualize?: boolean | 'auto'
  /** Rows rendered beyond each edge of the viewport. */
  overscan?: number
  /** Content under the grid, such as Pagination. */
  footer?: ReactNode
  /** Stable `data-*` hooks per row, such as the entry kind. */
  rowProps?: (row: Row) => Readonly<Record<`data-${string}`, string | undefined>>
  /** Additional class for the outer element. */
  className?: string
}

const ROW_HEIGHT: Record<Density, number> = { compact: 28, standard: 32, comfortable: 40 }
// A content-sized column before it is measured (and without a DOM).
const DEFAULT_WIDTH = 160
// Content-sized columns are measured up to this width; longer text truncates.
const MAX_CONTENT_WIDTH = 360
// Content-sized text columns give way down to these widths by default; the
// primary column (the row's name) gives way last and keeps more.
const FIT_MIN_WIDTH = 72
const PRIMARY_FIT_MIN_WIDTH = 96
const RESIZE_MIN_WIDTH = 48
// Room kept in a sortable header for the sort arrow (icon plus gap).
const SORT_ICON_ROOM = 20
const SELECTION_WIDTH = 40
const RESIZE_STEP = 16
const SKELETON_ROWS = 8
const EMPTY_HEIGHT = 160

type RenderedColumn<Row> =
  | { kind: 'select'; width: number }
  | { kind: 'data'; column: DataGridColumn<Row>; width: number; contentSized: boolean }

// Kinds whose text must never be cut: they keep their width and the grid
// scrolls instead.
const RIGID_KINDS = new Set<PropertyKind>(['number', 'integer', 'currency', 'percent', 'bytes', 'date', 'datetime', 'boolean'])

/** Whether a content-sized column may give way: start-aligned text. */
function isTextColumn<Row>(column: DataGridColumn<Row>, sample: unknown): boolean {
  if (column.align === 'end') return false
  if (column.cell && !column.kind && !column.format) return true
  return !RIGID_KINDS.has(resolvePropertyKind(sample, column.kind, column.format).kind)
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.dataset.gridSelect === 'true') return false
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
}

/**
 * A dense, windowed data grid on the WAI-ARIA grid pattern: one tab stop,
 * arrows, Home/End (Ctrl for the corners), PageUp/PageDown, Enter to open,
 * Space to select, Shift for ranges, the Menu key or Shift+F10 for row
 * actions and F2 to edit. Headers sort and resize (drag, or Alt+arrows).
 * Above 200 rows only the rows in view are rendered, so ten thousand rows
 * stay under 1,500 DOM nodes. Cells render typed values with
 * `PropertyValue` unless a column supplies its own content.
 */
export function DataGrid<Row>({
  label,
  columns,
  rows,
  rowKey,
  rowLabel,
  selection = 'none',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  sort,
  defaultSort = null,
  onSortChange,
  sortMode = 'client',
  onRowActivate,
  rowHref,
  onNavigate,
  contextActions,
  onCellEdit,
  onEndReached,
  totalRows,
  loading = false,
  empty,
  density,
  rowHeight,
  height = '100%',
  virtualize = 'auto',
  overscan = 8,
  footer,
  rowProps,
  className,
}: DataGridProps<Row>) {
  const t = useMessage()
  const { locale, timeZone } = useLocale()
  const scope = useDesignSystem()
  const portal = usePortalContainer()
  const resolvedDensity = density ?? scope?.density ?? 'standard'
  const lineHeight = rowHeight ?? ROW_HEIGHT[resolvedDensity]

  const rootRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const focusPending = useRef(false)
  const anchorKey = useRef<string | null>(null)
  const endRequestedAt = useRef(-1)

  const [internalSort, setInternalSort] = useState<DataGridSort | null>(defaultSort)
  const activeSort = sort !== undefined ? sort : internalSort
  const [internalSelection, setInternalSelection] = useState<readonly string[]>(defaultSelectedKeys ?? [])
  const selectedList = selectedKeys ?? internalSelection
  const selectedSet = useMemo(() => new Set(selectedList), [selectedList])
  const [widths, setWidths] = useState<Record<string, number>>({})
  // Content widths of the content-sized columns, measured after render.
  const [measured, setMeasured] = useState<Record<string, number>>({})
  const measuredRef = useRef(measured)
  measuredRef.current = measured
  const measureBasis = useRef<{ rows: readonly Row[]; columns: readonly DataGridColumn<Row>[]; key: string; fonts: number } | null>(null)
  const [fontEpoch, setFontEpoch] = useState(0)
  const [active, setActive] = useState<GridPosition>(() => ({
    row: rows.length > 0 ? 0 : -1,
    column: selection === 'multi' ? 1 : 0,
  }))
  const [viewport, setViewport] = useState({ scrollTop: 0, height: 600, width: 0 })
  const [menu, setMenu] = useState<{ rowIndex: number; x: number; y: number } | null>(null)

  const displayRows = useMemo(() => {
    if (sortMode !== 'client' || !activeSort) return rows
    return sortRows(rows, columns.find(column => column.id === activeSort.columnId), activeSort.direction, locale)
  }, [rows, columns, activeSort, sortMode, locale])
  const keys = useMemo(() => displayRows.map((row, index) => rowKey(row, index)), [displayRows, rowKey])

  // Natural widths (set, resized or measured), fitted to the viewport.
  const sample = displayRows[0]
  const renderedColumns = useMemo<RenderedColumn<Row>[]>(() => {
    const entries = [
      ...(selection === 'multi' ? [{ kind: 'select' as const, width: SELECTION_WIDTH }] : []),
      ...columns.map(column => {
        const contentSized = column.width === undefined && widths[column.id] === undefined
        return {
          kind: 'data' as const,
          column,
          contentSized,
          width: widths[column.id] ?? column.width ?? measured[column.id] ?? DEFAULT_WIDTH,
        }
      }),
    ]
    const primaryId = (columns.find(column => column.primary) ?? columns[0])?.id
    const fitted = fitColumnWidths(entries.map(entry => {
      if (entry.kind === 'select') return { width: entry.width, min: entry.width, shrink: false }
      const primary = entry.column.id === primaryId
      return {
        width: entry.width,
        min: Math.min(entry.width, entry.column.minWidth ?? (primary ? PRIMARY_FIT_MIN_WIDTH : FIT_MIN_WIDTH)),
        shrink: entry.contentSized && isTextColumn(entry.column, sample === undefined ? undefined : cellValue(entry.column, sample)),
        tier: primary ? 1 : 0,
      }
    }), viewport.width)
    return entries.map((entry, index) => ({ ...entry, width: fitted[index]! }))
  }, [columns, selection, widths, measured, viewport.width, sample])
  const growIndex = useMemo(() => {
    const explicit = renderedColumns.findIndex(entry => entry.kind === 'data' && entry.column.grow)
    return explicit >= 0 ? explicit : renderedColumns.length - 1
  }, [renderedColumns])
  const template = renderedColumns
    .map((entry, index) => index === growIndex ? `minmax(${entry.width}px, 1fr)` : `${entry.width}px`)
    .join(' ')
  const minWidth = renderedColumns.reduce((total, entry) => total + entry.width, 0)
  const pinnedOffsets = useMemo(() => {
    const offsets = new Map<number, number>()
    let offset = 0
    for (const [index, entry] of renderedColumns.entries()) {
      const pinned = entry.kind === 'select' || entry.column.pinned
      if (!pinned) break
      offsets.set(index, offset)
      offset += entry.width
    }
    // A selection column alone does not pin.
    return renderedColumns.some(entry => entry.kind === 'data' && entry.column.pinned) ? offsets : new Map()
  }, [renderedColumns])
  const primaryIndex = useMemo(() => {
    const explicit = renderedColumns.findIndex(entry => entry.kind === 'data' && entry.column.primary)
    return explicit >= 0 ? explicit : renderedColumns.findIndex(entry => entry.kind === 'data')
  }, [renderedColumns])

  const virtual = virtualize === 'auto' ? displayRows.length > 200 : virtualize
  const range = rowWindow(displayRows.length, viewport.scrollTop, viewport.height, lineHeight, overscan, virtual)
  const skeleton = loading && displayRows.length === 0
  const showEmpty = !loading && displayRows.length === 0
  const extraRows = skeleton ? SKELETON_ROWS : loading && displayRows.length > 0 ? 1 : 0
  const bodyHeight = showEmpty ? EMPTY_HEIGHT : (displayRows.length + extraRows) * lineHeight

  const labelFor = useCallback((row: Row): string => {
    if (rowLabel) return rowLabel(row)
    const first = columns[0]
    if (!first) return ''
    const value = cellValue(first, row)
    return formatPropertyText(value, resolvePropertyKind(value, first.kind, first.format), { locale, timeZone })
  }, [rowLabel, columns, locale, timeZone])

  const updateSelection = useCallback((next: string[]) => {
    if (selectedKeys === undefined) setInternalSelection(next)
    onSelectionChange?.(next)
  }, [selectedKeys, onSelectionChange])

  const applySort = (columnId: string) => {
    const next = nextSort(activeSort, columnId)
    if (sort === undefined) setInternalSort(next)
    onSortChange?.(next)
  }

  // Track the viewport so the rendered window follows scrolling and resizes.
  useLayoutEffect(() => {
    const element = viewportRef.current
    if (!element) return
    const measure = () => setViewport(current => (
      current.height === element.clientHeight
        && current.scrollTop === element.scrollTop
        && current.width === element.clientWidth
        ? current
        : { scrollTop: element.scrollTop, height: element.clientHeight, width: element.clientWidth }
    ))
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Measure the content-sized columns: give their header and rendered cells
  // max-content width for one synchronous reflow, read them, and put them
  // back before paint. While the rows and columns stay the same (a scroll of
  // a windowed grid) widths only grow, so columns do not jitter; new rows,
  // new column definitions (which may render new cell content, such as an
  // inline editor) or a font load measure afresh.
  const columnKey = renderedColumns.map(entry => (entry.kind === 'data' && entry.contentSized ? `${entry.column.id}*` : entry.kind === 'data' ? entry.column.id : '')).join('|')
  useLayoutEffect(() => {
    const root = rootRef.current
    const element = viewportRef.current
    if (!root || !element || !columnKey.includes('*')) return
    const basis = measureBasis.current
    const fresh = !basis || basis.rows !== rows || basis.columns !== columns || basis.key !== columnKey || basis.fonts !== fontEpoch
    measureBasis.current = { rows, columns, key: columnKey, fonts: fontEpoch }
    root.dataset.measuring = 'true'
    const current = measuredRef.current
    const next: Record<string, number> = {}
    renderedColumns.forEach((entry, index) => {
      if (entry.kind !== 'data' || !entry.contentSized) return
      let width = 0
      for (const cell of element.querySelectorAll<HTMLElement>(`[aria-colindex="${index + 1}"]`)) {
        const header = cell.getAttribute('role') === 'columnheader'
        const sorted = cell.getAttribute('aria-sort') === 'ascending' || cell.getAttribute('aria-sort') === 'descending'
        const room = header && entry.column.sortable !== false && !sorted ? SORT_ICON_ROOM : 0
        width = Math.max(width, cell.getBoundingClientRect().width + room)
      }
      // A hidden grid measures nothing; keep what it had.
      if (width <= 0) {
        if (current[entry.column.id] !== undefined) next[entry.column.id] = current[entry.column.id]!
        return
      }
      const content = Math.min(MAX_CONTENT_WIDTH, Math.ceil(width))
      next[entry.column.id] = fresh ? content : Math.max(content, current[entry.column.id] ?? 0)
    })
    delete root.dataset.measuring
    const keys = Object.keys(next)
    if (keys.length !== Object.keys(current).length || keys.some(key => current[key] !== next[key])) setMeasured(next)
  }, [rows, columns, displayRows, columnKey, range.start, range.end, fontEpoch, renderedColumns])

  // Web fonts change text metrics; measure again once they have loaded.
  useEffect(() => {
    const fonts = typeof document === 'undefined' ? undefined : document.fonts
    if (!fonts?.addEventListener) return
    const bump = () => setFontEpoch(value => value + 1)
    fonts.addEventListener('loadingdone', bump)
    return () => fonts.removeEventListener('loadingdone', bump)
  }, [])

  // Near the end: the last rows (half the overscan) are inside the viewport.
  const endThreshold = (count: number) => (count - Math.max(1, Math.floor(overscan / 2))) * lineHeight
  const nearEnd = viewport.scrollTop + viewport.height >= endThreshold(displayRows.length)

  const onScroll = () => {
    const element = viewportRef.current
    if (!element) return
    const next = rowWindow(displayRows.length, element.scrollTop, element.clientHeight, lineHeight, overscan, virtual)
    const nextNearEnd = element.scrollTop + element.clientHeight >= endThreshold(displayRows.length)
    if (next.start !== range.start || next.end !== range.end || (onEndReached && nextNearEnd !== nearEnd)) {
      setViewport({ scrollTop: element.scrollTop, height: element.clientHeight, width: element.clientWidth })
    }
  }

  // Keep the active cell inside the grid as rows and columns change.
  useEffect(() => {
    setActive(current => {
      const row = current.row < 0 || displayRows.length === 0 ? -1 : Math.min(current.row, displayRows.length - 1)
      const column = Math.max(0, Math.min(current.column, renderedColumns.length - 1))
      return row === current.row && column === current.column ? current : { row, column }
    })
  }, [displayRows.length, renderedColumns.length])

  // Move DOM focus after a keyboard move rendered the target cell.
  useLayoutEffect(() => {
    if (!focusPending.current) return
    focusPending.current = false
    viewportRef.current
      ?.querySelector<HTMLElement>(`[data-cell="${active.row}:${active.column}"]`)
      ?.focus({ preventScroll: true })
  })

  // Ask for the next page once per page when its last rows are in view.
  useEffect(() => {
    if (!onEndReached || loading || displayRows.length === 0) return
    if (totalRows !== undefined && displayRows.length >= totalRows) return
    if (!nearEnd || endRequestedAt.current === displayRows.length) return
    endRequestedAt.current = displayRows.length
    onEndReached()
  }, [onEndReached, loading, displayRows.length, totalRows, nearEnd])

  const focusCell = (position: GridPosition) => {
    const element = viewportRef.current
    if (element && position.row >= 0) {
      const next = scrollOffsetFor(position.row, element.scrollTop, element.clientHeight, lineHeight, lineHeight)
      if (next !== element.scrollTop) {
        element.scrollTop = next
        setViewport({ scrollTop: next, height: element.clientHeight, width: element.clientWidth })
      }
    }
    focusPending.current = true
    setActive(position)
  }

  const toggleRow = (key: string, range: boolean) => {
    if (selection === 'single') {
      updateSelection([key])
      anchorKey.current = key
      return
    }
    if (selection !== 'multi') return
    if (range && anchorKey.current) {
      updateSelection([...new Set([...selectedList, ...rangeKeys(keys, anchorKey.current, key)])])
      return
    }
    updateSelection(selectedSet.has(key) ? selectedList.filter(item => item !== key) : [...selectedList, key])
    anchorKey.current = key
  }

  const activateRow = (rowIndex: number) => {
    const row = displayRows[rowIndex]
    if (row === undefined) return
    if (onRowActivate) {
      onRowActivate(row)
      return
    }
    viewportRef.current
      ?.querySelector<HTMLAnchorElement>(`[data-row-index="${rowIndex}"] a[data-row-link]`)
      ?.click()
  }

  const openMenu = (rowIndex: number, x: number, y: number) => {
    const row = displayRows[rowIndex]
    if (row === undefined || !contextActions || contextActions(row).length === 0) return
    setMenu({ rowIndex, x, y })
  }
  const closeMenu = useCallback(() => {
    setMenu(null)
    focusPending.current = true
  }, [])
  useDismissableLayer(menu !== null, menuRef, closeMenu)

  const resizeColumn = (columnIndex: number, delta: number) => {
    const entry = renderedColumns[columnIndex]
    if (!entry || entry.kind !== 'data') return
    const next = Math.max(entry.column.minWidth ?? RESIZE_MIN_WIDTH, entry.width + delta)
    setWidths(current => ({ ...current, [entry.column.id]: next }))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isEditableTarget(event.target) || menu) return
    const { row, column } = active
    const rowCount = displayRows.length
    const pageRows = Math.max(1, Math.floor((viewportRef.current?.clientHeight ?? lineHeight * 10) / lineHeight) - 1)
    const entry = renderedColumns[column]

    if (row < 0 && event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault()
      resizeColumn(column, event.key === 'ArrowRight' ? RESIZE_STEP : -RESIZE_STEP)
      return
    }
    const moved = moveFocus(active, event.key, {
      rowCount,
      columnCount: renderedColumns.length,
      pageRows,
      ctrl: event.ctrlKey || event.metaKey,
    })
    if (moved) {
      event.preventDefault()
      if (event.shiftKey && selection === 'multi' && moved.row >= 0 && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
        const target = keys[moved.row]
        if (target) {
          if (!anchorKey.current) anchorKey.current = keys[Math.max(0, row)] ?? target
          updateSelection([...new Set([...selectedList, ...rangeKeys(keys, anchorKey.current, target)])])
        }
      }
      focusCell(moved)
      return
    }
    if (row < 0) {
      if ((event.key === 'Enter' || event.key === ' ') && entry?.kind === 'data' && entry.column.sortable !== false) {
        event.preventDefault()
        applySort(entry.column.id)
      } else if (event.key === ' ' && entry?.kind === 'select' && selection === 'multi') {
        event.preventDefault()
        updateSelection(selectedList.length === keys.length ? [] : [...keys])
      }
      return
    }
    const key = keys[row]
    if (event.key === 'Enter') {
      event.preventDefault()
      activateRow(row)
    } else if (event.key === ' ' && key) {
      event.preventDefault()
      toggleRow(key, event.shiftKey)
    } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a' && selection === 'multi') {
      event.preventDefault()
      updateSelection([...keys])
    } else if (event.key === 'F2' && onCellEdit && entry?.kind === 'data') {
      event.preventDefault()
      const target = displayRows[row]
      if (target !== undefined) onCellEdit(target, entry.column.id)
    } else if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
      event.preventDefault()
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      openMenu(row, rect.left + 12, rect.bottom)
    }
  }

  const onRowClick = (event: MouseEvent<HTMLDivElement>, rowIndex: number) => {
    const key = keys[rowIndex]
    if (!key || selection === 'none') return
    const target = event.target as HTMLElement
    if (target.closest('a, button, input, select, textarea')) return
    if (selection === 'multi' && (event.shiftKey || event.metaKey || event.ctrlKey)) {
      toggleRow(key, event.shiftKey)
    } else {
      updateSelection([key])
      anchorKey.current = key
    }
  }

  const startResize = (event: PointerEvent<HTMLSpanElement>, columnIndex: number) => {
    event.preventDefault()
    event.stopPropagation()
    const startX = event.clientX
    const entry = renderedColumns[columnIndex]
    if (!entry || entry.kind !== 'data') return
    const startWidth = entry.width
    const min = entry.column.minWidth ?? RESIZE_MIN_WIDTH
    const id = entry.column.id
    const onMove = (move: globalThis.PointerEvent) => {
      setWidths(current => ({ ...current, [id]: Math.max(min, startWidth + move.clientX - startX) }))
    }
    const onUp = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
    }
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onUp)
  }

  const cellProps = (rowIndex: number, columnIndex: number) => {
    const isActive = active.row === rowIndex && active.column === columnIndex
    const offset = pinnedOffsets.get(columnIndex)
    const entry = renderedColumns[columnIndex]
    return {
      'data-cell': `${rowIndex}:${columnIndex}`,
      'data-fit': entry?.kind === 'data' && entry.contentSized ? 'content' : undefined,
      tabIndex: isActive ? 0 : -1,
      'aria-colindex': columnIndex + 1,
      'data-pinned': offset !== undefined || undefined,
      style: offset !== undefined ? { left: offset } : undefined,
      onFocus: () => {
        if (!isActive) setActive({ row: rowIndex, column: columnIndex })
      },
    }
  }

  const rowIndices: number[] = []
  for (let index = range.start; index < range.end; index++) rowIndices.push(index)
  if (active.row >= 0 && active.row < displayRows.length && (active.row < range.start || active.row >= range.end)) {
    rowIndices.push(active.row)
  }

  const allSelected = selection === 'multi' && keys.length > 0 && keys.every(key => selectedSet.has(key))
  const someSelected = selection === 'multi' && !allSelected && keys.some(key => selectedSet.has(key))
  const menuRow = menu ? displayRows[menu.rowIndex] : undefined
  const gridStyle = {
    '--mtc-grid-template': template,
    '--mtc-grid-min-width': `${minWidth}px`,
    '--mtc-grid-row-height': `${lineHeight}px`,
    '--mtc-grid-viewport-width': viewport.width > 0 ? `${viewport.width}px` : '100%',
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      className={cx('mtc-data-grid', density && `mtc-density-${density}`, className)}
      style={{ ...gridStyle, height }}
    >
      <div
        ref={viewportRef}
        role="grid"
        aria-label={label}
        aria-rowcount={(totalRows ?? displayRows.length) + 1}
        aria-colcount={renderedColumns.length}
        aria-multiselectable={selection === 'multi' || undefined}
        aria-busy={loading || undefined}
        className="mtc-data-grid-viewport"
        onKeyDown={onKeyDown}
        onScroll={onScroll}
      >
        <div role="rowgroup" className="mtc-data-grid-head">
          <div role="row" aria-rowindex={1} className="mtc-data-grid-row mtc-data-grid-header-row">
            {renderedColumns.map((entry, columnIndex) => {
              if (entry.kind === 'select') {
                return (
                  <div key="__select" role="columnheader" className="mtc-data-grid-cell mtc-data-grid-select" {...cellProps(-1, columnIndex)}>
                    <input
                      type="checkbox"
                      tabIndex={-1}
                      data-grid-select="true"
                      aria-label={t('dataGrid.selectAll')}
                      checked={allSelected}
                      ref={node => { if (node) node.indeterminate = someSelected }}
                      onMouseDown={event => event.preventDefault()}
                      onChange={() => updateSelection(allSelected ? [] : [...keys])}
                    />
                  </div>
                )
              }
              const { column } = entry
              const sorted = activeSort?.columnId === column.id ? activeSort.direction : undefined
              const numeric = column.align === 'end' || (!column.align && !column.cell && isNumericKind(resolvePropertyKind(undefined, column.kind, column.format).kind))
              const sortable = column.sortable !== false
              return (
                <div
                  key={column.id}
                  role="columnheader"
                  aria-sort={sorted ?? (sortable ? 'none' : undefined)}
                  className="mtc-data-grid-cell mtc-data-grid-header-cell"
                  data-align={numeric ? 'end' : 'start'}
                  data-sortable={sortable || undefined}
                  {...cellProps(-1, columnIndex)}
                  onClick={sortable ? () => {
                    applySort(column.id)
                    setActive({ row: -1, column: columnIndex })
                  } : undefined}
                >
                  <span className="mtc-data-grid-header-label">{column.header}</span>
                  {sorted && <Icon name={sorted === 'ascending' ? 'sort-asc' : 'sort-desc'} className="mtc-data-grid-sort-icon" />}
                  <span
                    aria-hidden="true"
                    className="mtc-data-grid-resize"
                    onPointerDown={event => startResize(event, columnIndex)}
                    onClick={event => event.stopPropagation()}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <div role="rowgroup" className="mtc-data-grid-body" style={{ height: bodyHeight }}>
          {rowIndices.map(rowIndex => {
            const row = displayRows[rowIndex]!
            const key = keys[rowIndex]!
            const selected = selectedSet.has(key)
            const href = rowHref?.(row)
            return (
              <div
                key={key}
                role="row"
                aria-rowindex={rowIndex + 2}
                aria-selected={selection === 'none' ? undefined : selected}
                data-row-index={rowIndex}
                data-selected={selected || undefined}
                className="mtc-data-grid-row"
                style={{ top: rowIndex * lineHeight }}
                {...rowProps?.(row)}
                onClick={event => onRowClick(event, rowIndex)}
                // A double-click opens or edits; it should not select text.
                onMouseDown={event => {
                  if (event.detail > 1) event.preventDefault()
                }}
                onDoubleClick={event => {
                  const target = event.target as HTMLElement
                  if (target.closest('a, button, input, select, textarea')) return
                  // An editable grid edits the double-clicked cell; others open the row.
                  const columnId = target.closest<HTMLElement>('[data-column-id]')?.dataset.columnId
                  if (onCellEdit && columnId) onCellEdit(row, columnId)
                  else activateRow(rowIndex)
                }}
                onContextMenu={contextActions ? event => {
                  event.preventDefault()
                  if (selection !== 'none' && !selected) updateSelection([key])
                  setActive({ row: rowIndex, column: active.column })
                  openMenu(rowIndex, event.clientX, event.clientY)
                } : undefined}
              >
                {renderedColumns.map((entry, columnIndex) => {
                  if (entry.kind === 'select') {
                    return (
                      <div key="__select" role="gridcell" className="mtc-data-grid-cell mtc-data-grid-select" {...cellProps(rowIndex, columnIndex)}>
                        <input
                          type="checkbox"
                          tabIndex={-1}
                          data-grid-select="true"
                          aria-label={t('dataGrid.selectRow', { label: labelFor(row) })}
                          checked={selected}
                          onMouseDown={event => event.preventDefault()}
                          onChange={event => toggleRow(key, (event.nativeEvent as globalThis.MouseEvent).shiftKey === true)}
                        />
                      </div>
                    )
                  }
                  const { column } = entry
                  const value = cellValue(column, row)
                  const resolved = resolvePropertyKind(value, column.kind, column.format)
                  const numeric = column.align === 'end' || (!column.align && !column.cell && isNumericKind(resolved.kind))
                  const content = column.cell
                    ? column.cell(row, { value, rowIndex, selected })
                    : (
                      <PropertyValue
                        value={value}
                        kind={column.kind}
                        format={column.format}
                        tones={column.tones}
                        context="grid"
                      />
                    )
                  return (
                    <div
                      key={column.id}
                      role="gridcell"
                      className="mtc-data-grid-cell"
                      data-column-id={column.id}
                      data-align={numeric ? 'end' : 'start'}
                      {...cellProps(rowIndex, columnIndex)}
                    >
                      {href && columnIndex === primaryIndex ? (
                        <a
                          href={href}
                          tabIndex={-1}
                          data-row-link="true"
                          className="mtc-data-grid-row-link"
                          onClick={navigateOnPlainClick(onNavigate ? linkEvent => onNavigate(row, linkEvent) : undefined)}
                        >
                          {content}
                        </a>
                      ) : content}
                    </div>
                  )
                })}
              </div>
            )
          })}
          {skeleton && Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <div key={`__skeleton-${index}`} role="row" aria-hidden="true" className="mtc-data-grid-row" data-skeleton="true" style={{ top: index * lineHeight }}>
              {renderedColumns.map((_, columnIndex) => (
                <div key={columnIndex} className="mtc-data-grid-cell"><Skeleton width={`${50 + ((index * 7 + columnIndex * 13) % 40)}%`} /></div>
              ))}
            </div>
          ))}
          {skeleton && (
            <div role="row" className="mtc-visually-hidden">
              <div role="gridcell">{t('dataGrid.loading')}</div>
            </div>
          )}
          {loading && displayRows.length > 0 && (
            <div role="row" className="mtc-data-grid-row mtc-data-grid-status-row" style={{ top: displayRows.length * lineHeight }}>
              <div role="gridcell" aria-colspan={renderedColumns.length} className="mtc-data-grid-cell">
                {t('dataGrid.loadingMore')}
              </div>
            </div>
          )}
          {showEmpty && (
            <div role="row" className="mtc-data-grid-row mtc-data-grid-empty-row" style={{ top: 0, height: EMPTY_HEIGHT }}>
              <div role="gridcell" aria-colspan={renderedColumns.length} className="mtc-data-grid-cell">
                {empty ?? <EmptyState compact title={t('dataGrid.empty')} />}
              </div>
            </div>
          )}
        </div>
      </div>
      {footer && <div className="mtc-data-grid-footer">{footer}</div>}
      {menu && menuRow !== undefined && contextActions && (() => {
        const layer = (
          <div ref={menuRef} className="mtc-data-grid-menu-layer">
            <MenuPopup
              label={t('dataGrid.rowActions', { label: labelFor(menuRow) })}
              items={contextActions(menuRow)}
              initialIndex={0}
              style={{ position: 'fixed', left: menu.x, top: menu.y }}
              onClose={closeMenu}
            />
          </div>
        )
        return portal ? createPortal(layer, portal) : layer
      })()}
    </div>
  )
}
