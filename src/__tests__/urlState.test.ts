import { describe, it, expect } from 'vitest'
import { readCtxFromUrl, writeCtxToUrl } from '../core/urlState'

describe('readCtxFromUrl', () => {
  it('extracts ctx.* params and strips the prefix', () => {
    expect(readCtxFromUrl('?ctx.symbol=BTC&ctx.range=1d')).toEqual({
      symbol: 'BTC',
      range: '1d',
    })
  })

  it('ignores params without ctx. prefix', () => {
    expect(readCtxFromUrl('?template=foo&ctx.symbol=BTC&unrelated=x')).toEqual({
      symbol: 'BTC',
    })
  })

  it('returns empty object when no ctx params present', () => {
    expect(readCtxFromUrl('?template=foo')).toEqual({})
    expect(readCtxFromUrl('')).toEqual({})
  })

  it('decodes URL-encoded values', () => {
    expect(readCtxFromUrl('?ctx.symbol=BTC%2FUSD')).toEqual({ symbol: 'BTC/USD' })
  })
})

describe('writeCtxToUrl', () => {
  it('serializes ctx as ctx.* params', () => {
    const out = writeCtxToUrl('', { symbol: 'BTC', range: '1d' })
    const parsed = new URLSearchParams(out)
    expect(parsed.get('ctx.symbol')).toBe('BTC')
    expect(parsed.get('ctx.range')).toBe('1d')
  })

  it('preserves non-ctx params', () => {
    const out = writeCtxToUrl('?template=demo.json', { symbol: 'BTC' })
    const parsed = new URLSearchParams(out)
    expect(parsed.get('template')).toBe('demo.json')
    expect(parsed.get('ctx.symbol')).toBe('BTC')
  })

  it('overwrites existing ctx params (no leftovers)', () => {
    const out = writeCtxToUrl('?ctx.symbol=ETH&ctx.range=1m', { symbol: 'BTC' })
    const parsed = new URLSearchParams(out)
    expect(parsed.get('ctx.symbol')).toBe('BTC')
    expect(parsed.has('ctx.range')).toBe(false)
  })

  it('encodes special characters', () => {
    const out = writeCtxToUrl('', { symbol: 'BTC/USD' })
    const parsed = new URLSearchParams(out)
    expect(parsed.get('ctx.symbol')).toBe('BTC/USD')
  })

  it('roundtrips with readCtxFromUrl', () => {
    const ctx = { symbol: 'BTC', range: '1d', event: 'eth-4k' }
    const url = writeCtxToUrl('', ctx)
    expect(readCtxFromUrl(`?${url}`)).toEqual(ctx)
  })
})
