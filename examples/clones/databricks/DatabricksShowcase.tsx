import { useMemo, useState } from 'react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import {
  OperationalShowcaseIcon,
  type OperationalShowcaseIconName,
} from '../shared/OperationalShowcasePrimitives'
import './DatabricksShowcase.css'

export type DatabricksShowcaseSection = 'notebook' | 'sql' | 'jobs' | 'catalog'
export type DatabricksJobStatus = 'Succeeded' | 'Running' | 'Failed' | 'Queued'
export type DatabricksAssetKind = 'Table' | 'View' | 'Model' | 'Volume'

export interface DatabricksNotebookCell {
  id: string
  language: 'python' | 'sql' | 'markdown'
  source: readonly string[]
  executionCount?: number
  duration?: string
}

export interface DatabricksJob {
  id: string
  name: string
  owner: string
  trigger: string
  status: DatabricksJobStatus
  durationSeconds: number
  lastRun: string
  tasks: readonly {
    id: string
    name: string
    type: 'Notebook' | 'Pipeline' | 'SQL' | 'Python'
    status: DatabricksJobStatus
    duration: string
  }[]
}

export interface DatabricksCatalogAsset {
  id: string
  name: string
  kind: DatabricksAssetKind
  catalog: string
  schema: string
  owner: string
  description: string
  format: string
  rows: number
  updatedAt: string
  quality: 'Certified' | 'Healthy' | 'Warning'
  columns: readonly { name: string; type: string; comment: string }[]
  tags: readonly string[]
}

export interface DatabricksShowcaseProps {
  cells?: readonly DatabricksNotebookCell[]
  jobs?: readonly DatabricksJob[]
  catalogAssets?: readonly DatabricksCatalogAsset[]
  initialSection?: DatabricksShowcaseSection
  initialJobId?: string
  initialCatalogAssetId?: string
  workspaceName?: string
  onSelectJob?: (job: DatabricksJob) => void
}

export const DATABRICKS_SAMPLE_CELLS: readonly DatabricksNotebookCell[] = [
  {
    id: 'intro',
    language: 'markdown',
    source: ['# Customer health intelligence', 'Build the governed feature view used by retention and account teams.'],
  },
  {
    id: 'load',
    language: 'python',
    source: [
      'from pyspark.sql import functions as F',
      '',
      'customers = spark.table("main.gold.customer_360")',
      'usage = spark.table("main.silver.product_usage")',
      'display(customers.limit(5))',
    ],
    executionCount: 12,
    duration: '1.4s',
  },
  {
    id: 'features',
    language: 'python',
    source: [
      'health_features = (',
      '  customers.join(usage, "account_id")',
      '    .groupBy("account_id", "account_name", "arr")',
      '    .agg(F.countDistinct("active_user_id").alias("active_users"),',
      '         F.max("event_at").alias("last_active_at"))',
      ')',
      'display(health_features.orderBy(F.desc("arr")))',
    ],
    executionCount: 13,
    duration: '2.8s',
  },
]

export const DATABRICKS_SAMPLE_JOBS: readonly DatabricksJob[] = [
  {
    id: 'customer-health-refresh',
    name: 'Customer health refresh',
    owner: 'Jun',
    trigger: 'Every hour',
    status: 'Succeeded',
    durationSeconds: 284,
    lastRun: '11 minutes ago',
    tasks: [
      { id: 'ingest', name: 'Ingest product usage', type: 'Pipeline', status: 'Succeeded', duration: '1m 42s' },
      { id: 'features', name: 'Build health features', type: 'Notebook', status: 'Succeeded', duration: '2m 06s' },
      { id: 'publish', name: 'Publish gold tables', type: 'SQL', status: 'Succeeded', duration: '56s' },
    ],
  },
  {
    id: 'revenue-forecast',
    name: 'Revenue forecast training',
    owner: 'Maya Chen',
    trigger: 'Mon 6:00 AM',
    status: 'Running',
    durationSeconds: 1098,
    lastRun: 'Running now',
    tasks: [
      { id: 'prepare', name: 'Prepare training set', type: 'Notebook', status: 'Succeeded', duration: '7m 18s' },
      { id: 'train', name: 'Train forecast model', type: 'Python', status: 'Running', duration: '11m 00s' },
      { id: 'register', name: 'Register champion', type: 'Python', status: 'Queued', duration: '—' },
    ],
  },
  {
    id: 'orders-stream',
    name: 'Orders streaming pipeline',
    owner: 'Data Platform',
    trigger: 'Continuous',
    status: 'Succeeded',
    durationSeconds: 62,
    lastRun: '2 minutes ago',
    tasks: [
      { id: 'bronze', name: 'Bronze ingest', type: 'Pipeline', status: 'Succeeded', duration: '24s' },
      { id: 'silver', name: 'Silver quality', type: 'Pipeline', status: 'Succeeded', duration: '21s' },
      { id: 'gold', name: 'Gold aggregates', type: 'SQL', status: 'Succeeded', duration: '17s' },
    ],
  },
  {
    id: 'media-index',
    name: 'Field media indexing',
    owner: 'Field Operations',
    trigger: 'Every 15 minutes',
    status: 'Failed',
    durationSeconds: 41,
    lastRun: '28 minutes ago',
    tasks: [
      { id: 'discover', name: 'Discover uploads', type: 'Python', status: 'Succeeded', duration: '19s' },
      { id: 'metadata', name: 'Extract metadata', type: 'Notebook', status: 'Failed', duration: '22s' },
      { id: 'publish-index', name: 'Publish search index', type: 'SQL', status: 'Queued', duration: '—' },
    ],
  },
]

export const DATABRICKS_SAMPLE_CATALOG: readonly DatabricksCatalogAsset[] = [
  {
    id: 'main.gold.customer_360',
    name: 'customer_360',
    kind: 'Table',
    catalog: 'main',
    schema: 'gold',
    owner: 'data-platform',
    description: 'Certified customer profile for operational reporting, retention models, and account workflows.',
    format: 'Delta',
    rows: 18_421_905,
    updatedAt: '4 minutes ago',
    quality: 'Certified',
    columns: [
      { name: 'customer_id', type: 'string', comment: 'Stable customer identifier' },
      { name: 'account_name', type: 'string', comment: 'Canonical account display name' },
      { name: 'arr', type: 'decimal(18,2)', comment: 'Annual recurring revenue' },
      { name: 'health_score', type: 'double', comment: 'Governed 0–100 health score' },
      { name: 'last_active_at', type: 'timestamp', comment: 'Most recent product activity' },
    ],
    tags: ['certified', 'pii', 'customer'],
  },
  {
    id: 'main.gold.daily_revenue',
    name: 'daily_revenue',
    kind: 'View',
    catalog: 'main',
    schema: 'gold',
    owner: 'finance-analytics',
    description: 'Daily net revenue by account, product, and operating region.',
    format: 'Delta',
    rows: 29_840,
    updatedAt: '12 minutes ago',
    quality: 'Healthy',
    columns: [
      { name: 'date', type: 'date', comment: 'Revenue recognition date' },
      { name: 'account_id', type: 'string', comment: 'Account identifier' },
      { name: 'net_revenue', type: 'decimal(18,2)', comment: 'Net recognized revenue' },
    ],
    tags: ['finance', 'gold'],
  },
  {
    id: 'main.ml.churn_risk',
    name: 'churn_risk',
    kind: 'Model',
    catalog: 'main',
    schema: 'ml',
    owner: 'retention-ml',
    description: 'Production champion model for 90-day customer churn probability.',
    format: 'MLflow',
    rows: 0,
    updatedAt: 'Yesterday',
    quality: 'Certified',
    columns: [
      { name: 'account_id', type: 'string', comment: 'Scored account' },
      { name: 'risk_probability', type: 'double', comment: 'Calibrated churn probability' },
    ],
    tags: ['production', 'classification'],
  },
  {
    id: 'main.media.field_assets',
    name: 'field_assets',
    kind: 'Volume',
    catalog: 'main',
    schema: 'media',
    owner: 'field-operations',
    description: 'Governed photos, video, and derived media from field inspections.',
    format: 'Volume',
    rows: 2481,
    updatedAt: '1 hour ago',
    quality: 'Warning',
    columns: [
      { name: 'path', type: 'string', comment: 'Authorized volume path' },
      { name: 'media_type', type: 'string', comment: 'Normalized content type' },
    ],
    tags: ['media', 'restricted'],
  },
]

const DATABRICKS_SQL_ROWS = [
  { account: 'Northwind Health', arr: '$486,000', activeUsers: '1,284', score: '94', risk: 'Low' },
  { account: 'Cascade Retail', arr: '$218,400', activeUsers: '642', score: '87', risk: 'Low' },
  { account: 'Brightpath Energy', arr: '$624,000', activeUsers: '918', score: '82', risk: 'Medium' },
  { account: 'Blue Harbor Logistics', arr: '$148,800', activeUsers: '284', score: '71', risk: 'Medium' },
  { account: 'Atlas Design Co.', arr: '$42,000', activeUsers: '62', score: '66', risk: 'High' },
] as const

const DATABRICKS_NAV: readonly {
  id: DatabricksShowcaseSection
  label: string
  group: string
  icon: OperationalShowcaseIconName
}[] = [
  { id: 'notebook', label: 'Workspace', group: 'Build', icon: 'code' },
  { id: 'sql', label: 'SQL Editor', group: 'Lakehouse', icon: 'database' },
  { id: 'jobs', label: 'Jobs & Pipelines', group: 'Data Engineering', icon: 'graph' },
  { id: 'catalog', label: 'Catalog', group: 'Govern', icon: 'layers' },
]

export function selectDatabricksJobs(
  jobs: readonly DatabricksJob[],
  query = '',
  status?: DatabricksJobStatus,
): DatabricksJob[] {
  const normalized = query.trim().toLowerCase()
  return jobs.filter(job => {
    if (status && job.status !== status) return false
    if (!normalized) return true
    return [job.name, job.owner, job.trigger, ...job.tasks.map(task => task.name)]
      .join(' ')
      .toLowerCase()
      .includes(normalized)
  })
}

export function databricksJobSummary(jobs: readonly DatabricksJob[]) {
  const finished = jobs.filter(job => job.status !== 'Running' && job.durationSeconds > 0)
  return {
    total: jobs.length,
    healthy: jobs.filter(job => job.status === 'Succeeded').length,
    running: jobs.filter(job => job.status === 'Running').length,
    failed: jobs.filter(job => job.status === 'Failed').length,
    averageDurationSeconds: finished.length === 0
      ? 0
      : Math.round(finished.reduce((sum, job) => sum + job.durationSeconds, 0) / finished.length),
  }
}

export function selectDatabricksCatalogAssets(
  assets: readonly DatabricksCatalogAsset[],
  query = '',
  kind?: DatabricksAssetKind,
): DatabricksCatalogAsset[] {
  const normalized = query.trim().toLowerCase()
  return assets.filter(asset => {
    if (kind && asset.kind !== kind) return false
    if (!normalized) return true
    return [
      asset.name,
      asset.kind,
      asset.catalog,
      asset.schema,
      asset.owner,
      asset.description,
      ...asset.tags,
    ].join(' ').toLowerCase().includes(normalized)
  })
}

function DatabricksBrand() {
  return (
    <div className="dbx-brand">
      <span><OperationalShowcaseIcon name="layers" size={22} /></span>
      <strong>databricks</strong>
    </div>
  )
}

function DatabricksNotebook({ cells }: { cells: readonly DatabricksNotebookCell[] }) {
  const [assistantOpen, setAssistantOpen] = useState(true)
  const [runMessage, setRunMessage] = useState('All cells succeeded · 4.2s')

  return (
    <section className={`dbx-notebook ${assistantOpen ? 'with-assistant' : ''}`}>
      <header className="dbx-editor-header">
        <div>
          <span>Workspace / Users / {CLONE_DEMO_IDENTITY.email} /</span>
          <strong>Customer health intelligence</strong>
        </div>
        <div className="dbx-editor-actions">
          <button type="button"><span className="dbx-live-dot" /> Serverless <OperationalShowcaseIcon name="chevron-down" size={13} /></button>
          <button type="button"><OperationalShowcaseIcon name="people" size={14} /> Share</button>
          <button className="dbx-run-button" onClick={() => setRunMessage('All cells succeeded just now · 4.2s')} type="button"><OperationalShowcaseIcon name="bolt" size={14} /> Run all</button>
          <button className={assistantOpen ? 'active' : ''} onClick={() => setAssistantOpen(value => !value)} type="button"><OperationalShowcaseIcon name="sparkles" size={14} /> Assistant</button>
        </div>
      </header>
      <div className="dbx-editor-tabs">
        <button className="active" type="button"><OperationalShowcaseIcon name="document" size={13} /> Customer health intelligence <span>×</span></button>
        <button type="button"><OperationalShowcaseIcon name="document" size={13} /> Revenue forecast</button>
        <button type="button" aria-label="New notebook tab">+</button>
        <span>{runMessage}</span>
      </div>
      <div className="dbx-notebook-body">
        <aside className="dbx-workspace-tree" aria-label="Workspace files">
          <div><strong>Workspace</strong><button aria-label="New workspace item" type="button"><OperationalShowcaseIcon name="plus" size={14} /></button></div>
          <label><OperationalShowcaseIcon name="search" size={14} /><input aria-label="Filter workspace" placeholder="Filter" /></label>
          <button type="button"><OperationalShowcaseIcon name="chevron-down" size={13} /><strong>Jim Technologies</strong></button>
          <button type="button"><OperationalShowcaseIcon name="chevron-down" size={13} /><span>Shared</span></button>
          <button className="active" type="button"><OperationalShowcaseIcon name="document" size={13} /><span>Customer health intelligence</span></button>
          <button type="button"><OperationalShowcaseIcon name="document" size={13} /><span>Revenue forecast</span></button>
          <button type="button"><OperationalShowcaseIcon name="chevron-right" size={13} /><span>Production pipelines</span></button>
          <button type="button"><OperationalShowcaseIcon name="chevron-right" size={13} /><span>Experiments</span></button>
          <div className="dbx-repo-state"><OperationalShowcaseIcon name="link" size={13} /><span>analytics-platform</span><strong>main</strong></div>
        </aside>
        <div className="dbx-cell-canvas">
          <div className="dbx-notebook-title">
            <div><span>Python</span><span>Default language</span></div>
            <button aria-label="Notebook options" type="button"><OperationalShowcaseIcon name="more" size={15} /></button>
          </div>
          {cells.map(cell => (
            <article className={`dbx-cell dbx-cell-${cell.language}`} key={cell.id}>
              <div className="dbx-cell-rail">
                <button type="button" aria-label={`Run ${cell.id}`}><OperationalShowcaseIcon name="bolt" size={13} /></button>
                {cell.executionCount ? <span>[{cell.executionCount}]</span> : null}
              </div>
              <div className="dbx-cell-content">
                {cell.language === 'markdown' ? (
                  <div className="dbx-markdown-cell">
                    <h1>{cell.source[0]?.replace(/^#\s*/, '')}</h1>
                    <p>{cell.source[1]}</p>
                  </div>
                ) : (
                  <pre>{cell.source.map((line, index) => (
                    <span key={`${cell.id}-${index}`}>
                      <i>{index + 1}</i>
                      <code>{line || ' '}</code>
                    </span>
                  ))}</pre>
                )}
                {cell.id === 'load' ? (
                  <div className="dbx-cell-table">
                    <div><strong>account_name</strong><strong>arr</strong><strong>health_score</strong></div>
                    <div><span>Northwind Health</span><span>486000</span><span>94</span></div>
                    <div><span>Cascade Retail</span><span>218400</span><span>87</span></div>
                    <div><span>Brightpath Energy</span><span>624000</span><span>82</span></div>
                  </div>
                ) : null}
                {cell.id === 'features' ? (
                  <div className="dbx-cell-chart">
                    <div className="dbx-chart-axis"><span>0</span><span>250k</span><span>500k</span><span>750k ARR</span></div>
                    {DATABRICKS_SQL_ROWS.slice(0, 4).map((row, index) => (
                      <div key={row.account}><span>{row.account}</span><i style={{ width: `${88 - index * 14}%` }} /><strong>{row.score}</strong></div>
                    ))}
                  </div>
                ) : null}
                {cell.duration ? <small className="dbx-cell-duration">Command finished · {cell.duration}</small> : null}
              </div>
              <button aria-label={`Options for ${cell.id}`} className="dbx-cell-menu" type="button"><OperationalShowcaseIcon name="more" size={14} /></button>
            </article>
          ))}
          <button className="dbx-add-cell" type="button"><OperationalShowcaseIcon name="plus" size={13} /> Code <span>⌄</span></button>
        </div>
        {assistantOpen ? (
          <aside className="dbx-assistant" aria-label="Databricks Assistant">
            <header><span><OperationalShowcaseIcon name="sparkles" size={16} /> Assistant</span><button aria-label="Close Assistant" onClick={() => setAssistantOpen(false)} type="button"><OperationalShowcaseIcon name="close" size={14} /></button></header>
            <div className="dbx-assistant-context"><OperationalShowcaseIcon name="document" size={13} /><span>Customer health intelligence</span><strong>3 cells</strong></div>
            <div className="dbx-assistant-message">
              <span className="dbx-assistant-mark"><OperationalShowcaseIcon name="sparkles" size={14} /></span>
              <p>I can explain this notebook, generate transformations, fix errors, or profile the current DataFrame.</p>
            </div>
            <div className="dbx-assistant-prompts">
              <button type="button">Explain the health feature logic</button>
              <button type="button">Add data quality checks</button>
              <button type="button">Optimize the join</button>
            </div>
            <label><textarea aria-label="Ask Databricks Assistant" placeholder="Ask about this notebook…" /><button aria-label="Send to Assistant" type="button"><OperationalShowcaseIcon name="send" size={14} /></button></label>
          </aside>
        ) : null}
      </div>
    </section>
  )
}

function DatabricksSqlEditor() {
  const [resultMode, setResultMode] = useState<'table' | 'chart'>('table')
  const [runStatus, setRunStatus] = useState('Query finished · 1.7s · 5 rows')

  return (
    <section className="dbx-sql">
      <header className="dbx-editor-header">
        <div><span>SQL Editor / My queries /</span><strong>Account health review</strong></div>
        <div className="dbx-editor-actions">
          <button type="button"><span className="dbx-live-dot" /> Serverless Starter Warehouse <OperationalShowcaseIcon name="chevron-down" size={13} /></button>
          <button type="button"><OperationalShowcaseIcon name="people" size={14} /> Share</button>
          <button className="dbx-run-button" onClick={() => setRunStatus('Query finished just now · 1.7s · 5 rows')} type="button"><OperationalShowcaseIcon name="bolt" size={14} /> Run</button>
        </div>
      </header>
      <div className="dbx-sql-body">
        <aside className="dbx-sql-catalog" aria-label="SQL catalog">
          <div className="dbx-sql-catalog-tabs"><button className="active" type="button">Catalog</button><button type="button">Queries</button></div>
          <label><OperationalShowcaseIcon name="search" size={14} /><input aria-label="Search catalog" placeholder="Search data" /></label>
          <div className="dbx-catalog-selectors"><button type="button">main <OperationalShowcaseIcon name="chevron-down" size={12} /></button><button type="button">gold <OperationalShowcaseIcon name="chevron-down" size={12} /></button></div>
          <button type="button"><OperationalShowcaseIcon name="chevron-down" size={13} /><strong>Tables</strong><span>4</span></button>
          <button className="active" type="button"><OperationalShowcaseIcon name="database" size={13} /><span>customer_360</span></button>
          <button type="button"><OperationalShowcaseIcon name="database" size={13} /><span>daily_revenue</span></button>
          <button type="button"><OperationalShowcaseIcon name="database" size={13} /><span>open_orders</span></button>
          <button type="button"><OperationalShowcaseIcon name="chevron-right" size={13} /><strong>Views</strong><span>7</span></button>
          <button type="button"><OperationalShowcaseIcon name="chevron-right" size={13} /><strong>Functions</strong><span>3</span></button>
        </aside>
        <div className="dbx-sql-workbench">
          <div className="dbx-sql-tabs"><button className="active" type="button">Account health review <span>●</span></button><button type="button">New query +</button></div>
          <div className="dbx-sql-code">
            <ol>
              <li><span>SELECT</span> account_name, arr, active_users,</li>
              <li>       health_score, churn_risk</li>
              <li><span>FROM</span> main.gold.customer_360</li>
              <li><span>WHERE</span> arr &gt; <em>25000</em></li>
              <li>  <span>AND</span> status = <i>'active'</i></li>
              <li><span>ORDER BY</span> arr <span>DESC</span></li>
              <li><span>LIMIT</span> <em>100</em>;</li>
            </ol>
            <button type="button"><OperationalShowcaseIcon name="sparkles" size={13} /> Ask Assistant</button>
          </div>
          <div className="dbx-sql-results">
            <div className="dbx-sql-result-tabs">
              <button className={resultMode === 'table' ? 'active' : ''} onClick={() => setResultMode('table')} type="button">Table</button>
              <button className={resultMode === 'chart' ? 'active' : ''} onClick={() => setResultMode('chart')} type="button">Visualization</button>
              <span>{runStatus}</span>
              <button type="button"><OperationalShowcaseIcon name="download" size={13} /> Download CSV</button>
            </div>
            {resultMode === 'table' ? (
              <table>
                <thead><tr><th>account_name</th><th>arr</th><th>active_users</th><th>health_score</th><th>churn_risk</th></tr></thead>
                <tbody>{DATABRICKS_SQL_ROWS.map(row => <tr key={row.account}><td>{row.account}</td><td>{row.arr}</td><td>{row.activeUsers}</td><td>{row.score}</td><td><span className={`dbx-risk-${row.risk.toLowerCase()}`}>{row.risk}</span></td></tr>)}</tbody>
              </table>
            ) : (
              <div className="dbx-sql-chart">
                {DATABRICKS_SQL_ROWS.map((row, index) => <div key={row.account}><span>{row.account}</span><i style={{ height: `${85 - index * 10}%` }} /><strong>{row.arr}</strong></div>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function DatabricksJobs({
  jobs,
  selectedJobId,
  onSelect,
}: {
  jobs: readonly DatabricksJob[]
  selectedJobId: string
  onSelect: (job: DatabricksJob) => void
}) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<DatabricksJobStatus | undefined>()
  const filtered = useMemo(() => selectDatabricksJobs(jobs, query, status), [jobs, query, status])
  const selected = jobs.find(job => job.id === selectedJobId) ?? filtered[0] ?? jobs[0]
  const summary = databricksJobSummary(jobs)

  return (
    <section className="dbx-jobs">
      <header className="dbx-page-heading">
        <div><span>Lakeflow</span><h1>Jobs &amp; Pipelines</h1><p>Orchestrate, schedule, and monitor production data and AI workloads.</p></div>
        <button className="dbx-new-button" type="button"><OperationalShowcaseIcon name="plus" size={14} /> Create</button>
      </header>
      <div className="dbx-job-stats">
        <article><span>Active jobs</span><strong>{summary.total}</strong><small>Across this workspace</small></article>
        <article><span>Healthy</span><strong>{summary.healthy}</strong><small className="positive">Latest runs succeeded</small></article>
        <article><span>Running</span><strong>{summary.running}</strong><small>Live task execution</small></article>
        <article><span>Failed</span><strong>{summary.failed}</strong><small className={summary.failed ? 'negative' : ''}>Needs attention</small></article>
      </div>
      <div className="dbx-job-toolbar">
        <label><OperationalShowcaseIcon name="search" size={14} /><input onChange={event => setQuery(event.target.value)} placeholder="Search jobs and pipelines" value={query} /></label>
        <select aria-label="Job status" onChange={event => setStatus(event.target.value ? event.target.value as DatabricksJobStatus : undefined)} value={status ?? ''}>
          <option value="">All statuses</option><option value="Succeeded">Succeeded</option><option value="Running">Running</option><option value="Failed">Failed</option><option value="Queued">Queued</option>
        </select>
        <button type="button"><OperationalShowcaseIcon name="filter" size={13} /> Owner</button>
      </div>
      <div className="dbx-job-layout">
        <div className="dbx-job-list">
          <div className="dbx-job-list-header"><span>Name</span><span>Trigger</span><span>Latest run</span><span>Status</span></div>
          {filtered.map(job => (
            <button className={job.id === selected?.id ? 'active' : ''} key={job.id} onClick={() => onSelect(job)} type="button">
              <span><i><OperationalShowcaseIcon name="graph" size={14} /></i><span><strong>{job.name}</strong><small>{job.tasks.length} tasks · {job.owner}</small></span></span>
              <span>{job.trigger}</span><span>{job.lastRun}</span><span className={`dbx-status dbx-status-${job.status.toLowerCase()}`}><i />{job.status}</span>
            </button>
          ))}
        </div>
        {selected ? (
          <aside className="dbx-job-detail" aria-label="Job details">
            <header>
              <div><span>Job</span><h2>{selected.name}</h2><p>{selected.trigger} · owned by {selected.owner}</p></div>
              <button type="button"><OperationalShowcaseIcon name="bolt" size={14} /> Run now</button>
            </header>
            <div className="dbx-run-summary">
              <span className={`dbx-status dbx-status-${selected.status.toLowerCase()}`}><i />{selected.status}</span>
              <strong>{selected.lastRun}</strong>
              <small>{Math.floor(selected.durationSeconds / 60)}m {selected.durationSeconds % 60}s</small>
            </div>
            <h3>Task graph</h3>
            <div className="dbx-task-graph">
              {selected.tasks.map((task, index) => (
                <div key={task.id}>
                  <span className={`dbx-task-icon dbx-task-${task.status.toLowerCase()}`}><OperationalShowcaseIcon name={task.type === 'Pipeline' ? 'graph' : task.type === 'SQL' ? 'database' : 'code'} size={14} /></span>
                  <div><strong>{task.name}</strong><span>{task.type} · {task.duration}</span></div>
                  <span className={`dbx-status dbx-status-${task.status.toLowerCase()}`}><i />{task.status}</span>
                  {index < selected.tasks.length - 1 ? <b aria-hidden="true" /> : null}
                </div>
              ))}
            </div>
            <div className="dbx-job-tabs"><button className="active" type="button">Run timeline</button><button type="button">Parameters</button><button type="button">Compute</button></div>
            <div className="dbx-run-timeline">
              {selected.tasks.map(task => <div key={task.id}><span>{task.name}</span><i className={`dbx-timeline-${task.status.toLowerCase()}`} style={{ width: task.status === 'Queued' ? '8%' : task.status === 'Running' ? '62%' : '88%' }} /><time>{task.duration}</time></div>)}
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  )
}

function DatabricksCatalog({
  assets,
  selectedAssetId,
  onSelect,
}: {
  assets: readonly DatabricksCatalogAsset[]
  selectedAssetId: string
  onSelect: (asset: DatabricksCatalogAsset) => void
}) {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<DatabricksAssetKind | undefined>()
  const filtered = useMemo(() => selectDatabricksCatalogAssets(assets, query, kind), [assets, kind, query])
  const selected = assets.find(asset => asset.id === selectedAssetId) ?? filtered[0] ?? assets[0]

  return (
    <section className="dbx-catalog">
      <header className="dbx-page-heading">
        <div><span>Unity Catalog</span><h1>Catalog Explorer</h1><p>Discover data and AI assets with lineage, policy, and quality context.</p></div>
        <button className="dbx-new-button" type="button"><OperationalShowcaseIcon name="plus" size={14} /> Add data</button>
      </header>
      <div className="dbx-catalog-toolbar">
        <label><OperationalShowcaseIcon name="search" size={14} /><input onChange={event => setQuery(event.target.value)} placeholder="Search tables, models, volumes, and owners" value={query} /></label>
        <select aria-label="Asset kind" onChange={event => setKind(event.target.value ? event.target.value as DatabricksAssetKind : undefined)} value={kind ?? ''}>
          <option value="">All asset types</option><option value="Table">Tables</option><option value="View">Views</option><option value="Model">Models</option><option value="Volume">Volumes</option>
        </select>
        <span>{filtered.length} assets</span>
      </div>
      <div className="dbx-catalog-layout">
        <aside className="dbx-catalog-tree" aria-label="Catalog explorer">
          <strong>Catalogs</strong>
          <button type="button"><OperationalShowcaseIcon name="chevron-down" size={13} /><OperationalShowcaseIcon name="layers" size={13} /><span>main</span></button>
          <button className="active" type="button"><OperationalShowcaseIcon name="chevron-down" size={13} /><OperationalShowcaseIcon name="database" size={13} /><span>gold</span></button>
          <button type="button"><span /><OperationalShowcaseIcon name="database" size={13} /><span>customer_360</span></button>
          <button type="button"><span /><OperationalShowcaseIcon name="database" size={13} /><span>daily_revenue</span></button>
          <button type="button"><OperationalShowcaseIcon name="chevron-right" size={13} /><OperationalShowcaseIcon name="database" size={13} /><span>silver</span></button>
          <button type="button"><OperationalShowcaseIcon name="chevron-right" size={13} /><OperationalShowcaseIcon name="database" size={13} /><span>ml</span></button>
          <button type="button"><OperationalShowcaseIcon name="chevron-right" size={13} /><OperationalShowcaseIcon name="inventory" size={13} /><span>media</span></button>
        </aside>
        <div className="dbx-asset-list">
          <div className="dbx-asset-list-header"><span>Name</span><span>Type</span><span>Owner</span><span>Quality</span></div>
          {filtered.map(asset => (
            <button className={asset.id === selected?.id ? 'active' : ''} key={asset.id} onClick={() => onSelect(asset)} type="button">
              <span><i><OperationalShowcaseIcon name={asset.kind === 'Model' ? 'sparkles' : asset.kind === 'Volume' ? 'inventory' : 'database'} size={14} /></i><span><strong>{asset.name}</strong><small>{asset.catalog}.{asset.schema}</small></span></span>
              <span>{asset.kind}</span><span>{asset.owner}</span><span className={`dbx-quality dbx-quality-${asset.quality.toLowerCase()}`}><i />{asset.quality}</span>
            </button>
          ))}
        </div>
        {selected ? (
          <aside className="dbx-asset-detail" aria-label="Asset details">
            <header><i><OperationalShowcaseIcon name={selected.kind === 'Model' ? 'sparkles' : 'database'} size={20} /></i><div><span>{selected.kind}</span><h2>{selected.name}</h2><small>{selected.catalog}.{selected.schema}.{selected.name}</small></div><button aria-label="Asset options" type="button"><OperationalShowcaseIcon name="more" size={15} /></button></header>
            <p>{selected.description}</p>
            <div className="dbx-detail-metrics"><span><strong>{selected.format}</strong>Format</span><span><strong>{selected.rows ? selected.rows.toLocaleString() : '—'}</strong>Rows</span><span><strong>{selected.updatedAt}</strong>Updated</span></div>
            <div className="dbx-asset-tabs"><button className="active" type="button">Overview</button><button type="button">Sample data</button><button type="button">Lineage</button><button type="button">Permissions</button></div>
            <h3>Columns <span>{selected.columns.length}</span></h3>
            <div className="dbx-column-list">
              {selected.columns.map(column => <div key={column.name}><OperationalShowcaseIcon name="layers" size={12} /><span><strong>{column.name}</strong><small>{column.comment}</small></span><code>{column.type}</code></div>)}
            </div>
            <h3>Tags</h3>
            <div className="dbx-tags">{selected.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
          </aside>
        ) : null}
      </div>
    </section>
  )
}

export function DatabricksShowcase({
  cells = DATABRICKS_SAMPLE_CELLS,
  jobs = DATABRICKS_SAMPLE_JOBS,
  catalogAssets = DATABRICKS_SAMPLE_CATALOG,
  initialSection = 'notebook',
  initialJobId = 'customer-health-refresh',
  initialCatalogAssetId = 'main.gold.customer_360',
  workspaceName = CLONE_DEMO_IDENTITY.company,
  onSelectJob,
}: DatabricksShowcaseProps) {
  const [section, setSection] = useState<DatabricksShowcaseSection>(initialSection)
  const [selectedJobId, setSelectedJobId] = useState(initialJobId)
  const [selectedAssetId, setSelectedAssetId] = useState(initialCatalogAssetId)

  const selectJob = (job: DatabricksJob) => {
    setSelectedJobId(job.id)
    onSelectJob?.(job)
  }

  return (
    <div className="databricks-showcase">
      <aside className="dbx-sidebar" aria-label="Databricks navigation">
        <DatabricksBrand />
        <button className="dbx-new-menu" type="button"><OperationalShowcaseIcon name="plus" size={15} /><span>New</span><OperationalShowcaseIcon name="chevron-down" size={12} /></button>
        <nav aria-label="Databricks sections">
          <button type="button"><OperationalShowcaseIcon name="home" size={16} /><span>Home</span></button>
          <button type="button"><OperationalShowcaseIcon name="clock" size={16} /><span>Recents</span></button>
          {DATABRICKS_NAV.map((item, index) => (
            <div className="dbx-nav-group" key={item.id}>
              {index === 0 || DATABRICKS_NAV[index - 1]?.group !== item.group ? <small>{item.group}</small> : null}
              <button className={section === item.id ? 'active' : ''} onClick={() => setSection(item.id)} type="button">
                <OperationalShowcaseIcon name={item.icon} size={16} /><span>{item.label}</span>
              </button>
            </div>
          ))}
          <div className="dbx-nav-group">
            <small>AI/ML</small>
            <button type="button"><OperationalShowcaseIcon name="sparkles" size={16} /><span>Playground</span></button>
            <button type="button"><OperationalShowcaseIcon name="graph" size={16} /><span>Experiments</span></button>
            <button type="button"><OperationalShowcaseIcon name="box" size={16} /><span>Models</span></button>
          </div>
        </nav>
        <button className="dbx-sidebar-settings" type="button"><OperationalShowcaseIcon name="settings" size={16} /><span>Settings</span></button>
      </aside>
      <div className="dbx-shell">
        <header className="dbx-topbar">
          <button className="dbx-workspace-switcher" type="button"><span>JT</span><strong>{workspaceName}</strong><OperationalShowcaseIcon name="chevron-down" size={13} /></button>
          <button className="dbx-global-search" type="button"><OperationalShowcaseIcon name="search" size={15} /><span>Search data, notebooks, queries, and jobs</span><kbd>⌘ K</kbd></button>
          <span className="dbx-topbar-spacer" />
          <button aria-label="Databricks Assistant" type="button"><OperationalShowcaseIcon name="sparkles" size={16} /></button>
          <button aria-label="Help" type="button"><OperationalShowcaseIcon name="help" size={16} /></button>
          <button aria-label="Notifications" type="button"><OperationalShowcaseIcon name="bell" size={16} /><i /></button>
          <button aria-label={`${CLONE_DEMO_IDENTITY.user} account`} className="dbx-user" type="button">{CLONE_DEMO_IDENTITY.user.slice(0, 1)}</button>
        </header>
        <main>
          {section === 'notebook' ? <DatabricksNotebook cells={cells} /> : null}
          {section === 'sql' ? <DatabricksSqlEditor /> : null}
          {section === 'jobs' ? <DatabricksJobs jobs={jobs} onSelect={selectJob} selectedJobId={selectedJobId} /> : null}
          {section === 'catalog' ? <DatabricksCatalog assets={catalogAssets} onSelect={asset => setSelectedAssetId(asset.id)} selectedAssetId={selectedAssetId} /> : null}
        </main>
      </div>
    </div>
  )
}
