import type { Meta, StoryObj } from '@storybook/react'
import { ActionForm } from './ActionForm'

const meta: Meta<typeof ActionForm> = {
  title: 'Widgets/ActionForm',
  component: ActionForm,
  decorators: [
    (Story) => (
      <div style={{ minHeight: 520, width: 600, background: '#11151a', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ActionForm>

export const AdvancedOrder: Story = {
  args: {
    options: {
      action_id: 'place_advanced_order',
      url: '/api/actions/order',
      submit_label: 'Review order',
      success_message: 'Order accepted',
      description: 'A schema-driven ticket for order types beyond the compact trade widget.',
      confirm: true,
      columns: 2,
      fields: [
        { key: 'symbol', label: 'Instrument', context_key: 'symbol', default_value: 'BTC-USD', required: true },
        { key: 'side', type: 'select', required: true, choices: ['buy', 'sell'], default_value: 'buy' },
        { key: 'order_type', label: 'Order type', type: 'select', required: true, choices: ['market', 'limit', 'stop', 'stop_limit'], default_value: 'limit' },
        { key: 'time_in_force', label: 'Time in force', type: 'select', choices: ['day', 'gtc', 'ioc', 'fok'], default_value: 'day' },
        { key: 'quantity', type: 'number', required: true, min: 0.0001, step: 0.0001 },
        { key: 'limit_price', label: 'Limit price', type: 'currency', min: 0 },
        { key: 'outside_rth', label: 'Outside regular hours', type: 'boolean' },
        { key: 'note', type: 'long_text', placeholder: 'Optional operator note' },
      ],
    },
  },
}

export const GovernedApproval: Story = {
  args: {
    options: {
      action_id: 'approve_change',
      url: '/api/actions/approve',
      submit_label: 'Approve',
      tone: 'primary',
      fields: [
        { key: 'decision', type: 'select', required: true, choices: ['approve', 'request_changes', 'reject'] },
        { key: 'comment', type: 'long_text', required: true },
      ],
    },
  },
}
