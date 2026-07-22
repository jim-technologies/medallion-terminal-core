import type { Template } from '../../src/types/template'

export const READINESS_BACKEND_URL = 'https://terminal-readiness.example.test'

export const READINESS_BACKEND_HEADERS: Record<string, string> = {
  Authorization: 'Bearer local-storybook-readiness-token',
  'X-Tenant-ID': 'jim-technologies',
}

export const AUTHORIZED_WORKSPACE_TEMPLATE: Template = {
  title: 'Jim Technologies · authorized workspace',
  columns: 12,
  context: {
    values: {
      tenant: 'jim-technologies',
      user: 'jun@jimtech.xyz',
      asset_id: 'customer-360',
      asset_kind: 'dataset',
    },
  },
  widgets: [
    {
      id: 'access-posture',
      component: 'stat_strip',
      span: 12,
      height: 92,
      title: 'Access posture',
      source: {
        inline: {
          stats: [
            { label: 'Authenticated sessions', value: 1, unit: 'active' },
            { label: 'Granted scopes', value: 4, unit: 'scopes' },
            { label: 'Masked fields', value: 3, unit: 'fields' },
            { label: 'Denied reads · 24h', value: 2, unit: 'requests' },
            { label: 'Audit coverage', value: 100, unit: '%' },
          ],
        },
      },
    },
    {
      id: 'source-catalog',
      component: 'catalog',
      span: 4,
      height: 470,
      title: 'Authorized source catalog',
    },
    {
      id: 'protected-object',
      component: 'object_view',
      span: 5,
      height: 470,
      title: 'Protected customer object',
      source: { source_id: 'readiness_protected_object' },
    },
    {
      id: 'restricted-payroll',
      component: 'metric',
      span: 3,
      height: 210,
      title: 'Payroll · intentionally denied',
      source: { source_id: 'readiness_restricted_payroll' },
    },
    {
      id: 'security-notes',
      component: 'text',
      span: 3,
      height: 244,
      title: 'Policy explanation',
      source: { source_id: 'readiness_security_notes' },
    },
    {
      id: 'policy-matrix',
      component: 'table',
      span: 5,
      height: 300,
      title: 'Effective policy',
      source: { source_id: 'readiness_policy_matrix' },
    },
    {
      id: 'access-audit',
      component: 'events',
      span: 7,
      height: 300,
      title: 'Metadata-only audit trail',
      source: { source_id: 'readiness_access_audit' },
    },
  ],
}

export const RESILIENCE_LAB_TEMPLATE: Template = {
  title: 'Production resilience · ${ctx.scenario}',
  columns: 12,
  context: { values: { scenario: 'healthy' } },
  widgets: [
    {
      id: 'scenario',
      component: 'select',
      span: 3,
      height: 118,
      title: 'Failure injection',
      options: {
        key: 'scenario',
        label: 'Backend response',
        choices: [
          { value: 'healthy', label: 'Healthy' },
          { value: 'empty', label: 'Empty payload' },
          { value: 'rate_limited', label: 'Rate limited' },
          { value: 'unavailable', label: 'Service unavailable' },
        ],
      },
    },
    {
      id: 'probe',
      component: 'metric',
      span: 3,
      height: 118,
      title: 'Selected probe',
      source: {
        source_id: 'readiness_resilience_probe',
        params: { scenario: '${ctx.scenario}' },
      },
    },
    {
      id: 'availability',
      component: 'metric',
      span: 3,
      height: 118,
      title: '30-day availability',
      source: { inline: { value: 99.982, unit: '%', label: 'within 99.95% SLO' } },
    },
    {
      id: 'error-budget',
      component: 'gauge',
      span: 3,
      height: 118,
      title: 'Error budget remaining',
      source: {
        inline: {
          value: 71,
          min: 0,
          max: 100,
          bands: [
            { from: 0, to: 25, color: 'danger' },
            { from: 25, to: 50, color: 'warn' },
            { from: 50, to: 100, color: 'ok' },
          ],
        },
      },
    },
    {
      id: 'recovery-history',
      component: 'area_chart',
      span: 8,
      height: 330,
      title: 'Request success and recovery',
      source: { source_id: 'readiness_recovery_history' },
    },
    {
      id: 'service-health',
      component: 'events',
      span: 4,
      height: 330,
      title: 'Current service health',
      source: { source_id: 'readiness_service_health' },
    },
    {
      id: 'recovery-log',
      component: 'table',
      span: 7,
      height: 300,
      title: 'Recent recovery exercises',
      source: { source_id: 'readiness_recovery_log' },
    },
    {
      id: 'runbook',
      component: 'text',
      span: 5,
      height: 300,
      title: 'Operator runbook',
      source: { source_id: 'readiness_runbook' },
    },
  ],
}

export const LARGE_COLLECTIONS_TEMPLATE: Template = {
  title: 'Large collections · bounded pages',
  columns: 12,
  context: {
    values: {
      asset_id: 'dataset.customer-360',
      asset_kind: 'dataset',
      scale_assets_page_token: '',
      scale_records_page_token: '',
      scale_history_page_token: '',
    },
  },
  widgets: [
    {
      id: 'scale-summary',
      component: 'stat_strip',
      span: 12,
      height: 92,
      title: 'Bounded working set',
      source: {
        inline: {
          stats: [
            { label: 'Catalog assets', value: 12480 },
            { label: 'Operational records', value: 2400000 },
            { label: 'Messages retained', value: 18600000 },
            { label: 'Largest response', value: 84, unit: 'KB' },
            { label: 'Maximum page', value: 100, unit: 'items' },
          ],
        },
      },
    },
    {
      id: 'scale-assets',
      component: 'asset_catalog',
      span: 4,
      height: 550,
      title: 'Catalog · 12,480 assets',
      options: { page_token_key: 'scale_assets_page_token' },
      source: {
        source_id: 'readiness_paged_assets',
        params: {
          page_token: '${ctx.scale_assets_page_token}',
          page_size: '8',
        },
      },
    },
    {
      id: 'scale-records',
      component: 'record_grid',
      span: 8,
      height: 550,
      title: 'Work queue · 2.4M records',
      options: {
        page_token_key: 'scale_records_page_token',
        page_size: 10,
        inline_edit: false,
      },
      source: {
        source_id: 'readiness_paged_records',
        params: {
          page_token: '${ctx.scale_records_page_token}',
          page_size: '10',
        },
      },
    },
    {
      id: 'scale-history',
      component: 'conversation',
      span: 12,
      height: 360,
      title: 'Incident history · cursor-paged backward',
      options: {
        mode: 'channel',
        search: true,
        page_token_key: 'scale_history_page_token',
      },
      source: {
        source_id: 'readiness_paged_conversation',
        params: {
          page_token: '${ctx.scale_history_page_token}',
          page_size: '4',
        },
      },
    },
  ],
}

export const GOVERNED_WORKFLOW_TEMPLATE: Template = {
  title: 'Governed workflow · ${ctx.change_id}',
  columns: 12,
  context: {
    values: {
      change_id: 'CHG-2048',
      workflow_step: 'approval',
    },
  },
  widgets: [
    {
      id: 'workflow-graph',
      component: 'dag',
      span: 7,
      height: 430,
      title: 'Change lifecycle',
      options: { node_context: { key: 'workflow_step' } },
      source: { source_id: 'readiness_workflow_graph' },
    },
    {
      id: 'change-request',
      component: 'object_view',
      span: 5,
      height: 430,
      title: 'Change request',
      options: { enable_actions: true },
      source: { source_id: 'readiness_change_request' },
    },
    {
      id: 'approval-form',
      component: 'action_form',
      span: 5,
      height: 380,
      title: 'Policy-gated decision',
      options: {
        action_id: 'approve_change',
        submit_label: 'Review decision',
        success_message: 'Change approved',
        description: 'Every write carries an idempotency key and completes through WatchAction.',
        confirm: true,
        reset_on_success: false,
        fields: [
          {
            key: 'change_id',
            label: 'Change',
            context_key: 'change_id',
            required: true,
            read_only: true,
          },
          {
            key: 'decision',
            type: 'select',
            required: true,
            default_value: 'approve',
            choices: [
              { value: 'approve', label: 'Approve' },
              { value: 'request_changes', label: 'Request changes' },
              { value: 'reject', label: 'Reject' },
            ],
          },
          {
            key: 'maintenance_window',
            label: 'Maintenance window',
            type: 'datetime',
            required: true,
            default_value: '2026-07-24T22:00',
          },
          {
            key: 'note',
            type: 'long_text',
            required: true,
            default_value: 'Rollback and customer communication plans verified.',
          },
        ],
      },
    },
    {
      id: 'workflow-audit',
      component: 'events',
      span: 7,
      height: 380,
      title: 'Approval and execution history',
      source: { source_id: 'readiness_workflow_audit' },
    },
    {
      id: 'action-lifecycle',
      component: 'action_log',
      span: 12,
      height: 220,
      title: 'Live action lifecycle',
      options: { limit: 20 },
      refresh_policy: 'manual',
    },
  ],
}

export const READINESS_TABS = [
  { label: 'Access & policy', template: AUTHORIZED_WORKSPACE_TEMPLATE },
  { label: 'Reliability', template: RESILIENCE_LAB_TEMPLATE },
  { label: 'Scale', template: LARGE_COLLECTIONS_TEMPLATE },
  { label: 'Workflow', template: GOVERNED_WORKFLOW_TEMPLATE },
]
