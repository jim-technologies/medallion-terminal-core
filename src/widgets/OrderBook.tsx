import { useMemo } from 'react'
import { useDashboard } from '../core/DashboardContext'
import { Empty } from './states'
import type { WidgetProps } from '../types/template'
import { normalizeOrderBook, type OrderLevelData } from './orderBookShape'

// Click a price level → set ctx[key] to that price. Lets a Trade widget
// reading `${ctx.price}` pre-fill the limit price from the book. The
// optional `side_key` also writes the order side (clicked a bid → buy,
// clicked an ask → sell), completing the book → ticket workflow with a
// single click.
interface PriceContext {
  key: string
  side_key?: string
}

const TOP_N = 10

export function OrderBook({ data, options }: WidgetProps) {
  const { setCtx } = useDashboard()
  const book = useMemo(() => normalizeOrderBook(data), [data])
  const priceContext = options?.price_context as PriceContext | undefined
  const onPrice = priceContext
    ? (price: number, side: 'bid' | 'ask') => {
        setCtx(priceContext.key, String(price))
        if (priceContext.side_key) setCtx(priceContext.side_key, side === 'bid' ? 'buy' : 'sell')
      }
    : undefined
  if (!book) return <Empty>No data</Empty>

  const bestBid = book.bids[0]?.price
  const bestAsk = book.asks[0]?.price
  const mid = book.mid ?? (bestBid != null && bestAsk != null ? (bestBid + bestAsk) / 2 : 0)
  const spread = book.spread ?? (bestBid != null && bestAsk != null ? bestAsk - bestBid : 0)

  const topBids = book.bids.slice(0, TOP_N)
  // Display asks descending: top-of-book ask sits closest to mid line.
  const topAsks = book.asks.slice(0, TOP_N).reverse()
  const maxSize = Math.max(...book.bids.map(l => l.size), ...book.asks.map(l => l.size), 1)

  return (
    <div className="h-full flex flex-col text-xs font-mono">
      <div className="grid grid-cols-3 gap-2 px-2 py-1 text-[10px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Cum</span>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-auto">
          {topAsks.map((a, i) => {
            // Cumulative from top of book down — for asks displayed in descending order,
            // the row farthest from mid has the smallest cumulative.
            const cum = topAsks.slice(i).reduce((s, l) => s + l.size, 0)
            return <Row key={`ask-${i}`} side="ask" level={a} cum={cum} maxSize={maxSize} onPrice={onPrice} />
          })}
        </div>
        <div className="border-y border-zinc-700 bg-zinc-900/60 px-2 py-1.5 flex items-center justify-between shrink-0">
          <span className="text-zinc-200 tabular-nums">{format(mid)}</span>
          <span className="text-zinc-500 text-[10px]">spread {format(spread)}</span>
        </div>
        <div className="flex-1 overflow-auto">
          {topBids.map((b, i) => {
            const cum = topBids.slice(0, i + 1).reduce((s, l) => s + l.size, 0)
            return <Row key={`bid-${i}`} side="bid" level={b} cum={cum} maxSize={maxSize} onPrice={onPrice} />
          })}
        </div>
      </div>
      {book.venue && (
        <div className="text-[10px] text-zinc-500 px-2 py-1 border-t border-zinc-800 shrink-0">
          {book.venue}
        </div>
      )}
    </div>
  )
}

function Row({
  side, level, cum, maxSize, onPrice,
}: {
  side: 'bid' | 'ask'; level: OrderLevelData; cum: number; maxSize: number; onPrice?: (price: number, side: 'bid' | 'ask') => void
}) {
  const pct = (level.size / maxSize) * 100
  const bar = side === 'bid' ? 'bg-emerald-500/10' : 'bg-red-500/10'
  const text = side === 'bid' ? 'text-emerald-400' : 'text-red-400'
  return (
    <div
      onClick={onPrice ? () => onPrice(level.price, side) : undefined}
      className={`relative grid grid-cols-3 gap-2 px-2 py-0.5 ${onPrice ? 'cursor-pointer hover:bg-zinc-800/40' : ''}`}
    >
      <div className={`absolute inset-y-0 right-0 ${bar}`} style={{ width: `${pct}%` }} />
      <span className={`relative ${text} tabular-nums`}>{format(level.price)}</span>
      <span className="relative text-right text-zinc-200 tabular-nums">{formatSize(level.size)}</span>
      <span className="relative text-right text-zinc-500 tabular-nums">{formatSize(cum)}</span>
    </div>
  )
}

function format(n: number): string {
  if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return n.toFixed(2)
}

function formatSize(n: number): string {
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(2) + 'K'
  if (Math.abs(n) >= 1) return n.toFixed(2)
  return n.toFixed(4)
}
