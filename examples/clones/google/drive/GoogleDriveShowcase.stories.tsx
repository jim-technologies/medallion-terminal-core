import type { Meta, StoryObj } from '@storybook/react'
import { GoogleDriveShowcase } from './GoogleDriveShowcase'

const meta = {
  title: 'Clones/Google/Drive',
  component: GoogleDriveShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Google',
    cloneProduct: 'Google Drive',
    cloneNamespace: 'google-drive',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A namespaced, product-faithful Drive shell backed by the generic file record shape. '
          + 'It is showcase code and does not add Google-specific concepts to the published framework.',
      },
    },
  },
  args: {
    initialSection: 'my-drive',
    initialView: 'list',
    showAiShelf: true,
  },
  argTypes: {
    items: {
      control: false,
    },
    initialSection: {
      control: 'select',
      options: ['home', 'my-drive', 'computers', 'shared', 'recent', 'starred', 'spam', 'trash'],
    },
    initialView: {
      control: 'inline-radio',
      options: ['list', 'grid'],
    },
  },
} satisfies Meta<typeof GoogleDriveShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const MyDrive: Story = {}

export const GridView: Story = {
  args: {
    initialView: 'grid',
  },
}

export const SelectedFileDetails: Story = {
  args: {
    initialSelectedId: 'operating-plan',
  },
}

export const SharedWithMe: Story = {
  args: {
    initialSection: 'shared',
    showAiShelf: false,
  },
}
