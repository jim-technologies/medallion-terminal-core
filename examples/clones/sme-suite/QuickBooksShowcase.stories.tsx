import type { Meta, StoryObj } from '@storybook/react'
import { QuickBooksShowcase } from './QuickBooksShowcase'

const meta = {
  title: 'Clones/SME/QuickBooks',
  component: QuickBooksShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneNamespace: 'quickbooks',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A namespaced, product-faithful SME finance shell covering business health, '
          + 'cash forecasting, profit and loss, invoices, banking, and transaction review.',
      },
    },
  },
  args: {
    initialSection: 'overview',
    initialTransactionStatus: 'For review',
    companyName: 'Northstar Studio',
  },
  argTypes: {
    cashFlow: { control: false },
    invoices: { control: false },
    transactions: { control: false },
    initialSection: {
      control: 'inline-radio',
      options: ['overview', 'cash-flow', 'transactions'],
    },
    initialTransactionStatus: {
      control: 'select',
      options: ['For review', 'Categorized', 'Excluded'],
    },
  },
} satisfies Meta<typeof QuickBooksShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const BusinessOverview: Story = {}

export const CashFlowForecast: Story = {
  args: {
    initialSection: 'cash-flow',
  },
}

export const BankTransactionReview: Story = {
  args: {
    initialSection: 'transactions',
  },
}
