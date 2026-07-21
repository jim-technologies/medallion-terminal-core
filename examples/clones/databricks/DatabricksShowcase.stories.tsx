import type { Meta, StoryObj } from '@storybook/react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import { DatabricksShowcase } from './DatabricksShowcase'

const meta = {
  title: 'Clones/Databricks',
  component: DatabricksShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Databricks',
    cloneProduct: 'Databricks',
    cloneNamespace: 'databricks',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A current Databricks-style analytics and AI workspace spanning collaborative '
          + 'notebooks, the new SQL editor, Lakeflow Jobs, and Unity Catalog.',
      },
    },
  },
  args: {
    initialSection: 'notebook',
    workspaceName: CLONE_DEMO_IDENTITY.company,
  },
  argTypes: {
    cells: { control: false },
    jobs: { control: false },
    catalogAssets: { control: false },
    initialSection: {
      control: 'inline-radio',
      options: ['notebook', 'sql', 'jobs', 'catalog'],
    },
    onSelectJob: { action: 'select job' },
  },
} satisfies Meta<typeof DatabricksShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const CollaborativeNotebook: Story = {}

export const NewSqlEditor: Story = {
  args: {
    initialSection: 'sql',
  },
}

export const LakeflowJobs: Story = {
  args: {
    initialSection: 'jobs',
  },
}

export const UnityCatalog: Story = {
  args: {
    initialSection: 'catalog',
  },
}
