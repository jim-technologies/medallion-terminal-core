import { describe, expect, it } from 'vitest'
import { parseConnectEnvelopes } from '../core/connectFraming'
import { validateTemplate } from '../core/validateTemplate'
import {
  AUTHORIZED_WORKSPACE_TEMPLATE,
  GOVERNED_WORKFLOW_TEMPLATE,
  LARGE_COLLECTIONS_TEMPLATE,
  READINESS_BACKEND_HEADERS,
  READINESS_BACKEND_URL,
  READINESS_TABS,
  RESILIENCE_LAB_TEMPLATE,
} from '../../examples/readiness/readinessTemplates'
import { createReadinessTerminalFetch } from '../../examples/readiness/readinessTerminalMock'

const SERVICE = 'medallion.terminal.v1.TerminalService'
const templates = [
  AUTHORIZED_WORKSPACE_TEMPLATE,
  RESILIENCE_LAB_TEMPLATE,
  LARGE_COLLECTIONS_TEMPLATE,
  GOVERNED_WORKFLOW_TEMPLATE,
]

function readinessFetch() {
  return createReadinessTerminalFetch(async () => {
    throw new Error('the readiness fixture must not delegate its own origin')
  })
}

async function rpc(
  method: string,
  body: Record<string, unknown>,
  headers: Record<string, string> = READINESS_BACKEND_HEADERS,
) {
  return readinessFetch()(`${READINESS_BACKEND_URL}/${SERVICE}/${method}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('production readiness examples', () => {
  it('keeps every scenario valid, uniquely keyed, and credential-free', () => {
    for (const template of templates) {
      expect(validateTemplate(template)).toEqual([])
      const ids = template.widgets.map(widget => widget.id)
      expect(new Set(ids).size).toBe(ids.length)
      expect(JSON.stringify(template)).not.toContain('Authorization')
      expect(JSON.stringify(template)).not.toContain('Bearer ')
    }
    expect(READINESS_TABS.map(tab => tab.template)).toEqual(templates)
  })

  it('fails closed without both the host credential and tenant header', async () => {
    const missing = await rpc('ListSources', {}, {})
    expect(missing.status).toBe(401)
    await expect(missing.json()).resolves.toMatchObject({ code: 'unauthenticated' })

    const missingTenant = await rpc('ListSources', {}, {
      Authorization: READINESS_BACKEND_HEADERS.Authorization,
    })
    expect(missingTenant.status).toBe(401)
  })

  it('returns a documented source catalog and intentional policy denial', async () => {
    const listed = await rpc('ListSources', {})
    const catalog = await listed.json() as { sources: Array<{ id: string; description: string }> }
    expect(catalog.sources.length).toBeGreaterThanOrEqual(16)
    expect(catalog.sources.every(source => source.id && source.description)).toBe(true)

    const denied = await rpc('Get', { source_id: 'readiness_restricted_payroll' })
    expect(denied.status).toBe(403)
    await expect(denied.json()).resolves.toEqual({
      code: 'permission_denied',
      message: 'payroll:read scope required',
    })
  })

  it('pages collections with opaque, scoped cursors', async () => {
    const first = await rpc('Get', {
      source_id: 'readiness_paged_assets',
      params: { page_size: '8', page_token: '' },
    })
    const firstBody = await first.json() as {
      assets: { items: Array<{ id: string }>; next_page_token: string }
    }
    expect(firstBody.assets.items).toHaveLength(8)
    expect(firstBody.assets.next_page_token).not.toMatch(/^\d+$/)

    const second = await rpc('Get', {
      source_id: 'readiness_paged_assets',
      params: { page_size: '8', page_token: firstBody.assets.next_page_token },
    })
    const secondBody = await second.json() as {
      assets: { items: Array<{ id: string }> }
    }
    expect(secondBody.assets.items).toHaveLength(8)
    expect(secondBody.assets.items[0].id).not.toBe(firstBody.assets.items[0].id)

    const crossScope = await rpc('Get', {
      source_id: 'readiness_paged_records',
      params: { page_size: '10', page_token: firstBody.assets.next_page_token },
    })
    expect(crossScope.status).toBe(400)
    await expect(crossScope.json()).resolves.toMatchObject({ code: 'invalid_argument' })
  })

  it('models idempotent writes and a monotonic terminal lifecycle', async () => {
    const request = {
      action_id: 'approve_change',
      client_request_id: 'readiness-test-request',
      params: { change_id: 'CHG-2048', decision: 'approve' },
    }
    const fetch = readinessFetch()
    const submitUrl = `${READINESS_BACKEND_URL}/${SERVICE}/SubmitAction`
    const submit = () => fetch(submitUrl, {
      method: 'POST',
      headers: { ...READINESS_BACKEND_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })
    const first = await submit()
    const duplicate = await submit()
    expect(await duplicate.json()).toEqual(await first.json())

    const watched = await fetch(`${READINESS_BACKEND_URL}/${SERVICE}/WatchAction`, {
      method: 'POST',
      headers: { ...READINESS_BACKEND_HEADERS, 'Content-Type': 'application/connect+json' },
      body: JSON.stringify({ client_request_id: request.client_request_id }),
    })
    const updates: Array<{ sequence: number; status: string }> = []
    expect(watched.body).not.toBeNull()
    await parseConnectEnvelopes(watched.body!.getReader(), {
      onMessage: value => updates.push(value as { sequence: number; status: string }),
      isDisposed: () => false,
    })
    expect(updates.map(update => update.sequence)).toEqual([0, 1, 2])
    expect(updates[updates.length - 1]?.status).toBe('ACTION_STATUS_OK')
  })
})
