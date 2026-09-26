import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  SourceError,
  describeSourceError,
  isSourceError,
  parseRetryAfter,
  sourceErrorFromResponse,
  sourceErrorKindForStatus,
  toSourceError,
} from '../core/sourceError'
import { DesignSystemProvider } from '../foundations/DesignSystemProvider'
import { ErrorState } from '../workbench/States'

function connectError(status: number, body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}

describe('SourceError from responses', () => {
  it('keeps the Connect code, the server reason, the request id and Retry-After', async () => {
    const error = await sourceErrorFromResponse(connectError(
      403,
      { code: 'permission_denied', message: 'payroll:read scope required' },
      { 'X-Request-Id': 'req_81M', 'Retry-After': '30' },
    ))
    expect(error).toBeInstanceOf(SourceError)
    expect(error).toMatchObject({
      kind: 'forbidden',
      status: 403,
      code: 'permission_denied',
      message: 'payroll:read scope required',
      requestId: 'req_81M',
      retryAfterMs: 30_000,
    })
    expect(describeSourceError(error)).toBe('permission_denied: payroll:read scope required')
  })

  it('lets the Connect code decide the kind over the HTTP status', async () => {
    const error = await sourceErrorFromResponse(connectError(400, { code: 'resource_exhausted', message: 'quota' }))
    expect(error.kind).toBe('rate_limited')
  })

  it('falls back to the status when the body is missing, not JSON, or malformed', async () => {
    const bare = await sourceErrorFromResponse(new Response(null, { status: 503 }))
    expect(bare).toMatchObject({ kind: 'unavailable', status: 503, message: 'HTTP 503', code: undefined })
    expect(describeSourceError(bare)).toBe('HTTP 503')
    const html = await sourceErrorFromResponse(new Response('<h1>oops</h1>', {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    }))
    expect(html).toMatchObject({ kind: 'unknown', message: 'HTTP 500' })
    const truncated = await sourceErrorFromResponse(new Response('{"code":"permission', {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }))
    expect(truncated).toMatchObject({ kind: 'forbidden', message: 'HTTP 403', code: undefined })
  })

  it('stops reading a runaway error body instead of buffering it whole', async () => {
    let cancelled = false
    const chunk = new TextEncoder().encode(`{"message":"${'x'.repeat(4096)}`)
    // An endless body: `response.text()` would never settle.
    const endless = new ReadableStream<Uint8Array>({
      pull: controller => controller.enqueue(chunk),
      cancel: () => { cancelled = true },
    })
    const error = await sourceErrorFromResponse(new Response(endless, {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }))
    expect(error).toMatchObject({ kind: 'unknown', message: 'HTTP 500' })
    expect(cancelled).toBe(true)
  })

  it('uses the request id the client sent when the server echoes none', async () => {
    const error = await sourceErrorFromResponse(new Response(null, { status: 401 }), { requestId: 'client-1' })
    expect(error).toMatchObject({ kind: 'unauthenticated', requestId: 'client-1' })
  })

  it('maps the statuses people act on', () => {
    expect([401, 403, 404, 410, 429, 408, 502, 503, 504, 400, 409, 422, 500, 418]
      .map(sourceErrorKindForStatus)).toEqual([
      'unauthenticated', 'forbidden', 'not_found', 'not_found', 'rate_limited',
      'unavailable', 'unavailable', 'unavailable', 'unavailable',
      'invalid', 'invalid', 'invalid', 'unknown', 'unknown',
    ])
  })
})

describe('SourceError from thrown values', () => {
  it('maps generated Connect client errors by numeric or string code', () => {
    const denied = toSourceError(Object.assign(new Error('[permission_denied] no access'), {
      code: 7,
      rawMessage: 'no access',
      metadata: new Headers({ 'x-request-id': 'req_9' }),
    }))
    expect(denied).toMatchObject({ kind: 'forbidden', code: 'permission_denied', message: 'no access', requestId: 'req_9' })
    expect(toSourceError({ code: 'internal', message: 'boom' })).toMatchObject({ kind: 'unknown', code: 'internal' })
    expect(toSourceError({ code: 16, rawMessage: 'expired' })).toMatchObject({ kind: 'unauthenticated' })
  })

  it('treats timeouts and network failures as unavailable', () => {
    expect(toSourceError(new TypeError('Failed to fetch')).kind).toBe('unavailable')
    expect(toSourceError(new DOMException('signal timed out', 'TimeoutError')).kind).toBe('unavailable')
    expect(toSourceError(new Error('bad json')).kind).toBe('unknown')
    expect(toSourceError('plain string')).toMatchObject({ kind: 'unknown', message: 'plain string' })
  })

  it('passes SourceErrors through, including ones from another package copy', () => {
    const own = new SourceError('x', { kind: 'forbidden' })
    expect(toSourceError(own)).toBe(own)
    const foreign = Object.assign(new Error('y'), { name: 'SourceError', kind: 'not_found' })
    expect(isSourceError(foreign)).toBe(true)
    expect(isSourceError(new Error('z'))).toBe(false)
  })

  it('parses Retry-After as seconds or an HTTP date', () => {
    const now = Date.UTC(2026, 8, 25, 12, 0, 0)
    expect(parseRetryAfter('120', now)).toBe(120_000)
    expect(parseRetryAfter(new Date(now + 45_000).toUTCString(), now)).toBe(45_000)
    expect(parseRetryAfter(new Date(now - 1_000).toUTCString(), now)).toBeUndefined()
    expect(parseRetryAfter('soon', now)).toBeUndefined()
    expect(parseRetryAfter(null, now)).toBeUndefined()
  })
})

describe('ErrorState with a typed error', () => {
  const denied = new SourceError('payroll:read scope required', {
    kind: 'forbidden',
    status: 403,
    code: 'permission_denied',
    requestId: 'req_81M',
  })

  it('leads with product copy and keeps the server detail in a disclosure', () => {
    const html = renderToStaticMarkup(<ErrorState error={denied} onRetry={() => {}} />)
    expect(html).toContain('data-error-kind="forbidden"')
    expect(html).toContain('You don’t have access')
    expect(html).toContain('Ask an owner for access.')
    expect(html).not.toContain('HTTP 403')
    expect(html).toMatch(/<details class="mtc-state-details"><summary>Details<\/summary><p>payroll:read scope required<\/p>/)
    expect(html).toContain('<code>permission_denied</code>')
    expect(html).toContain('<code>req_81M</code>')
  })

  it('states the wait for rate limits and uses the warning intent for transient failures', () => {
    const limited = new SourceError('slow down', { kind: 'rate_limited', retryAfterMs: 30_000 })
    const html = renderToStaticMarkup(<ErrorState error={limited} />)
    expect(html).toContain('Try again in 30 seconds.')
    expect(html).toContain('data-intent="warning"')
  })

  it('translates the typed copy with the scope locale', () => {
    const html = renderToStaticMarkup(
      <DesignSystemProvider locale="zh-CN"><ErrorState error={denied} /></DesignSystemProvider>,
    )
    expect(html).toContain('您没有访问权限')
    expect(html).toContain('请求 ID')
  })

  it('lets explicit title and message win over the typed copy', () => {
    const html = renderToStaticMarkup(<ErrorState error={denied} title="Payroll is private" message="Ask finance." />)
    expect(html).toContain('Payroll is private')
    expect(html).toContain('Ask finance.')
    expect(html).not.toContain('You don’t have access')
  })
})
