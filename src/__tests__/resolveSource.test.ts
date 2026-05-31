import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  resolveSource,
  interpolate,
  buildGenerateUrl,
  buildGenerateRequest,
  buildSubmitActionUrl,
  buildActionRequest,
  buildWatchActionUrl,
  buildActionWatchRequest,
  newClientRequestId,
  _resetWarnings,
} from '../core/resolveSource'

describe('interpolate', () => {
  it('replaces ${ctx.<key>} tokens', () => {
    expect(interpolate('symbol=${ctx.symbol}', { symbol: 'BTC' })).toBe('symbol=BTC')
  })
  it('handles multiple tokens', () => {
    expect(
      interpolate('${ctx.symbol}/${ctx.range}', { symbol: 'BTC', range: '1d' }),
    ).toBe('BTC/1d')
  })
  it('substitutes empty string for missing keys', () => {
    expect(interpolate('symbol=${ctx.symbol}', {})).toBe('symbol=')
  })
  it('passes plain strings through', () => {
    expect(interpolate('no tokens here', { x: 'y' })).toBe('no tokens here')
  })
})

describe('resolveSource — url mode', () => {
  it('substitutes context tokens in url', () => {
    const out = resolveSource(
      { url: '/api/${ctx.symbol}/price' },
      { symbol: 'BTC' },
    )
    expect(out.url).toBe('/api/BTC/price')
  })

  it('appends params as query string with substitution', () => {
    const out = resolveSource(
      { url: '/api/data', params: { symbol: '${ctx.symbol}', range: '1d' } },
      { symbol: 'ETH' },
    )
    expect(out.url).toBe('/api/data?symbol=ETH&range=1d')
  })

  it('preserves existing query string when merging params', () => {
    const out = resolveSource(
      { url: '/api/data?fixed=1', params: { dynamic: '${ctx.x}' } },
      { x: 'BTC' },
    )
    expect(out.url).toBe('/api/data?fixed=1&dynamic=BTC')
  })

  it('returns source unchanged when no url/params and no source_id', () => {
    const source = { data: [{ a: 1 }] }
    expect(resolveSource(source, {})).toBe(source)
  })
})

describe('resolveSource — source_id mode', () => {
  beforeEach(_resetWarnings)

  it('translates to a Connect-style POST against the backend', () => {
    const out = resolveSource(
      { source_id: 'btc_ohlcv', params: { range: '${ctx.range}' } },
      { range: '1d' },
      'https://api.example.com',
    )
    expect(out.url).toBe('https://api.example.com/medallion.terminal.v1.TerminalService/Get')
    expect(out.method).toBe('POST')
    expect(out.headers?.['Content-Type']).toBe('application/json')
    expect(out.body).toEqual({ source_id: 'btc_ohlcv', params: { range: '1d' } })
    expect(out.stream).toBe(false)
  })

  it('uses /Stream and Connect framing when stream is true', () => {
    const out = resolveSource(
      { source_id: 'live_prices', stream: true },
      {},
      'https://api.example.com',
    )
    expect(out.url).toBe('https://api.example.com/medallion.terminal.v1.TerminalService/Stream')
    expect(out.stream).toBe('connect')
  })

  it('strips trailing slash from backendUrl', () => {
    const out = resolveSource(
      { source_id: 'x' },
      {},
      'https://api.example.com/',
    )
    expect(out.url).toBe('https://api.example.com/medallion.terminal.v1.TerminalService/Get')
  })

  it('always sends params: {} on the body, even when none are declared', () => {
    const out = resolveSource(
      { source_id: 'spot' },
      {},
      'https://api.example.com',
    )
    expect(out.body).toEqual({ source_id: 'spot', params: {} })
  })

  it('warns and passes through unchanged when backendUrl is missing', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const source = { source_id: 'x' }
    const out = resolveSource(source, {})
    expect(out).toBe(source)
    expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  })

  it('warns at most once across calls without backendUrl', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    resolveSource({ source_id: 'a' }, {})
    resolveSource({ source_id: 'b' }, {})
    resolveSource({ source_id: 'c' }, {})
    expect(warn).toHaveBeenCalledOnce()
    warn.mockRestore()
  })

  it('treats empty-string backendUrl as SAME ORIGIN (relative URL), not missing', () => {
    // An app served from the same host as its API passes backendUrl="".
    // That is valid and must resolve to a relative path — NOT be treated
    // as "no backend" (which silently stops every source_id widget).
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const out = resolveSource({ source_id: 'files' }, {}, '')
    expect(out.url).toBe('/medallion.terminal.v1.TerminalService/Get')
    expect(out.body).toEqual({ source_id: 'files', params: {} })
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })
})

describe('Generate RPC builders', () => {
  it('buildGenerateUrl points at the canonical Connect path', () => {
    expect(buildGenerateUrl('https://api.example.com')).toBe(
      'https://api.example.com/medallion.terminal.v1.TerminalService/Generate',
    )
  })

  it('buildGenerateUrl strips a trailing slash from backendUrl', () => {
    expect(buildGenerateUrl('https://api.example.com/')).toBe(
      'https://api.example.com/medallion.terminal.v1.TerminalService/Generate',
    )
  })

  it('buildGenerateRequest mirrors the proto shape (snake_case current_widgets)', () => {
    const widgets = [{ id: 'a', component: 'metric' }]
    const out = buildGenerateRequest('how is bitcoin?', { symbol: 'BTC' }, widgets)
    expect(out).toEqual({
      prompt: 'how is bitcoin?',
      context: { values: { symbol: 'BTC' } },
      current_widgets: widgets,
    })
  })

  it('buildGenerateRequest carries empty context cleanly', () => {
    expect(buildGenerateRequest('hello', {}, [])).toEqual({
      prompt: 'hello',
      context: { values: {} },
      current_widgets: [],
    })
  })
})

describe('SubmitAction RPC builders', () => {
  it('buildSubmitActionUrl points at the canonical Connect path', () => {
    expect(buildSubmitActionUrl('https://api.example.com')).toBe(
      'https://api.example.com/medallion.terminal.v1.TerminalService/SubmitAction',
    )
  })

  it('buildSubmitActionUrl strips a trailing slash', () => {
    expect(buildSubmitActionUrl('https://api.example.com/')).toBe(
      'https://api.example.com/medallion.terminal.v1.TerminalService/SubmitAction',
    )
  })

  it('buildActionRequest mirrors the proto shape', () => {
    expect(
      buildActionRequest({ actionId: 'place_order', params: { symbol: 'BTC', side: 'buy', amount: 0.5 }, clientRequestId: 'cr-123' }),
    ).toEqual({
      action_id: 'place_order',
      params: { symbol: 'BTC', side: 'buy', amount: 0.5 },
      client_request_id: 'cr-123',
    })
  })

  it('buildActionRequest accepts an empty params object', () => {
    expect(buildActionRequest({ actionId: 'ping', params: {}, clientRequestId: 'cr-x' })).toEqual({
      action_id: 'ping',
      params: {},
      client_request_id: 'cr-x',
    })
  })

  it('buildWatchActionUrl strips a trailing slash', () => {
    expect(buildWatchActionUrl('https://api.example.com/')).toBe(
      'https://api.example.com/medallion.terminal.v1.TerminalService/WatchAction',
    )
  })

  it('buildActionWatchRequest fills missing keys with empty strings', () => {
    expect(buildActionWatchRequest({ clientRequestId: 'cr-1' })).toEqual({
      action_id: '',
      id: '',
      client_request_id: 'cr-1',
    })
    expect(buildActionWatchRequest({ id: 'order-99', actionId: 'place_order' })).toEqual({
      action_id: 'place_order',
      id: 'order-99',
      client_request_id: '',
    })
  })

  it('newClientRequestId returns a unique non-empty string', () => {
    const a = newClientRequestId()
    const b = newClientRequestId()
    expect(a).toBeTruthy()
    expect(b).toBeTruthy()
    expect(a).not.toBe(b)
  })
})
