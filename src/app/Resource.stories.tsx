import { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Button, Icon, Panel } from '../components'
import { DataGrid, SourceErrorState } from '../workbench'
import {
  ResourceCacheProvider,
  SourceError,
  createResourceCache,
  useResource,
  type ResourceLoader,
} from '../app'

const meta = {
  title: 'Toolkit/App/useResource',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj

interface Bucket {
  name: string
  objects: number
  used: number
}

const BUCKETS: Bucket[] = [
  { name: 'finance', objects: 1284, used: 412_000_000_000 },
  { name: 'media', objects: 58_210, used: 1_900_000_000_000 },
]

// A fake transport: answers after a short delay (each answer one object
// newer), or fails the way a real product call does, with a typed
// SourceError. `onRequest` counts the requests made.
function fakeBuckets(onRequest: () => void, fail?: SourceError): ResourceLoader<Bucket[]> {
  let calls = 0
  return signal => new Promise((resolve, reject) => {
    calls += 1
    onRequest()
    const answer = BUCKETS.map(bucket => ({ ...bucket, objects: bucket.objects + calls - 1 }))
    const timer = setTimeout(() => (fail ? reject(fail) : resolve(answer)), 120)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(new DOMException('aborted', 'AbortError'))
    })
  })
}

function BucketsPanel({ title, load }: { title: string; load: ResourceLoader<Bucket[]> }) {
  const { data, error, status, validating, refresh } = useResource(['buckets'], load)
  return (
    <Panel
      title={title}
      subtitle={validating ? 'Refreshing…' : status === 'success' ? `${data?.length} buckets` : undefined}
      actions={<Button size="small" variant="ghost" startIcon={<Icon name="refresh" />} onClick={() => void refresh()}>Refresh</Button>}
    >
      {error && !data ? (
        <SourceErrorState error={error} resource="the buckets" onRetry={() => void refresh()} />
      ) : (
        <DataGrid
          label={`${title} buckets`}
          columns={[
            { id: 'name', header: 'Bucket', grow: true },
            { id: 'objects', header: 'Objects', kind: 'integer' },
            { id: 'used', header: 'Used', kind: 'bytes' },
          ]}
          rows={data ?? []}
          rowKey={row => row.name}
          loading={status === 'loading'}
          height="auto"
        />
      )}
    </Panel>
  )
}

function Workspace({ fail }: { fail?: SourceError }) {
  const [requests, setRequests] = useState(0)
  const cache = useMemo(() => createResourceCache(), [])
  const load = useMemo(() => fakeBuckets(() => setRequests(count => count + 1), fail), [fail])
  return (
    <ResourceCacheProvider cache={cache}>
      <div className="grid gap-4 p-6 md:grid-cols-2">
        <BucketsPanel title="Storage" load={load} />
        <BucketsPanel title="Quota" load={load} />
        <p role="status" aria-label="Requests" className="text-[color:var(--mtc-muted)] md:col-span-2">
          {requests === 1 ? '1 request' : `${requests} requests`}
        </p>
      </div>
    </ResourceCacheProvider>
  )
}

// Two panels read the same key: one request, one answer, and a refresh
// keeps the rows on screen while it runs.
export const CachedAndDeduplicated: Story = {
  name: 'Cached and deduplicated',
  render: () => <Workspace />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getAllByRole('gridcell', { name: 'finance' })).toHaveLength(2))
    await expect(canvas.getByRole('status', { name: 'Requests' })).toHaveTextContent('1 request')
    await userEvent.click(canvas.getAllByRole('button', { name: 'Refresh' })[0]!)
    await expect(canvas.getAllByText('Refreshing…')).toHaveLength(2)
    await expect(canvas.getAllByRole('gridcell', { name: 'finance' })).toHaveLength(2)
    await waitFor(() => expect(canvas.getAllByRole('gridcell', { name: '1,285' })).toHaveLength(2))
    await expect(canvas.getByRole('status', { name: 'Requests' })).toHaveTextContent('2 requests')
  },
}

const DENIED = new SourceError('storage:list scope required', { kind: 'forbidden', status: 403, requestId: 'req_7Q2' })

// A typed failure renders its state, not "HTTP 403".
export const TypedFailure: Story = {
  name: 'Typed failure',
  render: () => <Workspace fail={DENIED} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(canvas.getAllByText('You don’t have access')).toHaveLength(2))
    await expect(canvas.getByRole('status', { name: 'Requests' })).toHaveTextContent('1 request')
    await expect(canvas.queryByText(/HTTP 403/)).toBeNull()
  },
}
