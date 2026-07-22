import {
  useMemo,
  useState,
  type CSSProperties,
} from 'react'
import { CLONE_DEMO_IDENTITY } from '../../demoIdentity'
import {
  OperationalShowcaseIcon,
  type OperationalShowcaseIconName,
} from '../OperationalShowcasePrimitives'
import './ProductArchetypeShowcase.css'

export const PRODUCT_SHOWCASE_IDS = [
  'google-gmail',
  'microsoft-outlook',
  'notion',
  'atlassian-confluence',
  'linear',
  'atlassian-jira',
  'github',
  'gitlab',
  'binance',
  'coingecko',
  'polymarket',
  'interactive-brokers-trader-workstation',
  'grafana-labs-grafana',
  'apache-superset',
  'meta-whatsapp',
  'openai-chatgpt',
] as const

export type ProductShowcaseId = typeof PRODUCT_SHOWCASE_IDS[number]
export type ProductArchetype =
  | 'mail'
  | 'knowledge'
  | 'work'
  | 'code'
  | 'market'
  | 'analytics'
  | 'conversation'

export interface ProductShowcaseDefinition {
  id: ProductShowcaseId
  vendor: string
  product: string
  shortName: string
  archetype: ProductArchetype
  accent: string
  accentSoft: string
  surface: 'light' | 'dark'
  mark: string
  views: readonly string[]
  defaultView: string
}

export const PRODUCT_ARCHETYPE_CATALOG: Record<ProductShowcaseId, ProductShowcaseDefinition> = {
  'google-gmail': {
    id: 'google-gmail', vendor: 'Google', product: 'Google Gmail', shortName: 'Gmail',
    archetype: 'mail', accent: '#c5221f', accentSoft: '#fce8e6', surface: 'light', mark: 'M',
    views: ['inbox', 'thread', 'compose'], defaultView: 'inbox',
  },
  'microsoft-outlook': {
    id: 'microsoft-outlook', vendor: 'Microsoft', product: 'Microsoft Outlook', shortName: 'Outlook',
    archetype: 'mail', accent: '#0f6cbd', accentSoft: '#deecf9', surface: 'light', mark: 'O',
    views: ['focused', 'reading-pane', 'compose'], defaultView: 'focused',
  },
  notion: {
    id: 'notion', vendor: 'Notion', product: 'Notion', shortName: 'Notion',
    archetype: 'knowledge', accent: '#37352f', accentSoft: '#efefed', surface: 'light', mark: 'N',
    views: ['document', 'database', 'comments'], defaultView: 'document',
  },
  'atlassian-confluence': {
    id: 'atlassian-confluence', vendor: 'Atlassian', product: 'Atlassian Confluence', shortName: 'Confluence',
    archetype: 'knowledge', accent: '#1868db', accentSoft: '#e9f2ff', surface: 'light', mark: 'C',
    views: ['space', 'page', 'page-tree'], defaultView: 'space',
  },
  linear: {
    id: 'linear', vendor: 'Linear', product: 'Linear', shortName: 'Linear',
    archetype: 'work', accent: '#5e6ad2', accentSoft: '#262846', surface: 'dark', mark: 'L',
    views: ['issues', 'cycle', 'issue-detail'], defaultView: 'issues',
  },
  'atlassian-jira': {
    id: 'atlassian-jira', vendor: 'Atlassian', product: 'Atlassian Jira', shortName: 'Jira',
    archetype: 'work', accent: '#0c66e4', accentSoft: '#e9f2ff', surface: 'light', mark: 'J',
    views: ['backlog', 'board', 'issue-detail'], defaultView: 'backlog',
  },
  github: {
    id: 'github', vendor: 'GitHub', product: 'GitHub', shortName: 'GitHub',
    archetype: 'code', accent: '#238636', accentSoft: '#16351e', surface: 'dark', mark: 'GH',
    views: ['pull-request', 'files-changed', 'actions'], defaultView: 'pull-request',
  },
  gitlab: {
    id: 'gitlab', vendor: 'GitLab', product: 'GitLab', shortName: 'GitLab',
    archetype: 'code', accent: '#fc6d26', accentSoft: '#3d251c', surface: 'dark', mark: 'GL',
    views: ['merge-request', 'changes', 'pipeline'], defaultView: 'merge-request',
  },
  binance: {
    id: 'binance', vendor: 'Binance', product: 'Binance', shortName: 'Binance',
    archetype: 'market', accent: '#f0b90b', accentSoft: '#332d16', surface: 'dark', mark: 'B',
    views: ['spot', 'open-orders', 'wallet'], defaultView: 'spot',
  },
  coingecko: {
    id: 'coingecko', vendor: 'CoinGecko', product: 'CoinGecko', shortName: 'CoinGecko',
    archetype: 'market', accent: '#78a53a', accentSoft: '#eef6df', surface: 'light', mark: 'CG',
    views: ['markets', 'coin-detail', 'portfolio'], defaultView: 'markets',
  },
  polymarket: {
    id: 'polymarket', vendor: 'Polymarket', product: 'Polymarket', shortName: 'Polymarket',
    archetype: 'market', accent: '#2f6fed', accentSoft: '#e8efff', surface: 'light', mark: 'P',
    views: ['discovery', 'market-detail', 'portfolio'], defaultView: 'discovery',
  },
  'interactive-brokers-trader-workstation': {
    id: 'interactive-brokers-trader-workstation', vendor: 'Interactive Brokers',
    product: 'Interactive Brokers Trader Workstation', shortName: 'Trader Workstation',
    archetype: 'market', accent: '#d62728', accentSoft: '#351b1b', surface: 'dark', mark: 'IB',
    views: ['mosaic', 'portfolio', 'order-entry'], defaultView: 'mosaic',
  },
  'grafana-labs-grafana': {
    id: 'grafana-labs-grafana', vendor: 'Grafana Labs', product: 'Grafana Labs Grafana', shortName: 'Grafana',
    archetype: 'analytics', accent: '#ff9830', accentSoft: '#3a2818', surface: 'dark', mark: 'G',
    views: ['dashboard', 'explore', 'alerting'], defaultView: 'dashboard',
  },
  'apache-superset': {
    id: 'apache-superset', vendor: 'Apache', product: 'Apache Superset', shortName: 'Superset',
    archetype: 'analytics', accent: '#20a7c9', accentSoft: '#e4f6fa', surface: 'light', mark: 'S',
    views: ['dashboard', 'explore', 'sql-lab'], defaultView: 'dashboard',
  },
  'meta-whatsapp': {
    id: 'meta-whatsapp', vendor: 'Meta', product: 'Meta WhatsApp', shortName: 'WhatsApp',
    archetype: 'conversation', accent: '#00a884', accentSoft: '#d9fdd3', surface: 'light', mark: 'W',
    views: ['chat', 'communities', 'media'], defaultView: 'chat',
  },
  'openai-chatgpt': {
    id: 'openai-chatgpt', vendor: 'OpenAI', product: 'OpenAI ChatGPT', shortName: 'ChatGPT',
    archetype: 'conversation', accent: '#10a37f', accentSoft: '#e8f7f2', surface: 'light', mark: 'AI',
    views: ['conversation', 'projects', 'canvas'], defaultView: 'conversation',
  },
}

export interface ProductArchetypeShowcaseProps {
  product: ProductShowcaseId
  initialView?: string
  initialSelectedId?: string
  companyName?: string
  userName?: string
  onSelectItem?: (id: string) => void
}

export function productShowcaseViews(product: ProductShowcaseId): readonly string[] {
  return PRODUCT_ARCHETYPE_CATALOG[product].views
}

export function resolveProductShowcaseView(product: ProductShowcaseId, view?: string): string {
  const definition = PRODUCT_ARCHETYPE_CATALOG[product]
  return view && definition.views.includes(view) ? view : definition.defaultView
}

export function ProductArchetypeShowcase({
  product,
  initialView,
  initialSelectedId,
  companyName = CLONE_DEMO_IDENTITY.company,
  userName = CLONE_DEMO_IDENTITY.user,
  onSelectItem,
}: ProductArchetypeShowcaseProps) {
  const definition = PRODUCT_ARCHETYPE_CATALOG[product]
  const [view, setView] = useState(() => resolveProductShowcaseView(product, initialView))
  const style = {
    '--ar-accent': definition.accent,
    '--ar-accent-soft': definition.accentSoft,
  } as CSSProperties
  const shared = { definition, view, setView, companyName, userName, initialSelectedId, onSelectItem }

  return (
    <div
      className={`archetype-showcase ar-${definition.archetype} ar-product-${definition.id} is-${definition.surface}`}
      data-product={definition.id}
      data-view={view}
      style={style}
    >
      {definition.archetype === 'mail' && <MailShowcase {...shared} />}
      {definition.archetype === 'knowledge' && <KnowledgeShowcase {...shared} />}
      {definition.archetype === 'work' && <WorkShowcase {...shared} />}
      {definition.archetype === 'code' && <CodeShowcase {...shared} />}
      {definition.archetype === 'market' && <MarketShowcase {...shared} />}
      {definition.archetype === 'analytics' && <AnalyticsShowcase {...shared} />}
      {definition.archetype === 'conversation' && <ConversationShowcase {...shared} />}
    </div>
  )
}

interface ShowcaseRendererProps {
  definition: ProductShowcaseDefinition
  view: string
  setView: (view: string) => void
  companyName: string
  userName: string
  initialSelectedId?: string
  onSelectItem?: (id: string) => void
}

function ProductMark({ definition }: { definition: ProductShowcaseDefinition }) {
  return <span className="ar-product-mark" aria-label={definition.shortName} title={definition.shortName}>{definition.mark}</span>
}

function Avatar({ name, size = 30 }: { name: string; size?: number }) {
  const initials = name.split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase()
  return <span className="ar-avatar" style={{ '--ar-avatar-size': `${size}px` } as CSSProperties} title={name}>{initials}</span>
}

function IconButton({ icon, label }: { icon: OperationalShowcaseIconName; label: string }) {
  return <button type="button" className="ar-icon-button" aria-label={label}><OperationalShowcaseIcon name={icon} size={17} /></button>
}

function ViewTabs({
  definition,
  view,
  setView,
  labels,
}: {
  definition: ProductShowcaseDefinition
  view: string
  setView: (view: string) => void
  labels?: Record<string, string>
}) {
  return (
    <nav className="ar-view-tabs" aria-label={`${definition.shortName} views`}>
      {definition.views.map(item => (
        <button
          type="button"
          key={item}
          className={view === item ? 'is-active' : ''}
          onClick={() => setView(item)}
        >
          {labels?.[item] ?? titleCase(item)}
        </button>
      ))}
    </nav>
  )
}

function titleCase(value: string): string {
  return value.replace(/-/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase())
}

interface MailItem {
  id: string
  sender: string
  subject: string
  preview: string
  time: string
  unread?: boolean
  starred?: boolean
  label?: string
}

const MAIL_ITEMS: readonly MailItem[] = [
  { id: 'renewal', sender: 'Maya Chen', subject: 'Northwind renewal — final review', preview: 'The commercial terms are approved. Can you check the implementation dates?', time: '10:42 AM', unread: true, starred: true, label: 'Customers' },
  { id: 'forecast', sender: 'Finance Team', subject: 'July cash forecast is ready', preview: 'Collections improved this week and the operating runway moved to 18 months.', time: '9:18 AM', unread: true, label: 'Finance' },
  { id: 'launch', sender: 'Lina Torres', subject: 'Launch readiness notes', preview: 'I consolidated the open risks, owners, and decisions from yesterday’s review.', time: 'Yesterday', starred: true, label: 'Projects' },
  { id: 'invoice', sender: 'Atlas Design Co.', subject: 'Invoice 1048 received', preview: 'Thanks, Jun. We have scheduled the payment for Friday.', time: 'Yesterday', label: 'Finance' },
  { id: 'weekly', sender: 'Operations Digest', subject: 'Weekly operating summary', preview: 'Revenue is on plan; two customer commitments need owner confirmation.', time: 'Jul 19', label: 'Updates' },
  { id: 'candidate', sender: 'Noah Williams', subject: 'Candidate debrief', preview: 'Sharing the panel notes and recommendation for the product role.', time: 'Jul 18', label: 'People' },
]

function MailShowcase({ definition, view, setView, companyName, userName, initialSelectedId, onSelectItem }: ShowcaseRendererProps) {
  const outlook = definition.id === 'microsoft-outlook'
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? (view === 'inbox' || view === 'focused' ? '' : 'renewal'))
  const [composeOpen, setComposeOpen] = useState(view === 'compose')
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return normalized
      ? MAIL_ITEMS.filter(item => `${item.sender} ${item.subject} ${item.preview}`.toLowerCase().includes(normalized))
      : MAIL_ITEMS
  }, [query])
  const selected = MAIL_ITEMS.find(item => item.id === selectedId) ?? MAIL_ITEMS[0]
  const choose = (id: string) => {
    setSelectedId(id)
    onSelectItem?.(id)
  }
  const labels: Record<string, string> = outlook
    ? { focused: 'Focused', 'reading-pane': 'Reading pane', compose: 'Compose' }
    : { inbox: 'Inbox', thread: 'Conversation', compose: 'Compose' }

  return (
    <div className="ar-mail-shell">
      <header className="ar-mail-topbar">
        <IconButton icon="menu" label="Main menu" />
        <a className="ar-brand" href="#mail" onClick={event => event.preventDefault()}>
          <ProductMark definition={definition} /><strong>{definition.shortName}</strong>
        </a>
        <label className="ar-global-search">
          <OperationalShowcaseIcon name="search" size={18} />
          <span className="ar-sr-only">Search mail</span>
          <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search mail" />
          <kbd>/</kbd>
        </label>
        <div className="ar-top-actions">
          <IconButton icon="help" label="Help" /><IconButton icon="settings" label="Settings" />
          <Avatar name={userName} size={32} />
        </div>
      </header>
      <div className="ar-mail-body">
        <aside className="ar-mail-sidebar">
          <button type="button" className="ar-compose-button" onClick={() => { setComposeOpen(true); setView('compose') }}>
            <OperationalShowcaseIcon name="plus" size={20} /> New message
          </button>
          <nav>
            {[
              ['inbox', 'Inbox', '12'], ['flag', outlook ? 'Flagged' : 'Starred', ''],
              ['clock', outlook ? 'Scheduled' : 'Snoozed', ''], ['send', 'Sent', ''], ['document', 'Drafts', '3'],
            ].map(([icon, label, count], index) => (
              <button type="button" key={label} className={index === 0 ? 'is-active' : ''}>
                <OperationalShowcaseIcon name={icon as OperationalShowcaseIconName} size={17} />
                <span>{label}</span>{count && <b>{count}</b>}
              </button>
            ))}
          </nav>
          <div className="ar-mail-section-label">{outlook ? 'Folders' : 'Labels'}</div>
          {['Customers', 'Finance', 'Projects', 'People'].map(label => <button type="button" className="ar-label-row" key={label}><i />{label}</button>)}
          <div className="ar-mail-account"><Avatar name={companyName} size={26} /><span><strong>{companyName}</strong><small>{CLONE_DEMO_IDENTITY.email}</small></span></div>
        </aside>
        <main className="ar-mail-main">
          <div className="ar-mail-list">
            <div className="ar-list-toolbar">
              <input type="checkbox" aria-label="Select all mail" />
              <IconButton icon="refresh" label="Refresh" /><IconButton icon="more" label="More actions" />
              <span>{visible.length} conversations</span>
            </div>
            <ViewTabs definition={definition} view={view} setView={next => { setView(next); setComposeOpen(next === 'compose') }} labels={labels} />
            {outlook && <div className="ar-mail-focus-tabs"><button className="is-active">Focused</button><button>Other</button><span>Filter</span></div>}
            {!outlook && <div className="ar-mail-focus-tabs"><button className="is-active">Primary</button><button>Updates</button><button>Promotions</button></div>}
            <div className="ar-mail-rows" role="listbox" aria-label="Messages">
              {visible.map(item => (
                <button
                  type="button"
                  key={item.id}
                  role="option"
                  aria-selected={selectedId === item.id}
                  className={`${item.unread ? 'is-unread' : ''} ${selectedId === item.id ? 'is-selected' : ''}`}
                  onClick={() => choose(item.id)}
                >
                  <span className="ar-mail-check">□</span><span className="ar-mail-star">{item.starred ? '★' : '☆'}</span>
                  <strong>{item.sender}</strong><span className="ar-mail-copy"><b>{item.subject}</b><small>{item.preview}</small></span>
                  {item.label && <em>{item.label}</em>}<time>{item.time}</time>
                </button>
              ))}
            </div>
          </div>
          {(selectedId || composeOpen) && (
            <section className="ar-reading-pane" aria-label={composeOpen ? 'Compose message' : 'Reading pane'}>
              {composeOpen ? (
                <ComposeCard definition={definition} onClose={() => { setComposeOpen(false); setView(definition.defaultView) }} />
              ) : (
                <>
                  <div className="ar-reader-actions"><IconButton icon="return" label="Back" /><span /><IconButton icon="flag" label="Flag" /><IconButton icon="more" label="More" /></div>
                  <div className="ar-reader-heading"><span className="ar-reader-label">{selected.label}</span><h1>{selected.subject}</h1></div>
                  <article className="ar-message-card">
                    <Avatar name={selected.sender} size={38} />
                    <header><strong>{selected.sender}</strong><span>to {userName} · {selected.time}</span></header>
                    <p>Hi {userName},</p>
                    <p>{selected.preview}</p>
                    <p>The supporting notes are linked below. Please leave any final comments before today’s operating review.</p>
                    <button type="button" className="ar-attachment"><OperationalShowcaseIcon name="document" size={19} /><span><strong>Operating review.pdf</strong><small>PDF · 1.8 MB</small></span></button>
                  </article>
                  <div className="ar-reply-actions"><button type="button"><OperationalShowcaseIcon name="return" size={16} /> Reply</button><button type="button">Forward</button></div>
                </>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

function ComposeCard({ definition, onClose }: { definition: ProductShowcaseDefinition; onClose: () => void }) {
  return (
    <section className="ar-compose-card">
      <header><strong>New message</strong><button type="button" onClick={onClose} aria-label="Close compose">×</button></header>
      <label><span>To</span><input defaultValue="maya@jimtech.xyz" /></label>
      <label><span>Subject</span><input defaultValue="Operating review follow-up" /></label>
      <textarea defaultValue={'Hi Maya,\n\nThe review is complete. I added the final owner and timing notes.\n\nThanks,\nJun'} />
      <footer><button type="button" className="ar-primary">Send</button><button type="button" className="ar-format">A</button><IconButton icon="document" label="Attach file" /><span>{definition.shortName} · Draft saved</span></footer>
    </section>
  )
}

interface KnowledgePage {
  id: string
  title: string
  icon: string
  updated: string
}

const KNOWLEDGE_PAGES: readonly KnowledgePage[] = [
  { id: 'operating-plan', title: '2026 Operating plan', icon: '◫', updated: '2m ago' },
  { id: 'customer-health', title: 'Customer health system', icon: '◎', updated: '1h ago' },
  { id: 'launch', title: 'Platform launch', icon: '△', updated: 'Yesterday' },
  { id: 'decisions', title: 'Decision log', icon: '✓', updated: 'Jul 19' },
  { id: 'research', title: 'Customer research', icon: '⌕', updated: 'Jul 18' },
]

function KnowledgeShowcase({ definition, view, setView, companyName, userName, initialSelectedId, onSelectItem }: ShowcaseRendererProps) {
  const confluence = definition.id === 'atlassian-confluence'
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? KNOWLEDGE_PAGES[0].id)
  const selected = KNOWLEDGE_PAGES.find(page => page.id === selectedId) ?? KNOWLEDGE_PAGES[0]
  const choose = (id: string) => { setSelectedId(id); onSelectItem?.(id) }
  const labels: Record<string, string> = confluence
    ? { space: 'Space overview', page: 'Page editor', 'page-tree': 'Content tree' }
    : { document: 'Document', database: 'Database', comments: 'Comments' }

  return (
    <div className="ar-knowledge-shell">
      <header className="ar-knowledge-topbar">
        <a className="ar-brand" href="#knowledge" onClick={event => event.preventDefault()}><ProductMark definition={definition} /><strong>{definition.shortName}</strong></a>
        <label className="ar-compact-search"><OperationalShowcaseIcon name="search" size={16} /><input placeholder="Search" /><kbd>⌘K</kbd></label>
        <div className="ar-top-actions"><button type="button" className="ar-share-button">Share</button><IconButton icon="more" label="More" /><Avatar name={userName} /></div>
      </header>
      <div className="ar-knowledge-body">
        <aside className="ar-knowledge-sidebar">
          <div className="ar-workspace-row"><Avatar name={companyName} size={25} /><strong>{companyName}</strong><span>⌄</span></div>
          <nav>
            <button type="button"><OperationalShowcaseIcon name="search" size={16} />Search</button>
            <button type="button"><OperationalShowcaseIcon name="home" size={16} />Home</button>
            <button type="button"><OperationalShowcaseIcon name="inbox" size={16} />Inbox <b>4</b></button>
          </nav>
          <div className="ar-tree-heading">{confluence ? 'Spaces' : 'Private'}<button type="button">+</button></div>
          <div className="ar-page-tree">
            {KNOWLEDGE_PAGES.map(page => (
              <button type="button" key={page.id} className={selectedId === page.id ? 'is-active' : ''} onClick={() => choose(page.id)}>
                <span>{page.icon}</span>{page.title}
              </button>
            ))}
          </div>
          <div className="ar-tree-heading">Teamspaces</div>
          <button type="button" className="ar-teamspace"><span>JT</span>Jim Technologies</button>
          <button type="button" className="ar-new-page"><OperationalShowcaseIcon name="plus" size={15} />New page</button>
        </aside>
        <main className="ar-knowledge-main">
          <div className="ar-breadcrumbs"><span>{companyName}</span><b>/</b><span>Operating system</span><b>/</b><strong>{selected.title}</strong></div>
          <ViewTabs definition={definition} view={view} setView={setView} labels={labels} />
          {((!confluence && view === 'database') || (confluence && view === 'space'))
            ? <KnowledgeDatabase confluence={confluence} companyName={companyName} />
            : <KnowledgeDocument confluence={confluence} page={selected} userName={userName} commentsOpen={view === 'comments' || view === 'page-tree'} />}
        </main>
      </div>
    </div>
  )
}

function KnowledgeDatabase({ confluence, companyName }: { confluence: boolean; companyName: string }) {
  const rows = [
    ['Customer workspace beta', 'In progress', 'Maya Chen', 'Jul 24'],
    ['Billing reconciliation', 'Review', 'Jun', 'Jul 26'],
    ['Mobile operating pulse', 'Planned', 'Lina Torres', 'Aug 02'],
    ['Data quality controls', 'In progress', 'Noah Williams', 'Aug 05'],
    ['Partner enablement', 'Complete', 'Avery Brooks', 'Jul 18'],
  ]
  return (
    <section className="ar-database-page">
      <span className="ar-page-emoji">{confluence ? '◈' : '📋'}</span>
      <h1>{confluence ? `${companyName} knowledge hub` : 'Product delivery'}</h1>
      <p>{confluence ? 'Pages, live documents, decisions, and team updates in one governed space.' : 'One database of projects, owners, status, and delivery dates.'}</p>
      <div className="ar-database-toolbar"><button className="is-active">Table</button><button>Board</button><button>Timeline</button><span /><button>Filter</button><button>Sort</button><button className="ar-primary">New</button></div>
      <table><thead><tr><th>Name</th><th>Status</th><th>Owner</th><th>Target</th></tr></thead><tbody>
        {rows.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 1 ? <span className={`ar-status is-${cell.toLowerCase().replace(/\s+/g, '-')}`}>{cell}</span> : cell}</td>)}</tr>)}
      </tbody></table>
      <button type="button" className="ar-add-row">+ New item</button>
    </section>
  )
}

function KnowledgeDocument({ confluence, page, userName, commentsOpen }: { confluence: boolean; page: KnowledgePage; userName: string; commentsOpen: boolean }) {
  return (
    <div className={`ar-document-layout ${commentsOpen ? 'has-comments' : ''}`}>
      <article className="ar-document-page">
        <div className="ar-document-cover"><span>{page.icon}</span></div>
        <div className="ar-document-content">
          <span className="ar-page-emoji">{confluence ? '◇' : '🚀'}</span>
          <h1>{page.title}</h1>
          <div className="ar-document-meta"><Avatar name={userName} size={22} /> Updated {page.updated} · 6 collaborators</div>
          <p className="ar-lead">Build a calm operating system that connects decisions to customers, data, and accountable execution.</p>
          <h2>Outcome</h2>
          <p>Business owners can understand what changed, why it matters, and what needs attention without assembling reports across disconnected tools.</p>
          <aside className="ar-callout"><strong>✓ Decision</strong><span>Use one governed object model across operations, finance, and customer workflows.</span></aside>
          <h2>Current priorities</h2>
          <ul><li><input type="checkbox" defaultChecked /> Complete workspace foundation</li><li><input type="checkbox" defaultChecked /> Validate core product archetypes</li><li><input type="checkbox" /> Connect the first production data source</li></ul>
          <h2>Operating metrics</h2>
          <div className="ar-inline-metrics"><span><strong>94%</strong><small>Milestones on track</small></span><span><strong>18 mo</strong><small>Runway</small></span><span><strong>4</strong><small>Open decisions</small></span></div>
        </div>
      </article>
      {commentsOpen && <aside className="ar-comments-panel"><header><strong>{confluence ? 'Page activity' : 'Comments'}</strong><button>×</button></header><Comment name="Maya Chen" text="Can we link this decision to the customer health model?" /><Comment name={userName} text="Yes — I added the governed relationship and owner." /><label><input placeholder="Add a comment…" /><button>Send</button></label></aside>}
    </div>
  )
}

function Comment({ name, text }: { name: string; text: string }) {
  return <div className="ar-comment"><Avatar name={name} size={27} /><span><strong>{name}</strong><small>Today</small><p>{text}</p><button>Reply</button></span></div>
}

interface WorkItem {
  id: string
  title: string
  status: 'Backlog' | 'Todo' | 'In progress' | 'Review' | 'Done'
  priority: 'Urgent' | 'High' | 'Medium' | 'Low'
  owner: string
  points: number
}

const WORK_ITEMS: readonly WorkItem[] = [
  { id: 'ENG-482', title: 'Normalize provider-specific media metadata', status: 'In progress', priority: 'High', owner: 'Jun', points: 5 },
  { id: 'ENG-479', title: 'Add policy context to file actions', status: 'Review', priority: 'Urgent', owner: 'Maya', points: 3 },
  { id: 'ENG-475', title: 'Improve catalog pagination states', status: 'Todo', priority: 'Medium', owner: 'Lina', points: 3 },
  { id: 'ENG-468', title: 'Document backend conformance fixtures', status: 'Backlog', priority: 'Medium', owner: 'Noah', points: 5 },
  { id: 'ENG-463', title: 'Ship operator theme contrast update', status: 'Done', priority: 'Low', owner: 'Jun', points: 2 },
  { id: 'ENG-458', title: 'Validate action lifecycle reconnect', status: 'Done', priority: 'High', owner: 'Avery', points: 3 },
]

function WorkShowcase({ definition, view, setView, companyName, userName, initialSelectedId, onSelectItem }: ShowcaseRendererProps) {
  const jira = definition.id === 'atlassian-jira'
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? (view === 'issue-detail' ? WORK_ITEMS[0].id : ''))
  const selected = WORK_ITEMS.find(item => item.id === selectedId) ?? WORK_ITEMS[0]
  const choose = (id: string) => { setSelectedId(id); onSelectItem?.(id) }
  const labels: Record<string, string> = jira
    ? { backlog: 'Backlog', board: 'Board', 'issue-detail': 'Work item' }
    : { issues: 'My issues', cycle: 'Current cycle', 'issue-detail': 'Issue detail' }

  return (
    <div className="ar-work-shell">
      <aside className="ar-work-sidebar">
        <div className="ar-work-brand"><ProductMark definition={definition} /><strong>{definition.shortName}</strong></div>
        <button type="button" className="ar-work-search"><OperationalShowcaseIcon name="search" size={15} />Search <kbd>/</kbd></button>
        <button type="button" className="ar-work-create"><OperationalShowcaseIcon name="plus" size={15} />Create work item <kbd>C</kbd></button>
        <nav>
          <button className="is-active"><OperationalShowcaseIcon name="inbox" size={16} />My work <b>8</b></button>
          <button><OperationalShowcaseIcon name="activity" size={16} />Activity</button>
          <button><OperationalShowcaseIcon name="apps" size={16} />Views</button>
        </nav>
        <div className="ar-work-section">Workspace</div>
        <nav><button><span className="ar-team-mark">JT</span>{companyName}</button><button><OperationalShowcaseIcon name="timeline" size={16} />Roadmaps</button><button><OperationalShowcaseIcon name="document" size={16} />Projects</button></nav>
        <div className="ar-work-section">Your teams</div>
        <nav><button><span className="ar-team-dot" />Product</button><button><span className="ar-team-dot is-blue" />Platform</button></nav>
        <div className="ar-work-user"><Avatar name={userName} size={27} /><span>{userName}</span><IconButton icon="settings" label="Settings" /></div>
      </aside>
      <main className="ar-work-main">
        <header className="ar-work-topbar"><div><span>{companyName}</span><b>/</b><strong>{jira ? 'Platform delivery' : 'My issues'}</strong></div><div className="ar-top-actions"><IconButton icon="filter" label="Filter" /><IconButton icon="more" label="More" /><Avatar name={userName} /></div></header>
        <section className="ar-work-content">
          <div className="ar-work-heading"><div><span className="ar-eyebrow">{jira ? 'Software project' : 'Workspace'}</span><h1>{jira ? 'Platform delivery' : 'My issues'}</h1><p>{jira ? 'Plan, prioritize, and ship the shared operating platform.' : 'Work assigned to you across teams and projects.'}</p></div><button type="button" className="ar-primary">+ Create</button></div>
          <ViewTabs definition={definition} view={view} setView={next => { setView(next); if (next === 'issue-detail' && !selectedId) setSelectedId(WORK_ITEMS[0].id) }} labels={labels} />
          {view === 'board'
            ? <WorkBoard items={WORK_ITEMS} choose={choose} />
            : <WorkList items={WORK_ITEMS} jira={jira} choose={choose} cycle={view === 'cycle' || view === 'backlog'} />}
        </section>
        {selectedId && <WorkDetail item={selected} userName={userName} onClose={() => setSelectedId('')} />}
      </main>
    </div>
  )
}

function WorkList({ items, jira, choose, cycle }: { items: readonly WorkItem[]; jira: boolean; choose: (id: string) => void; cycle: boolean }) {
  return (
    <div className="ar-work-list">
      {cycle && <div className="ar-cycle-summary"><span><strong>{jira ? 'Sprint 14' : 'Cycle 28'}</strong><small>Jul 15 – Jul 28 · 8 days remaining</small></span><div><i style={{ width: '63%' }} /><b>63%</b></div><em>21 / 34 points</em></div>}
      {['In progress', 'Review', 'Todo', 'Backlog', 'Done'].map(status => {
        const group = items.filter(item => item.status === status)
        if (!group.length) return null
        return <section key={status}><header><span>⌄</span><strong>{status}</strong><b>{group.length}</b><i /></header>{group.map(item => <button type="button" key={item.id} onClick={() => choose(item.id)}><span className={`ar-priority is-${item.priority.toLowerCase()}`}>◆</span><code>{item.id}</code><strong>{item.title}</strong><em>{item.points}</em><Avatar name={item.owner} size={23} /></button>)}</section>
      })}
    </div>
  )
}

function WorkBoard({ items, choose }: { items: readonly WorkItem[]; choose: (id: string) => void }) {
  return <div className="ar-work-board">{['Todo', 'In progress', 'Review', 'Done'].map(status => <section key={status}><header><strong>{status}</strong><b>{items.filter(item => item.status === status).length}</b><button>+</button></header>{items.filter(item => item.status === status).map(item => <button type="button" className="ar-work-card" key={item.id} onClick={() => choose(item.id)}><span><i className={`ar-priority is-${item.priority.toLowerCase()}`}>◆</i><code>{item.id}</code></span><strong>{item.title}</strong><footer><em>{item.points} pts</em><Avatar name={item.owner} size={22} /></footer></button>)}</section>)}</div>
}

function WorkDetail({ item, userName, onClose }: { item: WorkItem; userName: string; onClose: () => void }) {
  return <aside className="ar-work-detail"><header><span><code>{item.id}</code><b>/</b>{item.status}</span><button onClick={onClose} aria-label="Close issue">×</button></header><div className="ar-work-detail-body"><span className={`ar-priority is-${item.priority.toLowerCase()}`}>◆ {item.priority}</span><h2>{item.title}</h2><p>Make the shared contract explicit, preserve provider independence, and cover the behavior with fixtures before integration begins.</p><dl><dt>Status</dt><dd><span className="ar-status is-in-progress">{item.status}</span></dd><dt>Assignee</dt><dd><Avatar name={item.owner} size={22} />{item.owner}</dd><dt>Estimate</dt><dd>{item.points} points</dd><dt>Cycle</dt><dd>Cycle 28</dd></dl><h3>Activity</h3><Comment name={userName} text="The adapter boundary is documented and ready for review." /></div><footer><input placeholder="Leave a comment…" /><button>Send</button></footer></aside>
}

interface CodeFile {
  path: string
  additions: number
  deletions: number
}

const CODE_FILES: readonly CodeFile[] = [
  { path: 'src/core/providerAdapter.ts', additions: 48, deletions: 6 },
  { path: 'src/core/providerAdapter.test.ts', additions: 72, deletions: 0 },
  { path: 'docs/integrations.md', additions: 24, deletions: 3 },
]

function CodeShowcase({ definition, view, setView, companyName, userName }: ShowcaseRendererProps) {
  const gitlab = definition.id === 'gitlab'
  const labels: Record<string, string> = gitlab
    ? { 'merge-request': 'Overview', changes: 'Changes', pipeline: 'Pipelines' }
    : { 'pull-request': 'Conversation', 'files-changed': 'Files changed', actions: 'Checks' }
  return (
    <div className="ar-code-shell">
      <header className="ar-code-global"><IconButton icon="menu" label="Navigation" /><ProductMark definition={definition} /><label><OperationalShowcaseIcon name="search" size={16} /><input placeholder="Type / to search" /></label><div className="ar-top-actions"><IconButton icon="plus" label="Create" /><IconButton icon="inbox" label="Issues" /><IconButton icon="bell" label="Notifications" /><Avatar name={userName} /></div></header>
      <div className="ar-repo-header"><div className="ar-repo-title"><span title={companyName}>{companyName.toLowerCase().replace(/\s+/g, '-')}</span><b>/</b><strong>medallion-platform</strong><em>Private</em></div><div><button>Watch 12</button><button>Fork 3</button><button>★ Star 28</button></div></div>
      <nav className="ar-repo-nav">{[['code', 'Code'], ['ticket', 'Issues 18'], ['graph', gitlab ? 'Merge requests 4' : 'Pull requests 4'], ['activity', gitlab ? 'CI/CD' : 'Actions'], ['shield', 'Security'], ['graph', 'Insights']].map(([icon, label]) => <button key={label} className={(label.startsWith(gitlab ? 'Merge' : 'Pull')) ? 'is-active' : ''}><OperationalShowcaseIcon name={icon as OperationalShowcaseIconName} size={15} />{label}</button>)}</nav>
      <main className="ar-code-main">
        <div className="ar-code-heading"><span className="ar-merge-state">{gitlab ? 'Open' : 'Open'}</span><div><h1>Normalize provider adapters <small>#{gitlab ? '84' : '126'}</small></h1><p><strong>{userName.toLowerCase()}</strong> wants to merge 3 commits into <code>main</code> from <code>feature/provider-contract</code></p></div></div>
        <ViewTabs definition={definition} view={view} setView={setView} labels={labels} />
        {view === 'actions' || view === 'pipeline'
          ? <PipelineView gitlab={gitlab} />
          : view === 'files-changed' || view === 'changes'
            ? <DiffView files={CODE_FILES} />
            : <CodeConversation gitlab={gitlab} userName={userName} />}
      </main>
    </div>
  )
}

function CodeConversation({ gitlab, userName }: { gitlab: boolean; userName: string }) {
  return <div className="ar-code-columns"><section className="ar-code-timeline"><div className="ar-review-card"><header><Avatar name="Maya Chen" size={30} /><strong>Maya Chen approved these changes</strong><span>42 minutes ago</span></header><p>The normalization boundary looks right. I left one suggestion around retry metadata.</p></div><div className="ar-commit-row"><span>✓</span><strong>{userName} added 3 commits</strong><time>1 hour ago</time></div><div className="ar-review-card"><header><Avatar name={userName} size={30} /><strong>{userName} commented</strong><span>12 minutes ago</span></header><p>Updated the fixture and documented how hosts preserve provider-specific fields.</p><pre><code>adapter.normalize(source, {'{'} preserveMetadata: true {'}'})</code></pre></div><label className="ar-code-comment"><textarea placeholder="Leave a comment" /><footer><button>Close {gitlab ? 'merge request' : 'pull request'}</button><button className="ar-primary">Comment</button></footer></label></section><aside className="ar-code-sidebar"><section><strong>Reviewers</strong><span><Avatar name="Maya Chen" size={22} /> Maya Chen <b>✓</b></span></section><section><strong>Assignees</strong><span><Avatar name={userName} size={22} /> {userName}</span></section><section><strong>Labels</strong><div><em>enhancement</em><em>platform</em></div></section><section><strong>Development</strong><p>Successfully merging may close <a>ENG-482</a>.</p></section><div className="ar-merge-box"><span>✓</span><strong>All checks have passed</strong><small>3 successful checks</small><button>{gitlab ? 'Merge' : 'Squash and merge'}</button></div></aside></div>
}

function DiffView({ files }: { files: readonly CodeFile[] }) {
  return <div className="ar-diff-layout"><aside>{files.map((file, index) => <button className={index === 0 ? 'is-active' : ''} key={file.path}><span>{file.path}</span><em>+{file.additions} −{file.deletions}</em></button>)}</aside><section className="ar-diff-file"><header><strong>src/core/providerAdapter.ts</strong><span>+48 −6</span><button>Viewed</button></header><pre>{[
    [' ', 'export interface ProviderAdapter<TSource, TCanonical> {'],
    ['+', '  readonly provider: string'],
    ['+', '  normalize(source: TSource, options?: NormalizeOptions): TCanonical'],
    ['+', '  denormalize(value: TCanonical): TSource'],
    [' ', '}'],
    [' ', ''],
    ['-', 'export function normalizeProvider(value: unknown) {'],
    ['+', 'export function createProviderAdapter<TSource, TCanonical>('],
    ['+', '  adapter: ProviderAdapter<TSource, TCanonical>,'],
    ['+', '): ProviderAdapter<TSource, TCanonical> {'],
    ['+', '  return Object.freeze(adapter)'],
    [' ', '}'],
  ].map(([kind, line], index) => <span className={kind === '+' ? 'is-add' : kind === '-' ? 'is-del' : ''} key={`${line}-${index}`}><i>{index + 18}</i><b>{kind}</b><code>{line}</code></span>)}</pre></section></div>
}

function PipelineView({ gitlab }: { gitlab: boolean }) {
  const jobs = [['TypeScript', 'Passed', '42s'], ['Unit tests', 'Passed', '1m 18s'], ['Storybook', 'Passed', '2m 44s'], ['Package audit', 'Passed', '31s']]
  return <section className="ar-pipeline"><header><div className="ar-pipeline-status">✓</div><span><h2>All checks have passed</h2><p>{gitlab ? 'Pipeline #2814 passed' : '4 successful checks'} for <code>feature/provider-contract</code></p></span><button>Re-run jobs</button></header><div className="ar-pipeline-graph"><span className="is-done">Build</span><i /><span className="is-done">Test</span><i /><span className="is-done">Review</span><i /><span className="is-done">Package</span></div><div className="ar-job-list">{jobs.map(([name, status, duration]) => <button key={name}><span>✓</span><strong>{name}</strong><em>{status}</em><time>{duration}</time><b>›</b></button>)}</div></section>
}

const MARKET_ROWS = [
  ['BTC', 'Bitcoin', '$67,842.10', '+2.48%', '$1.34T', [14, 18, 17, 23, 22, 31, 35, 33, 42]],
  ['ETH', 'Ethereum', '$3,542.18', '+1.36%', '$425.8B', [18, 21, 19, 25, 28, 26, 32, 36, 39]],
  ['SOL', 'Solana', '$178.42', '+4.82%', '$83.7B', [11, 15, 14, 19, 17, 24, 29, 27, 36]],
  ['BNB', 'BNB', '$612.70', '-0.34%', '$91.1B', [30, 28, 31, 29, 25, 27, 24, 23, 22]],
  ['USDC', 'USDC', '$1.00', '+0.01%', '$61.4B', [20, 20, 20, 20, 20, 20, 20, 20, 20]],
] as const

function MarketShowcase(props: ShowcaseRendererProps) {
  if (props.definition.id === 'coingecko') return <CoinTrackerShowcase {...props} />
  if (props.definition.id === 'polymarket') return <PredictionShowcase {...props} />
  return <TradingTerminalShowcase {...props} />
}

function TinyLine({ values, positive = true }: { values: readonly number[]; positive?: boolean }) {
  const min = Math.min(...values); const max = Math.max(...values); const range = Math.max(1, max - min)
  const points = values.map((value, index) => `${index * 120 / (values.length - 1)},${34 - (value - min) * 30 / range}`).join(' ')
  return <svg className={`ar-tiny-line ${positive ? 'is-positive' : 'is-negative'}`} viewBox="0 0 120 38" preserveAspectRatio="none" aria-hidden="true"><polyline points={points} /></svg>
}

function TradingTerminalShowcase({ definition, view, setView, companyName, userName }: ShowcaseRendererProps) {
  const ibkr = definition.id === 'interactive-brokers-trader-workstation'
  const labels: Record<string, string> = ibkr ? { mosaic: 'Mosaic', portfolio: 'Portfolio', 'order-entry': 'Order entry' } : { spot: 'Spot', 'open-orders': 'Open orders', wallet: 'Wallet' }
  return <div className="ar-terminal-shell"><header className="ar-terminal-topbar"><a className="ar-brand" href="#terminal" onClick={event => event.preventDefault()}><ProductMark definition={definition} /><strong>{definition.shortName}</strong></a><nav>{(ibkr ? ['File', 'New Window', 'Research', 'Analytical Tools'] : ['Buy Crypto', 'Markets', 'Trade', 'Derivatives', 'Earn']).map(item => <button key={item}>{item}</button>)}</nav><div className="ar-top-actions"><span className="ar-live-dot" />Live data<span className="ar-account-name">{companyName}</span><IconButton icon="bell" label="Alerts" /><Avatar name={userName} /></div></header><ViewTabs definition={definition} view={view} setView={setView} labels={labels} />
    <main className="ar-terminal-grid">
      <section className="ar-terminal-watch"><header><strong>{view === 'portfolio' || view === 'wallet' ? 'Portfolio' : 'Watchlist'}</strong><button>+</button></header>{MARKET_ROWS.slice(0, 5).map((row, index) => <button className={index === 0 ? 'is-active' : ''} key={row[0]}><span><strong>{row[0]}</strong><small>{row[1]}</small></span><b>{row[2]}</b><em className={String(row[3]).startsWith('-') ? 'is-negative' : 'is-positive'}>{row[3]}</em></button>)}</section>
      <section className="ar-terminal-chart"><header><div><strong>BTC/{ibkr ? 'USD' : 'USDT'}</strong><span>Bitcoin · {ibkr ? 'NASDAQ Digital' : 'Spot'}</span></div><b>$67,842.10</b><em>+2.48%</em></header><div className="ar-chart-toolbar"><button>1m</button><button>5m</button><button className="is-active">1h</button><button>4h</button><button>1D</button><span /><button>Indicators</button><button>Drawing</button></div><PriceChart /><footer><span>O 66,982.4</span><span>H 68,144.8</span><span>L 66,731.2</span><span>C 67,842.1</span><b>Vol 18.4K</b></footer></section>
      <section className="ar-terminal-book"><header><strong>Order book</strong><span>0.10</span></header><div className="ar-book-head"><span>Price</span><span>Size</span><span>Total</span></div>{[67912, 67898, 67876, 67861, 67850].map((price, index) => <div className="is-ask" key={price} style={{ '--depth': `${82 - index * 12}%` } as CSSProperties}><span>{price.toLocaleString()}</span><span>{(0.18 + index * .13).toFixed(3)}</span><span>{(1.2 + index * .7).toFixed(2)}</span></div>)}<div className="ar-mid-price"><strong>67,842.10</strong><span>↑ 67,841.90</span></div>{[67839, 67821, 67798, 67776, 67751].map((price, index) => <div className="is-bid" key={price} style={{ '--depth': `${76 - index * 11}%` } as CSSProperties}><span>{price.toLocaleString()}</span><span>{(0.24 + index * .11).toFixed(3)}</span><span>{(1.1 + index * .8).toFixed(2)}</span></div>)}</section>
      <section className="ar-terminal-ticket"><header><strong>{view === 'order-entry' ? 'Advanced order entry' : 'Order entry'}</strong><span>Available $84,218.42</span></header><div className="ar-buy-sell"><button className="is-buy">Buy</button><button>Sell</button></div><label><span>Order type</span><select defaultValue="Limit"><option>Limit</option><option>Market</option><option>Stop</option></select></label><label><span>Price</span><input defaultValue="67,820.00" /><b>USD</b></label><label><span>Quantity</span><input defaultValue="0.10" /><b>BTC</b></label><div className="ar-ticket-slider"><i /><b style={{ left: '36%' }} />{['0%', '25%', '50%', '75%', '100%'].map(value => <span key={value}>{value}</span>)}</div>{ibkr && <label><span>Time in force</span><select><option>DAY</option><option>GTC</option></select></label>}<dl><dt>Order value</dt><dd>$6,782.00</dd><dt>Estimated fee</dt><dd>$6.78</dd></dl><button className="ar-submit-buy">Buy BTC</button></section>
      <section className="ar-terminal-orders"><header><strong>{view === 'portfolio' || view === 'wallet' ? 'Positions' : 'Open orders'}</strong><nav><button className="is-active">Open</button><button>History</button><button>Trades</button></nav></header><table><thead><tr><th>Symbol</th><th>Side</th><th>Type</th><th>Price</th><th>Amount</th><th>Filled</th><th>Status</th></tr></thead><tbody><tr><td>BTC/{ibkr ? 'USD' : 'USDT'}</td><td className="is-positive">Buy</td><td>Limit</td><td>67,120.00</td><td>0.08 BTC</td><td>0%</td><td>Working</td></tr><tr><td>ETH/{ibkr ? 'USD' : 'USDT'}</td><td className="is-negative">Sell</td><td>Stop limit</td><td>3,480.00</td><td>1.40 ETH</td><td>35%</td><td>Partially filled</td></tr></tbody></table></section>
    </main></div>
}

function PriceChart() {
  return <svg className="ar-price-chart" viewBox="0 0 700 280" preserveAspectRatio="none" role="img" aria-label="BTC price chart"><defs><linearGradient id="ar-price-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--ar-accent)" stopOpacity=".22"/><stop offset="1" stopColor="var(--ar-accent)" stopOpacity="0"/></linearGradient></defs>{[40, 90, 140, 190, 240].map(y => <line key={y} x1="0" x2="700" y1={y} y2={y} className="ar-chart-grid" />)}<path d="M0 238 C36 225 56 241 88 214 S137 164 171 184 S224 218 260 181 S307 118 345 143 S391 166 426 114 S474 67 507 88 S552 127 584 91 S642 39 700 51 L700 280 L0 280Z" fill="url(#ar-price-fill)"/><path d="M0 238 C36 225 56 241 88 214 S137 164 171 184 S224 218 260 181 S307 118 345 143 S391 166 426 114 S474 67 507 88 S552 127 584 91 S642 39 700 51" className="ar-chart-line"/><line x1="0" x2="700" y1="51" y2="51" className="ar-price-guide"/><text x="630" y="44">67,842.10</text></svg>
}

function CoinTrackerShowcase({ definition, view, setView, companyName, userName, onSelectItem }: ShowcaseRendererProps) {
  const detail = view === 'coin-detail'
  return <div className="ar-tracker-shell"><header className="ar-tracker-topbar"><a className="ar-brand" href="#markets" onClick={event => event.preventDefault()}><ProductMark definition={definition} /><strong>CoinGecko</strong></a><nav><button>Cryptocurrencies</button><button>Exchanges</button><button>NFT</button><button>Learn</button></nav><label><OperationalShowcaseIcon name="search" size={16} /><input placeholder="Search" /></label><button>⭐ {companyName} portfolio</button><Avatar name={userName} /></header><div className="ar-market-ticker"><span>Coins <b>18,421</b></span><span>Market Cap <b>$2.48T</b> <em>+1.8%</em></span><span>24h Vol <b>$86.4B</b></span><span>Dominance <b>BTC 53.8%</b></span></div><ViewTabs definition={definition} view={view} setView={setView} labels={{ markets: 'Market rankings', 'coin-detail': 'Bitcoin', portfolio: 'Portfolio' }} /><main className="ar-tracker-main">{detail ? <CoinDetail /> : <><div className="ar-tracker-heading"><div><h1>{view === 'portfolio' ? 'My portfolio' : 'Cryptocurrency prices by market cap'}</h1><p>{view === 'portfolio' ? 'Track holdings and watchlist performance.' : 'Global market rankings, prices, volume, and seven-day trends.'}</p></div><button className="ar-primary">{view === 'portfolio' ? '+ Add transaction' : 'Customize'}</button></div><div className="ar-market-filters"><button className="is-active">All</button><button>Highlights</button><button>Categories</button><button>Chains</button><span /><label><OperationalShowcaseIcon name="search" size={15} /><input placeholder="Search assets" /></label></div><table className="ar-market-table"><thead><tr><th>#</th><th>Coin</th><th>Price</th><th>24h</th><th>{view === 'portfolio' ? 'Holdings' : 'Market cap'}</th><th>Last 7 days</th></tr></thead><tbody>{MARKET_ROWS.map((row, index) => <tr key={row[0]} onClick={() => { setView('coin-detail'); onSelectItem?.(row[0]) }}><td>☆ {index + 1}</td><td><span className="ar-coin-mark">{row[0][0]}</span><strong>{row[1]}</strong><small>{row[0]}</small></td><td>{row[2]}</td><td className={String(row[3]).startsWith('-') ? 'is-negative' : 'is-positive'}>{row[3]}</td><td>{view === 'portfolio' ? `$${[18420, 8290, 3784, 1830, 1240][index].toLocaleString()}` : row[4]}</td><td><TinyLine values={row[5]} positive={!String(row[3]).startsWith('-')} /></td></tr>)}</tbody></table></>}</main></div>
}

function CoinDetail() {
  return <div className="ar-coin-detail"><section className="ar-coin-summary"><div className="ar-coin-heading"><span className="ar-coin-mark is-large">B</span><div><h1>Bitcoin <small>BTC</small></h1><span>Rank #1 · Proof of Work</span></div><button>☆ Add to portfolio</button></div><div className="ar-coin-price"><strong>$67,842.10</strong><em>+2.48%</em><span>0.998 BTC</span></div><div className="ar-range"><span>$66,214</span><i><b style={{ width: '72%' }} /></i><span>$68,145</span></div><dl><dt>Market cap</dt><dd>$1.34T</dd><dt>24h trading volume</dt><dd>$38.6B</dd><dt>Circulating supply</dt><dd>19.8M BTC</dd><dt>All-time high</dt><dd>$73,737</dd></dl></section><section className="ar-coin-chart"><header><h2>Bitcoin price chart</h2><div><button className="is-active">Price</button><button>Market cap</button></div></header><PriceChart /><footer>{['24H', '7D', '1M', '3M', '1Y', 'Max'].map(value => <button className={value === '7D' ? 'is-active' : ''} key={value}>{value}</button>)}</footer></section><aside className="ar-coin-info"><h2>Bitcoin information</h2><p>Decentralized digital asset secured by a proof-of-work network.</p><dl><dt>Website</dt><dd>bitcoin.org ↗</dd><dt>Explorers</dt><dd>Mempool · Blockchair</dd><dt>Categories</dt><dd>Layer 1 · Store of value</dd></dl><button>Read more</button></aside></div>
}

interface PredictionMarket {
  id: string; question: string; category: string; yes: number; volume: string; change: string
}
const PREDICTION_MARKETS: readonly PredictionMarket[] = [
  { id: 'rates', question: 'Will the Fed cut rates before October?', category: 'Economy', yes: 64, volume: '$18.4M', change: '+6' },
  { id: 'ai', question: 'Will an open model lead the benchmark by year-end?', category: 'Technology', yes: 42, volume: '$6.8M', change: '+3' },
  { id: 'launch', question: 'Will the platform launch before August 31?', category: 'Business', yes: 78, volume: '$2.1M', change: '-2' },
  { id: 'inflation', question: 'Will US CPI print below 2.5% in Q4?', category: 'Economy', yes: 37, volume: '$9.7M', change: '+1' },
]

function PredictionShowcase({ definition, view, setView, companyName, userName, initialSelectedId, onSelectItem }: ShowcaseRendererProps) {
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? 'rates')
  const selected = PREDICTION_MARKETS.find(market => market.id === selectedId) ?? PREDICTION_MARKETS[0]
  const detail = view === 'market-detail'
  return <div className="ar-prediction-shell"><header className="ar-prediction-topbar"><a className="ar-brand" href="#prediction" onClick={event => event.preventDefault()}><ProductMark definition={definition} /><strong>Polymarket</strong></a><label><OperationalShowcaseIcon name="search" size={16} /><input placeholder="Search markets" /></label><nav><button>Markets</button><button>Live</button><button>Activity</button><button>Leaderboard</button></nav><button className="ar-balance">{companyName} · $12,840</button><Avatar name={userName} /></header><div className="ar-prediction-categories">{['Trending', 'Politics', 'Sports', 'Crypto', 'Economy', 'Technology', 'Culture'].map((item, index) => <button className={index === 0 ? 'is-active' : ''} key={item}>{item}</button>)}</div><ViewTabs definition={definition} view={view} setView={setView} labels={{ discovery: 'Discover', 'market-detail': 'Market detail', portfolio: 'Portfolio' }} /><main className="ar-prediction-main">{detail ? <PredictionDetail market={selected} /> : <><div className="ar-prediction-heading"><div><span className="ar-eyebrow">{view === 'portfolio' ? 'Your positions' : 'Live markets'}</span><h1>{view === 'portfolio' ? 'Portfolio' : 'What will happen next?'}</h1></div><button>Newest⌄</button></div><div className="ar-market-card-grid">{PREDICTION_MARKETS.map(market => <button type="button" className="ar-market-card" key={market.id} onClick={() => { setSelectedId(market.id); setView('market-detail'); onSelectItem?.(market.id) }}><header><span>{market.category[0]}</span><em>{market.category}</em><time>Dec 31</time></header><h2>{market.question}</h2><div className="ar-probability"><strong>{market.yes}%</strong><span>chance</span><em className={market.change.startsWith('-') ? 'is-negative' : 'is-positive'}>{market.change} pts</em></div><TinyLine values={[28, 31, 34, 32, 39, 45, 43, market.yes]} positive={!market.change.startsWith('-')} /><div className="ar-outcome-buttons"><span>Yes <b>{market.yes}¢</b></span><span>No <b>{100 - market.yes}¢</b></span></div><footer><span>Vol. {market.volume}</span><span>◎ 4.2k traders</span></footer></button>)}</div></>}</main></div>
}

function PredictionDetail({ market }: { market: PredictionMarket }) {
  return <div className="ar-prediction-detail"><section className="ar-prediction-chart"><div className="ar-prediction-title"><span>{market.category[0]}</span><div><em>{market.category}</em><h1>{market.question}</h1><p>Resolves according to the published official release before the stated deadline.</p></div></div><div className="ar-probability-large"><strong>{market.yes}%</strong><span>chance</span><em>+6 pts this week</em></div><PriceChart /><div className="ar-time-controls">{['1H', '6H', '1D', '1W', '1M', 'ALL'].map(item => <button className={item === '1W' ? 'is-active' : ''} key={item}>{item}</button>)}</div><article><h2>Resolution rules</h2><p>This market resolves “Yes” if the referenced event occurs before 11:59 PM ET on the closing date. Primary sources are used for resolution.</p></article></section><aside className="ar-prediction-trade"><h2>Trade</h2><div className="ar-buy-sell"><button className="is-buy">Buy</button><button>Sell</button></div><div className="ar-outcome-select"><button className="is-active">Yes <b>{market.yes}¢</b></button><button>No <b>{100 - market.yes}¢</b></button></div><label><span>Amount</span><input defaultValue="100" /><b>USDC</b></label><div className="ar-trade-summary"><span>Average price <b>{market.yes}¢</b></span><span>Potential return <b>$156.25</b></span></div><button className="ar-primary">Review order</button><h3>Order book</h3>{[68, 66, 65, 64, 62].map((price, index) => <div className="ar-prediction-level" key={price}><span>{price}¢</span><i style={{ width: `${84 - index * 12}%` }} /><b>${(420 + index * 160).toLocaleString()}</b></div>)}</aside></div>
}

function AnalyticsShowcase({ definition, view, setView, companyName, userName }: ShowcaseRendererProps) {
  const superset = definition.id === 'apache-superset'
  const labels: Record<string, string> = superset ? { dashboard: 'Dashboard', explore: 'Explore chart', 'sql-lab': 'SQL Lab' } : { dashboard: 'Dashboard', explore: 'Explore', alerting: 'Alerting' }
  return <div className="ar-analytics-shell"><header className="ar-analytics-topbar"><a className="ar-brand" href="#analytics" onClick={event => event.preventDefault()}><ProductMark definition={definition} /><strong>{definition.shortName}</strong></a><nav>{(superset ? ['Dashboards', 'Charts', 'Datasets', 'SQL'] : ['Home', 'Dashboards', 'Explore', 'Alerting', 'Connections']).map(item => <button key={item}>{item}</button>)}</nav><label><OperationalShowcaseIcon name="search" size={15} /><input placeholder="Search" /></label><div className="ar-top-actions"><IconButton icon="plus" label="Create" /><IconButton icon="help" label="Help" /><Avatar name={userName} /></div></header><div className="ar-analytics-body"><aside className="ar-analytics-sidebar"><div className="ar-analytics-org"><span>JT</span><strong>{companyName}</strong></div><nav>{(superset ? [['home', 'Home'], ['chart', 'Dashboards'], ['database', 'Datasets'], ['code', 'SQL Lab'], ['settings', 'Settings']] : [['home', 'Home'], ['search', 'Search'], ['chart', 'Dashboards'], ['activity', 'Explore'], ['bell', 'Alerting'], ['database', 'Data sources']]).map(([icon, label], index) => <button className={index === (view === 'dashboard' ? 2 : view === 'alerting' ? 4 : 3) ? 'is-active' : ''} key={label}><OperationalShowcaseIcon name={icon as OperationalShowcaseIconName} size={16} />{label}</button>)}</nav><div className="ar-analytics-saved"><span>Starred</span><button>Operations overview</button><button>Revenue quality</button><button>Platform health</button></div></aside><main className="ar-analytics-main"><header><div><span className="ar-eyebrow">{superset ? 'Business intelligence' : 'Operations'}</span><h1>{view === 'dashboard' ? 'Operating platform overview' : titleCase(view)}</h1></div><div><button>Last 24 hours⌄</button><button>Refresh</button><button className="ar-primary">{superset ? 'Edit dashboard' : 'Share'}</button></div></header><ViewTabs definition={definition} view={view} setView={setView} labels={labels} />{view === 'dashboard' ? <AnalyticsDashboard superset={superset} /> : view === 'alerting' ? <AlertingView /> : <AnalyticsExplorer sql={view === 'sql-lab'} superset={superset} />}</main></div></div>
}

function AnalyticsDashboard({ superset }: { superset: boolean }) {
  return <div className="ar-dashboard-grid"><section className="ar-stat-panel"><header><strong>{superset ? 'Net revenue' : 'Requests / sec'}</strong><button>⋮</button></header><b>{superset ? '$842K' : '18.4k'}</b><em>+12.8%</em><TinyLine values={[12, 16, 15, 19, 23, 22, 28, 31, 35]} /></section><section className="ar-stat-panel"><header><strong>{superset ? 'Gross margin' : 'Error rate'}</strong><button>⋮</button></header><b>{superset ? '68.4%' : '0.18%'}</b><em className={superset ? '' : 'is-negative'}>{superset ? '+2.1 pts' : '+0.03%'}</em><TinyLine values={[22, 20, 19, 21, 18, 16, 17, 15, 14]} positive={superset} /></section><section className="ar-stat-panel"><header><strong>{superset ? 'Active customers' : 'P95 latency'}</strong><button>⋮</button></header><b>{superset ? '1,284' : '184 ms'}</b><em>Within target</em><TinyLine values={[17, 18, 18, 21, 23, 22, 26, 27, 29]} /></section><section className="ar-wide-chart"><header><div><strong>{superset ? 'Revenue by segment' : 'Service throughput'}</strong><span>{superset ? 'Monthly performance' : 'requests/sec by service'}</span></div><button>⋮</button></header><PriceChart /><div className="ar-chart-legend"><span><i />Core platform</span><span><i />Data services</span><span><i />Media</span></div></section><section className="ar-health-panel"><header><strong>{superset ? 'Pipeline by stage' : 'Service health'}</strong><button>⋮</button></header>{[['API gateway', '99.99%', 'Healthy'], ['Data service', '99.96%', 'Healthy'], ['Media worker', '99.81%', 'Warning'], ['Action service', '99.98%', 'Healthy']].map(row => <div key={row[0]}><span><i className={row[2] === 'Warning' ? 'is-warning' : ''} /><strong>{row[0]}</strong></span><b>{row[1]}</b><em>{row[2]}</em></div>)}</section><section className="ar-log-panel"><header><strong>{superset ? 'Recent transactions' : 'Live events'}</strong><button>⋮</button></header>{[['10:42:18', 'info', 'Action completed for customer-104'], ['10:42:11', 'info', 'Catalog refresh finished in 842ms'], ['10:41:58', 'warn', 'Media queue above target depth'], ['10:41:44', 'info', 'Snapshot published successfully']].map(row => <div key={row[0]}><time>{row[0]}</time><em className={`is-${row[1]}`}>{row[1]}</em><span>{row[2]}</span></div>)}</section></div>
}

function AnalyticsExplorer({ sql, superset }: { sql: boolean; superset: boolean }) {
  return <div className="ar-explorer"><aside><header><strong>{sql ? 'SQL editor' : 'Query'}</strong><button>+</button></header><label><span>Data source</span><select><option>{superset ? 'Jim Technologies warehouse' : 'Prometheus'}</option></select></label><label><span>{sql ? 'Schema' : 'Metric'}</span><select><option>{sql ? 'analytics' : 'http_request_duration_seconds'}</option></select></label><label><span>{sql ? 'Query' : 'Label filters'}</span><textarea defaultValue={sql ? 'SELECT date, segment, SUM(net_revenue)\nFROM analytics.daily_revenue\nGROUP BY 1, 2\nORDER BY 1' : 'service=~"api|data|media"\nenvironment="production"'} /></label><button className="ar-primary">Run query</button></aside><section><header><div><strong>{sql ? 'Query results' : 'Time series'}</strong><span>Last run 182 ms ago</span></div><button>Download</button></header><PriceChart /><div className="ar-result-table"><div><strong>timestamp</strong><strong>service</strong><strong>value</strong></div>{[['10:42:00', 'api', '18,420'], ['10:41:00', 'data', '12,842'], ['10:40:00', 'media', '4,281'], ['10:39:00', 'actions', '1,948']].map(row => <div key={row[0]}>{row.map(cell => <span key={cell}>{cell}</span>)}</div>)}</div></section></div>
}

function AlertingView() {
  return <section className="ar-alerting"><div className="ar-alert-summary"><span><strong>2</strong><small>Firing</small></span><span><strong>1</strong><small>Pending</small></span><span><strong>18</strong><small>Normal</small></span><button className="ar-primary">+ New alert rule</button></div>{[['Media queue depth', 'Firing', 'media-workers', 'For 14m'], ['Customer sync lag', 'Firing', 'data-service', 'For 8m'], ['API error budget', 'Pending', 'api-gateway', 'For 2m'], ['Action lifecycle latency', 'Normal', 'actions', 'Evaluated 1m ago']].map(row => <button className="ar-alert-row" key={row[0]}><i className={`is-${row[1].toLowerCase()}`} /><span><strong>{row[0]}</strong><small>{row[2]}</small></span><em>{row[1]}</em><time>{row[3]}</time><b>›</b></button>)}</section>
}

interface ChatItem { id: string; name: string; preview: string; time: string; unread?: number }
const CHAT_ITEMS: readonly ChatItem[] = [
  { id: 'operations', name: 'Operations team', preview: 'Maya: The review is ready.', time: '10:42 AM', unread: 3 },
  { id: 'maya', name: 'Maya Chen', preview: 'Can you check the launch dates?', time: '9:18 AM' },
  { id: 'customer', name: 'Northwind launch', preview: 'Lina: Shared a document', time: 'Yesterday', unread: 1 },
  { id: 'finance', name: 'Finance', preview: 'Forecast was updated.', time: 'Yesterday' },
  { id: 'family', name: 'Jim Technologies social', preview: 'Noah: Great work everyone 🎉', time: 'Monday' },
]

function ConversationShowcase(props: ShowcaseRendererProps) {
  return props.definition.id === 'openai-chatgpt' ? <AssistantShowcase {...props} /> : <WhatsAppShowcase {...props} />
}

function WhatsAppShowcase({ definition, view, setView, userName, initialSelectedId, onSelectItem }: ShowcaseRendererProps) {
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? 'operations')
  const selected = CHAT_ITEMS.find(item => item.id === selectedId) ?? CHAT_ITEMS[0]
  return <div className="ar-whatsapp-shell"><div className="ar-chat-rail"><ProductMark definition={definition} /><nav><button className="is-active"><OperationalShowcaseIcon name="message" size={20} /><b>4</b></button><button><OperationalShowcaseIcon name="activity" size={20} /></button><button><OperationalShowcaseIcon name="people" size={20} /></button><button><OperationalShowcaseIcon name="phone" size={20} /></button></nav><div><IconButton icon="settings" label="Settings" /><Avatar name={userName} size={31} /></div></div><aside className="ar-chat-list"><header><h1>{view === 'communities' ? 'Communities' : 'Chats'}</h1><div><IconButton icon="plus" label="New chat" /><IconButton icon="more" label="More" /></div></header><label><OperationalShowcaseIcon name="search" size={15} /><input placeholder="Search or start a new chat" /></label><ViewTabs definition={definition} view={view} setView={setView} labels={{ chat: 'All', communities: 'Communities', media: 'Media' }} />{CHAT_ITEMS.map(chat => <button type="button" key={chat.id} className={selectedId === chat.id ? 'is-active' : ''} onClick={() => { setSelectedId(chat.id); onSelectItem?.(chat.id) }}><Avatar name={chat.name} size={45} /><span><strong>{chat.name}</strong><small>{chat.preview}</small></span><time>{chat.time}</time>{chat.unread && <b>{chat.unread}</b>}</button>)}</aside><main className="ar-chat-thread"><header><Avatar name={selected.name} size={37} /><span><strong>{selected.name}</strong><small>5 participants · online</small></span><div><IconButton icon="video" label="Video call" /><IconButton icon="phone" label="Call" /><IconButton icon="search" label="Search" /><IconButton icon="more" label="More" /></div></header><div className="ar-message-wall"><time>Today</time><p className="is-system">Messages are protected by your organization’s communication policy.</p><div className="ar-bubble is-other"><strong>Maya Chen</strong><p>The operating review is ready. I linked the customer commitments and owners.</p><time>10:38 AM</time></div><div className="ar-bubble is-me"><p>Perfect. I’ll review it before the team sync.</p><time>10:39 AM ✓✓</time></div><div className="ar-bubble is-other"><strong>Lina Torres</strong><button className="ar-chat-file"><OperationalShowcaseIcon name="document" size={22} /><span><b>Operating review.pdf</b><small>1.8 MB · PDF</small></span></button><p>The final launch dates are on page four.</p><time>10:42 AM</time></div>{view === 'media' && <div className="ar-media-strip"><span>Launch board</span><span>Customer map</span><span>Review chart</span></div>}</div><footer><IconButton icon="plus" label="Attach" /><IconButton icon="sparkles" label="Stickers" /><input placeholder="Type a message" /><IconButton icon="send" label="Send" /></footer></main></div>
}

function AssistantShowcase({ definition, view, setView, companyName, userName }: ShowcaseRendererProps) {
  const canvas = view === 'canvas'
  return <div className="ar-assistant-shell"><aside className="ar-assistant-sidebar"><header><ProductMark definition={definition} /><IconButton icon="menu" label="Collapse sidebar" /></header><button className="ar-new-chat"><OperationalShowcaseIcon name="plus" size={17} />New chat <kbd>⌘⇧O</kbd></button><button><OperationalShowcaseIcon name="search" size={17} />Search chats</button><button><OperationalShowcaseIcon name="sparkles" size={17} />Explore GPTs</button><div className="ar-assistant-section">Projects <button>+</button></div><button className={view === 'projects' ? 'is-active' : ''}><span className="ar-folder-mark">JT</span>{companyName}</button><div className="ar-assistant-section">Chats</div>{['Platform readiness review', 'Customer health brief', 'Q3 operating plan', 'Revenue scenario model'].map((chat, index) => <button className={index === 0 && view === 'conversation' ? 'is-active' : ''} key={chat}><OperationalShowcaseIcon name="message" size={15} />{chat}</button>)}<div className="ar-assistant-user"><Avatar name={userName} size={30} /><span><strong>{userName}</strong><small>{CLONE_DEMO_IDENTITY.email}</small></span><button>⋯</button></div></aside><main className={`ar-assistant-main ${canvas ? 'has-canvas' : ''}`}><header><button>ChatGPT <span>⌄</span></button><ViewTabs definition={definition} view={view} setView={setView} labels={{ conversation: 'Chat', projects: 'Project', canvas: 'Canvas' }} /><div><button>Share</button><IconButton icon="more" label="More" /></div></header><section className="ar-assistant-thread"><div className="ar-user-prompt">Review our frontend framework and identify the smallest next step before production.</div><div className="ar-assistant-answer"><ProductMark definition={definition} /><article><p>Your presentation foundation is broad enough to begin integration. The next step should be a focused production-hardening pass rather than more component breadth.</p><h3>Recommended sequence</h3><ol><li><strong>Browser regression coverage</strong><span>Exercise keyboard flows, breakpoints, themes, streaming reconnects, and uploads in a real browser.</span></li><li><strong>Backend conformance fixtures</strong><span>Give every TerminalService implementation the same contract tests.</span></li><li><strong>Large-result navigation</strong><span>Connect existing page tokens to consistent load-more behavior before adding virtualization.</span></li></ol><aside><strong>Readiness</strong><span>Core presentation contracts are ready. Production services remain host-owned.</span></aside></article></div></section><footer className="ar-prompt-box"><textarea placeholder="Message ChatGPT" defaultValue={view === 'projects' ? `Use context from the ${companyName} project` : ''} /><div><button>＋</button><button>Tools</button><span /><button className="ar-voice">◉</button><button className="ar-send">↑</button></div><small>AI can make mistakes. Verify important information.</small></footer></main>{canvas && <aside className="ar-canvas"><header><span><strong>Production readiness plan</strong><small>Saved</small></span><div><button>Preview</button><IconButton icon="close" label="Close canvas" /></div></header><article><h1>Production readiness plan</h1><p className="ar-lead">A bounded path from presentation framework to dependable host integration.</p><h2>1. Browser confidence</h2><p>Automate the interactions users depend on: navigation, selection, forms, media, and reconnect behavior.</p><h2>2. Service conformance</h2><pre><code>{'TerminalService\n├── Get / Stream\n├── ListSources\n├── SubmitAction / WatchAction\n└── Generate (optional)'}</code></pre><h2>3. Integration milestone</h2><ul><li>Connect one authorized catalog</li><li>Resolve one object detail</li><li>Submit one revision-safe action</li></ul></article><footer><button>Ask ChatGPT</button><button>⋯</button></footer></aside>}</div>
}
