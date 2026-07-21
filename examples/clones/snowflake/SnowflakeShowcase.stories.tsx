import type { Meta, StoryObj } from '@storybook/react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import { SnowflakeShowcase } from './SnowflakeShowcase'

const meta = {
  title: 'Clones/Snowflake',
  component: SnowflakeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Snowflake',
    cloneProduct: 'Snowflake',
    cloneNamespace: 'snowflake',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A current Snowsight-style reference centered on file-based Workspaces, '
          + 'Horizon catalog discovery, governed SQL execution, and query monitoring.',
      },
    },
  },
  args: {
    initialSection: 'workspace',
    accountName: CLONE_DEMO_IDENTITY.company,
  },
  argTypes: {
    files: { control: false },
    catalogObjects: { control: false },
    queries: { control: false },
    initialSection: {
      control: 'inline-radio',
      options: ['workspace', 'catalog', 'monitoring'],
    },
    onSelectCatalogObject: { action: 'select catalog object' },
  },
} satisfies Meta<typeof SnowflakeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const WorkspaceSqlProject: Story = {}

export const HorizonCatalog: Story = {
  args: {
    initialSection: 'catalog',
  },
}

export const QueryMonitoring: Story = {
  args: {
    initialSection: 'monitoring',
  },
}
