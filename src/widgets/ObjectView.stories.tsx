import type { Meta, StoryObj } from '@storybook/react'
import { ObjectView } from './ObjectView'

const meta: Meta<typeof ObjectView> = {
  title: 'Widgets/ObjectView',
  component: ObjectView,
  decorators: [
    (Story) => (
      <div style={{ height: 560, width: 620, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ObjectView>

export const CustomerObject: Story = {
  args: {
    options: { enable_actions: true },
    data: {
      object_type: 'Customer',
      object_id: 'cust-1042',
      title: 'Acme Corp',
      description: 'Enterprise customer assembled from CRM, billing, product, and support systems.',
      status: 'active',
      updated_at: '2026-07-16T14:30:00Z',
      tags: ['enterprise', 'west'],
      properties: [
        { key: 'tier', label: 'Tier', value: 'Enterprise', group: 'Commercial' },
        { key: 'arr', label: 'ARR', value: 1250000, format: 'currency:USD', group: 'Commercial' },
        { key: 'renewal', label: 'Renewal', value: '2026-11-30', group: 'Commercial' },
        { key: 'risk', label: 'Churn risk', value: 0.18, format: 'percent', group: 'Signals' },
        { key: 'health', label: 'Health score', value: 87, group: 'Signals' },
        { key: 'regions', label: 'Regions', value: ['US-West', 'EU-Central'], group: 'Operations' },
      ],
      links: [
        { relation: 'owns', target_type: 'Account', target_id: 'acct-9', label: 'Primary account' },
        { relation: 'has contact', target_type: 'Person', target_id: 'person-88', label: 'Taylor Morgan' },
      ],
      actions: [
        { id: 'open_case', label: 'Open case', style: 'primary' },
        { id: 'archive_customer', label: 'Archive', style: 'danger', confirm: true },
      ],
    },
  },
}
