import { useMemo, useState } from 'react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import {
  ProductShowcaseAvatar,
  ProductShowcaseIcon,
  formatProductCurrency,
  type ProductShowcaseIconName,
} from '../shared/ProductShowcasePrimitives'
import '../shared/ProductShowcases.css'

export type HubSpotShowcaseSection = 'contacts' | 'record' | 'pipeline'
export type HubSpotLeadStatus = 'New' | 'Open' | 'Qualified' | 'Customer'
export type HubSpotDealStage =
  | 'Appointment scheduled'
  | 'Qualified to buy'
  | 'Presentation scheduled'
  | 'Contract sent'
  | 'Closed won'

export interface HubSpotContact {
  id: string
  name: string
  email: string
  company: string
  role: string
  owner: string
  ownerColor: string
  status: HubSpotLeadStatus
  lastActivity: string
  lifecycle: string
  city: string
  phone: string
  annualRevenue: number
}

export interface HubSpotDeal {
  id: string
  name: string
  company: string
  amount: number
  stage: HubSpotDealStage
  closeDate: string
  owner: string
  ownerColor: string
  probability: number
  contactId: string
}

export interface HubSpotActivity {
  id: string
  kind: 'email' | 'note' | 'call' | 'meeting' | 'task'
  title: string
  body: string
  timestamp: string
  actor: string
}

export interface HubSpotShowcaseProps {
  contacts?: HubSpotContact[]
  deals?: HubSpotDeal[]
  activities?: HubSpotActivity[]
  initialSection?: HubSpotShowcaseSection
  initialSelectedContactId?: string
  initialQuery?: string
  portalName?: string
  onSelectContact?: (contact: HubSpotContact) => void
}

export const HUBSPOT_SAMPLE_CONTACTS: HubSpotContact[] = [
  {
    id: 'amelia-stone',
    name: 'Amelia Stone',
    email: 'amelia@northwindhealth.com',
    company: 'Northwind Health',
    role: 'VP, Operations',
    owner: 'Maya Chen',
    ownerColor: '#7c5ce7',
    status: 'Qualified',
    lastActivity: '12 minutes ago',
    lifecycle: 'Sales qualified lead',
    city: 'Seattle, WA',
    phone: '+1 206 555 0148',
    annualRevenue: 24_800_000,
  },
  {
    id: 'marcus-reed',
    name: 'Marcus Reed',
    email: 'marcus@atlasworks.io',
    company: 'Atlas Works',
    role: 'Founder & CEO',
    owner: 'Noah Williams',
    ownerColor: '#1677c8',
    status: 'Open',
    lastActivity: '38 minutes ago',
    lifecycle: 'Opportunity',
    city: 'Austin, TX',
    phone: '+1 512 555 0182',
    annualRevenue: 8_200_000,
  },
  {
    id: 'nina-patel',
    name: 'Nina Patel',
    email: 'nina@cobaltlogistics.com',
    company: 'Cobalt Logistics',
    role: 'Chief Financial Officer',
    owner: 'Priya Shah',
    ownerColor: '#3b75b7',
    status: 'Customer',
    lastActivity: '2 hours ago',
    lifecycle: 'Customer',
    city: 'Chicago, IL',
    phone: '+1 312 555 0195',
    annualRevenue: 41_500_000,
  },
  {
    id: 'theo-martin',
    name: 'Theo Martin',
    email: 'theo@brightpath.energy',
    company: 'Brightpath Energy',
    role: 'Director of Data',
    owner: 'Lina Ortiz',
    ownerColor: '#be4c8d',
    status: 'New',
    lastActivity: 'Yesterday',
    lifecycle: 'Lead',
    city: 'Denver, CO',
    phone: '+1 720 555 0120',
    annualRevenue: 16_900_000,
  },
  {
    id: 'sarah-kim',
    name: 'Sarah Kim',
    email: 'sarah@finchretail.com',
    company: 'Finch Retail',
    role: 'Head of Revenue',
    owner: 'Eli Turner',
    ownerColor: '#248769',
    status: 'Qualified',
    lastActivity: 'Yesterday',
    lifecycle: 'Sales qualified lead',
    city: 'New York, NY',
    phone: '+1 212 555 0177',
    annualRevenue: 12_600_000,
  },
  {
    id: 'jordan-bell',
    name: 'Jordan Bell',
    email: 'jordan@harborfoods.co',
    company: 'Harbor Foods',
    role: 'COO',
    owner: 'Maya Chen',
    ownerColor: '#7c5ce7',
    status: 'Open',
    lastActivity: '2 days ago',
    lifecycle: 'Marketing qualified lead',
    city: 'Portland, OR',
    phone: '+1 503 555 0134',
    annualRevenue: 31_200_000,
  },
]

export const HUBSPOT_SAMPLE_DEALS: HubSpotDeal[] = [
  {
    id: 'northwind-expansion',
    name: 'Northwind operating hub',
    company: 'Northwind Health',
    amount: 86_400,
    stage: 'Presentation scheduled',
    closeDate: 'Aug 8',
    owner: 'Maya Chen',
    ownerColor: '#7c5ce7',
    probability: 0.65,
    contactId: 'amelia-stone',
  },
  {
    id: 'atlas-foundation',
    name: 'Atlas data foundation',
    company: 'Atlas Works',
    amount: 54_000,
    stage: 'Qualified to buy',
    closeDate: 'Aug 18',
    owner: 'Noah Williams',
    ownerColor: '#1677c8',
    probability: 0.4,
    contactId: 'marcus-reed',
  },
  {
    id: 'cobalt-renewal',
    name: 'Cobalt annual renewal',
    company: 'Cobalt Logistics',
    amount: 124_000,
    stage: 'Contract sent',
    closeDate: 'Jul 31',
    owner: 'Priya Shah',
    ownerColor: '#3b75b7',
    probability: 0.85,
    contactId: 'nina-patel',
  },
  {
    id: 'brightpath-pilot',
    name: 'Brightpath operations pilot',
    company: 'Brightpath Energy',
    amount: 32_500,
    stage: 'Appointment scheduled',
    closeDate: 'Sep 2',
    owner: 'Lina Ortiz',
    ownerColor: '#be4c8d',
    probability: 0.2,
    contactId: 'theo-martin',
  },
  {
    id: 'finch-revenue',
    name: 'Finch revenue command center',
    company: 'Finch Retail',
    amount: 72_000,
    stage: 'Presentation scheduled',
    closeDate: 'Aug 12',
    owner: 'Eli Turner',
    ownerColor: '#248769',
    probability: 0.6,
    contactId: 'sarah-kim',
  },
  {
    id: 'harbor-workspace',
    name: 'Harbor workspace rollout',
    company: 'Harbor Foods',
    amount: 46_800,
    stage: 'Closed won',
    closeDate: 'Jul 15',
    owner: 'Maya Chen',
    ownerColor: '#7c5ce7',
    probability: 1,
    contactId: 'jordan-bell',
  },
]

export const HUBSPOT_SAMPLE_ACTIVITIES: HubSpotActivity[] = [
  {
    id: 'activity-1',
    kind: 'email',
    title: 'Re: operating workspace proposal',
    body: 'Amelia confirmed the executive review and asked for a rollout plan by location.',
    timestamp: 'Today at 10:18 AM',
    actor: 'Maya Chen',
  },
  {
    id: 'activity-2',
    kind: 'note',
    title: 'Discovery summary',
    body: 'Main priorities: shared operating metrics, governed approvals, and a simpler field workflow.',
    timestamp: 'Yesterday at 4:42 PM',
    actor: 'Maya Chen',
  },
  {
    id: 'activity-3',
    kind: 'meeting',
    title: 'Solution review',
    body: '45-minute review with operations, finance, and data leads. Decision process confirmed.',
    timestamp: 'Jul 16 at 1:00 PM',
    actor: 'Noah Williams',
  },
  {
    id: 'activity-4',
    kind: 'call',
    title: 'Qualification call',
    body: 'Connected current pain to expansion goals; technical validation is the remaining milestone.',
    timestamp: 'Jul 14 at 9:30 AM',
    actor: 'Maya Chen',
  },
]

const HUBSPOT_STAGES: HubSpotDealStage[] = [
  'Appointment scheduled',
  'Qualified to buy',
  'Presentation scheduled',
  'Contract sent',
  'Closed won',
]

export function selectHubSpotContacts(
  contacts: HubSpotContact[],
  query = '',
  status: HubSpotLeadStatus | 'All' = 'All',
): HubSpotContact[] {
  const normalized = query.trim().toLowerCase()
  return contacts.filter(contact => {
    if (status !== 'All' && contact.status !== status) return false
    if (!normalized) return true
    return [
      contact.name,
      contact.email,
      contact.company,
      contact.role,
      contact.owner,
      contact.lifecycle,
    ].some(value => value.toLowerCase().includes(normalized))
  })
}

export function hubSpotWeightedPipeline(deals: HubSpotDeal[]): number {
  return deals.reduce((total, deal) => total + deal.amount * deal.probability, 0)
}

function HubSpotMark() {
  return (
    <span className="hubspot-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}

function HubSpotTopbar({
  portalName,
  query,
  onQueryChange,
}: {
  portalName: string
  query: string
  onQueryChange: (query: string) => void
}) {
  return (
    <>
      <header className="hubspot-topbar">
        <button className="hubspot-brand">
          <HubSpotMark />
          <span>HubSpot</span>
        </button>
        <label className="hubspot-global-search">
          <ProductShowcaseIcon name="search" size={15} />
          <input
            value={query}
            onChange={event => onQueryChange(event.target.value)}
            type="search"
            placeholder="Search HubSpot"
          />
          <kbd>⌘ K</kbd>
        </label>
        <div className="hubspot-global-actions">
          <button aria-label="Marketplace"><ProductShowcaseIcon name="apps" /></button>
          <button aria-label="Calling"><ProductShowcaseIcon name="phone" /></button>
          <button aria-label="Help"><ProductShowcaseIcon name="help" /></button>
          <button aria-label="Settings"><ProductShowcaseIcon name="settings" /></button>
          <button className="hubspot-notification" aria-label="Notifications">
            <ProductShowcaseIcon name="bell" />
            <span />
          </button>
          <button className="hubspot-portal-switcher">
            <ProductShowcaseAvatar name={CLONE_DEMO_IDENTITY.user} color="#66798d" size={28} />
            <span>{portalName}</span>
            <ProductShowcaseIcon name="chevron-down" size={13} />
          </button>
        </div>
      </header>
      <nav className="hubspot-main-nav" aria-label="HubSpot sections">
        {['CRM', 'Marketing', 'Content', 'Sales', 'Service', 'Automation', 'Reporting', 'Commerce', 'Data Management'].map((item, index) => (
          <button className={index === 0 ? 'is-active' : ''} key={item}>
            {item}
            {index < 6 && <ProductShowcaseIcon name="chevron-down" size={11} />}
          </button>
        ))}
      </nav>
    </>
  )
}

function HubSpotSectionNav({
  section,
  onSectionChange,
}: {
  section: HubSpotShowcaseSection
  onSectionChange: (section: HubSpotShowcaseSection) => void
}) {
  return (
    <aside aria-label="CRM navigation" className="hubspot-section-nav">
      <div className="hubspot-section-title">CRM</div>
      <nav aria-label="CRM records">
        <button className={section === 'contacts' || section === 'record' ? 'is-active' : ''} onClick={() => onSectionChange('contacts')}>
          <ProductShowcaseIcon name="contact" size={17} /> Contacts
        </button>
        <button><ProductShowcaseIcon name="company" size={17} /> Companies</button>
        <button className={section === 'pipeline' ? 'is-active' : ''} onClick={() => onSectionChange('pipeline')}>
          <ProductShowcaseIcon name="money" size={17} /> Deals
        </button>
        <button><ProductShowcaseIcon name="task" size={17} /> Tickets</button>
        <button><ProductShowcaseIcon name="document" size={17} /> Lists</button>
      </nav>
      <div className="hubspot-section-subtitle">My workspace</div>
      <nav aria-label="CRM workspace">
        <button><ProductShowcaseIcon name="task" size={17} /> Tasks</button>
        <button><ProductShowcaseIcon name="activity" size={17} /> Activity feed</button>
        <button><ProductShowcaseIcon name="reports" size={17} /> Forecast</button>
      </nav>
      <button className="hubspot-breeze-card">
        <span><ProductShowcaseIcon name="sparkles" size={16} /></span>
        <strong>Ask Breeze</strong>
        <small>Summarize records and prepare follow-ups.</small>
      </button>
    </aside>
  )
}

function HubSpotStatus({ status }: { status: HubSpotLeadStatus }) {
  return <span className={`hubspot-status is-${status.toLowerCase()}`}>{status}</span>
}

function HubSpotContacts({
  contacts,
  status,
  onStatusChange,
  onSelect,
}: {
  contacts: HubSpotContact[]
  status: HubSpotLeadStatus | 'All'
  onStatusChange: (status: HubSpotLeadStatus | 'All') => void
  onSelect: (contact: HubSpotContact) => void
}) {
  return (
    <div className="hubspot-index-page">
      <header className="hubspot-page-heading">
        <div>
          <div className="hubspot-breadcrumb">CRM <ProductShowcaseIcon name="chevron-right" size={12} /> Contacts</div>
          <h1>Contacts</h1>
          <p>{contacts.length} records · Updated a few seconds ago</p>
        </div>
        <div>
          <button className="hubspot-secondary-button">Import</button>
          <button className="hubspot-secondary-button">Actions <ProductShowcaseIcon name="chevron-down" size={12} /></button>
          <button className="hubspot-primary-button"><ProductShowcaseIcon name="plus" size={15} /> Create contact</button>
        </div>
      </header>
      <div className="hubspot-saved-views">
        <button className="is-active">All contacts</button>
        <button>My contacts</button>
        <button>Recently assigned</button>
        <button>Needs follow-up</button>
        <button><ProductShowcaseIcon name="plus" size={13} /> Add view</button>
      </div>
      <div className="hubspot-filter-row">
        <button>Contact owner <ProductShowcaseIcon name="chevron-down" size={12} /></button>
        <label>
          <span>Lead status</span>
          <select
            value={status}
            onChange={event => onStatusChange(event.target.value as HubSpotLeadStatus | 'All')}
          >
            <option>All</option>
            <option>New</option>
            <option>Open</option>
            <option>Qualified</option>
            <option>Customer</option>
          </select>
        </label>
        <button>Create date <ProductShowcaseIcon name="chevron-down" size={12} /></button>
        <button>Last activity date <ProductShowcaseIcon name="chevron-down" size={12} /></button>
        <button className="hubspot-more-filters"><ProductShowcaseIcon name="filter" size={14} /> Advanced filters</button>
      </div>
      <div className="hubspot-table-actions">
        <span><input type="checkbox" aria-label="Select all contacts" /> {contacts.length} contacts</span>
        <div>
          <button><ProductShowcaseIcon name="sort" size={14} /> Sort</button>
          <button><ProductShowcaseIcon name="table" size={14} /> Edit columns</button>
          <button aria-label="More table actions"><ProductShowcaseIcon name="more" size={16} /></button>
        </div>
      </div>
      <div className="hubspot-table-wrap">
        <table className="hubspot-contact-table">
          <thead>
            <tr>
              <th><input type="checkbox" aria-label="Select all visible contacts" /></th>
              <th>Contact name <ProductShowcaseIcon name="arrow-up" size={12} /></th>
              <th>Email</th>
              <th>Company name</th>
              <th>Lead status</th>
              <th>Contact owner</th>
              <th>Last activity</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr key={contact.id}>
                <td><input type="checkbox" aria-label={`Select ${contact.name}`} /></td>
                <td>
                  <button
                    type="button"
                    className="hubspot-contact-name"
                    onClick={() => onSelect(contact)}
                    aria-label={`Open ${contact.name}`}
                  >
                    <ProductShowcaseAvatar name={contact.name} color={contact.ownerColor} size={30} />
                    <span><strong>{contact.name}</strong><small>{contact.role}</small></span>
                  </button>
                </td>
                <td><a href={`mailto:${contact.email}`}>{contact.email}</a></td>
                <td>{contact.company}</td>
                <td><HubSpotStatus status={contact.status} /></td>
                <td><span className="hubspot-owner"><ProductShowcaseAvatar name={contact.owner} color={contact.ownerColor} size={21} /> {contact.owner}</span></td>
                <td>{contact.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {contacts.length === 0 && <div className="hubspot-empty">No contacts match this view.</div>}
      </div>
      <footer className="hubspot-pagination">
        <span>1–{contacts.length} of {contacts.length}</span>
        <button aria-label="Previous page" disabled><ProductShowcaseIcon name="chevron-left" size={14} /></button>
        <button aria-label="Next page" disabled><ProductShowcaseIcon name="chevron-right" size={14} /></button>
      </footer>
    </div>
  )
}

function HubSpotActivityIcon({ kind }: { kind: HubSpotActivity['kind'] }) {
  const icon = kind === 'email'
    ? 'mail'
    : kind === 'call'
      ? 'phone'
      : kind === 'meeting'
        ? 'calendar'
        : kind === 'task'
          ? 'task'
          : 'note'
  return <span className={`hubspot-activity-icon is-${kind}`}><ProductShowcaseIcon name={icon} size={15} /></span>
}

function HubSpotRecord({
  contact,
  deals,
  activities,
  onBack,
}: {
  contact: HubSpotContact
  deals: HubSpotDeal[]
  activities: HubSpotActivity[]
  onBack: () => void
}) {
  const relatedDeals = deals.filter(deal => deal.contactId === contact.id)
  const quickActions: Array<[ProductShowcaseIconName, string]> = [
    ['note', 'Note'],
    ['mail', 'Email'],
    ['phone', 'Call'],
    ['task', 'Task'],
    ['calendar', 'Meet'],
  ]
  return (
    <div className="hubspot-record-page">
      <div className="hubspot-record-breadcrumb">
        <button onClick={onBack}><ProductShowcaseIcon name="chevron-left" size={14} /> Contacts</button>
        <span>/</span>
        <strong>{contact.name}</strong>
        <div>
          <button>Actions <ProductShowcaseIcon name="chevron-down" size={12} /></button>
          <button aria-label="Previous contact"><ProductShowcaseIcon name="chevron-left" size={14} /></button>
          <button aria-label="Next contact"><ProductShowcaseIcon name="chevron-right" size={14} /></button>
        </div>
      </div>
      <div className="hubspot-record-columns">
        <aside aria-label="Contact summary" className="hubspot-record-left">
          <div className="hubspot-contact-hero">
            <ProductShowcaseAvatar name={contact.name} color={contact.ownerColor} size={54} />
            <h1>{contact.name}</h1>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <span>{contact.role} at {contact.company}</span>
          </div>
          <div className="hubspot-quick-actions">
            {quickActions.map(([icon, label]) => (
              <button key={label}><span><ProductShowcaseIcon name={icon} size={15} /></span>{label}</button>
            ))}
          </div>
          <section className="hubspot-record-card hubspot-about-card">
            <header><strong>About this contact</strong><button><ProductShowcaseIcon name="settings" size={14} /></button></header>
            <dl>
              <div><dt>Email</dt><dd>{contact.email}</dd></div>
              <div><dt>Phone</dt><dd>{contact.phone}</dd></div>
              <div><dt>Contact owner</dt><dd>{contact.owner}</dd></div>
              <div><dt>Lead status</dt><dd><HubSpotStatus status={contact.status} /></dd></div>
              <div><dt>Lifecycle stage</dt><dd>{contact.lifecycle}</dd></div>
              <div><dt>City</dt><dd>{contact.city}</dd></div>
            </dl>
            <button className="hubspot-properties-link">View all properties</button>
          </section>
        </aside>
        <main className="hubspot-record-middle">
          <div className="hubspot-record-tabs">
            <button className="is-active">Activities</button>
            <button>Overview</button>
            <button>Performance</button>
          </div>
          <section className="hubspot-upcoming-card">
            <header><strong>Upcoming</strong><button>All activities <ProductShowcaseIcon name="chevron-down" size={12} /></button></header>
            <div>
              <span className="hubspot-activity-icon is-task"><ProductShowcaseIcon name="task" size={15} /></span>
              <p><strong>Prepare solution review</strong><small>Due tomorrow at 9:00 AM · Assigned to {contact.owner}</small></p>
              <button>Complete</button>
            </div>
          </section>
          <div className="hubspot-activity-controls">
            <label><ProductShowcaseIcon name="search" size={14} /><input placeholder="Search activities" /></label>
            <button>Filter activity <ProductShowcaseIcon name="chevron-down" size={12} /></button>
            <button>Collapse all</button>
          </div>
          <div className="hubspot-timeline">
            <div className="hubspot-timeline-date"><span>July 2026</span></div>
            {activities.map(activity => (
              <article key={activity.id}>
                <HubSpotActivityIcon kind={activity.kind} />
                <div>
                  <header>
                    <span><strong>{activity.title}</strong><small>{activity.timestamp}</small></span>
                    <button aria-label="More activity actions"><ProductShowcaseIcon name="more" size={16} /></button>
                  </header>
                  <p>{activity.body}</p>
                  <footer>Logged by {activity.actor} · <button>Comment</button></footer>
                </div>
              </article>
            ))}
          </div>
        </main>
        <aside aria-label="Contact associations" className="hubspot-record-right">
          <section className="hubspot-record-card">
            <header><strong>Company (1)</strong><button><ProductShowcaseIcon name="plus" size={14} /> Add</button></header>
            <div className="hubspot-association">
              <span className="hubspot-company-icon"><ProductShowcaseIcon name="company" size={19} /></span>
              <p><strong>{contact.company}</strong><small>{contact.city}</small><small>{formatProductCurrency(contact.annualRevenue, { compact: true })} annual revenue</small></p>
            </div>
          </section>
          <section className="hubspot-record-card">
            <header><strong>Deals ({relatedDeals.length})</strong><button><ProductShowcaseIcon name="plus" size={14} /> Add</button></header>
            {relatedDeals.length > 0 ? relatedDeals.map(deal => (
              <div className="hubspot-deal-association" key={deal.id}>
                <strong>{deal.name}</strong>
                <span>{formatProductCurrency(deal.amount)} · {deal.stage}</span>
                <small>Close date {deal.closeDate}</small>
              </div>
            )) : <p className="hubspot-card-empty">No associated deals</p>}
          </section>
          <section className="hubspot-record-card">
            <header><strong>Attachments</strong><button><ProductShowcaseIcon name="plus" size={14} /> Add</button></header>
            <div className="hubspot-attachment"><ProductShowcaseIcon name="document" size={18} /><span><strong>Operating brief.pdf</strong><small>2.4 MB · Yesterday</small></span></div>
            <div className="hubspot-attachment"><ProductShowcaseIcon name="document" size={18} /><span><strong>Discovery notes.docx</strong><small>184 KB · Jul 16</small></span></div>
          </section>
          <section className="hubspot-breeze-summary">
            <header><ProductShowcaseIcon name="sparkles" size={16} /><strong>Breeze summary</strong></header>
            <p>{contact.name} is evaluating an operating workspace for cross-functional visibility. Executive review is the next milestone.</p>
            <button>Prepare follow-up</button>
          </section>
        </aside>
      </div>
    </div>
  )
}

function HubSpotPipeline({
  deals,
  onOpenContact,
}: {
  deals: HubSpotDeal[]
  onOpenContact: (contactId: string) => void
}) {
  return (
    <div className="hubspot-pipeline-page">
      <header className="hubspot-page-heading">
        <div>
          <div className="hubspot-breadcrumb">CRM <ProductShowcaseIcon name="chevron-right" size={12} /> Deals</div>
          <h1>Sales pipeline</h1>
          <p>{deals.length} open and closed deals · Weighted value {formatProductCurrency(hubSpotWeightedPipeline(deals), { compact: true })}</p>
        </div>
        <div>
          <button className="hubspot-secondary-button">Pipeline actions <ProductShowcaseIcon name="chevron-down" size={12} /></button>
          <button className="hubspot-primary-button"><ProductShowcaseIcon name="plus" size={15} /> Create deal</button>
        </div>
      </header>
      <div className="hubspot-pipeline-toolbar">
        <div>
          <button>Sales pipeline <ProductShowcaseIcon name="chevron-down" size={12} /></button>
          <button>All deals <ProductShowcaseIcon name="chevron-down" size={12} /></button>
          <button>Deal owner <ProductShowcaseIcon name="chevron-down" size={12} /></button>
        </div>
        <div>
          <button><ProductShowcaseIcon name="board" size={14} /> Board</button>
          <button><ProductShowcaseIcon name="table" size={14} /> Table</button>
        </div>
      </div>
      <div className="hubspot-pipeline-board">
        {HUBSPOT_STAGES.map(stage => {
          const stageDeals = deals.filter(deal => deal.stage === stage)
          const total = stageDeals.reduce((sum, deal) => sum + deal.amount, 0)
          return (
            <section key={stage}>
              <header>
                <div><strong>{stage}</strong><span>{stageDeals.length}</span></div>
                <small>{formatProductCurrency(total, { compact: true })}</small>
              </header>
              <div>
                {stageDeals.map(deal => (
                  <button className="hubspot-deal-card" key={deal.id} onClick={() => onOpenContact(deal.contactId)}>
                    <strong>{deal.name}</strong>
                    <span>{deal.company}</span>
                    <b>{formatProductCurrency(deal.amount)}</b>
                    <dl>
                      <div><dt>Close date</dt><dd>{deal.closeDate}</dd></div>
                      <div><dt>Probability</dt><dd>{Math.round(deal.probability * 100)}%</dd></div>
                    </dl>
                    <footer><ProductShowcaseAvatar name={deal.owner} color={deal.ownerColor} size={23} /> {deal.owner}</footer>
                  </button>
                ))}
                <button className="hubspot-add-deal"><ProductShowcaseIcon name="plus" size={14} /> Add deal</button>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

export function HubSpotShowcase({
  contacts = HUBSPOT_SAMPLE_CONTACTS,
  deals = HUBSPOT_SAMPLE_DEALS,
  activities = HUBSPOT_SAMPLE_ACTIVITIES,
  initialSection = 'contacts',
  initialSelectedContactId,
  initialQuery = '',
  portalName = CLONE_DEMO_IDENTITY.company,
  onSelectContact,
}: HubSpotShowcaseProps) {
  const [section, setSection] = useState<HubSpotShowcaseSection>(initialSection)
  const [selectedId, setSelectedId] = useState(
    initialSelectedContactId ?? (initialSection === 'record' ? contacts[0]?.id : undefined),
  )
  const [query, setQuery] = useState(initialQuery)
  const [status, setStatus] = useState<HubSpotLeadStatus | 'All'>('All')
  const filteredContacts = useMemo(
    () => selectHubSpotContacts(contacts, query, status),
    [contacts, query, status],
  )
  const selected = contacts.find(contact => contact.id === selectedId) ?? contacts[0]

  const openContact = (contact: HubSpotContact) => {
    setSelectedId(contact.id)
    setSection('record')
    onSelectContact?.(contact)
  }

  return (
    <div className="hubspot-clone" data-clone-namespace="hubspot">
      <HubSpotTopbar portalName={portalName} query={query} onQueryChange={setQuery} />
      <div className="hubspot-shell">
        <HubSpotSectionNav
          section={section}
          onSectionChange={nextSection => {
            setSection(nextSection)
            if (nextSection === 'record' && !selectedId) setSelectedId(contacts[0]?.id)
          }}
        />
        <main className="hubspot-main">
          {section === 'contacts' && (
            <HubSpotContacts
              contacts={filteredContacts}
              status={status}
              onStatusChange={setStatus}
              onSelect={openContact}
            />
          )}
          {section === 'record' && selected && (
            <HubSpotRecord
              contact={selected}
              deals={deals}
              activities={activities}
              onBack={() => setSection('contacts')}
            />
          )}
          {section === 'pipeline' && (
            <HubSpotPipeline
              deals={deals}
              onOpenContact={contactId => {
                const contact = contacts.find(candidate => candidate.id === contactId)
                if (contact) openContact(contact)
              }}
            />
          )}
        </main>
      </div>
    </div>
  )
}
