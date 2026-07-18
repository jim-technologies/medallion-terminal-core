import type { Meta, StoryObj } from '@storybook/react'
import { HubSpotShowcase } from './HubSpotShowcase'

const meta = {
  title: 'Clones/SME/HubSpot',
  component: HubSpotShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneNamespace: 'hubspot',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A namespaced, product-faithful CRM surface covering contact indexing, '
          + 'three-column customer records, activities, associations, and deal stages.',
      },
    },
  },
  args: {
    initialSection: 'contacts',
    portalName: 'Northstar',
  },
  argTypes: {
    contacts: { control: false },
    deals: { control: false },
    activities: { control: false },
    initialSection: {
      control: 'inline-radio',
      options: ['contacts', 'record', 'pipeline'],
    },
    onSelectContact: { action: 'select contact' },
  },
} satisfies Meta<typeof HubSpotShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const ContactIndex: Story = {}

export const CustomerRecord: Story = {
  args: {
    initialSection: 'record',
    initialSelectedContactId: 'amelia-stone',
  },
}

export const DealPipeline: Story = {
  args: {
    initialSection: 'pipeline',
  },
}
