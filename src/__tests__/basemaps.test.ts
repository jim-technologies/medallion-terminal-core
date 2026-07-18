import { describe, expect, it } from 'vitest'
import {
  BASEMAP_PRESETS,
  BASEMAP_PRESET_IDS,
  basemapNetworkUrls,
  basemapStyle,
  normalizeBasemap,
} from '../maps/basemaps'

describe('basemap normalization', () => {
  it('defaults to a network-free analytical map', () => {
    const basemap = normalizeBasemap()
    expect(basemap).toMatchObject({
      id: 'analytical',
      kind: 'analytical',
      network: false,
      preset: 'analytical',
    })
    expect(basemapNetworkUrls(basemap)).toEqual([])
    expect(basemapStyle(basemap, '#010203')).toMatchObject({
      version: 8,
      sources: {},
      layers: [{
        id: 'mtc-background',
        paint: { 'background-color': '#010203' },
      }],
    })
  })

  it('ships only curated no-key, self-hostable network presets', () => {
    expect(BASEMAP_PRESET_IDS).toEqual([
      'analytical',
      'openfreemap-dark',
      'openfreemap-liberty',
      'openfreemap-positron',
      'versatiles-eclipse',
      'versatiles-graybeard',
    ])

    for (const id of BASEMAP_PRESET_IDS) {
      const definition = BASEMAP_PRESETS[id]
      expect(definition.id).toBe(id)
      expect(definition.self_hostable).toBe(true)
      const basemap = normalizeBasemap(id)
      expect(basemap.preset).toBe(id)
      expect(basemap.network).toBe(definition.network)
      expect(basemapNetworkUrls(basemap)).toEqual(
        definition.style_url ? [definition.style_url] : [],
      )
    }
  })

  it('accepts the explicit preset form', () => {
    expect(normalizeBasemap({
      kind: 'preset',
      preset: 'openfreemap-dark',
    })).toMatchObject({
      kind: 'style',
      provider: 'OpenFreeMap',
      preset: 'openfreemap-dark',
      style_url: 'https://tiles.openfreemap.org/styles/dark',
    })
  })

  it('normalizes custom and legacy style URLs to the same contract', () => {
    const canonical = normalizeBasemap({
      kind: 'style',
      url: 'https://maps.example.com/style.json',
    })
    const legacy = normalizeBasemap(undefined, 'https://maps.example.com/style.json')

    expect(canonical).toMatchObject({
      kind: 'style',
      provider: 'custom',
      style_url: 'https://maps.example.com/style.json',
    })
    expect(legacy).toMatchObject({
      kind: 'style',
      provider: 'custom',
      style_url: 'https://maps.example.com/style.json',
    })
    expect(basemapStyle(canonical)).toBe('https://maps.example.com/style.json')
  })

  it('normalizes XYZ/TMS raster providers into a MapLibre style', () => {
    const basemap = normalizeBasemap({
      kind: 'raster',
      tiles: [
        'https://a.maps.example.com/{z}/{x}/{y}.png',
        'https://b.maps.example.com/{z}/{x}/{y}.png',
      ],
      attribution: 'Example Maps',
      tile_size: 512,
      min_zoom: 2,
      max_zoom: 18,
      scheme: 'tms',
    })

    expect(basemap).toMatchObject({
      id: 'custom-raster',
      kind: 'raster',
      tiles: [
        'https://a.maps.example.com/{z}/{x}/{y}.png',
        'https://b.maps.example.com/{z}/{x}/{y}.png',
      ],
      attribution: 'Example Maps',
      tile_size: 512,
      min_zoom: 2,
      max_zoom: 18,
      scheme: 'tms',
    })
    expect(basemapNetworkUrls(basemap)).toEqual([
      'https://a.maps.example.com/{z}/{x}/{y}.png',
      'https://b.maps.example.com/{z}/{x}/{y}.png',
    ])
    expect(basemapStyle(basemap)).toMatchObject({
      version: 8,
      sources: {
        'mtc-basemap-raster': {
          type: 'raster',
          tileSize: 512,
          minzoom: 2,
          maxzoom: 18,
          scheme: 'tms',
          attribution: 'Example Maps',
        },
      },
      layers: [
        { id: 'mtc-background', type: 'background' },
        {
          id: 'mtc-basemap-raster',
          type: 'raster',
          source: 'mtc-basemap-raster',
          minzoom: 2,
          maxzoom: 18,
        },
      ],
    })
  })

  it('rejects ambiguity and malformed provider configuration', () => {
    expect(() => normalizeBasemap(
      'openfreemap-dark',
      'https://maps.example.com/style.json',
    )).toThrow(/mutually exclusive/)
    expect(() => normalizeBasemap('unknown-provider')).toThrow(/unknown basemap preset/)
    expect(() => normalizeBasemap({ kind: 'style', url: '' })).toThrow(/non-empty/)
    expect(() => normalizeBasemap({ kind: 'raster', tiles: [] })).toThrow(/non-empty/)
    expect(() => normalizeBasemap({
      kind: 'raster',
      tiles: '/tiles/{z}/{x}/{y}.png',
      min_zoom: 12,
      max_zoom: 4,
    })).toThrow(/min_zoom/)
    expect(() => normalizeBasemap({
      kind: 'raster',
      tiles: '/tiles/{z}/{x}/{y}.png',
      tile_size: 1024,
    })).toThrow(/tile_size/)
  })
})
