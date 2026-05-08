import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import type { Server } from 'node:http'
import { createTerminalServer } from '../../examples/backend/server.mjs'
import {
  buildActionRequest,
  buildActionWatchRequest,
  buildSubmitActionUrl,
  buildWatchActionUrl,
  newClientRequestId,
} from '../core/resolveSource'
import { parseConnectEnvelopes } from '../core/connectFraming'
import { isTerminalStatus, type ActionUpdate } from '../hooks/useWatchAction'

// Round-trips the reference backend through the same client utilities
// the dashboard uses. Catches drift between proto, frontend helpers,
// and the backend impl.

const SERVICE = 'medallion.terminal.v1.TerminalService'

let server: Server
let backendUrl: string

beforeAll(async () => {
  server = createTerminalServer()
  await new Promise<void>(resolve => server.listen(0, resolve))
  const addr = server.address()
  if (typeof addr !== 'object' || !addr) throw new Error('no address')
  backendUrl = `http://127.0.0.1:${addr.port}`
})

afterAll(async () => {
  await new Promise<void>(resolve => server.close(() => resolve()))
})

async function rpc<T>(method: string, body: unknown): Promise<T> {
  const res = await fetch(`${backendUrl}/${SERVICE}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`${method}: HTTP ${res.status}`)
  return res.json() as Promise<T>
}

describe('reference backend ↔ client', () => {
  it('ListSources returns the catalog with proto-shaped fields', async () => {
    const out = await rpc<{ sources: Array<{ id: string; shape: string; streamable: boolean; params: Array<{ key: string; type?: string }> }> }>('ListSources', {})
    expect(out.sources.length).toBeGreaterThan(0)
    const ids = out.sources.map(s => s.id)
    expect(ids).toContain('btc_spot')
    expect(ids).toContain('btc_options')
    // Proto canonical: shape values are SHAPE_*; param.type values are PARAM_TYPE_*.
    for (const s of out.sources) {
      expect(s.shape).toMatch(/^SHAPE_/)
      for (const p of s.params ?? []) {
        if (p.type) expect(p.type).toMatch(/^PARAM_TYPE_/)
      }
    }
  })

  it('Get(btc_options) returns a paired_grid payload matching the new contract', async () => {
    const out = await rpc<{ paired_grid: { subject: string; measures: Array<{ key: string; format?: string }>; rows: Array<{ key: number; left: { values: Record<string, number> } }> } }>('Get', { source_id: 'btc_options' })
    const pg = out.paired_grid
    expect(pg.subject).toBe('BTC')
    expect(pg.measures.map(m => m.key)).toEqual(['iv', 'delta', 'bid', 'ask'])
    // Each row.left/right uses the canonical { values: {...} } shape.
    expect(pg.rows[0].left.values).toBeDefined()
    expect(typeof pg.rows[0].left.values.iv).toBe('number')
  })

  it('Stream(btc_spot) frames decode through parseConnectEnvelopes', async () => {
    const res = await fetch(`${backendUrl}/${SERVICE}/Stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/connect+json' },
      body: JSON.stringify({ source_id: 'btc_spot' }),
    })
    expect(res.body).toBeTruthy()
    const reader = res.body!.getReader()

    const messages: unknown[] = []
    let disposed = false
    // Stop after the first frame — the stream is open-ended otherwise.
    const parsing = parseConnectEnvelopes(reader, {
      onMessage: msg => {
        messages.push(msg)
        if (messages.length >= 1) disposed = true
      },
      isDisposed: () => disposed,
    })
    await Promise.race([parsing, new Promise(resolve => setTimeout(resolve, 1500))])
    reader.cancel().catch(() => {})

    expect(messages.length).toBeGreaterThanOrEqual(1)
    expect((messages[0] as { metric: { value: number } }).metric.value).toBeTypeOf('number')
  })

  it('SubmitAction → WatchAction completes through ACCEPTED → PENDING → OK', async () => {
    const clientRequestId = newClientRequestId()
    const submitBody = buildActionRequest({ actionId: 'place_order', params: { symbol: 'BTC', amount: 0.25 }, clientRequestId })

    const submit = await fetch(buildSubmitActionUrl(backendUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitBody),
    })
    const submitRes = await submit.json() as { id: string; status: string }
    expect(submitRes.status).toBe('ACTION_STATUS_ACCEPTED')
    expect(submitRes.id).toMatch(/^ord-/)

    const watch = await fetch(buildWatchActionUrl(backendUrl), {
      method: 'POST',
      headers: { 'Content-Type': 'application/connect+json' },
      body: JSON.stringify(buildActionWatchRequest({ clientRequestId })),
    })
    expect(watch.body).toBeTruthy()

    const updates: ActionUpdate[] = []
    let disposed = false
    const reader = watch.body!.getReader()
    const parsing = parseConnectEnvelopes(reader, {
      onMessage: raw => {
        const u = raw as ActionUpdate
        updates.push(u)
        if (isTerminalStatus(u.status)) disposed = true
      },
      onTrailer: () => { disposed = true },
      isDisposed: () => disposed,
    })
    await Promise.race([parsing, new Promise(resolve => setTimeout(resolve, 5000))])
    reader.cancel().catch(() => {})

    expect(updates.length).toBeGreaterThanOrEqual(2)
    const statuses = updates.map(u => u.status)
    expect(statuses[0]).toBe('ACTION_STATUS_ACCEPTED')
    expect(statuses[statuses.length - 1]).toBe('ACTION_STATUS_OK')
    // Sequence is monotonic.
    for (let i = 1; i < updates.length; i++) {
      expect(updates[i].sequence).toBe(updates[i - 1].sequence + 1)
    }
    // Idempotency: client_request_id round-trips.
    expect(updates[0].client_request_id).toBe(clientRequestId)
  })

  it('Generate emits actions + context for a symbol+intent prompt', async () => {
    const out = await rpc<{ text: string; actions: Array<{ component: string; target_id?: string }>; context?: { values: Record<string, string> }; replace_all?: boolean }>('Generate', {
      prompt: 'show me ETH candles and the order book',
      context: { values: { symbol: 'BTCUSD' } },
      current_widgets: [],
    })
    expect(out.text).toMatch(/ETHUSD/)
    expect(out.context?.values.symbol).toBe('ETHUSD')
    expect(out.replace_all ?? false).toBe(false)
    const components = out.actions.map(a => a.component).sort()
    expect(components).toEqual(['candlestick', 'orderbook'])
  })

  it('Generate full-rebuild prompt sets replace_all and emits the standard layout', async () => {
    const out = await rpc<{ actions: Array<{ component: string }>; replace_all?: boolean }>('Generate', {
      prompt: 'rebuild for SOL',
      context: { values: {} },
      current_widgets: [],
    })
    expect(out.replace_all).toBe(true)
    expect(out.actions.length).toBeGreaterThanOrEqual(4)
  })

  it('Stream error trailer reaches the client via onTrailer', async () => {
    const res = await fetch(`${backendUrl}/${SERVICE}/Stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/connect+json' },
      body: JSON.stringify({ source_id: '__error_after', params: { count: '3', code: 'unavailable', message: 'upstream down' } }),
    })
    expect(res.body).toBeTruthy()
    const reader = res.body!.getReader()

    const messages: unknown[] = []
    let trailerError: { code?: string; message?: string } | null = null
    let trailerSeen = false
    let disposed = false
    await parseConnectEnvelopes(reader, {
      onMessage: m => { messages.push(m) },
      onTrailer: t => { trailerSeen = true; trailerError = t.error ?? null; disposed = true },
      isDisposed: () => disposed,
    })
    reader.cancel().catch(() => {})

    expect(messages.length).toBe(3)
    expect(trailerSeen).toBe(true)
    expect(trailerError).not.toBeNull()
    expect(trailerError!.code).toBe('unavailable')
    expect(trailerError!.message).toBe('upstream down')
  })

  it('SubmitAction is idempotent on identical client_request_id', async () => {
    const clientRequestId = newClientRequestId()
    const body = buildActionRequest({ actionId: 'place_order', params: { amount: 1 }, clientRequestId })
    const a = await rpc<{ id: string }>('SubmitAction', body)
    const b = await rpc<{ id: string }>('SubmitAction', body)
    expect(a.id).toBe(b.id)
  })
})
