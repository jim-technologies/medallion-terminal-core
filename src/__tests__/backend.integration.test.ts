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
    expect(ids).toEqual(expect.arrayContaining([
      'files',
      'platform_assets',
      'platform_object',
      'platform_lineage',
      'platform_repository',
      'business_records',
      'workspace_conversation',
    ]))
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

  it('Get exposes canonical platform catalog, object, graph, and repository payloads', async () => {
    const assets = await rpc<{
      assets: { items: Array<{ id: string; kind: string }>; total: string }
    }>('Get', { source_id: 'platform_assets' })
    expect(Number(assets.assets.total)).toBeGreaterThanOrEqual(5)
    expect(assets.assets.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'dataset.customer_360', kind: 'dataset' }),
      expect.objectContaining({ id: 'repository.analytics', kind: 'repository' }),
    ]))

    const object = await rpc<{
      object: {
        object_id: string
        properties: Array<{ key: string }>
        links: Array<{ target_id: string }>
        actions: Array<{ id: string }>
      }
    }>('Get', {
      source_id: 'platform_object',
      params: { asset_id: 'dataset.customer_360', asset_kind: 'dataset' },
    })
    expect(object.object.object_id).toBe('dataset.customer_360')
    expect(object.object.properties.length).toBeGreaterThan(0)
    expect(object.object.links.length).toBeGreaterThan(0)
    expect(object.object.actions.length).toBeGreaterThan(0)

    const graph = await rpc<{
      graph: { nodes: Array<{ id: string }>; edges: Array<{ from: string; to: string }> }
    }>('Get', {
      source_id: 'platform_lineage',
      params: { asset_id: 'dataset.customer_360' },
    })
    expect(graph.graph.nodes.map(node => node.id)).toContain('dataset.customer_360')
    expect(graph.graph.edges.length).toBeGreaterThan(0)

    const repository = await rpc<{
      repository: {
        repository: string
        entries: Array<{ path: string; kind: string }>
        file?: { path: string; content: string }
      }
    }>('Get', {
      source_id: 'platform_repository',
      params: { repository: 'analytics', ref: 'main', path: 'src/customer.ts' },
    })
    expect(repository.repository.repository).toBe('analytics')
    expect(repository.repository.entries.length).toBeGreaterThan(0)
    expect(repository.repository.file?.path).toBe('src/customer.ts')
    expect(repository.repository.file?.content).toContain('customerHealth')
  })

  it('Get exposes a generic typed record set with reusable saved views', async () => {
    const out = await rpc<{
      records: {
        workspace_id: string
        table_id: string
        primary_field: string
        fields: Array<{ key: string; type: string }>
        records: Array<{ id: string; revision: string; values: Record<string, unknown> }>
        views: Array<{ id: string; type: string; group_by?: string; date_field?: string }>
        capabilities: {
          create: boolean
          update: boolean
          delete: boolean
          create_action_id: string
        }
      }
    }>('Get', {
      source_id: 'business_records',
      params: { table_id: 'work_items' },
    })

    expect(out.records).toMatchObject({
      workspace_id: 'business-ops',
      table_id: 'work_items',
      primary_field: 'name',
      capabilities: {
        create: true,
        update: true,
        delete: true,
        create_action_id: 'record_create',
      },
    })
    expect(out.records.fields).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'customer', type: 'RECORD_FIELD_TYPE_LINK' }),
      expect.objectContaining({ key: 'margin', type: 'RECORD_FIELD_TYPE_FORMULA' }),
    ]))
    expect(out.records.records.length).toBeGreaterThanOrEqual(8)
    expect(out.records.views).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'RECORD_VIEW_TYPE_GRID' }),
      expect.objectContaining({ type: 'RECORD_VIEW_TYPE_BOARD', group_by: 'stage' }),
      expect.objectContaining({ type: 'RECORD_VIEW_TYPE_CALENDAR', date_field: 'due_date' }),
      expect.objectContaining({ type: 'RECORD_VIEW_TYPE_FORM' }),
    ]))
  })

  it('Get exposes the canonical conversation payload', async () => {
    const out = await rpc<{
      conversation: {
        id: string
        viewer_id: string
        participants: Array<{ id: string; name: string }>
        messages: Array<{
          id: string
          sender_id?: string
          reply_to_id?: string
          reactions?: Array<{ key: string; count: number }>
        }>
        context: Record<string, string>
      }
    }>('Get', {
      source_id: 'workspace_conversation',
      params: { conversation_id: 'launch-room' },
    })

    expect(out.conversation).toMatchObject({
      id: 'launch-room',
      viewer_id: 'jun',
      context: {
        workspace_id: 'jim-technologies',
        conversation_id: 'launch-room',
      },
    })
    expect(out.conversation.participants.map(participant => participant.id))
      .toEqual(expect.arrayContaining(['jun', 'maya', 'lina']))
    expect(out.conversation.messages[0].reactions?.[0])
      .toMatchObject({ key: 'check', count: 3 })
    expect(out.conversation.messages.some(message => message.reply_to_id))
      .toBe(true)
  })

  it('record create/update/delete is idempotent and revision-safe', async () => {
    const createRequestId = newClientRequestId()
    const createBody = buildActionRequest({
      actionId: 'record_create',
      clientRequestId: createRequestId,
      params: {
        workspace_id: 'business-ops',
        table_id: 'work_items',
        values: {
          name: `Test work ${createRequestId.slice(0, 8)}`,
          customer: { id: 'customer-test', label: 'Test Customer' },
          stage: 'pipeline',
          owner: 'unassigned',
          value: 12000,
          cost: 7000,
          due_date: '2026-08-12',
          priority: 'normal',
          tags: ['advisory'],
          completed: false,
        },
      },
    })
    const created = await rpc<{
      id: string
      status: string
      data: { record_id: string; revision: string }
    }>('SubmitAction', createBody)
    const retried = await rpc<{
      id: string
      status: string
      data: { record_id: string; revision: string }
    }>('SubmitAction', createBody)
    expect(created.status).toBe('ACTION_STATUS_OK')
    expect(retried).toEqual(created)
    expect(created.data.revision).toBe('1')

    const updated = await rpc<{
      status: string
      data: { record_id: string; revision: string }
    }>('SubmitAction', buildActionRequest({
      actionId: 'record_update',
      clientRequestId: newClientRequestId(),
      params: {
        workspace_id: 'business-ops',
        table_id: 'work_items',
        record_id: created.data.record_id,
        revision: created.data.revision,
        values: { stage: 'delivery', value: 15000 },
      },
    }))
    expect(updated).toMatchObject({
      status: 'ACTION_STATUS_OK',
      data: {
        record_id: created.data.record_id,
        revision: '2',
      },
    })

    const stale = await rpc<{
      status: string
      message: string
      data: { current_revision: string }
    }>('SubmitAction', buildActionRequest({
      actionId: 'record_update',
      clientRequestId: newClientRequestId(),
      params: {
        workspace_id: 'business-ops',
        table_id: 'work_items',
        record_id: created.data.record_id,
        revision: '1',
        values: { stage: 'done' },
      },
    }))
    expect(stale.status).toBe('ACTION_STATUS_REJECTED')
    expect(stale.message).toContain('Revision conflict')
    expect(stale.data.current_revision).toBe('2')

    const snapshot = await rpc<{
      records: { records: Array<{ id: string; revision: string; values: Record<string, unknown> }> }
    }>('Get', {
      source_id: 'business_records',
      params: { table_id: 'work_items' },
    })
    const record = snapshot.records.records.find(candidate => candidate.id === created.data.record_id)
    expect(record).toMatchObject({
      revision: '2',
      values: { stage: 'delivery', value: 15000 },
    })
    expect(record?.values.margin).toBeCloseTo((15000 - 7000) / 15000, 4)

    const deleted = await rpc<{ status: string }>('SubmitAction', buildActionRequest({
      actionId: 'record_delete',
      clientRequestId: newClientRequestId(),
      params: {
        workspace_id: 'business-ops',
        table_id: 'work_items',
        record_id: created.data.record_id,
        revision: updated.data.revision,
      },
    }))
    expect(deleted.status).toBe('ACTION_STATUS_OK')
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
    const duplicate = await rpc<{ id: string; status: string }>('SubmitAction', submitBody)
    expect(duplicate).toEqual(submitRes)

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

    const statuses = updates.map(u => u.status)
    expect(statuses).toEqual([
      'ACTION_STATUS_ACCEPTED',
      'ACTION_STATUS_PENDING',
      'ACTION_STATUS_PENDING',
      'ACTION_STATUS_OK',
    ])
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

  it('generic object actions may complete synchronously', async () => {
    const out = await rpc<{ id: string; status: string; message: string }>('SubmitAction', buildActionRequest({
      actionId: 'request_asset_review',
      params: { asset_id: 'dataset.customer_360' },
      clientRequestId: newClientRequestId(),
    }))
    expect(out.status).toBe('ACTION_STATUS_OK')
    expect(out.message).toContain('request_asset_review')
  })

  it('file upload, listing, ranged preview, and download use path-based identifiers', async () => {
    const filename = `upload-${Date.now()}.txt`
    const path = `tests/${filename}`
    const content = 'hello platform file store'
    const uploadBody = buildActionRequest({
      actionId: 'upload',
      params: {
        namespace: 'demo',
        repo: 'tests',
        path: filename,
        content_type: 'text/plain',
        data_b64: Buffer.from(content).toString('base64'),
      },
      clientRequestId: newClientRequestId(),
    })
    const upload = await rpc<{
      id: string
      status: string
      data: { path: string; size_bytes: number }
    }>('SubmitAction', uploadBody)
    const retriedUpload = await rpc<typeof upload>('SubmitAction', uploadBody)
    expect(upload.status).toBe('ACTION_STATUS_OK')
    expect(retriedUpload).toEqual(upload)
    expect(upload.id).toBe(path)
    expect(upload.data).toEqual({ path, size_bytes: Buffer.byteLength(content) })

    const listing = await rpc<{
      table: { rows: Array<{ kind: string; name: string }> }
    }>('Get', {
      source_id: 'files',
      params: { namespace: 'demo', path: 'tests' },
    })
    expect(listing.table.rows).toContainEqual(expect.objectContaining({
      kind: 'file',
      name: filename,
    }))

    const mediaUrl = new URL('/media', backendUrl)
    mediaUrl.searchParams.set('namespace', 'demo')
    mediaUrl.searchParams.set('path', path)
    const media = await fetch(mediaUrl, { headers: { Range: 'bytes=0-4' } })
    expect(media.status).toBe(206)
    expect(media.headers.get('content-range')).toBe(`bytes 0-4/${Buffer.byteLength(content)}`)
    expect(await media.text()).toBe('hello')

    const download = await fetch(`${backendUrl}/files.v1.FileService/Download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/connect+json' },
      body: JSON.stringify({ namespace: 'demo', path }),
    })
    expect(download.body).toBeTruthy()
    const chunks: string[] = []
    await parseConnectEnvelopes(download.body!.getReader(), {
      onMessage: raw => chunks.push((raw as { data: string }).data),
      isDisposed: () => false,
    })
    const downloaded = Buffer.concat(chunks.map(chunk => Buffer.from(chunk, 'base64'))).toString()
    expect(downloaded).toBe(content)
  })
})
