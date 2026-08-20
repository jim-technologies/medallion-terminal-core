import { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import {
  Badge,
  Breadcrumbs,
  Button,
  Callout,
  Checkbox,
  Icon,
  IconButton,
  Input,
  Popover,
  Tag,
  Tabs,
  TextArea,
  type TabItem,
} from '../components'
import {
  AppSurface,
  EmptyState,
  Inspector,
  PropertyList,
  Sidebar,
  SplitPane,
  Toolbar,
  Tree,
  type TreeItem,
} from '.'

const meta = {
  title: 'Toolkit/Compositions/Workbenches',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj

export const ObjectWorkbenchComposition: Story = {
  name: 'Object workbench',
  render: () => <ObjectWorkbench />,
}

export const ModelWorkbenchComposition: Story = {
  name: 'Model workbench',
  render: () => <ModelWorkbench />,
}

export const DatabaseLikeDataWorkbench: Story = {
  name: 'Database explorer',
  render: () => <DatabaseWorkbench />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const dataTab = canvas.getByRole('tab', { name: 'Data' })

    dataTab.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('heading', { name: 'Column definitions' })).toBeVisible()

    await userEvent.click(canvas.getByRole('tab', { name: 'Query' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Run preview' }))
    await expect(canvas.getByRole('status')).toHaveTextContent('Sample result ready')

    await userEvent.click(dataTab)
    const filter = canvas.getByRole('searchbox', { name: 'Filter table rows' })
    await userEvent.type(filter, 'atlas')
    await userEvent.click(canvas.getByRole('button', { name: 'Inspect row Atlas Works' }))
    await expect(canvas.getByRole('heading', { name: 'Atlas Works' })).toBeVisible()

    await userEvent.clear(filter)
    await userEvent.click(canvas.getByRole('button', { name: 'Inspect row Northwind Health' }))
  },
}

export const DatabaseTableViewer: Story = {
  name: 'View table',
  render: () => <DatabaseTableViewerExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const columns = canvas.getByRole('button', { name: 'Choose visible columns' })

    await userEvent.click(columns)
    const city = canvas.getByRole('checkbox', { name: /city/i })
    await userEvent.click(city)
    await expect(canvas.queryByRole('columnheader', { name: 'city' })).not.toBeInTheDocument()
    await userEvent.click(city)
    await expect(canvas.getByRole('columnheader', { name: 'city' })).toBeVisible()
    await userEvent.keyboard('{Escape}')

    const filter = canvas.getByRole('searchbox', { name: 'Filter table rows' })
    await userEvent.type(filter, 'atlas')
    await userEvent.click(canvas.getByRole('button', { name: 'Inspect row Atlas Works' }))
    await expect(canvas.getByRole('heading', { name: 'Atlas Works' })).toBeVisible()
    await userEvent.clear(filter)
    await userEvent.click(canvas.getByRole('button', { name: 'Inspect row Northwind Health' }))
  },
}

const objectTree: TreeItem[] = [
  {
    id: 'workspace',
    label: 'Workspace',
    icon: <Icon name="folder" />,
    children: [
      {
        id: 'operations',
        label: 'Operations',
        icon: <Icon name="folder" />,
        children: [
          { id: 'orders', label: 'Orders', icon: <Icon name="file" /> },
          { id: 'suppliers', label: 'Suppliers', icon: <Icon name="file" /> },
        ],
      },
      { id: 'finance', label: 'Finance', icon: <Icon name="folder" /> },
    ],
  },
  { id: 'shared', label: 'Shared with me', icon: <Icon name="folder" /> },
]

function ObjectWorkbench() {
  const [selected, setSelected] = useState('orders')
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(
    new Set(['workspace', 'operations']),
  )
  return (
    <AppSurface fullHeight={false} className="h-screen min-h-[42rem]">
      <Toolbar
        label="Object workbench toolbar"
        start={<strong className="text-sm">Object workbench</strong>}
        end={(
          <>
            <Badge dot intent="success">Current</Badge>
            <IconButton icon={<Icon name="settings" />} aria-label="Workbench settings" />
          </>
        )}
      >
        <Input aria-label="Search objects" placeholder="Search objects" className="w-64" />
        <Button size="small">Filter</Button>
        <Button size="small" intent="primary" variant="solid" startIcon={<Icon name="add" />}>New</Button>
      </Toolbar>
      <SplitPane
        size={22}
        minSize={16}
        maxSize={34}
        separatorLabel="Resize explorer"
        primary={(
          <Sidebar label="Object explorer" width="100%" className="h-full" header={<span className="text-xs font-semibold">Explorer</span>}>
            <Tree
              label="Object hierarchy"
              items={objectTree}
              selectedId={selected}
              onSelectionChange={setSelected}
              expandedIds={expanded}
              onExpandedChange={setExpanded}
              density="compact"
            />
          </Sidebar>
        )}
        secondary={(
          <SplitPane
            className="h-full"
            primaryPane="end"
            size={28}
            minSize={22}
            maxSize={42}
            separatorLabel="Resize inspector"
            primary={(
              <Inspector
                label="Object inspector"
                width="100%"
                className="h-full"
                title="Order 1048"
                subtitle="Updated 4 minutes ago"
                actions={<IconButton icon={<Icon name="more" />} aria-label="Object actions" size="small" />}
              >
                <PropertyList
                  items={[
                    { label: 'Status', value: <Tag intent="warning">In review</Tag> },
                    { label: 'Owner', value: 'Jun' },
                    { label: 'Total', value: '$18,240.00' },
                    { label: 'Delivery', value: 'Jul 28, 2026' },
                    { label: 'Source', value: 'Operations system' },
                  ]}
                />
              </Inspector>
            )}
            secondary={<ObjectContent />}
          />
        )}
      />
    </AppSurface>
  )
}

function ObjectContent() {
  const rows = [
    ['1048', 'Northwind Studio', 'In review', '$18,240'],
    ['1047', 'Lakefront Supply', 'Approved', '$9,815'],
    ['1046', 'Cedar Works', 'Processing', '$12,460'],
    ['1045', 'Bright Path', 'Delivered', '$7,290'],
    ['1044', 'Harbor Labs', 'Exception', '$22,105'],
  ]
  return (
    <main className="h-full min-w-0 overflow-auto bg-[var(--mtc-bg)]">
      <div className="border-b border-[var(--mtc-border)] px-5 py-3">
        <Breadcrumbs items={[{ label: 'Workspace' }, { label: 'Operations' }, { label: 'Orders' }]} />
      </div>
      <div className="p-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">Orders</h1>
            <p className="text-xs text-[var(--mtc-muted)]">5 objects · sorted by last updated</p>
          </div>
          <Button size="small">Columns</Button>
        </div>
        <div className="overflow-hidden rounded border border-[var(--mtc-border)] bg-[var(--mtc-surface)]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--mtc-border)] text-[var(--mtc-muted)]">
              <tr>{['Order', 'Account', 'Status', 'Total'].map(label => <th key={label} className="px-3 py-2 font-medium">{label}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row[0]} className={`border-b border-[var(--mtc-border)] last:border-0 ${index === 0 ? 'bg-[var(--mtc-panel)]' : ''}`}>
                  {row.map((cell, cellIndex) => <td key={cell} className={`px-3 py-2 ${cellIndex === 0 ? 'font-mono text-[var(--mtc-accent-soft)]' : ''}`}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

const modelTree: TreeItem[] = [
  {
    id: 'concepts',
    label: 'Concepts',
    icon: <Icon name="folder" />,
    children: [
      { id: 'account', label: 'Account', description: '14 properties' },
      { id: 'order', label: 'Order', description: '9 properties' },
      { id: 'shipment', label: 'Shipment', description: '11 properties' },
    ],
  },
  {
    id: 'relationships',
    label: 'Relationships',
    icon: <Icon name="folder" />,
    children: [
      { id: 'places', label: 'places order' },
      { id: 'fulfills', label: 'fulfills shipment' },
    ],
  },
]

function ModelWorkbench() {
  const [selected, setSelected] = useState('order')
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set(['concepts']))
  return (
    <AppSurface fullHeight={false} className="h-screen min-h-[42rem]">
      <Toolbar
        label="Model workbench toolbar"
        start={<strong className="text-sm">Model workbench</strong>}
        end={<Badge>Draft v18</Badge>}
      >
        <Button size="small">Validate</Button>
        <Button size="small" intent="primary" variant="solid">Publish</Button>
      </Toolbar>
      <SplitPane
        size={21}
        separatorLabel="Resize model explorer"
        primary={(
          <Sidebar label="Model explorer" width="100%" className="h-full" header={<Input aria-label="Filter model" placeholder="Filter model" />}>
            <Tree
              label="Model hierarchy"
              items={modelTree}
              selectedId={selected}
              onSelectionChange={setSelected}
              expandedIds={expanded}
              onExpandedChange={setExpanded}
              density="compact"
            />
          </Sidebar>
        )}
        secondary={(
          <SplitPane
            className="h-full"
            primaryPane="end"
            size={29}
            separatorLabel="Resize concept inspector"
            primary={(
              <Inspector label="Concept inspector" width="100%" className="h-full" title="Order" subtitle="Concept">
                <PropertyList
                  items={[
                    { label: 'Identifier', value: 'order' },
                    { label: 'Display property', value: 'order_number' },
                    { label: 'Primary key', value: 'order_id' },
                    { label: 'Properties', value: 9 },
                    { label: 'Relationships', value: 3 },
                  ]}
                />
              </Inspector>
            )}
            secondary={<GraphPlaceholder />}
          />
        )}
      />
    </AppSurface>
  )
}

function GraphPlaceholder() {
  return (
    <main className="relative h-full min-h-[30rem] overflow-hidden bg-[var(--mtc-bg)]" aria-label="Model canvas placeholder">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'linear-gradient(var(--mtc-grid) 1px, transparent 1px), linear-gradient(90deg, var(--mtc-grid) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 480" aria-hidden="true">
        <path d="M205 240 C310 240 315 145 410 145" stroke="var(--mtc-border-strong)" fill="none" />
        <path d="M205 240 C310 240 315 335 410 335" stroke="var(--mtc-border-strong)" fill="none" />
        <path d="M535 145 C625 145 620 240 690 240" stroke="var(--mtc-border-strong)" fill="none" />
      </svg>
      <GraphNode left="9%" top="42%" title="Account" detail="Concept" />
      <GraphNode left="46%" top="22%" title="Order" detail="Selected concept" selected />
      <GraphNode left="46%" top="62%" title="Shipment" detail="Concept" />
      <GraphNode left="80%" top="42%" title="Location" detail="Concept" />
      <div className="absolute bottom-4 left-4 flex gap-2">
        <Button size="small" startIcon={<Icon name="add" />}>Add concept</Button>
        <Button size="small">Fit canvas</Button>
      </div>
    </main>
  )
}

function GraphNode({
  left,
  top,
  title,
  detail,
  selected,
}: {
  left: string
  top: string
  title: string
  detail: string
  selected?: boolean
}) {
  return (
    <div
      className={`absolute w-36 rounded border bg-[var(--mtc-surface)] px-3 py-2 shadow-[var(--mtc-elevation-1)] ${selected ? 'border-[var(--mtc-accent)] ring-2 ring-[var(--mtc-focus)]' : 'border-[var(--mtc-border-strong)]'}`}
      style={{ left, top }}
    >
      <div className="text-xs font-semibold">{title}</div>
      <div className="mt-1 text-[10px] text-[var(--mtc-muted)]">{detail}</div>
    </div>
  )
}

type DatabaseTab = 'data' | 'structure' | 'indexes' | 'query'
type SortDirection = 'ascending' | 'descending'
type CellValue = string | number | boolean | null
type DatabaseRow = Record<string, CellValue>

interface DatabaseColumn {
  key: string
  label: string
  dataType: string
  nullable: boolean
  defaultValue?: string
  role?: 'primary' | 'foreign'
}

interface DatabaseIndex {
  name: string
  method: string
  columns: readonly string[]
  unique: boolean
  size: string
}

interface DatabaseTableDefinition {
  id: string
  name: string
  qualifiedName: string
  description: string
  owner: string
  estimatedRows: number
  storageSize: string
  updated: string
  primaryKey: string
  displayColumn: string
  columns: readonly DatabaseColumn[]
  rows: readonly DatabaseRow[]
  indexes: readonly DatabaseIndex[]
}

const databaseTree: TreeItem[] = [
  {
    id: 'connection:primary',
    label: 'primary-cluster',
    description: 'SQL connection · read only',
    icon: <Icon name="database" />,
    children: [
      {
        id: 'database:analytics',
        label: 'analytics',
        description: 'Database',
        icon: <Icon name="folder" />,
        children: [
          {
            id: 'schema:public',
            label: 'public',
            description: 'Schema · 3 tables',
            icon: <Icon name="folder" />,
            children: [
              {
                id: 'table:customers',
                label: 'customers',
                description: 'Table · 6 columns',
                icon: <Icon name="file" />,
              },
              {
                id: 'table:orders',
                label: 'orders',
                description: 'Table · 5 columns',
                icon: <Icon name="file" />,
              },
              {
                id: 'table:audit_events',
                label: 'audit_events',
                description: 'Table · 5 columns',
                icon: <Icon name="file" />,
              },
            ],
          },
          {
            id: 'schema:reporting',
            label: 'reporting',
            description: 'Schema · 2 views',
            icon: <Icon name="folder" />,
            children: [
              {
                id: 'view:monthly_revenue',
                label: 'monthly_revenue',
                description: 'View',
                icon: <Icon name="file" />,
                disabled: true,
              },
              {
                id: 'view:customer_health',
                label: 'customer_health',
                description: 'View',
                icon: <Icon name="file" />,
                disabled: true,
              },
            ],
          },
        ],
      },
    ],
  },
]

const databaseTables: Readonly<Record<string, DatabaseTableDefinition>> = {
  'table:customers': {
    id: 'table:customers',
    name: 'customers',
    qualifiedName: 'analytics.public.customers',
    description: 'Canonical customer accounts used by governed business workflows.',
    owner: 'data-platform',
    estimatedRows: 12_480,
    storageSize: '18.6 MB',
    updated: '2 minutes ago',
    primaryKey: 'customer_id',
    displayColumn: 'legal_name',
    columns: [
      { key: 'customer_id', label: 'customer_id', dataType: 'text', nullable: false, role: 'primary' },
      { key: 'legal_name', label: 'legal_name', dataType: 'text', nullable: false },
      { key: 'segment', label: 'segment', dataType: 'text', nullable: false },
      { key: 'city', label: 'city', dataType: 'text', nullable: true },
      { key: 'status', label: 'status', dataType: 'text', nullable: false, defaultValue: "'active'" },
      { key: 'updated_at', label: 'updated_at', dataType: 'timestamptz', nullable: false, defaultValue: 'now()' },
    ],
    rows: [
      { customer_id: 'cus_1048', legal_name: 'Northwind Health', segment: 'Enterprise', city: 'Seattle', status: 'active', updated_at: '2026-07-25 18:42' },
      { customer_id: 'cus_1047', legal_name: 'Atlas Works', segment: 'Growth', city: 'Austin', status: 'active', updated_at: '2026-07-25 17:18' },
      { customer_id: 'cus_1046', legal_name: 'Cobalt Logistics', segment: 'Enterprise', city: 'Chicago', status: 'review', updated_at: '2026-07-25 16:04' },
      { customer_id: 'cus_1045', legal_name: 'Brightpath Energy', segment: 'Growth', city: 'Denver', status: 'active', updated_at: '2026-07-25 14:51' },
      { customer_id: 'cus_1044', legal_name: 'Harbor Labs', segment: 'Startup', city: 'Boston', status: 'paused', updated_at: '2026-07-25 13:36' },
      { customer_id: 'cus_1043', legal_name: 'Juniper Foods', segment: 'Growth', city: 'Portland', status: 'active', updated_at: '2026-07-25 12:09' },
      { customer_id: 'cus_1042', legal_name: 'Summit Retail', segment: 'Enterprise', city: 'Phoenix', status: 'review', updated_at: '2026-07-25 11:22' },
      { customer_id: 'cus_1041', legal_name: 'Mosaic Learning', segment: 'Startup', city: null, status: 'active', updated_at: '2026-07-25 09:48' },
    ],
    indexes: [
      { name: 'customers_pkey', method: 'btree', columns: ['customer_id'], unique: true, size: '624 kB' },
      { name: 'customers_legal_name_idx', method: 'btree', columns: ['legal_name'], unique: false, size: '1.4 MB' },
      { name: 'customers_status_updated_idx', method: 'btree', columns: ['status', 'updated_at'], unique: false, size: '2.1 MB' },
    ],
  },
  'table:orders': {
    id: 'table:orders',
    name: 'orders',
    qualifiedName: 'analytics.public.orders',
    description: 'Customer orders with normalized lifecycle and financial totals.',
    owner: 'operations-data',
    estimatedRows: 84_219,
    storageSize: '126 MB',
    updated: '38 seconds ago',
    primaryKey: 'order_id',
    displayColumn: 'order_id',
    columns: [
      { key: 'order_id', label: 'order_id', dataType: 'bigint', nullable: false, role: 'primary' },
      { key: 'customer_id', label: 'customer_id', dataType: 'text', nullable: false, role: 'foreign' },
      { key: 'state', label: 'state', dataType: 'text', nullable: false, defaultValue: "'pending'" },
      { key: 'total_usd', label: 'total_usd', dataType: 'numeric(12,2)', nullable: false },
      { key: 'placed_at', label: 'placed_at', dataType: 'timestamptz', nullable: false, defaultValue: 'now()' },
    ],
    rows: [
      { order_id: 90418, customer_id: 'cus_1048', state: 'review', total_usd: 18_240, placed_at: '2026-07-25 18:31' },
      { order_id: 90417, customer_id: 'cus_1047', state: 'approved', total_usd: 9_815, placed_at: '2026-07-25 17:02' },
      { order_id: 90416, customer_id: 'cus_1046', state: 'processing', total_usd: 12_460, placed_at: '2026-07-25 15:47' },
      { order_id: 90415, customer_id: 'cus_1045', state: 'delivered', total_usd: 7_290, placed_at: '2026-07-25 14:26' },
      { order_id: 90414, customer_id: 'cus_1044', state: 'exception', total_usd: 22_105, placed_at: '2026-07-25 12:58' },
      { order_id: 90413, customer_id: 'cus_1043', state: 'approved', total_usd: 6_840, placed_at: '2026-07-25 11:43' },
    ],
    indexes: [
      { name: 'orders_pkey', method: 'btree', columns: ['order_id'], unique: true, size: '3.8 MB' },
      { name: 'orders_customer_idx', method: 'btree', columns: ['customer_id', 'placed_at'], unique: false, size: '8.2 MB' },
    ],
  },
  'table:audit_events': {
    id: 'table:audit_events',
    name: 'audit_events',
    qualifiedName: 'analytics.public.audit_events',
    description: 'Append-only operational evidence retained by the host.',
    owner: 'security-platform',
    estimatedRows: 1_842_006,
    storageSize: '3.7 GB',
    updated: 'Live',
    primaryKey: 'event_id',
    displayColumn: 'event_id',
    columns: [
      { key: 'event_id', label: 'event_id', dataType: 'uuid', nullable: false, role: 'primary' },
      { key: 'source', label: 'source', dataType: 'text', nullable: false },
      { key: 'severity', label: 'severity', dataType: 'text', nullable: false, defaultValue: "'info'" },
      { key: 'occurred_at', label: 'occurred_at', dataType: 'timestamptz', nullable: false },
      { key: 'payload', label: 'payload', dataType: 'jsonb', nullable: false },
    ],
    rows: [
      { event_id: 'evt_f41a', source: 'gateway', severity: 'info', occurred_at: '2026-07-25 18:44', payload: '{"request":"req_9018"}' },
      { event_id: 'evt_f419', source: 'policy', severity: 'warning', occurred_at: '2026-07-25 18:42', payload: '{"decision":"review"}' },
      { event_id: 'evt_f418', source: 'catalog', severity: 'info', occurred_at: '2026-07-25 18:39', payload: '{"asset":"customers"}' },
      { event_id: 'evt_f417', source: 'workflow', severity: 'success', occurred_at: '2026-07-25 18:36', payload: '{"action":"approved"}' },
      { event_id: 'evt_f416', source: 'gateway', severity: 'error', occurred_at: '2026-07-25 18:31', payload: '{"status":503}' },
    ],
    indexes: [
      { name: 'audit_events_pkey', method: 'btree', columns: ['event_id'], unique: true, size: '92 MB' },
      { name: 'audit_events_time_idx', method: 'brin', columns: ['occurred_at'], unique: false, size: '4.3 MB' },
      { name: 'audit_events_payload_idx', method: 'gin', columns: ['payload'], unique: false, size: '612 MB' },
    ],
  },
}

function DatabaseWorkbench() {
  const initialTable = databaseTables['table:customers']
  const [selectedTableId, setSelectedTableId] = useState(initialTable.id)
  const [selectedRowId, setSelectedRowId] = useState(
    String(initialTable.rows[0]?.[initialTable.primaryKey] ?? ''),
  )
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(
    new Set(['connection:primary', 'database:analytics', 'schema:public']),
  )
  const [objectQuery, setObjectQuery] = useState('')
  const [rowQuery, setRowQuery] = useState('')
  const [activeTab, setActiveTab] = useState<DatabaseTab>('data')
  const [sort, setSort] = useState<{ key: string; direction: SortDirection }>({
    key: initialTable.primaryKey,
    direction: 'descending',
  })
  const [page, setPage] = useState(0)
  const [sql, setSql] = useState(() => databaseQuery(initialTable))
  const [queryStatus, setQueryStatus] = useState(
    'Preview only · query execution is host-owned',
  )
  const table = databaseTables[selectedTableId] ?? initialTable
  const selectedRow = table.rows.find(
    row => String(row[table.primaryKey]) === selectedRowId,
  )
  const filteredTree = useMemo(
    () => filterDatabaseTree(databaseTree, objectQuery),
    [objectQuery],
  )
  const visibleExpanded = objectQuery.trim()
    ? allBranchIds(filteredTree)
    : expanded

  const selectTable = (id: string) => {
    const next = databaseTables[id]
    if (!next) return
    setSelectedTableId(id)
    setSelectedRowId(String(next.rows[0]?.[next.primaryKey] ?? ''))
    setRowQuery('')
    setSort({ key: next.primaryKey, direction: 'descending' })
    setPage(0)
    setSql(databaseQuery(next))
    setQueryStatus('Preview only · query execution is host-owned')
  }

  return (
    <AppSurface fullHeight={false} className="h-screen min-h-[44rem]" density="compact">
      <Toolbar
        label="Database explorer toolbar"
        start={(
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-[var(--mtc-panel)] text-[var(--mtc-accent-soft)]">
              <Icon name="database" />
            </span>
            <div className="grid leading-tight">
              <strong className="text-sm">Database explorer</strong>
              <span className="text-[10px] text-[var(--mtc-muted)]">Generic SQL presentation</span>
            </div>
          </div>
        )}
        end={<Badge dot intent="success">Read-only connection</Badge>}
      >
        <div className="w-72">
          <Input
            type="search"
            aria-label="Find database objects"
            placeholder="Find databases, schemas, or tables"
            value={objectQuery}
            onChange={event => setObjectQuery(event.currentTarget.value)}
            className="w-full"
          />
        </div>
        <Button
          size="small"
          intent="primary"
          variant="solid"
          startIcon={<Icon name="add" />}
          onClick={() => setActiveTab('query')}
        >
          New query
        </Button>
      </Toolbar>
      <SplitPane
        size={23}
        minSize={17}
        maxSize={36}
        separatorLabel="Resize database explorer"
        primary={(
          <Sidebar
            label="Database objects"
            width="100%"
            className="h-full"
            header={(
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold">Connections</span>
                <Badge>1</Badge>
              </div>
            )}
            footer={(
              <div className="text-[10px] leading-relaxed text-[var(--mtc-muted)]">
                Metadata synchronized 2 minutes ago
              </div>
            )}
          >
            {filteredTree.length > 0 ? (
              <Tree
                label="Database hierarchy"
                items={filteredTree}
                selectedId={selectedTableId}
                onSelectionChange={selectTable}
                expandedIds={visibleExpanded}
                onExpandedChange={setExpanded}
                density="compact"
              />
            ) : (
              <EmptyState
                compact
                title="No database objects"
                description="Try a different object name."
                icon={<Icon name="search" />}
              />
            )}
          </Sidebar>
        )}
        secondary={(
          <SplitPane
            className="h-full"
            primaryPane="end"
            size={28}
            minSize={22}
            maxSize={42}
            separatorLabel="Resize database inspector"
            primary={(
              <DatabaseInspector
                table={table}
                selectedRow={selectedRow}
              />
            )}
            secondary={(
              <DatabaseContent
                table={table}
                activeTab={activeTab}
                onActiveTabChange={setActiveTab}
                selectedRowId={selectedRowId}
                onSelectedRowIdChange={setSelectedRowId}
                rowQuery={rowQuery}
                onRowQueryChange={(value) => {
                  setRowQuery(value)
                  setPage(0)
                }}
                sort={sort}
                onSortChange={(value) => {
                  setSort(value)
                  setPage(0)
                }}
                page={page}
                onPageChange={setPage}
                sql={sql}
                onSqlChange={setSql}
                queryStatus={queryStatus}
                onRunPreview={() => {
                  setQueryStatus(`Sample result ready · ${table.rows.length} loaded rows · execution remains host-owned`)
                }}
              />
            )}
          />
        )}
      />
    </AppSurface>
  )
}

function DatabaseTableViewerExample() {
  const table = databaseTables['table:customers']
  const [selectedRowId, setSelectedRowId] = useState(
    String(table.rows[0]?.[table.primaryKey] ?? ''),
  )
  const [rowQuery, setRowQuery] = useState('')
  const [sort, setSort] = useState<{ key: string; direction: SortDirection }>({
    key: table.primaryKey,
    direction: 'descending',
  })
  const [page, setPage] = useState(0)
  const [visibleColumnKeys, setVisibleColumnKeys] = useState<ReadonlySet<string>>(
    new Set(table.columns.map(column => column.key)),
  )
  const [refreshStatus, setRefreshStatus] = useState(`${table.rows.length} loaded rows`)
  const visibleColumns = table.columns.filter(column => visibleColumnKeys.has(column.key))
  const selectedRow = table.rows.find(
    row => String(row[table.primaryKey]) === selectedRowId,
  )

  const setColumnVisible = (key: string, visible: boolean) => {
    setVisibleColumnKeys(current => {
      const next = new Set(current)
      if (visible) next.add(key)
      else if (next.size > 1) next.delete(key)
      return next
    })
  }

  return (
    <AppSurface fullHeight={false} className="h-screen min-h-[42rem]" density="compact">
      <Toolbar
        label="Table viewer toolbar"
        start={(
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded bg-[var(--mtc-panel)] text-[var(--mtc-accent-soft)]">
              <Icon name="database" />
            </span>
            <div className="grid leading-tight">
              <strong className="text-sm">View table</strong>
              <span className="font-mono text-[10px] text-[var(--mtc-muted)]">
                {table.qualifiedName}
              </span>
            </div>
          </div>
        )}
        end={(
          <>
            <output className="text-[10px] text-[var(--mtc-muted)]">{refreshStatus}</output>
            <Badge dot intent="success">Read only</Badge>
          </>
        )}
      >
        <Popover
          trigger={(
            <span
              className="mtc-button"
              data-intent="neutral"
              data-size="small"
              data-variant="outline"
            >
              Columns
              <Badge>{visibleColumns.length}/{table.columns.length}</Badge>
            </span>
          )}
          triggerAriaLabel="Choose visible columns"
          title="Visible columns"
          placement="bottom-start"
        >
          <div className="grid gap-2" style={{ minWidth: '16rem' }}>
            {table.columns.map(column => {
              const checked = visibleColumnKeys.has(column.key)
              return (
                <Checkbox
                  key={column.key}
                  label={<code>{column.label}</code>}
                  description={column.dataType}
                  checked={checked}
                  disabled={checked && visibleColumnKeys.size === 1}
                  onChange={event => setColumnVisible(column.key, event.currentTarget.checked)}
                  density="compact"
                />
              )
            })}
            <Button
              size="small"
              disabled={visibleColumnKeys.size === table.columns.length}
              onClick={() => setVisibleColumnKeys(new Set(table.columns.map(column => column.key)))}
            >
              Show all columns
            </Button>
          </div>
        </Popover>
        <Button
          size="small"
          onClick={() => setRefreshStatus('Preview refreshed just now')}
        >
          Refresh preview
        </Button>
      </Toolbar>
      <SplitPane
        className="min-h-0 flex-1"
        primaryPane="end"
        size={25}
        minSize={20}
        maxSize={40}
        separatorLabel="Resize row inspector"
        primary={<DatabaseInspector table={table} selectedRow={selectedRow} />}
        secondary={(
          <main className="flex h-full min-w-0 flex-col overflow-hidden bg-[var(--mtc-bg)]">
            <header className="border-b border-[var(--mtc-border)] bg-[var(--mtc-surface)] px-5 py-3">
              <Breadcrumbs
                maxItems={4}
                items={[
                  { label: 'primary-cluster' },
                  { label: 'analytics' },
                  { label: 'public' },
                  { label: table.name },
                ]}
              />
              <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-lg font-semibold">{table.name}</h1>
                    <Tag>TABLE</Tag>
                    <Badge>{table.estimatedRows.toLocaleString()} estimated rows</Badge>
                  </div>
                  <p className="mt-1 text-xs text-[var(--mtc-muted)]">{table.description}</p>
                </div>
                <span className="text-[10px] text-[var(--mtc-muted)]">
                  Primary key · <code>{table.primaryKey}</code>
                </span>
              </div>
            </header>
            <div className="min-h-0 flex-1 px-5">
              <DatabaseRows
                table={table}
                columns={visibleColumns}
                selectedRowId={selectedRowId}
                onSelectedRowIdChange={setSelectedRowId}
                query={rowQuery}
                onQueryChange={(value) => {
                  setRowQuery(value)
                  setPage(0)
                }}
                sort={sort}
                onSortChange={(value) => {
                  setSort(value)
                  setPage(0)
                }}
                page={page}
                onPageChange={setPage}
              />
            </div>
          </main>
        )}
      />
    </AppSurface>
  )
}

function DatabaseContent({
  table,
  activeTab,
  onActiveTabChange,
  selectedRowId,
  onSelectedRowIdChange,
  rowQuery,
  onRowQueryChange,
  sort,
  onSortChange,
  page,
  onPageChange,
  sql,
  onSqlChange,
  queryStatus,
  onRunPreview,
}: {
  table: DatabaseTableDefinition
  activeTab: DatabaseTab
  onActiveTabChange: (tab: DatabaseTab) => void
  selectedRowId: string
  onSelectedRowIdChange: (id: string) => void
  rowQuery: string
  onRowQueryChange: (value: string) => void
  sort: { key: string; direction: SortDirection }
  onSortChange: (value: { key: string; direction: SortDirection }) => void
  page: number
  onPageChange: (page: number) => void
  sql: string
  onSqlChange: (sql: string) => void
  queryStatus: string
  onRunPreview: () => void
}) {
  const tabs: TabItem[] = [
    {
      id: 'data',
      label: 'Data',
      panel: (
        <DatabaseRows
          table={table}
          selectedRowId={selectedRowId}
          onSelectedRowIdChange={onSelectedRowIdChange}
          query={rowQuery}
          onQueryChange={onRowQueryChange}
          sort={sort}
          onSortChange={onSortChange}
          page={page}
          onPageChange={onPageChange}
        />
      ),
    },
    {
      id: 'structure',
      label: 'Structure',
      panel: <DatabaseStructure table={table} />,
    },
    {
      id: 'indexes',
      label: 'Indexes',
      panel: <DatabaseIndexes table={table} />,
    },
    {
      id: 'query',
      label: 'Query',
      panel: (
        <DatabaseQuery
          table={table}
          sql={sql}
          onSqlChange={onSqlChange}
          status={queryStatus}
          onRunPreview={onRunPreview}
        />
      ),
    },
  ]

  return (
    <main className="flex h-full min-w-0 flex-col overflow-hidden bg-[var(--mtc-bg)]">
      <header className="border-b border-[var(--mtc-border)] bg-[var(--mtc-surface)] px-5 py-3">
        <Breadcrumbs
          maxItems={4}
          items={[
            { label: 'primary-cluster' },
            { label: 'analytics' },
            { label: 'public' },
            { label: table.name },
          ]}
        />
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-lg font-semibold">{table.name}</h1>
              <Tag>TABLE</Tag>
              <Badge>{table.estimatedRows.toLocaleString()} estimated rows</Badge>
            </div>
            <p className="mt-1 max-w-2xl text-xs text-[var(--mtc-muted)]">
              {table.description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[var(--mtc-muted)]">
            <span>{table.columns.length} columns</span>
            <span aria-hidden="true">·</span>
            <span>{table.storageSize}</span>
            <span aria-hidden="true">·</span>
            <span>Updated {table.updated}</span>
          </div>
        </div>
      </header>
      <Tabs
        label="Database table sections"
        items={tabs}
        value={activeTab}
        onValueChange={value => onActiveTabChange(value as DatabaseTab)}
        density="compact"
        className="min-h-0 flex-1 px-5"
      />
    </main>
  )
}

const databasePageSize = 5

function DatabaseRows({
  table,
  columns,
  selectedRowId,
  onSelectedRowIdChange,
  query,
  onQueryChange,
  sort,
  onSortChange,
  page,
  onPageChange,
}: {
  table: DatabaseTableDefinition
  columns?: readonly DatabaseColumn[]
  selectedRowId: string
  onSelectedRowIdChange: (id: string) => void
  query: string
  onQueryChange: (value: string) => void
  sort: { key: string; direction: SortDirection }
  onSortChange: (value: { key: string; direction: SortDirection }) => void
  page: number
  onPageChange: (page: number) => void
}) {
  const displayedColumns = columns == null
    ? table.columns
    : columns.length > 0
      ? columns
      : table.columns.slice(0, 1)
  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = normalizedQuery
      ? table.rows.filter(row => displayedColumns.some(column => (
          String(row[column.key] ?? '').toLowerCase().includes(normalizedQuery)
        )))
      : [...table.rows]
    return filtered.sort((left, right) => {
      const comparison = compareCells(left[sort.key], right[sort.key])
      return sort.direction === 'ascending' ? comparison : -comparison
    })
  }, [displayedColumns, query, sort, table])
  const pageCount = Math.max(1, Math.ceil(rows.length / databasePageSize))
  const safePage = Math.min(page, pageCount - 1)
  const visibleRows = rows.slice(
    safePage * databasePageSize,
    (safePage + 1) * databasePageSize,
  )
  const start = rows.length === 0 ? 0 : safePage * databasePageSize + 1
  const end = Math.min((safePage + 1) * databasePageSize, rows.length)

  const toggleSort = (key: string) => {
    onSortChange({
      key,
      direction: sort.key === key && sort.direction === 'ascending'
        ? 'descending'
        : 'ascending',
    })
  }

  return (
    <section className="flex h-full min-h-[28rem] flex-col" aria-label={`${table.name} data`}>
      <div className="flex flex-wrap items-center justify-between gap-2 py-3">
        <Input
          type="search"
          aria-label="Filter table rows"
          placeholder="Filter loaded rows"
          value={query}
          onChange={event => onQueryChange(event.currentTarget.value)}
          className="w-full sm:w-72"
        />
        <div className="flex items-center gap-2 text-[10px] text-[var(--mtc-muted)]">
          <Badge>{table.rows.length} loaded</Badge>
          <span>Cursor pagination remains host-owned</span>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded border border-[var(--mtc-border)] bg-[var(--mtc-surface)]">
        <table className="min-w-[46rem] w-full border-collapse text-left text-xs">
          <caption className="mtc-visually-hidden">
            Loaded rows from {table.qualifiedName}
          </caption>
          <thead className="sticky top-0 z-[1] bg-[var(--mtc-surface-raised)] text-[var(--mtc-muted-strong)]">
            <tr>
              {displayedColumns.map(column => (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={sort.key === column.key ? sort.direction : 'none'}
                  className="border-b border-[var(--mtc-border-strong)] px-3 py-2 font-medium"
                >
                  <button
                    type="button"
                    className="-mx-1 inline-flex items-center gap-1 rounded px-1 py-0.5 hover:bg-[var(--mtc-panel)] hover:text-[var(--mtc-fg)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--mtc-accent)]"
                    onClick={() => toggleSort(column.key)}
                  >
                    {column.label}
                    {sort.key === column.key && (
                      <span aria-hidden="true">
                        {sort.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? visibleRows.map(row => {
              const rowId = String(row[table.primaryKey])
              const rowLabel = String(row[table.displayColumn] ?? rowId)
              const selected = rowId === selectedRowId
              return (
                <tr
                  key={rowId}
                  className={`border-b border-[var(--mtc-border)] last:border-0 ${selected ? 'bg-[var(--mtc-panel)]' : 'hover:bg-[color-mix(in_oklab,var(--mtc-panel)_52%,transparent)]'}`}
                  data-selected={selected || undefined}
                >
                  {displayedColumns.map((column, columnIndex) => (
                    <td
                      key={column.key}
                      className={`whitespace-nowrap px-3 py-2 ${columnIndex === 0 ? 'font-mono' : ''}`}
                    >
                      {columnIndex === 0 ? (
                        <button
                          type="button"
                          aria-label={`Inspect row ${rowLabel}`}
                          className="rounded text-[var(--mtc-accent-soft)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mtc-accent)]"
                          onClick={() => onSelectedRowIdChange(rowId)}
                        >
                          {formatDatabaseCell(row[column.key])}
                        </button>
                      ) : (
                        <DatabaseCell value={row[column.key]} />
                      )}
                    </td>
                  ))}
                </tr>
              )
            }) : (
              <tr>
                <td colSpan={displayedColumns.length} className="p-8 text-center">
                  <strong className="block text-sm font-medium text-[var(--mtc-fg-soft)]">
                    No rows match “{query}”
                  </strong>
                  <span className="mt-1 block text-xs text-[var(--mtc-muted)]">
                    Clear the filter to restore the loaded preview.
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 py-3">
        <output className="text-[10px] text-[var(--mtc-muted)]">
          {start}–{end} of {rows.length} loaded · {table.estimatedRows.toLocaleString()} estimated
        </output>
        <div className="flex items-center gap-1" role="group" aria-label="Loaded row pages">
          <Button
            size="small"
            aria-label="Previous row page"
            disabled={safePage === 0}
            onClick={() => onPageChange(Math.max(0, safePage - 1))}
          >
            Previous
          </Button>
          <Badge>Page {safePage + 1} of {pageCount}</Badge>
          <Button
            size="small"
            aria-label="Next row page"
            disabled={safePage >= pageCount - 1}
            onClick={() => onPageChange(Math.min(pageCount - 1, safePage + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  )
}

function DatabaseCell({ value }: { value: CellValue | undefined }) {
  if (value == null) {
    return <span className="font-mono text-[var(--mtc-muted-subtle)]">NULL</span>
  }
  const normalized = String(value).toLowerCase()
  if (['active', 'approved', 'delivered', 'success'].includes(normalized)) {
    return <Tag intent="success">{String(value)}</Tag>
  }
  if (['review', 'processing', 'warning'].includes(normalized)) {
    return <Tag intent="warning">{String(value)}</Tag>
  }
  if (['paused', 'exception', 'error'].includes(normalized)) {
    return <Tag intent="danger">{String(value)}</Tag>
  }
  return <>{formatDatabaseCell(value)}</>
}

function DatabaseStructure({ table }: { table: DatabaseTableDefinition }) {
  return (
    <section className="min-h-[28rem] py-4" aria-labelledby="database-column-definitions">
      <div className="mb-3">
        <h2 id="database-column-definitions" className="text-sm font-semibold">Column definitions</h2>
        <p className="mt-1 text-xs text-[var(--mtc-muted)]">
          Types and constraints are metadata supplied by the active connection.
        </p>
      </div>
      <div className="overflow-auto rounded border border-[var(--mtc-border)] bg-[var(--mtc-surface)]">
        <table className="min-w-[42rem] w-full text-left text-xs">
          <thead className="border-b border-[var(--mtc-border-strong)] bg-[var(--mtc-surface-raised)] text-[var(--mtc-muted-strong)]">
            <tr>
              {['Column', 'Type', 'Nullable', 'Default', 'Constraint'].map(label => (
                <th key={label} scope="col" className="px-3 py-2 font-medium">{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.columns.map(column => (
              <tr key={column.key} className="border-b border-[var(--mtc-border)] last:border-0">
                <th scope="row" className="px-3 py-2 font-mono font-medium text-[var(--mtc-fg-soft)]">
                  {column.label}
                </th>
                <td className="px-3 py-2 font-mono text-[var(--mtc-accent-soft)]">{column.dataType}</td>
                <td className="px-3 py-2">{column.nullable ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2 font-mono text-[var(--mtc-muted)]">{column.defaultValue ?? '—'}</td>
                <td className="px-3 py-2">
                  {column.role === 'primary'
                    ? <Tag intent="primary">Primary key</Tag>
                    : column.role === 'foreign'
                      ? <Tag>Foreign key</Tag>
                      : <span className="text-[var(--mtc-muted-subtle)]">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function DatabaseIndexes({ table }: { table: DatabaseTableDefinition }) {
  return (
    <section className="min-h-[28rem] py-4" aria-labelledby="database-indexes">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="database-indexes" className="text-sm font-semibold">Indexes</h2>
          <p className="mt-1 text-xs text-[var(--mtc-muted)]">
            Physical metadata is descriptive; management actions belong to the host.
          </p>
        </div>
        <Badge>{table.indexes.length} indexes</Badge>
      </div>
      <div className="grid gap-2">
        {table.indexes.map(index => (
          <article
            key={index.name}
            className="rounded border border-[var(--mtc-border)] bg-[var(--mtc-surface)] p-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <code className="text-xs font-semibold text-[var(--mtc-fg-soft)]">{index.name}</code>
              <div className="flex items-center gap-2">
                {index.unique && <Tag intent="primary">Unique</Tag>}
                <Badge>{index.method}</Badge>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-mono text-[var(--mtc-accent-soft)]">
                {index.columns.join(', ')}
              </span>
              <span className="text-[var(--mtc-muted)]">{index.size}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function DatabaseQuery({
  table,
  sql,
  onSqlChange,
  status,
  onRunPreview,
}: {
  table: DatabaseTableDefinition
  sql: string
  onSqlChange: (sql: string) => void
  status: string
  onRunPreview: () => void
}) {
  return (
    <section className="grid min-h-[28rem] gap-3 py-4" aria-labelledby="database-query-editor">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="database-query-editor" className="text-sm font-semibold">Query preview</h2>
          <p className="mt-1 text-xs text-[var(--mtc-muted)]">
            Edit the host-bound query for <code>{table.qualifiedName}</code>.
          </p>
        </div>
        <Button
          size="small"
          intent="primary"
          variant="solid"
          startIcon={<Icon name="chevron-right" />}
          onClick={onRunPreview}
        >
          Run preview
        </Button>
      </div>
      <TextArea
        aria-label="SQL query"
        spellCheck={false}
        value={sql}
        onChange={event => onSqlChange(event.currentTarget.value)}
        className="min-h-52 resize-y font-mono leading-relaxed"
      />
      <output
        role="status"
        className="rounded border border-[var(--mtc-border)] bg-[var(--mtc-surface)] px-3 py-2 text-xs text-[var(--mtc-muted-strong)]"
      >
        {status}
      </output>
      <Callout title="Host integration seam" intent="info" role="note">
        Terminal Core presents metadata, rows, query text, and results. A trusted host
        owns credentials, authorization, SQL execution, cancellation, and cursor paging.
      </Callout>
    </section>
  )
}

function DatabaseInspector({
  table,
  selectedRow,
}: {
  table: DatabaseTableDefinition
  selectedRow: DatabaseRow | undefined
}) {
  const rowLabel = selectedRow
    ? String(selectedRow[table.displayColumn] ?? selectedRow[table.primaryKey])
    : undefined
  const properties = selectedRow
    ? table.columns.map(column => ({
        id: column.key,
        label: column.label,
        description: column.dataType,
        value: selectedRow[column.key],
      }))
    : [
        { id: 'qualified-name', label: 'Qualified name', value: table.qualifiedName },
        { id: 'owner', label: 'Owner', value: table.owner },
        { id: 'estimated-rows', label: 'Estimated rows', value: table.estimatedRows.toLocaleString() },
        { id: 'loaded-rows', label: 'Loaded preview', value: table.rows.length },
        { id: 'storage', label: 'Storage', value: table.storageSize },
        { id: 'primary-key', label: 'Primary key', value: table.primaryKey },
        { id: 'updated', label: 'Updated', value: table.updated },
      ]

  return (
    <Inspector
      label="Database inspector"
      width="100%"
      className="h-full"
      title={rowLabel ?? table.name}
      subtitle={selectedRow ? `Row · ${table.name}` : `Table · ${table.qualifiedName}`}
      footer={(
        <p className="text-[10px] leading-relaxed text-[var(--mtc-muted)]">
          Metadata and row values are rendered safely as host-provided data.
        </p>
      )}
    >
      <div className="border-b border-[var(--mtc-border)] px-3 py-3">
        <div className="flex flex-wrap gap-2">
          <Tag>{selectedRow ? 'ROW' : 'TABLE'}</Tag>
          <Badge dot intent="success">Available</Badge>
          <Badge>Read only</Badge>
        </div>
      </div>
      <PropertyList items={properties} density="compact" />
    </Inspector>
  )
}

function databaseQuery(table: DatabaseTableDefinition): string {
  const selectedColumns = table.columns.slice(0, 5).map(column => `  ${column.key}`).join(',\n')
  return `SELECT\n${selectedColumns}\nFROM ${table.qualifiedName}\nORDER BY ${table.primaryKey} DESC\nLIMIT 100;`
}

function filterDatabaseTree(
  items: readonly TreeItem[],
  query: string,
): TreeItem[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return [...items]
  return items.flatMap(item => {
    const children = item.children
      ? filterDatabaseTree(item.children, normalized)
      : []
    const label = typeof item.label === 'string' ? item.label : ''
    const description = typeof item.description === 'string' ? item.description : ''
    const matches = `${label} ${description}`.toLowerCase().includes(normalized)
    if (!matches && children.length === 0) return []
    return [{ ...item, children: children.length > 0 ? children : item.children }]
  })
}

function allBranchIds(items: readonly TreeItem[]): ReadonlySet<string> {
  const ids = new Set<string>()
  const visit = (nodes: readonly TreeItem[]) => {
    nodes.forEach(node => {
      if (node.children?.length) {
        ids.add(node.id)
        visit(node.children)
      }
    })
  }
  visit(items)
  return ids
}

function compareCells(left: CellValue | undefined, right: CellValue | undefined): number {
  if (left == null && right == null) return 0
  if (left == null) return 1
  if (right == null) return -1
  if (typeof left === 'number' && typeof right === 'number') return left - right
  return String(left).localeCompare(String(right), undefined, {
    numeric: true,
    sensitivity: 'base',
  })
}

function formatDatabaseCell(value: CellValue | undefined): string {
  if (value == null) return 'NULL'
  if (typeof value === 'number') {
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })
  }
  return String(value)
}
