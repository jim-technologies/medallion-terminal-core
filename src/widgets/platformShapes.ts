// Normalizers for the platform-oriented canonical payloads. The
// Connect JSON mapping uses lowerCamelCase, while the reference backend
// and hand-authored templates historically use proto field names. These
// helpers accept both so widgets stay tolerant at the wire edge.

export interface AssetCatalogItem {
  id: string
  name: string
  kind: string
  description?: string
  owner?: string
  status?: string
  updatedAt?: string
  tags: string[]
  url?: string
  metadata: Record<string, unknown>
  context: Record<string, string>
}

export interface AssetCatalogData {
  items: AssetCatalogItem[]
  total?: number
  nextPageToken?: string
}

export interface ObjectProperty {
  key: string
  label: string
  value: unknown
  format?: string
  description?: string
  group?: string
}

export interface ObjectLink {
  relation: string
  targetType: string
  targetId: string
  label: string
  status?: string
  context: Record<string, string>
}

export interface ObjectAction {
  id: string
  label: string
  description?: string
  style?: string
  confirm: boolean
  params: Record<string, unknown>
  disabled: boolean
}

export interface ObjectData {
  objectType: string
  objectId: string
  title: string
  description?: string
  status?: string
  updatedAt?: string
  tags: string[]
  properties: ObjectProperty[]
  links: ObjectLink[]
  actions: ObjectAction[]
}

export interface GraphNodeData {
  id: string
  label: string
  kind?: string
  status?: string
  subtitle?: string
  tags: string[]
  metadata: Record<string, unknown>
  context: Record<string, string>
}

export interface GraphEdgeData {
  from: string
  to: string
  label?: string
  kind?: string
  status?: string
}

export interface GraphData {
  nodes: GraphNodeData[]
  edges: GraphEdgeData[]
}

export type RepositoryEntryKind = 'file' | 'directory' | 'symlink'

export interface RepositoryEntryData {
  path: string
  name: string
  kind: RepositoryEntryKind
  language?: string
  sizeBytes?: number
  updatedAt?: string
}

export interface RepositoryFileData {
  path: string
  content: string
  language?: string
  sizeBytes?: number
  truncated: boolean
  url?: string
}

export interface RepositoryData {
  repository: string
  ref: string
  path: string
  refs: string[]
  entries: RepositoryEntryData[]
  file?: RepositoryFileData
  url?: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function optionalString(value: unknown): string | undefined {
  return value == null || value === '' ? undefined : String(value)
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : []
}

function stringMap(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {}
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, entry]) => entry != null)
      .map(([key, entry]) => [key, String(entry)]),
  )
}

function record(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {}
}

function finiteNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

export function normalizeAssetCatalog(data: unknown): AssetCatalogData {
  const root = Array.isArray(data) ? { items: data } : record(data)
  const rawItems = Array.isArray(root.items) ? root.items : []
  const items = rawItems
    .filter(isRecord)
    .map((item): AssetCatalogItem => ({
      id: String(item.id ?? ''),
      name: String(item.name ?? item.id ?? ''),
      kind: String(item.kind ?? 'asset'),
      description: optionalString(item.description),
      owner: optionalString(item.owner),
      status: optionalString(item.status),
      updatedAt: optionalString(item.updatedAt ?? item.updated_at),
      tags: stringArray(item.tags),
      url: optionalString(item.url),
      metadata: record(item.metadata),
      context: stringMap(item.context),
    }))
    .filter((item) => item.id && item.name)

  return {
    items,
    total: finiteNumber(root.total),
    nextPageToken: optionalString(root.nextPageToken ?? root.next_page_token),
  }
}

export function normalizeObject(data: unknown): ObjectData | null {
  const root = record(data)
  const objectType = String(root.objectType ?? root.object_type ?? '')
  const objectId = String(root.objectId ?? root.object_id ?? '')
  const title = String(root.title ?? root.name ?? objectId)
  if (!objectType && !objectId && !title) return null

  const properties = (Array.isArray(root.properties) ? root.properties : [])
    .filter(isRecord)
    .map((property): ObjectProperty => ({
      key: String(property.key ?? ''),
      label: String(property.label ?? property.key ?? ''),
      value: property.value,
      format: optionalString(property.format),
      description: optionalString(property.description),
      group: optionalString(property.group),
    }))
    .filter((property) => property.key)

  const links = (Array.isArray(root.links) ? root.links : [])
    .filter(isRecord)
    .map((link): ObjectLink => ({
      relation: String(link.relation ?? ''),
      targetType: String(link.targetType ?? link.target_type ?? ''),
      targetId: String(link.targetId ?? link.target_id ?? ''),
      label: String(link.label ?? link.targetId ?? link.target_id ?? ''),
      status: optionalString(link.status),
      context: stringMap(link.context),
    }))
    .filter((link) => link.targetId)

  const actions = (Array.isArray(root.actions) ? root.actions : [])
    .filter(isRecord)
    .map((action): ObjectAction => ({
      id: String(action.id ?? ''),
      label: String(action.label ?? action.id ?? ''),
      description: optionalString(action.description),
      style: optionalString(action.style),
      confirm: action.confirm === true,
      params: record(action.params),
      disabled: action.disabled === true,
    }))
    .filter((action) => action.id)

  return {
    objectType,
    objectId,
    title,
    description: optionalString(root.description),
    status: optionalString(root.status),
    updatedAt: optionalString(root.updatedAt ?? root.updated_at),
    tags: stringArray(root.tags),
    properties,
    links,
    actions,
  }
}

export function normalizeGraph(data: unknown): GraphData | null {
  const root = record(data)
  if (!Array.isArray(root.nodes)) return null

  const nodes = root.nodes
    .filter(isRecord)
    .map((node): GraphNodeData => ({
      id: String(node.id ?? ''),
      label: String(node.label ?? node.id ?? ''),
      kind: optionalString(node.kind),
      status: optionalString(node.status),
      subtitle: optionalString(node.subtitle),
      tags: stringArray(node.tags),
      metadata: record(node.metadata),
      context: stringMap(node.context),
    }))
    .filter((node) => node.id)

  const edges = (Array.isArray(root.edges) ? root.edges : [])
    .filter(isRecord)
    .map((edge): GraphEdgeData => ({
      from: String(edge.from ?? ''),
      to: String(edge.to ?? ''),
      label: optionalString(edge.label),
      kind: optionalString(edge.kind),
      status: optionalString(edge.status),
    }))
    .filter((edge) => edge.from && edge.to)

  return nodes.length > 0 ? { nodes, edges } : null
}

function repositoryKind(value: unknown): RepositoryEntryKind {
  const normalized = String(value ?? '').toUpperCase()
  if (normalized === '2' || normalized === 'DIRECTORY' || normalized === 'DIR' ||
      normalized === 'REPOSITORY_ENTRY_KIND_DIRECTORY') {
    return 'directory'
  }
  if (normalized === '3' || normalized === 'SYMLINK' || normalized === 'REPOSITORY_ENTRY_KIND_SYMLINK') {
    return 'symlink'
  }
  // Numeric 1 and UNSPECIFIED/unknown values both safely render as files.
  return 'file'
}

export function normalizeRepository(data: unknown): RepositoryData | null {
  const root = record(data)
  const repository = String(root.repository ?? root.name ?? '')
  if (!repository && !Array.isArray(root.entries) && !isRecord(root.file)) return null

  const entries = (Array.isArray(root.entries) ? root.entries : [])
    .filter(isRecord)
    .map((entry): RepositoryEntryData => ({
      path: String(entry.path ?? entry.name ?? ''),
      name: String(entry.name ?? String(entry.path ?? '').split('/').pop() ?? ''),
      kind: repositoryKind(entry.kind),
      language: optionalString(entry.language),
      sizeBytes: finiteNumber(entry.sizeBytes ?? entry.size_bytes),
      updatedAt: optionalString(entry.updatedAt ?? entry.updated_at),
    }))
    .filter((entry) => entry.path && entry.name)

  const rawFile = isRecord(root.file) ? root.file : null
  const file = rawFile
    ? {
        path: String(rawFile.path ?? root.path ?? ''),
        content: String(rawFile.content ?? ''),
        language: optionalString(rawFile.language),
        sizeBytes: finiteNumber(rawFile.sizeBytes ?? rawFile.size_bytes),
        truncated: rawFile.truncated === true,
        url: optionalString(rawFile.url),
      }
    : undefined

  return {
    repository,
    ref: String(root.ref ?? ''),
    path: String(root.path ?? ''),
    refs: stringArray(root.refs),
    entries,
    file,
    url: optionalString(root.url),
  }
}
