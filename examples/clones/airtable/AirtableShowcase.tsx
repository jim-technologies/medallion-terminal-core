import { useMemo, useState } from 'react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import {
  ProductShowcaseAvatar,
  ProductShowcaseIcon,
  formatProductCurrency,
  formatProductPercent,
  productShowcaseInitials,
} from '../shared/ProductShowcasePrimitives'
import '../shared/ProductShowcases.css'

export type AirtableShowcaseView = 'grid' | 'board' | 'record'
export type AirtableProjectStatus = 'Not started' | 'In progress' | 'Blocked' | 'Done'
export type AirtableProjectPriority = 'High' | 'Medium' | 'Low'

export interface AirtableProjectRecord {
  id: string
  name: string
  status: AirtableProjectStatus
  owner: string
  ownerColor: string
  priority: AirtableProjectPriority
  dueDate: string
  budget: number
  progress: number
  workstream: string
  summary: string
  lastModified: string
  attachments?: number
  comments?: number
}

export interface AirtableShowcaseProps {
  records?: AirtableProjectRecord[]
  initialView?: AirtableShowcaseView
  initialSelectedId?: string
  initialQuery?: string
  workspaceName?: string
  baseName?: string
  onSelectRecord?: (record: AirtableProjectRecord) => void
}

export const AIRTABLE_SAMPLE_PROJECTS: AirtableProjectRecord[] = [
  {
    id: 'launch-brief',
    name: 'Finalize launch brief',
    status: 'In progress',
    owner: 'Maya Chen',
    ownerColor: '#7c5ce7',
    priority: 'High',
    dueDate: 'Jul 22',
    budget: 18_500,
    progress: 0.72,
    workstream: 'Positioning',
    summary: 'Align the product story, proof points, launch markets, and final approval path.',
    lastModified: '8 min ago',
    attachments: 4,
    comments: 7,
  },
  {
    id: 'customer-preview',
    name: 'Customer preview program',
    status: 'In progress',
    owner: 'Noah Williams',
    ownerColor: '#1677c8',
    priority: 'High',
    dueDate: 'Jul 24',
    budget: 26_000,
    progress: 0.58,
    workstream: 'Customer',
    summary: 'Coordinate preview access, enablement, feedback capture, and executive follow-up.',
    lastModified: '21 min ago',
    attachments: 8,
    comments: 12,
  },
  {
    id: 'partner-kit',
    name: 'Partner enablement kit',
    status: 'Blocked',
    owner: 'Avery Brooks',
    ownerColor: '#d66a1f',
    priority: 'High',
    dueDate: 'Jul 25',
    budget: 12_800,
    progress: 0.36,
    workstream: 'Partners',
    summary: 'Prepare the co-selling deck, partner FAQs, demo tenant, and regional pricing notes.',
    lastModified: '42 min ago',
    attachments: 6,
    comments: 9,
  },
  {
    id: 'campaign-assets',
    name: 'Produce campaign assets',
    status: 'In progress',
    owner: 'Lina Ortiz',
    ownerColor: '#be4c8d',
    priority: 'Medium',
    dueDate: 'Jul 28',
    budget: 34_000,
    progress: 0.64,
    workstream: 'Creative',
    summary: 'Deliver launch film, product photography, social crops, and localization-ready files.',
    lastModified: '1 hr ago',
    attachments: 15,
    comments: 18,
  },
  {
    id: 'sales-training',
    name: 'Run sales certification',
    status: 'Not started',
    owner: 'Eli Turner',
    ownerColor: '#248769',
    priority: 'Medium',
    dueDate: 'Jul 30',
    budget: 9_400,
    progress: 0.08,
    workstream: 'Enablement',
    summary: 'Train account teams on qualification, discovery, value proof, and objection handling.',
    lastModified: '2 hrs ago',
    attachments: 3,
    comments: 4,
  },
  {
    id: 'support-readiness',
    name: 'Validate support readiness',
    status: 'Not started',
    owner: 'Priya Shah',
    ownerColor: '#3b75b7',
    priority: 'High',
    dueDate: 'Aug 1',
    budget: 7_600,
    progress: 0.14,
    workstream: 'Support',
    summary: 'Confirm runbooks, escalation paths, service targets, and launch-week staffing.',
    lastModified: '3 hrs ago',
    attachments: 2,
    comments: 5,
  },
  {
    id: 'pricing-review',
    name: 'Complete pricing review',
    status: 'Done',
    owner: 'Owen Kim',
    ownerColor: '#5e6fd8',
    priority: 'High',
    dueDate: 'Jul 18',
    budget: 5_200,
    progress: 1,
    workstream: 'Finance',
    summary: 'Approve packaging, discount guardrails, regional adjustments, and quote language.',
    lastModified: 'Yesterday',
    attachments: 5,
    comments: 11,
  },
  {
    id: 'measurement-plan',
    name: 'Publish measurement plan',
    status: 'Done',
    owner: 'Sofia Reed',
    ownerColor: '#ad5d40',
    priority: 'Low',
    dueDate: 'Jul 17',
    budget: 3_800,
    progress: 1,
    workstream: 'Analytics',
    summary: 'Define launch scorecard, reporting cadence, source ownership, and alert thresholds.',
    lastModified: 'Yesterday',
    attachments: 2,
    comments: 3,
  },
]

const AIRTABLE_STATUSES: AirtableProjectStatus[] = [
  'Not started',
  'In progress',
  'Blocked',
  'Done',
]

export function selectAirtableProjects(
  records: AirtableProjectRecord[],
  query = '',
  status: AirtableProjectStatus | 'All' = 'All',
): AirtableProjectRecord[] {
  const normalized = query.trim().toLowerCase()
  return records.filter(record => {
    if (status !== 'All' && record.status !== status) return false
    if (!normalized) return true
    return [
      record.name,
      record.owner,
      record.status,
      record.priority,
      record.workstream,
      record.summary,
    ].some(value => value.toLowerCase().includes(normalized))
  })
}

function AirtableMark() {
  return (
    <span className="airtable-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  )
}

function AirtableTopbar({
  workspaceName,
  query,
  onQueryChange,
}: {
  workspaceName: string
  query: string
  onQueryChange: (query: string) => void
}) {
  return (
    <header className="airtable-topbar">
      <div className="airtable-brand">
        <button className="airtable-icon-button airtable-menu-button" aria-label="Open navigation">
          <ProductShowcaseIcon name="menu" />
        </button>
        <AirtableMark />
        <span className="airtable-brand-name">Airtable</span>
      </div>
      <button className="airtable-workspace-switcher">
        <span className="airtable-workspace-badge">{productShowcaseInitials(workspaceName)}</span>
        <span>{workspaceName}</span>
        <ProductShowcaseIcon name="chevron-down" size={14} />
      </button>
      <label className="airtable-global-search">
        <ProductShowcaseIcon name="search" size={16} />
        <span className="product-sr-only">Search workspace</span>
        <input
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          placeholder="Search…"
          type="search"
        />
        <kbd>⌘ K</kbd>
      </label>
      <div className="airtable-top-actions">
        <button className="airtable-icon-button" aria-label="Help"><ProductShowcaseIcon name="help" /></button>
        <button className="airtable-icon-button" aria-label="Notifications"><ProductShowcaseIcon name="bell" /></button>
        <ProductShowcaseAvatar name={CLONE_DEMO_IDENTITY.user} color="#e8a62e" size={30} />
      </div>
    </header>
  )
}

function AirtableBasebar({ baseName }: { baseName: string }) {
  return (
    <div className="airtable-basebar">
      <div className="airtable-base-identity">
        <span className="airtable-base-icon">PL</span>
        <button>
          <strong>{baseName}</strong>
          <ProductShowcaseIcon name="chevron-down" size={14} />
        </button>
      </div>
      <nav className="airtable-product-tabs" aria-label="Base sections">
        <button className="is-active">Data</button>
        <button>Automations</button>
        <button>Interfaces</button>
        <button>Forms</button>
      </nav>
      <div className="airtable-base-actions">
        <span className="airtable-presence">
          <ProductShowcaseAvatar name="Maya Chen" color="#7c5ce7" size={24} />
          <ProductShowcaseAvatar name="Noah Williams" color="#1677c8" size={24} />
          <ProductShowcaseAvatar name="Lina Ortiz" color="#be4c8d" size={24} />
        </span>
        <button className="airtable-share-button"><ProductShowcaseIcon name="share" size={15} /> Share</button>
      </div>
    </div>
  )
}

function AirtableSidebar({
  view,
  onViewChange,
}: {
  view: AirtableShowcaseView
  onViewChange: (view: AirtableShowcaseView) => void
}) {
  const navItems: Array<{
    view: AirtableShowcaseView
    label: string
    icon: 'table' | 'board' | 'grid'
  }> = [
    { view: 'grid', label: 'All launch work', icon: 'table' },
    { view: 'board', label: 'Work by status', icon: 'board' },
    { view: 'record', label: 'Content review', icon: 'grid' },
  ]

  return (
    <aside className="airtable-sidebar">
      <button className="airtable-create-button"><ProductShowcaseIcon name="plus" size={16} /> Create</button>
      <div className="airtable-sidebar-heading">
        <span>Views</span>
        <div>
          <button aria-label="Search views"><ProductShowcaseIcon name="search" size={14} /></button>
          <button aria-label="Add view"><ProductShowcaseIcon name="plus" size={14} /></button>
        </div>
      </div>
      <nav className="airtable-view-list">
        {navItems.map(item => (
          <button
            className={view === item.view ? 'is-active' : ''}
            key={item.view}
            onClick={() => onViewChange(item.view)}
          >
            <ProductShowcaseIcon name={item.icon} size={15} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="airtable-sidebar-group">
        <button><ProductShowcaseIcon name="chevron-down" size={13} /> Team views</button>
        <span>My priorities</span>
        <span>Launch calendar</span>
        <span>Budget tracker</span>
      </div>
      <div className="airtable-sidebar-bottom">
        <button><ProductShowcaseIcon name="apps" size={15} /> Extensions</button>
        <button><ProductShowcaseIcon name="document" size={15} /> Base guide</button>
      </div>
    </aside>
  )
}

function AirtableViewToolbar({
  view,
  status,
  onStatusChange,
}: {
  view: AirtableShowcaseView
  status: AirtableProjectStatus | 'All'
  onStatusChange: (status: AirtableProjectStatus | 'All') => void
}) {
  return (
    <div className="airtable-view-toolbar">
      <div className="airtable-view-title">
        <ProductShowcaseIcon name={view === 'board' ? 'board' : view === 'record' ? 'grid' : 'table'} size={16} />
        <strong>
          {view === 'board' ? 'Work by status' : view === 'record' ? 'Content review' : 'All launch work'}
        </strong>
        <ProductShowcaseIcon name="chevron-down" size={13} />
      </div>
      <div className="airtable-toolbar-actions">
        <label className="airtable-status-filter">
          <ProductShowcaseIcon name="filter" size={14} />
          <span>Status</span>
          <select
            value={status}
            onChange={event => onStatusChange(event.target.value as AirtableProjectStatus | 'All')}
          >
            <option>All</option>
            {AIRTABLE_STATUSES.map(option => <option key={option}>{option}</option>)}
          </select>
        </label>
        <button><ProductShowcaseIcon name="sort" size={14} /> Sort</button>
        <button className="airtable-toolbar-hide-mobile"><ProductShowcaseIcon name="grid" size={14} /> Color</button>
        <button className="airtable-toolbar-hide-mobile"><ProductShowcaseIcon name="share" size={14} /> Share view</button>
        <button aria-label="More view actions"><ProductShowcaseIcon name="more" size={16} /></button>
      </div>
    </div>
  )
}

function AirtableStatus({ status }: { status: AirtableProjectStatus }) {
  return <span className={`airtable-status is-${status.toLowerCase().replace(/ /g, '-')}`}>{status}</span>
}

function AirtablePriority({ priority }: { priority: AirtableProjectPriority }) {
  return <span className={`airtable-priority is-${priority.toLowerCase()}`}>{priority}</span>
}

function AirtableGrid({
  records,
  selectedId,
  onSelect,
}: {
  records: AirtableProjectRecord[]
  selectedId?: string
  onSelect: (record: AirtableProjectRecord) => void
}) {
  return (
    <div className="airtable-grid-wrap">
      <table className="airtable-grid-table">
        <thead>
          <tr>
            <th className="airtable-row-number"><input type="checkbox" aria-label="Select all rows" /></th>
            <th className="airtable-primary-column"><span>Aa</span> Project</th>
            <th><span>▾</span> Status</th>
            <th><ProductShowcaseIcon name="contact" size={13} /> Owner</th>
            <th><span>◎</span> Priority</th>
            <th><ProductShowcaseIcon name="calendar" size={13} /> Due date</th>
            <th><span>$</span> Budget</th>
            <th><span>%</span> Progress</th>
            <th><ProductShowcaseIcon name="activity" size={13} /> Last modified</th>
            <th className="airtable-add-column"><ProductShowcaseIcon name="plus" size={14} /></th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr
              className={selectedId === record.id ? 'is-selected' : ''}
              key={record.id}
              onClick={() => onSelect(record)}
            >
              <td className="airtable-row-number">
                <span>{index + 1}</span>
                <input type="checkbox" aria-label={`Select ${record.name}`} />
              </td>
              <td className="airtable-primary-column">
                <button>{record.name}</button>
                {(record.attachments ?? 0) > 0 && (
                  <span className="airtable-cell-meta">▱ {record.attachments}</span>
                )}
              </td>
              <td><AirtableStatus status={record.status} /></td>
              <td>
                <span className="airtable-owner">
                  <ProductShowcaseAvatar name={record.owner} color={record.ownerColor} size={22} />
                  {record.owner}
                </span>
              </td>
              <td><AirtablePriority priority={record.priority} /></td>
              <td>{record.dueDate}</td>
              <td>{formatProductCurrency(record.budget)}</td>
              <td>
                <span className="airtable-progress">
                  <span><i style={{ width: formatProductPercent(record.progress) }} /></span>
                  {formatProductPercent(record.progress)}
                </span>
              </td>
              <td className="airtable-muted-cell">{record.lastModified}</td>
              <td />
            </tr>
          ))}
          <tr className="airtable-add-row">
            <td className="airtable-row-number"><ProductShowcaseIcon name="plus" size={13} /></td>
            <td colSpan={9}>Add record</td>
          </tr>
        </tbody>
      </table>
      {records.length === 0 && <div className="airtable-empty">No records match this view.</div>}
      <footer className="airtable-grid-footer">{records.length} records</footer>
    </div>
  )
}

function AirtableBoard({
  records,
  onSelect,
}: {
  records: AirtableProjectRecord[]
  onSelect: (record: AirtableProjectRecord) => void
}) {
  return (
    <div className="airtable-board">
      {AIRTABLE_STATUSES.map(status => {
        const laneRecords = records.filter(record => record.status === status)
        const laneTotal = laneRecords.reduce((sum, record) => sum + record.budget, 0)
        return (
          <section className="airtable-board-lane" key={status}>
            <header>
              <div>
                <AirtableStatus status={status} />
                <span>{laneRecords.length}</span>
              </div>
              <button aria-label={`More ${status} actions`}><ProductShowcaseIcon name="more" size={16} /></button>
            </header>
            <div className="airtable-lane-budget">
              <span>Total budget</span>
              <strong>{formatProductCurrency(laneTotal, { compact: true })}</strong>
            </div>
            <div className="airtable-board-cards">
              {laneRecords.map(record => (
                <button className="airtable-board-card" key={record.id} onClick={() => onSelect(record)}>
                  <span className="airtable-card-workstream">{record.workstream}</span>
                  <strong>{record.name}</strong>
                  <p>{record.summary}</p>
                  <div className="airtable-card-progress">
                    <span><i style={{ width: formatProductPercent(record.progress) }} /></span>
                    {formatProductPercent(record.progress)}
                  </div>
                  <footer>
                    <ProductShowcaseAvatar name={record.owner} color={record.ownerColor} size={23} />
                    <span>{record.dueDate}</span>
                    <span>◌ {record.comments ?? 0}</span>
                  </footer>
                </button>
              ))}
              <button className="airtable-add-card"><ProductShowcaseIcon name="plus" size={14} /> Add record</button>
            </div>
          </section>
        )
      })}
    </div>
  )
}

function AirtableRecordReview({
  records,
  selected,
  onSelect,
}: {
  records: AirtableProjectRecord[]
  selected: AirtableProjectRecord | undefined
  onSelect: (record: AirtableProjectRecord) => void
}) {
  const active = selected ?? records[0]
  return (
    <div className="airtable-record-review">
      <aside className="airtable-record-list">
        <label>
          <ProductShowcaseIcon name="search" size={15} />
          <input type="search" placeholder="Find a record" aria-label="Find a record" />
        </label>
        <div className="airtable-record-list-heading">
          <span>Launch work</span>
          <button><ProductShowcaseIcon name="filter" size={14} /></button>
        </div>
        {records.map(record => (
          <button
            className={active?.id === record.id ? 'is-active' : ''}
            key={record.id}
            onClick={() => onSelect(record)}
          >
            <span className={`airtable-record-color is-${record.status.toLowerCase().replace(/ /g, '-')}`} />
            <span>
              <strong>{record.name}</strong>
              <small>{record.owner} · {record.dueDate}</small>
            </span>
            <ProductShowcaseIcon name="chevron-right" size={14} />
          </button>
        ))}
      </aside>
      {active ? (
        <article className="airtable-record-detail">
          <header className="airtable-record-detail-header">
            <div>
              <span className="airtable-record-eyebrow">{active.workstream}</span>
              <h2>{active.name}</h2>
              <p>{active.summary}</p>
            </div>
            <div>
              <button className="airtable-record-action"><ProductShowcaseIcon name="check" size={15} /> Mark complete</button>
              <button className="airtable-icon-button" aria-label="More record actions"><ProductShowcaseIcon name="more" /></button>
            </div>
          </header>
          <div className="airtable-record-body">
            <section className="airtable-record-fields">
              <h3>Project details</h3>
              <dl>
                <div><dt>Status</dt><dd><AirtableStatus status={active.status} /></dd></div>
                <div>
                  <dt>Owner</dt>
                  <dd><ProductShowcaseAvatar name={active.owner} color={active.ownerColor} size={23} /> {active.owner}</dd>
                </div>
                <div><dt>Priority</dt><dd><AirtablePriority priority={active.priority} /></dd></div>
                <div><dt>Due date</dt><dd>{active.dueDate}</dd></div>
                <div><dt>Budget</dt><dd>{formatProductCurrency(active.budget)}</dd></div>
                <div><dt>Progress</dt><dd>{formatProductPercent(active.progress)}</dd></div>
              </dl>
              <h3>Launch checklist</h3>
              <div className="airtable-checklist">
                <label><input type="checkbox" defaultChecked /> Confirm approvers and decision date</label>
                <label><input type="checkbox" defaultChecked={active.progress > 0.5} /> Review customer-facing materials</label>
                <label><input type="checkbox" /> Publish final assets and notify owners</label>
              </div>
            </section>
            <aside className="airtable-comments">
              <header><strong>Comments</strong><span>{active.comments ?? 0}</span></header>
              <div className="airtable-comment">
                <ProductShowcaseAvatar name="Maya Chen" color="#7c5ce7" size={26} />
                <p><strong>Maya Chen</strong><small>Today at 9:42 AM</small>Updated the approval notes and linked the latest customer feedback.</p>
              </div>
              <div className="airtable-comment">
                <ProductShowcaseAvatar name={active.owner} color={active.ownerColor} size={26} />
                <p><strong>{active.owner}</strong><small>Today at 10:08 AM</small>The open items are assigned. We are on track for the next review.</p>
              </div>
              <label className="airtable-comment-input">
                <input placeholder="Leave a comment…" />
                <button aria-label="Send comment"><ProductShowcaseIcon name="arrow-up" size={14} /></button>
              </label>
              <button className="airtable-revision-link"><ProductShowcaseIcon name="activity" size={14} /> View revision history</button>
            </aside>
          </div>
        </article>
      ) : <div className="airtable-empty">No record selected.</div>}
    </div>
  )
}

export function AirtableShowcase({
  records = AIRTABLE_SAMPLE_PROJECTS,
  initialView = 'grid',
  initialSelectedId,
  initialQuery = '',
  workspaceName = CLONE_DEMO_IDENTITY.company,
  baseName = 'Product launch',
  onSelectRecord,
}: AirtableShowcaseProps) {
  const [view, setView] = useState<AirtableShowcaseView>(initialView)
  const [query, setQuery] = useState(initialQuery)
  const [status, setStatus] = useState<AirtableProjectStatus | 'All'>('All')
  const [selectedId, setSelectedId] = useState(
    initialSelectedId ?? (initialView === 'record' ? records[0]?.id : undefined),
  )
  const filtered = useMemo(
    () => selectAirtableProjects(records, query, status),
    [query, records, status],
  )
  const selected = records.find(record => record.id === selectedId)

  const selectRecord = (record: AirtableProjectRecord) => {
    setSelectedId(record.id)
    onSelectRecord?.(record)
  }

  return (
    <div className="airtable-clone" data-clone-namespace="airtable">
      <AirtableTopbar workspaceName={workspaceName} query={query} onQueryChange={setQuery} />
      <AirtableBasebar baseName={baseName} />
      <div className="airtable-app-shell">
        <AirtableSidebar
          view={view}
          onViewChange={nextView => {
            setView(nextView)
            if (nextView === 'record' && !selectedId) setSelectedId(filtered[0]?.id)
          }}
        />
        <main className="airtable-main">
          <div className="airtable-table-tabs">
            <button className="is-active">Launch work</button>
            <button>Owners</button>
            <button>Workstreams</button>
            <button><ProductShowcaseIcon name="plus" size={14} /> Add or import</button>
          </div>
          <AirtableViewToolbar view={view} status={status} onStatusChange={setStatus} />
          <div className="airtable-view-content">
            {view === 'grid' && (
              <AirtableGrid records={filtered} selectedId={selectedId} onSelect={selectRecord} />
            )}
            {view === 'board' && <AirtableBoard records={filtered} onSelect={selectRecord} />}
            {view === 'record' && (
              <AirtableRecordReview records={filtered} selected={selected} onSelect={selectRecord} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
