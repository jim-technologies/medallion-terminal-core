import { useMemo } from 'react'
import { useDashboard } from '../core/DashboardContext'
import { formatCompact } from './format'
import type { WidgetProps } from '../types/template'

interface Cell { row: number; col: number; value: number; label?: string }
interface HeatmapData {
  rows: string[]
  columns: string[]
  cells: Cell[]
  min: number
  max: number
  scale: 'sequential' | 'diverging'
}

interface AxisContext {
  key: string  // ctx key to set
}

const ROW_LABEL_W = 96
const COL_LABEL_H = 22

export function Heatmap({ data, options }: WidgetProps) {
  const { setCtx } = useDashboard()
  const h = useMemo(() => normalize(data), [data])
  if (!h) return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>

  const rowCtx = options?.row_context as AxisContext | undefined
  const colCtx = options?.col_context as AxisContext | undefined
  const clickable = !!(rowCtx || colCtx)
  const handleClick = (r: number, c: number) => {
    if (rowCtx) setCtx(rowCtx.key, h.rows[r])
    if (colCtx) setCtx(colCtx.key, h.columns[c])
  }

  const { rows, columns, cells, min, max, scale } = h
  const showLabels = cells.length <= 60

  // O(1) cell lookup. Memoised on `h` so unrelated parent re-renders
  // don't rebuild the grid.
  const grid = useMemo(() => {
    const g: (Cell | undefined)[][] = rows.map(() => Array(columns.length).fill(undefined))
    for (const c of cells) g[c.row][c.col] = c
    return g
  }, [rows, columns, cells])

  return (
    <div className="h-full w-full overflow-auto flex flex-col">
      <div
        className="inline-grid min-w-full"
        style={{
          gridTemplateColumns: `${ROW_LABEL_W}px repeat(${columns.length}, minmax(28px, 1fr))`,
          gap: 2,
        }}
      >
        {/* Top-left corner — sticky to both edges so it stays put when scrolling */}
        <div className="sticky left-0 top-0 z-20 bg-zinc-900" />
        {columns.map(col => (
          <div
            key={`c-${col}`}
            className="text-[10px] text-zinc-400 truncate text-center flex items-center justify-center sticky top-0 z-10 bg-zinc-900"
            style={{ height: COL_LABEL_H }}
          >
            {col}
          </div>
        ))}
        {rows.flatMap((rowLabel, r) => [
          <div
            key={`rl-${r}`}
            className="text-xs text-zinc-300 truncate pr-2 flex items-center justify-end sticky left-0 z-10 bg-zinc-900"
            style={{ minHeight: 30 }}
          >
            {rowLabel}
          </div>,
          ...columns.map((_, c) => {
            const cell = grid[r][c]
            if (!cell) return <div key={`e-${r}-${c}`} className="bg-zinc-900 rounded-sm" />
            const bg = colorFor(cell.value, min, max, scale)
            return (
              <div
                key={`cell-${r}-${c}`}
                onClick={clickable ? () => handleClick(r, c) : undefined}
                className={`rounded-sm flex items-center justify-center text-[10px] font-medium tabular-nums ${
                  clickable ? 'cursor-pointer hover:ring-1 hover:ring-zinc-400' : ''
                }`}
                style={{ backgroundColor: bg, minHeight: 30 }}
                title={`${rowLabel} × ${columns[c]}: ${cell.label ?? cell.value.toFixed(2)}`}
              >
                {showLabels && (
                  <span className="text-white/90">{cell.label ?? formatCell(cell.value)}</span>
                )}
              </div>
            )
          }),
        ])}
      </div>
      <Legend min={min} max={max} scale={scale} />
    </div>
  )
}

function Legend({ min, max, scale }: { min: number; max: number; scale: 'sequential' | 'diverging' }) {
  const stops = scale === 'diverging' ? [-1, -0.5, 0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1]
  const range = max - min
  return (
    <div className="flex items-center gap-2 mt-2 text-[10px] text-zinc-500 shrink-0">
      <span className="tabular-nums">{formatCompact(min)}</span>
      <div className="flex-1 max-w-[160px] flex h-2 rounded-sm overflow-hidden">
        {stops.map((t, i) => {
          const v = scale === 'diverging' ? t * Math.max(Math.abs(min), Math.abs(max)) : min + t * range
          return <div key={i} className="flex-1" style={{ backgroundColor: colorFor(v, min, max, scale) }} />
        })}
      </div>
      <span className="tabular-nums">{formatCompact(max)}</span>
    </div>
  )
}

function normalize(data: unknown): HeatmapData | null {
  if (typeof data !== 'object' || data === null) return null
  const d = data as Record<string, unknown>
  const rows = Array.isArray(d.rows) ? d.rows.map(String) : null
  const columns = Array.isArray(d.columns) ? d.columns.map(String) : null
  const rawCells = Array.isArray(d.cells) ? d.cells : null
  if (!rows || !columns || !rawCells) return null

  const cells: Cell[] = rawCells
    .map(c => {
      const cc = c as Record<string, unknown>
      return {
        row: Number(cc.row ?? 0),
        col: Number(cc.col ?? 0),
        value: Number(cc.value ?? 0),
        label: cc.label != null ? String(cc.label) : undefined,
      }
    })
    .filter(c => c.row >= 0 && c.row < rows.length && c.col >= 0 && c.col < columns.length)

  if (cells.length === 0) return null

  const values = cells.map(c => c.value)
  const min = typeof d.min === 'number' ? d.min : Math.min(...values)
  const max = typeof d.max === 'number' ? d.max : Math.max(...values)
  const scale = d.scale === 'diverging' ? 'diverging' : 'sequential'

  return { rows, columns, cells, min, max, scale }
}

// Linear interpolation between two RGB endpoints. Inputs in 0..255, t in 0..1.
function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

// zinc-800 baseline → emerald-500 (positive) or red-500 (negative) for diverging,
// → sky-500 for sequential. Keeps the chart readable on a zinc-900 surface.
function colorFor(value: number, min: number, max: number, scale: 'sequential' | 'diverging'): string {
  if (max === min) return 'rgb(63 63 70)' // zinc-700

  if (scale === 'diverging') {
    const span = Math.max(Math.abs(min), Math.abs(max)) || 1
    const t = Math.max(-1, Math.min(1, value / span))
    if (t >= 0) {
      return `rgb(${lerp(39, 16, t)} ${lerp(39, 185, t)} ${lerp(42, 129, t)})`
    }
    const a = -t
    return `rgb(${lerp(39, 239, a)} ${lerp(39, 68, a)} ${lerp(42, 68, a)})`
  }

  const t = Math.max(0, Math.min(1, (value - min) / (max - min)))
  return `rgb(${lerp(39, 14, t)} ${lerp(39, 165, t)} ${lerp(42, 233, t)})`
}

function formatCell(v: number): string {
  if (Math.abs(v) < 1) return v.toFixed(2)
  if (Math.abs(v) < 100) return v.toFixed(1)
  if (Math.abs(v) >= 1e6) return (v / 1e6).toFixed(1) + 'M'
  if (Math.abs(v) >= 1e3) return (v / 1e3).toFixed(1) + 'K'
  return Math.round(v).toString()
}
