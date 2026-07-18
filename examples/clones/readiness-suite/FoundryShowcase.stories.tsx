import type { Meta, StoryObj } from '@storybook/react'
import { FoundryShowcase } from './FoundryShowcase'

const meta = {
  title: 'Clones/Palantir Foundry',
  component: FoundryShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneNamespace: 'palantir-foundry',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A showcase-only Foundry-style platform surface spanning ontology schema, '
          + 'object exploration, data lineage, and governed action types.',
      },
    },
  },
  args: {
    initialSection: 'ontology',
    workspaceName: 'Northstar Operations',
  },
  argTypes: {
    objectTypes: { control: false },
    objects: { control: false },
    lineageNodes: { control: false },
    lineageEdges: { control: false },
    actions: { control: false },
    initialSection: {
      control: 'inline-radio',
      options: ['ontology', 'objects', 'lineage', 'actions'],
    },
    onSelectObjectType: { action: 'select object type' },
  },
} satisfies Meta<typeof FoundryShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const OntologyManager: Story = {}

export const ObjectExplorer: Story = {
  args: {
    initialSection: 'objects',
    initialObjectId: 'northwind-health',
  },
}

export const DataLineage: Story = {
  args: {
    initialSection: 'lineage',
  },
}

export const GovernedActions: Story = {
  args: {
    initialSection: 'actions',
  },
}
