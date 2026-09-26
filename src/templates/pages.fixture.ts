/**
 * Data for the page templates: one invented workspace with customers,
 * people, orders, files, services, buckets and connectors. Nothing refers
 * to a real organisation. Types only come from the toolkit entry.
 */
import type {
  ActivityItem,
  CommandGroup,
  FacetGroup,
  LinkGroup,
  ObjectRef,
  ObjectTypeRef,
  PropertyDefinition,
  SchemaGraphRelation,
  SchemaGraphType,
  StatusTone,
  TreeItem,
} from '../toolkit'

/** Relative times in the templates are anchored here, not to the wall clock. */
export const NOW = Date.parse('2026-09-25T17:00:00Z')
const minutesAgo = (count: number) => NOW - count * 60_000

export const TYPES = {
  customer: { id: 'customer', label: 'Customer', icon: 'building', color: 'teal' },
  person: { id: 'person', label: 'Person', icon: 'person', color: 'violet' },
  contract: { id: 'contract', label: 'Contract', icon: 'contract', color: 'amber' },
  order: { id: 'order', label: 'Order', icon: 'order', color: 'orange' },
  employment: { id: 'employment', label: 'Employment', icon: 'badge', color: 'olive' },
  ticket: { id: 'ticket', label: 'Support ticket', icon: 'ticket', color: 'rose' },
  dataset: { id: 'dataset', label: 'Dataset', icon: 'dataset', color: 'cyan' },
} satisfies Record<string, ObjectTypeRef>

export const OBJECT_TYPE: ObjectTypeRef = { id: 'object-type', label: 'Object type', icon: 'building', color: 'teal' }
export const CONNECTOR_TYPE: ObjectTypeRef = { id: 'connector', label: 'Connector', icon: 'plug', color: 'azure' }
export const FILE_TYPE: ObjectTypeRef = { id: 'file', label: 'File', icon: 'file', color: 'cyan' }

export const PEOPLE = {
  ada: { id: 'per-ada-morgan', title: 'Ada Morgan', type: TYPES.person, href: '#/objects/per-ada-morgan' },
  daniel: { id: 'per-daniel-reyes', title: 'Daniel Reyes', type: TYPES.person, href: '#/objects/per-daniel-reyes' },
  naomie: { id: 'per-naomie-park', title: 'Naomie Park', type: TYPES.person, href: '#/objects/per-naomie-park' },
  jamie: { id: 'per-jamie-kim', title: 'Jamie Kim', type: TYPES.person, href: '#/objects/per-jamie-kim' },
} satisfies Record<string, ObjectRef>

/** Quick-search results for the top bar palette. */
export function searchGroups(query: string): CommandGroup[] {
  const match = (text: string) => text.toLowerCase().includes(query.trim().toLowerCase())
  return [
    {
      id: 'objects',
      label: 'Objects',
      items: CUSTOMERS.filter(customer => match(customer.name)).slice(0, 4).map(customer => ({
        id: customer.id,
        label: customer.name,
        description: 'Customer',
      })),
    },
    {
      id: 'types',
      label: 'Object types',
      items: Object.values(TYPES).filter(type => match(type.label)).slice(0, 4).map(type => ({
        id: `type-${type.id}`,
        label: type.label,
        description: 'Object type',
      })),
    },
  ].filter(group => group.items.length > 0)
}

export interface CustomerRow {
  id: string
  name: string
  segment: string
  acv: number
  churnRisk: string
  renewal: string
  owner: ObjectRef
  regions: string[]
}

export const CHURN_TONES: Record<string, StatusTone> = { Healthy: 'ok', Watch: 'warning', 'At risk': 'danger' }

export const CUSTOMERS: CustomerRow[] = [
  { id: 'res-customer-northstar', name: 'Northstar Labs', segment: 'Enterprise', acv: 284_000, churnRisk: 'Watch', renewal: '2026-10-18', owner: PEOPLE.ada, regions: ['North America', 'EU-Central'] },
  { id: 'res-customer-bluefin', name: 'Bluefin Analytics', segment: 'Enterprise', acv: 212_500, churnRisk: 'Healthy', renewal: '2027-02-01', owner: PEOPLE.daniel, regions: ['North America'] },
  { id: 'res-customer-cedar', name: 'Cedar & Pine Health', segment: 'Mid-market', acv: 96_400, churnRisk: 'At risk', renewal: '2026-11-03', owner: PEOPLE.naomie, regions: ['EU-West'] },
  { id: 'res-customer-lumen', name: 'Lumen Fieldworks', segment: 'Mid-market', acv: 71_800, churnRisk: 'Healthy', renewal: '2027-04-12', owner: PEOPLE.ada, regions: ['APAC', 'North America'] },
  { id: 'res-customer-quarry', name: 'Quarry Point Energy', segment: 'Enterprise', acv: 158_900, churnRisk: 'Healthy', renewal: '2027-01-20', owner: PEOPLE.jamie, regions: ['LATAM'] },
]

export const EXPLORE_FACETS: FacetGroup[] = [
  {
    id: 'type',
    label: 'Object type',
    mode: 'single',
    selected: ['customer'],
    options: [
      { value: 'all', label: 'All objects', count: 3_585, icon: 'table' },
      { value: 'customer', label: 'Customer', count: 71, type: TYPES.customer },
      { value: 'person', label: 'Person', count: 212, type: TYPES.person },
      { value: 'contract', label: 'Contract', count: 48, type: TYPES.contract },
      { value: 'order', label: 'Order', count: 3_104, type: TYPES.order },
      { value: 'ticket', label: 'Support ticket', count: 918, type: TYPES.ticket },
    ],
  },
  {
    id: 'segment',
    label: 'Segment',
    mode: 'multi',
    selected: [],
    options: [
      { value: 'Enterprise', label: 'Enterprise', count: 3 },
      { value: 'Mid-market', label: 'Mid-market', count: 2 },
      { value: 'Startup', label: 'Startup', count: 0 },
    ],
  },
  {
    id: 'churn',
    label: 'Churn risk',
    mode: 'multi',
    selected: [],
    options: [
      { value: 'Healthy', label: 'Healthy', count: 3 },
      { value: 'Watch', label: 'Watch', count: 1 },
      { value: 'At risk', label: 'At risk', count: 1 },
    ],
  },
]

export function customerProperties(row: CustomerRow): PropertyDefinition[] {
  return [
    { id: 'segment', label: 'Segment', value: row.segment, kind: 'enum' },
    { id: 'acv', label: 'Annual contract value', value: row.acv, format: 'currency:USD' },
    { id: 'churn', label: 'Churn risk', value: row.churnRisk, kind: 'enum', tones: CHURN_TONES },
    { id: 'renewal', label: 'Renewal date', value: row.renewal, kind: 'date' },
    { id: 'owner', label: 'Account owner', value: row.owner },
  ]
}

export const CUSTOMER: ObjectRef = { id: 'res-customer-northstar', title: 'Northstar Labs', type: TYPES.customer, href: '#/objects/res-customer-northstar' }

export const CUSTOMER_PROPERTIES: PropertyDefinition[] = [
  { id: 'customer_id', label: 'Customer ID', value: 'CUS-01842', kind: 'id', group: 'Identity' },
  { id: 'legal_name', label: 'Legal name', value: 'Northstar Laboratories, Inc.', group: 'Identity' },
  { id: 'website', label: 'Website', value: 'https://northstar.example', kind: 'url', group: 'Identity' },
  { id: 'segment', label: 'Segment', value: 'Enterprise', kind: 'enum', group: 'Commercial' },
  { id: 'acv', label: 'Annual contract value', value: 284_000, format: 'currency:USD', group: 'Commercial' },
  { id: 'churn_risk', label: 'Churn risk', value: 'Watch', kind: 'enum', tones: CHURN_TONES, group: 'Commercial' },
  { id: 'churn_probability', label: 'Churn probability', value: 0.18, format: 'percent', group: 'Commercial' },
  { id: 'renewal', label: 'Renewal date', value: '2026-10-18', kind: 'date', group: 'Commercial' },
  { id: 'regions', label: 'Regions', value: ['North America', 'EU-Central'], group: 'Commercial' },
  { id: 'owner', label: 'Account owner', value: PEOPLE.ada, group: 'Commercial' },
]

export const CUSTOMER_LINKS: LinkGroup[] = [
  {
    id: 'employs',
    relation: 'Employs',
    targetType: TYPES.person,
    count: 3,
    items: [
      { ...PEOPLE.ada, detail: 'Technical lead' },
      { ...PEOPLE.daniel, detail: 'Procurement' },
      { ...PEOPLE.naomie, detail: 'Finance' },
    ],
  },
  {
    id: 'signed',
    relation: 'Signed',
    targetType: TYPES.contract,
    count: 1,
    items: [{ id: 'ctr-msa', title: 'Northstar master agreement', type: TYPES.contract, href: '#/objects/ctr-msa', detail: 'Jan 4, 2026' }],
  },
  {
    id: 'placed',
    relation: 'Placed',
    targetType: TYPES.order,
    count: 12,
    items: ['4481', '4479', '4476', '4470'].map((number, index) => ({
      id: `ord-${number}`,
      title: `ORD-${number}`,
      type: TYPES.order,
      href: `#/objects/ord-${number}`,
      detail: ['$18,240.00', '$9,815.00', '$12,002.50', '$4,410.00'][index],
      mono: true,
    })),
    viewAllHref: '#/explore?type=order&customer=res-customer-northstar',
  },
  {
    id: 'opened',
    relation: 'Opened',
    targetType: TYPES.ticket,
    count: 2,
    items: [
      { id: 'tkt-318', title: 'Export stalls above 2 GB', type: TYPES.ticket, href: '#/objects/tkt-318', detail: 'Open' },
      { id: 'tkt-301', title: 'SSO group mapping', type: TYPES.ticket, href: '#/objects/tkt-301', detail: 'Resolved' },
    ],
  },
]

export const CUSTOMER_ACTIVITY: ActivityItem[] = [
  { id: 'a1', actor: { name: 'Jamie Kim' }, verb: 'updated', object: CUSTOMER, summary: 'Churn risk Healthy → Watch', timestamp: minutesAgo(18) },
  { id: 'a2', actor: { name: 'Morgan Lee' }, verb: 'linked', object: { id: 'ctr-msa', title: 'Northstar master agreement', type: TYPES.contract, href: '#/objects/ctr-msa' }, timestamp: minutesAgo(60 * 24 * 57) },
  { id: 'a3', actor: { name: 'Sync CRM' }, verb: 'created this object', timestamp: minutesAgo(60 * 24 * 86) },
]

export const CUSTOMER_HISTORY: ActivityItem[] = [
  { id: 'h1', verb: 'Revision 14', summary: 'Churn risk Healthy → Watch · Jamie Kim', timestamp: '2026-09-25T16:42:00Z', tone: 'warning' },
  { id: 'h2', verb: 'Revision 13', summary: 'Linked Northstar master agreement · Morgan Lee', timestamp: '2026-07-30T10:05:00Z', tone: 'info' },
  { id: 'h3', verb: 'Created', summary: 'From gold.customer_360 · Sync CRM', timestamp: '2026-07-01T07:58:00Z', tone: 'neutral' },
]

export const SCHEMA_TYPES: SchemaGraphType[] = [
  { ...TYPES.customer, count: 71, href: '#/ontology/types/customer' },
  { ...TYPES.person, count: 212, href: '#/ontology/types/person' },
  { ...TYPES.contract, count: 48, href: '#/ontology/types/contract' },
  { ...TYPES.order, count: 3_104, href: '#/ontology/types/order' },
  { ...TYPES.employment, count: 230, href: '#/ontology/types/employment' },
  { ...TYPES.ticket, count: 918, href: '#/ontology/types/ticket' },
  { ...TYPES.dataset, count: 14, href: '#/ontology/types/dataset' },
]

export const SCHEMA_RELATIONS: SchemaGraphRelation[] = [
  { from: 'customer', to: 'person', label: 'Employs' },
  { from: 'customer', to: 'contract', label: 'Signed' },
  { from: 'customer', to: 'order', label: 'Placed' },
  { from: 'customer', to: 'ticket', label: 'Opened' },
  { from: 'person', to: 'employment', label: 'Holds' },
  { from: 'employment', to: 'customer', label: 'At' },
  { from: 'order', to: 'dataset', label: 'Recorded in' },
  { from: 'contract', to: 'order', label: 'Governs' },
]

export interface TypeRow {
  type: SchemaGraphType
  description: string
  properties: number
  linkTypes: number
  status: string
  updated: string
}

export const TYPE_ROWS: TypeRow[] = [
  { type: SCHEMA_TYPES[0]!, description: 'Organisations with a commercial agreement', properties: 24, linkTypes: 4, status: 'Active', updated: '2026-09-24' },
  { type: SCHEMA_TYPES[1]!, description: 'Contacts and employees', properties: 18, linkTypes: 2, status: 'Active', updated: '2026-09-18' },
  { type: SCHEMA_TYPES[2]!, description: 'Signed agreements and amendments', properties: 12, linkTypes: 2, status: 'Active', updated: '2026-08-30' },
  { type: SCHEMA_TYPES[3]!, description: 'Purchase orders from billing', properties: 15, linkTypes: 3, status: 'Active', updated: '2026-09-25' },
  { type: SCHEMA_TYPES[4]!, description: 'A person working at a customer', properties: 6, linkTypes: 2, status: 'Experimental', updated: '2026-09-02' },
  { type: SCHEMA_TYPES[5]!, description: 'Support conversations', properties: 11, linkTypes: 1, status: 'Active', updated: '2026-09-21' },
  { type: SCHEMA_TYPES[6]!, description: 'Registered tables in the lake', properties: 9, linkTypes: 1, status: 'Deprecated', updated: '2026-06-11' },
]

export const TYPE_STATUS_TONES: Record<string, StatusTone> = { Active: 'ok', Experimental: 'info', Deprecated: 'warning' }

export interface SchemaPropertyRow {
  name: string
  apiName: string
  kind: string
  required: boolean
  format: string
}

export const CUSTOMER_SCHEMA: SchemaPropertyRow[] = [
  { name: 'Customer ID', apiName: 'customer_id', kind: 'id', required: true, format: 'Primary key' },
  { name: 'Legal name', apiName: 'legal_name', kind: 'string', required: true, format: 'Title' },
  { name: 'Segment', apiName: 'segment', kind: 'enum', required: true, format: '3 values' },
  { name: 'Annual contract value', apiName: 'acv', kind: 'currency', required: false, format: 'USD' },
  { name: 'Churn risk', apiName: 'churn_risk', kind: 'enum', required: false, format: 'Toned' },
  { name: 'Churn probability', apiName: 'churn_probability', kind: 'percent', required: false, format: '0–1' },
  { name: 'Renewal date', apiName: 'renewal', kind: 'date', required: false, format: 'Calendar date' },
  { name: 'Account owner', apiName: 'owner', kind: 'link', required: false, format: 'Person' },
]

export const CUSTOMER_LINK_TYPES: LinkGroup[] = [
  { id: 'employs', relation: 'Employs', targetType: TYPES.person, count: 212, items: [{ id: 'lt-employs', title: 'Customer → Person', type: TYPES.person, href: '#/ontology/links/employs', detail: 'One to many' }] },
  { id: 'signed', relation: 'Signed', targetType: TYPES.contract, count: 48, items: [{ id: 'lt-signed', title: 'Customer → Contract', type: TYPES.contract, href: '#/ontology/links/signed', detail: 'One to many' }] },
  { id: 'placed', relation: 'Placed', targetType: TYPES.order, count: 3_104, items: [{ id: 'lt-placed', title: 'Customer → Order', type: TYPES.order, href: '#/ontology/links/placed', detail: 'One to many' }] },
  { id: 'at', relation: 'At', direction: 'incoming', targetType: TYPES.employment, count: 230, items: [{ id: 'lt-at', title: 'Employment → Customer', type: TYPES.employment, href: '#/ontology/links/at', detail: 'Many to one' }] },
]

export interface FileRow {
  id: string
  name: string
  kind: 'folder' | 'csv' | 'pdf' | 'markdown' | 'image' | 'json'
  semanticType?: ObjectRef
  size?: number
  updated: string
  owner: string
}

export const FOLDERS: TreeItem[] = [
  {
    id: 'shared',
    label: 'Shared',
    children: [
      { id: 'shared/finance', label: 'finance', children: [{ id: 'shared/finance/2026', label: '2026' }] },
      { id: 'shared/customers', label: 'customers' },
      { id: 'shared/legal', label: 'legal' },
    ],
  },
  { id: 'mine', label: 'My files', children: [{ id: 'mine/drafts', label: 'drafts' }] },
]

export const FILES: FileRow[] = [
  { id: 'f-2026', name: '2026', kind: 'folder', updated: '2026-09-24T09:12:00Z', owner: 'Finance team' },
  { id: 'f-forecast', name: 'q3-forecast.csv', kind: 'csv', semanticType: { id: 'ds-forecast', title: 'Revenue forecast', type: TYPES.dataset }, size: 48_200, updated: '2026-09-24T16:02:00Z', owner: 'Ada Morgan' },
  { id: 'f-msa', name: 'northstar-msa.pdf', kind: 'pdf', semanticType: { id: 'ctr-msa', title: 'Northstar master agreement', type: TYPES.contract }, size: 2_400_000, updated: '2026-09-22T11:40:00Z', owner: 'Legal' },
  { id: 'f-notes', name: 'renewal-notes.md', kind: 'markdown', size: 3_120, updated: '2026-09-21T08:15:00Z', owner: 'Jamie Kim' },
  { id: 'f-org', name: 'org-chart.png', kind: 'image', size: 812_000, updated: '2026-09-02T14:30:00Z', owner: 'Daniel Reyes' },
  { id: 'f-mapping', name: 'crm-mapping.json', kind: 'json', size: 9_840, updated: '2026-08-28T10:00:00Z', owner: 'Sync CRM' },
]

export const FORECAST_CSV = [
  'month,region,bookings,renewals,churn',
  '2026-07,North America,412000,188000,0.021',
  '2026-07,EU-Central,236000,94000,0.018',
  '2026-08,North America,398500,201000,0.024',
  '2026-08,EU-Central,251200,88000,0.019',
  '2026-09,North America,431900,176500,0.022',
  '2026-09,EU-Central,244800,97200,0.017',
].join('\n')

/** A product fetch stand-in that serves the forecast CSV. */
export const fixtureFetch: typeof globalThis.fetch = async () => new Response(FORECAST_CSV, {
  status: 200,
  headers: { 'content-type': 'text/csv' },
})

export interface ServiceHealth {
  id: string
  name: string
  status: { label: string; tone: StatusTone }
  version: string
  detail: string
}

export const SERVICES: ServiceHealth[] = [
  { id: 'api', name: 'Object API', status: { label: 'Healthy', tone: 'ok' }, version: '4.18.2', detail: 'p95 84 ms · fresh 1 min ago' },
  { id: 'index', name: 'Search index', status: { label: 'Degraded', tone: 'warning' }, version: '2.9.0', detail: 'Lag 6 min · fresh 6 min ago' },
  { id: 'sync', name: 'Sync workers', status: { label: 'Healthy', tone: 'ok' }, version: '1.31.0', detail: '12 of 12 running' },
  { id: 'storage', name: 'Object storage', status: { label: 'Healthy', tone: 'ok' }, version: '3.4.1', detail: '41% used · fresh 2 min ago' },
]

export interface ReleaseRow {
  id: string
  service: string
  version: string
  environment: string
  status: string
  deployed: string
  by: string
}

export const RELEASE_TONES: Record<string, StatusTone> = { Live: 'ok', 'Rolling out': 'info', 'Rolled back': 'danger', Queued: 'neutral' }

export const RELEASES: ReleaseRow[] = [
  { id: 'r1', service: 'Search index', version: '2.9.0', environment: 'Production', status: 'Rolling out', deployed: '2026-09-25T16:20:00Z', by: 'Deploy bot' },
  { id: 'r2', service: 'Object API', version: '4.18.2', environment: 'Production', status: 'Live', deployed: '2026-09-24T21:05:00Z', by: 'Jamie Kim' },
  { id: 'r3', service: 'Object API', version: '4.18.1', environment: 'Production', status: 'Rolled back', deployed: '2026-09-24T19:40:00Z', by: 'Jamie Kim' },
  { id: 'r4', service: 'Sync workers', version: '1.31.0', environment: 'Production', status: 'Live', deployed: '2026-09-23T15:12:00Z', by: 'Deploy bot' },
  { id: 'r5', service: 'Object storage', version: '3.4.1', environment: 'Staging', status: 'Queued', deployed: '2026-09-25T17:30:00Z', by: 'Deploy bot' },
]

export const INCIDENTS: ActivityItem[] = [
  { id: 'i1', verb: 'Index lag above 5 min', summary: 'Search index · paging on-call', timestamp: '2026-09-25T16:48:00Z', tone: 'warning' },
  { id: 'i2', verb: 'Rolled back Object API 4.18.1', summary: 'Error rate 2.4% after release', timestamp: '2026-09-24T19:52:00Z', tone: 'danger' },
  { id: 'i3', verb: 'Certificate renewed', summary: 'api.workspace.example', timestamp: '2026-09-23T03:00:00Z', tone: 'ok' },
]

export interface BucketRow {
  id: string
  name: string
  used: number
  quota: number
  objects: number
  storageClass: string
  versioning: boolean
  updated: string
  status: string
}

export const BUCKET_TONES: Record<string, StatusTone> = { Available: 'ok', 'Near quota': 'warning', 'Read-only': 'neutral' }

export const BUCKETS: BucketRow[] = [
  { id: 'b-finance', name: 'finance', used: 412_000_000_000, quota: 1_000_000_000_000, objects: 1_284, storageClass: 'Standard', versioning: true, updated: '2026-09-25T16:58:00Z', status: 'Available' },
  { id: 'b-media', name: 'media', used: 1_860_000_000_000, quota: 2_000_000_000_000, objects: 58_210, storageClass: 'Standard', versioning: false, updated: '2026-09-25T16:40:00Z', status: 'Near quota' },
  { id: 'b-lake', name: 'lake-bronze', used: 7_240_000_000_000, quota: 20_000_000_000_000, objects: 912_004, storageClass: 'Infrequent', versioning: true, updated: '2026-09-25T15:02:00Z', status: 'Available' },
  { id: 'b-archive', name: 'archive-2024', used: 3_100_000_000_000, quota: 5_000_000_000_000, objects: 204_117, storageClass: 'Archive', versioning: true, updated: '2026-01-02T00:00:00Z', status: 'Read-only' },
]

export interface ConnectorRow {
  id: string
  name: string
  source: string
  status: string
  lastSync: string
  records: number
  owner: string
}

export const CONNECTOR_TONES: Record<string, StatusTone> = { Healthy: 'ok', Failing: 'danger', Paused: 'neutral', Syncing: 'info' }

export const CONNECTORS: ConnectorRow[] = [
  { id: 'c-crm', name: 'CRM accounts', source: 'CRM', status: 'Healthy', lastSync: '2026-09-25T16:55:00Z', records: 71_240, owner: 'Sync CRM' },
  { id: 'c-billing', name: 'Billing orders', source: 'Billing', status: 'Failing', lastSync: '2026-09-25T15:03:00Z', records: 3_104_882, owner: 'Finance team' },
  { id: 'c-support', name: 'Support tickets', source: 'Helpdesk', status: 'Syncing', lastSync: '2026-09-25T16:40:00Z', records: 918_210, owner: 'Support ops' },
  { id: 'c-hr', name: 'People directory', source: 'HR system', status: 'Paused', lastSync: '2026-09-18T09:00:00Z', records: 2_140, owner: 'People team' },
]

export const CONNECTOR_CONFIG: PropertyDefinition[] = [
  { id: 'source', label: 'Source', value: 'Billing', kind: 'enum', group: 'Source' },
  { id: 'endpoint', label: 'Endpoint', value: 'https://billing.example/api/v2', kind: 'url', group: 'Source' },
  { id: 'credential', label: 'Credential', value: 'cred-billing-readonly', kind: 'id', group: 'Source' },
  { id: 'schedule', label: 'Schedule', value: 'Every 15 minutes', group: 'Sync' },
  { id: 'mode', label: 'Mode', value: 'Incremental', kind: 'enum', group: 'Sync' },
  { id: 'target', label: 'Target type', value: { id: 'order', title: 'Order', type: TYPES.order, href: '#/ontology/types/order' }, group: 'Sync' },
  { id: 'backfill', label: 'Backfill complete', value: true, group: 'Sync' },
]

export const SYNC_HISTORY: ActivityItem[] = [
  { id: 's1', verb: 'Sync failed', summary: 'load-warehouse · connection reset · retry in 30 s', timestamp: '2026-09-25T15:03:05Z', tone: 'danger' },
  { id: 's2', verb: 'Sync completed', summary: '1,284 orders · 42 s', timestamp: '2026-09-25T14:48:10Z', tone: 'ok' },
  { id: 's3', verb: 'Sync completed', summary: '1,120 orders · 39 s', timestamp: '2026-09-25T14:33:02Z', tone: 'ok' },
  { id: 's4', verb: 'Schema change', summary: 'New column discount_code · mapped to a property', timestamp: '2026-09-24T22:10:00Z', tone: 'info' },
]
