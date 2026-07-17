export interface OrderLevelData {
  price: number
  size: number
}

export interface OrderBookData {
  bids: OrderLevelData[]
  asks: OrderLevelData[]
  mid?: number
  spread?: number
  venue?: string
}

export interface DepthPoint {
  price: number
  side: 'bid' | 'ask'
  cumulative: number
}

// One normalizer shared by the ladder and cumulative-depth projections.
// Canonical payloads use {price, size}; [price, size] tuples are accepted as
// a practical adapter for exchange APIs. Duplicate price levels are folded so
// both projections always agree on cumulative liquidity.
export function normalizeOrderBook(data: unknown): OrderBookData | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  const value = data as Record<string, unknown>
  const bids = parseLevels(value.bids, 'bid')
  const asks = parseLevels(value.asks, 'ask')
  if (bids.length === 0 && asks.length === 0) return null

  const mid = finiteNumber(value.mid)
  const spread = finiteNumber(value.spread)
  return {
    bids,
    asks,
    ...(mid !== undefined && { mid }),
    ...(spread !== undefined && { spread }),
    ...(typeof value.venue === 'string' && value.venue !== '' && { venue: value.venue }),
  }
}

export function cumulativeDepth(
  book: OrderBookData,
  maxLevels = 100,
  mode: 'size' | 'notional' = 'size',
): DepthPoint[] {
  const cap = Number.isFinite(maxLevels)
    ? Math.max(1, Math.floor(maxLevels))
    : 100

  let bidTotal = 0
  const bidsNearToFar = book.bids.slice(0, cap).map(level => {
    bidTotal += depthValue(level, mode)
    return { price: level.price, side: 'bid' as const, cumulative: bidTotal }
  })

  let askTotal = 0
  const asks = book.asks.slice(0, cap).map(level => {
    askTotal += depthValue(level, mode)
    return { price: level.price, side: 'ask' as const, cumulative: askTotal }
  })

  // Plot prices left→right. Bids are stored best→worse, so reverse only the
  // output ordering; cumulative values remain measured outward from mid.
  return [...bidsNearToFar.reverse(), ...asks]
}

function depthValue(level: OrderLevelData, mode: 'size' | 'notional'): number {
  return mode === 'notional' ? level.price * level.size : level.size
}

function parseLevels(raw: unknown, side: 'bid' | 'ask'): OrderLevelData[] {
  if (!Array.isArray(raw)) return []
  const aggregated = new Map<number, number>()
  for (const entry of raw) {
    const parsed = parseLevel(entry)
    if (!parsed) continue
    aggregated.set(parsed.price, (aggregated.get(parsed.price) ?? 0) + parsed.size)
  }
  return Array.from(aggregated, ([price, size]) => ({ price, size }))
    .sort((a, b) => side === 'bid' ? b.price - a.price : a.price - b.price)
}

function parseLevel(raw: unknown): OrderLevelData | null {
  let price: number
  let size: number
  if (Array.isArray(raw)) {
    price = Number(raw[0])
    size = Number(raw[1])
  } else if (raw && typeof raw === 'object') {
    const level = raw as Record<string, unknown>
    price = Number(level.price)
    size = Number(level.size ?? level.quantity ?? level.qty)
  } else {
    return null
  }
  if (!Number.isFinite(price) || !Number.isFinite(size) || price < 0 || size <= 0) return null
  return { price, size }
}

function finiteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}
