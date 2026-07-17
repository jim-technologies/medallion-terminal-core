export type GeoPosition = [number, number, ...number[]]

export type GeoGeometry =
  | { type: 'Point'; coordinates: GeoPosition }
  | { type: 'MultiPoint'; coordinates: GeoPosition[] }
  | { type: 'LineString'; coordinates: GeoPosition[] }
  | { type: 'MultiLineString'; coordinates: GeoPosition[][] }
  | { type: 'Polygon'; coordinates: GeoPosition[][] }
  | { type: 'MultiPolygon'; coordinates: GeoPosition[][][] }

export interface GeoFeatureData {
  type: 'Feature'
  id: string
  geometry: GeoGeometry
  properties: Record<string, string | number | boolean | null>
}

export interface GeoFeatureCollection {
  type: 'FeatureCollection'
  features: GeoFeatureData[]
}

export type GeoBounds = [[number, number], [number, number]]

const GEOMETRY_TYPES = new Set<GeoGeometry['type']>([
  'Point',
  'MultiPoint',
  'LineString',
  'MultiLineString',
  'Polygon',
  'MultiPolygon',
])

// Accepts the canonical GeoPayload, a raw GeoJSON FeatureCollection/Feature,
// or table-like point rows with lat/lon fields. Every result is strict,
// transport-safe GeoJSON with normalized semantic properties for the map
// renderer.
export function normalizeGeoData(data: unknown): GeoFeatureCollection | null {
  const root = objectValue(data)
  const unwrapped = root.geo ?? root.geojson ?? data
  const object = objectValue(unwrapped)

  let rawFeatures: unknown[]
  if (object.type === 'FeatureCollection' && Array.isArray(object.features)) {
    rawFeatures = object.features
  } else if (object.type === 'Feature') {
    rawFeatures = [object]
  } else if (Array.isArray(object.features)) {
    rawFeatures = object.features
  } else if (Array.isArray(object.points)) {
    rawFeatures = object.points
  } else if (Array.isArray(object.rows)) {
    rawFeatures = object.rows
  } else if (Array.isArray(unwrapped)) {
    rawFeatures = unwrapped
  } else {
    return null
  }

  const features = rawFeatures
    .map((feature, index) => normalizeFeature(feature, index))
    .filter((feature): feature is GeoFeatureData => feature !== null)
  return features.length > 0 ? { type: 'FeatureCollection', features } : null
}

export function geoBounds(collection: GeoFeatureCollection): GeoBounds | null {
  let west = Infinity
  let south = Infinity
  let east = -Infinity
  let north = -Infinity
  for (const feature of collection.features) {
    forEachPosition(feature.geometry.coordinates, position => {
      west = Math.min(west, position[0])
      east = Math.max(east, position[0])
      south = Math.min(south, position[1])
      north = Math.max(north, position[1])
    })
  }
  if (![west, south, east, north].every(Number.isFinite)) return null
  return [[west, south], [east, north]]
}

export function geoFeatureContext(feature: GeoFeatureData): Record<string, string> {
  const encoded = feature.properties._mtc_context
  if (typeof encoded !== 'string') return {}
  try {
    const parsed = JSON.parse(encoded)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>)
        .filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
    )
  } catch {
    return {}
  }
}

export function geoFeatureLabel(feature: GeoFeatureData): string {
  const label = feature.properties._mtc_label
  return typeof label === 'string' && label !== '' ? label : feature.id
}

function normalizeFeature(raw: unknown, index: number): GeoFeatureData | null {
  const item = objectValue(raw)
  const rawProperties = objectValue(item.properties)
  const geometry = normalizeGeometry(item.geometry) ?? pointGeometry(item)
  if (!geometry) return null

  const id = String(
    item.id ??
    rawProperties.id ??
    rawProperties.feature_id ??
    rawProperties.object_id ??
    `feature-${index + 1}`,
  )
  const label = firstString(
    item.label,
    item.name,
    rawProperties.label,
    rawProperties.name,
    rawProperties.title,
    id,
  )
  const status = firstString(item.status, rawProperties.status)
  const value = finiteNumber(item.value ?? rawProperties.value)
  const context = {
    ...stringRecord(rawProperties.context),
    ...stringRecord(item.context),
  }
  const metadata = {
    ...objectValue(rawProperties.metadata),
    ...objectValue(item.metadata),
  }

  const properties: GeoFeatureData['properties'] = {
    ...scalarProperties(rawProperties),
    ...scalarProperties(metadata),
    _mtc_id: id,
    _mtc_label: label,
    _mtc_tone: semanticTone(status),
    ...(status && { _mtc_status: status }),
    ...(value !== undefined && { _mtc_value: value }),
    _mtc_context: JSON.stringify(context),
  }

  return { type: 'Feature', id, geometry, properties }
}

function normalizeGeometry(raw: unknown): GeoGeometry | null {
  const geometry = objectValue(raw)
  const type = geometry.type
  if (typeof type !== 'string' || !GEOMETRY_TYPES.has(type as GeoGeometry['type'])) return null
  if (!validCoordinates(type as GeoGeometry['type'], geometry.coordinates)) return null
  return {
    type,
    coordinates: geometry.coordinates,
  } as GeoGeometry
}

function pointGeometry(item: Record<string, unknown>): GeoGeometry | null {
  const latitude = finiteNumber(item.latitude ?? item.lat)
  const longitude = finiteNumber(item.longitude ?? item.lng ?? item.lon)
  if (latitude === undefined || longitude === undefined) return null
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null
  return { type: 'Point', coordinates: [longitude, latitude] }
}

function validCoordinates(type: GeoGeometry['type'], raw: unknown): boolean {
  const depths: Record<GeoGeometry['type'], number> = {
    Point: 0,
    MultiPoint: 1,
    LineString: 1,
    MultiLineString: 2,
    Polygon: 2,
    MultiPolygon: 3,
  }
  return coordinateDepth(raw, depths[type])
}

function coordinateDepth(raw: unknown, depth: number): boolean {
  if (depth === 0) {
    if (!Array.isArray(raw) || raw.length < 2) return false
    const longitude = Number(raw[0])
    const latitude = Number(raw[1])
    return Number.isFinite(longitude) && Number.isFinite(latitude) &&
      longitude >= -180 && longitude <= 180 &&
      latitude >= -90 && latitude <= 90
  }
  return Array.isArray(raw) && raw.length > 0 &&
    raw.every(value => coordinateDepth(value, depth - 1))
}

function forEachPosition(raw: unknown, visit: (position: GeoPosition) => void) {
  if (!Array.isArray(raw)) return
  if (raw.length >= 2 && typeof raw[0] === 'number' && typeof raw[1] === 'number') {
    visit(raw as GeoPosition)
    return
  }
  for (const value of raw) forEachPosition(value, visit)
}

function semanticTone(status?: string): 'ok' | 'warn' | 'danger' | 'info' | 'neutral' {
  switch (status?.toLowerCase()) {
    case 'ok':
    case 'healthy':
    case 'active':
    case 'online':
    case 'complete':
    case 'completed':
      return 'ok'
    case 'warn':
    case 'warning':
    case 'delayed':
    case 'degraded':
    case 'pending':
      return 'warn'
    case 'error':
    case 'failed':
    case 'offline':
    case 'critical':
    case 'danger':
      return 'danger'
    case 'info':
    case 'running':
    case 'selected':
      return 'info'
    default:
      return 'neutral'
  }
}

function scalarProperties(value: Record<string, unknown>): GeoFeatureData['properties'] {
  return Object.fromEntries(
    Object.entries(value).filter(
      (entry): entry is [string, string | number | boolean | null] =>
        entry[1] === null ||
        typeof entry[1] === 'string' ||
        typeof entry[1] === 'number' ||
        typeof entry[1] === 'boolean',
    ),
  )
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {}
}

function stringRecord(value: unknown): Record<string, string> {
  const record = objectValue(value)
  return Object.fromEntries(
    Object.entries(record).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string',
    ),
  )
}

function finiteNumber(value: unknown): number | undefined {
  const number = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(number) ? number : undefined
}

function firstString(...values: unknown[]): string {
  return values.find(value => typeof value === 'string' && value !== '') as string
}
