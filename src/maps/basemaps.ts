import type { StyleSpecification } from 'maplibre-gl'

export interface BasemapPresetDefinition {
  id: string
  label: string
  provider: string
  description: string
  style_url: string | null
  network: boolean
  documentation_url?: string
  self_hostable: boolean
}

// Curated, no-key public styles with a self-hosting path. These are opt-in:
// the default stays network-free, and untrusted Dashboard templates must
// explicitly allow the corresponding preset in TemplateTrustPolicy.
export const BASEMAP_PRESETS = {
  analytical: {
    id: 'analytical',
    label: 'Analytical grid',
    provider: 'Built-in',
    description: 'Network-free coordinate grid for private operational overlays.',
    style_url: null,
    network: false,
    self_hostable: true,
  },
  'openfreemap-dark': {
    id: 'openfreemap-dark',
    label: 'OpenFreeMap Dark',
    provider: 'OpenFreeMap',
    description: 'Dark general-purpose OpenStreetMap basemap.',
    style_url: 'https://tiles.openfreemap.org/styles/dark',
    network: true,
    documentation_url: 'https://openfreemap.org/quick_start/',
    self_hostable: true,
  },
  'openfreemap-liberty': {
    id: 'openfreemap-liberty',
    label: 'OpenFreeMap Liberty',
    provider: 'OpenFreeMap',
    description: 'Balanced general-purpose OpenStreetMap basemap.',
    style_url: 'https://tiles.openfreemap.org/styles/liberty',
    network: true,
    documentation_url: 'https://openfreemap.org/quick_start/',
    self_hostable: true,
  },
  'openfreemap-positron': {
    id: 'openfreemap-positron',
    label: 'OpenFreeMap Positron',
    provider: 'OpenFreeMap',
    description: 'Low-contrast light basemap for data-heavy overlays.',
    style_url: 'https://tiles.openfreemap.org/styles/positron',
    network: true,
    documentation_url: 'https://openfreemap.org/quick_start/',
    self_hostable: true,
  },
  'versatiles-eclipse': {
    id: 'versatiles-eclipse',
    label: 'VersaTiles Eclipse',
    provider: 'VersaTiles',
    description: 'Dark OpenStreetMap basemap from the VersaTiles public stack.',
    style_url: 'https://tiles.versatiles.org/assets/styles/eclipse/style.json',
    network: true,
    documentation_url: 'https://docs.versatiles.org/guides/use_tiles_versatiles_org',
    self_hostable: true,
  },
  'versatiles-graybeard': {
    id: 'versatiles-graybeard',
    label: 'VersaTiles Graybeard',
    provider: 'VersaTiles',
    description: 'Neutral grayscale OpenStreetMap basemap for dense overlays.',
    style_url: 'https://tiles.versatiles.org/assets/styles/graybeard/style.json',
    network: true,
    documentation_url: 'https://docs.versatiles.org/guides/use_tiles_versatiles_org',
    self_hostable: true,
  },
} as const satisfies Record<string, BasemapPresetDefinition>

export type BasemapPresetId = keyof typeof BASEMAP_PRESETS

export const BASEMAP_PRESET_IDS = Object.freeze(
  Object.keys(BASEMAP_PRESETS) as BasemapPresetId[],
)

export interface PresetBasemapConfig {
  kind: 'preset'
  preset: BasemapPresetId
}

export interface StyleBasemapConfig {
  // Any host-controlled MapLibre Style Specification endpoint. This is the
  // common denominator for hosted providers and self-hosted vector maps.
  kind: 'style'
  url: string
}

export interface RasterBasemapConfig {
  // Generic XYZ/TMS tiles are normalized into a MapLibre style internally,
  // so raster providers use the same renderer and overlay path.
  kind: 'raster'
  tiles: string | string[]
  attribution?: string
  tile_size?: 256 | 512
  min_zoom?: number
  max_zoom?: number
  scheme?: 'xyz' | 'tms'
}

export type BasemapConfig =
  | BasemapPresetId
  | PresetBasemapConfig
  | StyleBasemapConfig
  | RasterBasemapConfig

interface NormalizedBasemapBase {
  id: string
  provider: string
  network: boolean
  cache_key: string
  preset?: BasemapPresetId
}

export interface NormalizedAnalyticalBasemap extends NormalizedBasemapBase {
  kind: 'analytical'
  network: false
}

export interface NormalizedStyleBasemap extends NormalizedBasemapBase {
  kind: 'style'
  network: true
  style_url: string
}

export interface NormalizedRasterBasemap extends NormalizedBasemapBase {
  kind: 'raster'
  network: true
  tiles: string[]
  attribution?: string
  tile_size: 256 | 512
  min_zoom: number
  max_zoom: number
  scheme: 'xyz' | 'tms'
}

export type NormalizedBasemap =
  | NormalizedAnalyticalBasemap
  | NormalizedStyleBasemap
  | NormalizedRasterBasemap

export type MapLibreBasemapStyle = string | StyleSpecification

export function isBasemapPresetId(value: string): value is BasemapPresetId {
  return Object.prototype.hasOwnProperty.call(BASEMAP_PRESETS, value)
}

// Converts every public configuration form into one renderer-neutral internal
// contract. GeoMap only consumes this result; it has no OpenFreeMap,
// VersaTiles, or raster-provider branches of its own.
export function normalizeBasemap(
  config?: unknown,
  legacyStyleUrl?: unknown,
): NormalizedBasemap {
  if (config != null && legacyStyleUrl != null) {
    throw new Error('geo_map options.basemap and options.style_url are mutually exclusive')
  }

  if (config == null && legacyStyleUrl != null) {
    if (typeof legacyStyleUrl !== 'string' || !legacyStyleUrl.trim()) {
      throw new Error('geo_map options.style_url must be a non-empty string')
    }
    return styleBasemap(legacyStyleUrl.trim(), 'legacy-style')
  }

  if (config == null) return presetBasemap('analytical')

  if (typeof config === 'string') {
    if (!isBasemapPresetId(config)) {
      throw new Error(
        `unknown basemap preset ${JSON.stringify(config)}; expected one of ${BASEMAP_PRESET_IDS.join(', ')}`,
      )
    }
    return presetBasemap(config)
  }

  if (!isRecord(config) || typeof config.kind !== 'string') {
    throw new Error('geo_map options.basemap must be a preset name or basemap configuration object')
  }

  if (config.kind === 'preset') {
    if (typeof config.preset !== 'string' || !isBasemapPresetId(config.preset)) {
      throw new Error(
        `unknown basemap preset ${JSON.stringify(config.preset)}; expected one of ${BASEMAP_PRESET_IDS.join(', ')}`,
      )
    }
    return presetBasemap(config.preset)
  }

  if (config.kind === 'style') {
    if (typeof config.url !== 'string' || !config.url.trim()) {
      throw new Error('style basemap url must be a non-empty string')
    }
    return styleBasemap(config.url.trim(), 'custom-style')
  }

  if (config.kind === 'raster') return normalizeRasterBasemap(config)

  throw new Error(
    `unknown basemap kind ${JSON.stringify(config.kind)}; expected "preset", "style", or "raster"`,
  )
}

export function basemapNetworkUrls(basemap: NormalizedBasemap): string[] {
  if (basemap.kind === 'style') return [basemap.style_url]
  if (basemap.kind === 'raster') return [...basemap.tiles]
  return []
}

export function basemapStyle(
  basemap: NormalizedBasemap,
  backgroundColor = '#0a0d10',
): MapLibreBasemapStyle {
  if (basemap.kind === 'style') return basemap.style_url
  if (basemap.kind === 'raster') return rasterStyle(basemap, backgroundColor)
  return analyticalStyle(backgroundColor)
}

function presetBasemap(id: BasemapPresetId): NormalizedBasemap {
  const preset = BASEMAP_PRESETS[id]
  if (!preset.style_url) {
    return {
      id,
      kind: 'analytical',
      provider: preset.provider,
      network: false,
      cache_key: `preset:${id}`,
      preset: id,
    }
  }
  return {
    id,
    kind: 'style',
    provider: preset.provider,
    network: true,
    style_url: preset.style_url,
    cache_key: `preset:${id}`,
    preset: id,
  }
}

function styleBasemap(url: string, id: string): NormalizedStyleBasemap {
  return {
    id,
    kind: 'style',
    provider: 'custom',
    network: true,
    style_url: url,
    cache_key: `style:${url}`,
  }
}

function normalizeRasterBasemap(config: Record<string, unknown>): NormalizedRasterBasemap {
  const tiles = typeof config.tiles === 'string'
    ? [config.tiles]
    : Array.isArray(config.tiles)
      ? config.tiles
      : []
  if (
    tiles.length === 0 ||
    tiles.some(tile => typeof tile !== 'string' || !tile.trim())
  ) {
    throw new Error('raster basemap tiles must be a non-empty URL string or string array')
  }

  const tileSize = config.tile_size ?? 256
  if (tileSize !== 256 && tileSize !== 512) {
    throw new Error('raster basemap tile_size must be 256 or 512')
  }

  const minZoom = optionalZoom(config.min_zoom, 0, 'min_zoom')
  const maxZoom = optionalZoom(config.max_zoom, 22, 'max_zoom')
  if (minZoom > maxZoom) {
    throw new Error('raster basemap min_zoom must be less than or equal to max_zoom')
  }

  const scheme = config.scheme ?? 'xyz'
  if (scheme !== 'xyz' && scheme !== 'tms') {
    throw new Error('raster basemap scheme must be "xyz" or "tms"')
  }

  if (config.attribution != null && typeof config.attribution !== 'string') {
    throw new Error('raster basemap attribution must be a string')
  }

  const normalizedTiles = tiles.map(tile => (tile as string).trim())
  const attribution = typeof config.attribution === 'string'
    ? config.attribution.trim()
    : undefined
  return {
    id: 'custom-raster',
    kind: 'raster',
    provider: 'custom',
    network: true,
    tiles: normalizedTiles,
    ...(attribution ? { attribution } : {}),
    tile_size: tileSize,
    min_zoom: minZoom,
    max_zoom: maxZoom,
    scheme,
    cache_key: JSON.stringify([
      'raster',
      normalizedTiles,
      attribution ?? '',
      tileSize,
      minZoom,
      maxZoom,
      scheme,
    ]),
  }
}

function optionalZoom(value: unknown, fallback: number, name: string): number {
  if (value == null) return fallback
  if (!Number.isInteger(value) || (value as number) < 0 || (value as number) > 24) {
    throw new Error(`raster basemap ${name} must be an integer from 0 to 24`)
  }
  return value as number
}

function analyticalStyle(backgroundColor: string): StyleSpecification {
  return {
    version: 8,
    sources: {},
    layers: [{
      id: 'mtc-background',
      type: 'background',
      paint: { 'background-color': backgroundColor },
    }],
  }
}

function rasterStyle(
  basemap: NormalizedRasterBasemap,
  backgroundColor: string,
): StyleSpecification {
  return {
    version: 8,
    sources: {
      'mtc-basemap-raster': {
        type: 'raster',
        tiles: basemap.tiles,
        tileSize: basemap.tile_size,
        minzoom: basemap.min_zoom,
        maxzoom: basemap.max_zoom,
        scheme: basemap.scheme,
        ...(basemap.attribution ? { attribution: basemap.attribution } : {}),
      },
    },
    layers: [
      {
        id: 'mtc-background',
        type: 'background',
        paint: { 'background-color': backgroundColor },
      },
      {
        id: 'mtc-basemap-raster',
        type: 'raster',
        source: 'mtc-basemap-raster',
        minzoom: basemap.min_zoom,
        maxzoom: basemap.max_zoom,
      },
    ],
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}
