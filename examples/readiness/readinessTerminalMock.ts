import {
  READINESS_BACKEND_HEADERS,
  READINESS_BACKEND_URL,
} from './readinessTemplates'

const SERVICE_PATH = '/medallion.terminal.v1.TerminalService/'
const encoder = new TextEncoder()

interface SubmittedAction {
  id: string
  actionId: string
  clientRequestId: string
  decision: string
}

const SOURCES = [
  source('readiness_protected_object', 'Protected customer object', 'SHAPE_OBJECT', 'Authorized object with field masking.'),
  source('readiness_restricted_payroll', 'Restricted payroll metric', 'SHAPE_METRIC', 'Intentional field-policy denial.'),
  source('readiness_security_notes', 'Security explanation', 'SHAPE_TEXT', 'Safe policy guidance for operators.'),
  source('readiness_policy_matrix', 'Effective policy matrix', 'SHAPE_TABLE', 'Resolved scopes and field-level decisions.'),
  source('readiness_access_audit', 'Access audit trail', 'SHAPE_EVENTS', 'Metadata-only access events.'),
  source('readiness_resilience_probe', 'Resilience probe', 'SHAPE_METRIC', 'Scenario-controlled failure and recovery probe.'),
  source('readiness_recovery_history', 'Recovery history', 'SHAPE_TIMESERIES', 'Success rate and latency during recent exercises.'),
  source('readiness_service_health', 'Service health', 'SHAPE_EVENTS', 'Current dependency health.'),
  source('readiness_recovery_log', 'Recovery exercise log', 'SHAPE_TABLE', 'Recent fault-injection outcomes.'),
  source('readiness_runbook', 'Operator runbook', 'SHAPE_TEXT', 'Bounded recovery instructions.'),
  source('readiness_paged_assets', 'Paged asset catalog', 'SHAPE_ASSET_CATALOG', 'Opaque-cursor asset pages.'),
  source('readiness_paged_records', 'Paged work queue', 'SHAPE_RECORD_SET', 'Opaque-cursor operational records.'),
  source('readiness_paged_conversation', 'Paged incident history', 'SHAPE_CONVERSATION', 'Backward cursor-paged conversation history.'),
  source('readiness_workflow_graph', 'Change lifecycle graph', 'SHAPE_GRAPH', 'Governed change workflow.'),
  source('readiness_change_request', 'Change request object', 'SHAPE_OBJECT', 'Approval-ready change object.'),
  source('readiness_workflow_audit', 'Workflow audit trail', 'SHAPE_EVENTS', 'Approval and execution history.'),
]

function source(id: string, name: string, shape: string, description: string) {
  return { id, name, shape, description, streamable: false, tags: ['readiness'] }
}

const ASSETS = [
  asset('dataset.customer-360', 'Customer 360', 'dataset', 'healthy', 'growth-data', ['gold', 'restricted']),
  asset('object-type.customer', 'Customer ontology', 'object_type', 'published', 'ontology', ['semantic']),
  asset('pipeline.customer-health', 'Customer health pipeline', 'pipeline', 'healthy', 'data-platform', ['hourly']),
  asset('repository.analytics', 'Analytics repository', 'repository', 'active', 'engineering', ['main']),
  asset('dashboard.owner-pulse', 'Owner pulse', 'dashboard', 'published', 'operations', ['executive']),
  asset('model.churn-risk', 'Churn risk model', 'model', 'healthy', 'ml-platform', ['production']),
  asset('dataset.order-facts', 'Order facts', 'dataset', 'healthy', 'commerce-data', ['silver']),
  asset('pipeline.invoice-sync', 'Invoice synchronization', 'pipeline', 'warning', 'finance-data', ['15m']),
  asset('dataset.inventory-forecast', 'Inventory forecast', 'dataset', 'healthy', 'supply-chain', ['gold']),
  asset('object-type.fulfillment', 'Fulfillment ontology', 'object_type', 'published', 'ontology', ['semantic']),
  asset('repository.workflows', 'Workflow repository', 'repository', 'active', 'platform', ['release']),
  asset('model.delivery-eta', 'Delivery ETA model', 'model', 'healthy', 'ml-platform', ['production']),
  asset('dashboard.support-health', 'Support health', 'dashboard', 'published', 'customer-success', ['operations']),
  asset('dataset.cash-position', 'Cash position', 'dataset', 'healthy', 'finance-data', ['restricted']),
  asset('pipeline.media-index', 'Media index', 'pipeline', 'healthy', 'media-platform', ['realtime']),
  asset('dataset.calendar-events', 'Calendar events', 'dataset', 'healthy', 'workspace', ['private']),
  asset('object-type.project', 'Project ontology', 'object_type', 'published', 'ontology', ['semantic']),
  asset('repository.connectors', 'Connector repository', 'repository', 'active', 'platform', ['main']),
  asset('model.priority-score', 'Priority score', 'model', 'draft', 'operations', ['review']),
  asset('dashboard.audit-review', 'Audit review', 'dashboard', 'published', 'security', ['governance']),
]

function asset(
  id: string,
  name: string,
  kind: string,
  status: string,
  owner: string,
  tags: string[],
) {
  return {
    id,
    name,
    kind,
    status,
    owner,
    tags,
    description: `${name} is authorized for the current Jim Technologies tenant.`,
    metadata: { freshness: status === 'warning' ? '18m' : '2m', environment: 'production' },
    context: { asset_id: id, asset_kind: kind },
  }
}

const RECORD_FIELDS = [
  { key: 'name', label: 'Work item', type: 'RECORD_FIELD_TYPE_TEXT', required: true },
  {
    key: 'stage',
    label: 'Stage',
    type: 'RECORD_FIELD_TYPE_SINGLE_SELECT',
    choices: [
      { value: 'queued', label: 'Queued', color: 'info' },
      { value: 'running', label: 'Running', color: 'warn' },
      { value: 'review', label: 'Review', color: 'warn' },
      { value: 'done', label: 'Done', color: 'ok' },
    ],
  },
  {
    key: 'owner',
    label: 'Owner',
    type: 'RECORD_FIELD_TYPE_USER',
    choices: [
      { value: 'jun', label: 'Jun' },
      { value: 'maya', label: 'Maya Chen' },
      { value: 'lina', label: 'Lina Torres' },
    ],
  },
  { key: 'priority', label: 'Priority', type: 'RECORD_FIELD_TYPE_SINGLE_SELECT' },
  { key: 'due_date', label: 'Due', type: 'RECORD_FIELD_TYPE_DATE' },
  { key: 'value', label: 'Value', type: 'RECORD_FIELD_TYPE_CURRENCY', format: 'currency:USD' },
  { key: 'updated_at', label: 'Updated', type: 'RECORD_FIELD_TYPE_UPDATED_AT' },
]

const RECORDS = Array.from({ length: 24 }, (_, index) => {
  const number = index + 1
  const stages = ['queued', 'running', 'review', 'done']
  const owners = ['jun', 'maya', 'lina']
  const names = [
    'Customer renewal review',
    'Inventory replenishment',
    'Launch readiness check',
    'Invoice reconciliation',
    'Support escalation follow-up',
    'Data quality certification',
  ]
  return {
    id: `work-${String(number).padStart(4, '0')}`,
    revision: String((index % 7) + 1),
    updated_at: `2026-07-${String(22 - (index % 8)).padStart(2, '0')}T${String(9 + (index % 8)).padStart(2, '0')}:20:00Z`,
    context: { work_id: `work-${String(number).padStart(4, '0')}` },
    values: {
      name: `${names[index % names.length]} ${number}`,
      stage: stages[index % stages.length],
      owner: owners[index % owners.length],
      priority: index % 5 === 0 ? 'urgent' : index % 2 === 0 ? 'high' : 'normal',
      due_date: `2026-08-${String((index % 20) + 1).padStart(2, '0')}`,
      value: 12000 + index * 2750,
      updated_at: `2026-07-${String(22 - (index % 8)).padStart(2, '0')}T${String(9 + (index % 8)).padStart(2, '0')}:20:00Z`,
    },
  }
})

const INCIDENT_MESSAGES = Array.from({ length: 12 }, (_, index) => ({
  id: `incident-message-${index + 1}`,
  timestamp: new Date(Date.parse('2026-07-22T18:00:00Z') + index * 4 * 60_000).toISOString(),
  sender_id: index % 3 === 0 ? 'jun' : index % 3 === 1 ? 'maya' : 'lina',
  body: [
    'The recovery exercise is starting. Request IDs and audit export are enabled.',
    'Traffic shifted to the healthy pool and the error rate is falling.',
    'Customer-facing reads have recovered; background jobs are catching up.',
    'The incident checklist and rollback evidence are attached to the change record.',
  ][index % 4],
  status: index % 3 === 0 ? 'read' : undefined,
}))

export function createReadinessTerminalFetch(
  fallback: typeof fetch,
): typeof fetch {
  const actions = new Map<string, SubmittedAction>()

  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    const request = new Request(input, init)
    const url = new URL(request.url)
    if (url.origin !== new URL(READINESS_BACKEND_URL).origin) {
      return fallback(input, init)
    }

    if (request.method !== 'POST') return json({ code: 'invalid_argument', message: 'POST required' }, 405)
    if (!isAuthorized(request.headers)) {
      return json({ code: 'unauthenticated', message: 'valid tenant credential required' }, 401)
    }
    if (!url.pathname.startsWith(SERVICE_PATH)) {
      return json({ code: 'not_found', message: 'unknown endpoint' }, 404)
    }

    const method = url.pathname.slice(SERVICE_PATH.length)
    const body = await request.json().catch(() => ({})) as Record<string, unknown>
    if (method === 'ListSources') return json({ sources: SOURCES })
    if (method === 'Get') {
      try {
        return getSource(String(body.source_id ?? ''), objectValue(body.params))
      } catch (error) {
        return json({
          code: 'invalid_argument',
          message: error instanceof Error ? error.message : 'invalid request',
        }, 400)
      }
    }
    if (method === 'SubmitAction') return submitAction(body, actions)
    if (method === 'WatchAction') return watchAction(body, actions)
    return json({ code: 'not_found', message: `unknown RPC: ${method}` }, 404)
  }) as typeof fetch
}

export function installReadinessTerminalMock(): () => void {
  const original = window.fetch
  const mock = createReadinessTerminalFetch(original.bind(window))
  window.fetch = mock
  return () => {
    if (window.fetch === mock) window.fetch = original
  }
}

function isAuthorized(headers: Headers): boolean {
  return headers.get('Authorization') === READINESS_BACKEND_HEADERS.Authorization
    && headers.get('X-Tenant-ID') === READINESS_BACKEND_HEADERS['X-Tenant-ID']
}

function getSource(sourceId: string, params: Record<string, unknown>): Response {
  switch (sourceId) {
    case 'readiness_protected_object':
      return json({ object: protectedObject() })
    case 'readiness_restricted_payroll':
      return json({ code: 'permission_denied', message: 'payroll:read scope required' }, 403)
    case 'readiness_security_notes':
      return json({ text: securityNotes() })
    case 'readiness_policy_matrix':
      return json({ table: policyMatrix() })
    case 'readiness_access_audit':
      return json({ events: accessAudit() })
    case 'readiness_resilience_probe':
      return resilienceProbe(String(params.scenario ?? 'healthy'))
    case 'readiness_recovery_history':
      return json({ timeseries: recoveryHistory() })
    case 'readiness_service_health':
      return json({ events: serviceHealth() })
    case 'readiness_recovery_log':
      return json({ table: recoveryLog() })
    case 'readiness_runbook':
      return json({ text: runbook() })
    case 'readiness_paged_assets':
      return json({ assets: pagedAssets(params) })
    case 'readiness_paged_records':
      return json({ records: pagedRecords(params) })
    case 'readiness_paged_conversation':
      return json({ conversation: pagedConversation(params) })
    case 'readiness_workflow_graph':
      return json({ graph: workflowGraph() })
    case 'readiness_change_request':
      return json({ object: changeRequest() })
    case 'readiness_workflow_audit':
      return json({ events: workflowAudit() })
    default:
      return json({ code: 'not_found', message: `unknown source: ${sourceId}` }, 404)
  }
}

function protectedObject() {
  return {
    object_type: 'customer_account',
    object_id: 'customer-360',
    title: 'Northwind Foods',
    description: 'Authorized customer projection with server-side field masking.',
    status: 'healthy',
    tags: ['tenant-scoped', 'restricted'],
    properties: [
      { key: 'owner', label: 'Owner', value: 'Jun', group: 'Account' },
      { key: 'annual_value', label: 'Annual value', value: 284000, format: 'currency:USD', group: 'Account' },
      { key: 'health', label: 'Health', value: 0.92, format: 'percent', group: 'Account' },
      { key: 'email', label: 'Primary email', value: '••••••@northwind.example', group: 'Protected' },
      { key: 'tax_id', label: 'Tax identifier', value: '••-•••4821', group: 'Protected' },
      { key: 'banking', label: 'Banking details', value: 'Masked by finance policy', group: 'Protected' },
    ],
    links: [
      { relation: 'open work', target_type: 'project', target_id: 'project-launch', label: 'Platform launch' },
      { relation: 'contract', target_type: 'document', target_id: 'contract-2026', label: '2026 service agreement' },
    ],
  }
}

function securityNotes() {
  return {
    items: [
      {
        title: 'Expected denial',
        body: 'The payroll widget deliberately receives HTTP 403. The server denies the source before returning any payload fields.',
        source: 'Policy engine',
        tags: ['least privilege'],
      },
      {
        title: 'Headers stay host-owned',
        body: 'Tenant and authorization headers are supplied by the host and never serialized into templates or snapshots.',
        source: 'Frontend boundary',
        tags: ['credentials'],
      },
    ],
  }
}

function policyMatrix() {
  return {
    rows: [
      { Resource: 'Customer objects', Decision: 'Allow', Scope: 'terminal:read', Fields: '3 masked' },
      { Resource: 'Catalog metadata', Decision: 'Allow', Scope: 'terminal:read', Fields: 'Authorized only' },
      { Resource: 'Workflow actions', Decision: 'Allow', Scope: 'terminal:write', Fields: 'Policy checked' },
      { Resource: 'Media originals', Decision: 'Signed URL', Scope: 'terminal:media', Fields: '15 minute TTL' },
      { Resource: 'Payroll', Decision: 'Deny', Scope: 'payroll:read', Fields: 'No identifiers returned' },
    ],
  }
}

function accessAudit() {
  return {
    events: [
      { timestamp: '2026-07-22T17:58:00Z', label: 'Catalog read allowed · request req_81M', status: 'EVENT_STATUS_OK' },
      { timestamp: '2026-07-22T17:57:42Z', label: 'Customer fields masked · policy customer.viewer', status: 'EVENT_STATUS_INFO' },
      { timestamp: '2026-07-22T17:56:18Z', label: 'Payroll read denied · missing payroll:read', status: 'EVENT_STATUS_WARN' },
      { timestamp: '2026-07-22T17:54:03Z', label: 'Media URL issued · expires in 15 minutes', status: 'EVENT_STATUS_OK' },
      { timestamp: '2026-07-22T17:51:29Z', label: 'Static snapshot exported · 6 widgets', status: 'EVENT_STATUS_INFO' },
    ],
  }
}

function resilienceProbe(scenario: string): Response {
  if (scenario === 'rate_limited') {
    return json({ code: 'resource_exhausted', message: 'retry after 2 seconds' }, 429)
  }
  if (scenario === 'unavailable') {
    return json({ code: 'unavailable', message: 'dependency unavailable' }, 503)
  }
  if (scenario === 'empty') return json({ metric: { value: 0, unit: 'items', label: 'valid empty result' } })
  return json({ metric: { value: 99.99, unit: '%', label: 'healthy response' } })
}

function recoveryHistory() {
  const start = Date.parse('2026-07-22T17:00:00Z')
  return {
    series: [
      {
        name: 'Success %',
        data: Array.from({ length: 18 }, (_, index) => ({
          timestamp: new Date(start + index * 5 * 60_000).toISOString(),
          value: index >= 6 && index <= 8 ? 92 + index : 99.7 + (index % 3) * 0.1,
        })),
      },
      {
        name: 'SLO',
        data: Array.from({ length: 18 }, (_, index) => ({
          timestamp: new Date(start + index * 5 * 60_000).toISOString(),
          value: 99.5,
        })),
      },
    ],
    annotations: [
      { timestamp: '2026-07-22T17:30:00Z', label: 'Fault injected', color: 'warn' },
      { timestamp: '2026-07-22T17:45:00Z', label: 'Recovered', color: 'ok' },
    ],
  }
}

function serviceHealth() {
  return {
    events: [
      { timestamp: 'now', label: 'API gateway · healthy', status: 'EVENT_STATUS_OK' },
      { timestamp: 'now', label: 'Terminal service · healthy', status: 'EVENT_STATUS_OK' },
      { timestamp: 'now', label: 'Action service · healthy', status: 'EVENT_STATUS_OK' },
      { timestamp: '1m', label: 'Media workers · recovering', status: 'EVENT_STATUS_WARN' },
      { timestamp: '3m', label: 'Audit exporter · healthy', status: 'EVENT_STATUS_OK' },
    ],
  }
}

function recoveryLog() {
  return {
    rows: [
      { Exercise: 'Primary database failover', Result: 'Passed', Recovery: '42s', DataLoss: '0', Owner: 'Platform' },
      { Exercise: 'Object storage throttling', Result: 'Passed', Recovery: '18s', DataLoss: '0', Owner: 'Media' },
      { Exercise: 'Authorization timeout', Result: 'Passed', Recovery: '6s', DataLoss: 'Fail closed', Owner: 'Security' },
      { Exercise: 'Stream disconnect', Result: 'Passed', Recovery: '3s', DataLoss: 'Latest frame', Owner: 'Frontend' },
      { Exercise: 'Action worker restart', Result: 'Passed', Recovery: '31s', DataLoss: '0', Owner: 'Workflows' },
    ],
  }
}

function runbook() {
  return {
    items: [
      {
        title: '1 · Contain',
        body: 'Confirm the tenant and request ID, stop unsafe writes, and preserve idempotency records.',
        tags: ['operator'],
      },
      {
        title: '2 · Recover',
        body: 'Shift traffic, verify source freshness, and replay only actions without a terminal lifecycle state.',
        tags: ['recovery'],
      },
      {
        title: '3 · Validate',
        body: 'Run conformance, inspect audit metadata, and confirm customer-facing projections before closing.',
        tags: ['evidence'],
      },
    ],
  }
}

function pagedAssets(params: Record<string, unknown>) {
  const page = forwardPage(ASSETS, params, 'assets', 8)
  return {
    items: page.items,
    total: '12480',
    ...(page.nextPageToken ? { next_page_token: page.nextPageToken } : {}),
  }
}

function pagedRecords(params: Record<string, unknown>) {
  const page = forwardPage(RECORDS, params, 'records', 10)
  return {
    workspace_id: 'jim-technologies',
    table_id: 'production_work',
    table_name: 'Production work',
    primary_field: 'name',
    fields: RECORD_FIELDS,
    records: page.items,
    views: [{
      id: 'all_work',
      name: 'All production work',
      type: 'RECORD_VIEW_TYPE_GRID',
      visible_fields: ['name', 'stage', 'owner', 'priority', 'due_date', 'value'],
    }],
    active_view_id: 'all_work',
    total: '2400000',
    ...(page.nextPageToken ? { next_page_token: page.nextPageToken } : {}),
    capabilities: { create: false, update: false, delete: false },
  }
}

function pagedConversation(params: Record<string, unknown>) {
  const size = boundedPageSize(params.page_size, 4)
  const token = String(params.page_token ?? '')
  const end = token === '' ? INCIDENT_MESSAGES.length : cursorOffset(token, 'history')
  const start = Math.max(0, end - size)
  return {
    id: 'production-incident-room',
    title: '# production-incident',
    subtitle: 'Retained history · newest window first',
    viewer_id: 'jun',
    participants: [
      { id: 'jun', name: 'Jun', role: 'owner', status: 'online' },
      { id: 'maya', name: 'Maya Chen', role: 'operations', status: 'online' },
      { id: 'lina', name: 'Lina Torres', role: 'customer success', status: 'away' },
    ],
    messages: INCIDENT_MESSAGES.slice(start, end),
    ...(start > 0 ? { next_page_token: cursor('history', start) } : {}),
  }
}

function workflowGraph() {
  return {
    nodes: [
      { id: 'draft', label: 'Draft', kind: 'state', status: 'ok', subtitle: 'Jun · complete' },
      { id: 'policy', label: 'Policy check', kind: 'gate', status: 'ok', subtitle: 'automated' },
      { id: 'approval', label: 'Owner approval', kind: 'gate', status: 'running', subtitle: 'waiting' },
      { id: 'execute', label: 'Execute', kind: 'action', status: 'pending', subtitle: 'idempotent' },
      { id: 'verify', label: 'Verify', kind: 'gate', status: 'pending', subtitle: 'health checks' },
      { id: 'close', label: 'Close', kind: 'state', status: 'pending', subtitle: 'audit retained' },
    ],
    edges: [
      { from: 'draft', to: 'policy', label: 'submit' },
      { from: 'policy', to: 'approval', label: 'allow' },
      { from: 'approval', to: 'execute', label: 'approve' },
      { from: 'execute', to: 'verify', label: 'complete' },
      { from: 'verify', to: 'close', label: 'healthy' },
    ],
  }
}

function changeRequest() {
  return {
    object_type: 'change_request',
    object_id: 'CHG-2048',
    title: 'Upgrade customer index workers',
    description: 'Increase worker concurrency after a verified canary and preserve a one-click rollback.',
    status: 'awaiting approval',
    tags: ['production', 'medium risk', 'reversible'],
    properties: [
      { key: 'requester', label: 'Requester', value: 'Maya Chen', group: 'Ownership' },
      { key: 'approver', label: 'Approver', value: 'Jun', group: 'Ownership' },
      { key: 'window', label: 'Window', value: 'Jul 24 · 22:00–22:30 PT', group: 'Execution' },
      { key: 'blast_radius', label: 'Blast radius', value: 'Customer search only', group: 'Execution' },
      { key: 'rollback', label: 'Rollback', value: 'Restore worker pool v17', group: 'Safety' },
      { key: 'evidence', label: 'Canary evidence', value: '99.99% success · 24h', group: 'Safety' },
    ],
    actions: [
      { id: 'approve_change', label: 'Approve', style: 'primary', confirm: true },
      { id: 'reject_change', label: 'Reject', style: 'danger', confirm: true },
    ],
  }
}

function workflowAudit() {
  return {
    events: [
      { timestamp: '2026-07-22T17:52:00Z', label: 'Canary evidence attached · 24h observation', status: 'EVENT_STATUS_OK' },
      { timestamp: '2026-07-22T17:46:00Z', label: 'Policy checks passed · 8/8 controls', status: 'EVENT_STATUS_OK' },
      { timestamp: '2026-07-22T17:41:00Z', label: 'Rollback plan verified by Platform', status: 'EVENT_STATUS_OK' },
      { timestamp: '2026-07-22T17:38:00Z', label: 'Maintenance window confirmed', status: 'EVENT_STATUS_INFO' },
      { timestamp: '2026-07-22T17:30:00Z', label: 'Change submitted by Maya Chen', status: 'EVENT_STATUS_INFO' },
    ],
  }
}

function submitAction(
  body: Record<string, unknown>,
  actions: Map<string, SubmittedAction>,
): Response {
  const actionId = String(body.action_id ?? '')
  const clientRequestId = String(body.client_request_id ?? '')
  if (!actionId || !clientRequestId) {
    return json({ code: 'invalid_argument', message: 'action_id and client_request_id are required' }, 400)
  }
  const existing = actions.get(clientRequestId)
  if (existing) {
    return json({ id: existing.id, status: 'ACTION_STATUS_ACCEPTED', message: 'Decision accepted' })
  }
  const params = objectValue(body.params)
  const action: SubmittedAction = {
    id: `action-${actions.size + 1}`,
    actionId,
    clientRequestId,
    decision: String(params.decision ?? (actionId.includes('reject') ? 'reject' : 'approve')),
  }
  actions.set(clientRequestId, action)
  return json({ id: action.id, status: 'ACTION_STATUS_ACCEPTED', message: 'Decision accepted' })
}

function watchAction(
  body: Record<string, unknown>,
  actions: Map<string, SubmittedAction>,
): Response {
  const clientRequestId = String(body.client_request_id ?? '')
  const action = actions.get(clientRequestId)
  if (!action) return json({ code: 'not_found', message: 'action not found' }, 404)
  const terminalStatus = action.decision === 'reject'
    ? 'ACTION_STATUS_REJECTED'
    : 'ACTION_STATUS_OK'
  const terminalMessage = terminalStatus === 'ACTION_STATUS_OK'
    ? 'Change approved and audit evidence retained'
    : 'Change rejected by policy owner'
  const updates = [
    actionUpdate(action, 'ACTION_STATUS_ACCEPTED', 0, 'Decision accepted'),
    actionUpdate(action, 'ACTION_STATUS_PENDING', 1, 'Policy and revision checks passed'),
    actionUpdate(action, terminalStatus, 2, terminalMessage),
  ]
  return connectResponse(updates)
}

function actionUpdate(
  action: SubmittedAction,
  status: string,
  sequence: number,
  message: string,
) {
  return {
    id: action.id,
    action_id: action.actionId,
    client_request_id: action.clientRequestId,
    status,
    message,
    sequence,
    timestamp: new Date(Date.parse('2026-07-22T18:30:00Z') + sequence * 1000).toISOString(),
  }
}

function forwardPage<T>(
  items: readonly T[],
  params: Record<string, unknown>,
  scope: string,
  fallbackSize: number,
) {
  const size = boundedPageSize(params.page_size, fallbackSize)
  const token = String(params.page_token ?? '')
  const start = token === '' ? 0 : cursorOffset(token, scope)
  const end = Math.min(start + size, items.length)
  return {
    items: items.slice(start, end),
    nextPageToken: end < items.length ? cursor(scope, end) : undefined,
  }
}

function boundedPageSize(value: unknown, fallback: number): number {
  const parsed = Number.parseInt(String(value ?? fallback), 10)
  return Number.isFinite(parsed) ? Math.max(1, Math.min(100, parsed)) : fallback
}

function cursor(scope: string, offset: number): string {
  return btoa(JSON.stringify({ v: 1, scope, offset }))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function cursorOffset(value: string, scope: string): number {
  try {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
    const parsed = JSON.parse(atob(base64)) as { v?: number; scope?: string; offset?: number }
    if (parsed.v !== 1 || parsed.scope !== scope || !Number.isSafeInteger(parsed.offset) || parsed.offset! < 0) {
      throw new Error('invalid cursor')
    }
    return parsed.offset!
  } catch {
    throw new Error('invalid or cross-scope cursor')
  }
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

function connectResponse(messages: object[]): Response {
  const chunks = [...messages.map(message => connectFrame(message)), connectFrame({}, 0x02)]
  const size = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const body = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.length
  }
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'application/connect+json' },
  })
}

function connectFrame(value: object, flags = 0): Uint8Array {
  const payload = encoder.encode(JSON.stringify(value))
  const frame = new Uint8Array(5 + payload.length)
  frame[0] = flags
  new DataView(frame.buffer).setUint32(1, payload.length)
  frame.set(payload, 5)
  return frame
}

function json(value: unknown, status = 200): Response {
  return new Response(JSON.stringify(value), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
