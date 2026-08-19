import type { Meta, StoryObj } from '@storybook/react'
import { CLONE_DEMO_IDENTITY } from '../../demoIdentity'
import { BackstageShowcase } from './BackstageShowcase'

const meta = {
  title: 'Clones/Spotify/Backstage',
  component: BackstageShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Spotify',
    cloneProduct: 'Spotify Backstage',
    cloneNamespace: 'spotify-backstage',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A host-data-driven internal developer portal reference covering the Software '
          + 'Catalog, entity and plugin tabs, system topology, Software Templates, and '
          + 'TechDocs. Catalog ingestion, permissions, indexed search, scaffolder execution, '
          + 'Kubernetes discovery, secrets, and publication remain host-owned.',
      },
    },
  },
  args: {
    companyName: CLONE_DEMO_IDENTITY.company,
    userName: CLONE_DEMO_IDENTITY.user,
    initialView: 'catalog',
    initialEntityId: 'component.customer-gateway',
    initialEntityTab: 'overview',
    initialKind: 'Component',
  },
  argTypes: {
    entities: { control: false },
    templates: { control: false },
    documents: { control: false },
    initialView: {
      control: 'inline-radio',
      options: ['catalog', 'entity', 'create', 'docs'],
    },
    initialEntityTab: {
      control: 'select',
      options: ['overview', 'ci-cd', 'apis', 'dependencies', 'kubernetes'],
    },
    initialKind: {
      control: 'select',
      options: ['All', 'Component', 'API', 'Resource', 'System', 'Domain', 'Group'],
    },
    onSelectEntity: { action: 'select entity' },
    onCreateFromTemplate: { action: 'create from template' },
    onNavigate: { action: 'navigate' },
  },
} satisfies Meta<typeof BackstageShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const SoftwareCatalog: Story = {}

export const ComponentOverview: Story = {
  args: {
    initialView: 'entity',
  },
}

export const SystemTopology: Story = {
  args: {
    initialView: 'entity',
    initialEntityTab: 'dependencies',
  },
}

export const SoftwareTemplates: Story = {
  args: {
    initialView: 'create',
  },
}

export const ScaffolderWorkflow: Story = {
  args: {
    initialTemplateId: 'typescript-service',
    initialView: 'create',
  },
}

export const TechDocs: Story = {
  args: {
    initialView: 'docs',
  },
}
