import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { CLONE_DEMO_IDENTITY } from '../../demoIdentity'
import {
  OperationalShowcaseAvatar,
  OperationalShowcaseIcon,
  type OperationalShowcaseIconName,
} from '../../shared/OperationalShowcasePrimitives'
import {
  resolveBackstageRelations,
  selectBackstageEntities,
  type BackstageCatalogScope,
  type BackstageDocument,
  type BackstageEntity,
  type BackstageEntityHealth,
  type BackstageEntityKind,
  type BackstageEntityTab,
  type BackstageTemplate,
  type BackstageView,
} from './BackstageModel'
import './BackstageShowcase.css'

export {
  resolveBackstageRelations,
  selectBackstageEntities,
} from './BackstageModel'
export type {
  BackstageCatalogScope,
  BackstageDocument,
  BackstageEntity,
  BackstageEntityHealth,
  BackstageEntityKind,
  BackstageEntityTab,
  BackstageTemplate,
  BackstageView,
} from './BackstageModel'

/**
 * Host-injectable data and navigation hooks for the visual Backstage reference.
 * Persistence, discovery, permissions, and template execution stay outside the showcase.
 */
export interface BackstageShowcaseProps {
  entities?: readonly BackstageEntity[]
  templates?: readonly BackstageTemplate[]
  documents?: readonly BackstageDocument[]
  initialView?: BackstageView
  initialEntityId?: string
  initialEntityTab?: BackstageEntityTab
  initialKind?: BackstageEntityKind | 'All'
  initialTemplateId?: string
  initialDocumentId?: string
  companyName?: string
  userName?: string
  onSelectEntity?: (entity: BackstageEntity) => void
  onCreateFromTemplate?: (template: BackstageTemplate) => void
  onNavigate?: (view: BackstageView) => void
}

// Deterministic host-data fixtures keep every Storybook surface useful without a backend.
export const BACKSTAGE_SAMPLE_ENTITIES: readonly BackstageEntity[] = [
  {
    id: 'component.customer-gateway',
    name: 'customer-gateway',
    title: 'Customer Gateway',
    kind: 'Component',
    type: 'service',
    lifecycle: 'production',
    owner: 'platform-experience',
    system: 'customer-platform',
    domain: 'customer-experience',
    description: 'Public edge service for authenticated customer and partner traffic.',
    tags: ['typescript', 'node', 'kubernetes'],
    health: 'healthy',
    repository: 'jim-technologies/customer-gateway',
    documentation: 'Customer Gateway',
    coverage: 94,
    starred: true,
    dependsOn: ['resource.customer-database', 'component.identity-service'],
    providesApis: ['api.customer-api'],
    consumesApis: ['api.identity-api'],
  },
  {
    id: 'component.web-console',
    name: 'web-console',
    title: 'Web Console',
    kind: 'Component',
    type: 'website',
    lifecycle: 'production',
    owner: 'product-engineering',
    system: 'customer-platform',
    domain: 'customer-experience',
    description: 'Operator and customer workspace for Jim Technologies products.',
    tags: ['react', 'typescript', 'frontend'],
    health: 'healthy',
    repository: 'jim-technologies/web-console',
    documentation: 'Web Console',
    coverage: 88,
    starred: true,
    dependsOn: ['component.customer-gateway'],
    consumesApis: ['api.customer-api'],
  },
  {
    id: 'component.billing-service',
    name: 'billing-service',
    title: 'Billing Service',
    kind: 'Component',
    type: 'service',
    lifecycle: 'production',
    owner: 'commerce-platform',
    system: 'commerce',
    domain: 'business-operations',
    description: 'Invoices, subscriptions, usage rating, and ledger posting.',
    tags: ['go', 'postgres', 'grpc'],
    health: 'warning',
    repository: 'jim-technologies/billing-service',
    documentation: 'Billing Service',
    coverage: 82,
    dependsOn: ['resource.billing-database'],
    providesApis: ['api.billing-api'],
  },
  {
    id: 'component.identity-service',
    name: 'identity-service',
    title: 'Identity Service',
    kind: 'Component',
    type: 'service',
    lifecycle: 'production',
    owner: 'security-platform',
    system: 'customer-platform',
    domain: 'customer-experience',
    description: 'Workspace identity, sessions, service credentials, and policy claims.',
    tags: ['rust', 'oidc', 'security'],
    health: 'healthy',
    repository: 'jim-technologies/identity-service',
    documentation: 'Identity Service',
    coverage: 96,
    providesApis: ['api.identity-api'],
    dependsOn: ['resource.customer-database'],
  },
  {
    id: 'component.notifications-worker',
    name: 'notifications-worker',
    title: 'Notifications Worker',
    kind: 'Component',
    type: 'service',
    lifecycle: 'production',
    owner: 'platform-experience',
    system: 'customer-platform',
    domain: 'customer-experience',
    description: 'Asynchronous email, push, webhook, and in-product delivery worker.',
    tags: ['python', 'events', 'worker'],
    health: 'healthy',
    repository: 'jim-technologies/notifications-worker',
    documentation: 'Notifications Worker',
    coverage: 91,
    consumesApis: ['api.customer-api'],
  },
  {
    id: 'api.customer-api',
    name: 'customer-api',
    title: 'Customer API',
    kind: 'API',
    type: 'openapi',
    lifecycle: 'production',
    owner: 'platform-experience',
    system: 'customer-platform',
    domain: 'customer-experience',
    description: 'Versioned HTTP contract for customer-facing platform capabilities.',
    tags: ['openapi', 'rest', 'public'],
    health: 'healthy',
    repository: 'jim-technologies/customer-gateway',
    documentation: 'Customer API reference',
  },
  {
    id: 'api.identity-api',
    name: 'identity-api',
    title: 'Identity API',
    kind: 'API',
    type: 'grpc',
    lifecycle: 'production',
    owner: 'security-platform',
    system: 'customer-platform',
    domain: 'customer-experience',
    description: 'Internal identity and authorization claims contract.',
    tags: ['protobuf', 'grpc', 'internal'],
    health: 'healthy',
    repository: 'jim-technologies/identity-service',
    documentation: 'Identity API reference',
  },
  {
    id: 'api.billing-api',
    name: 'billing-api',
    title: 'Billing API',
    kind: 'API',
    type: 'openapi',
    lifecycle: 'production',
    owner: 'commerce-platform',
    system: 'commerce',
    domain: 'business-operations',
    description: 'Invoice, subscription, and usage billing contract.',
    tags: ['openapi', 'finance', 'internal'],
    health: 'warning',
    repository: 'jim-technologies/billing-service',
    documentation: 'Billing API reference',
  },
  {
    id: 'resource.customer-database',
    name: 'customer-database',
    title: 'Customer Database',
    kind: 'Resource',
    type: 'database',
    lifecycle: 'production',
    owner: 'data-platform',
    system: 'customer-platform',
    domain: 'customer-experience',
    description: 'Primary regional store for customer profiles and workspace metadata.',
    tags: ['postgres', 'encrypted', 'regional'],
    health: 'healthy',
  },
  {
    id: 'resource.billing-database',
    name: 'billing-database',
    title: 'Billing Database',
    kind: 'Resource',
    type: 'database',
    lifecycle: 'production',
    owner: 'commerce-platform',
    system: 'commerce',
    domain: 'business-operations',
    description: 'Durable billing ledger and invoice projection store.',
    tags: ['postgres', 'ledger', 'restricted'],
    health: 'warning',
  },
  {
    id: 'system.customer-platform',
    name: 'customer-platform',
    title: 'Customer Platform',
    kind: 'System',
    type: 'product',
    lifecycle: 'production',
    owner: 'platform-experience',
    domain: 'customer-experience',
    description: 'Services and interfaces that power the Jim Technologies customer experience.',
    tags: ['tier-1', 'customer'],
    health: 'healthy',
    starred: true,
  },
  {
    id: 'domain.customer-experience',
    name: 'customer-experience',
    title: 'Customer Experience',
    kind: 'Domain',
    type: 'business-domain',
    lifecycle: 'production',
    owner: 'product-engineering',
    description: 'Products, systems, and teams serving customer workflows.',
    tags: ['customer', 'product'],
    health: 'healthy',
  },
]

export const BACKSTAGE_SAMPLE_TEMPLATES: readonly BackstageTemplate[] = [
  {
    id: 'typescript-service',
    title: 'TypeScript service',
    description: 'Create a production service with ConnectRPC, health checks, CI, and catalog metadata.',
    owner: 'platform-experience',
    type: 'Service',
    tags: ['recommended', 'typescript', 'kubernetes'],
    steps: ['Service details', 'Repository location', 'Review and create'],
    icon: 'code',
  },
  {
    id: 'react-application',
    title: 'React application',
    description: 'Scaffold an accessible React application with testing, deployment, and TechDocs.',
    owner: 'product-engineering',
    type: 'Website',
    tags: ['react', 'typescript', 'frontend'],
    steps: ['Application details', 'Runtime options', 'Review and create'],
    icon: 'apps',
  },
  {
    id: 'data-pipeline',
    title: 'Data pipeline',
    description: 'Start a governed batch or streaming pipeline with lineage and ownership metadata.',
    owner: 'data-platform',
    type: 'Pipeline',
    tags: ['python', 'data', 'governed'],
    steps: ['Pipeline details', 'Sources and schedule', 'Review and create'],
    icon: 'graph',
  },
  {
    id: 'documentation-site',
    title: 'TechDocs site',
    description: 'Publish docs-as-code with navigation, search metadata, and catalog registration.',
    owner: 'developer-experience',
    type: 'Documentation',
    tags: ['mkdocs', 'documentation'],
    steps: ['Documentation details', 'Repository location', 'Review and create'],
    icon: 'document',
  },
]

export const BACKSTAGE_SAMPLE_DOCUMENTS: readonly BackstageDocument[] = [
  {
    id: 'customer-gateway',
    title: 'Customer Gateway',
    entityId: 'component.customer-gateway',
    description: 'Architecture, local development, deployment, and operational guidance.',
    owner: 'platform-experience',
    updatedAt: '18 minutes ago',
    sections: ['Overview', 'Architecture', 'Local development', 'Deployment', 'Operations'],
  },
  {
    id: 'web-console',
    title: 'Web Console',
    entityId: 'component.web-console',
    description: 'Frontend architecture, contribution workflow, releases, and support.',
    owner: 'product-engineering',
    updatedAt: 'Yesterday',
    sections: ['Overview', 'Application shell', 'Testing', 'Release process'],
  },
  {
    id: 'identity-service',
    title: 'Identity Service',
    entityId: 'component.identity-service',
    description: 'Identity boundaries, token lifecycle, operational playbooks, and API use.',
    owner: 'security-platform',
    updatedAt: '2 days ago',
    sections: ['Overview', 'Trust boundaries', 'Credentials', 'Incident response'],
  },
  {
    id: 'billing-service',
    title: 'Billing Service',
    entityId: 'component.billing-service',
    description: 'Billing concepts, ledger guarantees, reconciliation, and runbooks.',
    owner: 'commerce-platform',
    updatedAt: '4 days ago',
    sections: ['Overview', 'Ledger model', 'Reconciliation', 'Runbooks'],
  },
]

// Presentation configuration is intentionally local; it is not a routing or plugin API.
const BACKSTAGE_NAV: readonly {
  id: BackstageView | 'home' | 'apis'
  label: string
  icon: OperationalShowcaseIconName
}[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'catalog', label: 'Catalog', icon: 'box' },
  { id: 'apis', label: 'APIs', icon: 'code' },
  { id: 'docs', label: 'Docs', icon: 'document' },
  { id: 'create', label: 'Create', icon: 'plus' },
]

const ENTITY_TABS: readonly { id: BackstageEntityTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'ci-cd', label: 'CI/CD' },
  { id: 'apis', label: 'APIs' },
  { id: 'dependencies', label: 'Dependencies' },
  { id: 'kubernetes', label: 'Kubernetes' },
]

const KIND_OPTIONS: readonly (BackstageEntityKind | 'All')[] = [
  'All',
  'Component',
  'API',
  'Resource',
  'System',
  'Domain',
  'Group',
]

// Shared shell and visual primitives.
function BackstageBrand() {
  return (
    <div className="bks-brand" aria-label="Backstage">
      <span className="bks-brand__mark" aria-hidden="true">
        <span>B</span>
      </span>
      <strong>Backstage</strong>
    </div>
  )
}

function EntityKindMark({ entity, compact = false }: {
  entity: BackstageEntity
  compact?: boolean
}) {
  const icon: OperationalShowcaseIconName = entity.kind === 'API'
    ? 'code'
    : entity.kind === 'Resource'
      ? 'database'
      : entity.kind === 'System' || entity.kind === 'Domain'
        ? 'layers'
        : 'box'
  return (
    <span className={`bks-kind-mark is-${entity.kind.toLowerCase()}${compact ? ' is-compact' : ''}`}>
      <OperationalShowcaseIcon name={icon} size={compact ? 15 : 19} />
    </span>
  )
}

function HealthStatus({ health, label = true }: {
  health: BackstageEntityHealth
  label?: boolean
}) {
  return (
    <span className={`bks-health is-${health}`}>
      <span aria-hidden="true" />
      {label && (health === 'healthy' ? 'Healthy' : health === 'warning' ? 'Warning' : 'Error')}
    </span>
  )
}

function PageHero({
  eyebrow,
  title,
  description,
  tone = 'teal',
  actions,
}: {
  eyebrow: string
  title: string
  description?: string
  tone?: 'teal' | 'violet' | 'blue'
  actions?: ReactNode
}) {
  return (
    <header className={`bks-page-hero is-${tone}`}>
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="bks-page-hero__actions">{actions}</div>}
    </header>
  )
}

// Software Catalog.
function BackstageCatalog({
  entities,
  query,
  setQuery,
  kind,
  setKind,
  scope,
  setScope,
  userOwner,
  onOpenEntity,
  onCreate,
}: {
  entities: readonly BackstageEntity[]
  query: string
  setQuery: (query: string) => void
  kind: BackstageEntityKind | 'All'
  setKind: (kind: BackstageEntityKind | 'All') => void
  scope: BackstageCatalogScope
  setScope: (scope: BackstageCatalogScope) => void
  userOwner: string
  onOpenEntity: (entity: BackstageEntity) => void
  onCreate: () => void
}) {
  const filtered = useMemo(
    () => selectBackstageEntities(entities, query, { kind, scope, owner: userOwner }),
    [entities, kind, query, scope, userOwner],
  )
  const ownedCount = entities.filter(entity => entity.owner === userOwner).length
  const starredCount = entities.filter(entity => entity.starred).length

  return (
    <>
      <PageHero
        eyebrow="Software Catalog"
        title="Discover your software"
        description="Components, APIs, resources, systems, ownership, and operational context in one place."
        actions={(
          <>
            <button className="bks-button is-ghost" type="button">
              <OperationalShowcaseIcon name="plus" size={16} />
              Register existing component
            </button>
            <button className="bks-button is-primary" onClick={onCreate} type="button">
              Create component
            </button>
          </>
        )}
      />
      <div className="bks-catalog-page">
        <aside className="bks-catalog-filters" aria-label="Catalog filters">
          <h2>Personal</h2>
          <button
            className={scope === 'owned' ? 'is-active' : ''}
            onClick={() => setScope('owned')}
            type="button"
          >
            <OperationalShowcaseIcon name="user" size={17} />
            <span>Owned</span>
            <strong>{ownedCount}</strong>
          </button>
          <button
            className={scope === 'starred' ? 'is-active' : ''}
            onClick={() => setScope('starred')}
            type="button"
          >
            <span aria-hidden="true" className="bks-star">★</span>
            <span>Starred</span>
            <strong>{starredCount}</strong>
          </button>
          <h2>Organization</h2>
          <button
            className={scope === 'all' ? 'is-active' : ''}
            onClick={() => setScope('all')}
            type="button"
          >
            <OperationalShowcaseIcon name="people" size={17} />
            <span>All</span>
            <strong>{entities.length}</strong>
          </button>
        </aside>

        <section className="bks-catalog-card" aria-labelledby="bks-catalog-heading">
          <header>
            <div>
              <h2 id="bks-catalog-heading">
                {scope === 'owned' ? 'Owned' : scope === 'starred' ? 'Starred' : 'All entities'}
                <span>{filtered.length}</span>
              </h2>
              <p>Catalog metadata is synchronized from host-provided sources.</p>
            </div>
            <div className="bks-catalog-tools">
              <label>
                <span className="bks-sr-only">Entity kind</span>
                <select
                  aria-label="Entity kind"
                  onChange={event => setKind(event.target.value as BackstageEntityKind | 'All')}
                  value={kind}
                >
                  {KIND_OPTIONS.map(option => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="bks-search-field">
                <OperationalShowcaseIcon name="search" size={18} />
                <span className="bks-sr-only">Filter catalog</span>
                <input
                  aria-label="Filter catalog"
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Filter"
                  type="search"
                  value={query}
                />
              </label>
            </div>
          </header>
          {filtered.length > 0 ? (
            <div className="bks-table-scroll">
              <table className="bks-catalog-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Kind</th>
                    <th scope="col">Owner</th>
                    <th scope="col">System</th>
                    <th scope="col">Lifecycle</th>
                    <th scope="col"><span className="bks-sr-only">Health and actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(entity => (
                    <tr key={entity.id}>
                      <td>
                        <button
                          aria-label={`Open ${entity.title}`}
                          className="bks-entity-link"
                          onClick={() => onOpenEntity(entity)}
                          type="button"
                        >
                          <EntityKindMark compact entity={entity} />
                          <span>
                            <strong>{entity.name}</strong>
                            <small>{entity.description}</small>
                          </span>
                        </button>
                      </td>
                      <td><span className="bks-type-chip">{entity.kind}</span></td>
                      <td><button className="bks-cell-link" type="button">{entity.owner}</button></td>
                      <td>{entity.system ?? '—'}</td>
                      <td>{entity.lifecycle}</td>
                      <td>
                        <div className="bks-row-actions">
                          <HealthStatus health={entity.health} label={false} />
                          <button
                            aria-label={`${entity.starred ? 'Unstar' : 'Star'} ${entity.title}`}
                            className={entity.starred ? 'is-starred' : ''}
                            type="button"
                          >
                            {entity.starred ? '★' : '☆'}
                          </button>
                          <button aria-label={`More actions for ${entity.title}`} type="button">
                            <OperationalShowcaseIcon name="more" size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bks-empty-state">
              <OperationalShowcaseIcon name="search" size={28} />
              <h3>No catalog entities found</h3>
              <p>Try another query, kind, or ownership scope.</p>
              <button className="bks-button is-secondary" onClick={() => setQuery('')} type="button">
                Clear search
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  )
}

// Entity overview and plugin-style operational panels.
function AboutCard({ entity }: { entity: BackstageEntity }) {
  const properties = [
    ['Owner', entity.owner],
    ['System', entity.system ?? '—'],
    ['Domain', entity.domain ?? '—'],
    ['Type', entity.type],
    ['Lifecycle', entity.lifecycle],
  ]
  return (
    <section className="bks-card bks-about-card">
      <header>
        <h2>About</h2>
        <button aria-label="Edit catalog metadata" type="button">
          <OperationalShowcaseIcon name="more" size={19} />
        </button>
      </header>
      <p>{entity.description}</p>
      <dl>
        {properties.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <div className="bks-tag-list">
        {entity.tags.map(tag => <span key={tag}>{tag}</span>)}
      </div>
      <footer>
        {entity.repository && (
          <button type="button">
            <OperationalShowcaseIcon name="code" size={15} />
            View source
          </button>
        )}
        {entity.documentation && (
          <button type="button">
            <OperationalShowcaseIcon name="document" size={15} />
            View TechDocs
          </button>
        )}
      </footer>
    </section>
  )
}

function CicdCard({ entity }: { entity: BackstageEntity }) {
  return (
    <section className="bks-card bks-cicd-card">
      <header>
        <div>
          <h2>CI/CD</h2>
          <p>Latest workflow runs</p>
        </div>
        <span className="bks-status-chip is-success">
          <OperationalShowcaseIcon name="check" size={13} />
          Main is healthy
        </span>
      </header>
      <div className="bks-pipeline-row">
        <span className="is-success"><OperationalShowcaseIcon name="check" size={14} /></span>
        <div>
          <strong>Build and verify</strong>
          <small>main · 4f23d8a · Jun</small>
        </div>
        <time>8 min ago</time>
      </div>
      <div className="bks-pipeline-row">
        <span className="is-success"><OperationalShowcaseIcon name="check" size={14} /></span>
        <div>
          <strong>Deploy production</strong>
          <small>{entity.name} · us-west-2</small>
        </div>
        <time>12 min ago</time>
      </div>
      <div className="bks-coverage">
        <div>
          <span>Test coverage</span>
          <strong>{entity.coverage ?? 90}%</strong>
        </div>
        <div><span style={{ width: `${entity.coverage ?? 90}%` }} /></div>
      </div>
    </section>
  )
}

function TopologyNode({
  entity,
  relation,
  onOpen,
}: {
  entity: BackstageEntity
  relation: string
  onOpen: (entity: BackstageEntity) => void
}) {
  return (
    <button className="bks-topology-node" onClick={() => onOpen(entity)} type="button">
      <EntityKindMark compact entity={entity} />
      <span>
        <small>{relation} · {entity.kind}</small>
        <strong>{entity.title}</strong>
        <em>{entity.owner}</em>
      </span>
      <HealthStatus health={entity.health} label={false} />
    </button>
  )
}

function TopologyCard({
  entities,
  entity,
  onOpen,
  expanded = false,
}: {
  entities: readonly BackstageEntity[]
  entity: BackstageEntity
  onOpen: (entity: BackstageEntity) => void
  expanded?: boolean
}) {
  const relations = resolveBackstageRelations(entities, entity)
  const uniqueEntities = (candidates: readonly BackstageEntity[]) => [
    ...new Map(candidates.map(candidate => [candidate.id, candidate])).values(),
  ]
  const upstream = uniqueEntities([
    ...relations.upstream,
    ...entities.filter(candidate => entity.consumesApis?.includes(candidate.id)),
  ])
  const downstream = uniqueEntities([
    ...relations.downstream,
    ...entities.filter(candidate => (
      candidate.consumesApis?.some(api => entity.providesApis?.includes(api))
    )),
  ])

  return (
    <section className={`bks-card bks-topology-card${expanded ? ' is-expanded' : ''}`}>
      <header>
        <div>
          <h2>{expanded ? 'System topology' : 'Dependencies'}</h2>
          <p>Catalog relationships around this entity</p>
        </div>
        <span>{upstream.length + downstream.length} relations</span>
      </header>
      <div className="bks-topology" aria-label={`Topology for ${entity.title}`}>
        <div className="bks-topology__column">
          <small>Depends on</small>
          {upstream.length > 0
            ? upstream.map(candidate => (
                <TopologyNode
                  entity={candidate}
                  key={candidate.id}
                  onOpen={onOpen}
                  relation="upstream"
                />
              ))
            : <span className="bks-no-relations">No upstream relations</span>}
        </div>
        <div className="bks-topology__connector" aria-hidden="true"><span>→</span></div>
        <div className="bks-topology__center">
          <TopologyNode entity={entity} onOpen={onOpen} relation="selected" />
        </div>
        <div className="bks-topology__connector" aria-hidden="true"><span>→</span></div>
        <div className="bks-topology__column">
          <small>Depended on by</small>
          {downstream.length > 0
            ? downstream.map(candidate => (
                <TopologyNode
                  entity={candidate}
                  key={candidate.id}
                  onOpen={onOpen}
                  relation="downstream"
                />
              ))
            : <span className="bks-no-relations">No downstream relations</span>}
        </div>
      </div>
      <footer>
        <span>
          <OperationalShowcaseIcon name="layers" size={15} />
          System: {entity.system ?? 'Unassigned'}
        </span>
        <span>
          <OperationalShowcaseIcon name="people" size={15} />
          Owner: {entity.owner}
        </span>
        <span>
          <OperationalShowcaseIcon name="activity" size={15} />
          Live telemetry is supplied by host plugins
        </span>
      </footer>
    </section>
  )
}

function EntityOverview({
  entities,
  entity,
  onOpen,
}: {
  entities: readonly BackstageEntity[]
  entity: BackstageEntity
  onOpen: (entity: BackstageEntity) => void
}) {
  return (
    <div className="bks-entity-grid">
      <AboutCard entity={entity} />
      <CicdCard entity={entity} />
      <section className="bks-card bks-links-card">
        <header><h2>Quick links</h2></header>
        <div>
          {[
            ['Production', 'https://app.example.com', 'globe'],
            ['Service dashboard', 'Healthy · 99.98%', 'activity'],
            ['API definition', `${entity.providesApis?.length ?? 0} provided`, 'code'],
            ['On-call schedule', 'Platform Experience', 'calendar'],
          ].map(([title, subtitle, icon]) => (
            <button key={title} type="button">
              <OperationalShowcaseIcon name={icon as OperationalShowcaseIconName} size={18} />
              <span><strong>{title}</strong><small>{subtitle}</small></span>
              <OperationalShowcaseIcon name="chevron-right" size={15} />
            </button>
          ))}
        </div>
      </section>
      <TopologyCard entities={entities} entity={entity} onOpen={onOpen} />
    </div>
  )
}

function CicdPanel({ entity }: { entity: BackstageEntity }) {
  const runs = [
    ['Build and verify', 'main · 4f23d8a', 'Succeeded', '8 min ago', '3m 14s'],
    ['Deploy production', 'production · 4f23d8a', 'Succeeded', '12 min ago', '1m 48s'],
    ['Dependency review', 'renovate/node-22', 'Succeeded', '2 hr ago', '48s'],
    ['Preview environment', 'feature/catalog-search', 'Running', 'Now', '2m 06s'],
  ] as const
  return (
    <div className="bks-detail-grid">
      <section className="bks-card bks-run-list">
        <header><div><h2>Recent workflow runs</h2><p>{entity.repository}</p></div></header>
        {runs.map(run => (
          <button key={`${run[0]}-${run[1]}`} type="button">
            <span className={run[2] === 'Running' ? 'is-running' : 'is-success'}>
              <OperationalShowcaseIcon name={run[2] === 'Running' ? 'refresh' : 'check'} size={15} />
            </span>
            <span><strong>{run[0]}</strong><small>{run[1]}</small></span>
            <em>{run[2]}</em>
            <time>{run[3]} · {run[4]}</time>
            <OperationalShowcaseIcon name="chevron-right" size={16} />
          </button>
        ))}
      </section>
      <section className="bks-card bks-environments">
        <header><h2>Environments</h2></header>
        {[
          ['Production', 'us-west-2', '6/6', 'Healthy'],
          ['Staging', 'us-west-2', '2/2', 'Healthy'],
          ['Preview', 'ephemeral', '1/1', 'Updating'],
        ].map(environment => (
          <div key={environment[0]}>
            <span className={environment[3] === 'Healthy' ? 'is-healthy' : 'is-updating'} />
            <span><strong>{environment[0]}</strong><small>{environment[1]}</small></span>
            <span><strong>{environment[2]}</strong><small>replicas</small></span>
          </div>
        ))}
      </section>
    </div>
  )
}

function ApiPanel({
  entities,
  entity,
  onOpen,
}: {
  entities: readonly BackstageEntity[]
  entity: BackstageEntity
  onOpen: (entity: BackstageEntity) => void
}) {
  const apiIds = [...(entity.providesApis ?? []), ...(entity.consumesApis ?? [])]
  const apis = apiIds
    .map(id => entities.find(candidate => candidate.id === id))
    .filter((candidate): candidate is BackstageEntity => Boolean(candidate))
  return (
    <section className="bks-card bks-api-panel">
      <header>
        <div><h2>API relationships</h2><p>Contracts provided and consumed by {entity.name}</p></div>
        <button className="bks-button is-secondary" type="button">View full definition</button>
      </header>
      {apis.length > 0 ? apis.map(api => {
        const provided = entity.providesApis?.includes(api.id)
        return (
          <button key={api.id} onClick={() => onOpen(api)} type="button">
            <EntityKindMark entity={api} />
            <span>
              <small>{provided ? 'Provides' : 'Consumes'} · {api.type}</small>
              <strong>{api.title}</strong>
              <p>{api.description}</p>
              <em>{api.owner} · {api.lifecycle}</em>
            </span>
            <OperationalShowcaseIcon name="chevron-right" size={18} />
          </button>
        )
      }) : (
        <div className="bks-empty-state">
          <OperationalShowcaseIcon name="code" size={28} />
          <h3>No API relationships</h3>
          <p>Add API entity relations in host-provided catalog metadata.</p>
        </div>
      )}
    </section>
  )
}

function KubernetesPanel({ entity }: { entity: BackstageEntity }) {
  return (
    <div className="bks-kubernetes-grid">
      <section className="bks-card bks-kubernetes-summary">
        <header>
          <div><h2>Kubernetes</h2><p>Workloads associated through host annotations</p></div>
          <HealthStatus health={entity.health} />
        </header>
        <div>
          <span><strong>2</strong><small>clusters</small></span>
          <span><strong>8</strong><small>pods</small></span>
          <span><strong>2</strong><small>services</small></span>
          <span><strong>0</strong><small>failed</small></span>
        </div>
      </section>
      {[
        ['production-us-west-2', 'production', '6 / 6 pods ready', 'v2026.07.26'],
        ['staging-us-west-2', 'staging', '2 / 2 pods ready', '4f23d8a'],
      ].map(cluster => (
        <section className="bks-card bks-cluster-card" key={cluster[0]}>
          <header>
            <span className="is-healthy" />
            <div><h3>{cluster[0]}</h3><p>{cluster[1]}</p></div>
            <span>Healthy</span>
          </header>
          <dl>
            <div><dt>Workload</dt><dd>{entity.name}</dd></div>
            <div><dt>Readiness</dt><dd>{cluster[2]}</dd></div>
            <div><dt>Image</dt><dd>{cluster[3]}</dd></div>
            <div><dt>CPU / memory</dt><dd>18% / 42%</dd></div>
          </dl>
          <footer><button type="button">View workload</button><button type="button">Open logs</button></footer>
        </section>
      ))}
    </div>
  )
}

// Entity page composition.
function BackstageEntityPage({
  entities,
  entity,
  tab,
  setTab,
  onBack,
  onOpen,
}: {
  entities: readonly BackstageEntity[]
  entity: BackstageEntity
  tab: BackstageEntityTab
  setTab: (tab: BackstageEntityTab) => void
  onBack: () => void
  onOpen: (entity: BackstageEntity) => void
}) {
  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? ENTITY_TABS.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + ENTITY_TABS.length) % ENTITY_TABS.length
    setTab(ENTITY_TABS[nextIndex].id)
    document.getElementById(`bks-tab-${ENTITY_TABS[nextIndex].id}`)?.focus()
  }

  return (
    <>
      <header className="bks-entity-hero">
        <div className="bks-entity-breadcrumbs">
          <button onClick={onBack} type="button">Catalog</button>
          <OperationalShowcaseIcon name="chevron-right" size={16} />
          <span>{entity.kind}</span>
          <OperationalShowcaseIcon name="chevron-right" size={16} />
          <strong>{entity.name}</strong>
        </div>
        <div className="bks-entity-title">
          <EntityKindMark entity={entity} />
          <div>
            <span>{entity.kind} · {entity.type}</span>
            <h1>{entity.name}</h1>
            <p>{entity.description}</p>
          </div>
          <div className="bks-entity-title__metadata">
            <span><small>Owner</small><strong>{entity.owner}</strong></span>
            <span><small>Lifecycle</small><strong>{entity.lifecycle}</strong></span>
            <HealthStatus health={entity.health} />
          </div>
        </div>
      </header>
      <div className="bks-entity-tabs" role="tablist" aria-label="Entity sections">
        {ENTITY_TABS.map((candidate, index) => (
          <button
            aria-controls="bks-entity-panel"
            aria-selected={tab === candidate.id}
            id={`bks-tab-${candidate.id}`}
            key={candidate.id}
            onClick={() => setTab(candidate.id)}
            onKeyDown={event => handleTabKey(event, index)}
            role="tab"
            tabIndex={tab === candidate.id ? 0 : -1}
            type="button"
          >
            {candidate.label}
            {candidate.id === 'kubernetes' && <span className="bks-tab-status" aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div
        aria-labelledby={`bks-tab-${tab}`}
        className="bks-entity-content"
        id="bks-entity-panel"
        role="tabpanel"
      >
        {tab === 'overview' && <EntityOverview entities={entities} entity={entity} onOpen={onOpen} />}
        {tab === 'ci-cd' && <CicdPanel entity={entity} />}
        {tab === 'apis' && <ApiPanel entities={entities} entity={entity} onOpen={onOpen} />}
        {tab === 'dependencies' && (
          <TopologyCard entities={entities} entity={entity} expanded onOpen={onOpen} />
        )}
        {tab === 'kubernetes' && <KubernetesPanel entity={entity} />}
      </div>
    </>
  )
}

// Software Templates and the visual-only scaffolder workflow.
function BackstageCreate({
  templates,
  selectedTemplateId,
  setSelectedTemplateId,
  onCreate,
}: {
  templates: readonly BackstageTemplate[]
  selectedTemplateId?: string
  setSelectedTemplateId: (id: string | undefined) => void
  onCreate?: (template: BackstageTemplate) => void
}) {
  const selected = templates.find(template => template.id === selectedTemplateId)
  return (
    <>
      <PageHero
        eyebrow="Software Templates"
        title={selected ? selected.title : 'Create a new component'}
        description={selected
          ? 'Complete the host-defined fields, review the generated plan, and submit the task.'
          : 'Start from an approved golden path and keep ownership, docs, CI, and catalog metadata consistent.'}
        tone="violet"
        actions={selected
          ? <button className="bks-button is-ghost" onClick={() => setSelectedTemplateId(undefined)} type="button">Back to templates</button>
          : <button className="bks-button is-ghost" type="button">Register existing component</button>}
      />
      {!selected ? (
        <div className="bks-create-page">
          <div className="bks-create-toolbar">
            <label className="bks-search-field">
              <OperationalShowcaseIcon name="search" size={18} />
              <span className="bks-sr-only">Search templates</span>
              <input aria-label="Search templates" placeholder="Search templates" type="search" />
            </label>
            <span>{templates.length} templates</span>
          </div>
          <div className="bks-template-grid">
            {templates.map(template => (
              <article className="bks-template-card" key={template.id}>
                <div className="bks-template-card__icon">
                  <OperationalShowcaseIcon name={template.icon} size={27} />
                </div>
                <div className="bks-template-card__body">
                  <span>{template.type}</span>
                  <h2>{template.title}</h2>
                  <p>{template.description}</p>
                  <div>{template.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                  <small>Owned by {template.owner}</small>
                </div>
                <button
                  aria-label={`Choose ${template.title}`}
                  className="bks-button is-primary"
                  onClick={() => setSelectedTemplateId(template.id)}
                  type="button"
                >
                  Choose
                </button>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="bks-scaffolder-page">
          <nav aria-label="Template steps">
            {selected.steps.map((step, index) => (
              <div className={index === 0 ? 'is-active' : ''} key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </nav>
          <form
            className="bks-scaffolder-form"
            onSubmit={event => {
              event.preventDefault()
              onCreate?.(selected)
            }}
          >
            <header>
              <span>Step 1 of {selected.steps.length}</span>
              <h2>Service details</h2>
              <p>These values become catalog metadata and are passed to the host-owned scaffolder.</p>
            </header>
            <label>
              <span>Name</span>
              <input defaultValue="customer-insights" name="name" required />
              <small>Unique catalog name using lowercase letters and hyphens.</small>
            </label>
            <label>
              <span>Description</span>
              <textarea defaultValue="Customer health and product adoption service." name="description" rows={3} />
            </label>
            <div className="bks-form-row">
              <label>
                <span>Owner</span>
                <select defaultValue="platform-experience" name="owner">
                  <option>platform-experience</option>
                  <option>product-engineering</option>
                  <option>data-platform</option>
                </select>
              </label>
              <label>
                <span>System</span>
                <select defaultValue="customer-platform" name="system">
                  <option>customer-platform</option>
                  <option>commerce</option>
                  <option>internal-platform</option>
                </select>
              </label>
            </div>
            <label>
              <span>Repository host</span>
              <select defaultValue="jim-technologies" name="repositoryHost">
                <option>jim-technologies</option>
              </select>
            </label>
            <footer>
              <button className="bks-button is-secondary" disabled type="button">Back</button>
              <button className="bks-button is-primary" type="submit">Review and create</button>
            </footer>
          </form>
          <aside aria-label="Selected template summary" className="bks-template-summary">
            <div className="bks-template-card__icon">
              <OperationalShowcaseIcon name={selected.icon} size={27} />
            </div>
            <span>{selected.type}</span>
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            <dl>
              <div><dt>Owner</dt><dd>{selected.owner}</dd></div>
              <div><dt>Actions</dt><dd>{selected.steps.length + 4}</dd></div>
              <div><dt>Publishes</dt><dd>Repository + catalog entity</dd></div>
            </dl>
            <small>Execution, secrets, policy, and repository publication are handled by the host application.</small>
          </aside>
        </div>
      )}
    </>
  )
}

// TechDocs composition.
function BackstageDocs({
  documents,
  selectedDocumentId,
  setSelectedDocumentId,
  companyName,
}: {
  documents: readonly BackstageDocument[]
  selectedDocumentId?: string
  setSelectedDocumentId: (id: string) => void
  companyName: string
}) {
  const selected = documents.find(document => document.id === selectedDocumentId) ?? documents[0]
  return (
    <>
      <PageHero
        eyebrow="TechDocs"
        title="Documentation"
        description={`Docs like code for ${companyName} services, systems, APIs, and runbooks.`}
        tone="blue"
      />
      <div className="bks-docs-page">
        <aside aria-label="Documentation sites" className="bks-docs-index">
          <label className="bks-search-field">
            <OperationalShowcaseIcon name="search" size={17} />
            <span className="bks-sr-only">Search documentation</span>
            <input aria-label="Search documentation" placeholder="Search docs" type="search" />
          </label>
          <h2>Documentation</h2>
          <nav aria-label="TechDocs sites">
            {documents.map(document => (
              <button
                className={document.id === selected?.id ? 'is-active' : ''}
                key={document.id}
                onClick={() => setSelectedDocumentId(document.id)}
                type="button"
              >
                <OperationalShowcaseIcon name="document" size={16} />
                <span><strong>{document.title}</strong><small>{document.owner}</small></span>
              </button>
            ))}
          </nav>
        </aside>
        {selected ? (
          <section className="bks-techdocs" aria-label={`${selected.title} documentation`}>
            <aside aria-label={`${selected.title} sections`}>
              <span>Contents</span>
              {selected.sections.map((section, index) => (
                <button className={index === 0 ? 'is-active' : ''} key={section} type="button">
                  {section}
                </button>
              ))}
            </aside>
            <article>
              <div className="bks-techdocs__breadcrumbs">
                Docs <span>/</span> {selected.title} <span>/</span> Overview
              </div>
              <h1>{selected.title}</h1>
              <p className="bks-techdocs__lead">{selected.description}</p>
              <div className="bks-techdocs__meta">
                <span><OperationalShowcaseIcon name="people" size={15} /> {selected.owner}</span>
                <span><OperationalShowcaseIcon name="clock" size={15} /> Updated {selected.updatedAt}</span>
              </div>
              <h2>Purpose</h2>
              <p>
                {selected.title} documents the service boundary, supported workflows, and
                operating expectations maintained by {selected.owner}. Source-controlled
                content is rendered here with host-provided ownership and catalog context.
              </p>
              <aside aria-label="Deployment guidance" className="bks-doc-callout">
                <OperationalShowcaseIcon name="help" size={20} />
                <div><strong>Before you deploy</strong><p>Confirm ownership, service-level objectives, runbooks, and rollback evidence.</p></div>
              </aside>
              <h2>Local development</h2>
              <p>Start the service through the repository-owned development environment:</p>
              <pre><code>flox activate -- pnpm dev</code><button aria-label="Copy local development command" type="button">Copy</button></pre>
              <h2>Architecture</h2>
              <ul>
                <li>Catalog relationships identify upstream and downstream dependencies.</li>
                <li>Plugin views attach deployment and operational context to the entity.</li>
                <li>Documentation metadata links guidance to source, ownership, and lifecycle.</li>
              </ul>
              <footer>Generated from <button type="button">docs/index.md</button> · Owned by {selected.owner}</footer>
            </article>
          </section>
        ) : (
          <div className="bks-empty-state"><h2>No documentation sites</h2></div>
        )}
      </div>
    </>
  )
}

/**
 * Product-faithful Backstage developer-portal composition.
 *
 * This example only projects host-provided records and callbacks. Catalog
 * ingestion, permissions, search indexing, scaffolder execution, secrets,
 * Kubernetes discovery, and documentation publication remain host-owned.
 */
// Stateful showcase shell. Hosts can replace all sample data through props.
export function BackstageShowcase({
  entities: entityProp,
  templates: templateProp,
  documents: documentProp,
  initialView = 'catalog',
  initialEntityId = 'component.customer-gateway',
  initialEntityTab = 'overview',
  initialKind = 'Component',
  initialTemplateId,
  initialDocumentId = 'customer-gateway',
  companyName = CLONE_DEMO_IDENTITY.company,
  userName = CLONE_DEMO_IDENTITY.user,
  onSelectEntity,
  onCreateFromTemplate,
  onNavigate,
}: BackstageShowcaseProps) {
  const entities = entityProp ?? BACKSTAGE_SAMPLE_ENTITIES
  const templates = templateProp ?? BACKSTAGE_SAMPLE_TEMPLATES
  const documents = documentProp ?? BACKSTAGE_SAMPLE_DOCUMENTS
  const [view, setView] = useState<BackstageView>(initialView)
  const [selectedEntityId, setSelectedEntityId] = useState(initialEntityId)
  const [entityTab, setEntityTab] = useState<BackstageEntityTab>(initialEntityTab)
  const [kind, setKind] = useState<BackstageEntityKind | 'All'>(initialKind)
  const [catalogScope, setCatalogScope] = useState<BackstageCatalogScope>('all')
  const [catalogQuery, setCatalogQuery] = useState('')
  const [globalQuery, setGlobalQuery] = useState('')
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(initialTemplateId)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>(initialDocumentId)
  const selectedEntity = entities.find(entity => entity.id === selectedEntityId) ?? entities[0]

  useEffect(() => setView(initialView), [initialView])
  useEffect(() => setSelectedEntityId(initialEntityId), [initialEntityId])
  useEffect(() => setEntityTab(initialEntityTab), [initialEntityTab])
  useEffect(() => setKind(initialKind), [initialKind])
  useEffect(() => setSelectedTemplateId(initialTemplateId), [initialTemplateId])
  useEffect(() => setSelectedDocumentId(initialDocumentId), [initialDocumentId])

  function navigate(nextView: BackstageView) {
    setView(nextView)
    onNavigate?.(nextView)
  }

  function openEntity(entity: BackstageEntity) {
    setSelectedEntityId(entity.id)
    setEntityTab('overview')
    navigate('entity')
    onSelectEntity?.(entity)
  }

  function handlePrimaryNavigation(id: BackstageView | 'home' | 'apis') {
    if (id === 'apis') {
      setKind('API')
      setCatalogScope('all')
      navigate('catalog')
      return
    }
    if (id === 'catalog' || id === 'home') {
      setKind('Component')
      setCatalogScope('all')
      navigate('catalog')
      return
    }
    navigate(id)
  }

  return (
    <div
      className="backstage-showcase"
      data-product="spotify-backstage"
      data-view={view}
    >
      <aside aria-label="Backstage navigation" className="bks-sidebar">
        <BackstageBrand />
        <nav aria-label="Backstage primary">
          {BACKSTAGE_NAV.map((item, index) => {
            const active = item.id === 'apis'
              ? view === 'catalog' && kind === 'API'
              : item.id === 'catalog'
                ? (view === 'catalog' || view === 'entity') && kind !== 'API'
                : view === item.id
            return (
              <button
                aria-current={active ? 'page' : undefined}
                className={active ? 'is-active' : ''}
                key={`${item.label}-${index}`}
                onClick={() => handlePrimaryNavigation(item.id)}
                type="button"
              >
                <OperationalShowcaseIcon name={item.icon} size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="bks-sidebar__utilities">
          <button type="button">
            <OperationalShowcaseIcon name="help" size={20} />
            <span>Support</span>
          </button>
          <button type="button">
            <OperationalShowcaseIcon name="settings" size={20} />
            <span>Settings</span>
          </button>
        </div>
        <button className="bks-user" type="button">
          <OperationalShowcaseAvatar color="#7655c6" name={userName} size={32} />
          <span><strong>{userName}</strong><small>{CLONE_DEMO_IDENTITY.email}</small></span>
          <OperationalShowcaseIcon name="more" size={17} />
        </button>
      </aside>
      <main className="bks-main">
        <div className="bks-topbar">
          <form
            role="search"
            onSubmit={event => {
              event.preventDefault()
              setCatalogQuery(globalQuery)
              setKind('All')
              setCatalogScope('all')
              navigate('catalog')
            }}
          >
            <OperationalShowcaseIcon name="search" size={19} />
            <label>
              <span className="bks-sr-only">Search Backstage</span>
              <input
                aria-label="Search Backstage"
                onChange={event => setGlobalQuery(event.target.value)}
                placeholder="Search catalog, documentation, and tools"
                type="search"
                value={globalQuery}
              />
            </label>
            <kbd>/</kbd>
          </form>
          <span className="bks-environment">Production</span>
          <button aria-label="Notifications" type="button">
            <OperationalShowcaseIcon name="bell" size={19} />
            <span aria-hidden="true" />
          </button>
          <button aria-label="Help" type="button"><OperationalShowcaseIcon name="help" size={19} /></button>
          <OperationalShowcaseAvatar color="#7655c6" name={userName} size={30} />
        </div>
        <div className="bks-page">
          {view === 'catalog' && (
            <BackstageCatalog
              entities={entities}
              kind={kind}
              onCreate={() => navigate('create')}
              onOpenEntity={openEntity}
              query={catalogQuery}
              scope={catalogScope}
              setKind={setKind}
              setQuery={setCatalogQuery}
              setScope={setCatalogScope}
              userOwner="platform-experience"
            />
          )}
          {view === 'entity' && selectedEntity && (
            <BackstageEntityPage
              entities={entities}
              entity={selectedEntity}
              onBack={() => navigate('catalog')}
              onOpen={openEntity}
              setTab={setEntityTab}
              tab={entityTab}
            />
          )}
          {view === 'create' && (
            <BackstageCreate
              onCreate={onCreateFromTemplate}
              selectedTemplateId={selectedTemplateId}
              setSelectedTemplateId={setSelectedTemplateId}
              templates={templates}
            />
          )}
          {view === 'docs' && (
            <BackstageDocs
              companyName={companyName}
              documents={documents}
              selectedDocumentId={selectedDocumentId}
              setSelectedDocumentId={setSelectedDocumentId}
            />
          )}
        </div>
      </main>
    </div>
  )
}
