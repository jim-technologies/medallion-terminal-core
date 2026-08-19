import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import { Breadcrumbs, Tabs, type TabItem } from '.'

const meta = {
  title: 'Toolkit/Components/Navigation',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Navigation"
        title={context.name}
        description="Generic location and section navigation that remains host-owned, responsive, and fully operable from the keyboard."
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

const tabs: TabItem[] = [
  { id: 'overview', label: 'Overview', panel: <Panel title="Overview" /> },
  { id: 'properties', label: 'Properties', panel: <Panel title="Properties" /> },
  { id: 'activity', label: 'Activity', panel: <Panel title="Activity" /> },
  { id: 'disabled', label: 'Restricted', panel: null, disabled: true },
]

export const TabsControl: Story = {
  name: 'Tabs',
  render: () => <TabsExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const overview = canvas.getByRole('tab', { name: 'Overview' })
    overview.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('tab', { name: 'Properties' })).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('Properties')
    await userEvent.keyboard('{End}')
    await expect(canvas.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true')
  },
}

export const VerticalTabs: Story = {
  name: 'Vertical tabs',
  render: () => <TabsExample orientation="vertical" />,
}

export const BreadcrumbsControl: Story = {
  name: 'Breadcrumbs',
  render: () => (
    <Breadcrumbs
      items={[
        { id: 'home', label: 'Workspace', href: '#workspace' },
        { id: 'folder', label: 'Operations', onSelect: () => {} },
        { id: 'object', label: 'Quarterly forecast' },
      ]}
    />
  ),
}

export const NarrowBreadcrumbs: Story = {
  name: 'Narrow breadcrumbs',
  render: () => (
    <div className="w-72 rounded border border-[var(--mtc-border)] p-3">
      <Breadcrumbs
        maxItems={3}
        items={[
          { label: 'Workspace', href: '#workspace' },
          { label: 'Shared objects', href: '#shared' },
          { label: 'Finance', href: '#finance' },
          { label: 'Forecasts', href: '#forecasts' },
          { label: 'Quarterly forecast' },
        ]}
      />
    </div>
  ),
}

function TabsExample({ orientation = 'horizontal' }: { orientation?: 'horizontal' | 'vertical' }) {
  const [value, setValue] = useState('overview')
  return (
    <Tabs
      label="Object sections"
      items={tabs}
      value={value}
      onValueChange={setValue}
      orientation={orientation}
    />
  )
}

function Panel({ title }: { title: string }) {
  return (
    <div className="min-h-32 rounded border border-[var(--mtc-border)] bg-[var(--mtc-surface)] p-4">
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-[var(--mtc-muted)]">Generic content supplied by the host application.</p>
    </div>
  )
}
