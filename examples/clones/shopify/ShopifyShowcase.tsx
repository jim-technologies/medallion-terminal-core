import { useMemo, useState } from 'react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import {
  OperationalShowcaseAvatar,
  OperationalShowcaseIcon,
  OperationalShowcaseSparkline,
  formatOperationalCurrency,
  formatOperationalPercent,
  operationalShowcaseInitials,
} from '../shared/OperationalShowcasePrimitives'
import '../shared/OperationalShowcases.css'

export type ShopifyShowcaseSection = 'home' | 'orders' | 'inventory'
export type ShopifyPaymentStatus = 'Paid' | 'Pending' | 'Refunded' | 'Partially refunded'
export type ShopifyFulfillmentStatus = 'Unfulfilled' | 'In progress' | 'Fulfilled' | 'Returned'

export interface ShopifyOrder {
  id: string
  number: string
  placedAt: string
  customer: string
  email: string
  total: number
  paymentStatus: ShopifyPaymentStatus
  fulfillmentStatus: ShopifyFulfillmentStatus
  channel: string
  destination: string
  items: {
    id: string
    name: string
    variant: string
    sku: string
    quantity: number
    price: number
    color: string
  }[]
}

export interface ShopifyInventoryItem {
  id: string
  product: string
  variant: string
  sku: string
  location: string
  available: number
  committed: number
  incoming: number
  reorderAt: number
  price: number
  color: string
}

export interface ShopifyShowcaseProps {
  orders?: readonly ShopifyOrder[]
  inventory?: readonly ShopifyInventoryItem[]
  initialSection?: ShopifyShowcaseSection
  initialSelectedOrderId?: string
  storeName?: string
  onSelectOrder?: (order: ShopifyOrder) => void
}

export const SHOPIFY_SAMPLE_ORDERS: readonly ShopifyOrder[] = [
  {
    id: 'order-1057',
    number: '#1057',
    placedAt: 'Today at 10:42 am',
    customer: 'Maya Chen',
    email: 'maya@example.test',
    total: 428,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'Unfulfilled',
    channel: 'Online Store',
    destination: 'San Francisco, CA',
    items: [
      { id: 'trail-pack', name: 'Trail Pack', variant: 'Juniper / 24L', sku: 'TP-JUN-24', quantity: 1, price: 248, color: '#577664' },
      { id: 'field-bottle', name: 'Field Bottle', variant: 'Graphite', sku: 'FB-GRA-01', quantity: 2, price: 90, color: '#6d7479' },
    ],
  },
  {
    id: 'order-1056',
    number: '#1056',
    placedAt: 'Today at 9:18 am',
    customer: 'Noah Williams',
    email: 'noah@example.test',
    total: 186,
    paymentStatus: 'Paid',
    fulfillmentStatus: 'In progress',
    channel: 'Shop',
    destination: 'Portland, OR',
    items: [
      { id: 'commuter-tote', name: 'Commuter Tote', variant: 'Sand', sku: 'CT-SND-18', quantity: 1, price: 186, color: '#b59d7b' },
    ],
  },
  {
    id: 'order-1055',
    number: '#1055',
    placedAt: 'Yesterday at 6:31 pm',
    customer: 'Sarah Kim',
    email: 'sarah@example.test',
    total: 612,
    paymentStatus: 'Pending',
    fulfillmentStatus: 'Unfulfilled',
    channel: 'Online Store',
    destination: 'Austin, TX',
    items: [
      { id: 'weekender', name: 'Weekender', variant: 'Navy', sku: 'WK-NVY-42', quantity: 2, price: 306, color: '#354b69' },
    ],
  },
  {
    id: 'order-1054',
    number: '#1054',
    placedAt: 'Yesterday at 2:09 pm',
    customer: 'Theo Martin',
    email: 'theo@example.test',
    total: 248,
    paymentStatus: 'Partially refunded',
    fulfillmentStatus: 'Returned',
    channel: 'Online Store',
    destination: 'Brooklyn, NY',
    items: [
      { id: 'trail-pack-2', name: 'Trail Pack', variant: 'Canyon / 24L', sku: 'TP-CAN-24', quantity: 1, price: 248, color: '#a96743' },
    ],
  },
  {
    id: 'order-1053',
    number: '#1053',
    placedAt: 'Jul 17 at 11:14 am',
    customer: 'Nina Patel',
    email: 'nina@example.test',
    total: 96,
    paymentStatus: 'Refunded',
    fulfillmentStatus: 'Returned',
    channel: 'Point of Sale',
    destination: 'Los Angeles, CA',
    items: [
      { id: 'utility-pouch', name: 'Utility Pouch', variant: 'Black', sku: 'UP-BLK-01', quantity: 2, price: 48, color: '#313437' },
    ],
  },
]

export const SHOPIFY_SAMPLE_INVENTORY: readonly ShopifyInventoryItem[] = [
  { id: 'inv-1', product: 'Trail Pack', variant: 'Juniper / 24L', sku: 'TP-JUN-24', location: 'West warehouse', available: 42, committed: 8, incoming: 60, reorderAt: 20, price: 248, color: '#577664' },
  { id: 'inv-2', product: 'Trail Pack', variant: 'Canyon / 24L', sku: 'TP-CAN-24', location: 'West warehouse', available: 12, committed: 9, incoming: 40, reorderAt: 18, price: 248, color: '#a96743' },
  { id: 'inv-3', product: 'Weekender', variant: 'Navy', sku: 'WK-NVY-42', location: 'East warehouse', available: 7, committed: 6, incoming: 0, reorderAt: 16, price: 306, color: '#354b69' },
  { id: 'inv-4', product: 'Commuter Tote', variant: 'Sand', sku: 'CT-SND-18', location: 'West warehouse', available: 28, committed: 4, incoming: 25, reorderAt: 14, price: 186, color: '#b59d7b' },
  { id: 'inv-5', product: 'Field Bottle', variant: 'Graphite', sku: 'FB-GRA-01', location: 'East warehouse', available: 0, committed: 14, incoming: 120, reorderAt: 40, price: 90, color: '#6d7479' },
  { id: 'inv-6', product: 'Utility Pouch', variant: 'Black', sku: 'UP-BLK-01', location: 'West warehouse', available: 84, committed: 12, incoming: 0, reorderAt: 30, price: 48, color: '#313437' },
]

export function selectShopifyOrders(
  orders: readonly ShopifyOrder[],
  query = '',
  fulfillment?: ShopifyFulfillmentStatus,
): ShopifyOrder[] {
  const normalized = query.trim().toLowerCase()
  return orders.filter(order => {
    if (fulfillment && order.fulfillmentStatus !== fulfillment) return false
    if (!normalized) return true
    return [
      order.number,
      order.customer,
      order.email,
      order.channel,
      order.destination,
      ...order.items.map(item => `${item.name} ${item.sku}`),
    ].join(' ').toLowerCase().includes(normalized)
  })
}

export function shopifyInventoryRisk(
  inventory: readonly ShopifyInventoryItem[],
): ShopifyInventoryItem[] {
  return inventory.filter(item => item.available <= item.reorderAt)
}

const SHOPIFY_NAV: { id: ShopifyShowcaseSection; label: string; icon: 'home' | 'package' | 'inventory' }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'orders', label: 'Orders', icon: 'package' },
  { id: 'inventory', label: 'Products', icon: 'inventory' },
]

export function ShopifyShowcase({
  orders = SHOPIFY_SAMPLE_ORDERS,
  inventory = SHOPIFY_SAMPLE_INVENTORY,
  initialSection = 'home',
  initialSelectedOrderId = 'order-1057',
  storeName = CLONE_DEMO_IDENTITY.company,
  onSelectOrder,
}: ShopifyShowcaseProps) {
  const [section, setSection] = useState<ShopifyShowcaseSection>(initialSection)
  const [selectedOrderId, setSelectedOrderId] = useState(initialSelectedOrderId)
  const [query, setQuery] = useState('')
  const [fulfillment, setFulfillment] = useState<ShopifyFulfillmentStatus | undefined>()
  const [showOrder, setShowOrder] = useState(initialSection === 'orders' && Boolean(initialSelectedOrderId))

  const filteredOrders = useMemo(
    () => selectShopifyOrders(orders, query, fulfillment),
    [orders, query, fulfillment],
  )
  const selectedOrder = orders.find(order => order.id === selectedOrderId) ?? orders[0]
  const riskInventory = shopifyInventoryRisk(inventory)
  const grossSales = orders.reduce((sum, order) => sum + order.total, 0)

  const chooseOrder = (order: ShopifyOrder) => {
    setSelectedOrderId(order.id)
    setShowOrder(true)
    onSelectOrder?.(order)
  }

  return (
    <div className="ready-showcase shopify-showcase">
      <header className="shopify-topbar">
        <button className="shopify-mobile-menu" aria-label="Menu"><OperationalShowcaseIcon name="menu" /></button>
        <div className="shopify-logo"><span>S</span><strong>shopify</strong></div>
        <label className="shopify-global-search"><OperationalShowcaseIcon name="search" size={16} /><input placeholder="Search" /><kbd>⌘ K</kbd></label>
        <div className="ready-top-actions">
          <button aria-label="Assistant"><OperationalShowcaseIcon name="sparkles" /></button>
          <button aria-label="Notifications" className="ready-notification"><OperationalShowcaseIcon name="bell" /><i /></button>
          <button className="shopify-store-chip"><span>{operationalShowcaseInitials(storeName)}</span><strong>{storeName}</strong><OperationalShowcaseIcon name="chevron-down" size={13} /></button>
        </div>
      </header>

      <div className="shopify-body">
        <aside className="shopify-sidebar">
          <nav>
            {SHOPIFY_NAV.map(item => (
              <button
                key={item.id}
                className={section === item.id ? 'active' : ''}
                onClick={() => { setSection(item.id); setShowOrder(false) }}
              >
                <OperationalShowcaseIcon name={item.icon} size={16} /><span>{item.label}</span>
                {item.id === 'orders' && <em>5</em>}
              </button>
            ))}
            <button><OperationalShowcaseIcon name="people" size={16} /><span>Customers</span></button>
            <button><OperationalShowcaseIcon name="chart" size={16} /><span>Analytics</span></button>
            <button><OperationalShowcaseIcon name="tag" size={16} /><span>Discounts</span></button>
          </nav>
          <div className="shopify-nav-heading"><span>Sales channels</span><button><OperationalShowcaseIcon name="plus" size={14} /></button></div>
          <nav>
            <button><OperationalShowcaseIcon name="cart" size={16} /><span>Online Store</span></button>
            <button><OperationalShowcaseIcon name="apps" size={16} /><span>Shop</span></button>
          </nav>
          <div className="shopify-nav-heading"><span>Apps</span><button><OperationalShowcaseIcon name="plus" size={14} /></button></div>
          <nav><button><OperationalShowcaseIcon name="bolt" size={16} /><span>Flow</span></button></nav>
          <div className="shopify-sidebar-footer"><button><OperationalShowcaseIcon name="settings" size={16} />Settings</button></div>
        </aside>

        <main className="shopify-main">
          {section === 'home' && (
            <div className="shopify-content-narrow">
              <div className="ready-page-heading shopify-page-heading">
                <div><h1>Good morning, {CLONE_DEMO_IDENTITY.user}</h1><p>Here’s what’s happening with {storeName}.</p></div>
              </div>
              <div className="shopify-alert-card">
                <span className="shopify-alert-icon"><OperationalShowcaseIcon name="package" size={19} /></span>
                <div><strong>3 orders are ready to fulfill</strong><span>Ship today to maintain your 1.4 day average fulfillment time.</span></div>
                <button onClick={() => setSection('orders')}>View orders</button>
                <button className="ready-icon-button" aria-label="Dismiss"><OperationalShowcaseIcon name="close" size={15} /></button>
              </div>
              <section className="shopify-home-card">
                <div className="shopify-card-heading">
                  <div><h2>Store performance</h2><span>Today, Jul 18</span></div>
                  <button>Today <OperationalShowcaseIcon name="chevron-down" size={13} /></button>
                </div>
                <div className="shopify-metrics">
                  <ShopifyMetric label="Gross sales" value={formatOperationalCurrency(grossSales)} change="+18%" />
                  <ShopifyMetric label="Returning customer rate" value="31.2%" change="+4.1%" />
                  <ShopifyMetric label="Orders fulfilled" value="18" change="+12%" />
                  <ShopifyMetric label="Conversion rate" value="3.42%" change="+0.3%" />
                </div>
                <div className="shopify-sales-chart">
                  <div className="shopify-chart-axis"><span>$1.5K</span><span>$1.0K</span><span>$500</span><span>$0</span></div>
                  <div className="shopify-chart-plot">
                    <div className="shopify-chart-grid"><i /><i /><i /><i /></div>
                    <OperationalShowcaseSparkline values={[120, 180, 160, 310, 280, 540, 410, 720, 680, 970, 1140, 1290]} color="#16845b" height={160} />
                    <div className="shopify-chart-labels"><span>12am</span><span>6am</span><span>12pm</span><span>Now</span></div>
                  </div>
                </div>
              </section>
              <div className="shopify-home-grid">
                <section className="shopify-home-card">
                  <div className="shopify-card-heading"><div><h2>Orders</h2><span>Today</span></div><button onClick={() => setSection('orders')}>View all</button></div>
                  <div className="shopify-order-summary">
                    <div><span className="shopify-summary-ring">5</span><span><strong>5 orders</strong><small>{formatOperationalCurrency(grossSales)} total</small></span></div>
                    <ul><li><i className="paid" />Paid <strong>3</strong></li><li><i className="pending" />Payment pending <strong>1</strong></li><li><i className="refunded" />Refunded <strong>1</strong></li></ul>
                  </div>
                </section>
                <section className="shopify-home-card">
                  <div className="shopify-card-heading"><div><h2>Inventory</h2><span>Across 2 locations</span></div><button onClick={() => setSection('inventory')}>View products</button></div>
                  <div className="shopify-inventory-alerts">
                    {riskInventory.slice(0, 3).map(item => (
                      <div key={item.id}><span style={{ background: item.color }} /><p><strong>{item.product}</strong><small>{item.variant} · {item.sku}</small></p><em>{item.available === 0 ? 'Out of stock' : `${item.available} left`}</em></div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          )}

          {section === 'orders' && !showOrder && (
            <div className="shopify-content-wide">
              <div className="ready-page-heading shopify-page-heading">
                <div><h1>Orders</h1><p>Manage purchases, fulfillment, returns, and payment state.</p></div>
                <div className="ready-heading-actions"><button className="ready-button secondary">Export</button><button className="ready-button primary">Create order</button></div>
              </div>
              <section className="shopify-table-card">
                <div className="shopify-order-tabs"><button className="active">All</button><button>Unfulfilled</button><button>Unpaid</button><button>Open</button><button>Archived</button><button><OperationalShowcaseIcon name="plus" size={13} /></button></div>
                <div className="ready-panel-toolbar shopify-table-toolbar">
                  <label className="ready-search-field"><OperationalShowcaseIcon name="search" size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search orders" /></label>
                  <button className={fulfillment ? 'active' : ''} onClick={() => setFulfillment(fulfillment ? undefined : 'Unfulfilled')}><OperationalShowcaseIcon name="filter" size={14} />Filter</button>
                  <button><OperationalShowcaseIcon name="more" size={15} /></button>
                </div>
                <div className="shopify-order-table">
                  <div className="shopify-order-table-head"><span><input type="checkbox" aria-label="Select all orders" /></span><span>Order</span><span>Date</span><span>Customer</span><span>Total</span><span>Payment</span><span>Fulfillment</span><span>Items</span><span>Delivery</span></div>
                  {filteredOrders.map(order => (
                    <button key={order.id} onClick={() => chooseOrder(order)}>
                      <span className="shopify-order-check" aria-hidden="true" />
                      <strong>{order.number}</strong>
                      <span>{order.placedAt.split(' at ')[0]}</span>
                      <span>{order.customer}</span>
                      <span>{formatOperationalCurrency(order.total, { cents: true })}</span>
                      <ShopifyStatus label={order.paymentStatus} />
                      <ShopifyStatus label={order.fulfillmentStatus} />
                      <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                      <span>{order.destination}</span>
                    </button>
                  ))}
                </div>
                <div className="shopify-table-footer"><span>Showing {filteredOrders.length} of {orders.length} orders</span><div><button disabled><OperationalShowcaseIcon name="chevron-left" size={14} /></button><button><OperationalShowcaseIcon name="chevron-right" size={14} /></button></div></div>
              </section>
            </div>
          )}

          {section === 'orders' && showOrder && selectedOrder && (
            <div className="shopify-content-wide">
              <div className="shopify-order-detail-heading">
                <button className="ready-icon-button" onClick={() => setShowOrder(false)}><OperationalShowcaseIcon name="chevron-left" size={18} /></button>
                <div><h1>{selectedOrder.number}</h1><span>{selectedOrder.placedAt} from {selectedOrder.channel}</span></div>
                <ShopifyStatus label={selectedOrder.paymentStatus} />
                <ShopifyStatus label={selectedOrder.fulfillmentStatus} />
                <div className="ready-heading-actions"><button className="ready-button secondary">More actions</button><button className="ready-button primary">Fulfill items</button></div>
              </div>
              <div className="shopify-order-detail-grid">
                <div>
                  <section className="shopify-detail-card">
                    <div className="shopify-detail-card-heading"><div><OperationalShowcaseIcon name="package" size={17} /><h2>Unfulfilled</h2><span>West warehouse</span></div><button>•••</button></div>
                    <div className="shopify-line-items">
                      {selectedOrder.items.map(item => (
                        <div key={item.id}>
                          <i style={{ background: item.color }}><OperationalShowcaseIcon name="box" size={24} /></i>
                          <span><strong>{item.name}</strong><small>{item.variant}</small><code>{item.sku}</code></span>
                          <em>{formatOperationalCurrency(item.price, { cents: true })} × {item.quantity}</em>
                          <strong>{formatOperationalCurrency(item.price * item.quantity, { cents: true })}</strong>
                        </div>
                      ))}
                    </div>
                    <div className="shopify-detail-actions"><button className="ready-button secondary">Create shipping label</button><button className="ready-button primary">Fulfill item</button></div>
                  </section>
                  <section className="shopify-detail-card">
                    <div className="shopify-detail-card-heading"><div><OperationalShowcaseIcon name="money" size={17} /><h2>{selectedOrder.paymentStatus}</h2></div></div>
                    <dl className="shopify-money-summary">
                      <div><dt>Subtotal</dt><dd>{formatOperationalCurrency(selectedOrder.total - 28, { cents: true })}</dd></div>
                      <div><dt>Shipping</dt><dd>$18.00</dd></div>
                      <div><dt>Tax</dt><dd>$10.00</dd></div>
                      <div className="total"><dt>Total</dt><dd>{formatOperationalCurrency(selectedOrder.total, { cents: true })}</dd></div>
                      <div><dt>Paid by customer</dt><dd>{formatOperationalCurrency(selectedOrder.paymentStatus === 'Pending' ? 0 : selectedOrder.total, { cents: true })}</dd></div>
                    </dl>
                  </section>
                  <section className="shopify-detail-card">
                    <div className="shopify-detail-card-heading"><div><OperationalShowcaseIcon name="timeline" size={17} /><h2>Timeline</h2></div></div>
                    <label className="shopify-note-input"><OperationalShowcaseAvatar name={CLONE_DEMO_IDENTITY.user} size={28} /><input placeholder="Leave a comment…" /><button><OperationalShowcaseIcon name="send" size={15} /></button></label>
                    <div className="shopify-timeline-row"><i /><span><strong>Order confirmation sent to {selectedOrder.email}</strong><small>Today at 10:43 am</small></span></div>
                    <div className="shopify-timeline-row"><i /><span><strong>{formatOperationalCurrency(selectedOrder.total, { cents: true })} was authorized</strong><small>Today at 10:42 am</small></span></div>
                  </section>
                </div>
                <aside>
                  <section className="shopify-detail-card">
                    <div className="shopify-detail-card-heading"><div><h2>Notes</h2></div><button>Edit</button></div>
                    <p className="shopify-empty-note">No notes from customer</p>
                  </section>
                  <section className="shopify-detail-card">
                    <div className="shopify-detail-card-heading"><div><h2>Customer</h2></div><button>Edit</button></div>
                    <a>{selectedOrder.customer}</a><span>3 orders</span>
                    <hr />
                    <h3>Contact information</h3><a>{selectedOrder.email}</a><span>No phone number</span>
                    <hr />
                    <h3>Shipping address</h3><p>{selectedOrder.customer}<br />420 Market Street<br />{selectedOrder.destination}<br />United States</p>
                  </section>
                  <section className="shopify-detail-card">
                    <div className="shopify-detail-card-heading"><div><h2>Fraud analysis</h2></div></div>
                    <div className="shopify-risk"><i /><span><strong>Low risk</strong><small>Characteristics of this order are similar to legitimate orders.</small></span></div>
                  </section>
                </aside>
              </div>
            </div>
          )}

          {section === 'inventory' && (
            <div className="shopify-content-wide">
              <div className="ready-page-heading shopify-page-heading">
                <div><h1>Inventory</h1><p>Track stock, commitments, incoming transfers, and reorder risk.</p></div>
                <div className="ready-heading-actions"><button className="ready-button secondary">Export</button><button className="ready-button primary">Add product</button></div>
              </div>
              <div className="shopify-inventory-stats">
                <div><span>Inventory value</span><strong>{formatOperationalCurrency(inventory.reduce((sum, item) => sum + item.available * item.price, 0))}</strong><small>Across 2 locations</small></div>
                <div><span>Low stock</span><strong>{riskInventory.filter(item => item.available > 0).length}</strong><small>At or below reorder point</small></div>
                <div><span>Out of stock</span><strong>{riskInventory.filter(item => item.available === 0).length}</strong><small>Requires attention</small></div>
                <div><span>Sell-through</span><strong>{formatOperationalPercent(0.684)}</strong><small>Last 30 days</small></div>
              </div>
              <section className="shopify-table-card">
                <div className="ready-panel-toolbar shopify-table-toolbar"><label className="ready-search-field"><OperationalShowcaseIcon name="search" size={15} /><input placeholder="Search products and SKUs" /></label><button><OperationalShowcaseIcon name="filter" size={14} />All locations</button><button><OperationalShowcaseIcon name="more" size={15} /></button></div>
                <div className="shopify-inventory-table">
                  <div className="shopify-inventory-head"><span><input type="checkbox" aria-label="Select all inventory" /></span><span>Product</span><span>SKU</span><span>Location</span><span>Unavailable</span><span>Committed</span><span>Available</span><span>On hand</span><span>Incoming</span></div>
                  {inventory.map(item => (
                    <div key={item.id}>
                      <span><input type="checkbox" aria-label={`Select ${item.product}`} /></span>
                      <span className="shopify-inventory-product"><i style={{ background: item.color }}><OperationalShowcaseIcon name="box" size={18} /></i><span><strong>{item.product}</strong><small>{item.variant}</small></span></span>
                      <code>{item.sku}</code>
                      <span>{item.location}</span>
                      <span>0</span><span>{item.committed}</span>
                      <strong className={item.available <= item.reorderAt ? 'risk' : ''}>{item.available}</strong>
                      <span>{item.available + item.committed}</span><span>{item.incoming}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function ShopifyMetric({
  label,
  value,
  change,
}: {
  label: string
  value: string
  change: string
}) {
  return <div><span>{label}</span><strong>{value}</strong><small><OperationalShowcaseIcon name="arrow-up" size={11} />{change}</small></div>
}

function ShopifyStatus({ label }: { label: ShopifyPaymentStatus | ShopifyFulfillmentStatus }) {
  const tone = label.toLowerCase().replace(/\s+/g, '-')
  return <span className={`shopify-status ${tone}`}><i />{label}</span>
}
