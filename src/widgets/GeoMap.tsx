import { useEffect, useMemo, useRef, useState } from 'react'
import type {
  GeoJSONSource,
  Map as MapLibreMap,
  MapLayerMouseEvent,
} from 'maplibre-gl'
import { useDashboard } from '../core/DashboardContext'
import {
  basemapStyle,
  normalizeBasemap,
  type BasemapConfig,
} from '../maps/basemaps'
import type { WidgetProps } from '../types/template'
import {
  geoBounds,
  geoFeatureContext,
  geoFeatureLabel,
  normalizeGeoData,
  type GeoFeatureCollection,
  type GeoFeatureData,
} from './geoShape'
import { Empty } from './states'

export interface GeoMapOptions {
  // Canonical swappable basemap contract. Omit for the network-free
  // analytical grid.
  basemap?: BasemapConfig
  // Legacy shorthand for { kind: 'style', url }. Kept for compatibility;
  // new templates should use basemap so every provider follows one contract.
  style_url?: string
  fit?: boolean
  fit_on_update?: boolean
  padding?: number
  max_zoom?: number
  center?: [number, number]
  zoom?: number
  interactive?: boolean
  feature_context?: {
    key?: string
    label_key?: string
  }
}

interface ThemeColors {
  bg: string
  surface: string
  grid: string
  border: string
  accent: string
  ok: string
  warning: string
  danger: string
  muted: string
  fg: string
}

const SOURCE_ID = 'mtc-geo-features'
const GRID_SOURCE_ID = 'mtc-geo-grid'
const FILL_LAYER = 'mtc-geo-fill'
const LINE_LAYER = 'mtc-geo-line'
const POINT_LAYER = 'mtc-geo-point'
const INTERACTIVE_LAYERS = [POINT_LAYER, LINE_LAYER, FILL_LAYER]

export function GeoMap({ data, options }: WidgetProps) {
  const collection = useMemo(() => normalizeGeoData(data), [data])
  const opts = (options ?? {}) as GeoMapOptions
  const basemapResolution = useMemo(() => {
    try {
      return {
        value: normalizeBasemap(opts.basemap, opts.style_url),
        error: null,
      }
    } catch (reason) {
      return {
        value: null,
        error: reason instanceof Error ? reason.message : 'Invalid basemap configuration',
      }
    }
  }, [opts.basemap, opts.style_url])
  const { setCtx } = useDashboard()
  const hasCollection = collection !== null
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const collectionRef = useRef(collection)
  const fittedRef = useRef(false)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<GeoFeatureData | null>(null)

  collectionRef.current = collection

  useEffect(() => {
    const container = containerRef.current
    const resolvedBasemap = basemapResolution.value
    if (!container || !collection || !resolvedBasemap) return
    let disposed = false
    let map: MapLibreMap | null = null
    setReady(false)
    setError(null)
    fittedRef.current = false

    void import('maplibre-gl')
      .then(maplibre => {
        if (disposed) return
        const colors = readThemeColors(container)
        map = new maplibre.Map({
          container,
          style: basemapStyle(resolvedBasemap, colors.bg),
          center: opts.center ?? [0, 20],
          zoom: opts.zoom ?? 1,
          // Keep attribution visible. Host-provided styles may add required
          // source credits, and hiding them behind a compact control is too
          // easy to miss in dense dashboard layouts.
          attributionControl: { compact: false },
          interactive: opts.interactive !== false,
          cooperativeGestures: true,
          renderWorldCopies: false,
        })
        mapRef.current = map

        map.on('load', () => {
          if (disposed || !map) return
          if (resolvedBasemap.kind === 'analytical') installGrid(map, colors)
          const current = collectionRef.current
          if (current) {
            installFeatures(map, current, colors)
            if (opts.fit !== false) {
              fitCollection(map, current, opts)
              fittedRef.current = true
            }
          }
          setReady(true)
        })

        for (const layer of INTERACTIVE_LAYERS) {
          map.on('click', layer, (event: MapLayerMouseEvent) => {
            const rendered = event.features?.[0]
            if (!rendered) return
            const feature = collectionRef.current?.features.find(
              candidate => candidate.id === String(rendered.id ?? rendered.properties?._mtc_id ?? ''),
            )
            if (!feature) return
            setSelected(feature)
            const context = geoFeatureContext(feature)
            for (const [key, value] of Object.entries(context)) setCtx(key, value)
            const contextOptions = opts.feature_context
            const idKey = contextOptions?.key
            const labelKey = contextOptions?.label_key
            if (idKey && !(idKey in context)) setCtx(idKey, feature.id)
            if (labelKey && !(labelKey in context)) setCtx(labelKey, geoFeatureLabel(feature))
          })
          map.on('mouseenter', layer, () => {
            if (map) map.getCanvas().style.cursor = 'pointer'
          })
          map.on('mouseleave', layer, () => {
            if (map) map.getCanvas().style.cursor = ''
          })
        }

        map.on('error', event => {
          // Tile failures should not erase usable overlays. Surface only a
          // pre-load style/runtime failure as the widget's blocking state.
          if (!map?.loaded()) {
            const message = event.error instanceof Error ? event.error.message : 'Map failed to load'
            setError(message)
          }
        })
      })
      .catch(reason => {
        if (!disposed) {
          setError(reason instanceof Error ? reason.message : 'Map renderer failed to load')
        }
      })

    return () => {
      disposed = true
      map?.remove()
      mapRef.current = null
      setReady(false)
    }
    // Data updates flow through the source effect below; recreating the WebGL
    // map for every stream tick would discard camera state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    basemapResolution.value?.cache_key,
    opts.center?.[0],
    opts.center?.[1],
    opts.zoom,
    opts.interactive,
    hasCollection,
  ])

  useEffect(() => {
    const map = mapRef.current
    if (!collection || !map || !map.loaded()) return
    const source = map.getSource(SOURCE_ID) as GeoJSONSource | undefined
    if (!source) return
    source.setData(collection)
    if (opts.fit_on_update || (!fittedRef.current && opts.fit !== false)) {
      fitCollection(map, collection, opts)
      fittedRef.current = true
    }
  }, [collection, opts.fit, opts.fit_on_update, opts.padding, opts.max_zoom])

  if (!collection) return <Empty>No geospatial features</Empty>

  const visibleError = basemapResolution.error ?? error
  const fit = () => {
    const map = mapRef.current
    if (map) fitCollection(map, collection, opts)
  }

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded bg-zinc-950"
      role="region"
      aria-label="Geospatial map"
    >
      <div ref={containerRef} className="mtc-geo-map absolute inset-0" />
      {!ready && !visibleError && (
        <div className="absolute inset-0 grid place-items-center bg-zinc-950/60 text-xs text-zinc-500">
          Loading map…
        </div>
      )}
      {visibleError && (
        <div className="absolute inset-0 grid place-items-center bg-zinc-950/85 px-6 text-center text-xs text-red-400">
          {visibleError}
        </div>
      )}
      <div className="absolute right-2 top-2 flex flex-col overflow-hidden rounded border border-zinc-700 bg-zinc-950/85 shadow">
        <button
          type="button"
          onClick={() => mapRef.current?.zoomIn()}
          className="w-8 h-8 text-sm text-zinc-300 hover:bg-zinc-800 border-b border-zinc-700"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => mapRef.current?.zoomOut()}
          className="w-8 h-8 text-sm text-zinc-300 hover:bg-zinc-800 border-b border-zinc-700"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          onClick={fit}
          className="w-8 h-8 text-[10px] text-zinc-300 hover:bg-zinc-800"
          aria-label="Fit features"
          title="Fit features"
        >
          ⛶
        </button>
      </div>
      <div className="absolute left-2 top-2 rounded border border-zinc-800 bg-zinc-950/80 px-2 py-1 text-[10px] font-mono text-zinc-400">
        {collection.features.length.toLocaleString()} feature{collection.features.length === 1 ? '' : 's'}
      </div>
      {selected && (
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="absolute bottom-2 left-2 max-w-[70%] rounded border border-zinc-700 bg-zinc-950/90 px-3 py-2 text-left shadow"
          aria-label="Close selected feature detail"
        >
          <span className="block truncate text-xs font-medium text-zinc-100">
            {geoFeatureLabel(selected)}
          </span>
          {typeof selected.properties._mtc_status === 'string' && (
            <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-zinc-500">
              {selected.properties._mtc_status}
            </span>
          )}
        </button>
      )}
    </div>
  )
}

function installGrid(map: MapLibreMap, colors: ThemeColors) {
  if (map.getSource(GRID_SOURCE_ID)) return
  map.addSource(GRID_SOURCE_ID, {
    type: 'geojson',
    data: graticule(),
  })
  map.addLayer({
    id: 'mtc-geo-grid-lines',
    type: 'line',
    source: GRID_SOURCE_ID,
    paint: {
      'line-color': colors.grid,
      'line-opacity': 0.65,
      'line-width': 1,
    },
  })
}

function installFeatures(
  map: MapLibreMap,
  collection: GeoFeatureCollection,
  colors: ThemeColors,
) {
  map.addSource(SOURCE_ID, {
    type: 'geojson',
    data: collection,
    promoteId: '_mtc_id',
  })

  const toneColor = [
    'match',
    ['get', '_mtc_tone'],
    'ok', colors.ok,
    'warn', colors.warning,
    'danger', colors.danger,
    'info', colors.accent,
    colors.muted,
  ] as never
  const values = collection.features
    .map(feature => feature.properties._mtc_value)
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value))
  const min = values.length > 0 ? Math.min(...values) : 0
  const max = values.length > 0 ? Math.max(...values) : 1
  const radius = max > min
    ? ['interpolate', ['linear'], ['coalesce', ['get', '_mtc_value'], min], min, 4.5, max, 13] as never
    : 6

  map.addLayer({
    id: FILL_LAYER,
    type: 'fill',
    source: SOURCE_ID,
    filter: ['in', ['geometry-type'], ['literal', ['Polygon', 'MultiPolygon']]],
    paint: {
      'fill-color': toneColor,
      'fill-opacity': 0.22,
    },
  })
  map.addLayer({
    id: LINE_LAYER,
    type: 'line',
    source: SOURCE_ID,
    filter: [
      'in',
      ['geometry-type'],
      ['literal', ['LineString', 'MultiLineString', 'Polygon', 'MultiPolygon']],
    ],
    paint: {
      'line-color': toneColor,
      'line-opacity': 0.9,
      'line-width': 2,
    },
  })
  map.addLayer({
    id: POINT_LAYER,
    type: 'circle',
    source: SOURCE_ID,
    filter: ['in', ['geometry-type'], ['literal', ['Point', 'MultiPoint']]],
    paint: {
      'circle-color': toneColor,
      'circle-radius': radius,
      'circle-opacity': 0.9,
      'circle-stroke-color': colors.surface,
      'circle-stroke-width': 1.5,
    },
  })
}

function fitCollection(
  map: MapLibreMap,
  collection: GeoFeatureCollection,
  options: GeoMapOptions,
) {
  const bounds = geoBounds(collection)
  if (!bounds) return
  const [[west, south], [east, north]] = bounds
  if (west === east && south === north) {
    map.easeTo({
      center: [west, south],
      zoom: options.zoom ?? Math.min(options.max_zoom ?? 12, 8),
      duration: 300,
    })
    return
  }
  map.fitBounds(bounds, {
    padding: options.padding ?? 36,
    maxZoom: options.max_zoom ?? 12,
    duration: 300,
  })
}

function graticule(): GeoFeatureCollection {
  const features: GeoFeatureData[] = []
  for (let longitude = -150; longitude <= 150; longitude += 30) {
    features.push({
      type: 'Feature',
      id: `lng-${longitude}`,
      properties: { _mtc_id: `lng-${longitude}`, _mtc_label: '', _mtc_tone: 'neutral', _mtc_context: '{}' },
      geometry: {
        type: 'LineString',
        coordinates: [[longitude, -80], [longitude, 80]],
      },
    })
  }
  for (let latitude = -60; latitude <= 60; latitude += 30) {
    features.push({
      type: 'Feature',
      id: `lat-${latitude}`,
      properties: { _mtc_id: `lat-${latitude}`, _mtc_label: '', _mtc_tone: 'neutral', _mtc_context: '{}' },
      geometry: {
        type: 'LineString',
        coordinates: [[-180, latitude], [180, latitude]],
      },
    })
  }
  return { type: 'FeatureCollection', features }
}

function readThemeColors(element: HTMLElement): ThemeColors {
  const style = getComputedStyle(element)
  const value = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback
  return {
    bg: value('--mtc-bg', '#0a0d10'),
    surface: value('--mtc-surface', '#11151a'),
    grid: value('--mtc-grid', '#20272e'),
    border: value('--mtc-border', '#28313a'),
    accent: value('--mtc-accent', '#5a8dee'),
    ok: value('--mtc-ok', '#4fb184'),
    warning: value('--mtc-warning', '#d6a354'),
    danger: value('--mtc-danger', '#df6972'),
    muted: value('--mtc-muted', '#87929e'),
    fg: value('--mtc-fg', '#f1f4f6'),
  }
}
