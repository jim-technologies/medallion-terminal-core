import type { Meta, StoryObj } from '@storybook/react'
import { CLONE_DEMO_IDENTITY } from '../demoIdentity'
import { PalantirFoundationShowcase } from './PalantirFoundationShowcase'

const meta = {
  title: 'Clones/Palantir/Foundry/Foundation',
  component: PalantirFoundationShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneNamespace: 'palantir-foundry-foundation',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A host-data-injectable Foundry foundation surface covering the platform readiness map, '
          + 'Compass resources, Data Connection and Pipeline Builder, and Code Repositories.',
      },
    },
  },
  args: {
    initialSurface: 'coverage',
    workspaceName: CLONE_DEMO_IDENTITY.company,
  },
  argTypes: {
    capabilities: { control: false },
    resources: { control: false },
    connections: { control: false },
    repositoryEntries: { control: false },
    initialSurface: {
      control: 'inline-radio',
      options: ['coverage', 'compass', 'data', 'code'],
    },
    onSelectResource: { action: 'select Compass resource' },
    onSelectConnection: { action: 'select data connection' },
    onSelectRepositoryEntry: { action: 'select repository entry' },
  },
} satisfies Meta<typeof PalantirFoundationShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const PlatformReadiness: Story = {}

export const CompassFiles: Story = {
  args: {
    initialSurface: 'compass',
    initialResourceId: 'customer-360',
  },
}

export const DataConnectionsAndPipelines: Story = {
  args: {
    initialSurface: 'data',
    initialConnectionId: 'postgres-crm',
  },
}

export const CodeRepositories: Story = {
  args: {
    initialSurface: 'code',
    initialRepositoryPath: 'src/customer_health.py',
  },
}
