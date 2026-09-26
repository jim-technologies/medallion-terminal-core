/**
 * Story fixtures for the ontology components: one neutral customer object
 * with typed properties, its links and its activity. Names are invented;
 * nothing refers to a real organisation.
 */
import type { LinkGroup, LinkItem } from './LinkPanel'
import type { PropertyDefinition } from './PropertyPanel'
import type { SchemaGraphRelation, SchemaGraphType } from './SchemaGraph'
import type { ObjectRef, ObjectTypeRef } from './types'

/** Relative times in stories are anchored here, not to the wall clock. */
export const STORY_NOW = Date.parse('2026-09-25T17:00:00Z')

export const TYPES = {
  customer: { id: 'customer', label: 'Customer', icon: 'building', color: 'teal' },
  person: { id: 'person', label: 'Person', icon: 'person', color: 'violet' },
  contract: { id: 'contract', label: 'Contract', icon: 'contract', color: 'amber' },
  order: { id: 'order', label: 'Order', icon: 'order', color: 'orange' },
  employment: { id: 'employment', label: 'Employment', icon: 'badge', color: 'olive' },
  dataset: { id: 'dataset', label: 'Dataset', icon: 'dataset', color: 'cyan' },
  ticket: { id: 'ticket', label: 'Support ticket', icon: 'ticket', color: 'rose' },
} satisfies Record<string, ObjectTypeRef>

export const PEOPLE = {
  ada: { id: 'per-ada-morgan', title: 'Ada Morgan', type: TYPES.person, href: '#/objects/per-ada-morgan' },
  daniel: { id: 'per-daniel-reyes', title: 'Daniel Reyes', type: TYPES.person, href: '#/objects/per-daniel-reyes' },
  naomie: { id: 'per-naomie-park', title: 'Naomie Park', type: TYPES.person, href: '#/objects/per-naomie-park' },
} satisfies Record<string, ObjectRef>

export const CUSTOMER: ObjectRef = {
  id: 'res-customer-northstar',
  title: 'Northstar Labs',
  type: TYPES.customer,
  href: '#/objects/res-customer-northstar',
}

export const CUSTOMER_PROPERTIES: PropertyDefinition[] = [
  { id: 'customer_id', label: 'Customer ID', value: 'CUS-01842', kind: 'id', group: 'Identity' },
  { id: 'legal_name', label: 'Legal name', value: 'Northstar Laboratories, Inc.', group: 'Identity' },
  { id: 'website', label: 'Website', value: 'https://northstar.example', kind: 'url', group: 'Identity' },
  { id: 'segment', label: 'Segment', value: 'Enterprise', kind: 'enum', group: 'Commercial' },
  { id: 'acv', label: 'Annual contract value', value: 284000, format: 'currency:USD', group: 'Commercial' },
  {
    id: 'churn_risk',
    label: 'Churn risk',
    value: 'Watch',
    kind: 'enum',
    tones: { Healthy: 'ok', Watch: 'warning', 'At risk': 'danger' },
    group: 'Commercial',
  },
  { id: 'churn_probability', label: 'Churn probability', value: 0.18, format: 'percent', group: 'Commercial' },
  { id: 'health', label: 'Health score', value: 92, kind: 'integer', group: 'Commercial' },
  { id: 'renewal', label: 'Renewal date', value: '2026-10-18', kind: 'date', group: 'Commercial' },
  { id: 'regions', label: 'Regions', value: ['North America', 'EU-Central'], group: 'Commercial' },
  { id: 'design_partner', label: 'Design partner', value: true, group: 'Commercial' },
  { id: 'owner', label: 'Account owner', value: PEOPLE.ada, group: 'Commercial' },
]

/** Every property kind, in panel and grid form. */
export const EVERY_KIND: PropertyDefinition[] = [
  { id: 'string', label: 'string', value: 'Northstar Laboratories, Inc.' },
  { id: 'long', label: 'string (long)', value: 'Enterprise customer assembled from the CRM, billing, product usage and support systems; renewal negotiations open in October with an expansion into two new regions.' },
  { id: 'id', label: 'id', value: 'CUS-01842', kind: 'id' },
  { id: 'code', label: 'code', value: 'sha256:9f2c41e0a7', kind: 'code' },
  { id: 'number', label: 'number', value: 1234567.891 },
  { id: 'integer', label: 'integer', value: 48210, kind: 'integer' },
  { id: 'currency', label: 'currency:USD', value: 284000, format: 'currency:USD' },
  { id: 'currency-eur', label: 'currency:EUR', value: 9815.5, format: 'currency:EUR' },
  { id: 'percent', label: 'percent', value: 0.18, format: 'percent' },
  { id: 'date', label: 'date', value: '2026-10-18', kind: 'date' },
  { id: 'datetime', label: 'datetime', value: '2026-09-25T15:42:00Z', kind: 'datetime' },
  { id: 'boolean-true', label: 'boolean', value: true },
  { id: 'boolean-false', label: 'boolean (false)', value: false },
  { id: 'enum', label: 'enum', value: 'Enterprise', kind: 'enum' },
  { id: 'enum-tone', label: 'enum (tone)', value: 'Churned', kind: 'enum', tones: { Active: 'ok', Churned: 'danger' } },
  { id: 'list', label: 'list', value: ['North America', 'EU-Central', 'APAC', 'LATAM', 'MEA'] },
  { id: 'link', label: 'link', value: PEOPLE.ada },
  { id: 'url', label: 'url', value: 'https://northstar.example/docs', kind: 'url' },
  { id: 'url-unsafe', label: 'url (not http)', value: 'javascript:alert(1)', kind: 'url' },
  { id: 'email', label: 'email', value: 'ada.morgan@northstar.example', kind: 'email' },
  { id: 'object', label: 'object', value: { horizon_days: 90, currency: 'USD', approved: true } },
  { id: 'empty', label: 'empty', value: null },
]

const ORDERS: LinkItem[] = [
  { id: 'ord-4481', title: 'ORD-4481', type: TYPES.order, href: '#/objects/ord-4481', detail: '$18,240.00', mono: true },
  { id: 'ord-4479', title: 'ORD-4479', type: TYPES.order, href: '#/objects/ord-4479', detail: '$9,815.00', mono: true },
  { id: 'ord-4476', title: 'ORD-4476', type: TYPES.order, href: '#/objects/ord-4476', detail: '$12,002.50', mono: true },
  { id: 'ord-4470', title: 'ORD-4470', type: TYPES.order, href: '#/objects/ord-4470', detail: '$4,410.00', mono: true },
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
    items: ORDERS,
    viewAllHref: '#/explore?type=order&customer=res-customer-northstar',
  },
  {
    id: 'subject-of',
    relation: 'Subject of',
    direction: 'incoming',
    targetType: TYPES.employment,
    count: 1,
    items: [{ id: 'emp-ada', title: 'Ada at Northstar', type: TYPES.employment, href: '#/objects/emp-ada', detail: '2024 – present' }],
  },
]

/** A busy object: more links than the graph draws. */
export const BUSY_LINKS: LinkGroup[] = [
  CUSTOMER_LINKS[0]!,
  {
    id: 'placed',
    relation: 'Placed',
    targetType: TYPES.order,
    count: 212,
    items: Array.from({ length: 60 }, (_, index) => ({
      id: `ord-${5000 + index}`,
      title: `ORD-${5000 + index}`,
      type: TYPES.order,
      href: `#/objects/ord-${5000 + index}`,
    })),
    viewAllHref: '#/explore?type=order',
  },
  {
    id: 'opened',
    relation: 'Opened',
    targetType: TYPES.ticket,
    count: 9,
    items: Array.from({ length: 9 }, (_, index) => ({
      id: `tkt-${310 + index}`,
      title: `Ticket ${310 + index}`,
      type: TYPES.ticket,
      href: `#/objects/tkt-${310 + index}`,
    })),
  },
]

export const SCHEMA_TYPES: SchemaGraphType[] = [
  { ...TYPES.customer, count: 71, href: '#/ontology/types/customer' },
  { ...TYPES.person, count: 212, href: '#/ontology/types/person' },
  { ...TYPES.contract, count: 48, href: '#/ontology/types/contract' },
  { ...TYPES.order, count: 3104, href: '#/ontology/types/order' },
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
