import type { OperationalShowcaseIconName } from '../../shared/OperationalShowcasePrimitives'

export type BackstageView = 'catalog' | 'entity' | 'create' | 'docs'
export type BackstageEntityTab =
  | 'overview'
  | 'ci-cd'
  | 'apis'
  | 'dependencies'
  | 'kubernetes'
export type BackstageEntityKind =
  | 'Component'
  | 'API'
  | 'Resource'
  | 'System'
  | 'Domain'
  | 'Group'
export type BackstageEntityHealth = 'healthy' | 'warning' | 'error'
export type BackstageCatalogScope = 'owned' | 'starred' | 'all'

/**
 * Neutral software-catalog record projected by the Backstage showcase.
 * Discovery, authorization, and catalog persistence remain host concerns.
 */
export interface BackstageEntity {
  id: string
  name: string
  title: string
  kind: BackstageEntityKind
  type: string
  lifecycle: string
  owner: string
  system?: string
  domain?: string
  description: string
  tags: readonly string[]
  health: BackstageEntityHealth
  repository?: string
  documentation?: string
  coverage?: number
  starred?: boolean
  dependsOn?: readonly string[]
  providesApis?: readonly string[]
  consumesApis?: readonly string[]
}

/**
 * Host-provided self-service template presented by the Software Templates view.
 * The showcase never executes these steps.
 */
export interface BackstageTemplate {
  id: string
  title: string
  description: string
  owner: string
  type: string
  tags: readonly string[]
  steps: readonly string[]
  icon: OperationalShowcaseIconName
}

/**
 * Host-provided documentation entry used by the TechDocs composition.
 */
export interface BackstageDocument {
  id: string
  title: string
  entityId: string
  description: string
  owner: string
  updatedAt: string
  sections: readonly string[]
}

/**
 * Applies the local catalog projection used by the visual showcase.
 */
export function selectBackstageEntities(
  entities: readonly BackstageEntity[],
  query = '',
  options: {
    kind?: BackstageEntityKind | 'All'
    scope?: BackstageCatalogScope
    owner?: string
  } = {},
): BackstageEntity[] {
  const normalized = query.trim().toLowerCase()
  return entities.filter(entity => {
    if (options.kind && options.kind !== 'All' && entity.kind !== options.kind) return false
    if (options.scope === 'starred' && !entity.starred) return false
    if (options.scope === 'owned' && options.owner && entity.owner !== options.owner) return false
    if (!normalized) return true
    return [
      entity.name,
      entity.title,
      entity.kind,
      entity.type,
      entity.lifecycle,
      entity.owner,
      entity.system,
      entity.domain,
      entity.description,
      ...entity.tags,
    ].filter(Boolean).join(' ').toLowerCase().includes(normalized)
  })
}

/**
 * Resolves explicit catalog relationships without fetching or mutating host data.
 */
export function resolveBackstageRelations(
  entities: readonly BackstageEntity[],
  entity: BackstageEntity,
): { upstream: BackstageEntity[]; downstream: BackstageEntity[] } {
  const byId = new Map(entities.map(candidate => [candidate.id, candidate]))
  const upstream = (entity.dependsOn ?? [])
    .map(id => byId.get(id))
    .filter((candidate): candidate is BackstageEntity => Boolean(candidate))
  const downstream = entities.filter(candidate => candidate.dependsOn?.includes(entity.id))
  return { upstream, downstream }
}
