import type { Meta, StoryObj } from '@storybook/react'
import { AssetCatalog } from './AssetCatalog'

const meta: Meta<typeof AssetCatalog> = {
  title: 'Widgets/AssetCatalog',
  component: AssetCatalog,
  decorators: [
    (Story) => (
      <div style={{ height: 540, width: 480, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof AssetCatalog>

export const PlatformAssets: Story = {
  args: {
    data: {
      total: 5,
      items: [
        {
          id: 'dataset.customer_360',
          name: 'Customer 360',
          kind: 'dataset',
          owner: 'growth-data',
          status: 'healthy',
          description: 'Curated customer account, product, and engagement facts.',
          tags: ['gold', 'pii'],
          metadata: { rows: '18.4M', quality: '99.7%' },
        },
        {
          id: 'object_type.Customer',
          name: 'Customer',
          kind: 'object_type',
          owner: 'ontology',
          status: 'published',
          description: 'Semantic customer object with account and order links.',
          tags: ['ontology'],
        },
        {
          id: 'pipeline.customer_features',
          name: 'Customer features',
          kind: 'pipeline',
          owner: 'ml-platform',
          status: 'warning',
          metadata: { schedule: 'hourly', freshness: '18m' },
          tags: ['features', 'production'],
        },
        {
          id: 'repository.analytics',
          name: 'analytics',
          kind: 'repository',
          owner: 'data-platform',
          status: 'active',
          metadata: { ref: 'main', language: 'TypeScript' },
          context: { repository: 'analytics', repo_ref: 'main', repo_path: '' },
        },
        {
          id: 'model.churn_v4',
          name: 'Churn risk v4',
          kind: 'model',
          owner: 'retention-ml',
          status: 'draft',
          tags: ['classification'],
        },
      ],
    },
  },
}
