import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Badge, Button, Icon, IconButton, Input } from '../components'
import {
  AppSurface,
  EmptyState,
  ErrorState,
  Inspector,
  LoadingState,
  PropertyList,
  Sidebar,
  SplitPane,
  Toolbar,
  Tree,
  type TreeItem,
} from '.'

const meta = {
  title: 'Toolkit/Workbench/Primitives',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj

const explorerItems: TreeItem[] = [
  {
    id: 'objects',
    label: 'Objects',
    icon: <Icon name="folder" />,
    children: [
      { id: 'customers', label: 'Customers', icon: <Icon name="file" /> },
      { id: 'orders', label: 'Orders', icon: <Icon name="file" /> },
    ],
  },
  {
    id: 'models',
    label: 'Models',
    icon: <Icon name="folder" />,
    children: [{ id: 'forecast', label: 'Forecast', icon: <Icon name="file" /> }],
  },
]

export const AppSurfaceToolbarSidebarAndInspector: Story = {
  render: () => (
    <AppSurface className="h-[36rem]">
      <Toolbar
        label="Object toolbar"
        start={<strong className="text-sm">Object workbench</strong>}
        end={<Badge dot intent="success">Connected</Badge>}
      >
        <Input aria-label="Search workbench" placeholder="Search" className="w-56" />
        <Button size="small">Filter</Button>
      </Toolbar>
      <div className="flex min-h-0 flex-1">
        <Sidebar label="Explorer" header={<span className="text-xs font-semibold">Explorer</span>}>
          <TreeExample />
        </Sidebar>
        <main className="min-w-0 flex-1 overflow-auto p-5">
          <h1 className="text-lg font-semibold">Application content</h1>
          <p className="mt-2 text-sm text-[var(--mtc-muted)]">
            AppSurface and its panes own layout only; the host owns data and routing.
          </p>
        </main>
        <Inspector
          label="Inspector"
          title="Quarterly forecast"
          subtitle="Model object"
          actions={<IconButton icon={<Icon name="more" />} aria-label="Inspector actions" size="small" />}
        >
          <PropertyList
            properties={{ owner: 'Jun', status: 'Active', version: 12, updated: '2 minutes ago' }}
          />
        </Inspector>
      </div>
    </AppSurface>
  ),
}

export const SplitPaneKeyboardResize: Story = {
  render: () => <SplitPaneExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const separator = canvas.getByRole('separator', { name: 'Resize explorer and content' })
    separator.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    await expect(canvas.getByTestId('pane-size')).toHaveTextContent('50%')
    await userEvent.keyboard('{Home}')
    await expect(canvas.getByTestId('pane-size')).toHaveTextContent('20%')
  },
}

export const TreeSelectionAndExpansion: Story = {
  render: () => <TreeExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const objects = canvas.getByRole('treeitem', { name: /Objects/ })
    objects.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowDown}{Enter}')
    await expect(canvas.getByRole('treeitem', { name: /Customers/ })).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{ArrowLeft}')
    await expect(objects).toHaveFocus()
  },
}

export const PropertyListArbitraryData: Story = {
  render: () => (
    <div className="mx-auto mt-8 max-w-xl rounded border border-[var(--mtc-border)] bg-[var(--mtc-surface)]">
      <PropertyList
        items={[
          { id: 'name', label: 'Name', value: 'Quarterly forecast' },
          { id: 'active', label: 'Active', value: true },
          { id: 'owners', label: 'Owners', value: ['Jun', 'Finance'] },
          { id: 'config', label: 'Configuration', value: { horizon: 90, currency: 'USD' } },
          { id: 'empty', label: 'Description', value: null },
        ]}
      />
    </div>
  ),
}

const retry = fn()

export const EmptyLoadingAndErrorStates: Story = {
  render: () => (
    <div className="grid min-h-screen grid-cols-1 gap-px bg-[var(--mtc-border)] md:grid-cols-3">
      <div className="bg-[var(--mtc-surface)]">
        <EmptyState
          title="No objects yet"
          description="Create an object or change the active filter."
          icon={<Icon name="folder" />}
          actions={<Button size="small">Create object</Button>}
        />
      </div>
      <div className="bg-[var(--mtc-surface)]">
        <LoadingState label="Loading objects" description="Reading the latest snapshot" variant="skeleton" />
      </div>
      <div className="bg-[var(--mtc-surface)]">
        <ErrorState message="The source did not respond." onRetry={retry} />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('status')).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }))
    await expect(retry).toHaveBeenCalled()
  },
}

export const NarrowStackedPane: Story = {
  render: () => (
    <div className="h-[42rem] max-w-[32rem]">
      <SplitPane
        primary={<div className="min-h-48 bg-[var(--mtc-surface)] p-4">Explorer</div>}
        secondary={<div className="min-h-64 bg-[var(--mtc-bg)] p-4">Content canvas</div>}
        stackOnNarrow
      />
    </div>
  ),
}

function SplitPaneExample() {
  const [size, setSize] = useState(40)
  return (
    <AppSurface className="h-[30rem]">
      <Toolbar label="Pane status" end={<output data-testid="pane-size">{size}%</output>}>
        Keyboard-resizable pane
      </Toolbar>
      <SplitPane
        primary={<div className="h-full bg-[var(--mtc-surface)] p-4">Explorer</div>}
        secondary={<div className="h-full bg-[var(--mtc-bg)] p-4">Content</div>}
        size={size}
        onSizeChange={setSize}
        minSize={20}
        maxSize={80}
        separatorLabel="Resize explorer and content"
      />
    </AppSurface>
  )
}

function TreeExample() {
  const [selectedId, setSelectedId] = useState('objects')
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(new Set())
  return (
    <Tree
      label="Model explorer"
      items={explorerItems}
      selectedId={selectedId}
      onSelectionChange={setSelectedId}
      expandedIds={expandedIds}
      onExpandedChange={setExpandedIds}
    />
  )
}

