import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/Apache/Superset',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Apache',
    cloneProduct: 'Apache Superset',
    cloneNamespace: 'apache-superset',
    docs: { description: { component: 'An Apache Superset-style BI reference with dashboards, semantic datasets, Explore chart controls, SQL Lab, result grids, and publication workflows.' } },
  },
  args: { product: 'apache-superset', initialView: 'dashboard' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['dashboard', 'explore', 'sql-lab'] },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const BusinessDashboard: Story = {}
export const ExploreChart: Story = { args: { initialView: 'explore' } }
export const SqlLab: Story = { args: { initialView: 'sql-lab' } }
