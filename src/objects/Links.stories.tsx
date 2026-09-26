import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import { Icon, IconButton, Panel } from '../components'
import { LinkGraph, LinkPanel, SchemaGraph } from '.'
import {
  BUSY_LINKS,
  CUSTOMER,
  CUSTOMER_LINKS,
  SCHEMA_RELATIONS,
  SCHEMA_TYPES,
} from './objectStories.fixture'

const meta = {
  title: 'Toolkit/Objects/Links',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Objects"
        title={context.name}
        description="Links are first-class: grouped by link type with counts and previews, drawn as a one-hop graph around the object, and summarised for the whole ontology as a schema graph."
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

const navigate = fn()

export const LinkPanelGroups: Story = {
  name: 'LinkPanel',
  render: () => (
    <div className="max-w-xl">
      <LinkPanel
        groups={CUSTOMER_LINKS}
        onNavigate={(object) => navigate(object.id)}
        actions={<IconButton icon={<Icon name="graph" />} aria-label="Show link graph" variant="ghost" size="small" />}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('4 link types · 17 objects')).toBeVisible()
    const placed = canvas.getByRole('region', { name: 'Placed Order' })
    await expect(within(placed).getAllByRole('link')).toHaveLength(4)
    await expect(within(placed).getByRole('link', { name: 'View all 12' })).toHaveAttribute('href', '#/explore?type=order&customer=res-customer-northstar')
    await userEvent.click(canvas.getByRole('link', { name: 'Daniel Reyes' }))
    await expect(navigate).toHaveBeenCalledWith('per-daniel-reyes')
    await expect(canvas.getByRole('img', { name: 'incoming' })).toBeVisible()
  },
}

const graphNavigate = fn()

export const OneHopGraph: Story = {
  name: 'LinkGraph',
  render: () => (
    <Panel title="Link graph" subtitle="1 hop · 17 objects">
      <LinkGraph
        center={CUSTOMER}
        groups={CUSTOMER_LINKS}
        label="Links of Northstar Labs"
        onNavigate={(object) => graphNavigate(object.id)}
      />
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const graph = canvas.getByRole('group', { name: 'Links of Northstar Labs' })
    const first = within(graph).getByRole('link', { name: 'Ada Morgan, Employs' })
    first.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(within(graph).getByRole('link', { name: 'Daniel Reyes, Employs' })).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(graphNavigate).toHaveBeenCalledWith('per-daniel-reyes')
    const layer = graph.querySelector('g[transform]')!
    const scaleOf = () => Number(/scale\(([\d.]+)\)/.exec(layer.getAttribute('transform') ?? '')?.[1])
    const initial = layer.getAttribute('transform')
    const fitted = scaleOf()
    await userEvent.click(canvas.getByRole('button', { name: 'Zoom in' }))
    await expect(scaleOf()).toBeCloseTo(fitted * 1.25, 2)
    await userEvent.click(canvas.getByRole('button', { name: 'Reset view' }))
    await expect(layer.getAttribute('transform')).toBe(initial)
  },
}

export const CappedGraph: Story = {
  name: 'LinkGraph with 40-node cap',
  render: () => (
    <Panel title="Link graph" subtitle="1 hop · 224 objects">
      <LinkGraph center={CUSTOMER} groups={BUSY_LINKS} label="Links of a busy customer" height={420} />
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const graph = within(canvasElement).getByRole('group', { name: 'Links of a busy customer' })
    await expect(graph.querySelectorAll('.mtc-graph-node:not([data-center])').length).toBeLessThanOrEqual(40)
    await expect(within(graph).getByRole('link', { name: /more Placed Order/ })).toHaveAttribute('href', '#/explore?type=order')
  },
}

const selectType = fn()

export const SchemaGraphTypes: Story = {
  name: 'SchemaGraph',
  render: () => (
    <Panel title="Ontology graph" subtitle="7 object types · 8 link types">
      <SchemaGraph
        types={SCHEMA_TYPES}
        relations={SCHEMA_RELATIONS}
        label="Ontology graph"
        selectedId="customer"
        onSelect={(type) => selectType(type.id)}
        height={380}
      />
    </Panel>
  ),
  play: async ({ canvasElement }) => {
    const graph = within(canvasElement).getByRole('group', { name: 'Ontology graph' })
    const customer = within(graph).getByRole('link', { name: 'Customer, 71' })
    await expect(customer).toHaveAttribute('aria-current', 'true')
    await userEvent.click(within(graph).getByRole('link', { name: 'Order, 3,104' }))
    await expect(selectType).toHaveBeenCalledWith('order')
  },
}
