import { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Button, Icon, StatusBadge, TypeGlyph, type CommandGroup } from '../components'
import { ObjectHeader } from '../objects'
import { DataGrid, EmptyState, PageHeader, PropertyList, type NavRailSection } from '../workbench'
import {
  OperationsTray,
  ProductShell,
  RENEW_LEAD_MS,
  createMemoryRouter,
  useRoute,
  useRouter,
  type Operation,
  type SessionPort,
} from '../app'

const meta = {
  title: 'Toolkit/App/ProductShell',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj

const ROUTES = {
  buckets: '/buckets',
  file: '/b/:bucket/f/*path',
  browse: '/b/:bucket/*path',
  activity: '/activity',
} as const

const NAV: NavRailSection[] = [
  {
    id: 'main',
    items: [
      { id: 'buckets', label: 'Buckets', icon: 'bucket', href: '/buckets' },
      { id: 'finance', label: 'finance', icon: 'folder', href: '/b/finance', count: 1284 },
      { id: 'media', label: 'media', icon: 'folder', href: '/b/media', count: 58 },
      { id: 'activity', label: 'Activity', icon: 'activity', href: '/activity' },
    ],
  },
]

interface FileRow {
  name: string
  size: number
  modified: string
}

const FILES: FileRow[] = [
  { name: 'q3-forecast.csv', size: 48_200, modified: '2026-09-24' },
  { name: 'board-deck.pdf', size: 2_400_000, modified: '2026-09-22' },
  { name: 'notes.md', size: 3_120, modified: '2026-09-21' },
  { name: 'payroll-2026-08.xlsx', size: 912_000, modified: '2026-09-02' },
]

const OPERATIONS: Operation[] = [
  { id: 'up-1', label: 'board-deck-v2.pdf', detail: '1.8 of 4.2 MB · finance/', status: 'running', progress: 0.43, cancellable: true },
  { id: 'up-2', label: 'site-photos.zip', detail: 'Waiting for a free slot', status: 'queued', cancellable: true },
  { id: 'up-3', label: 'payroll-2026-09.xlsx', detail: 'The bucket is read-only for you.', status: 'failed', retryable: true },
  { id: 'up-4', label: 'q3-forecast.csv', detail: '48.2 kB', status: 'succeeded' },
]

function Pages() {
  const route = useRoute(ROUTES)
  const router = useRouter()
  if (!route) return <EmptyState title="Not found" description="No page lives at this address." />
  if (route.id === 'buckets') {
    return (
      <>
        <PageHeader title="Buckets" description="Storage you can read in this workspace." />
        <div className="grid gap-3 p-6 sm:grid-cols-2">
          {['finance', 'media'].map(bucket => (
            <Button key={bucket} startIcon={<Icon name="bucket" />} onClick={() => router.navigate(`/b/${bucket}`)}>
              Open {bucket}
            </Button>
          ))}
        </div>
      </>
    )
  }
  if (route.id === 'activity') return <PageHeader title="Activity" description="Uploads and ingests." />
  const bucket = route.params.bucket
  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        breadcrumbs={[{ label: 'Buckets', onSelect: () => router.navigate('/buckets') }, { label: bucket }]}
        title={bucket}
        actions={<Button intent="primary" variant="solid" startIcon={<Icon name="upload" />}>Upload</Button>}
      />
      <div className="min-h-0 flex-1 p-6">
        <DataGrid
          label={`Files in ${bucket}`}
          columns={[
            { id: 'name', header: 'Name', grow: true },
            { id: 'size', header: 'Size', kind: 'bytes' },
            { id: 'modified', header: 'Modified', kind: 'date' },
          ]}
          rows={FILES}
          rowKey={row => row.name}
          rowHref={row => router.href(`/b/${bucket}/f/${row.name}`)}
          onNavigate={row => router.navigate(`/b/${bucket}/f/${row.name}`)}
          height={260}
        />
      </div>
    </div>
  )
}

const signedIn: SessionPort = {
  load: async () => ({ authenticated: true, subject: 'user:jamie', displayName: 'Jamie Kim', expiresAt: Date.parse('2099-01-01T00:00:00Z') }),
  renew: async () => ({ authenticated: true, displayName: 'Jamie Kim', expiresAt: Date.parse('2099-01-01T00:00:00Z') }),
  signIn: fn(),
  signOut: fn(),
}

function StorageShell({ initialPath = '/b/finance', operations = OPERATIONS, session = signedIn }: { initialPath?: string; operations?: Operation[]; session?: SessionPort }) {
  const router = useMemo(() => createMemoryRouter(initialPath), [initialPath])
  const [query, setQuery] = useState('')
  const [ops, setOps] = useState(operations)
  const groups = useMemo<CommandGroup[]>(() => [{
    id: 'files',
    label: 'Files',
    items: FILES
      .filter(file => file.name.includes(query.trim().toLowerCase()))
      .map(file => ({ id: file.name, label: file.name, description: 'finance', icon: <Icon name="file" /> })),
  }], [query])
  return (
    <ProductShell
      product={{ name: 'Storage', icon: 'bucket', home: '/buckets' }}
      router={router}
      session={session}
      nav={NAV}
      scope={<Button size="small" endIcon={<Icon name="chevron-down" />}>Northstar workspace</Button>}
      search={{ placeholder: 'Search files', query, onQueryChange: setQuery, groups, onSelect: item => { document.title = `Opened ${item.id}` } }}
      status={(
        <>
          <StatusBadge tone="warning">Prototype data</StatusBadge>
          <span>Catalog fresh 2 min ago</span>
          <span className="ml-auto">en · UTC</span>
        </>
      )}
      inspector={(
        <div className="grid gap-3 p-3">
          <ObjectHeader compact type={{ label: 'File', icon: 'file', color: 'cyan' }} title="q3-forecast.csv" objectId="finance/q3-forecast.csv" />
          <PropertyList items={[
            { id: 'size', label: 'Size', value: 48_200, kind: 'bytes' },
            { id: 'type', label: 'Type', value: 'text/csv' },
            { id: 'modified', label: 'Modified', value: '2026-09-24', kind: 'date' },
          ]}
          />
        </div>
      )}
      operations={ops}
      onRetryOperation={id => setOps(current => current.map(op => (op.id === id ? { ...op, status: 'running', progress: 0.05, detail: 'Retrying' } : op)))}
      onDismissOperation={id => setOps(current => current.filter(op => op.id !== id))}
      onCancelOperation={id => setOps(current => current.map(op => (op.id === id ? { ...op, status: 'cancelled' } : op)))}
    >
      <Pages />
    </ProductShell>
  )
}

// Interactions are covered by the browser suite (desktop and phone), so the
// story itself renders without a play and baselines stay deterministic.
export const StandaloneShell: Story = {
  name: 'Standalone',
  render: () => <StorageShell />,
}

function expiringPort(): SessionPort {
  let attempts = 0
  return {
    load: async () => ({ authenticated: true, displayName: 'Jamie Kim', expiresAt: Date.now() - 1000 }),
    renew: async () => {
      attempts += 1
      if (attempts === 1) throw new Error('renewal refused')
      return { authenticated: true, displayName: 'Jamie Kim', expiresAt: Date.now() + 5 * 60_000 }
    },
    signIn: fn(),
  }
}

// The first renewal is refused, so the page stays mounted under the dialog;
// the browser suite continues it (the second renewal succeeds).
export const SessionExpired: Story = {
  name: 'Session expired',
  render: () => <StorageShell session={useMemo(expiringPort, [])} operations={[]} />,
}

const renewed = fn()

// The token expires a minute and a second after the page loads: the shell
// renews it about a second later (a minute ahead of expiry), not at once.
export const RenewsBeforeExpiry: Story = {
  name: 'Renews before expiry',
  render: () => (
    <StorageShell
      operations={[]}
      session={useMemo<SessionPort>(() => ({
        load: async () => ({ authenticated: true, displayName: 'Jamie Kim', expiresAt: Date.now() + RENEW_LEAD_MS + 1_000 }),
        renew: async () => {
          renewed()
          return { authenticated: true, displayName: 'Jamie Kim', expiresAt: Date.now() + 5 * 60_000 }
        },
        signIn: fn(),
      }), [])}
    />
  ),
  play: async ({ canvasElement }) => {
    renewed.mockClear()
    await within(canvasElement).findByRole('grid', { name: 'Files in finance' })
    await expect(renewed).not.toHaveBeenCalled()
    await waitFor(() => expect(renewed).toHaveBeenCalledTimes(1), { timeout: 4_000 })
    await expect(within(canvasElement).queryByRole('dialog')).toBeNull()
  },
}

const signIn = fn()

export const SignedOut: Story = {
  name: 'Signed out',
  render: () => (
    <StorageShell
      operations={[]}
      session={useMemo<SessionPort>(() => ({
        load: async () => ({ authenticated: false, signInUrl: 'https://app.example/auth/sign-in' }),
        renew: async () => { throw new Error('signed out') },
        signIn,
      }), [])}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(await canvas.findByRole('button', { name: 'Sign in' }))
    await expect(signIn).toHaveBeenCalledWith('/b/finance', expect.objectContaining({ signInUrl: 'https://app.example/auth/sign-in' }))
  },
}

export const EmbeddedPage: Story = {
  name: 'Embedded (chrome-less)',
  render: () => {
    const router = useMemo(() => createMemoryRouter('/b/finance'), [])
    return (
      <ProductShell product={{ name: 'Storage', icon: 'bucket' }} router={router} session={signedIn} mode="embed" embedOrigins={['https://app.example']}>
        <Pages />
      </ProductShell>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('grid', { name: 'Files in finance' })).toBeVisible()
    await expect(canvas.queryByRole('navigation', { name: 'Product navigation' })).toBeNull()
  },
}

const retried = fn()

export const OperationsTrayStates: Story = {
  name: 'OperationsTray',
  render: () => (
    <div className="mx-auto grid max-w-xl gap-3 p-6">
      <PageHeader title="Activity" description="Uploads and ingests in this workspace." />
      <OperationsTray
        placement="inline"
        title="Uploads"
        operations={OPERATIONS}
        onRetry={retried}
        onCancel={() => {}}
        onDismiss={() => {}}
        onClearFinished={() => {}}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const tray = await within(canvasElement).findByRole('region', { name: 'Uploads' })
    await expect(within(tray).getByRole('progressbar', { name: 'board-deck-v2.pdf' })).toHaveAttribute('aria-valuenow', '43')
    await userEvent.click(within(tray).getByRole('button', { name: 'Retry payroll-2026-09.xlsx' }))
    await expect(retried).toHaveBeenCalledWith('up-3')
    const toggle = within(tray).getByRole('button', { name: /Uploads/ })
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  },
}

export const WithoutSession: Story = {
  name: 'Without a session',
  render: () => {
    const router = useMemo(() => createMemoryRouter('/buckets'), [])
    return (
      <ProductShell
        product={{ name: 'Tables', icon: 'table' }}
        router={router}
        scope={<Button size="small" startIcon={<TypeGlyph icon="dataset" color="cyan" size={16} />} endIcon={<Icon name="chevron-down" />}>Sales base</Button>}
        nav={[{ id: 'main', items: [{ id: 'bases', label: 'Bases', icon: 'database', href: '/buckets' }] }]}
      >
        <PageHeader title="Bases" description="Tables and records in this workspace." />
      </ProductShell>
    )
  },
}

export const LongNavigation: Story = {
  render: () => {
    const router = useMemo(() => createMemoryRouter('/destinations/0'), [])
    const sections: NavRailSection[] = [{
      id: 'workspace',
      items: [{ id: 'overview', label: 'Overview', icon: 'home', href: '/' }],
    }, {
      id: 'destinations',
      label: 'Workspace_destinations_with_a_long_unbroken_section_name',
      items: Array.from({ length: 40 }, (_, index) => ({
        id: String(index),
        label: `destination-${String(index).padStart(2, '0')}-with-a-long-unbroken-name`,
        icon: 'folder',
        href: `/destinations/${index}`,
      })),
    }]
    return (
      <ProductShell product={{ name: 'Workspace', icon: 'folder' }} router={router} session={signedIn} nav={sections}>
        <PageHeader title="Navigation" description="Long destinations remain reachable at every viewport size." />
      </ProductShell>
    )
  },
}
