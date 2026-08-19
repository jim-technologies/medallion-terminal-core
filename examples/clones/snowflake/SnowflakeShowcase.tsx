import { useMemo, useState } from 'react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import {
  OperationalShowcaseIcon,
  type OperationalShowcaseIconName,
} from '../shared/OperationalShowcasePrimitives'
import './SnowflakeShowcase.css'

export type SnowflakeShowcaseSection = 'workspace' | 'catalog' | 'monitoring'
export type SnowflakeCatalogKind = 'Table' | 'View' | 'Dynamic table' | 'Stage'
export type SnowflakeQueryStatus = 'Succeeded' | 'Running' | 'Failed' | 'Queued'

export interface SnowflakeWorkspaceFile {
  id: string
  name: string
  kind: 'folder' | 'sql' | 'python'
  depth: number
  modifiedAt: string
}

export interface SnowflakeCatalogObject {
  id: string
  name: string
  kind: SnowflakeCatalogKind
  database: string
  schema: string
  owner: string
  rows: number
  size: string
  status: 'Fresh' | 'Delayed' | 'Draft'
  description: string
  columns: readonly string[]
  tags: readonly string[]
  updatedAt: string
}

export interface SnowflakeQueryRecord {
  id: string
  sql: string
  user: string
  warehouse: string
  status: SnowflakeQueryStatus
  durationMs: number
  scannedBytes: number
  startedAt: string
}

export interface SnowflakeShowcaseProps {
  files?: readonly SnowflakeWorkspaceFile[]
  catalogObjects?: readonly SnowflakeCatalogObject[]
  queries?: readonly SnowflakeQueryRecord[]
  initialSection?: SnowflakeShowcaseSection
  initialFileId?: string
  initialCatalogObjectId?: string
  accountName?: string
  onSelectCatalogObject?: (object: SnowflakeCatalogObject) => void
}

export const SNOWFLAKE_SAMPLE_FILES: readonly SnowflakeWorkspaceFile[] = [
  { id: 'models', name: 'models', kind: 'folder', depth: 0, modifiedAt: 'Today' },
  { id: 'customer-health', name: 'customer_health.sql', kind: 'sql', depth: 1, modifiedAt: '4 min ago' },
  { id: 'revenue-model', name: 'revenue_model.sql', kind: 'sql', depth: 1, modifiedAt: 'Yesterday' },
  { id: 'analysis', name: 'analysis', kind: 'folder', depth: 0, modifiedAt: 'Today' },
  { id: 'retention', name: 'retention_cohorts.sql', kind: 'sql', depth: 1, modifiedAt: '2 hr ago' },
  { id: 'forecast', name: 'forecast.py', kind: 'python', depth: 1, modifiedAt: 'Jul 17' },
  { id: 'readme', name: 'README.md', kind: 'python', depth: 0, modifiedAt: 'Jul 16' },
]

export const SNOWFLAKE_SAMPLE_CATALOG: readonly SnowflakeCatalogObject[] = [
  {
    id: 'analytics.gold.customer_360',
    name: 'CUSTOMER_360',
    kind: 'Dynamic table',
    database: 'ANALYTICS',
    schema: 'GOLD',
    owner: 'DATA_PLATFORM',
    rows: 18_421_905,
    size: '8.4 GB',
    status: 'Fresh',
    description: 'Governed customer profile combining account, product, revenue, and engagement facts.',
    columns: ['CUSTOMER_ID', 'ACCOUNT_NAME', 'ARR', 'HEALTH_SCORE', 'LAST_ACTIVE_AT'],
    tags: ['PII', 'GOLD', 'CUSTOMER'],
    updatedAt: '4 minutes ago',
  },
  {
    id: 'analytics.gold.daily_revenue',
    name: 'DAILY_REVENUE',
    kind: 'View',
    database: 'ANALYTICS',
    schema: 'GOLD',
    owner: 'FINANCE_ANALYTICS',
    rows: 29_840,
    size: '48 MB',
    status: 'Fresh',
    description: 'Daily recurring and usage revenue by account, region, and product family.',
    columns: ['DATE', 'ACCOUNT_ID', 'REGION', 'PRODUCT', 'NET_REVENUE'],
    tags: ['FINANCE', 'CERTIFIED'],
    updatedAt: '11 minutes ago',
  },
  {
    id: 'operations.curated.open_orders',
    name: 'OPEN_ORDERS',
    kind: 'Table',
    database: 'OPERATIONS',
    schema: 'CURATED',
    owner: 'OPERATIONS',
    rows: 83_291,
    size: '312 MB',
    status: 'Delayed',
    description: 'Open fulfillment demand with customer commitment and inventory allocation.',
    columns: ['ORDER_ID', 'CUSTOMER_ID', 'PROMISE_DATE', 'STATUS', 'VALUE'],
    tags: ['OPERATIONS', 'SLA'],
    updatedAt: '38 minutes ago',
  },
  {
    id: 'raw.crm.accounts',
    name: 'ACCOUNTS',
    kind: 'Table',
    database: 'RAW',
    schema: 'CRM',
    owner: 'INGESTION',
    rows: 142_880,
    size: '1.2 GB',
    status: 'Fresh',
    description: 'Source-aligned account records synchronized from the customer system.',
    columns: ['ID', 'NAME', 'OWNER_ID', 'INDUSTRY', 'UPDATED_AT'],
    tags: ['RAW', 'PII'],
    updatedAt: '7 minutes ago',
  },
  {
    id: 'raw.files.field_media',
    name: 'FIELD_MEDIA',
    kind: 'Stage',
    database: 'RAW',
    schema: 'FILES',
    owner: 'FIELD_OPERATIONS',
    rows: 2_481,
    size: '184 GB',
    status: 'Draft',
    description: 'Encrypted landing stage for authorized field photos and inspection video.',
    columns: ['RELATIVE_PATH', 'SIZE', 'LAST_MODIFIED', 'ETAG'],
    tags: ['MEDIA', 'RESTRICTED'],
    updatedAt: '1 hour ago',
  },
]

export const SNOWFLAKE_SAMPLE_QUERIES: readonly SnowflakeQueryRecord[] = [
  { id: '01b5d920', sql: 'SELECT * FROM ANALYTICS.GOLD.CUSTOMER_360', user: 'JUN', warehouse: 'ANALYTICS_WH', status: 'Succeeded', durationMs: 1284, scannedBytes: 84_300_000, startedAt: '11:42:08 AM' },
  { id: '01b5d91f', sql: 'CALL REFRESH_DYNAMIC_TABLES()', user: 'SYSTEM', warehouse: 'TRANSFORM_WH', status: 'Running', durationMs: 18_410, scannedBytes: 1_840_000_000, startedAt: '11:41:52 AM' },
  { id: '01b5d91e', sql: 'MERGE INTO ANALYTICS.GOLD.DAILY_REVENUE', user: 'DBT_CLOUD', warehouse: 'TRANSFORM_WH', status: 'Succeeded', durationMs: 7421, scannedBytes: 642_000_000, startedAt: '11:40:11 AM' },
  { id: '01b5d91d', sql: 'SELECT COUNT(*) FROM RAW.CRM.ACCOUNTS', user: 'MAYA', warehouse: 'ANALYTICS_WH', status: 'Succeeded', durationMs: 842, scannedBytes: 18_400_000, startedAt: '11:38:47 AM' },
  { id: '01b5d91c', sql: 'COPY INTO RAW.FILES.FIELD_MEDIA', user: 'INGESTION_SVC', warehouse: 'INGEST_WH', status: 'Failed', durationMs: 3901, scannedBytes: 0, startedAt: '11:34:05 AM' },
  { id: '01b5d91b', sql: 'SELECT * FROM OPERATIONS.CURATED.OPEN_ORDERS', user: 'JUN', warehouse: 'ANALYTICS_WH', status: 'Queued', durationMs: 0, scannedBytes: 0, startedAt: '11:32:29 AM' },
]

const SNOWFLAKE_RESULT_ROWS = [
  { account: 'Northwind Health', segment: 'Enterprise', arr: '$486,000', health: 94, active: '2 min ago' },
  { account: 'Cascade Retail', segment: 'Growth', arr: '$218,400', health: 87, active: '18 min ago' },
  { account: 'Brightpath Energy', segment: 'Enterprise', arr: '$624,000', health: 82, active: '1 hr ago' },
  { account: 'Blue Harbor Logistics', segment: 'Growth', arr: '$148,800', health: 71, active: 'Yesterday' },
  { account: 'Atlas Design Co.', segment: 'Starter', arr: '$42,000', health: 66, active: '2 days ago' },
] as const

const SNOWFLAKE_NAV: readonly {
  id: SnowflakeShowcaseSection
  label: string
  eyebrow: string
  icon: OperationalShowcaseIconName
}[] = [
  { id: 'workspace', label: 'Workspaces', eyebrow: 'Projects', icon: 'code' },
  { id: 'catalog', label: 'Database Explorer', eyebrow: 'Catalog', icon: 'database' },
  { id: 'monitoring', label: 'Query History', eyebrow: 'Monitoring', icon: 'activity' },
]

export function selectSnowflakeCatalogObjects(
  objects: readonly SnowflakeCatalogObject[],
  query = '',
  kind?: SnowflakeCatalogKind,
): SnowflakeCatalogObject[] {
  const normalized = query.trim().toLowerCase()
  return objects.filter(object => {
    if (kind && object.kind !== kind) return false
    if (!normalized) return true
    return [
      object.name,
      object.kind,
      object.database,
      object.schema,
      object.owner,
      object.description,
      ...object.tags,
    ].join(' ').toLowerCase().includes(normalized)
  })
}

export function snowflakeQuerySummary(queries: readonly SnowflakeQueryRecord[]) {
  const finished = queries.filter(query => query.durationMs > 0)
  return {
    total: queries.length,
    succeeded: queries.filter(query => query.status === 'Succeeded').length,
    running: queries.filter(query => query.status === 'Running').length,
    failed: queries.filter(query => query.status === 'Failed').length,
    averageDurationMs: finished.length === 0
      ? 0
      : Math.round(finished.reduce((sum, query) => sum + query.durationMs, 0) / finished.length),
  }
}

function formatBytes(value: number): string {
  if (value === 0) return '—'
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} GB`
  return `${(value / 1_000_000).toFixed(1)} MB`
}

function snowflakeColumnType(column: string): string {
  if (/(?:_AT|_DATE|DATE)$/.test(column)) return 'TIMESTAMP'
  if (/(?:ARR|SCORE|VALUE|SIZE|COUNT)$/.test(column)) return 'NUMBER'
  if (/(?:_ID|NAME|STATUS|REGION|PRODUCT)$/.test(column)) return 'VARCHAR'
  return 'VARIANT'
}

function SnowflakeBrand() {
  return (
    <div className="snow-brand">
      <span className="snow-brand-mark" aria-hidden="true">✣</span>
      <span>snowflake</span>
    </div>
  )
}

function SnowflakeWorkspace({
  files,
  selectedFileId,
  onSelectFile,
}: {
  files: readonly SnowflakeWorkspaceFile[]
  selectedFileId: string
  onSelectFile: (id: string) => void
}) {
  const [resultMode, setResultMode] = useState<'table' | 'chart'>('table')
  const [runStatus, setRunStatus] = useState('Query completed · 1.28s · 5 rows')

  return (
    <section className="snow-workspace">
      <header className="snow-pagebar">
        <div>
          <span className="snow-breadcrumb">Projects / Workspaces /</span>
          <strong>Revenue intelligence</strong>
        </div>
        <div className="snow-page-actions">
          <button type="button"><OperationalShowcaseIcon name="link" size={15} /> main</button>
          <button type="button"><OperationalShowcaseIcon name="people" size={15} /> Share</button>
          <button className="snow-primary-button" type="button" onClick={() => setRunStatus('Query completed just now · 1.28s · 5 rows')}>
            <OperationalShowcaseIcon name="bolt" size={15} /> Run
          </button>
        </div>
      </header>

      <div className="snow-contextbar">
        <button type="button">ANALYST <OperationalShowcaseIcon name="chevron-down" size={13} /></button>
        <button type="button"><span className="snow-live-dot" /> ANALYTICS_WH · X-Small <OperationalShowcaseIcon name="chevron-down" size={13} /></button>
        <span>ANALYTICS / GOLD</span>
        <span className="snow-context-spacer" />
        <button type="button"><OperationalShowcaseIcon name="search" size={14} /> Find</button>
        <button type="button" aria-label="Workspace options"><OperationalShowcaseIcon name="more" size={14} /></button>
      </div>

      <div className="snow-workspace-grid">
        <aside className="snow-file-explorer">
          <div className="snow-pane-tabs">
            <button className="active" type="button">Files</button>
            <button type="button">Database</button>
          </div>
          <div className="snow-explorer-heading">
            <strong>Revenue intelligence</strong>
            <span>
              <button type="button" aria-label="Add file"><OperationalShowcaseIcon name="plus" size={14} /></button>
              <button type="button" aria-label="More workspace actions"><OperationalShowcaseIcon name="more" size={14} /></button>
            </span>
          </div>
          <div className="snow-file-tree">
            {files.map(file => (
              <button
                className={`${file.id === selectedFileId ? 'active' : ''} snow-file-${file.kind}`}
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                style={{ paddingLeft: 12 + file.depth * 18 }}
                type="button"
              >
                <OperationalShowcaseIcon
                  name={file.kind === 'folder' ? 'chevron-right' : file.kind === 'sql' ? 'database' : 'code'}
                  size={14}
                />
                <span>{file.name}</span>
                {file.id === selectedFileId ? <i aria-label="Unsaved changes" /> : null}
              </button>
            ))}
          </div>
          <div className="snow-explorer-footer">
            <OperationalShowcaseIcon name="link" size={14} />
            <span>Git connected</span>
            <strong>main</strong>
          </div>
        </aside>

        <div className="snow-editor-stack">
          <div className="snow-editor-tabs">
            <button className="active" type="button">
              <OperationalShowcaseIcon name="database" size={13} />
              customer_health.sql <span>●</span>
            </button>
            <button type="button">revenue_model.sql</button>
            <button className="snow-tab-plus" type="button" aria-label="New tab">+</button>
          </div>
          <div className="snow-code-editor" aria-label="SQL editor">
            <ol>
              <li><span className="snow-sql-keyword">WITH</span> account_usage <span className="snow-sql-keyword">AS</span> (</li>
              <li>  <span className="snow-sql-keyword">SELECT</span> account_id,</li>
              <li>         <span className="snow-sql-function">COUNT</span>(<span className="snow-sql-keyword">DISTINCT</span> user_id) <span className="snow-sql-keyword">AS</span> active_users,</li>
              <li>         <span className="snow-sql-function">MAX</span>(event_at) <span className="snow-sql-keyword">AS</span> last_active_at</li>
              <li>  <span className="snow-sql-keyword">FROM</span> PRODUCT.CURATED.USAGE_EVENTS</li>
              <li>  <span className="snow-sql-keyword">WHERE</span> event_at &gt;= <span className="snow-sql-string">DATEADD</span>(day, -30, CURRENT_DATE)</li>
              <li>  <span className="snow-sql-keyword">GROUP BY</span> 1</li>
              <li>)</li>
              <li><span className="snow-sql-keyword">SELECT</span> c.account_name, c.segment, c.arr,</li>
              <li>       c.health_score, u.last_active_at</li>
              <li><span className="snow-sql-keyword">FROM</span> ANALYTICS.GOLD.CUSTOMER_360 c</li>
              <li><span className="snow-sql-keyword">JOIN</span> account_usage u <span className="snow-sql-keyword">USING</span> (account_id)</li>
              <li><span className="snow-sql-keyword">ORDER BY</span> c.arr <span className="snow-sql-keyword">DESC</span>;</li>
            </ol>
            <button className="snow-copilot-chip" type="button">
              <OperationalShowcaseIcon name="sparkles" size={14} />
              Explain or improve
            </button>
          </div>

          <div className="snow-results">
            <div className="snow-results-toolbar">
              <div>
                <button className={resultMode === 'table' ? 'active' : ''} onClick={() => setResultMode('table')} type="button">Results</button>
                <button className={resultMode === 'chart' ? 'active' : ''} onClick={() => setResultMode('chart')} type="button">Chart</button>
              </div>
              <span>{runStatus}</span>
              <button type="button"><OperationalShowcaseIcon name="download" size={14} /> Download</button>
            </div>
            {resultMode === 'table' ? (
              <div className="snow-result-table-wrap">
                <table className="snow-result-table">
                  <thead>
                    <tr><th>ACCOUNT_NAME</th><th>SEGMENT</th><th>ARR</th><th>HEALTH_SCORE</th><th>LAST_ACTIVE_AT</th></tr>
                  </thead>
                  <tbody>
                    {SNOWFLAKE_RESULT_ROWS.map(row => (
                      <tr key={row.account}>
                        <td>{row.account}</td><td>{row.segment}</td><td>{row.arr}</td>
                        <td><span className={`snow-score snow-score-${row.health >= 80 ? 'good' : 'watch'}`}>{row.health}</span></td>
                        <td>{row.active}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="snow-result-chart">
                {SNOWFLAKE_RESULT_ROWS.map((row, index) => (
                  <div key={row.account}>
                    <span>{row.account}</span>
                    <i style={{ width: `${92 - index * 13}%` }} />
                    <strong>{row.arr}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="snow-query-history" aria-label="Query history">
          <div><strong>Query history</strong><button type="button" aria-label="Close query history"><OperationalShowcaseIcon name="close" size={14} /></button></div>
          <button className="active" type="button">
            <span className="snow-status-dot succeeded" />
            <span><strong>customer_health.sql</strong><small>1.28s · 5 rows</small></span>
            <time>Now</time>
          </button>
          <button type="button">
            <span className="snow-status-dot succeeded" />
            <span><strong>revenue_model.sql</strong><small>4.72s · 365 rows</small></span>
            <time>18m</time>
          </button>
          <button type="button">
            <span className="snow-status-dot failed" />
            <span><strong>retention_cohorts.sql</strong><small>SQL compilation error</small></span>
            <time>2h</time>
          </button>
        </aside>
      </div>
    </section>
  )
}

function SnowflakeCatalog({
  objects,
  selectedId,
  onSelect,
}: {
  objects: readonly SnowflakeCatalogObject[]
  selectedId: string
  onSelect: (object: SnowflakeCatalogObject) => void
}) {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<SnowflakeCatalogKind | undefined>()
  const filtered = useMemo(
    () => selectSnowflakeCatalogObjects(objects, query, kind),
    [kind, objects, query],
  )
  const selected = objects.find(object => object.id === selectedId) ?? filtered[0] ?? objects[0]

  return (
    <section className="snow-catalog">
      <header className="snow-section-header">
        <div><span>Horizon Catalog</span><h1>Database Explorer</h1><p>Discover, understand, and govern account data.</p></div>
        <button className="snow-primary-button" type="button"><OperationalShowcaseIcon name="plus" size={15} /> Create</button>
      </header>
      <div className="snow-catalog-toolbar">
        <label><OperationalShowcaseIcon name="search" size={15} /><input onChange={event => setQuery(event.target.value)} placeholder="Search databases and objects" value={query} /></label>
        <select aria-label="Object type" onChange={event => setKind(event.target.value ? event.target.value as SnowflakeCatalogKind : undefined)} value={kind ?? ''}>
          <option value="">All object types</option>
          <option value="Table">Tables</option>
          <option value="View">Views</option>
          <option value="Dynamic table">Dynamic tables</option>
          <option value="Stage">Stages</option>
        </select>
        <span>{filtered.length} objects</span>
      </div>
      <div className="snow-catalog-layout">
        <div className="snow-object-list">
          <div className="snow-object-list-header"><span>Name</span><span>Type</span><span>Owner</span><span>Updated</span></div>
          {filtered.map(object => (
            <button className={object.id === selected?.id ? 'active' : ''} key={object.id} onClick={() => onSelect(object)} type="button">
              <span className="snow-object-name">
                <i><OperationalShowcaseIcon name={object.kind === 'Stage' ? 'inventory' : 'database'} size={15} /></i>
                <span><strong>{object.name}</strong><small>{object.database}.{object.schema}</small></span>
              </span>
              <span>{object.kind}</span><span>{object.owner}</span><time>{object.updatedAt}</time>
            </button>
          ))}
          {filtered.length === 0 ? <div className="snow-empty">No catalog objects match this search.</div> : null}
        </div>
        {selected ? (
          <aside className="snow-object-detail" aria-label="Object details">
            <div className="snow-object-detail-title">
              <i><OperationalShowcaseIcon name="database" size={20} /></i>
              <div><span>{selected.kind}</span><h2>{selected.name}</h2></div>
              <button type="button" aria-label="Object options"><OperationalShowcaseIcon name="more" size={16} /></button>
            </div>
            <p>{selected.description}</p>
            <div className="snow-detail-status">
              <span><i className={`snow-freshness ${selected.status.toLowerCase()}`} /> {selected.status}</span>
              <span>{selected.rows.toLocaleString()} rows</span>
              <span>{selected.size}</span>
            </div>
            <dl>
              <div><dt>Fully qualified name</dt><dd>{selected.database}.{selected.schema}.{selected.name}</dd></div>
              <div><dt>Owner</dt><dd>{selected.owner}</dd></div>
              <div><dt>Last refreshed</dt><dd>{selected.updatedAt}</dd></div>
            </dl>
            <h3>Columns <span>{selected.columns.length}</span></h3>
            <div className="snow-column-list">
              {selected.columns.map(column => (
                <div key={column}><OperationalShowcaseIcon name="layers" size={13} /><strong>{column}</strong><span>{snowflakeColumnType(column)}</span></div>
              ))}
            </div>
            <h3>Tags</h3>
            <div className="snow-tag-list">{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
            <button className="snow-detail-action" type="button"><OperationalShowcaseIcon name="code" size={14} /> Open in workspace</button>
          </aside>
        ) : null}
      </div>
    </section>
  )
}

function SnowflakeMonitoring({ queries }: { queries: readonly SnowflakeQueryRecord[] }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<SnowflakeQueryStatus | undefined>()
  const summary = snowflakeQuerySummary(queries)
  const normalized = query.trim().toLowerCase()
  const filtered = queries.filter(record => (
    (!status || record.status === status)
    && (!normalized || `${record.sql} ${record.user} ${record.warehouse}`.toLowerCase().includes(normalized))
  ))

  return (
    <section className="snow-monitoring">
      <header className="snow-section-header">
        <div><span>Monitoring</span><h1>Query History</h1><p>Inspect execution, performance, and warehouse activity.</p></div>
        <button type="button"><OperationalShowcaseIcon name="refresh" size={15} /> Refresh</button>
      </header>
      <div className="snow-query-stats">
        <article><span>Total queries</span><strong>{summary.total}</strong><small>Last 60 minutes</small></article>
        <article><span>Successful</span><strong>{summary.succeeded}</strong><small className="positive">Healthy execution</small></article>
        <article><span>Running now</span><strong>{summary.running}</strong><small>Across 3 warehouses</small></article>
        <article><span>Average duration</span><strong>{(summary.averageDurationMs / 1000).toFixed(1)}s</strong><small>Completed queries</small></article>
      </div>
      <div className="snow-monitor-toolbar">
        <label><OperationalShowcaseIcon name="search" size={15} /><input onChange={event => setQuery(event.target.value)} placeholder="Search SQL, user, or warehouse" value={query} /></label>
        <select aria-label="Query status" onChange={event => setStatus(event.target.value ? event.target.value as SnowflakeQueryStatus : undefined)} value={status ?? ''}>
          <option value="">All statuses</option>
          <option value="Succeeded">Succeeded</option>
          <option value="Running">Running</option>
          <option value="Failed">Failed</option>
          <option value="Queued">Queued</option>
        </select>
        <button type="button"><OperationalShowcaseIcon name="calendar" size={14} /> Last hour</button>
      </div>
      <div className="snow-query-table-wrap">
        <table className="snow-query-table">
          <thead><tr><th>Status</th><th>Query</th><th>User</th><th>Warehouse</th><th>Duration</th><th>Bytes scanned</th><th>Started</th></tr></thead>
          <tbody>
            {filtered.map(record => (
              <tr key={record.id}>
                <td><span className={`snow-query-status ${record.status.toLowerCase()}`}><i />{record.status}</span></td>
                <td><strong>{record.sql}</strong><small>{record.id}</small></td>
                <td>{record.user}</td><td>{record.warehouse}</td>
                <td>{record.durationMs === 0 ? '—' : `${(record.durationMs / 1000).toFixed(2)}s`}</td>
                <td>{formatBytes(record.scannedBytes)}</td><td>{record.startedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function SnowflakeShowcase({
  files = SNOWFLAKE_SAMPLE_FILES,
  catalogObjects = SNOWFLAKE_SAMPLE_CATALOG,
  queries = SNOWFLAKE_SAMPLE_QUERIES,
  initialSection = 'workspace',
  initialFileId = 'customer-health',
  initialCatalogObjectId = 'analytics.gold.customer_360',
  accountName = CLONE_DEMO_IDENTITY.company,
  onSelectCatalogObject,
}: SnowflakeShowcaseProps) {
  const [section, setSection] = useState<SnowflakeShowcaseSection>(initialSection)
  const [selectedFileId, setSelectedFileId] = useState(initialFileId)
  const [selectedCatalogObjectId, setSelectedCatalogObjectId] = useState(initialCatalogObjectId)

  const selectCatalogObject = (object: SnowflakeCatalogObject) => {
    setSelectedCatalogObjectId(object.id)
    onSelectCatalogObject?.(object)
  }

  return (
    <div className="snowflake-showcase">
      <aside className="snow-sidebar" aria-label="Snowflake navigation">
        <SnowflakeBrand />
        <button className="snow-global-search" type="button"><OperationalShowcaseIcon name="search" size={16} /><span>Search</span><kbd>⌘ K</kbd></button>
        <nav aria-label="Snowflake sections">
          <button type="button"><OperationalShowcaseIcon name="home" size={17} /><span>Home</span></button>
          {SNOWFLAKE_NAV.map(item => (
            <div className="snow-nav-group" key={item.id}>
              <small>{item.eyebrow}</small>
              <button className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)} type="button">
                <OperationalShowcaseIcon name={item.icon} size={17} /><span>{item.label}</span>
              </button>
            </div>
          ))}
          <div className="snow-nav-group">
            <small>Platform</small>
            <button type="button"><OperationalShowcaseIcon name="download" size={17} /><span>Ingestion</span></button>
            <button type="button"><OperationalShowcaseIcon name="graph" size={17} /><span>Transformation</span></button>
            <button type="button"><OperationalShowcaseIcon name="sparkles" size={17} /><span>AI &amp; ML</span></button>
            <button type="button"><OperationalShowcaseIcon name="cart" size={17} /><span>Marketplace</span></button>
          </div>
        </nav>
        <div className="snow-account">
          <span>{CLONE_DEMO_IDENTITY.user.slice(0, 1)}</span>
          <div><strong>{CLONE_DEMO_IDENTITY.user}</strong><small>ACCOUNTADMIN</small></div>
          <OperationalShowcaseIcon name="chevron-down" size={14} />
        </div>
      </aside>
      <div className="snow-shell">
        <header className="snow-topbar">
          <div><strong>{accountName}</strong><span>ACME_US_WEST</span></div>
          <span className="snow-topbar-spacer" />
          <button type="button" aria-label="Help"><OperationalShowcaseIcon name="help" size={17} /></button>
          <button type="button" aria-label="Notifications"><OperationalShowcaseIcon name="bell" size={17} /><i /></button>
          <button className="snow-copilot-button" type="button"><OperationalShowcaseIcon name="sparkles" size={15} /> Copilot</button>
        </header>
        <main>
          {section === 'workspace' ? (
            <SnowflakeWorkspace files={files} onSelectFile={setSelectedFileId} selectedFileId={selectedFileId} />
          ) : null}
          {section === 'catalog' ? (
            <SnowflakeCatalog objects={catalogObjects} onSelect={selectCatalogObject} selectedId={selectedCatalogObjectId} />
          ) : null}
          {section === 'monitoring' ? <SnowflakeMonitoring queries={queries} /> : null}
        </main>
      </div>
    </div>
  )
}
