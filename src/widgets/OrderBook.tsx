import { useMemo } from 'react'
import type { WidgetProps } from '../types/template'

interface Level {
  price: number
  size: number
}

interface OrderBookData {
  bids: Level[]
  asks: Level[]
  mid?: number
  spread?: number
  venue?: string
}

const TOP_N = 10

export function OrderBook({ data }: WidgetProps) {
  const book = useMemo(() => normalize(data), [data])
  if (!book) return <div className="flex items-center justify-center h-full text-zinc-500 text-sm">No data</div>

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
            return <Row key={`ask-${i}`} side="ask" level={a} cum={cum} maxSize={maxSize} />
          })}
        </div>
        <div className="border-y border-zinc-700 bg-zinc-900/60 px-2 py-1.5 flex items-center justify-between shrink-0">
          <span className="text-zinc-200 tabular-nums">{format(mid)}</span>
          <span className="text-zinc-500 text-[10px]">spread {format(spread)}</span>
        </div>
        <div className="flex-1 overflow-auto">
          {topBids.map((b, i) => {
            const cum = topBids.slice(0, i + 1).reduce((s, l) => s + l.size, 0)
            return <Row key={`bid-${i}`} side="bid" level={b} cum={cum} maxSize={maxSize} />
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

function Row({ side, level, cum, maxSize }: { side: 'bid' | 'ask'; level: Level; cum: number; maxSize: number }) {
  const pct = (level.size / maxSize) * 100
  const bar = side === 'bid' ? 'bg-emerald-500/10' : 'bg-red-500/10'
  const text = side === 'bid' ? 'text-emerald-400' : 'text-red-400'
  return (
    <div className="relative grid grid-cols-3 gap-2 px-2 py-0.5">
      <div className={`absolute inset-y-0 right-0 ${bar}`} style={{ width: `${pct}%` }} />
      <span className={`relative ${text} tabular-nums`}>{format(level.price)}</span>
      <span className="relative text-right text-zinc-200 tabular-nums">{formatSize(level.size)}</span>
      <span className="relative text-right text-zinc-500 tabular-nums">{formatSize(cum)}</span>
    </div>
  )
}

function normalize(data: unknown): OrderBookData | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  const d = data as Record<string, unknown>
  const bids = parseLevels(d.bids)
  const asks = parseLevels(d.asks)
  if (bids.length === 0 && asks.length === 0) return null
  return {
    bids,
    asks,
    mid: typeof d.mid === 'number' ? d.mid : undefined,
    spread: typeof d.spread === 'number' ? d.spread : undefined,
    venue: typeof d.venue === 'string' ? d.venue : undefined,
  }
}

function parseLevels(raw: unknown): Level[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map(l => {
      const ll = l as Record<string, unknown>
      return { price: Number(ll.price ?? 0), size: Number(ll.size ?? 0) }
    })
    .filter(l => Number.isFinite(l.price) && Number.isFinite(l.size) && l.size > 0)
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
