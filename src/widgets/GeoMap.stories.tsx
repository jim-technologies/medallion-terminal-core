import type { Meta, StoryObj } from '@storybook/react'
import { GeoMap } from './GeoMap'

const meta: Meta<typeof GeoMap> = {
  title: 'Widgets/GeoMap',
  component: GeoMap,
  decorators: [
    (Story) => (
      <div style={{ height: 520, width: 840, background: '#11151a', padding: 12, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof GeoMap>

export const FleetAndTerritory: Story = {
  args: {
    data: {
      features: [
        {
          id: 'territory-west',
          label: 'West service territory',
          status: 'active',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-123.2, 37.1],
              [-121.4, 37.1],
              [-121.4, 38.3],
              [-123.2, 38.3],
              [-123.2, 37.1],
            ]],
          },
        },
        {
          id: 'route-17',
          label: 'Route 17',
          status: 'running',
          geometry: {
            type: 'LineString',
            coordinates: [
              [-122.68, 38.08],
              [-122.42, 37.88],
              [-122.18, 37.67],
              [-121.88, 37.34],
            ],
          },
        },
        {
          id: 'vehicle-104',
          label: 'Vehicle 104',
          latitude: 37.7749,
          longitude: -122.4194,
          status: 'healthy',
          value: 42,
          context: { vehicle_id: 'vehicle-104' },
        },
        {
          id: 'vehicle-208',
          label: 'Vehicle 208',
          latitude: 37.6879,
          longitude: -122.4702,
          status: 'delayed',
          value: 18,
          context: { vehicle_id: 'vehicle-208' },
        },
        {
          id: 'vehicle-311',
          label: 'Vehicle 311',
          latitude: 37.4419,
          longitude: -122.143,
          status: 'critical',
          value: 8,
          context: { vehicle_id: 'vehicle-311' },
        },
      ],
    },
    options: {
      feature_context: { key: 'asset_id', label_key: 'asset_label' },
    },
  },
}

export const TablePoints: Story = {
  args: {
    data: [
      { id: 'nyc', name: 'New York', lat: 40.7128, lon: -74.006, value: 120, status: 'healthy' },
      { id: 'london', name: 'London', lat: 51.5072, lon: -0.1276, value: 80, status: 'warning' },
      { id: 'singapore', name: 'Singapore', lat: 1.3521, lon: 103.8198, value: 55, status: 'healthy' },
    ],
  },
}
