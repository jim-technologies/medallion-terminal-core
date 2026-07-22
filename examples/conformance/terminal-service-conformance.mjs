import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const SERVICE = 'medallion.terminal.v1.TerminalService'
const SHAPE_CASE = {
  SHAPE_TIMESERIES: 'timeseries',
  SHAPE_CANDLES: 'candles',
  SHAPE_TABLE: 'table',
  SHAPE_METRIC: 'metric',
  SHAPE_GAUGE: 'gauge',
  SHAPE_HEATMAP: 'heatmap',
  SHAPE_EVENTS: 'events',
  SHAPE_DISTRIBUTION: 'distribution',
  SHAPE_TEXT: 'text',
  SHAPE_ORDERBOOK: 'orderbook',
  SHAPE_PAIRED_GRID: 'paired_grid',
  SHAPE_EMBED: 'embed',
  SHAPE_ASSET_CATALOG: 'assets',
  SHAPE_OBJECT: 'object',
  SHAPE_GRAPH: 'graph',
  SHAPE_REPOSITORY: 'repository',
  SHAPE_RECORD_SET: 'records',
  SHAPE_GEO: 'geo',
  SHAPE_MEDIA: 'media',
  SHAPE_CONVERSATION: 'conversation',
}
const TERMINAL_STATUSES = new Set([
  'ACTION_STATUS_OK',
  'ACTION_STATUS_REJECTED',
  'ACTION_STATUS_FAILED',
  'ACTION_STATUS_CANCELLED',
])
const NON_TERMINAL_STATUSES = new Set(['ACTION_STATUS_ACCEPTED', 'ACTION_STATUS_PENDING'])

export class TerminalConformanceError extends Error {
  constructor(report) {
    super(`TerminalService conformance failed (${report.failures.length} failure${report.failures.length === 1 ? '' : 's'})`)
    this.name = 'TerminalConformanceError'
    this.report = report
  }
}

export async function runTerminalServiceConformance({
  backendUrl,
  headers = {},
  timeoutMs = 5000,
  actionProbe,
}) {
  const base = new URL(backendUrl)
  const report = { backendUrl: base.origin, sources: 0, checks: [], skipped: [], failures: [] }
  const pass = label => report.checks.push(label)
  const fail = (label, detail) => report.failures.push({ label, detail: String(detail) })

  const unary = async (method, body) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const response = await fetch(new URL(`/${SERVICE}/${method}`, base), {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      const text = await response.text()
      let json
      try { json = text ? JSON.parse(text) : {} } catch { json = undefined }
      return { response, json, text }
    } finally {
      clearTimeout(timer)
    }
  }

  let sources = []
  try {
    const listed = await unary('ListSources', {})
    if (!listed.response.ok) fail('ListSources responds successfully', `HTTP ${listed.response.status}`)
    else if (!Array.isArray(listed.json?.sources) || listed.json.sources.length === 0) {
      fail('ListSources returns a non-empty sources array', listed.text)
    } else {
      sources = listed.json.sources
      report.sources = sources.length
      pass('ListSources returns a non-empty sources array')
    }
  } catch (error) {
    fail('ListSources is reachable', error instanceof Error ? error.message : error)
  }

  const ids = new Set()
  for (const source of sources) {
    const label = `source ${JSON.stringify(source?.id)}`
    if (!source || typeof source.id !== 'string' || source.id.trim() === '') {
      fail(`${label} has a stable id`, 'missing id')
      continue
    }
    if (ids.has(source.id)) fail(`${label} id is unique`, 'duplicate id')
    else { ids.add(source.id); pass(`${label} id is unique`) }
    if (typeof source.name !== 'string' || source.name.trim() === '') fail(`${label} has a name`, 'missing name')
    if (typeof source.description !== 'string' || source.description.trim() === '') fail(`${label} has a description`, 'missing description')
    const payloadCase = SHAPE_CASE[source.shape]
    if (!payloadCase) {
      fail(`${label} declares a supported shape`, source.shape)
      continue
    }

    const params = {}
    let probeable = true
    const paramKeys = new Set()
    for (const param of source.params ?? []) {
      if (!param || typeof param.key !== 'string' || param.key === '') {
        fail(`${label} parameters have keys`, JSON.stringify(param))
        probeable = false
        continue
      }
      if (paramKeys.has(param.key)) fail(`${label} parameter keys are unique`, param.key)
      paramKeys.add(param.key)
      if (param.default_value !== undefined) params[param.key] = String(param.default_value)
      else if (Array.isArray(param.enum_values) && param.enum_values.length > 0) params[param.key] = String(param.enum_values[0])
      else if (param.required) probeable = false
    }
    if (!probeable) {
      report.skipped.push(`${source.id}: Get requires a parameter without a default`)
      continue
    }

    try {
      const result = await unary('Get', { source_id: source.id, params })
      if (!result.response.ok) {
        fail(`${source.id}: Get succeeds with catalog defaults`, `HTTP ${result.response.status}: ${result.text}`)
      } else if (!result.json || Object.keys(result.json).length !== 1 || !(payloadCase in result.json)) {
        fail(`${source.id}: Get returns ${payloadCase}`, result.text)
      } else {
        pass(`${source.id}: Get returns ${payloadCase}`)
      }
    } catch (error) {
      fail(`${source.id}: Get succeeds with catalog defaults`, error instanceof Error ? error.message : error)
    }

    if (source.streamable) {
      try {
        const messages = await streamRpc({
          base,
          method: 'Stream',
          body: { source_id: source.id, params },
          headers,
          timeoutMs,
          stopAtFirst: true,
        })
        const first = messages[0]
        if (!first || Object.keys(first).length !== 1 || !(payloadCase in first)) {
          fail(`${source.id}: Stream first frame returns ${payloadCase}`, JSON.stringify(first))
        } else {
          pass(`${source.id}: Stream first frame returns ${payloadCase}`)
        }
      } catch (error) {
        fail(`${source.id}: Stream yields a frame`, error instanceof Error ? error.message : error)
      }
    }
  }

  try {
    const unknown = await unary('Get', { source_id: '__terminal_conformance_unknown__' })
    if (unknown.response.ok) fail('unknown sources return a non-success status', unknown.text)
    else pass('unknown sources return a non-success status')
  } catch (error) {
    fail('unknown source behavior is reachable', error instanceof Error ? error.message : error)
  }

  if (actionProbe?.actionId) {
    await probeAction({ base, headers, timeoutMs, actionProbe, unary, pass, fail })
  } else {
    report.skipped.push('write lifecycle: no actionProbe configured')
  }

  if (report.failures.length > 0) throw new TerminalConformanceError(report)
  return report
}

async function probeAction({ base, headers, timeoutMs, actionProbe, unary, pass, fail }) {
  const clientRequestId = `conformance-${randomUUID()}`
  const body = {
    action_id: actionProbe.actionId,
    client_request_id: clientRequestId,
    params: actionProbe.params ?? {},
  }
  try {
    const first = await unary('SubmitAction', body)
    const duplicate = await unary('SubmitAction', body)
    if (!first.response.ok || !duplicate.response.ok) {
      fail('SubmitAction accepts the configured probe', `HTTP ${first.response.status}/${duplicate.response.status}`)
      return
    }
    if (JSON.stringify(first.json) !== JSON.stringify(duplicate.json)) {
      fail('SubmitAction is idempotent by client_request_id', 'duplicate response changed')
      return
    }
    pass('SubmitAction is idempotent by client_request_id')
    const status = first.json?.status
    if (!TERMINAL_STATUSES.has(status) && !NON_TERMINAL_STATUSES.has(status)) {
      fail('SubmitAction returns a known lifecycle status', status)
      return
    }
    pass('SubmitAction returns a known lifecycle status')

    const updates = await streamRpc({
      base,
      method: 'WatchAction',
      body: { client_request_id: clientRequestId },
      headers,
      timeoutMs,
      stopAtFirst: false,
    })
    if (updates.length === 0) {
      fail('WatchAction returns lifecycle updates', 'empty stream')
      return
    }
    for (let index = 1; index < updates.length; index += 1) {
      if (Number(updates[index].sequence) <= Number(updates[index - 1].sequence)) {
        fail('WatchAction sequence is monotonic', JSON.stringify(updates.map(item => item.sequence)))
        return
      }
    }
    pass('WatchAction sequence is monotonic')
    if (!TERMINAL_STATUSES.has(updates.at(-1)?.status)) {
      fail('WatchAction closes after a terminal status', updates.at(-1)?.status)
      return
    }
    pass('WatchAction closes after a terminal status')
  } catch (error) {
    fail('write lifecycle completes', error instanceof Error ? error.message : error)
  }
}

async function streamRpc({ base, method, body, headers, timeoutMs, stopAtFirst }) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  let reader
  try {
    const response = await fetch(new URL(`/${SERVICE}/${method}`, base), {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/connect+json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`${method}: HTTP ${response.status}: ${await response.text()}`)
    if (!response.body) throw new Error(`${method}: response has no body`)
    reader = response.body.getReader()
    const messages = []
    let bytes = new Uint8Array(0)
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const next = new Uint8Array(bytes.length + (value?.length ?? 0))
      next.set(bytes)
      if (value) next.set(value, bytes.length)
      bytes = next
      let offset = 0
      while (bytes.length - offset >= 5) {
        const flags = bytes[offset]
        const length = new DataView(bytes.buffer, bytes.byteOffset + offset + 1, 4).getUint32(0)
        if (bytes.length - offset < length + 5) break
        const payload = bytes.subarray(offset + 5, offset + 5 + length)
        offset += length + 5
        const parsed = payload.length ? JSON.parse(new TextDecoder().decode(payload)) : {}
        if (flags & 0x02) {
          if (parsed.error) throw new Error(`${parsed.error.code ?? 'unknown'}: ${parsed.error.message ?? 'stream error'}`)
          return messages
        }
        messages.push(parsed)
        if (stopAtFirst) return messages
      }
      if (offset > 0) bytes = bytes.slice(offset)
    }
    return messages
  } finally {
    clearTimeout(timer)
    controller.abort()
    if (reader) await reader.cancel().catch(() => {})
  }
}

function printReport(report) {
  process.stdout.write(`TerminalService conformance OK: ${report.sources} sources, ${report.checks.length} checks`)
  if (report.skipped.length > 0) process.stdout.write(`, ${report.skipped.length} skipped`)
  process.stdout.write('\n')
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const backendUrl = process.argv[2]
  if (!backendUrl) {
    process.stderr.write('Usage: node terminal-service-conformance.mjs <backend-url> [--bearer-env NAME] [--action-id ID]\n')
    process.exitCode = 2
  } else {
    const bearerIndex = process.argv.indexOf('--bearer-env')
    const actionIndex = process.argv.indexOf('--action-id')
    const bearer = bearerIndex >= 0 ? process.env[process.argv[bearerIndex + 1]] : undefined
    runTerminalServiceConformance({
      backendUrl,
      headers: bearer ? { Authorization: `Bearer ${bearer}` } : {},
      actionProbe: actionIndex >= 0 ? { actionId: process.argv[actionIndex + 1], params: {} } : undefined,
    }).then(printReport).catch(error => {
      const report = error?.report
      if (report) {
        for (const failure of report.failures) process.stderr.write(`FAIL ${failure.label}: ${failure.detail}\n`)
      } else {
        process.stderr.write(`${error instanceof Error ? error.message : error}\n`)
      }
      process.exitCode = 1
    })
  }
}
