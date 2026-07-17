import { useId, useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useDashboard } from '../core/DashboardContext'
import type { WidgetProps } from '../types/template'
import { abbreviateAxis, formatCompact } from './format'
import { cumulativeDepth, normalizeOrderBook } from './orderBookShape'
import { Empty } from './states'

interface DepthChartOptions {
  max_levels?: number
  cumulative?: 'size' | 'notional'
  quote_unit?: string
  price_context?: {
    key: string
    side_key?: string
  }
}

interface ChartRow {
  price: number
  bid?: number
  ask?: number
  side: 'bid' | 'ask'
}

const GRID = 'var(--mtc-grid)'
const AXIS = 'var(--mtc-border)'
const TICK = 'var(--mtc-muted)'

// Cumulative liquidity projection over the canonical OrderBookPayload.
// Keeping this separate from the ladder matters: the ladder answers "what is
// resting here?", while depth answers "how much can I execute through here?".
export function DepthChart({ data, options }: WidgetProps) {
  const { setCtx } = useDashboard()
  const opts = (options ?? {}) as DepthChartOptions
  const book = useMemo(() => normalizeOrderBook(data), [data])
  const rows = useMemo<ChartRow[]>(() => {
    if (!book) return []
    return cumulativeDepth(book, opts.max_levels, opts.cumulative).map(point => ({
      price: point.price,
      side: point.side,
      ...(point.side === 'bid'
        ? { bid: point.cumulative }
        : { ask: point.cumulative }),
    }))
  }, [book, opts.max_levels, opts.cumulative])
  const gradientId = `depth-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`

  if (!book || rows.length === 0) return <Empty>No data</Empty>

  const bestBid = book.bids[0]?.price
  const bestAsk = book.asks[0]?.price
  const mid = book.mid ??
    (bestBid !== undefined && bestAsk !== undefined ? (bestBid + bestAsk) / 2 : undefined)
  const spread = book.spread ??
    (bestBid !== undefined && bestAsk !== undefined ? bestAsk - bestBid : undefined)
  const priceContext = opts.price_context
  const selectActive = (state: unknown) => {
    if (!priceContext || !state || typeof state !== 'object') return
    const active = state as { activePayload?: Array<{ payload?: ChartRow }> }
    const row = active.activePayload?.[0]?.payload
    if (!row) return
    setCtx(priceContext.key, String(row.price))
    if (priceContext.side_key) {
      setCtx(priceContext.side_key, row.side === 'bid' ? 'buy' : 'sell')
    }
  }

  const totalBid = Math.max(0, ...rows.flatMap(row => row.bid === undefined ? [] : [row.bid]))
  const totalAsk = Math.max(0, ...rows.flatMap(row => row.ask === undefined ? [] : [row.ask]))
  const unit = opts.cumulative === 'notional' ? opts.quote_unit : undefined

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div
        className={priceContext ? 'flex-1 min-h-0 cursor-crosshair' : 'flex-1 min-h-0'}
        role="img"
        aria-label={`Market depth with ${book.bids.length} bid levels and ${book.asks.length} ask levels`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={rows}
            margin={{ top: 8, right: 10, bottom: 0, left: 0 }}
            onClick={selectActive}
          >
            <defs>
              <linearGradient id={`${gradientId}-bid`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--mtc-ok)" stopOpacity={0.42} />
                <stop offset="100%" stopColor="var(--mtc-ok)" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id={`${gradientId}-ask`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--mtc-danger)" stopOpacity={0.42} />
                <stop offset="100%" stopColor="var(--mtc-danger)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
            <XAxis
              type="number"
              dataKey="price"
              domain={['dataMin', 'dataMax']}
              stroke={AXIS}
              tick={{ fontSize: 10, fill: TICK }}
              tickFormatter={formatPrice}
              minTickGap={28}
            />
            <YAxis
              stroke={AXIS}
              tick={{ fontSize: 10, fill: TICK }}
              tickFormatter={abbreviateAxis}
              width={48}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--mtc-surface-raised)',
                border: '1px solid var(--mtc-border-strong)',
                borderRadius: 4,
                color: 'var(--mtc-fg)',
                fontSize: 11,
              }}
              labelFormatter={value => `Price ${formatPrice(Number(value))}`}
              formatter={(value, name) => [
                `${formatCompact(Number(value))}${unit ? ` ${unit}` : ''}`,
                name === 'bid' ? 'Bid depth' : 'Ask depth',
              ]}
            />
            {mid !== undefined && (
              <ReferenceLine
                x={mid}
                stroke="var(--mtc-muted-subtle)"
                strokeDasharray="4 4"
                label={{ value: 'mid', fill: TICK, fontSize: 9, position: 'insideTopRight' }}
              />
            )}
            <Area
              type="stepAfter"
              dataKey="bid"
              stroke="var(--mtc-ok)"
              fill={`url(#${gradientId}-bid)`}
              strokeWidth={1.5}
              connectNulls={false}
              isAnimationActive={false}
            />
            <Area
              type="stepBefore"
              dataKey="ask"
              stroke="var(--mtc-danger)"
              fill={`url(#${gradientId}-ask)`}
              strokeWidth={1.5}
              connectNulls={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 items-center gap-2 px-2 pt-1 text-[10px] font-mono text-zinc-500 shrink-0">
        <span className="text-emerald-400/90">bid {formatCompact(totalBid)}</span>
        <span className="text-center">
          {spread !== undefined ? `spread ${formatPrice(spread)}` : '—'}
        </span>
        <span className="text-right text-red-400/90">ask {formatCompact(totalAsk)}</span>
      </div>
    </div>
  )
}

function formatPrice(value: number): string {
  if (!Number.isFinite(value)) return '—'
  if (Math.abs(value) >= 1000) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }
  if (Math.abs(value) >= 1) return value.toFixed(2)
  return value.toPrecision(4)
}
