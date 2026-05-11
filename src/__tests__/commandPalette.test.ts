import { describe, it, expect } from 'vitest'
import { _parseCommand as parseCommand } from '../core/CommandPalette'

describe('command palette parser — set commands', () => {
  it('handles "key: value"', () => {
    expect(parseCommand('symbol: BTC', 'symbol')).toEqual({ kind: 'set', key: 'symbol', value: 'BTC' })
  })
  it('handles "key = value" with whitespace', () => {
    expect(parseCommand('range  =   1d', 'symbol')).toEqual({ kind: 'set', key: 'range', value: '1d' })
  })
  it('handles "key value" (space-separated)', () => {
    expect(parseCommand('symbol ETH', 'symbol')).toEqual({ kind: 'set', key: 'symbol', value: 'ETH' })
  })
  it('lowercases the key', () => {
    expect(parseCommand('SYMBOL: BTC', 'symbol')).toEqual({ kind: 'set', key: 'symbol', value: 'BTC' })
  })
  it('treats a bare range preset as ctx.range', () => {
    expect(parseCommand('1d', 'symbol')).toEqual({ kind: 'set', key: 'range', value: '1d' })
    expect(parseCommand('MAX', 'symbol')).toEqual({ kind: 'set', key: 'range', value: 'max' })
  })
  it('routes a bare value to the dominant key when not a range preset', () => {
    expect(parseCommand('BTC', 'symbol')).toEqual({ kind: 'set', key: 'symbol', value: 'BTC' })
    expect(parseCommand('eth-usdc', 'pair')).toEqual({ kind: 'set', key: 'pair', value: 'eth-usdc' })
  })
  it('returns null for empty input', () => {
    expect(parseCommand('', 'symbol')).toBeNull()
    expect(parseCommand('   ', 'symbol')).toBeNull()
  })
  it('handles values with spaces', () => {
    expect(parseCommand('event: ETH ETF approval', 'symbol'))
      .toEqual({ kind: 'set', key: 'event', value: 'ETH ETF approval' })
  })
})

describe('command palette parser — multi-pair commands', () => {
  it('parses "symbol:BTC range:1d"', () => {
    expect(parseCommand('symbol:BTC range:1d', 'symbol')).toEqual({
      kind: 'set_many',
      pairs: [['symbol', 'BTC'], ['range', '1d']],
    })
  })
  it('parses three pairs with mixed colon/equals', () => {
    expect(parseCommand('symbol:BTC range=1d venue:binance', 'symbol')).toEqual({
      kind: 'set_many',
      pairs: [['symbol', 'BTC'], ['range', '1d'], ['venue', 'binance']],
    })
  })
  it('falls back to single set when a token isn\'t a pair', () => {
    // "symbol BTC" — second token has no colon, should match the
    // existing "key value" single-pair branch, not set_many.
    expect(parseCommand('symbol BTC', 'symbol')).toEqual({ kind: 'set', key: 'symbol', value: 'BTC' })
  })
})

describe('command palette parser — slash commands', () => {
  it('parses /save <name>', () => {
    expect(parseCommand('/save btc-desk', 'symbol')).toEqual({ kind: 'save', name: 'btc-desk' })
  })
  it('parses /load <name>', () => {
    expect(parseCommand('/load btc-desk', 'symbol')).toEqual({ kind: 'load', name: 'btc-desk' })
  })
  it('parses /open as alias for /load', () => {
    expect(parseCommand('/open btc-desk', 'symbol')).toEqual({ kind: 'load', name: 'btc-desk' })
  })
  it('parses /delete and /rm', () => {
    expect(parseCommand('/delete x', 'symbol')).toEqual({ kind: 'delete', name: 'x' })
    expect(parseCommand('/rm x', 'symbol')).toEqual({ kind: 'delete', name: 'x' })
  })
  it('returns null when /save has no name', () => {
    expect(parseCommand('/save', 'symbol')).toBeNull()
    expect(parseCommand('/save   ', 'symbol')).toBeNull()
  })
  it('returns noop for unknown slash commands', () => {
    expect(parseCommand('/wat', 'symbol')).toEqual({ kind: 'noop' })
  })
  it('preserves multi-word names', () => {
    expect(parseCommand('/save BTC desk friday', 'symbol'))
      .toEqual({ kind: 'save', name: 'BTC desk friday' })
  })
})
