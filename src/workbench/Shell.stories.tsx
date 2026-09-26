import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button, Icon, Tabs } from '../components'
import { NavRail, PageHeader, type NavRailSection } from '.'

const meta = {
  title: 'Toolkit/Workbench/Navigation',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj

const SECTIONS: NavRailSection[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Home', icon: 'home', href: '#/' },
      { id: 'explore', label: 'Explore', icon: 'explore', href: '#/explore' },
      { id: 'ontology', label: 'Ontology', icon: 'ontology', href: '#/ontology' },
      { id: 'files', label: 'Files', icon: 'folder', href: '#/files' },
      { id: 'activity', label: 'Activity', icon: 'activity', href: '#/activity' },
    ],
  },
  {
    id: 'types',
    label: 'Object types',
    items: [
      { id: 'customer', label: 'Customer', type: { id: 'customer', label: 'Customer', icon: 'building', color: 'teal' }, count: 71, href: '#/explore?type=customer' },
      { id: 'person', label: 'Person', type: { id: 'person', label: 'Person', icon: 'person', color: 'violet' }, count: 212, href: '#/explore?type=person' },
      { id: 'order', label: 'Order', type: { id: 'order', label: 'Order', icon: 'order', color: 'orange' }, count: '3.1K', href: '#/explore?type=order' },
    ],
  },
  {
    id: 'platform',
    label: 'Platform',
    items: [
      { id: 'storage', label: 'Storage', icon: 'database', href: '#/storage' },
      { id: 'connect', label: 'Connect', icon: 'plug', href: '#/connect' },
      { id: 'topology', label: 'System topology', icon: 'topology', href: '#/topology' },
    ],
  },
]

const navigated = fn()

export const NavRailSections: Story = {
  name: 'NavRail',
  render: () => {
    const [active, setActive] = useState('ontology')
    const [collapsed, setCollapsed] = useState(false)
    return (
      <div className="flex h-[40rem]">
        <NavRail
          label="Workspace"
          sections={SECTIONS}
          activeId={active}
          onNavigate={item => {
            navigated(item.id)
            setActive(item.id)
          }}
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        />
        <NavRail label="Workspace (collapsed)" sections={SECTIONS} activeId="explore" collapsed />
        <main className="min-w-0 flex-1 p-6 text-[var(--mtc-muted)]">Page content</main>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const rail = canvas.getByRole('navigation', { name: 'Workspace' })
    await expect(within(rail).getByRole('link', { name: 'Ontology' })).toHaveAttribute('aria-current', 'page')
    await userEvent.click(within(rail).getByRole('link', { name: /Customer/ }))
    await expect(navigated).toHaveBeenCalledWith('customer')
    await expect(within(rail).getByRole('link', { name: /Customer/ })).toHaveAttribute('aria-current', 'page')
    await userEvent.click(within(rail).getByRole('button', { name: 'Collapse navigation' }))
    await expect(rail).toHaveAttribute('data-collapsed', 'true')
    await userEvent.click(within(rail).getByRole('button', { name: 'Expand navigation' }))
    await expect(rail).not.toHaveAttribute('data-collapsed')
  },
}

export const PageHeaderWithTabs: Story = {
  name: 'PageHeader',
  render: () => {
    const [tab, setTab] = useState('types')
    return (
      <div className="grid gap-6 pb-6">
        <PageHeader
          breadcrumbs={[{ label: 'Workspace', href: '#/' }, { label: 'Ontology' }]}
          title="Ontology"
          description="Object types, link types and how they connect."
          actions={(
            <>
              <Button startIcon={<Icon name="download" />}>Export</Button>
              <Button intent="primary" variant="solid" startIcon={<Icon name="add" />}>New object type</Button>
            </>
          )}
          tabs={(
            <Tabs
              label="Ontology sections"
              value={tab}
              onValueChange={setTab}
              items={[
                { id: 'types', label: 'Object types', count: 7, panel: null },
                { id: 'links', label: 'Link types', count: 8, panel: null },
                { id: 'graph', label: 'Graph', panel: null },
              ]}
            />
          )}
        />
        <PageHeader
          title="Operations"
          description="Service health, releases and freshness."
        />
      </div>
    )
  },
}
