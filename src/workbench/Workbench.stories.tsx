import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Badge, Button, Icon, IconButton, Input } from '../components'
import { SourceError } from '../core/sourceError'
import {
  AccessDeniedState,
  AppSurface,
  EmptyState,
  ErrorState,
  Inspector,
  LoadingState,
  NotFoundState,
  PropertyList,
  RateLimitedState,
  SessionExpiredState,
  Sidebar,
  SignedOutState,
  SourceErrorState,
  SplitPane,
  StaleState,
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

const signIn = fn()
const renewSession = fn()
const retryThrottled = fn()
const refreshStale = fn()
const retryUnavailable = fn()
const STALE_NOW = Date.UTC(2026, 8, 25, 12, 0)
const DENIED = new SourceError('payroll:read scope required', {
  kind: 'forbidden',
  status: 403,
  code: 'permission_denied',
  requestId: 'req_81M',
})
const UNAVAILABLE = new SourceError('dependency unavailable', {
  kind: 'unavailable',
  status: 503,
  code: 'unavailable',
  requestId: 'req_4Q2',
})
const INVALID = new SourceError('page_size must be between 1 and 100', {
  kind: 'invalid',
  status: 400,
  code: 'invalid_argument',
})

export const AccessSessionAndFreshnessStates: Story = {
  name: 'Access, session and freshness states',
  render: () => (
    <div className="grid min-h-screen grid-cols-1 gap-px bg-[var(--mtc-border)] md:grid-cols-3">
      <div className="bg-[var(--mtc-surface)]"><AccessDeniedState resource="bucket finance" error={DENIED} /></div>
      <div className="bg-[var(--mtc-surface)]"><SessionExpiredState onContinue={renewSession} /></div>
      <div className="bg-[var(--mtc-surface)]"><SignedOutState onSignIn={signIn} /></div>
      <div className="bg-[var(--mtc-surface)]"><NotFoundState resource="Report Q3 2026" /></div>
      <div className="bg-[var(--mtc-surface)]"><RateLimitedState retryAfterMs={30_000} onRetry={retryThrottled} /></div>
      <div className="bg-[var(--mtc-surface)]">
        <StaleState lastUpdated={STALE_NOW - 7 * 60_000} now={STALE_NOW} onRefresh={refreshStale} />
      </div>
      <div className="bg-[var(--mtc-surface)]"><SourceErrorState error={UNAVAILABLE} onRetry={retryUnavailable} /></div>
      <div className="bg-[var(--mtc-surface)]"><SourceErrorState error={INVALID} /></div>
      <div className="bg-[var(--mtc-surface)]"><StaleState compact /></div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Ask an owner of bucket finance for access.')).toBeVisible()
    // Raw server detail stays behind Details until asked for.
    const requestId = canvas.getByText('req_81M')
    await expect(requestId).not.toBeVisible()
    await userEvent.click(canvas.getAllByText('Details')[0]!)
    await expect(requestId).toBeVisible()
    await expect(canvas.getByText('payroll:read scope required')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
    await expect(renewSession).toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Sign in' }))
    await expect(signIn).toHaveBeenCalled()
    await expect(canvas.getByText('Try again in 30 seconds.')).toBeVisible()
    await expect(canvas.getByText('Last updated 7 minutes ago.')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Refresh' }))
    await expect(refreshStale).toHaveBeenCalled()
    await expect(canvas.getByText('Service unavailable')).toBeVisible()
    await expect(canvas.getByText('Request not accepted')).toBeVisible()
    // Leave the canvas as rendered, so the visual baseline never depends on
    // how far this play function got before the screenshot.
    await userEvent.click(canvas.getAllByText('Details')[0]!)
    ;(document.activeElement as HTMLElement | null)?.blur()
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

