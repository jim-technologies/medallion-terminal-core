import { createServer, type RequestListener, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { afterEach, describe, expect, it } from 'vitest'
import {
  createProductFetch,
  ensureOk,
  newTraceparent,
  type ProductRequestEvent,
} from '../app/productFetch'
import { CONNECT_JSON_CONTENT_TYPE, parseConnectEnvelopes } from '../core/connectFraming'
import { SourceError, sourceErrorFromResponse } from '../core/sourceError'

interface Call {
  input: RequestInfo | URL
  init?: RequestInit
}

// A recording transport: the product fetch is injected, never patched in.
function recorder(respond: (call: Call) => Response | Promise<Response>) {
  const calls: Call[] = []
  const fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const call = { input, init }
    calls.push(call)
    return respond(call)
  }) as typeof globalThis.fetch
  return { calls, fetch }
}

const headersOf = (call: Call) => new Headers(call.init?.headers)

// A transport that answers after `delayMs` unless its signal aborts first,
// the way a real fetch waits for response headers.
function slowToRespond(delayMs: number) {
  return recorder(call => new Promise<Response>((resolve, reject) => {
    const signal = call.init?.signal
    const timer = setTimeout(() => resolve(new Response('{}')), delayMs)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  }))
}

// Loopback HTTP servers for the streaming tests: the real platform fetch
// ties the body to the request signal, which a recorded transport cannot.
const servers: Server[] = []
afterEach(async () => {
  await Promise.all(servers.splice(0).map(server => new Promise(resolve => {
    server.closeAllConnections()
    server.close(resolve)
  })))
})

async function serve(handler: RequestListener): Promise<string> {
  const server = createServer(handler)
  servers.push(server)
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  return `http://127.0.0.1:${(server.address() as AddressInfo).port}`
}

function connectFrame(flags: number, value: unknown): Buffer {
  const payload = Buffer.from(JSON.stringify(value))
  const header = Buffer.alloc(5)
  header.writeUInt8(flags, 0)
  header.writeUInt32BE(payload.length, 1)
  return Buffer.concat([header, payload])
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('createProductFetch', () => {
  it('adds a request id and a W3C traceparent without replacing the caller’s own', async () => {
    const { calls, fetch } = recorder(() => new Response('{}'))
    const productFetch = createProductFetch({
      fetch,
      newRequestId: () => 'req-1',
      newTraceparent: () => '00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01',
    })
    await productFetch('/api/buckets', { headers: { Authorization: 'Bearer t' } })
    await productFetch('/api/buckets', { headers: { 'X-Request-Id': 'mine', traceparent: 'theirs' } })

    expect(headersOf(calls[0]!).get('x-request-id')).toBe('req-1')
    expect(headersOf(calls[0]!).get('traceparent')).toBe('00-0af7651916cd43dd8448eb211c80319c-b7ad6b7169203331-01')
    expect(headersOf(calls[0]!).get('authorization')).toBe('Bearer t')
    expect(headersOf(calls[1]!).get('x-request-id')).toBe('mine')
    expect(headersOf(calls[1]!).get('traceparent')).toBe('theirs')
  })

  it('keeps the headers of a Request input', async () => {
    const { calls, fetch } = recorder(() => new Response('{}'))
    await createProductFetch({ fetch })(new Request('https://storage.example.test/rpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }))
    expect(headersOf(calls[0]!).get('content-type')).toBe('application/json')
    expect(headersOf(calls[0]!).get('x-request-id')).toMatch(/\S+/)
  })

  it('generates sampled W3C trace contexts', () => {
    expect(newTraceparent()).toMatch(/^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/)
    expect(newTraceparent()).not.toBe(newTraceparent())
  })

  it('reports a 401 with its typed error and still returns the response intact', async () => {
    const { fetch } = recorder(() => new Response(
      JSON.stringify({ code: 'unauthenticated', message: 'session expired' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    ))
    const expired: SourceError[] = []
    const response = await createProductFetch({
      fetch,
      newRequestId: () => 'req-401',
      onUnauthenticated: error => expired.push(error),
    })('/api/files')

    expect(expired).toHaveLength(1)
    expect(expired[0]).toMatchObject({ kind: 'unauthenticated', message: 'session expired', requestId: 'req-401' })
    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ code: 'unauthenticated', message: 'session expired' })
  })

  it('does not call the session hook for other failures', async () => {
    const { fetch } = recorder(() => new Response(null, { status: 403 }))
    let calls = 0
    const response = await createProductFetch({ fetch, onUnauthenticated: () => { calls += 1 } })('/api/files')
    expect(response.status).toBe(403)
    expect(calls).toBe(0)
  })

  it('types a network failure as unavailable and keeps the request id', async () => {
    const { fetch } = recorder(() => { throw new TypeError('Failed to fetch') })
    const failure = createProductFetch({ fetch, newRequestId: () => 'req-net' })('/api/files')
    await expect(failure).rejects.toBeInstanceOf(SourceError)
    await expect(failure).rejects.toMatchObject({ kind: 'unavailable', requestId: 'req-net' })
  })

  it('aborts after the timeout with a typed error', async () => {
    const { fetch } = recorder(call => new Promise<Response>((_, reject) => {
      call.init?.signal?.addEventListener('abort', () => reject(call.init!.signal!.reason))
    }))
    await expect(createProductFetch({ fetch, timeoutMs: 20 })('/api/slow'))
      .rejects.toMatchObject({ name: 'SourceError', kind: 'unavailable', message: 'Request timed out after 20 ms' })
  })

  it('bounds only the wait for response headers: a Connect server stream outlives the timeout', async () => {
    // Headers at once, then one message every 100 ms for three times
    // timeoutMs: the shape of a Stream source or a WatchAction lifecycle.
    const url = await serve(async (_request, response) => {
      response.writeHead(200, { 'Content-Type': CONNECT_JSON_CONTENT_TYPE })
      response.flushHeaders()
      for (let sequence = 1; sequence <= 6; sequence++) {
        await sleep(100)
        response.write(connectFrame(0, { sequence }))
      }
      response.end(connectFrame(0x02, {}))
    })
    const started = performance.now()
    const response = await createProductFetch({ timeoutMs: 200 })(url, { method: 'POST' })
    const messages: unknown[] = []
    let closed = false
    await parseConnectEnvelopes(response.body!.getReader(), {
      onMessage: message => messages.push(message),
      onTrailer: () => { closed = true },
      isDisposed: () => false,
    })

    expect(performance.now() - started).toBeGreaterThan(200 * 2)
    expect(messages).toEqual([1, 2, 3, 4, 5, 6].map(sequence => ({ sequence })))
    expect(closed).toBe(true)
  })

  it('times out a server that sends no response headers', async () => {
    const url = await serve(async (_request, response) => {
      await sleep(400)
      response.end('{}')
    })
    await expect(createProductFetch({ timeoutMs: 40, newRequestId: () => 'req-slow' })(url))
      .rejects.toMatchObject({
        name: 'SourceError',
        kind: 'unavailable',
        message: 'Request timed out after 40 ms',
        requestId: 'req-slow',
      })
  })

  it('still ends a stream on the caller’s own abort', async () => {
    const url = await serve(async (_request, response) => {
      response.writeHead(200, { 'Content-Type': 'text/plain' })
      response.flushHeaders()
      response.write('first ')
      await sleep(1_000)
      response.end('never')
    })
    const controller = new AbortController()
    const response = await createProductFetch({ timeoutMs: 5_000 })(url, { signal: controller.signal })
    const reader = response.body!.getReader()
    await reader.read()
    controller.abort()
    await expect(reader.read()).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('does not bound a binary upload, whose send time grows with its size', async () => {
    const productFetch = createProductFetch({ fetch: slowToRespond(80).fetch, timeoutMs: 20 })
    const upload = new Blob([new Uint8Array(1024)], { type: 'video/mp4' })
    for (const body of [upload, new File([upload], 'clip.mp4'), new Uint8Array(8), new FormData()]) {
      await expect(productFetch('/api/upload', { method: 'POST', body })).resolves.toMatchObject({ status: 200 })
    }
    await expect(productFetch('/api/rpc', { method: 'POST', body: '{}' }))
      .rejects.toMatchObject({ name: 'SourceError', message: 'Request timed out after 20 ms' })
  })

  it('keeps the platform AbortError when the caller cancels', async () => {
    const { fetch } = recorder(call => new Promise<Response>((_, reject) => {
      call.init?.signal?.addEventListener('abort', () => reject(call.init!.signal!.reason))
    }))
    const controller = new AbortController()
    const pending = createProductFetch({ fetch, timeoutMs: 10_000 })('/api/slow', { signal: controller.signal })
    controller.abort()
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  })

  it('reports every settled request for telemetry', async () => {
    let clock = 0
    const { fetch } = recorder(call => new Response(null, {
      status: String(call.input).endsWith('missing') ? 404 : 200,
    }))
    const events: ProductRequestEvent[] = []
    const productFetch = createProductFetch({
      fetch,
      newRequestId: () => `req-${events.length}`,
      now: () => (clock += 5),
      onRequest: event => events.push(event),
    })
    await productFetch('/api/ok', { method: 'post' })
    await productFetch('/api/missing')
    expect(events.map(({ method, url, status, requestId, durationMs, error }) => (
      { method, url, status, requestId, durationMs, kind: error?.kind }
    ))).toEqual([
      { method: 'POST', url: '/api/ok', status: 200, requestId: 'req-0', durationMs: 5, kind: undefined },
      { method: 'GET', url: '/api/missing', status: 404, requestId: 'req-1', durationMs: 5, kind: 'not_found' },
    ])
  })
})

describe('sent request ids', () => {
  it('reach a typed error built from the returned response when the server echoes none', async () => {
    // The Dashboard path: useDataSource types a failed response itself,
    // without ensureOk and without knowing which id the transport sent.
    const { fetch } = recorder(() => new Response(null, { status: 503 }))
    const response = await createProductFetch({ fetch, newRequestId: () => 'req-503' })('/api/source')
    await expect(sourceErrorFromResponse(response)).resolves.toMatchObject({ kind: 'unavailable', requestId: 'req-503' })
  })

  it('yield to the id the server echoes', async () => {
    const { fetch } = recorder(() => new Response(null, { status: 503, headers: { 'X-Request-Id': 'server-9' } }))
    const response = await createProductFetch({ fetch, newRequestId: () => 'req-503' })('/api/source')
    await expect(sourceErrorFromResponse(response)).resolves.toMatchObject({ requestId: 'server-9' })
  })
})

describe('ensureOk', () => {
  it('passes 2xx responses through and throws typed errors with the sent request id', async () => {
    const ok = new Response('{}')
    await expect(ensureOk(ok)).resolves.toBe(ok)
    const { fetch } = recorder(() => new Response(
      JSON.stringify({ code: 'not_found', message: 'bucket finance does not exist' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } },
    ))
    const response = await createProductFetch({ fetch, newRequestId: () => 'req-404' })('/api/buckets/finance')
    await expect(ensureOk(response)).rejects.toMatchObject({
      kind: 'not_found',
      code: 'not_found',
      message: 'bucket finance does not exist',
      requestId: 'req-404',
    })
  })
})
