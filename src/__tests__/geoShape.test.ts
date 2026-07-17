import { describe, expect, it } from 'vitest'
import {
  geoBounds,
  geoFeatureContext,
  normalizeGeoData,
} from '../widgets/geoShape'

describe('geospatial shape', () => {
  it('normalizes canonical features and computes bounds across geometry types', () => {
    const collection = normalizeGeoData({
      features: [
        {
          id: 'site-a',
          label: 'Site A',
          status: 'healthy',
          geometry: { type: 'Point', coordinates: [-122, 37] },
          context: { site_id: 'site-a' },
        },
        {
          id: 'route',
          geometry: {
            type: 'LineString',
            coordinates: [[-123, 36], [-120, 40]],
          },
        },
      ],
    })
    expect(collection?.features).toHaveLength(2)
    expect(collection?.features[0].properties).toMatchObject({
      _mtc_id: 'site-a',
      _mtc_label: 'Site A',
      _mtc_tone: 'ok',
    })
    expect(geoFeatureContext(collection!.features[0])).toEqual({ site_id: 'site-a' })
    expect(geoBounds(collection!)).toEqual([[-123, 36], [-120, 40]])
  })

  it('accepts table-like latitude/longitude rows', () => {
    const collection = normalizeGeoData({
      rows: [
        { id: 'a', name: 'Alpha', latitude: 10, longitude: 20, value: 4 },
        { id: 'b', label: 'Beta', lat: -5, lng: 30, status: 'offline' },
      ],
    })
    expect(collection?.features.map(feature => feature.geometry)).toEqual([
      { type: 'Point', coordinates: [20, 10] },
      { type: 'Point', coordinates: [30, -5] },
    ])
    expect(collection?.features[1].properties._mtc_tone).toBe('danger')
  })

  it('accepts raw GeoJSON and rejects invalid coordinates', () => {
    expect(normalizeGeoData({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'zone',
        properties: { label: 'Zone' },
        geometry: {
          type: 'Polygon',
          coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]],
        },
      }],
    })?.features[0].id).toBe('zone')

    expect(normalizeGeoData({
      features: [{ id: 'bad', latitude: 120, longitude: 10 }],
    })).toBeNull()
  })
})
