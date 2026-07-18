import type { Meta, StoryObj } from '@storybook/react'
import { StripeShowcase } from './StripeShowcase'

const meta = {
  title: 'Clones/Stripe',
  component: StripeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneNamespace: 'stripe',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A presentation-only revenue operations surface for payments, payment details, '
          + 'subscription billing, payouts, recovery, and dispute handling.',
      },
    },
  },
  args: {
    initialSection: 'overview',
    accountName: 'Northstar Supply',
  },
  argTypes: {
    payments: { control: false },
    subscriptions: { control: false },
    disputes: { control: false },
    initialSection: {
      control: 'inline-radio',
      options: ['overview', 'payments', 'billing', 'disputes'],
    },
    onSelectPayment: { action: 'select payment' },
  },
} satisfies Meta<typeof StripeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const RevenueOverview: Story = {}

export const PaymentOperations: Story = {
  args: {
    initialSection: 'payments',
  },
}

export const PaymentDetail: Story = {
  args: {
    initialSection: 'payments',
    initialSelectedPaymentId: 'pi_3Qnorthstar01',
  },
}

export const SubscriptionBilling: Story = {
  args: {
    initialSection: 'billing',
  },
}

export const DisputeOperations: Story = {
  args: {
    initialSection: 'disputes',
  },
}
