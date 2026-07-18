import { useMemo, useState, type CSSProperties } from 'react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import {
  ReadinessAvatar,
  ReadinessIcon,
} from './ReadinessPrimitives'
import './ReadinessShowcases.css'

export type FoundryShowcaseSection = 'ontology' | 'objects' | 'lineage' | 'actions'
export type FoundryResourceStatus = 'Healthy' | 'Draft' | 'Needs attention'

export interface FoundryPropertyDefinition {
  id: string
  name: string
  type: string
  required?: boolean
  indexed?: boolean
}

export interface FoundryLinkDefinition {
  id: string
  name: string
  targetType: string
  cardinality: 'one' | 'many'
}

export interface FoundryObjectTypeDefinition {
  id: string
  name: string
  pluralName: string
  description: string
  icon: string
  color: string
  backingDataset: string
  status: FoundryResourceStatus
  properties: FoundryPropertyDefinition[]
  links: FoundryLinkDefinition[]
  modifiedAt: string
  objectCount: number
}

export interface FoundryObjectRecord {
  id: string
  typeId: string
  title: string
  subtitle: string
  status: string
  owner: string
  properties: Record<string, string>
  related: { label: string; type: string; count: number }[]
}

export interface FoundryLineageNode {
  id: string
  label: string
  kind: 'Source' | 'Dataset' | 'Transform' | 'Object type' | 'Application'
  status: 'Healthy' | 'Warning' | 'Running'
  detail: string
  x: number
  y: number
}

export interface FoundryLineageEdge {
  from: string
  to: string
}

export interface FoundryActionDefinition {
  id: string
  name: string
  objectType: string
  description: string
  parameters: string[]
  rules: number
  sideEffects: number
  approval: 'None' | 'Manager' | 'Finance'
  lastRun: string
}

export interface FoundryShowcaseProps {
  objectTypes?: readonly FoundryObjectTypeDefinition[]
  objects?: readonly FoundryObjectRecord[]
  lineageNodes?: readonly FoundryLineageNode[]
  lineageEdges?: readonly FoundryLineageEdge[]
  actions?: readonly FoundryActionDefinition[]
  initialSection?: FoundryShowcaseSection
  initialObjectTypeId?: string
  initialObjectId?: string
  workspaceName?: string
  onSelectObjectType?: (objectType: FoundryObjectTypeDefinition) => void
}

export const FOUNDRY_SAMPLE_OBJECT_TYPES: readonly FoundryObjectTypeDefinition[] = [
  {
    id: 'customer',
    name: 'Customer',
    pluralName: 'Customers',
    description: 'A company or individual receiving products and services.',
    icon: 'C',
    color: '#62a6ff',
    backingDataset: 'gold.customer_360',
    status: 'Healthy',
    modifiedAt: '18 min ago',
    objectCount: 12_842,
    properties: [
      { id: 'customer_id', name: 'Customer ID', type: 'string', required: true, indexed: true },
      { id: 'legal_name', name: 'Legal name', type: 'string', required: true, indexed: true },
      { id: 'segment', name: 'Segment', type: 'string', indexed: true },
      { id: 'arr', name: 'Annual recurring revenue', type: 'decimal' },
      { id: 'health', name: 'Health score', type: 'integer', indexed: true },
      { id: 'renewal_at', name: 'Renewal date', type: 'date' },
    ],
    links: [
      { id: 'customer-orders', name: 'Orders', targetType: 'Order', cardinality: 'many' },
      { id: 'customer-contacts', name: 'Contacts', targetType: 'Contact', cardinality: 'many' },
      { id: 'customer-owner', name: 'Account owner', targetType: 'Employee', cardinality: 'one' },
    ],
  },
  {
    id: 'order',
    name: 'Order',
    pluralName: 'Orders',
    description: 'A commercial commitment with fulfillment and payment state.',
    icon: 'O',
    color: '#7bd9a8',
    backingDataset: 'gold.commercial_orders',
    status: 'Healthy',
    modifiedAt: '31 min ago',
    objectCount: 48_105,
    properties: [
      { id: 'order_id', name: 'Order ID', type: 'string', required: true, indexed: true },
      { id: 'status', name: 'Status', type: 'string', indexed: true },
      { id: 'total', name: 'Total', type: 'decimal' },
      { id: 'placed_at', name: 'Placed at', type: 'timestamp', indexed: true },
      { id: 'risk', name: 'Risk score', type: 'decimal' },
    ],
    links: [
      { id: 'order-customer', name: 'Customer', targetType: 'Customer', cardinality: 'one' },
      { id: 'order-products', name: 'Products', targetType: 'Product', cardinality: 'many' },
      { id: 'order-payments', name: 'Payments', targetType: 'Payment', cardinality: 'many' },
    ],
  },
  {
    id: 'shipment',
    name: 'Shipment',
    pluralName: 'Shipments',
    description: 'A physical delivery moving through the fulfillment network.',
    icon: 'S',
    color: '#e3a75f',
    backingDataset: 'silver.shipment_events',
    status: 'Needs attention',
    modifiedAt: '1 hr ago',
    objectCount: 8_294,
    properties: [
      { id: 'shipment_id', name: 'Shipment ID', type: 'string', required: true, indexed: true },
      { id: 'carrier', name: 'Carrier', type: 'string', indexed: true },
      { id: 'eta', name: 'Estimated arrival', type: 'timestamp' },
      { id: 'location', name: 'Last location', type: 'geopoint' },
      { id: 'status', name: 'Status', type: 'string', indexed: true },
    ],
    links: [
      { id: 'shipment-order', name: 'Order', targetType: 'Order', cardinality: 'one' },
      { id: 'shipment-facility', name: 'Current facility', targetType: 'Facility', cardinality: 'one' },
    ],
  },
  {
    id: 'product',
    name: 'Product',
    pluralName: 'Products',
    description: 'A sellable product, service, or subscription plan.',
    icon: 'P',
    color: '#b58cff',
    backingDataset: 'gold.product_catalog',
    status: 'Healthy',
    modifiedAt: 'Yesterday',
    objectCount: 1_486,
    properties: [
      { id: 'sku', name: 'SKU', type: 'string', required: true, indexed: true },
      { id: 'name', name: 'Name', type: 'string', required: true, indexed: true },
      { id: 'price', name: 'Unit price', type: 'decimal' },
      { id: 'inventory', name: 'Available inventory', type: 'integer' },
    ],
    links: [
      { id: 'product-orders', name: 'Orders', targetType: 'Order', cardinality: 'many' },
      { id: 'product-supplier', name: 'Supplier', targetType: 'Supplier', cardinality: 'one' },
    ],
  },
  {
    id: 'support-case',
    name: 'Support case',
    pluralName: 'Support cases',
    description: 'A customer issue with ownership, SLA, and resolution state.',
    icon: 'T',
    color: '#ef7692',
    backingDataset: 'gold.support_cases',
    status: 'Draft',
    modifiedAt: '2 days ago',
    objectCount: 2_039,
    properties: [
      { id: 'case_id', name: 'Case ID', type: 'string', required: true, indexed: true },
      { id: 'priority', name: 'Priority', type: 'string', indexed: true },
      { id: 'state', name: 'State', type: 'string', indexed: true },
      { id: 'sla_due', name: 'SLA due', type: 'timestamp' },
    ],
    links: [
      { id: 'case-customer', name: 'Customer', targetType: 'Customer', cardinality: 'one' },
      { id: 'case-owner', name: 'Owner', targetType: 'Employee', cardinality: 'one' },
    ],
  },
]

export const FOUNDRY_SAMPLE_OBJECTS: readonly FoundryObjectRecord[] = [
  {
    id: 'northwind-health',
    typeId: 'customer',
    title: 'Northwind Health',
    subtitle: 'Enterprise · Healthcare',
    status: 'Expansion',
    owner: 'Amelia Stone',
    properties: {
      'Customer ID': 'CUS-01842',
      'Annual recurring revenue': '$284,000',
      'Health score': '92 / 100',
      'Renewal date': 'October 18, 2026',
      'Primary region': 'North America',
      'Last activity': '18 minutes ago',
    },
    related: [
      { label: 'Open orders', type: 'Order', count: 4 },
      { label: 'Contacts', type: 'Contact', count: 12 },
      { label: 'Support cases', type: 'Support case', count: 2 },
      { label: 'Locations', type: 'Facility', count: 7 },
    ],
  },
  {
    id: 'cascade-retail',
    typeId: 'customer',
    title: 'Cascade Retail',
    subtitle: 'Mid-market · Commerce',
    status: 'Onboarding',
    owner: 'Noah Williams',
    properties: {
      'Customer ID': 'CUS-01849',
      'Annual recurring revenue': '$118,000',
      'Health score': '78 / 100',
      'Renewal date': 'January 12, 2027',
      'Primary region': 'North America',
      'Last activity': 'Yesterday',
    },
    related: [
      { label: 'Open orders', type: 'Order', count: 7 },
      { label: 'Contacts', type: 'Contact', count: 5 },
      { label: 'Support cases', type: 'Support case', count: 1 },
    ],
  },
  {
    id: 'brightpath-energy',
    typeId: 'customer',
    title: 'Brightpath Energy',
    subtitle: 'Enterprise · Energy',
    status: 'Healthy',
    owner: 'Sarah Kim',
    properties: {
      'Customer ID': 'CUS-01796',
      'Annual recurring revenue': '$412,000',
      'Health score': '88 / 100',
      'Renewal date': 'December 02, 2026',
      'Primary region': 'Europe',
      'Last activity': '3 hours ago',
    },
    related: [
      { label: 'Open orders', type: 'Order', count: 3 },
      { label: 'Contacts', type: 'Contact', count: 9 },
      { label: 'Support cases', type: 'Support case', count: 0 },
    ],
  },
]

export const FOUNDRY_SAMPLE_LINEAGE_NODES: readonly FoundryLineageNode[] = [
  { id: 'crm', label: 'CRM connector', kind: 'Source', status: 'Healthy', detail: 'Postgres · live sync', x: 8, y: 18 },
  { id: 'orders', label: 'Commerce API', kind: 'Source', status: 'Healthy', detail: 'Webhook + batch', x: 8, y: 72 },
  { id: 'raw', label: 'raw.customer_events', kind: 'Dataset', status: 'Healthy', detail: '2.8M rows', x: 31, y: 18 },
  { id: 'transform', label: 'customer_360.py', kind: 'Transform', status: 'Running', detail: 'Python transform', x: 52, y: 45 },
  { id: 'gold', label: 'gold.customer_360', kind: 'Dataset', status: 'Warning', detail: 'Freshness +18m', x: 71, y: 45 },
  { id: 'object', label: 'Customer', kind: 'Object type', status: 'Healthy', detail: '12,842 objects', x: 88, y: 25 },
  { id: 'app', label: 'Account cockpit', kind: 'Application', status: 'Healthy', detail: 'Production', x: 88, y: 72 },
]

export const FOUNDRY_SAMPLE_LINEAGE_EDGES: readonly FoundryLineageEdge[] = [
  { from: 'crm', to: 'raw' },
  { from: 'orders', to: 'transform' },
  { from: 'raw', to: 'transform' },
  { from: 'transform', to: 'gold' },
  { from: 'gold', to: 'object' },
  { from: 'gold', to: 'app' },
  { from: 'object', to: 'app' },
]

export const FOUNDRY_SAMPLE_ACTIONS: readonly FoundryActionDefinition[] = [
  {
    id: 'assign-owner',
    name: 'Assign account owner',
    objectType: 'Customer',
    description: 'Reassign ownership and notify the previous and new account teams.',
    parameters: ['Customer', 'New owner', 'Reason'],
    rules: 3,
    sideEffects: 2,
    approval: 'Manager',
    lastRun: '12 min ago',
  },
  {
    id: 'approve-refund',
    name: 'Approve refund',
    objectType: 'Order',
    description: 'Validate policy, create a refund request, and write the decision to the order.',
    parameters: ['Order', 'Amount', 'Reason code'],
    rules: 5,
    sideEffects: 3,
    approval: 'Finance',
    lastRun: '41 min ago',
  },
  {
    id: 'resolve-case',
    name: 'Resolve support case',
    objectType: 'Support case',
    description: 'Resolve a case, capture the outcome, and notify the customer.',
    parameters: ['Case', 'Resolution', 'Customer note'],
    rules: 2,
    sideEffects: 2,
    approval: 'None',
    lastRun: '1 hr ago',
  },
]

export function selectFoundryObjectTypes(
  objectTypes: readonly FoundryObjectTypeDefinition[],
  query: string,
): FoundryObjectTypeDefinition[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return [...objectTypes]
  return objectTypes.filter(objectType =>
    [
      objectType.name,
      objectType.pluralName,
      objectType.description,
      objectType.backingDataset,
      ...objectType.properties.map(property => property.name),
    ].join(' ').toLowerCase().includes(normalized),
  )
}

export function foundryOntologyReadiness(
  objectTypes: readonly FoundryObjectTypeDefinition[],
): { types: number; properties: number; links: number; healthy: number } {
  return {
    types: objectTypes.length,
    properties: objectTypes.reduce((total, objectType) => total + objectType.properties.length, 0),
    links: objectTypes.reduce((total, objectType) => total + objectType.links.length, 0),
    healthy: objectTypes.filter(objectType => objectType.status === 'Healthy').length,
  }
}

const FOUNDRY_NAV: {
  id: FoundryShowcaseSection
  label: string
  icon: 'layers' | 'database' | 'graph' | 'bolt'
}[] = [
  { id: 'ontology', label: 'Ontology Manager', icon: 'layers' },
  { id: 'objects', label: 'Object Explorer', icon: 'database' },
  { id: 'lineage', label: 'Data Lineage', icon: 'graph' },
  { id: 'actions', label: 'Action Types', icon: 'bolt' },
]

export function FoundryShowcase({
  objectTypes = FOUNDRY_SAMPLE_OBJECT_TYPES,
  objects = FOUNDRY_SAMPLE_OBJECTS,
  lineageNodes = FOUNDRY_SAMPLE_LINEAGE_NODES,
  lineageEdges = FOUNDRY_SAMPLE_LINEAGE_EDGES,
  actions = FOUNDRY_SAMPLE_ACTIONS,
  initialSection = 'ontology',
  initialObjectTypeId = 'customer',
  initialObjectId = 'northwind-health',
  workspaceName = CLONE_DEMO_IDENTITY.company,
  onSelectObjectType,
}: FoundryShowcaseProps) {
  const [section, setSection] = useState<FoundryShowcaseSection>(initialSection)
  const [query, setQuery] = useState('')
  const [selectedTypeId, setSelectedTypeId] = useState(initialObjectTypeId)
  const [selectedObjectId, setSelectedObjectId] = useState(initialObjectId)
  const [selectedActionId, setSelectedActionId] = useState(actions[0]?.id ?? '')

  const filteredTypes = useMemo(
    () => selectFoundryObjectTypes(objectTypes, query),
    [objectTypes, query],
  )
  const selectedType = objectTypes.find(objectType => objectType.id === selectedTypeId)
    ?? objectTypes[0]
  const selectedObject = objects.find(object => object.id === selectedObjectId)
    ?? objects[0]
  const selectedAction = actions.find(action => action.id === selectedActionId)
    ?? actions[0]
  const readiness = foundryOntologyReadiness(objectTypes)
  const lineageById = new Map(lineageNodes.map(node => [node.id, node]))

  const chooseType = (objectType: FoundryObjectTypeDefinition) => {
    setSelectedTypeId(objectType.id)
    onSelectObjectType?.(objectType)
  }

  return (
    <div className="ready-showcase foundry-showcase">
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
          <span>Search resources, objects, and applications</span>
          <kbd>⌘ K</kbd>
        </div>
        <div className="ready-top-actions">
          <button aria-label="Help"><ReadinessIcon name="help" /></button>
          <button aria-label="Notifications" className="ready-notification"><ReadinessIcon name="bell" /><i /></button>
          <ReadinessAvatar name={CLONE_DEMO_IDENTITY.user} color="#496f9a" size={27} />
        </div>
      </header>

      <div className="foundry-body">
        <aside className="foundry-sidebar">
          <div className="foundry-space-label">Operations model</div>
          <nav>
            {FOUNDRY_NAV.map(item => (
              <button
                key={item.id}
                className={section === item.id ? 'active' : ''}
                onClick={() => setSection(item.id)}
              >
                <ReadinessIcon name={item.icon} size={16} />
                <span>{item.label}</span>
                {item.id === 'lineage' && <i className="foundry-nav-warning">1</i>}
              </button>
            ))}
          </nav>
          <div className="foundry-sidebar-group">
            <span>Resources</span>
            <button><ReadinessIcon name="database" size={15} />Datasets</button>
            <button><ReadinessIcon name="code" size={15} />Code repositories</button>
            <button><ReadinessIcon name="apps" size={15} />Applications</button>
          </div>
          <div className="foundry-sidebar-footer">
            <ReadinessIcon name="shield" size={15} />
            <div><strong>Governed workspace</strong><span>Policies active</span></div>
          </div>
        </aside>

        <main className="foundry-main">
          {section === 'ontology' && (
            <>
              <div className="ready-page-heading foundry-page-heading">
                <div>
                  <div className="ready-eyebrow">Ontology</div>
                  <h1>Ontology Manager</h1>
                  <p>Model the objects, relationships, and actions that power operational applications.</p>
                </div>
                <div className="ready-heading-actions">
                  <button className="ready-button secondary"><ReadinessIcon name="download" size={15} />Export</button>
                  <button className="ready-button primary"><ReadinessIcon name="plus" size={15} />New object type</button>
                </div>
              </div>

              <div className="foundry-stat-row">
                <FoundryStat label="Object types" value={String(readiness.types)} detail="Across 4 domains" />
                <FoundryStat label="Properties" value={String(readiness.properties)} detail="12 indexed" />
                <FoundryStat label="Link types" value={String(readiness.links)} detail="All validated" />
                <FoundryStat label="Healthy" value={`${readiness.healthy}/${readiness.types}`} detail="1 issue to review" tone="good" />
              </div>

              <div className="foundry-ontology-layout">
                <section className="foundry-type-browser">
                  <div className="ready-panel-toolbar">
                    <label className="ready-search-field">
                      <ReadinessIcon name="search" size={15} />
                      <input
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                        placeholder="Search object types"
                      />
                    </label>
                    <button className="ready-icon-button"><ReadinessIcon name="filter" size={15} /></button>
                  </div>
                  <div className="foundry-type-header">
                    <span>Object type</span><span>Backing dataset</span><span>Objects</span><span>Status</span>
                  </div>
                  <div className="foundry-type-list">
                    {filteredTypes.map(objectType => (
                      <button
                        key={objectType.id}
                        className={selectedType?.id === objectType.id ? 'selected' : ''}
                        onClick={() => chooseType(objectType)}
                      >
                        <span className="foundry-type-name">
                          <i style={{ '--foundry-type-color': objectType.color } as CSSProperties}>{objectType.icon}</i>
                          <span><strong>{objectType.name}</strong><small>{objectType.properties.length} properties · {objectType.links.length} links</small></span>
                        </span>
                        <code>{objectType.backingDataset}</code>
                        <span>{objectType.objectCount.toLocaleString()}</span>
                        <FoundryStatus status={objectType.status} />
                      </button>
                    ))}
                  </div>
                </section>

                {selectedType && (
                  <aside className="foundry-inspector">
                    <div className="foundry-inspector-heading">
                      <i style={{ '--foundry-type-color': selectedType.color } as CSSProperties}>{selectedType.icon}</i>
                      <div><h2>{selectedType.name}</h2><span>Object type · {selectedType.modifiedAt}</span></div>
                      <button><ReadinessIcon name="more" /></button>
                    </div>
                    <p>{selectedType.description}</p>
                    <div className="foundry-inspector-tabs"><button className="active">Schema</button><button>Datasets</button><button>Usage</button></div>
                    <div className="foundry-inspector-section">
                      <div className="foundry-inspector-title"><span>Properties</span><button><ReadinessIcon name="plus" size={13} />Add</button></div>
                      {selectedType.properties.map(property => (
                        <div className="foundry-property" key={property.id}>
                          <ReadinessIcon name="tag" size={14} />
                          <span><strong>{property.name}</strong><small>{property.type}</small></span>
                          {property.required && <em>Required</em>}
                          {property.indexed && <em>Indexed</em>}
                        </div>
                      ))}
                    </div>
                    <div className="foundry-inspector-section">
                      <div className="foundry-inspector-title"><span>Link types</span><button><ReadinessIcon name="plus" size={13} />Add</button></div>
                      {selectedType.links.map(link => (
                        <div className="foundry-link-row" key={link.id}>
                          <ReadinessIcon name="link" size={14} />
                          <span><strong>{link.name}</strong><small>{link.cardinality} · {link.targetType}</small></span>
                          <ReadinessIcon name="chevron-right" size={13} />
                        </div>
                      ))}
                    </div>
                  </aside>
                )}
              </div>
            </>
          )}

          {section === 'objects' && selectedObject && (
            <>
              <div className="ready-page-heading foundry-page-heading">
                <div>
                  <div className="ready-eyebrow">Ontology / Customer</div>
                  <h1>Object Explorer</h1>
                  <p>Inspect trusted object data and navigate relationships without joining tables.</p>
                </div>
                <button className="ready-button primary"><ReadinessIcon name="bolt" size={15} />Take action</button>
              </div>
              <div className="foundry-object-layout">
                <section className="foundry-object-results">
                  <div className="ready-panel-toolbar">
                    <label className="ready-search-field"><ReadinessIcon name="search" size={15} /><input placeholder="Search Customers" /></label>
                    <button className="ready-icon-button"><ReadinessIcon name="filter" size={15} /></button>
                  </div>
                  <div className="foundry-object-count">12,842 Customer objects</div>
                  {objects.map(object => (
                    <button
                      key={object.id}
                      className={object.id === selectedObject.id ? 'selected' : ''}
                      onClick={() => setSelectedObjectId(object.id)}
                    >
                      <span className="foundry-object-monogram">{object.title.charAt(0)}</span>
                      <span><strong>{object.title}</strong><small>{object.subtitle}</small></span>
                      <FoundryObjectTone label={object.status} />
                    </button>
                  ))}
                </section>
                <section className="foundry-object-detail">
                  <div className="foundry-object-hero">
                    <span className="foundry-object-monogram large">{selectedObject.title.charAt(0)}</span>
                    <div><span className="ready-eyebrow">Customer</span><h2>{selectedObject.title}</h2><p>{selectedObject.subtitle}</p></div>
                    <FoundryObjectTone label={selectedObject.status} />
                  </div>
                  <div className="foundry-object-tabs"><button className="active">Overview</button><button>Activity</button><button>History</button></div>
                  <div className="foundry-object-content">
                    <div>
                      <h3>Properties</h3>
                      <dl>
                        {Object.entries(selectedObject.properties).map(([label, value]) => (
                          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                        ))}
                      </dl>
                    </div>
                    <div>
                      <h3>Relationships</h3>
                      <div className="foundry-related-grid">
                        {selectedObject.related.map(related => (
                          <button key={related.label}>
                            <span><ReadinessIcon name="link" size={14} />{related.type}</span>
                            <strong>{related.count}</strong>
                            <small>{related.label}</small>
                          </button>
                        ))}
                      </div>
                      <h3>Account owner</h3>
                      <div className="foundry-owner-card">
                        <ReadinessAvatar name={selectedObject.owner} color="#4f7fb5" size={34} />
                        <span className="foundry-owner-copy"><strong>{selectedObject.owner}</strong><small>Strategic accounts</small></span>
                        <button><ReadinessIcon name="mail" size={15} /></button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {section === 'lineage' && (
            <>
              <div className="ready-page-heading foundry-page-heading">
                <div>
                  <div className="ready-eyebrow">Data foundation</div>
                  <h1>Data Lineage</h1>
                  <p>Trace sources, datasets, transforms, ontology resources, and applications.</p>
                </div>
                <div className="ready-heading-actions">
                  <button className="ready-button secondary"><ReadinessIcon name="refresh" size={15} />Refresh</button>
                  <button className="ready-button primary"><ReadinessIcon name="plus" size={15} />Add resource</button>
                </div>
              </div>
              <div className="foundry-lineage-toolbar">
                <label className="ready-search-field"><ReadinessIcon name="search" size={15} /><input placeholder="Find resource in graph" /></label>
                <button><ReadinessIcon name="filter" size={15} />Resource type</button>
                <button><ReadinessIcon name="activity" size={15} />Health</button>
                <span>7 resources · 7 links</span>
              </div>
              <section className="foundry-lineage-canvas">
                <svg className="foundry-lineage-edges" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  {lineageEdges.map(edge => {
                    const from = lineageById.get(edge.from)
                    const to = lineageById.get(edge.to)
                    if (!from || !to) return null
                    return <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
                  })}
                </svg>
                {lineageNodes.map(node => (
                  <button
                    key={node.id}
                    className={`foundry-lineage-node ${node.status.toLowerCase()}`}
                    style={{ '--foundry-node-x': `${node.x}%`, '--foundry-node-y': `${node.y}%` } as CSSProperties}
                  >
                    <i><ReadinessIcon name={foundryNodeIcon(node.kind)} size={15} /></i>
                    <span><small>{node.kind}</small><strong>{node.label}</strong><em>{node.detail}</em></span>
                    <b title={node.status} />
                  </button>
                ))}
                <div className="foundry-canvas-controls"><button>+</button><button>−</button><button><ReadinessIcon name="home" size={14} /></button></div>
                <div className="foundry-lineage-alert"><ReadinessIcon name="warning" size={16} /><span><strong>Freshness policy breached</strong><small>gold.customer_360 · expected within 10 minutes</small></span><button>Review issue</button></div>
              </section>
            </>
          )}

          {section === 'actions' && selectedAction && (
            <>
              <div className="ready-page-heading foundry-page-heading">
                <div>
                  <div className="ready-eyebrow">Ontology</div>
                  <h1>Action Types</h1>
                  <p>Define governed operations that safely change objects and trigger side effects.</p>
                </div>
                <button className="ready-button primary"><ReadinessIcon name="plus" size={15} />New action type</button>
              </div>
              <div className="foundry-actions-layout">
                <section className="foundry-action-list">
                  <div className="ready-panel-toolbar"><label className="ready-search-field"><ReadinessIcon name="search" size={15} /><input placeholder="Search action types" /></label></div>
                  {actions.map(action => (
                    <button
                      key={action.id}
                      className={action.id === selectedAction.id ? 'selected' : ''}
                      onClick={() => setSelectedActionId(action.id)}
                    >
                      <i><ReadinessIcon name="bolt" size={16} /></i>
                      <span><strong>{action.name}</strong><small>{action.objectType} · {action.lastRun}</small></span>
                      <ReadinessIcon name="chevron-right" size={14} />
                    </button>
                  ))}
                </section>
                <section className="foundry-action-detail">
                  <div className="foundry-action-heading">
                    <i><ReadinessIcon name="bolt" size={20} /></i>
                    <div><span className="ready-eyebrow">{selectedAction.objectType} action</span><h2>{selectedAction.name}</h2><p>{selectedAction.description}</p></div>
                    <button className="ready-button secondary">Edit</button>
                  </div>
                  <div className="foundry-action-flow">
                    <div><span>1</span><strong>Parameters</strong><small>{selectedAction.parameters.length} inputs</small></div>
                    <i />
                    <div><span>2</span><strong>Rules</strong><small>{selectedAction.rules} object edits</small></div>
                    <i />
                    <div><span>3</span><strong>Side effects</strong><small>{selectedAction.sideEffects} configured</small></div>
                  </div>
                  <div className="foundry-action-columns">
                    <div>
                      <h3>Parameters</h3>
                      {selectedAction.parameters.map((parameter, index) => (
                        <div className="foundry-parameter" key={parameter}>
                          <span>{index + 1}</span><div><strong>{parameter}</strong><small>{index === 0 ? 'Object reference' : 'Required input'}</small></div><ReadinessIcon name="more" size={14} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3>Submission controls</h3>
                      <div className="foundry-control-card"><ReadinessIcon name="shield" size={18} /><span><strong>{selectedAction.approval} approval</strong><small>Checked before the action is committed</small></span></div>
                      <div className="foundry-control-card"><ReadinessIcon name="check" size={18} /><span><strong>Validation enabled</strong><small>All parameter and object rules must pass</small></span></div>
                      <div className="foundry-control-card"><ReadinessIcon name="activity" size={18} /><span><strong>Audit every run</strong><small>Actor, inputs, result, and side effects retained</small></span></div>
                    </div>
                  </div>
                  <div className="foundry-action-footer"><span><i />Published · version 12</span><button className="ready-button secondary">View run history</button><button className="ready-button primary"><ReadinessIcon name="bolt" size={14} />Run action</button></div>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function FoundryStat({
  label,
  value,
  detail,
  tone,
}: {
  label: string
  value: string
  detail: string
  tone?: 'good'
}) {
  return <div className={`foundry-stat ${tone ?? ''}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
}

function FoundryStatus({ status }: { status: FoundryResourceStatus }) {
  return <span className={`foundry-status ${status.toLowerCase().replace(/\s+/g, '-')}`}><i />{status}</span>
}

function FoundryObjectTone({ label }: { label: string }) {
  return <span className={`foundry-object-tone ${label.toLowerCase().replace(/\s+/g, '-')}`}>{label}</span>
}

function foundryNodeIcon(kind: FoundryLineageNode['kind']): 'database' | 'code' | 'layers' | 'apps' {
  if (kind === 'Transform') return 'code'
  if (kind === 'Object type') return 'layers'
  if (kind === 'Application') return 'apps'
  return 'database'
}
