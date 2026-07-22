import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/Grafana Labs/Grafana',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'Grafana Labs',
    cloneProduct: 'Grafana Labs Grafana',
    cloneNamespace: 'grafana-labs-grafana',
    docs: { description: { component: 'A Grafana-style observability reference with panel dashboards, time controls, Explore queries, log results, service health, and unified alerting.' } },
  },
  args: { product: 'grafana-labs-grafana', initialView: 'dashboard' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['dashboard', 'explore', 'alerting'] },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const OperationsDashboard: Story = {}
export const ExploreTelemetry: Story = { args: { initialView: 'explore' } }
export const UnifiedAlerting: Story = { args: { initialView: 'alerting' } }
