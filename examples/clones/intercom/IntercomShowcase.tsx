import { useMemo, useState, type ReactNode } from 'react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import {
  OperationalShowcaseAvatar,
  OperationalShowcaseIcon,
  operationalShowcaseInitials,
} from '../shared/OperationalShowcasePrimitives'
import '../shared/OperationalShowcases.css'

export type IntercomShowcaseSection = 'inbox' | 'tickets' | 'reporting'
export type IntercomConversationState = 'Open' | 'Waiting' | 'Resolved'
export type IntercomPriority = 'Priority' | 'Normal'
export type IntercomChannel = 'Messenger' | 'Email' | 'WhatsApp'

export interface IntercomMessage {
  id: string
  author: string
  authorRole: 'Customer' | 'Teammate' | 'AI' | 'Event'
  timestamp: string
  body: string
  attachment?: string
}

export interface IntercomConversation {
  id: string
  subject: string
  preview: string
  customer: string
  email: string
  company: string
  channel: IntercomChannel
  state: IntercomConversationState
  priority: IntercomPriority
  assignee: string
  assigneeColor: string
  updatedAt: string
  waitingMinutes: number
  unread: boolean
  tags: string[]
  ticketType?: string
  ticketState?: 'Submitted' | 'In progress' | 'Waiting on customer' | 'Resolved'
  attributes: Record<string, string>
  messages: IntercomMessage[]
}

export interface IntercomShowcaseProps {
  conversations?: readonly IntercomConversation[]
  initialSection?: IntercomShowcaseSection
  initialSelectedConversationId?: string
  initialQuery?: string
  workspaceName?: string
  currentTeammate?: string
  onSelectConversation?: (conversation: IntercomConversation) => void
  onSendMessage?: (conversation: IntercomConversation, body: string) => void
}

export const INTERCOM_SAMPLE_CONVERSATIONS: readonly IntercomConversation[] = [
  {
    id: 'conv-1042',
    subject: 'Unable to update delivery address',
    preview: 'The order is still unfulfilled, but the address field is locked.',
    customer: 'Maya Chen',
    email: 'maya@example.test',
    company: 'Northwind Health',
    channel: 'Messenger',
    state: 'Open',
    priority: 'Priority',
    assignee: CLONE_DEMO_IDENTITY.user,
    assigneeColor: '#6b5ec4',
    updatedAt: '2m',
    waitingMinutes: 22,
    unread: true,
    tags: ['order-change', 'enterprise'],
    ticketType: 'Order support',
    ticketState: 'In progress',
    attributes: {
      'Customer tier': 'Enterprise',
      'Order': '#1057',
      'Annual revenue': '$284,000',
      'Last seen': '2 minutes ago',
      'Location': 'San Francisco, CA',
    },
    messages: [
      { id: 'm1', author: 'Maya Chen', authorRole: 'Customer', timestamp: '10:31 AM', body: 'Hi! I just placed order #1057, but noticed that the delivery address is our old office.' },
      { id: 'm2', author: 'Fin', authorRole: 'AI', timestamp: '10:31 AM', body: 'I found order #1057. Because it has not entered fulfillment, a teammate can still update the shipping address.' },
      { id: 'm3', author: 'Maya Chen', authorRole: 'Customer', timestamp: '10:33 AM', body: 'Great, thank you. The new address is 420 Market Street, San Francisco, CA 94105.' },
      { id: 'm4', author: CLONE_DEMO_IDENTITY.user, authorRole: 'Teammate', timestamp: '10:39 AM', body: 'I have the order open now. I’ll verify the change and send an updated confirmation in a moment.' },
      { id: 'm5', author: 'Order #1057 linked to this conversation', authorRole: 'Event', timestamp: '10:40 AM', body: 'Payment succeeded · fulfillment not started' },
    ],
  },
  {
    id: 'conv-1041',
    subject: 'Invoice needs our purchase order number',
    preview: 'Could you add PO-4881 and resend the invoice?',
    customer: 'Theo Martin',
    email: 'theo@brightpath.example',
    company: 'Brightpath Energy',
    channel: 'Email',
    state: 'Open',
    priority: 'Normal',
    assignee: 'Sarah Kim',
    assigneeColor: '#2d8a70',
    updatedAt: '8m',
    waitingMinutes: 48,
    unread: true,
    tags: ['billing', 'invoice'],
    ticketType: 'Billing request',
    ticketState: 'Submitted',
    attributes: {
      'Customer tier': 'Enterprise',
      'Invoice': 'INV-1048',
      'Annual revenue': '$412,000',
      'Last seen': 'Today',
      'Location': 'London, UK',
    },
    messages: [
      { id: 't1', author: 'Theo Martin', authorRole: 'Customer', timestamp: '10:12 AM', body: 'Could you add purchase order PO-4881 to invoice INV-1048 and resend it to our accounts payable team?' },
      { id: 't2', author: 'Fin', authorRole: 'AI', timestamp: '10:13 AM', body: 'I located the invoice and drafted the required update for a teammate to review.' },
    ],
  },
  {
    id: 'conv-1040',
    subject: 'Inventory sync delayed',
    preview: 'The East warehouse stock has not changed since yesterday.',
    customer: 'Nina Patel',
    email: 'nina@blueharbor.example',
    company: 'Blue Harbor Logistics',
    channel: 'Messenger',
    state: 'Waiting',
    priority: 'Priority',
    assignee: CLONE_DEMO_IDENTITY.user,
    assigneeColor: '#6b5ec4',
    updatedAt: '16m',
    waitingMinutes: 96,
    unread: false,
    tags: ['integration', 'inventory'],
    ticketType: 'Technical issue',
    ticketState: 'In progress',
    attributes: {
      'Customer tier': 'Growth',
      'Integration': 'Warehouse API',
      'Annual revenue': '$118,000',
      'Last seen': '16 minutes ago',
      'Location': 'Seattle, WA',
    },
    messages: [
      { id: 'n1', author: 'Nina Patel', authorRole: 'Customer', timestamp: '9:46 AM', body: 'The East warehouse stock in our dashboard has not changed since yesterday afternoon.' },
      { id: 'n2', author: CLONE_DEMO_IDENTITY.user, authorRole: 'Teammate', timestamp: '9:54 AM', body: 'I can see a delayed sync. I have asked the integration team to replay the failed batch.' },
      { id: 'n3', author: 'Escalated to Integrations', authorRole: 'Event', timestamp: '9:55 AM', body: 'Priority raised · SLA due in 24 minutes' },
    ],
  },
  {
    id: 'conv-1039',
    subject: 'Return label received',
    preview: 'Thanks — everything is sorted now.',
    customer: 'Morgan Reed',
    email: 'morgan@example.test',
    company: 'Atlas Design Co.',
    channel: 'Email',
    state: 'Resolved',
    priority: 'Normal',
    assignee: 'Avery Brooks',
    assigneeColor: '#b56a42',
    updatedAt: '1h',
    waitingMinutes: 0,
    unread: false,
    tags: ['return'],
    ticketType: 'Return',
    ticketState: 'Resolved',
    attributes: {
      'Customer tier': 'Starter',
      'Order': '#1049',
      'Annual revenue': '$24,000',
      'Last seen': '1 hour ago',
      'Location': 'Denver, CO',
    },
    messages: [
      { id: 'r1', author: 'Avery Brooks', authorRole: 'Teammate', timestamp: '9:01 AM', body: 'Your prepaid return label is attached. The refund will be initiated after the item is scanned by the carrier.', attachment: 'return-label-1049.pdf' },
      { id: 'r2', author: 'Morgan Reed', authorRole: 'Customer', timestamp: '9:18 AM', body: 'Thanks — everything is sorted now.' },
    ],
  },
  {
    id: 'conv-1038',
    subject: 'Question about annual billing',
    preview: 'Is the discount applied automatically when we upgrade?',
    customer: 'Lee Carter',
    email: 'lee@cascade.example',
    company: 'Cascade Retail',
    channel: 'WhatsApp',
    state: 'Open',
    priority: 'Normal',
    assignee: 'Unassigned',
    assigneeColor: '#8b949d',
    updatedAt: '2h',
    waitingMinutes: 132,
    unread: false,
    tags: ['billing', 'upgrade'],
    ticketType: 'Billing question',
    ticketState: 'Submitted',
    attributes: {
      'Customer tier': 'Growth',
      'Subscription': 'Operations Growth',
      'Annual revenue': '$92,000',
      'Last seen': '2 hours ago',
      'Location': 'Toronto, CA',
    },
    messages: [
      { id: 'l1', author: 'Lee Carter', authorRole: 'Customer', timestamp: '8:22 AM', body: 'Is the annual discount applied automatically if we upgrade from monthly billing?' },
    ],
  },
]

export function selectIntercomConversations(
  conversations: readonly IntercomConversation[],
  query = '',
  state?: IntercomConversationState,
): IntercomConversation[] {
  const normalized = query.trim().toLowerCase()
  return conversations.filter(conversation => {
    if (state && conversation.state !== state) return false
    if (!normalized) return true
    return [
      conversation.subject,
      conversation.preview,
      conversation.customer,
      conversation.company,
      conversation.email,
      ...conversation.tags,
    ].join(' ').toLowerCase().includes(normalized)
  })
}

export function intercomSlaRiskCount(
  conversations: readonly IntercomConversation[],
  riskAtMinutes = 60,
): number {
  return conversations.filter(conversation =>
    conversation.state !== 'Resolved' && conversation.waitingMinutes >= riskAtMinutes,
  ).length
}

export function IntercomShowcase({
  conversations = INTERCOM_SAMPLE_CONVERSATIONS,
  initialSection = 'inbox',
  initialSelectedConversationId = 'conv-1042',
  initialQuery = '',
  workspaceName = CLONE_DEMO_IDENTITY.company,
  currentTeammate = CLONE_DEMO_IDENTITY.user,
  onSelectConversation,
  onSendMessage,
}: IntercomShowcaseProps) {
  const [section, setSection] = useState<IntercomShowcaseSection>(initialSection)
  const [selectedId, setSelectedId] = useState(initialSelectedConversationId)
  const [query, setQuery] = useState(initialQuery)
  const [stateFilter, setStateFilter] = useState<IntercomConversationState | undefined>(
    initialSection === 'tickets' ? 'Open' : undefined,
  )
  const [draft, setDraft] = useState('')
  const [composerMode, setComposerMode] = useState<'reply' | 'note'>('reply')
  const [sentBody, setSentBody] = useState('')
  const selectedConversation = conversations.find(conversation => conversation.id === selectedId)
    ?? conversations[0]
  const filteredConversations = useMemo(
    () => selectIntercomConversations(conversations, query, stateFilter),
    [conversations, query, stateFilter],
  )
  const slaRisks = intercomSlaRiskCount(conversations)

  const chooseConversation = (conversation: IntercomConversation) => {
    setSelectedId(conversation.id)
    setSentBody('')
    onSelectConversation?.(conversation)
  }

  const send = () => {
    const body = draft.trim()
    if (!body || !selectedConversation) return
    setSentBody(body)
    setDraft('')
    onSendMessage?.(selectedConversation, body)
  }

  return (
    <div className="ready-showcase intercom-showcase">
      <aside aria-label="Intercom applications" className="intercom-rail">
        <div className="intercom-mark">I</div>
        <nav aria-label="Intercom applications">
          <button aria-label="Inbox" className={section === 'inbox' ? 'active' : ''} onClick={() => { setSection('inbox'); setStateFilter(undefined) }}><OperationalShowcaseIcon name="inbox" /></button>
          <button aria-label="Tickets" className={section === 'tickets' ? 'active' : ''} onClick={() => { setSection('tickets'); setStateFilter('Open') }}><OperationalShowcaseIcon name="ticket" /></button>
          <button aria-label="Contacts"><OperationalShowcaseIcon name="people" /></button>
          <button aria-label="Reports" className={section === 'reporting' ? 'active' : ''} onClick={() => setSection('reporting')}><OperationalShowcaseIcon name="chart" /></button>
          <button aria-label="AI tools"><OperationalShowcaseIcon name="sparkles" /></button>
        </nav>
        <div className="intercom-rail-footer"><button aria-label="Settings"><OperationalShowcaseIcon name="settings" /></button><OperationalShowcaseAvatar name={currentTeammate} color="#6558c5" size={30} /></div>
      </aside>

      <aside aria-label="Inbox navigation" className="intercom-nav">
        <div className="intercom-workspace-switcher"><span className="intercom-workspace-avatar">{operationalShowcaseInitials(workspaceName).charAt(0)}</span><strong>{workspaceName}</strong><OperationalShowcaseIcon name="chevron-down" size={13} /></div>
        <button className="intercom-new-message"><OperationalShowcaseIcon name="plus" size={15} />New conversation</button>
        <div className="intercom-nav-group">
          <span>Inbox</span>
          <button className="active"><OperationalShowcaseIcon name="inbox" size={15} />Your inbox <em>3</em></button>
          <button><OperationalShowcaseIcon name="people" size={15} />All <em>{conversations.filter(conversation => conversation.state !== 'Resolved').length}</em></button>
          <button><OperationalShowcaseIcon name="user" size={15} />Unassigned <em>1</em></button>
        </div>
        <div className="intercom-nav-group">
          <span>Team inboxes</span>
          <button><i className="intercom-team-dot support" />Customer support <em>8</em></button>
          <button><i className="intercom-team-dot success" />Customer success <em>4</em></button>
          <button><i className="intercom-team-dot billing" />Billing <em>2</em></button>
        </div>
        <div className="intercom-nav-group">
          <span>Views</span>
          <button><OperationalShowcaseIcon name="flag" size={15} />Priority <em>2</em></button>
          <button><OperationalShowcaseIcon name="clock" size={15} />SLA at risk <em>{slaRisks}</em></button>
          <button><OperationalShowcaseIcon name="ticket" size={15} />All tickets</button>
        </div>
        <div className="intercom-nav-footer"><button><OperationalShowcaseIcon name="help" size={15} />Help center</button></div>
      </aside>

      {section !== 'reporting' && (
        <>
          <section className="intercom-list">
            <header>
              <div><h1>{section === 'tickets' ? 'Tickets' : 'Your inbox'}</h1><button aria-label="Inbox options"><OperationalShowcaseIcon name="more" size={17} /></button></div>
              <label><OperationalShowcaseIcon name="search" size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search conversations" /></label>
              <div className="intercom-list-filters">
                <button onClick={() => setStateFilter(stateFilter ? undefined : 'Open')}>{stateFilter ?? 'Open'} <OperationalShowcaseIcon name="chevron-down" size={12} /></button>
                <button>Newest <OperationalShowcaseIcon name="chevron-down" size={12} /></button>
                <span>{filteredConversations.length}</span>
              </div>
            </header>
            <div className="intercom-conversation-list">
              {filteredConversations.map(conversation => (
                <button
                  key={conversation.id}
                  className={`${conversation.id === selectedConversation?.id ? 'selected' : ''} ${conversation.unread ? 'unread' : ''}`}
                  onClick={() => chooseConversation(conversation)}
                >
                  <OperationalShowcaseAvatar name={conversation.customer} color={customerColor(conversation.customer)} size={34} />
                  <span>
                    <span className="intercom-conversation-meta"><strong>{conversation.customer}</strong><small>{conversation.updatedAt}</small></span>
                    <strong>{conversation.subject}</strong>
                    <small>{conversation.preview}</small>
                    <span className="intercom-conversation-footer">
                      {conversation.priority === 'Priority' && <em><OperationalShowcaseIcon name="flag" size={11} />Priority</em>}
                      {conversation.ticketType && section === 'tickets' && <em className="ticket"><OperationalShowcaseIcon name="ticket" size={11} />{conversation.ticketState}</em>}
                      <i><OperationalShowcaseAvatar name={conversation.assignee} color={conversation.assigneeColor} size={18} /></i>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          {selectedConversation && (
            <section className="intercom-thread">
              <header>
                <button aria-label="Back to conversations" className="intercom-thread-back"><OperationalShowcaseIcon name="chevron-left" size={17} /></button>
                <div><h2>{selectedConversation.subject}</h2><span>{selectedConversation.customer} · {selectedConversation.company}</span></div>
                <div>
                  <button aria-label="Mark priority" title="Priority" className={selectedConversation.priority === 'Priority' ? 'active' : ''}><OperationalShowcaseIcon name="flag" size={16} /></button>
                  <button aria-label="Conversation options" title="More"><OperationalShowcaseIcon name="more" size={17} /></button>
                  <button className="intercom-resolve"><OperationalShowcaseIcon name="check" size={15} />Resolve</button>
                </div>
              </header>
              <div className="intercom-thread-body">
                <div className="intercom-thread-date"><span>Today</span></div>
                {selectedConversation.messages.map(message => (
                  <IntercomMessageBubble key={message.id} message={message} customer={selectedConversation.customer} />
                ))}
                {sentBody && (
                  <IntercomMessageBubble
                    customer={selectedConversation.customer}
                    message={{ id: 'sent-preview', author: currentTeammate, authorRole: 'Teammate', timestamp: 'Just now', body: sentBody }}
                  />
                )}
              </div>
              <footer className={`intercom-composer ${composerMode}`}>
                <div className="intercom-composer-tabs"><button className={composerMode === 'reply' ? 'active' : ''} onClick={() => setComposerMode('reply')}>Reply</button><button className={composerMode === 'note' ? 'active' : ''} onClick={() => setComposerMode('note')}>Note</button><span>To: {selectedConversation.customer}</span></div>
                <textarea value={draft} onChange={event => setDraft(event.target.value)} placeholder={composerMode === 'reply' ? 'Use CtrlK for shortcuts' : 'Leave an internal note…'} />
                <div className="intercom-composer-actions">
                  <div><button aria-label="Bold"><strong>B</strong></button><button aria-label="Italic"><em>I</em></button><button aria-label="Insert link"><OperationalShowcaseIcon name="link" size={14} /></button><button aria-label="Attach file"><OperationalShowcaseIcon name="document" size={14} /></button><button aria-label="More composer tools"><OperationalShowcaseIcon name="apps" size={14} /></button></div>
                  <div><button className="intercom-ai-button"><OperationalShowcaseIcon name="sparkles" size={14} />AI</button><button className="intercom-send-button" disabled={!draft.trim()} onClick={send}>Send <OperationalShowcaseIcon name="chevron-down" size={12} /></button></div>
                </div>
              </footer>
            </section>
          )}

          {selectedConversation && (
            <aside aria-label="Conversation details" className="intercom-details">
              <header><h2>Details</h2><button aria-label="Close conversation details"><OperationalShowcaseIcon name="close" size={16} /></button></header>
              <div className="intercom-customer-hero">
                <OperationalShowcaseAvatar name={selectedConversation.customer} color={customerColor(selectedConversation.customer)} size={48} />
                <h3>{selectedConversation.customer}</h3><span>{selectedConversation.company}</span>
                <div><button aria-label="Email customer"><OperationalShowcaseIcon name="mail" size={15} /></button><button aria-label="Call customer"><OperationalShowcaseIcon name="phone" size={15} /></button><button aria-label="More customer actions"><OperationalShowcaseIcon name="more" size={15} /></button></div>
              </div>
              <IntercomDetailSection title="Conversation attributes">
                <dl>
                  <div><dt>Assignee</dt><dd><OperationalShowcaseAvatar name={selectedConversation.assignee} color={selectedConversation.assigneeColor} size={18} />{selectedConversation.assignee}</dd></div>
                  <div><dt>Team inbox</dt><dd>Customer support</dd></div>
                  <div><dt>Priority</dt><dd>{selectedConversation.priority}</dd></div>
                  <div><dt>Channel</dt><dd>{selectedConversation.channel}</dd></div>
                </dl>
              </IntercomDetailSection>
              {selectedConversation.ticketType && (
                <IntercomDetailSection title="Ticket">
                  <div className="intercom-ticket-card"><span><OperationalShowcaseIcon name="ticket" size={15} /></span><div><strong>{selectedConversation.ticketType}</strong><small>{selectedConversation.ticketState}</small></div><OperationalShowcaseIcon name="chevron-right" size={13} /></div>
                </IntercomDetailSection>
              )}
              <IntercomDetailSection title="Customer data">
                <dl>{Object.entries(selectedConversation.attributes).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
              </IntercomDetailSection>
              <IntercomDetailSection title="Tags">
                <div className="intercom-tags">{selectedConversation.tags.map(tag => <span key={tag}>{tag}</span>)}<button aria-label="Add tag"><OperationalShowcaseIcon name="plus" size={12} /></button></div>
              </IntercomDetailSection>
              <IntercomDetailSection title="Recent orders">
                <div className="intercom-order-card"><span>#1057</span><strong>$428.00</strong><small>Paid · Unfulfilled</small></div>
              </IntercomDetailSection>
            </aside>
          )}
        </>
      )}

      {section === 'reporting' && (
        <main className="intercom-reporting">
          <div className="ready-page-heading"><div><h1>Support overview</h1><p>Conversation volume, responsiveness, SLA, and team capacity.</p></div><button className="ready-button secondary">Last 7 days <OperationalShowcaseIcon name="chevron-down" size={12} /></button></div>
          <div className="intercom-reporting-stats">
            <div><span>New conversations</span><strong>428</strong><small>+12% from prior period</small></div>
            <div><span>Median first response</span><strong>4m 12s</strong><small>38s faster</small></div>
            <div><span>Resolution time</span><strong>3h 18m</strong><small>Within 4h target</small></div>
            <div><span>Customer satisfaction</span><strong>94.6%</strong><small>184 responses</small></div>
          </div>
          <div className="intercom-reporting-grid">
            <section><div><h2>Conversation volume</h2><span>Created and closed</span></div><div className="intercom-bars">{[58, 74, 62, 88, 81, 96, 72].map((height, index) => <i key={index} style={{ height: `${height}%` }}><b style={{ height: `${Math.max(height - 18, 20)}%` }} /></i>)}</div><div className="intercom-bar-labels"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></section>
            <section><div><h2>Team workload</h2><span>Open conversations</span></div>{[CLONE_DEMO_IDENTITY.user, 'Sarah Kim', 'Avery Brooks', 'Unassigned'].map((name, index) => <div className="intercom-workload" key={name}><OperationalShowcaseAvatar name={name} color={['#6558c5', '#2d8a70', '#b56a42', '#8b949d'][index]} size={28} /><span className="intercom-workload-copy"><strong>{name}</strong><i><b style={{ width: `${[82, 64, 48, 26][index]}%` }} /></i></span><em>{[8, 6, 4, 2][index]}</em></div>)}</section>
          </div>
        </main>
      )}
    </div>
  )
}

function IntercomMessageBubble({
  message,
  customer,
}: {
  message: IntercomMessage
  customer: string
}) {
  if (message.authorRole === 'Event') {
    return <div className="intercom-event"><span><OperationalShowcaseIcon name="link" size={13} /></span><div><strong>{message.author}</strong><small>{message.body} · {message.timestamp}</small></div></div>
  }
  const teammate = message.authorRole === 'Teammate'
  const ai = message.authorRole === 'AI'
  return (
    <div className={`intercom-message ${teammate ? 'teammate' : ''} ${ai ? 'ai' : ''}`}>
      {ai
        ? <span className="intercom-ai-avatar"><OperationalShowcaseIcon name="sparkles" size={15} /></span>
        : <OperationalShowcaseAvatar name={message.authorRole === 'Customer' ? customer : message.author} color={teammate ? '#6558c5' : customerColor(customer)} size={28} />}
      <div>
        <span><strong>{message.author}</strong>{ai && <em>AI Agent</em>}<small>{message.timestamp}</small></span>
        <p>{message.body}</p>
        {message.attachment && <button className="intercom-attachment"><OperationalShowcaseIcon name="document" size={18} /><span><strong>{message.attachment}</strong><small>PDF · 84 KB</small></span><OperationalShowcaseIcon name="download" size={14} /></button>}
      </div>
    </div>
  )
}

function IntercomDetailSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <section className="intercom-detail-section">
      <button onClick={() => setOpen(value => !value)}><span>{title}</span><OperationalShowcaseIcon name={open ? 'chevron-down' : 'chevron-right'} size={13} /></button>
      {open && children}
    </section>
  )
}

function customerColor(name: string): string {
  const colors = ['#d07153', '#3a8c82', '#5877b8', '#9b6ab3', '#ba8a3d']
  const score = [...name].reduce((total, character) => total + character.charCodeAt(0), 0)
  return colors[score % colors.length]
}
