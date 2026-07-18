import { useMemo, useState, type CSSProperties } from 'react'
import {
  ReadinessAvatar,
  ReadinessIcon,
  type ReadinessIconName,
} from './ReadinessPrimitives'
import './ReadinessShowcases.css'
import './PalantirFoundationShowcase.css'

export type PalantirFoundationSurface = 'coverage' | 'compass' | 'data' | 'code'
export type PalantirCapabilityReadiness = 'Showcase ready' | 'Core ready'
export type PalantirCapabilityLayer =
  | 'Organize & govern'
  | 'Connect & integrate'
  | 'Model & operate'
  | 'Analyze & automate'

export interface PalantirCapability {
  id: string
  product: string
  layer: PalantirCapabilityLayer
  summary: string
  primitives: readonly string[]
  readiness: PalantirCapabilityReadiness
  hostBoundary: string
}

export type PalantirCompassResourceKind =
  | 'Project'
  | 'Dataset'
  | 'Pipeline'
  | 'Code repository'
  | 'Application'
  | 'Analysis'
  | 'Media set'

export interface PalantirCompassResource {
  id: string
  name: string
  kind: PalantirCompassResourceKind
  project: string
  owner: string
  modifiedAt: string
  status: 'Healthy' | 'Draft' | 'Building' | 'Needs attention'
  description: string
  tags: readonly string[]
  pinned?: boolean
  shared?: boolean
}

export interface PalantirDataConnection {
  id: string
  name: string
  sourceType: string
  direction: 'Inbound' | 'Outbound' | 'Bidirectional'
  status: 'Connected' | 'Syncing' | 'Attention'
  lastSync: string
  assets: number
  schedule: string
  throughput: string
}

export interface PalantirRepositoryEntry {
  path: string
  name: string
  kind: 'file' | 'folder'
  depth: number
  language?: string
  content?: string
  modifiedAt?: string
}

export interface PalantirFoundationShowcaseProps {
  capabilities?: readonly PalantirCapability[]
  resources?: readonly PalantirCompassResource[]
  connections?: readonly PalantirDataConnection[]
  repositoryEntries?: readonly PalantirRepositoryEntry[]
  initialSurface?: PalantirFoundationSurface
  initialResourceId?: string
  initialConnectionId?: string
  initialRepositoryPath?: string
  workspaceName?: string
  onSelectResource?: (resource: PalantirCompassResource) => void
  onSelectConnection?: (connection: PalantirDataConnection) => void
  onSelectRepositoryEntry?: (entry: PalantirRepositoryEntry) => void
}

export const PALANTIR_SAMPLE_CAPABILITIES: readonly PalantirCapability[] = [
  {
    id: 'compass',
    product: 'Compass',
    layer: 'Organize & govern',
    summary: 'Projects, folders, resources, discovery, sharing, and governed file organization.',
    primitives: ['asset_catalog', 'file_browser', 'catalog'],
    readiness: 'Showcase ready',
    hostBoundary: 'Permissions, markings, durable storage',
  },
  {
    id: 'data-connection',
    product: 'Data Connection & HyperAuto',
    layer: 'Connect & integrate',
    summary: 'Sources, generated ingestion, syncs, schedules, exports, and connection health.',
    primitives: ['catalog', 'events', 'action_form'],
    readiness: 'Showcase ready',
    hostBoundary: 'Connector agents, credentials, sync engines',
  },
  {
    id: 'pipeline-builder',
    product: 'Pipeline Builder & Data Health',
    layer: 'Connect & integrate',
    summary: 'Graph-based transforms, dataset previews, quality checks, outputs, and delivery.',
    primitives: ['dag', 'table', 'action_log'],
    readiness: 'Showcase ready',
    hostBoundary: 'Compute, builds, schedules, branching',
  },
  {
    id: 'code-repositories',
    product: 'Code Repositories & Workspaces',
    layer: 'Connect & integrate',
    summary: 'Repositories, IDE workspaces, refs, checks, previews, SDKs, and proposals.',
    primitives: ['code_browser', 'dag', 'action_log'],
    readiness: 'Showcase ready',
    hostBoundary: 'Git, runtimes, builds, compute, test execution',
  },
  {
    id: 'data-lineage',
    product: 'Data Lineage & Observability',
    layer: 'Organize & govern',
    summary: 'Resource dependency graphs with health, freshness, usage, tracing, and drill-down.',
    primitives: ['dag', 'asset_catalog', 'events'],
    readiness: 'Showcase ready',
    hostBoundary: 'Lineage graph, telemetry, logs, usage metadata',
  },
  {
    id: 'models-simulation',
    product: 'Model Assets & Simulation',
    layer: 'Connect & integrate',
    summary: 'Model catalogs, objectives, versions, evaluations, relationship graphs, and scenarios.',
    primitives: ['asset_catalog', 'dag', 'charts'],
    readiness: 'Core ready',
    hostBoundary: 'Training, inference, registry, simulation execution',
  },
  {
    id: 'ontology-manager',
    product: 'Ontology Manager',
    layer: 'Model & operate',
    summary: 'Object, property, link, action, interface, and function type presentation.',
    primitives: ['asset_catalog', 'object_view', 'action_form'],
    readiness: 'Showcase ready',
    hostBoundary: 'Ontology persistence and indexing',
  },
  {
    id: 'object-explorer-actions',
    product: 'Object Explorer, Views & Actions',
    layer: 'Model & operate',
    summary: 'Object search, canonical views, linked context, writeback forms, and audit state.',
    primitives: ['object_view', 'record_grid', 'action_form'],
    readiness: 'Showcase ready',
    hostBoundary: 'Object search, transactions, policy checks',
  },
  {
    id: 'rules-automation',
    product: 'Rules, Automate & Scheduling',
    layer: 'Model & operate',
    summary: 'Business rules, event triggers, human checkpoints, schedules, and process monitoring.',
    primitives: ['alerts', 'events', 'action_log'],
    readiness: 'Core ready',
    hostBoundary: 'Rules engine, orchestration, optimization, job execution',
  },
  {
    id: 'workshop',
    product: 'Workshop, Slate & Carbon',
    layer: 'Model & operate',
    summary: 'Operational apps and curated workspaces composed from object-aware views and actions.',
    primitives: ['Dashboard', 'record_board', 'action_form'],
    readiness: 'Core ready',
    hostBoundary: 'Object queries, functions, action execution',
  },
  {
    id: 'quiver-contour',
    product: 'Quiver, Contour & Insight',
    layer: 'Analyze & automate',
    summary: 'Point-and-click analysis, charts, tables, paths, filters, drill-down, and exports.',
    primitives: ['charts', 'table', 'ctx + export'],
    readiness: 'Core ready',
    hostBoundary: 'Query planning and materialization',
  },
  {
    id: 'notepad-fusion',
    product: 'Notepad & Fusion',
    layer: 'Analyze & automate',
    summary: 'Ontology-aware documents, templated reports, and bidirectional spreadsheet workflows.',
    primitives: ['docs clone', 'sheets clone', 'table'],
    readiness: 'Core ready',
    hostBoundary: 'Collaboration, document persistence, dataset writeback',
  },
  {
    id: 'map',
    product: 'Map & Temporal Workflows',
    layer: 'Analyze & automate',
    summary: 'Geospatial objects, layers, routes, time playback, selections, and operational actions.',
    primitives: ['map adapter', 'timeline', 'object_view'],
    readiness: 'Core ready',
    hostBoundary: 'Tiles, geocoding, routing, spatial queries',
  },
  {
    id: 'aip',
    product: 'AIP Logic, Chatbots & Evals',
    layer: 'Analyze & automate',
    summary: 'Assistants, agents, generated dashboards, governed tools, progress, and evaluations.',
    primitives: ['prompt', 'Generate', 'action_log'],
    readiness: 'Core ready',
    hostBoundary: 'Models, agents, tools, eval execution',
  },
  {
    id: 'product-delivery',
    product: 'DevOps, Marketplace & Apollo',
    layer: 'Organize & govern',
    summary: 'Products, releases, installations, deployment health, channels, and fleet operations.',
    primitives: ['asset_catalog', 'events', 'action_log'],
    readiness: 'Core ready',
    hostBoundary: 'Packaging, registry, rollout orchestration, telemetry',
  },
  {
    id: 'governance-admin',
    product: 'Approvals, Governance & Admin',
    layer: 'Organize & govern',
    summary: 'Approvals, access requests, sensitive-data controls, audit, retention, and administration.',
    primitives: ['action_form', 'record_grid', 'action_log'],
    readiness: 'Core ready',
    hostBoundary: 'Identity, policy enforcement, cryptography, audit',
  },
]

export const PALANTIR_SAMPLE_RESOURCES: readonly PalantirCompassResource[] = [
  {
    id: 'northstar-project',
    name: 'Northstar Operations',
    kind: 'Project',
    project: 'Platform',
    owner: 'Jordan Lee',
    modifiedAt: '8 min ago',
    status: 'Healthy',
    description: 'Governed operational resources for customer, commerce, and support workflows.',
    tags: ['production', 'operations'],
    pinned: true,
    shared: true,
  },
  {
    id: 'customer-360',
    name: 'gold.customer_360',
    kind: 'Dataset',
    project: 'Northstar Operations',
    owner: 'Data Platform',
    modifiedAt: '18 min ago',
    status: 'Healthy',
    description: 'Curated customer profile dataset backing the Customer object type.',
    tags: ['gold', 'customer'],
    pinned: true,
    shared: true,
  },
  {
    id: 'commerce-pipeline',
    name: 'commerce_ingestion',
    kind: 'Pipeline',
    project: 'Northstar Operations',
    owner: 'Maya Chen',
    modifiedAt: '31 min ago',
    status: 'Building',
    description: 'Batch and streaming normalization for order, payment, and fulfillment events.',
    tags: ['pipeline', 'commerce'],
    shared: true,
  },
  {
    id: 'analytics-repository',
    name: 'analytics',
    kind: 'Code repository',
    project: 'Northstar Operations',
    owner: 'Sarah Kim',
    modifiedAt: '42 min ago',
    status: 'Healthy',
    description: 'Production transforms, ontology mappings, tests, and analytical services.',
    tags: ['python', 'sql'],
    pinned: true,
  },
  {
    id: 'account-cockpit',
    name: 'Account cockpit',
    kind: 'Application',
    project: 'Commercial Operations',
    owner: 'Amelia Stone',
    modifiedAt: '1 hr ago',
    status: 'Healthy',
    description: 'Operational customer workspace for renewals, support, orders, and actions.',
    tags: ['workshop', 'customer'],
    shared: true,
  },
  {
    id: 'renewal-risk',
    name: 'Renewal risk analysis',
    kind: 'Analysis',
    project: 'Commercial Operations',
    owner: 'Noah Williams',
    modifiedAt: 'Yesterday',
    status: 'Draft',
    description: 'Ontology-aware customer renewal analysis with editable risk conclusions.',
    tags: ['quiver', 'renewal'],
  },
  {
    id: 'field-media',
    name: 'field_media',
    kind: 'Media set',
    project: 'Service Operations',
    owner: 'Avery Brooks',
    modifiedAt: 'Yesterday',
    status: 'Needs attention',
    description: 'Inspection photos and videos associated with service-case objects.',
    tags: ['media', 'inspection'],
    shared: true,
  },
]

export const PALANTIR_SAMPLE_CONNECTIONS: readonly PalantirDataConnection[] = [
  {
    id: 'postgres-crm',
    name: 'CRM Postgres',
    sourceType: 'PostgreSQL',
    direction: 'Inbound',
    status: 'Connected',
    lastSync: '4 min ago',
    assets: 18,
    schedule: 'Every 10 minutes',
    throughput: '2.8M rows / day',
  },
  {
    id: 'commerce-api',
    name: 'Commerce API',
    sourceType: 'REST + webhooks',
    direction: 'Bidirectional',
    status: 'Syncing',
    lastSync: 'Now',
    assets: 12,
    schedule: 'Continuous + nightly',
    throughput: '184K events / day',
  },
  {
    id: 'finance-warehouse',
    name: 'Finance warehouse',
    sourceType: 'Snowflake',
    direction: 'Bidirectional',
    status: 'Connected',
    lastSync: '11 min ago',
    assets: 26,
    schedule: 'Hourly',
    throughput: '640K rows / day',
  },
  {
    id: 'field-s3',
    name: 'Field media',
    sourceType: 'Amazon S3',
    direction: 'Inbound',
    status: 'Attention',
    lastSync: '38 min ago',
    assets: 7,
    schedule: 'Every 15 minutes',
    throughput: '1,420 files / day',
  },
]

const CUSTOMER_HEALTH_CODE = `from transforms.api import Input, Output, transform_df

@transform_df(
    Output("ri.foundry.main.dataset.customer_360"),
    customers=Input("ri.foundry.main.dataset.raw_customers"),
    orders=Input("ri.foundry.main.dataset.commercial_orders"),
)
def customer_health(customers, orders):
    order_health = (
        orders.groupBy("customer_id")
        .agg(total("amount").alias("lifetime_value"))
    )
    return customers.join(order_health, "customer_id", "left")`

export const PALANTIR_SAMPLE_REPOSITORY_ENTRIES: readonly PalantirRepositoryEntry[] = [
  { path: 'src', name: 'src', kind: 'folder', depth: 0 },
  {
    path: 'src/customer_health.py',
    name: 'customer_health.py',
    kind: 'file',
    depth: 1,
    language: 'Python',
    content: CUSTOMER_HEALTH_CODE,
    modifiedAt: '18 min ago',
  },
  {
    path: 'src/order_features.sql',
    name: 'order_features.sql',
    kind: 'file',
    depth: 1,
    language: 'SQL',
    content: 'SELECT customer_id, COUNT(*) AS order_count\\nFROM commercial_orders\\nGROUP BY customer_id',
    modifiedAt: 'Yesterday',
  },
  { path: 'tests', name: 'tests', kind: 'folder', depth: 0 },
  {
    path: 'tests/test_customer_health.py',
    name: 'test_customer_health.py',
    kind: 'file',
    depth: 1,
    language: 'Python',
    content: 'def test_customer_health_has_unique_ids(output):\\n    assert output.select("customer_id").distinct().count() == output.count()',
    modifiedAt: '2 days ago',
  },
  {
    path: 'README.md',
    name: 'README.md',
    kind: 'file',
    depth: 0,
    language: 'Markdown',
    content: '# Analytics\\n\\nProduction transforms for customer and commerce operations.',
    modifiedAt: 'Last week',
  },
]

export function selectPalantirCompassResources(
  resources: readonly PalantirCompassResource[],
  query: string,
  kind?: PalantirCompassResourceKind,
): PalantirCompassResource[] {
  const normalized = query.trim().toLowerCase()
  return resources.filter(resource => {
    if (kind && resource.kind !== kind) return false
    if (!normalized) return true
    return [
      resource.name,
      resource.kind,
      resource.project,
      resource.owner,
      resource.description,
      ...resource.tags,
    ].join(' ').toLowerCase().includes(normalized)
  })
}

export function palantirReadinessSummary(
  capabilities: readonly PalantirCapability[],
): { total: number; showcased: number; coreReady: number; missing: number } {
  const showcased = capabilities.filter(capability => capability.readiness === 'Showcase ready').length
  const coreReady = capabilities.filter(capability => capability.readiness === 'Core ready').length
  return {
    total: capabilities.length,
    showcased,
    coreReady,
    missing: Math.max(0, capabilities.length - showcased - coreReady),
  }
}

const FOUNDATION_NAV: {
  id: PalantirFoundationSurface
  label: string
  icon: ReadinessIconName
}[] = [
  { id: 'coverage', label: 'Readiness map', icon: 'apps' },
  { id: 'compass', label: 'Compass', icon: 'document' },
  { id: 'data', label: 'Data integration', icon: 'graph' },
  { id: 'code', label: 'Code repositories', icon: 'code' },
]

export function PalantirFoundationShowcase({
  capabilities = PALANTIR_SAMPLE_CAPABILITIES,
  resources = PALANTIR_SAMPLE_RESOURCES,
  connections = PALANTIR_SAMPLE_CONNECTIONS,
  repositoryEntries = PALANTIR_SAMPLE_REPOSITORY_ENTRIES,
  initialSurface = 'coverage',
  initialResourceId = 'customer-360',
  initialConnectionId = 'postgres-crm',
  initialRepositoryPath = 'src/customer_health.py',
  workspaceName = 'Northstar Operations',
  onSelectResource,
  onSelectConnection,
  onSelectRepositoryEntry,
}: PalantirFoundationShowcaseProps) {
  const [surface, setSurface] = useState<PalantirFoundationSurface>(initialSurface)
  const [resourceQuery, setResourceQuery] = useState('')
  const [selectedResourceId, setSelectedResourceId] = useState(initialResourceId)
  const [selectedConnectionId, setSelectedConnectionId] = useState(initialConnectionId)
  const [selectedRepositoryPath, setSelectedRepositoryPath] = useState(initialRepositoryPath)

  const filteredResources = useMemo(
    () => selectPalantirCompassResources(resources, resourceQuery),
    [resources, resourceQuery],
  )
  const selectedResource = resources.find(resource => resource.id === selectedResourceId)
    ?? resources[0]
  const selectedConnection = connections.find(connection => connection.id === selectedConnectionId)
    ?? connections[0]
  const selectedRepositoryEntry = repositoryEntries.find(entry => entry.path === selectedRepositoryPath)
    ?? repositoryEntries.find(entry => entry.kind === 'file')
  const summary = palantirReadinessSummary(capabilities)

  const chooseResource = (resource: PalantirCompassResource) => {
    setSelectedResourceId(resource.id)
    onSelectResource?.(resource)
  }
  const chooseConnection = (connection: PalantirDataConnection) => {
    setSelectedConnectionId(connection.id)
    onSelectConnection?.(connection)
  }
  const chooseRepositoryEntry = (entry: PalantirRepositoryEntry) => {
    setSelectedRepositoryPath(entry.path)
    onSelectRepositoryEntry?.(entry)
  }

  return (
    <div className="ready-showcase foundry-showcase palantir-foundation-showcase">
      <header className="foundry-topbar">
        <div className="foundry-brand">
          <span className="foundry-mark"><ReadinessIcon name="layers" size={17} /></span>
          <strong>Foundry</strong>
          <span className="foundry-product">Platform</span>
        </div>
        <button className="foundry-workspace-switcher">
          <span>{workspaceName}</span>
          <ReadinessIcon name="chevron-down" size={14} />
        </button>
        <div className="foundry-global-search">
          <ReadinessIcon name="search" size={15} />
          <span>Search projects, resources, objects, and applications</span>
          <kbd>⌘ K</kbd>
        </div>
        <div className="ready-top-actions">
          <button aria-label="Help"><ReadinessIcon name="help" /></button>
          <button aria-label="Notifications" className="ready-notification"><ReadinessIcon name="bell" /><i /></button>
          <ReadinessAvatar name="Jordan Lee" color="#496f9a" size={27} />
        </div>
      </header>

      <div className="foundry-body">
        <aside className="foundry-sidebar">
          <div className="foundry-space-label">Foundry foundation</div>
          <nav>
            {FOUNDATION_NAV.map(item => (
              <button
                key={item.id}
                className={surface === item.id ? 'active' : ''}
                onClick={() => setSurface(item.id)}
              >
                <ReadinessIcon name={item.icon} size={16} />
                <span>{item.label}</span>
                {item.id === 'data' && <i className="foundry-nav-warning">1</i>}
              </button>
            ))}
          </nav>
          <div className="foundry-sidebar-group palantir-covered-group">
            <span>Covered modules</span>
            {[
              ['Ontology Manager', 'layers'],
              ['Object Explorer', 'database'],
              ['Workshop / Slate', 'apps'],
              ['Quiver / Fusion', 'chart'],
              ['Map', 'location'],
              ['AIP', 'sparkles'],
            ].map(([label, icon]) => (
              <div className="palantir-covered-link" key={label}>
                <ReadinessIcon name={icon as ReadinessIconName} size={15} />
                <strong>{label}</strong>
                <ReadinessIcon name="check" size={12} />
              </div>
            ))}
          </div>
          <div className="foundry-sidebar-footer">
            <ReadinessIcon name="shield" size={15} />
            <div><strong>Frontend boundary</strong><span>Host adapters explicit</span></div>
          </div>
        </aside>

        <main className="foundry-main palantir-foundation-main">
          {surface === 'coverage' && (
            <PalantirCoverageSurface capabilities={capabilities} summary={summary} />
          )}
          {surface === 'compass' && (
            <PalantirCompassSurface
              resources={resources}
              filteredResources={filteredResources}
              query={resourceQuery}
              selectedResource={selectedResource}
              onQueryChange={setResourceQuery}
              onSelectResource={chooseResource}
            />
          )}
          {surface === 'data' && selectedConnection && (
            <PalantirDataSurface
              connections={connections}
              selectedConnection={selectedConnection}
              onSelectConnection={chooseConnection}
            />
          )}
          {surface === 'code' && selectedRepositoryEntry && (
            <PalantirCodeSurface
              entries={repositoryEntries}
              selectedEntry={selectedRepositoryEntry}
              onSelectEntry={chooseRepositoryEntry}
            />
          )}
        </main>
      </div>
    </div>
  )
}

function PalantirCoverageSurface({
  capabilities,
  summary,
}: {
  capabilities: readonly PalantirCapability[]
  summary: ReturnType<typeof palantirReadinessSummary>
}) {
  return (
    <>
      <div className="ready-page-heading foundry-page-heading">
        <div>
          <div className="ready-eyebrow">Platform readiness</div>
          <h1>Palantir platform capability map</h1>
          <p>Foundry, AIP, and delivery presentation coverage is separated from host security, compute, storage, and execution.</p>
        </div>
        <button className="ready-button secondary"><ReadinessIcon name="check" size={14} />No frontend gaps</button>
      </div>

      <div className="palantir-readiness-stats">
        <FoundationStat label="Capability groups" value={String(summary.total)} detail="Foundry + AIP + delivery scope" />
        <FoundationStat label="Exact showcases" value={String(summary.showcased)} detail="Clone-style Storybook states" tone="blue" />
        <FoundationStat label="Core-ready" value={String(summary.coreReady)} detail="Composable framework primitives" tone="green" />
        <FoundationStat label="Missing frontend" value={String(summary.missing)} detail="Nothing blocks presentation work" tone="green" />
      </div>

      <div className="palantir-capability-grid">
        {capabilities.map(capability => (
          <article className="palantir-capability-card" key={capability.id}>
            <header>
              <span className="palantir-capability-icon">
                <ReadinessIcon name={capabilityIcon(capability.id)} size={17} />
              </span>
              <div><small>{capability.layer}</small><h2>{capability.product}</h2></div>
              <PalantirReadinessBadge readiness={capability.readiness} />
            </header>
            <p>{capability.summary}</p>
            <div className="palantir-capability-primitives">
              {capability.primitives.map(primitive => <code key={primitive}>{primitive}</code>)}
            </div>
            <footer><ReadinessIcon name="shield" size={12} /><span>Host: {capability.hostBoundary}</span></footer>
          </article>
        ))}
      </div>

      <section className="palantir-host-boundary">
        <span><ReadinessIcon name="shield" size={20} /></span>
        <div><h2>Production boundary stays deliberate</h2><p>The framework owns rendering, interaction contracts, streaming UX, and action lifecycle presentation.</p></div>
        <ul>
          <li>Identity, roles, markings, and row-level policy</li>
          <li>Durable storage, compute, connectors, and builds</li>
          <li>Ontology indexing, transactions, audit, and deployment</li>
        </ul>
      </section>
    </>
  )
}

function PalantirCompassSurface({
  resources,
  filteredResources,
  query,
  selectedResource,
  onQueryChange,
  onSelectResource,
}: {
  resources: readonly PalantirCompassResource[]
  filteredResources: readonly PalantirCompassResource[]
  query: string
  selectedResource?: PalantirCompassResource
  onQueryChange: (query: string) => void
  onSelectResource: (resource: PalantirCompassResource) => void
}) {
  const kinds = [...new Set(resources.map(resource => resource.kind))]
  return (
    <>
      <div className="ready-page-heading foundry-page-heading">
        <div>
          <div className="ready-eyebrow">Compass / Files</div>
          <h1>Projects and resources</h1>
          <p>Browse, organize, secure, share, and inspect every resource through one filesystem-style surface.</p>
        </div>
        <div className="ready-heading-actions">
          <button className="ready-button secondary"><ReadinessIcon name="arrow-up" size={14} />Upload</button>
          <button className="ready-button primary"><ReadinessIcon name="plus" size={14} />New resource</button>
        </div>
      </div>

      <div className="palantir-compass-tabs">
        <button className="active">Files</button><button>Portfolios</button><button>Projects</button><button>Your files</button><button>Shared with you</button>
      </div>

      <div className="palantir-quick-filters">
        <button><span><ReadinessIcon name="layers" size={17} /></span><div><strong>Northstar Operations</strong><small>7 active resources</small></div><ReadinessIcon name="chevron-right" size={14} /></button>
        <button><span><ReadinessIcon name="people" size={17} /></span><div><strong>Shared with you</strong><small>{resources.filter(resource => resource.shared).length} resources</small></div><ReadinessIcon name="chevron-right" size={14} /></button>
        <button><span><ReadinessIcon name="check" size={17} /></span><div><strong>Promoted items</strong><small>{resources.filter(resource => resource.pinned).length} pinned resources</small></div><ReadinessIcon name="chevron-right" size={14} /></button>
      </div>

      <div className="palantir-compass-layout">
        <aside className="palantir-compass-filters">
          <header><strong>Filters</strong><button>Clear</button></header>
          <section><h3>Resource type</h3>{kinds.map(kind => <label key={kind}><input type="checkbox" />{kind}<span>{resources.filter(resource => resource.kind === kind).length}</span></label>)}</section>
          <section><h3>Status</h3><label><input type="checkbox" />Healthy<span>{resources.filter(resource => resource.status === 'Healthy').length}</span></label><label><input type="checkbox" />Needs attention<span>{resources.filter(resource => resource.status === 'Needs attention').length}</span></label></section>
          <section><h3>Location</h3><label><input type="checkbox" />My projects</label><label><input type="checkbox" />Shared projects</label></section>
        </aside>

        <section className="palantir-compass-table-panel">
          <div className="ready-panel-toolbar">
            <label className="ready-search-field"><ReadinessIcon name="search" size={15} /><input value={query} onChange={event => onQueryChange(event.target.value)} placeholder="Search files and resources" /></label>
            <button><ReadinessIcon name="filter" size={14} />Filters</button>
            <button aria-label="More options"><ReadinessIcon name="more" size={15} /></button>
          </div>
          <div className="palantir-compass-table">
            <div className="palantir-compass-table-head"><span>Name</span><span>Type</span><span>Project</span><span>Owner</span><span>Modified</span><span>Status</span></div>
            {filteredResources.map(resource => (
              <button key={resource.id} className={selectedResource?.id === resource.id ? 'selected' : ''} onClick={() => onSelectResource(resource)}>
                <span className="palantir-resource-name"><i><ReadinessIcon name={resourceIcon(resource.kind)} size={15} /></i><span><strong>{resource.name}</strong><small>{resource.description}</small></span>{resource.pinned && <ReadinessIcon name="flag" size={12} />}</span>
                <span>{resource.kind}</span><span>{resource.project}</span><span>{resource.owner}</span><span>{resource.modifiedAt}</span><PalantirResourceStatus status={resource.status} />
              </button>
            ))}
          </div>
          <footer>{filteredResources.length} of {resources.length} resources <span>Project resources inherit access by default</span></footer>
        </section>

        {selectedResource && (
          <aside className="palantir-resource-detail">
            <header><span><ReadinessIcon name={resourceIcon(selectedResource.kind)} size={20} /></span><button><ReadinessIcon name="close" size={14} /></button></header>
            <h2>{selectedResource.name}</h2><small>{selectedResource.kind}</small>
            <PalantirResourceStatus status={selectedResource.status} />
            <p>{selectedResource.description}</p>
            <div className="palantir-resource-actions"><button>Open</button><button><ReadinessIcon name="more" size={14} /></button></div>
            <dl>
              <div><dt>Project</dt><dd>{selectedResource.project}</dd></div>
              <div><dt>Owner</dt><dd>{selectedResource.owner}</dd></div>
              <div><dt>Modified</dt><dd>{selectedResource.modifiedAt}</dd></div>
              <div><dt>Resource ID</dt><dd>ri.foundry.main.{selectedResource.kind.toLowerCase().replace(/\s+/g, '-')}.{selectedResource.id}</dd></div>
            </dl>
            <section><h3>Tags</h3><div>{selectedResource.tags.map(tag => <span key={tag}>{tag}</span>)}</div></section>
            <section><h3>Access</h3><p><ReadinessIcon name="shield" size={13} />Northstar Operations · Editor</p><p><ReadinessIcon name="people" size={13} />{selectedResource.shared ? 'Shared with workspace' : 'Project members only'}</p></section>
          </aside>
        )}
      </div>
    </>
  )
}

function PalantirDataSurface({
  connections,
  selectedConnection,
  onSelectConnection,
}: {
  connections: readonly PalantirDataConnection[]
  selectedConnection: PalantirDataConnection
  onSelectConnection: (connection: PalantirDataConnection) => void
}) {
  const attention = connections.filter(connection => connection.status === 'Attention').length
  return (
    <>
      <div className="ready-page-heading foundry-page-heading">
        <div>
          <div className="ready-eyebrow">Data foundation</div>
          <h1>Data Connection & Pipeline Builder</h1>
          <p>Connect external systems, monitor syncs, transform raw inputs, preview outputs, and deliver governed datasets.</p>
        </div>
        <div className="ready-heading-actions"><button className="ready-button secondary">View builds</button><button className="ready-button primary"><ReadinessIcon name="plus" size={14} />New source</button></div>
      </div>

      <div className="palantir-data-stats">
        <FoundationStat label="Connections" value={String(connections.length)} detail="Inbound and outbound" />
        <FoundationStat label="Healthy" value={String(connections.length - attention)} detail="Automatic retries enabled" tone="green" />
        <FoundationStat label="Managed assets" value={String(connections.reduce((sum, connection) => sum + connection.assets, 0))} detail="Datasets, streams, exports" tone="blue" />
        <FoundationStat label="Needs attention" value={String(attention)} detail="Field media freshness" tone={attention ? 'amber' : 'green'} />
      </div>

      <div className="palantir-data-layout">
        <section className="palantir-connection-list">
          <header><div><h2>Sources</h2><span>Connection health</span></div><button><ReadinessIcon name="refresh" size={14} /></button></header>
          {connections.map(connection => (
            <button key={connection.id} className={connection.id === selectedConnection.id ? 'selected' : ''} onClick={() => onSelectConnection(connection)}>
              <i><ReadinessIcon name={connection.sourceType.includes('S3') ? 'document' : 'database'} size={16} /></i>
              <span><strong>{connection.name}</strong><small>{connection.sourceType} · {connection.assets} assets</small></span>
              <PalantirConnectionStatus status={connection.status} />
            </button>
          ))}
        </section>

        <section className="palantir-connection-detail">
          <header>
            <i><ReadinessIcon name="database" size={19} /></i>
            <div><span className="ready-eyebrow">Source</span><h2>{selectedConnection.name}</h2><p>{selectedConnection.sourceType} · {selectedConnection.direction}</p></div>
            <PalantirConnectionStatus status={selectedConnection.status} />
            <button className="ready-button secondary">Configure</button>
          </header>
          <div className="palantir-connection-metadata">
            <div><span>Last successful sync</span><strong>{selectedConnection.lastSync}</strong><small>{selectedConnection.schedule}</small></div>
            <div><span>Throughput</span><strong>{selectedConnection.throughput}</strong><small>Rolling 24 hours</small></div>
            <div><span>Managed assets</span><strong>{selectedConnection.assets}</strong><small>9 datasets · 3 syncs</small></div>
          </div>
          <div className="palantir-connection-capabilities">
            <h3>Capabilities</h3>
            {['Batch sync', 'Streaming sync', 'Webhook', 'Dataset export'].map((capability, index) => <div key={capability}><ReadinessIcon name={index < 3 ? 'check' : 'arrow-up'} size={14} /><span><strong>{capability}</strong><small>{index < 3 ? 'Configured and healthy' : 'Available on demand'}</small></span><em>{index < 3 ? 'Active' : 'Ready'}</em></div>)}
          </div>
        </section>
      </div>

      <section className="palantir-pipeline-panel">
        <header><div><span className="ready-eyebrow">Pipeline Builder</span><h2>customer_360</h2><p>Main · Saved · 5 nodes · 1 output</p></div><div><button className="ready-button secondary">Preview</button><button className="ready-button primary"><ReadinessIcon name="bolt" size={14} />Build</button></div></header>
        <div className="palantir-pipeline-flow">
          <PipelineNode icon="database" kind="Input" label={selectedConnection.name} detail={selectedConnection.sourceType} />
          <PipelineEdge label="sync" />
          <PipelineNode icon="document" kind="Dataset" label="raw.customer_events" detail="2.8M rows" />
          <PipelineEdge label="transform" active />
          <PipelineNode icon="code" kind="Transform" label="Normalize + join" detail="12 expressions" active />
          <PipelineEdge label="output" />
          <PipelineNode icon="database" kind="Dataset" label="gold.customer_360" detail="6 expectations" />
          <PipelineEdge label="map" />
          <PipelineNode icon="layers" kind="Object type" label="Customer" detail="12,842 objects" />
        </div>
        <footer><span><i />All schema checks passed</span><span>Next scheduled build · 9:10 AM</span><button>Open lineage <ReadinessIcon name="chevron-right" size={12} /></button></footer>
      </section>
    </>
  )
}

function PalantirCodeSurface({
  entries,
  selectedEntry,
  onSelectEntry,
}: {
  entries: readonly PalantirRepositoryEntry[]
  selectedEntry: PalantirRepositoryEntry
  onSelectEntry: (entry: PalantirRepositoryEntry) => void
}) {
  const lines = (selectedEntry.content ?? '# Select a file to inspect its contents').split('\n')
  return (
    <>
      <div className="ready-page-heading foundry-page-heading">
        <div>
          <div className="ready-eyebrow">Code repositories / analytics</div>
          <h1>analytics</h1>
          <p>Author production transforms with branches, previews, tests, proposals, and governed build checks.</p>
        </div>
        <div className="ready-heading-actions"><button className="ready-button secondary">Open in desktop</button><button className="ready-button primary"><ReadinessIcon name="plus" size={14} />New branch</button></div>
      </div>

      <section className="palantir-repository-shell">
        <div className="palantir-repository-tabs"><button className="active">Code</button><button>Branches <span>4</span></button><button>Pull requests <span>1</span></button><button>Checks</button><button>Settings</button></div>
        <div className="palantir-repository-toolbar">
          <button><ReadinessIcon name="graph" size={14} /><span>main</span><ReadinessIcon name="chevron-down" size={12} /></button>
          <span>Protected branch · all checks required</span>
          <div><button><ReadinessIcon name="bolt" size={14} />Preview</button><button><ReadinessIcon name="check" size={14} />Test</button><button className="primary">Propose changes</button></div>
        </div>
        <div className="palantir-repository-body">
          <aside className="palantir-repository-tree">
            <header><strong>Explorer</strong><button><ReadinessIcon name="more" size={14} /></button></header>
            {entries.map(entry => (
              <button
                key={entry.path}
                className={entry.path === selectedEntry.path ? 'selected' : ''}
                style={{ '--palantir-entry-depth': entry.depth } as CSSProperties}
                onClick={() => onSelectEntry(entry)}
              >
                <ReadinessIcon name={entry.kind === 'folder' ? 'chevron-right' : entry.language === 'Markdown' ? 'document' : 'code'} size={13} />
                <span>{entry.name}</span>
                {entry.kind === 'file' && <i />}
              </button>
            ))}
          </aside>

          <section className="palantir-code-editor">
            <header><span><ReadinessIcon name="code" size={13} />{selectedEntry.path}</span><div><small>{selectedEntry.language ?? 'Folder'}</small><button><ReadinessIcon name="more" size={14} /></button></div></header>
            <div className="palantir-code-lines">
              {lines.map((line, index) => <div key={`${selectedEntry.path}-${index}`}><span>{index + 1}</span><code>{line || ' '}</code></div>)}
            </div>
            <footer><span>Ln 1, Col 1</span><span>Spaces: 4</span><span>UTF-8</span><span>{selectedEntry.language ?? 'Plain text'}</span></footer>
          </section>

          <aside className="palantir-repository-helper">
            <section>
              <header><h3>Preview</h3><span>50 rows</span></header>
              <div className="palantir-preview-table">
                <div><span>customer_id</span><span>health_score</span></div>
                <div><span>CUS-01842</span><span>92</span></div>
                <div><span>CUS-01849</span><span>78</span></div>
                <div><span>CUS-01796</span><span>88</span></div>
              </div>
            </section>
            <section>
              <header><h3>Checks</h3><span>3 passed</span></header>
              {['Type check', 'Unit tests · 18', 'Output schema'].map(check => <div className="palantir-check-row" key={check}><ReadinessIcon name="check" size={13} /><span><strong>{check}</strong><small>Passed on main</small></span></div>)}
            </section>
            <section className="palantir-repository-proposal"><ReadinessIcon name="graph" size={16} /><div><strong>1 open proposal</strong><span>feature/customer-risk · ready for review</span></div><button>View</button></section>
          </aside>
        </div>
        <footer className="palantir-repository-status"><span><i />main</span><span>No problems</span><span>Python 3.13</span><span>Build environment healthy</span></footer>
      </section>
    </>
  )
}

function FoundationStat({
  label,
  value,
  detail,
  tone,
}: {
  label: string
  value: string
  detail: string
  tone?: 'blue' | 'green' | 'amber'
}) {
  return <div className={`palantir-foundation-stat ${tone ?? ''}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
}

function PalantirReadinessBadge({ readiness }: { readiness: PalantirCapabilityReadiness }) {
  return <span className={`palantir-readiness-badge ${readiness === 'Showcase ready' ? 'showcase' : 'core'}`}><i />{readiness}</span>
}

function PalantirResourceStatus({ status }: { status: PalantirCompassResource['status'] }) {
  return <span className={`palantir-resource-status ${status.toLowerCase().replace(/\s+/g, '-')}`}><i />{status}</span>
}

function PalantirConnectionStatus({ status }: { status: PalantirDataConnection['status'] }) {
  return <span className={`palantir-connection-status ${status.toLowerCase()}`}><i />{status}</span>
}

function PipelineNode({
  icon,
  kind,
  label,
  detail,
  active,
}: {
  icon: ReadinessIconName
  kind: string
  label: string
  detail: string
  active?: boolean
}) {
  return <button className={`palantir-pipeline-node ${active ? 'active' : ''}`}><i><ReadinessIcon name={icon} size={15} /></i><span><small>{kind}</small><strong>{label}</strong><em>{detail}</em></span><b /></button>
}

function PipelineEdge({ label, active }: { label: string; active?: boolean }) {
  return <span className={`palantir-pipeline-edge ${active ? 'active' : ''}`}><i /><small>{label}</small></span>
}

function capabilityIcon(id: string): ReadinessIconName {
  if (id === 'compass') return 'document'
  if (id === 'data-connection') return 'database'
  if (id === 'pipeline-builder' || id === 'data-lineage') return 'graph'
  if (id === 'code-repositories') return 'code'
  if (id === 'ontology-manager') return 'layers'
  if (id === 'object-explorer-actions') return 'bolt'
  if (id === 'workshop') return 'apps'
  if (id === 'map') return 'location'
  if (id === 'aip') return 'sparkles'
  if (id === 'product-delivery') return 'package'
  if (id === 'governance-admin') return 'shield'
  return 'chart'
}

function resourceIcon(kind: PalantirCompassResourceKind): ReadinessIconName {
  if (kind === 'Project') return 'layers'
  if (kind === 'Dataset') return 'database'
  if (kind === 'Pipeline') return 'graph'
  if (kind === 'Code repository') return 'code'
  if (kind === 'Application') return 'apps'
  if (kind === 'Media set') return 'document'
  return 'chart'
}
