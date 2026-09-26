import { describe, expect, it, vi } from 'vitest'
import { createEmbedChannel, parseEmbedHostMessage } from '../app/embed'
import {
  buildPath,
  createHistoryRouter,
  createMemoryRouter,
  matchPath,
  matchRoutes,
  type RouteParams,
} from '../app/router'
import {
  SESSION_RENEWED,
  createHttpSessionPort,
  parseSessionBody,
  renewViaFrame,
} from '../app/session'
import { requestTelemetry, type TelemetryEvent } from '../app/telemetry'
import { SourceError } from '../core/sourceError'

describe('matchPath and buildPath', () => {
  it('matches params and splats with typed results', () => {
    const params: RouteParams<'/b/:bucket/f/*path'> | null = matchPath('/b/:bucket/f/*path', '/b/fin%20ance/f/q3/report%231.csv')
    expect(params).toEqual({ bucket: 'fin ance', path: 'q3/report#1.csv' })
    expect(matchPath('/b/:bucket/*path', '/b/finance')).toEqual({ bucket: 'finance', path: '' })
    expect(matchPath('/buckets', '/buckets/')).toEqual({})
    expect(matchPath('/buckets', '/buckets/extra')).toBeNull()
    expect(matchPath('/r/:repo/*', '/r/core/src/app')).toEqual({ repo: 'core', splat: 'src/app' })
  })

  it('builds encoded paths and finds the first matching route', () => {
    expect(buildPath('/b/:bucket/f/*path', { bucket: 'fin ance', path: 'q3/report#1.csv' })).toBe('/b/fin%20ance/f/q3/report%231.csv')
    const routes = { file: '/b/:bucket/f/*path', browse: '/b/:bucket/*path' } as const
    expect(matchRoutes(routes, '/b/finance/f/a.csv')).toEqual({ id: 'file', params: { bucket: 'finance', path: 'a.csv' } })
    expect(matchRoutes(routes, '/b/finance/q3')).toEqual({ id: 'browse', params: { bucket: 'finance', path: 'q3' } })
    expect(matchRoutes(routes, '/elsewhere')).toBeNull()
  })

  it('treats a malformed percent escape as no match, never a URIError', () => {
    const routes = { file: '/b/:bucket/f/*path', browse: '/b/:bucket/*path' } as const
    expect(() => matchRoutes(routes, '/b/fin%E0/f/x')).not.toThrow()
    expect(matchRoutes(routes, '/b/fin%E0/f/x')).toBeNull()
    expect(matchPath('/b/:bucket/*path', '/b/finance/q3/%E0%A4%A')).toBeNull()
    expect(matchPath('/b/:bucket/*path', '/b/finance/%E0%A4%A4')).toEqual({ bucket: 'finance', path: '\u0924' })
  })
})

describe('routers', () => {
  it('keeps an in-memory history with back and replace', () => {
    const router = createMemoryRouter('/buckets')
    const seen: string[] = []
    const stop = router.subscribe(() => seen.push(router.location().pathname))
    router.navigate('/b/finance?view=grid')
    router.navigate('/b/media', { replace: true })
    expect(router.location()).toEqual({ pathname: '/b/media', search: '', hash: '' })
    router.back()
    expect(router.location().pathname).toBe('/buckets')
    stop()
    router.navigate('/activity')
    expect(seen).toEqual(['/b/finance', '/b/media', '/buckets'])
  })

  it('maps app paths through a base on the History API', () => {
    const listeners = new Map<string, () => void>()
    const history = { pushState: vi.fn(), replaceState: vi.fn(), back: vi.fn() }
    const fakeWindow = {
      location: { pathname: '/embed/b/finance', search: '?x=1', hash: '' },
      history,
      addEventListener: (type: string, listener: () => void) => listeners.set(type, listener),
      removeEventListener: (type: string) => listeners.delete(type),
    } as unknown as Window
    const router = createHistoryRouter({ base: 'embed/', window: fakeWindow })
    expect(router.location()).toEqual({ pathname: '/b/finance', search: '?x=1', hash: '' })
    expect(router.href('/b/media?y=2')).toBe('/embed/b/media?y=2')
    const listener = vi.fn()
    const stop = router.subscribe(listener)
    router.navigate('/b/media')
    expect(history.pushState).toHaveBeenCalledWith(null, '', '/embed/b/media')
    router.navigate('/b/media', { replace: true })
    expect(history.replaceState).toHaveBeenCalledWith(null, '', '/embed/b/media')
    listeners.get('popstate')?.()
    expect(listener).toHaveBeenCalledTimes(3)
    stop()
    expect(listeners.has('popstate')).toBe(false)
  })
})

describe('session port', () => {
  it('reads snake or camel case and epoch seconds, ISO or milliseconds', () => {
    expect(parseSessionBody({ authenticated: true, sub: 'user:1', expires_at: 1_790_000_000 }))
      .toMatchObject({ authenticated: true, subject: 'user:1', expiresAt: 1_790_000_000_000 })
    expect(parseSessionBody({ authenticated: true, expiresAt: '2026-09-25T17:00:00Z', signInUrl: '/auth' }).expiresAt)
      .toBe(Date.parse('2026-09-25T17:00:00Z'))
    expect(parseSessionBody(null)).toEqual({
      authenticated: false,
      subject: undefined,
      displayName: undefined,
      workspaceId: undefined,
      expiresAt: undefined,
      signInUrl: undefined,
    })
  })

  it('loads, renews through the injected step, and signs in with a return path', async () => {
    const calls: string[] = []
    const transport = vi.fn(async (url: string) => {
      calls.push(url)
      return new Response(JSON.stringify({ authenticated: true, displayName: 'Jamie', sign_in_url: 'https://app.example/auth' }), { status: 200 })
    }) as unknown as typeof fetch
    const assign = vi.fn()
    const renew = vi.fn(async () => {})
    const port = createHttpSessionPort({ fetch: transport, renew, assign })
    const session = await port.load()
    expect(session.displayName).toBe('Jamie')
    await port.renew()
    expect(renew).toHaveBeenCalledOnce()
    expect(calls).toEqual(['/auth/session', '/auth/session'])
    port.signIn('/b/finance?x=1', session)
    expect(assign).toHaveBeenCalledWith('https://app.example/auth?return_to=%2Fb%2Ffinance%3Fx%3D1')
  })

  it('treats 401 as signed out and a failed renewal as an error', async () => {
    const port = createHttpSessionPort({
      fetch: (async () => new Response('', { status: 401 })) as unknown as typeof fetch,
      renew: async () => {},
      assign: () => {},
    })
    expect(await port.load()).toEqual({ authenticated: false })
    await expect(port.renew()).rejects.toThrow('did not sign in')
  })
})

describe('renewViaFrame', () => {
  function fakeWindow() {
    const listeners = new Set<(event: MessageEvent) => void>()
    const frame = { hidden: false, title: '', src: '', contentWindow: {}, remove: vi.fn(), setAttribute: vi.fn() }
    const win = {
      location: { origin: 'https://drive.example' },
      document: { createElement: () => frame, body: { appendChild: vi.fn() } },
      addEventListener: (_type: string, listener: (event: MessageEvent) => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: (event: MessageEvent) => void) => listeners.delete(listener),
    }
    const send = (origin: string, source: unknown, data: unknown) => {
      for (const listener of [...listeners]) listener({ origin, source, data } as MessageEvent)
    }
    return { win: win as unknown as Window, frame, send, listeners }
  }

  it('resolves on the renewal message from its own frame and origin only', async () => {
    const { win, frame, send, listeners } = fakeWindow()
    const renewal = renewViaFrame({ url: 'https://app.example/apps/storage/launch?mode=renew', window: win })
    expect(frame.src).toBe('https://app.example/apps/storage/launch?mode=renew')
    send('https://evil.example', frame.contentWindow, { type: SESSION_RENEWED })
    send('https://drive.example', {}, { type: SESSION_RENEWED })
    send('https://drive.example', frame.contentWindow, { type: SESSION_RENEWED })
    await expect(renewal).resolves.toBeUndefined()
    expect(frame.remove).toHaveBeenCalled()
    expect(listeners.size).toBe(0)
  })

  it('times out', async () => {
    vi.useFakeTimers()
    const { win } = fakeWindow()
    const renewal = renewViaFrame({ url: '/renew', window: win, timeoutMs: 1000 })
    vi.advanceTimersByTime(1000)
    await expect(renewal).rejects.toThrow('timed out')
    vi.useRealTimers()
  })
})

describe('embed channel', () => {
  it('validates host messages', () => {
    expect(parseEmbedHostMessage({ type: 'mtc:navigate', version: 1, path: '/b/finance' })).toEqual({ type: 'mtc:navigate', version: 1, path: '/b/finance' })
    expect(parseEmbedHostMessage({ type: 'mtc:navigate', version: 1, path: '//evil.example' })).toBeNull()
    expect(parseEmbedHostMessage({ type: 'mtc:navigate', version: 1, path: '/\\evil.example' })).toBeNull()
    expect(parseEmbedHostMessage({ type: 'mtc:navigate', version: 2, path: '/' })).toBeNull()
    expect(parseEmbedHostMessage({ type: 'mtc:init', version: 1, theme: 'neon', locale: 'zh-CN' }))
      .toEqual({ type: 'mtc:init', version: 1, theme: undefined, locale: 'zh-CN', timeZone: undefined })
  })

  it('talks only to an allow-listed framing origin, never to *', () => {
    const parent = { postMessage: vi.fn() }
    const listeners = new Set<(event: MessageEvent) => void>()
    const make = (referrer: string) => ({
      parent,
      document: { referrer },
      addEventListener: (_type: string, listener: (event: MessageEvent) => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: (event: MessageEvent) => void) => listeners.delete(listener),
    }) as unknown as Window
    const denied = createEmbedChannel({ allowedOrigins: ['https://app.example'], window: make('https://evil.example/page') })
    denied.post({ type: 'mtc:resize', version: 1, height: 10 })
    expect(denied.hostOrigin).toBeNull()
    expect(parent.postMessage).not.toHaveBeenCalled()

    const channel = createEmbedChannel({ allowedOrigins: ['https://app.example'], window: make('https://app.example/w/1') })
    channel.post({ type: 'mtc:ready', version: 1, product: 'Storage', path: '/' })
    expect(parent.postMessage).toHaveBeenCalledWith({ type: 'mtc:ready', version: 1, product: 'Storage', path: '/' }, 'https://app.example')
    const received = vi.fn()
    channel.subscribe(received)
    for (const listener of listeners) {
      listener({ origin: 'https://evil.example', source: parent, data: { type: 'mtc:navigate', version: 1, path: '/x' } } as unknown as MessageEvent)
      listener({ origin: 'https://app.example', source: {}, data: { type: 'mtc:navigate', version: 1, path: '/x' } } as unknown as MessageEvent)
      listener({ origin: 'https://app.example', source: parent, data: { type: 'mtc:navigate', version: 1, path: '/y' } } as unknown as MessageEvent)
    }
    expect(received).toHaveBeenCalledOnce()
    expect(received).toHaveBeenCalledWith({ type: 'mtc:navigate', version: 1, path: '/y' })
  })
})

describe('telemetry', () => {
  it('summarises requests without query strings or bodies', () => {
    const events: TelemetryEvent[] = []
    const onRequest = requestTelemetry({ record: event => events.push(event) })
    onRequest({
      method: 'POST',
      url: 'https://drive.example/medallion.storage.v1.StorageService/ListDir?token=secret',
      status: 403,
      requestId: 'req_1',
      traceparent: '00-abc-def-01',
      durationMs: 41.6,
      error: new SourceError('denied', { kind: 'forbidden', code: 'permission_denied' }),
    })
    expect(events).toEqual([{
      type: 'request',
      method: 'POST',
      path: '/medallion.storage.v1.StorageService/ListDir',
      status: 403,
      code: 'permission_denied',
      requestId: 'req_1',
      durationMs: 42,
    }])
  })
})
