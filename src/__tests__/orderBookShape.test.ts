import { describe, expect, it } from 'vitest'
import { cumulativeDepth, normalizeOrderBook } from '../widgets/orderBookShape'

describe('order book projections', () => {
  it('normalizes, aggregates, and sorts object and tuple levels', () => {
    expect(normalizeOrderBook({
      bids: [[99, 2], { price: 100, size: 1 }, { price: 99, quantity: 3 }],
      asks: [{ price: 102, size: 4 }, [101, 2]],
    })).toMatchObject({
      bids: [{ price: 100, size: 1 }, { price: 99, size: 5 }],
      asks: [{ price: 101, size: 2 }, { price: 102, size: 4 }],
    })
  })

  it('builds outward cumulative depth while preserving ascending plot prices', () => {
    const book = normalizeOrderBook({
      bids: [{ price: 100, size: 1 }, { price: 99, size: 2 }],
      asks: [{ price: 101, size: 4 }, { price: 102, size: 8 }],
    })
    expect(book).not.toBeNull()
    expect(cumulativeDepth(book!)).toEqual([
      { price: 99, side: 'bid', cumulative: 3 },
      { price: 100, side: 'bid', cumulative: 1 },
      { price: 101, side: 'ask', cumulative: 4 },
      { price: 102, side: 'ask', cumulative: 12 },
    ])
  })

  it('supports quote-notional depth and level caps', () => {
    const book = normalizeOrderBook({
      bids: [{ price: 10, size: 2 }, { price: 9, size: 100 }],
      asks: [{ price: 11, size: 3 }, { price: 12, size: 100 }],
    })
    expect(cumulativeDepth(book!, 1, 'notional')).toEqual([
      { price: 10, side: 'bid', cumulative: 20 },
      { price: 11, side: 'ask', cumulative: 33 },
    ])
  })
})
