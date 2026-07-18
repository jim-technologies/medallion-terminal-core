import { useMemo, useState } from 'react'
import {
  ReadinessAvatar,
  ReadinessIcon,
  ReadinessSparkline,
  formatReadinessCurrency,
  formatReadinessPercent,
} from './ReadinessPrimitives'
import './ReadinessShowcases.css'

export type StripeShowcaseSection = 'overview' | 'payments' | 'billing' | 'disputes'
export type StripePaymentStatus = 'Succeeded' | 'Refunded' | 'Failed' | 'Pending'
export type StripeSubscriptionStatus = 'Active' | 'Trialing' | 'Past due' | 'Canceled'
export type StripeDisputeStatus = 'Needs response' | 'Under review' | 'Won' | 'Lost'

export interface StripePayment {
  id: string
  createdAt: string
  customer: string
  email: string
  amount: number
  fee: number
  status: StripePaymentStatus
  method: string
  description: string
  country: string
  risk: 'Normal' | 'Elevated'
}

export interface StripeSubscription {
  id: string
  customer: string
  plan: string
  amount: number
  interval: 'month' | 'year'
  status: StripeSubscriptionStatus
  startedAt: string
  renewsAt: string
}

export interface StripeDispute {
  id: string
  paymentId: string
  customer: string
  amount: number
  reason: string
  status: StripeDisputeStatus
  respondBy: string
  evidenceProgress: number
}

export interface StripeShowcaseProps {
  payments?: readonly StripePayment[]
  subscriptions?: readonly StripeSubscription[]
  disputes?: readonly StripeDispute[]
  initialSection?: StripeShowcaseSection
  initialSelectedPaymentId?: string
  accountName?: string
  onSelectPayment?: (payment: StripePayment) => void
}

export const STRIPE_SAMPLE_PAYMENTS: readonly StripePayment[] = [
  { id: 'pi_3Qnorthstar01', createdAt: 'Jul 18, 10:42 AM', customer: 'Maya Chen', email: 'maya@example.test', amount: 428, fee: 12.71, status: 'Succeeded', method: '•••• 4242', description: 'Order #1057', country: 'US', risk: 'Normal' },
  { id: 'pi_3Qnorthstar02', createdAt: 'Jul 18, 9:18 AM', customer: 'Noah Williams', email: 'noah@example.test', amount: 186, fee: 5.69, status: 'Succeeded', method: '•••• 1881', description: 'Order #1056', country: 'US', risk: 'Normal' },
  { id: 'pi_3Qnorthstar03', createdAt: 'Jul 17, 6:31 PM', customer: 'Sarah Kim', email: 'sarah@example.test', amount: 612, fee: 18.05, status: 'Pending', method: 'ACH debit', description: 'Annual plan', country: 'US', risk: 'Normal' },
  { id: 'pi_3Qnorthstar04', createdAt: 'Jul 17, 2:09 PM', customer: 'Theo Martin', email: 'theo@example.test', amount: 248, fee: 7.49, status: 'Refunded', method: '•••• 9010', description: 'Order #1054', country: 'US', risk: 'Normal' },
  { id: 'pi_3Qnorthstar05', createdAt: 'Jul 17, 11:14 AM', customer: 'Nina Patel', email: 'nina@example.test', amount: 1290, fee: 37.71, status: 'Succeeded', method: '•••• 5556', description: 'Implementation deposit', country: 'CA', risk: 'Normal' },
  { id: 'pi_3Qnorthstar06', createdAt: 'Jul 16, 4:28 PM', customer: 'Jordan Bell', email: 'jordan@example.test', amount: 94, fee: 3.03, status: 'Failed', method: '•••• 0341', description: 'Starter plan', country: 'GB', risk: 'Elevated' },
]

export const STRIPE_SAMPLE_SUBSCRIPTIONS: readonly StripeSubscription[] = [
  { id: 'sub_01', customer: 'Northwind Health', plan: 'Operations Pro', amount: 2400, interval: 'month', status: 'Active', startedAt: 'Jan 18, 2026', renewsAt: 'Aug 18, 2026' },
  { id: 'sub_02', customer: 'Cascade Retail', plan: 'Operations Growth', amount: 980, interval: 'month', status: 'Trialing', startedAt: 'Jul 12, 2026', renewsAt: 'Jul 26, 2026' },
  { id: 'sub_03', customer: 'Brightpath Energy', plan: 'Enterprise', amount: 36000, interval: 'year', status: 'Active', startedAt: 'Dec 2, 2025', renewsAt: 'Dec 2, 2026' },
  { id: 'sub_04', customer: 'Blue Harbor Logistics', plan: 'Operations Pro', amount: 2400, interval: 'month', status: 'Past due', startedAt: 'Mar 4, 2026', renewsAt: 'Jul 4, 2026' },
  { id: 'sub_05', customer: 'Atlas Design Co.', plan: 'Starter', amount: 190, interval: 'month', status: 'Canceled', startedAt: 'Feb 9, 2026', renewsAt: '—' },
]

export const STRIPE_SAMPLE_DISPUTES: readonly StripeDispute[] = [
  { id: 'dp_01', paymentId: 'pi_3Qnorthstar07', customer: 'Avery Brooks', amount: 486, reason: 'Product not received', status: 'Needs response', respondBy: 'Jul 23', evidenceProgress: 0.66 },
  { id: 'dp_02', paymentId: 'pi_3Qnorthstar08', customer: 'Morgan Reed', amount: 129, reason: 'Unrecognized', status: 'Under review', respondBy: 'Submitted Jul 16', evidenceProgress: 1 },
  { id: 'dp_03', paymentId: 'pi_3Qnorthstar09', customer: 'Lee Carter', amount: 760, reason: 'Duplicate', status: 'Won', respondBy: 'Closed Jul 14', evidenceProgress: 1 },
  { id: 'dp_04', paymentId: 'pi_3Qnorthstar10', customer: 'Riley Ross', amount: 218, reason: 'Credit not processed', status: 'Lost', respondBy: 'Closed Jul 10', evidenceProgress: 1 },
]

export function selectStripePayments(
  payments: readonly StripePayment[],
  query = '',
  status?: StripePaymentStatus,
): StripePayment[] {
  const normalized = query.trim().toLowerCase()
  return payments.filter(payment => {
    if (status && payment.status !== status) return false
    if (!normalized) return true
    return [
      payment.id,
      payment.customer,
      payment.email,
      payment.description,
      payment.method,
    ].join(' ').toLowerCase().includes(normalized)
  })
}

export function stripeNetVolume(payments: readonly StripePayment[]): number {
  return payments
    .filter(payment => payment.status === 'Succeeded')
    .reduce((total, payment) => total + payment.amount - payment.fee, 0)
}

const STRIPE_NAV: {
  id: StripeShowcaseSection
  label: string
  icon: 'home' | 'money' | 'refresh' | 'warning'
}[] = [
  { id: 'overview', label: 'Home', icon: 'home' },
  { id: 'payments', label: 'Payments', icon: 'money' },
  { id: 'billing', label: 'Billing', icon: 'refresh' },
  { id: 'disputes', label: 'Disputes', icon: 'warning' },
]

export function StripeShowcase({
  payments = STRIPE_SAMPLE_PAYMENTS,
  subscriptions = STRIPE_SAMPLE_SUBSCRIPTIONS,
  disputes = STRIPE_SAMPLE_DISPUTES,
  initialSection = 'overview',
  initialSelectedPaymentId,
  accountName = 'Northstar Supply',
  onSelectPayment,
}: StripeShowcaseProps) {
  const [section, setSection] = useState<StripeShowcaseSection>(initialSection)
  const [query, setQuery] = useState('')
  const [paymentStatus, setPaymentStatus] = useState<StripePaymentStatus | undefined>()
  const [selectedPaymentId, setSelectedPaymentId] = useState(initialSelectedPaymentId ?? '')

  const filteredPayments = useMemo(
    () => selectStripePayments(payments, query, paymentStatus),
    [payments, query, paymentStatus],
  )
  const selectedPayment = payments.find(payment => payment.id === selectedPaymentId)
  const netVolume = stripeNetVolume(payments)
  const activeSubscriptions = subscriptions.filter(subscription => subscription.status === 'Active')
  const monthlyRecurring = subscriptions.reduce((total, subscription) => {
    if (subscription.status !== 'Active') return total
    return total + (subscription.interval === 'year' ? subscription.amount / 12 : subscription.amount)
  }, 0)

  const choosePayment = (payment: StripePayment) => {
    setSelectedPaymentId(payment.id)
    onSelectPayment?.(payment)
  }

  return (
    <div className="ready-showcase stripe-showcase">
      <aside className="stripe-sidebar">
        <div className="stripe-brand"><span>S</span></div>
        <button className="stripe-account-switcher"><span>{accountName}</span><small>Standard account</small><ReadinessIcon name="chevron-down" size={13} /></button>
        <nav>
          {STRIPE_NAV.map(item => (
            <button
              key={item.id}
              className={section === item.id ? 'active' : ''}
              onClick={() => { setSection(item.id); setSelectedPaymentId('') }}
            >
              <ReadinessIcon name={item.icon} size={16} /><span>{item.label}</span>
              {item.id === 'disputes' && <em>{disputes.filter(dispute => dispute.status === 'Needs response').length}</em>}
            </button>
          ))}
          <button><ReadinessIcon name="people" size={16} /><span>Customers</span></button>
          <button><ReadinessIcon name="package" size={16} /><span>Product catalog</span></button>
        </nav>
        <div className="stripe-nav-heading">More</div>
        <nav>
          <button><ReadinessIcon name="chart" size={16} /><span>Reports</span></button>
          <button><ReadinessIcon name="database" size={16} /><span>Data</span></button>
          <button><ReadinessIcon name="code" size={16} /><span>Developers</span></button>
        </nav>
        <div className="stripe-sidebar-footer"><button><ReadinessIcon name="settings" size={16} />Settings</button></div>
      </aside>

      <div className="stripe-workspace">
        <header className="stripe-topbar">
          <label className="stripe-global-search"><ReadinessIcon name="search" size={15} /><input placeholder="Search…" /><kbd>/</kbd></label>
          <div className="ready-top-actions">
            <button><ReadinessIcon name="help" /></button>
            <button className="ready-notification"><ReadinessIcon name="bell" /><i /></button>
            <button className="stripe-create-button"><ReadinessIcon name="plus" size={14} />Create</button>
            <ReadinessAvatar name="Jordan Lee" color="#6052b8" size={27} />
          </div>
        </header>

        <main className="stripe-main">
          {section === 'overview' && (
            <>
              <div className="ready-page-heading stripe-page-heading">
                <div><h1>Overview</h1><p>Friday, July 18</p></div>
                <div className="ready-heading-actions"><button className="stripe-period-button">Last 7 days <ReadinessIcon name="chevron-down" size={13} /></button></div>
              </div>
              <section className="stripe-overview-card">
                <div className="stripe-overview-metrics">
                  <StripeOverviewMetric label="Gross volume" value={formatReadinessCurrency(86_420)} change="+12.8%" values={[12, 18, 15, 28, 24, 34, 42, 40, 53, 61, 72]} />
                  <StripeOverviewMetric label="Net volume" value={formatReadinessCurrency(82_914)} change="+11.9%" values={[10, 17, 16, 22, 26, 31, 38, 37, 49, 57, 67]} />
                  <StripeOverviewMetric label="Successful payments" value="314" change="+8.2%" values={[18, 14, 24, 22, 31, 29, 35, 42, 39, 51, 58]} />
                  <StripeOverviewMetric label="Dispute rate" value="0.38%" change="-0.06%" values={[44, 41, 39, 36, 33, 34, 29, 27, 26, 24, 21]} good />
                </div>
                <div className="stripe-volume-chart">
                  <div className="stripe-chart-axis"><span>$20K</span><span>$15K</span><span>$10K</span><span>$5K</span><span>$0</span></div>
                  <div className="stripe-chart-plot">
                    <div className="stripe-chart-grid"><i /><i /><i /><i /><i /></div>
                    <ReadinessSparkline values={[8, 11, 9, 14, 19, 17, 26, 22, 31, 29, 38, 42, 49]} color="#6557d8" height={190} />
                    <div className="stripe-chart-labels"><span>Jul 12</span><span>Jul 14</span><span>Jul 16</span><span>Jul 18</span></div>
                  </div>
                </div>
              </section>
              <div className="stripe-overview-grid">
                <section className="stripe-card">
                  <div className="stripe-card-heading"><div><h2>Balances</h2><span>Updated just now</span></div><button>View</button></div>
                  <div className="stripe-balance"><span>Available to pay out</span><strong>{formatReadinessCurrency(48_621, { cents: true })}</strong><small><i />Expected Jul 21</small></div>
                  <div className="stripe-balance-row"><span>Pending</span><strong>{formatReadinessCurrency(12_408, { cents: true })}</strong></div>
                  <div className="stripe-balance-row"><span>Reserve</span><strong>$0.00</strong></div>
                </section>
                <section className="stripe-card">
                  <div className="stripe-card-heading"><div><h2>Revenue recovery</h2><span>Last 30 days</span></div><button onClick={() => setSection('billing')}>View Billing</button></div>
                  <div className="stripe-recovery">
                    <span className="stripe-recovery-ring">84%</span>
                    <div><strong>{formatReadinessCurrency(7_840)}</strong><span>recovered revenue</span><small>24 of 31 failed payments recovered</small></div>
                  </div>
                  <div className="stripe-recovery-footer"><span>Smart retries</span><strong>Enabled</strong></div>
                </section>
                <section className="stripe-card stripe-attention-card">
                  <div className="stripe-card-heading"><div><h2>Needs attention</h2><span>Operational tasks</span></div></div>
                  <button onClick={() => setSection('disputes')}><i className="warning"><ReadinessIcon name="warning" size={15} /></i><span><strong>1 dispute needs a response</strong><small>Evidence due Jul 23</small></span><ReadinessIcon name="chevron-right" size={14} /></button>
                  <button><i><ReadinessIcon name="shield" size={15} /></i><span><strong>Verify business representative</strong><small>Complete by Aug 2</small></span><ReadinessIcon name="chevron-right" size={14} /></button>
                  <button><i><ReadinessIcon name="bank" size={15} /></i><span><strong>Confirm payout account</strong><small>Bank ending in 0284</small></span><ReadinessIcon name="chevron-right" size={14} /></button>
                </section>
              </div>
            </>
          )}

          {section === 'payments' && !selectedPayment && (
            <>
              <div className="ready-page-heading stripe-page-heading">
                <div><h1>Payments</h1><p>Track the full lifecycle of every customer payment.</p></div>
                <div className="ready-heading-actions"><button className="ready-button secondary">Export</button><button className="ready-button primary">Create payment</button></div>
              </div>
              <div className="stripe-payment-stats">
                <div><span>Net volume</span><strong>{formatReadinessCurrency(netVolume, { cents: true })}</strong><small>From visible successful payments</small></div>
                <div><span>Acceptance rate</span><strong>96.8%</strong><small><ReadinessIcon name="arrow-up" size={11} />1.2% vs prior period</small></div>
                <div><span>Refunded</span><strong>{formatReadinessCurrency(payments.filter(payment => payment.status === 'Refunded').reduce((sum, payment) => sum + payment.amount, 0), { cents: true })}</strong><small>{payments.filter(payment => payment.status === 'Refunded').length} payment</small></div>
              </div>
              <section className="stripe-table-card">
                <div className="stripe-table-tabs"><button className="active">All</button><button>Succeeded</button><button>Refunded</button><button>Uncaptured</button><button>Failed</button></div>
                <div className="ready-panel-toolbar stripe-table-toolbar">
                  <label className="ready-search-field"><ReadinessIcon name="search" size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search payments" /></label>
                  <button className={paymentStatus ? 'active' : ''} onClick={() => setPaymentStatus(paymentStatus ? undefined : 'Succeeded')}><ReadinessIcon name="filter" size={14} />Filter</button>
                  <button><ReadinessIcon name="download" size={14} />Export</button>
                  <button><ReadinessIcon name="more" size={15} /></button>
                </div>
                <div className="stripe-payment-table">
                  <div className="stripe-payment-head"><span>Amount</span><span>Payment method</span><span>Description</span><span>Customer</span><span>Date</span><span>Status</span></div>
                  {filteredPayments.map(payment => (
                    <button key={payment.id} onClick={() => choosePayment(payment)}>
                      <strong>{formatReadinessCurrency(payment.amount, { cents: true })} USD</strong>
                      <span><i className="stripe-card-brand">VISA</i>{payment.method}</span>
                      <span>{payment.description}</span>
                      <span>{payment.email}</span>
                      <span>{payment.createdAt}</span>
                      <StripeStatus label={payment.status} />
                    </button>
                  ))}
                </div>
                <div className="stripe-table-footer"><span>{filteredPayments.length} results</span><div><button disabled>Previous</button><button>Next</button></div></div>
              </section>
            </>
          )}

          {section === 'payments' && selectedPayment && (
            <>
              <div className="stripe-detail-breadcrumb"><button onClick={() => setSelectedPaymentId('')}><ReadinessIcon name="chevron-left" size={15} />Payments</button></div>
              <div className="stripe-payment-detail-heading">
                <div><span className="stripe-detail-icon"><ReadinessIcon name="check" size={22} /></span><div><h1>{formatReadinessCurrency(selectedPayment.amount, { cents: true })} USD</h1><span><StripeStatus label={selectedPayment.status} />{selectedPayment.createdAt}</span></div></div>
                <div className="ready-heading-actions"><button className="ready-button secondary"><ReadinessIcon name="more" size={15} />More</button><button className="ready-button primary">Refund</button></div>
              </div>
              <div className="stripe-detail-grid">
                <div>
                  <section className="stripe-card stripe-detail-summary">
                    <h2>Payment details</h2>
                    <dl>
                      <div><dt>Amount</dt><dd>{formatReadinessCurrency(selectedPayment.amount, { cents: true })} USD</dd></div>
                      <div><dt>Stripe fee</dt><dd>−{formatReadinessCurrency(selectedPayment.fee, { cents: true })} USD</dd></div>
                      <div className="total"><dt>Net</dt><dd>{formatReadinessCurrency(selectedPayment.amount - selectedPayment.fee, { cents: true })} USD</dd></div>
                    </dl>
                    <div className="stripe-detail-timeline">
                      <div><i className="good"><ReadinessIcon name="check" size={13} /></i><span><strong>Payment succeeded</strong><small>{selectedPayment.createdAt}</small></span><em>{formatReadinessCurrency(selectedPayment.amount, { cents: true })}</em></div>
                      <div><i><ReadinessIcon name="shield" size={13} /></i><span><strong>Payment authenticated</strong><small>3D Secure was not required</small></span></div>
                      <div><i><ReadinessIcon name="money" size={13} /></i><span><strong>Payment started</strong><small>Using {selectedPayment.method}</small></span></div>
                    </div>
                  </section>
                  <section className="stripe-card stripe-detail-summary">
                    <h2>Payment method</h2>
                    <div className="stripe-method-card"><i>VISA</i><span><strong>Visa {selectedPayment.method}</strong><small>Credit · {selectedPayment.country}</small></span><StripeStatus label={selectedPayment.risk === 'Normal' ? 'Succeeded' : 'Failed'} override={selectedPayment.risk} /></div>
                    <dl><div><dt>Cardholder</dt><dd>{selectedPayment.customer}</dd></div><div><dt>Fingerprint</dt><dd><code>Xt5uA9KpQ8jZn4</code></dd></div><div><dt>Expires</dt><dd>04 / 2029</dd></div></dl>
                  </section>
                  <section className="stripe-card stripe-detail-summary">
                    <h2>Events and logs</h2>
                    <div className="stripe-event-row"><span>payment_intent.succeeded</span><code>200 OK</code><small>{selectedPayment.createdAt}</small></div>
                    <div className="stripe-event-row"><span>charge.succeeded</span><code>200 OK</code><small>{selectedPayment.createdAt}</small></div>
                  </section>
                </div>
                <aside>
                  <section className="stripe-card stripe-side-detail">
                    <h2>Customer</h2>
                    <a>{selectedPayment.customer}</a><span>{selectedPayment.email}</span><button>View customer</button>
                  </section>
                  <section className="stripe-card stripe-side-detail">
                    <h2>Details</h2>
                    <dl><div><dt>Description</dt><dd>{selectedPayment.description}</dd></div><div><dt>Statement descriptor</dt><dd>NORTHSTAR</dd></div><div><dt>Payment ID</dt><dd><code>{selectedPayment.id}</code></dd></div></dl>
                  </section>
                  <section className="stripe-card stripe-side-detail">
                    <h2>Risk insights</h2>
                    <div className="stripe-risk-score"><span>18</span><div><strong>{selectedPayment.risk} risk</strong><small>Radar evaluation</small></div></div>
                    <p>No high-risk signals were detected for this payment.</p>
                  </section>
                </aside>
              </div>
            </>
          )}

          {section === 'billing' && (
            <>
              <div className="ready-page-heading stripe-page-heading">
                <div><h1>Subscriptions</h1><p>Manage recurring revenue, plans, trials, and recovery.</p></div>
                <div className="ready-heading-actions"><button className="ready-button secondary">Export</button><button className="ready-button primary">Create subscription</button></div>
              </div>
              <div className="stripe-billing-stats">
                <div><span>Monthly recurring revenue</span><strong>{formatReadinessCurrency(monthlyRecurring)}</strong><small><ReadinessIcon name="arrow-up" size={11} />8.4% this month</small></div>
                <div><span>Active subscriptions</span><strong>{activeSubscriptions.length}</strong><small>1 trial converting soon</small></div>
                <div><span>Revenue retention</span><strong>97.6%</strong><small>Trailing 12 months</small></div>
                <div><span>Past due</span><strong>{subscriptions.filter(subscription => subscription.status === 'Past due').length}</strong><small>$2,400 at risk</small></div>
              </div>
              <section className="stripe-table-card">
                <div className="stripe-table-tabs"><button className="active">All</button><button>Active</button><button>Trialing</button><button>Past due</button><button>Canceled</button></div>
                <div className="ready-panel-toolbar stripe-table-toolbar"><label className="ready-search-field"><ReadinessIcon name="search" size={15} /><input placeholder="Search subscriptions" /></label><button><ReadinessIcon name="filter" size={14} />Filter</button></div>
                <div className="stripe-subscription-table">
                  <div className="stripe-subscription-head"><span>Customer</span><span>Plan</span><span>Price</span><span>Status</span><span>Started</span><span>Next invoice</span></div>
                  {subscriptions.map(subscription => (
                    <button key={subscription.id}>
                      <span><strong>{subscription.customer}</strong><small>{subscription.id}</small></span>
                      <span>{subscription.plan}</span>
                      <span>{formatReadinessCurrency(subscription.amount, { cents: true })} / {subscription.interval}</span>
                      <StripeStatus label={subscription.status} />
                      <span>{subscription.startedAt}</span><span>{subscription.renewsAt}</span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}

          {section === 'disputes' && (
            <>
              <div className="ready-page-heading stripe-page-heading">
                <div><h1>Disputes</h1><p>Review chargebacks, collect evidence, and track outcomes.</p></div>
                <button className="ready-button secondary"><ReadinessIcon name="download" size={14} />Export</button>
              </div>
              <div className="stripe-dispute-banner"><ReadinessIcon name="warning" size={20} /><div><strong>1 dispute needs a response</strong><span>Submit evidence by July 23 to avoid an automatic loss.</span></div><button>Review now</button></div>
              <div className="stripe-dispute-stats">
                <div><span>Disputed volume</span><strong>{formatReadinessCurrency(disputes.reduce((sum, dispute) => sum + dispute.amount, 0))}</strong><small>Last 12 months</small></div>
                <div><span>Dispute rate</span><strong>{formatReadinessPercent(0.0038, 2)}</strong><small>Below 0.75% monitoring level</small></div>
                <div><span>Win rate</span><strong>68.4%</strong><small><ReadinessIcon name="arrow-up" size={11} />4.2% year over year</small></div>
              </div>
              <section className="stripe-table-card">
                <div className="stripe-table-tabs"><button className="active">All</button><button>Needs response</button><button>Under review</button><button>Closed</button></div>
                <div className="stripe-dispute-table">
                  <div className="stripe-dispute-head"><span>Amount</span><span>Customer</span><span>Reason</span><span>Status</span><span>Evidence</span><span>Deadline</span></div>
                  {disputes.map(dispute => (
                    <button key={dispute.id}>
                      <strong>{formatReadinessCurrency(dispute.amount, { cents: true })} USD</strong>
                      <span>{dispute.customer}</span><span>{dispute.reason}</span>
                      <StripeStatus label={dispute.status} />
                      <span className="stripe-evidence"><i><b style={{ width: `${dispute.evidenceProgress * 100}%` }} /></i>{Math.round(dispute.evidenceProgress * 100)}%</span>
                      <span>{dispute.respondBy}</span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function StripeOverviewMetric({
  label,
  value,
  change,
  values,
  good,
}: {
  label: string
  value: string
  change: string
  values: readonly number[]
  good?: boolean
}) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small className={good ? 'good' : ''}><ReadinessIcon name={good ? 'arrow-down' : 'arrow-up'} size={11} />{change}</small>
      <ReadinessSparkline values={values} color="#6757d5" height={38} />
    </div>
  )
}

function StripeStatus({
  label,
  override,
}: {
  label: StripePaymentStatus | StripeSubscriptionStatus | StripeDisputeStatus
  override?: string
}) {
  return <span className={`stripe-status ${label.toLowerCase().replace(/\s+/g, '-')}`}><i />{override ?? label}</span>
}
