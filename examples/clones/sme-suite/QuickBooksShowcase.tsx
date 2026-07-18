import { useMemo, useState, type ReactNode } from 'react'
import {
  SmeCloneAvatar,
  SmeCloneIcon,
  formatSmeCurrency,
} from './SmeClonePrimitives'
import './SmeCloneShowcases.css'

export type QuickBooksShowcaseSection = 'overview' | 'cash-flow' | 'transactions'
export type QuickBooksTransactionStatus = 'For review' | 'Categorized' | 'Excluded'

export interface QuickBooksCashPoint {
  label: string
  balance: number
  moneyIn: number
  moneyOut: number
}

export interface QuickBooksInvoice {
  id: string
  customer: string
  number: string
  amount: number
  dueDate: string
  status: 'Overdue' | 'Open' | 'Paid'
}

export interface QuickBooksTransaction {
  id: string
  date: string
  description: string
  account: string
  amount: number
  category: string
  status: QuickBooksTransactionStatus
  suggestion?: string
}

export interface QuickBooksShowcaseProps {
  cashFlow?: QuickBooksCashPoint[]
  invoices?: QuickBooksInvoice[]
  transactions?: QuickBooksTransaction[]
  initialSection?: QuickBooksShowcaseSection
  initialTransactionStatus?: QuickBooksTransactionStatus
  companyName?: string
}

export const QUICKBOOKS_SAMPLE_CASH_FLOW: QuickBooksCashPoint[] = [
  { label: 'Feb', balance: 118_000, moneyIn: 83_000, moneyOut: 61_000 },
  { label: 'Mar', balance: 126_000, moneyIn: 91_000, moneyOut: 83_000 },
  { label: 'Apr', balance: 143_000, moneyIn: 104_000, moneyOut: 87_000 },
  { label: 'May', balance: 136_000, moneyIn: 88_000, moneyOut: 95_000 },
  { label: 'Jun', balance: 158_000, moneyIn: 112_000, moneyOut: 90_000 },
  { label: 'Jul', balance: 174_620, moneyIn: 121_400, moneyOut: 104_780 },
]

export const QUICKBOOKS_SAMPLE_INVOICES: QuickBooksInvoice[] = [
  { id: 'inv-1048', customer: 'Northwind Health', number: '1048', amount: 18_500, dueDate: 'Jul 12', status: 'Overdue' },
  { id: 'inv-1056', customer: 'Atlas Works', number: '1056', amount: 12_800, dueDate: 'Jul 22', status: 'Open' },
  { id: 'inv-1059', customer: 'Cobalt Logistics', number: '1059', amount: 24_000, dueDate: 'Jul 28', status: 'Open' },
  { id: 'inv-1042', customer: 'Harbor Foods', number: '1042', amount: 15_600, dueDate: 'Jul 9', status: 'Paid' },
]

export const QUICKBOOKS_SAMPLE_TRANSACTIONS: QuickBooksTransaction[] = [
  {
    id: 'txn-1',
    date: 'Jul 18',
    description: 'AWS EMEA',
    account: 'Operating checking',
    amount: -3_842.17,
    category: 'Software & subscriptions',
    status: 'For review',
    suggestion: 'Cloud hosting',
  },
  {
    id: 'txn-2',
    date: 'Jul 18',
    description: 'Northwind Health ACH',
    account: 'Operating checking',
    amount: 18_500,
    category: 'Sales of product income',
    status: 'For review',
    suggestion: 'Match invoice 1048',
  },
  {
    id: 'txn-3',
    date: 'Jul 17',
    description: 'WeWork',
    account: 'Business card',
    amount: -2_980,
    category: 'Rent or lease',
    status: 'For review',
    suggestion: 'Office rent',
  },
  {
    id: 'txn-4',
    date: 'Jul 17',
    description: 'Delta Air Lines',
    account: 'Business card',
    amount: -864.43,
    category: 'Travel',
    status: 'For review',
    suggestion: 'Business travel',
  },
  {
    id: 'txn-5',
    date: 'Jul 16',
    description: 'Payroll transfer',
    account: 'Operating checking',
    amount: -48_320,
    category: 'Payroll expenses',
    status: 'Categorized',
  },
  {
    id: 'txn-6',
    date: 'Jul 16',
    description: 'Cobalt Logistics ACH',
    account: 'Operating checking',
    amount: 24_000,
    category: 'Sales of product income',
    status: 'Categorized',
  },
  {
    id: 'txn-7',
    date: 'Jul 15',
    description: 'Test authorization',
    account: 'Business card',
    amount: -1,
    category: 'Uncategorized expense',
    status: 'Excluded',
  },
]

export function selectQuickBooksTransactions(
  transactions: QuickBooksTransaction[],
  status: QuickBooksTransactionStatus,
  query = '',
): QuickBooksTransaction[] {
  const normalized = query.trim().toLowerCase()
  return transactions.filter(transaction => {
    if (transaction.status !== status) return false
    if (!normalized) return true
    return [
      transaction.description,
      transaction.account,
      transaction.category,
      transaction.suggestion ?? '',
    ].some(value => value.toLowerCase().includes(normalized))
  })
}

export function quickBooksCashBalance(points: QuickBooksCashPoint[]): number {
  return points[points.length - 1]?.balance ?? 0
}

function QuickBooksMark() {
  return (
    <span className="quickbooks-mark" aria-hidden="true">
      <span>qb</span>
    </span>
  )
}

function QuickBooksTopbar({
  companyName,
}: {
  companyName: string
}) {
  return (
    <header className="quickbooks-topbar">
      <button className="quickbooks-brand">
        <span className="quickbooks-intuit">intuit</span>
        <QuickBooksMark />
        <span>quickbooks</span>
      </button>
      <label className="quickbooks-global-search">
        <SmeCloneIcon name="search" size={16} />
        <input placeholder="Search transactions, contacts, reports, and help" />
      </label>
      <div className="quickbooks-top-actions">
        <button className="quickbooks-assist"><SmeCloneIcon name="sparkles" size={15} /> Intuit Assist</button>
        <button aria-label="Help"><SmeCloneIcon name="help" /></button>
        <button aria-label="Settings"><SmeCloneIcon name="settings" /></button>
        <button aria-label="Notifications"><SmeCloneIcon name="bell" /></button>
        <button className="quickbooks-company-switcher">
          <SmeCloneAvatar name={companyName} color="#2ca01c" size={29} />
          <span>{companyName}</span>
          <SmeCloneIcon name="chevron-down" size={12} />
        </button>
      </div>
    </header>
  )
}

function QuickBooksSidebar({
  section,
  onSectionChange,
}: {
  section: QuickBooksShowcaseSection
  onSectionChange: (section: QuickBooksShowcaseSection) => void
}) {
  return (
    <aside className="quickbooks-sidebar">
      <button className="quickbooks-new-button"><SmeCloneIcon name="plus" size={17} /> New</button>
      <nav>
        <button className={section === 'overview' ? 'is-active' : ''} onClick={() => onSectionChange('overview')}>
          <SmeCloneIcon name="home" size={18} /> Home
        </button>
        <button><SmeCloneIcon name="sparkles" size={18} /> Business feed <span className="quickbooks-beta">AI</span></button>
        <button className={section === 'cash-flow' ? 'is-active' : ''} onClick={() => onSectionChange('cash-flow')}>
          <SmeCloneIcon name="activity" size={18} /> Cash flow
        </button>
        <button><SmeCloneIcon name="calendar" size={18} /> Planner</button>
      </nav>
      <div className="quickbooks-sidebar-heading">BOOKMARKS <button><SmeCloneIcon name="plus" size={13} /></button></div>
      <nav>
        <button className={section === 'transactions' ? 'is-active' : ''} onClick={() => onSectionChange('transactions')}>
          <SmeCloneIcon name="bank" size={18} /> Bank transactions
          <span className="quickbooks-count">4</span>
        </button>
        <button><SmeCloneIcon name="invoice" size={18} /> Invoices</button>
        <button><SmeCloneIcon name="reports" size={18} /> Reports</button>
      </nav>
      <div className="quickbooks-sidebar-heading">INTUIT APPS</div>
      <nav>
        <button><SmeCloneIcon name="money" size={18} /> Accounting</button>
        <button><SmeCloneIcon name="contact" size={18} /> Customer Hub</button>
        <button><SmeCloneIcon name="invoice" size={18} /> Sales & get paid</button>
        <button><SmeCloneIcon name="document" size={18} /> Expenses & bills</button>
        <button><SmeCloneIcon name="task" size={18} /> Projects</button>
        <button><SmeCloneIcon name="team" size={18} /> Payroll</button>
      </nav>
      <footer>
        <button><SmeCloneIcon name="apps" size={17} /> Customize</button>
      </footer>
    </aside>
  )
}

function QuickBooksHomeTabs({
  section,
  onSectionChange,
}: {
  section: QuickBooksShowcaseSection
  onSectionChange: (section: QuickBooksShowcaseSection) => void
}) {
  return (
    <nav className="quickbooks-home-tabs">
      <button className={section === 'overview' ? 'is-active' : ''} onClick={() => onSectionChange('overview')}>Home</button>
      <button className={section === 'cash-flow' ? 'is-active' : ''} onClick={() => onSectionChange('cash-flow')}>Cash flow</button>
      <button>Planner</button>
    </nav>
  )
}

function QuickBooksCashChart({
  points,
  large = false,
}: {
  points: QuickBooksCashPoint[]
  large?: boolean
}) {
  const max = Math.max(...points.map(point => point.balance), 1)
  const min = Math.min(...points.map(point => point.balance), 0)
  const range = Math.max(max - min, 1)
  const coordinates = points.map((point, index) => {
    const x = points.length === 1 ? 50 : 7 + (index / (points.length - 1)) * 86
    const y = 80 - ((point.balance - min) / range) * 55
    return { x, y, point }
  })
  const path = coordinates.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  const area = coordinates.length > 0
    ? `${path} L ${coordinates[coordinates.length - 1]?.x ?? 93} 86 L ${coordinates[0]?.x ?? 7} 86 Z`
    : ''

  return (
    <div className={`quickbooks-cash-chart${large ? ' is-large' : ''}`}>
      <svg viewBox="0 0 100 92" preserveAspectRatio="none" role="img" aria-label="Cash balance trend">
        <defs>
          <linearGradient id={large ? 'qb-cash-fill-large' : 'qb-cash-fill'} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2ca01c" stopOpacity=".24" />
            <stop offset="1" stopColor="#2ca01c" stopOpacity=".02" />
          </linearGradient>
        </defs>
        {[25, 45, 65, 85].map(y => <line x1="0" y1={y} x2="100" y2={y} key={y} className="quickbooks-chart-gridline" />)}
        <path d={area} fill={`url(#${large ? 'qb-cash-fill-large' : 'qb-cash-fill'})`} />
        <path d={path} className="quickbooks-chart-line" />
        {coordinates.map(({ x, y, point }) => <circle cx={x} cy={y} r="1.5" key={point.label} className="quickbooks-chart-point" />)}
      </svg>
      <div className="quickbooks-chart-labels">
        {points.map(point => <span key={point.label}>{point.label}</span>)}
      </div>
    </div>
  )
}

function QuickBooksCard({
  title,
  action,
  className = '',
  children,
}: {
  title: string
  action?: string
  className?: string
  children: ReactNode
}) {
  return (
    <section className={`quickbooks-card ${className}`}>
      <header>
        <div><h2>{title}</h2><button aria-label={`More ${title} actions`}><SmeCloneIcon name="more" size={17} /></button></div>
        {action && <button className="quickbooks-card-action">{action}</button>}
      </header>
      {children}
    </section>
  )
}

function QuickBooksOverview({
  cashFlow,
  invoices,
  onSectionChange,
}: {
  cashFlow: QuickBooksCashPoint[]
  invoices: QuickBooksInvoice[]
  onSectionChange: (section: QuickBooksShowcaseSection) => void
}) {
  const overdue = invoices.filter(invoice => invoice.status === 'Overdue')
  const open = invoices.filter(invoice => invoice.status !== 'Paid')
  const openTotal = open.reduce((sum, invoice) => sum + invoice.amount, 0)
  return (
    <div className="quickbooks-overview">
      <header className="quickbooks-page-heading">
        <div>
          <h1>Good morning, Jordan</h1>
          <p>Here is what needs your attention today.</p>
        </div>
        <button><SmeCloneIcon name="grid" size={15} /> Customize layout</button>
      </header>
      <QuickBooksHomeTabs section="overview" onSectionChange={onSectionChange} />
      <section className="quickbooks-business-feed">
        <div className="quickbooks-feed-icon"><SmeCloneIcon name="sparkles" size={19} /></div>
        <div>
          <span>BUSINESS FEED</span>
          <strong>Four bank transactions are ready to review</strong>
          <p>Intuit Assist found likely categories and an invoice match.</p>
        </div>
        <button onClick={() => onSectionChange('transactions')}>Review transactions <SmeCloneIcon name="chevron-right" size={14} /></button>
      </section>
      <div className="quickbooks-dashboard-grid">
        <QuickBooksCard title="Cash flow" action="View cash flow" className="quickbooks-cash-card">
          <div className="quickbooks-card-period">LAST 6 MONTHS <SmeCloneIcon name="chevron-down" size={12} /></div>
          <div className="quickbooks-cash-summary">
            <div><span>Cash balance</span><strong>{formatSmeCurrency(quickBooksCashBalance(cashFlow))}</strong><small><i /> Up {formatSmeCurrency(16_620)} this month</small></div>
            <div><span>Money in</span><strong>{formatSmeCurrency(cashFlow[cashFlow.length - 1]?.moneyIn ?? 0)}</strong></div>
            <div><span>Money out</span><strong>{formatSmeCurrency(cashFlow[cashFlow.length - 1]?.moneyOut ?? 0)}</strong></div>
          </div>
          <QuickBooksCashChart points={cashFlow} />
        </QuickBooksCard>
        <QuickBooksCard title="Tasks" action="View all" className="quickbooks-tasks-card">
          <div className="quickbooks-task-item is-warning">
            <span><SmeCloneIcon name="bank" size={17} /></span>
            <p><strong>Review 4 bank transactions</strong><small>Suggested categories are ready</small></p>
            <button onClick={() => onSectionChange('transactions')}>Review</button>
          </div>
          <div className="quickbooks-task-item">
            <span><SmeCloneIcon name="invoice" size={17} /></span>
            <p><strong>Send {overdue.length} overdue invoice reminder</strong><small>{formatSmeCurrency(overdue.reduce((sum, invoice) => sum + invoice.amount, 0))} outstanding</small></p>
            <button>Send</button>
          </div>
          <div className="quickbooks-task-item">
            <span><SmeCloneIcon name="check" size={17} /></span>
            <p><strong>Reconcile operating checking</strong><small>Through June 30</small></p>
            <button>Start</button>
          </div>
        </QuickBooksCard>
        <QuickBooksCard title="Profit and loss" action="View report" className="quickbooks-pnl-card">
          <div className="quickbooks-card-period">THIS MONTH <SmeCloneIcon name="chevron-down" size={12} /></div>
          <div className="quickbooks-pnl-total">
            <span>Net profit</span>
            <strong>{formatSmeCurrency(46_240)}</strong>
            <small><SmeCloneIcon name="arrow-up" size={12} /> 12.4% from last month</small>
          </div>
          <div className="quickbooks-pnl-bars">
            <div>
              <span>Income</span>
              <i><b style={{ width: '92%' }} /></i>
              <strong>{formatSmeCurrency(151_020)}</strong>
            </div>
            <div>
              <span>Expenses</span>
              <i><b style={{ width: '64%' }} /></i>
              <strong>{formatSmeCurrency(104_780)}</strong>
            </div>
          </div>
        </QuickBooksCard>
        <QuickBooksCard title="Invoices" action="View invoices" className="quickbooks-invoice-card">
          <div className="quickbooks-card-period">LAST 365 DAYS <SmeCloneIcon name="chevron-down" size={12} /></div>
          <div className="quickbooks-invoice-total">
            <span>Open invoices</span>
            <strong>{formatSmeCurrency(openTotal)}</strong>
          </div>
          <div className="quickbooks-invoice-meter">
            <span style={{ width: '31%' }} className="is-overdue" />
            <span style={{ width: '43%' }} className="is-open" />
            <span style={{ width: '26%' }} className="is-paid" />
          </div>
          <dl className="quickbooks-invoice-legend">
            <div><dt><i className="is-overdue" /> Overdue</dt><dd>{formatSmeCurrency(overdue.reduce((sum, invoice) => sum + invoice.amount, 0))}</dd></div>
            <div><dt><i className="is-open" /> Not due yet</dt><dd>{formatSmeCurrency(open.filter(invoice => invoice.status === 'Open').reduce((sum, invoice) => sum + invoice.amount, 0))}</dd></div>
            <div><dt><i className="is-paid" /> Paid last 30 days</dt><dd>{formatSmeCurrency(invoices.filter(invoice => invoice.status === 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0))}</dd></div>
          </dl>
        </QuickBooksCard>
        <QuickBooksCard title="Expenses" action="View expenses" className="quickbooks-expense-card">
          <div className="quickbooks-card-period">THIS MONTH <SmeCloneIcon name="chevron-down" size={12} /></div>
          <div className="quickbooks-expense-content">
            <div className="quickbooks-donut"><span>{formatSmeCurrency(104_780, { compact: true })}<small>Total</small></span></div>
            <dl>
              <div><dt><i className="is-payroll" /> Payroll</dt><dd>{formatSmeCurrency(48_320)}</dd></div>
              <div><dt><i className="is-software" /> Software</dt><dd>{formatSmeCurrency(21_840)}</dd></div>
              <div><dt><i className="is-marketing" /> Marketing</dt><dd>{formatSmeCurrency(18_400)}</dd></div>
              <div><dt><i className="is-other" /> Other</dt><dd>{formatSmeCurrency(16_220)}</dd></div>
            </dl>
          </div>
        </QuickBooksCard>
        <QuickBooksCard title="Bank accounts" action="Go to bank transactions" className="quickbooks-bank-card">
          <div className="quickbooks-bank-account">
            <span className="quickbooks-bank-logo">NW</span>
            <div><strong>Operating checking</strong><small>Updated 3 minutes ago</small></div>
            <div><strong>{formatSmeCurrency(174_620)}</strong><small>Bank balance</small></div>
          </div>
          <div className="quickbooks-bank-account">
            <span className="quickbooks-bank-logo is-card">V</span>
            <div><strong>Business card</strong><small>Updated 8 minutes ago</small></div>
            <div><strong>{formatSmeCurrency(-12_480)}</strong><small>Card balance</small></div>
          </div>
          <button className="quickbooks-connect-link"><SmeCloneIcon name="plus" size={14} /> Connect another account</button>
        </QuickBooksCard>
      </div>
    </div>
  )
}

function QuickBooksCashFlow({
  points,
  onSectionChange,
}: {
  points: QuickBooksCashPoint[]
  onSectionChange: (section: QuickBooksShowcaseSection) => void
}) {
  const latest = points[points.length - 1]
  return (
    <div className="quickbooks-cash-flow-page">
      <header className="quickbooks-page-heading">
        <div><h1>Cash flow</h1><p>Track what is coming in, what is going out, and what is ahead.</p></div>
        <button><SmeCloneIcon name="settings" size={15} /> Cash flow settings</button>
      </header>
      <QuickBooksHomeTabs section="cash-flow" onSectionChange={onSectionChange} />
      <div className="quickbooks-cash-kpis">
        <article><span>Cash balance</span><strong>{formatSmeCurrency(latest?.balance ?? 0)}</strong><small className="is-positive"><SmeCloneIcon name="arrow-up" size={12} /> 10.5% this month</small></article>
        <article><span>Money in</span><strong>{formatSmeCurrency(latest?.moneyIn ?? 0)}</strong><small>12 transactions</small></article>
        <article><span>Money out</span><strong>{formatSmeCurrency(latest?.moneyOut ?? 0)}</strong><small>38 transactions</small></article>
        <article><span>Projected in 90 days</span><strong>{formatSmeCurrency(214_900)}</strong><small className="is-positive">Healthy runway</small></article>
      </div>
      <QuickBooksCard title="Cash balance forecast" action="View report" className="quickbooks-cash-forecast">
        <div className="quickbooks-forecast-header">
          <div><button className="is-active">6 months</button><button>12 months</button><button>24 months</button></div>
          <div><span><i className="is-balance" /> Cash balance</span><span><i className="is-in" /> Money in</span><span><i className="is-out" /> Money out</span></div>
        </div>
        <QuickBooksCashChart points={points} large />
      </QuickBooksCard>
      <div className="quickbooks-cash-lower-grid">
        <QuickBooksCard title="Upcoming" action="Open planner">
          {[
            ['Jul 22', 'Atlas Works invoice', 12_800, 'in'],
            ['Jul 25', 'Payroll', -48_320, 'out'],
            ['Jul 28', 'Cobalt Logistics invoice', 24_000, 'in'],
            ['Aug 1', 'Office rent', -2_980, 'out'],
          ].map(([date, label, amount, direction]) => (
            <div className="quickbooks-upcoming-row" key={String(label)}>
              <span>{date}</span>
              <p><strong>{label}</strong><small>{direction === 'in' ? 'Expected payment' : 'Scheduled expense'}</small></p>
              <strong className={direction === 'in' ? 'is-in' : 'is-out'}>{formatSmeCurrency(Number(amount))}</strong>
            </div>
          ))}
        </QuickBooksCard>
        <QuickBooksCard title="Cash flow insights">
          <div className="quickbooks-insight">
            <span><SmeCloneIcon name="sparkles" size={17} /></span>
            <p><strong>Collections could improve August cash by $18.5K</strong><small>One overdue invoice has a high likelihood of payment after a reminder.</small></p>
            <button>Draft reminder</button>
          </div>
          <div className="quickbooks-insight">
            <span><SmeCloneIcon name="chart" size={17} /></span>
            <p><strong>Software spend is 14% above plan</strong><small>Three renewals are scheduled before month end.</small></p>
            <button>Review spend</button>
          </div>
        </QuickBooksCard>
      </div>
    </div>
  )
}

function QuickBooksTransactions({
  transactions,
  initialStatus,
}: {
  transactions: QuickBooksTransaction[]
  initialStatus: QuickBooksTransactionStatus
}) {
  const [status, setStatus] = useState(initialStatus)
  const [query, setQuery] = useState('')
  const filtered = useMemo(
    () => selectQuickBooksTransactions(transactions, status, query),
    [query, status, transactions],
  )

  return (
    <div className="quickbooks-transactions-page">
      <header className="quickbooks-page-heading">
        <div><h1>Bank transactions</h1><p>Review, match, and categorize activity from connected accounts.</p></div>
        <div><button><SmeCloneIcon name="arrow-down" size={14} /> Update</button><button><SmeCloneIcon name="plus" size={14} /> Link account</button></div>
      </header>
      <div className="quickbooks-account-strip">
        <button className="is-active">
          <span className="quickbooks-bank-logo">NW</span>
          <span><strong>Operating checking</strong><small>Bank balance {formatSmeCurrency(174_620)}</small></span>
          <b>4</b>
        </button>
        <button>
          <span className="quickbooks-bank-logo is-card">V</span>
          <span><strong>Business card</strong><small>Card balance {formatSmeCurrency(-12_480)}</small></span>
          <b>2</b>
        </button>
        <button className="quickbooks-add-account"><SmeCloneIcon name="plus" size={16} /> Add account</button>
      </div>
      <div className="quickbooks-transaction-tabs">
        {(['For review', 'Categorized', 'Excluded'] as QuickBooksTransactionStatus[]).map(option => (
          <button className={status === option ? 'is-active' : ''} key={option} onClick={() => setStatus(option)}>
            {option}
            <span>{transactions.filter(transaction => transaction.status === option).length}</span>
          </button>
        ))}
      </div>
      <div className="quickbooks-transaction-toolbar">
        <label><SmeCloneIcon name="search" size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search transactions" /></label>
        <div>
          <button><SmeCloneIcon name="filter" size={14} /> Filter</button>
          <button><SmeCloneIcon name="settings" size={14} /> Table settings</button>
          <button>Batch actions <SmeCloneIcon name="chevron-down" size={12} /></button>
        </div>
      </div>
      <div className="quickbooks-transaction-table-wrap">
        <table className="quickbooks-transaction-table">
          <thead>
            <tr>
              <th><input type="checkbox" aria-label="Select all transactions" /></th>
              <th>Date</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Category or match</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(transaction => (
              <tr key={transaction.id}>
                <td><input type="checkbox" aria-label={`Select ${transaction.description}`} /></td>
                <td>{transaction.date}</td>
                <td><strong>{transaction.description}</strong><small>{transaction.account}</small></td>
                <td className={transaction.amount >= 0 ? 'is-in' : 'is-out'}>{formatSmeCurrency(transaction.amount, { maximumFractionDigits: 2 })}</td>
                <td>
                  {transaction.suggestion && <span className="quickbooks-ai-suggestion"><SmeCloneIcon name="sparkles" size={12} /> Suggested</span>}
                  <button className="quickbooks-category-select">{transaction.suggestion ?? transaction.category}<SmeCloneIcon name="chevron-down" size={12} /></button>
                  {transaction.suggestion && <small>{transaction.category}</small>}
                </td>
                <td>
                  <button className="quickbooks-confirm-button">{transaction.amount > 0 && transaction.suggestion?.startsWith('Match') ? 'Match' : 'Confirm'}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="quickbooks-empty">No transactions in this view.</div>}
      </div>
      <footer className="quickbooks-transaction-footer">
        <span>{filtered.length} transactions</span>
        <span>Bank balance {formatSmeCurrency(174_620)} · In QuickBooks {formatSmeCurrency(156_120)}</span>
      </footer>
    </div>
  )
}

export function QuickBooksShowcase({
  cashFlow = QUICKBOOKS_SAMPLE_CASH_FLOW,
  invoices = QUICKBOOKS_SAMPLE_INVOICES,
  transactions = QUICKBOOKS_SAMPLE_TRANSACTIONS,
  initialSection = 'overview',
  initialTransactionStatus = 'For review',
  companyName = 'Northstar Studio',
}: QuickBooksShowcaseProps) {
  const [section, setSection] = useState<QuickBooksShowcaseSection>(initialSection)

  return (
    <div className="quickbooks-clone" data-clone-namespace="quickbooks">
      <QuickBooksTopbar companyName={companyName} />
      <div className="quickbooks-shell">
        <QuickBooksSidebar section={section} onSectionChange={setSection} />
        <main className="quickbooks-main">
          {section === 'overview' && (
            <QuickBooksOverview cashFlow={cashFlow} invoices={invoices} onSectionChange={setSection} />
          )}
          {section === 'cash-flow' && (
            <QuickBooksCashFlow points={cashFlow} onSectionChange={setSection} />
          )}
          {section === 'transactions' && (
            <QuickBooksTransactions transactions={transactions} initialStatus={initialTransactionStatus} />
          )}
        </main>
      </div>
    </div>
  )
}
