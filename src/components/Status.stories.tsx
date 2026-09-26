import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import { Button, Pagination, StatTile, ToastProvider, TypeGlyph, useToast } from '.'

const meta = {
  title: 'Toolkit/Components/Status',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Status"
        title={context.name}
        description="Headline numbers, notifications and paging: the toolkit counterparts of the dashboard's metric, toaster and cursor pager, usable without a Dashboard."
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

export const StatTiles: Story = {
  name: 'StatTile',
  render: () => (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatTile label="Orders today" value="1,284" delta={{ value: '+4.2%', direction: 'up', tone: 'ok' }} description="vs. last Friday" />
      <StatTile label="p95 latency" value="182" unit="ms" delta={{ value: '+38 ms', direction: 'up', tone: 'danger' }} status={{ label: 'Degraded', tone: 'warning' }} />
      <StatTile label="Storage" value="2.3" unit="TB" status={{ label: 'Healthy', tone: 'ok' }} description="Of 5 TB · 46%" />
      <StatTile
        label="Placed"
        value="12"
        icon={<TypeGlyph icon="order" color="orange" size={16} />}
        href="#/explore?type=order"
        description="Orders linked"
      />
    </div>
  ),
}

function ToastButtons() {
  const { toast } = useToast()
  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => toast({ title: 'View saved', intent: 'success', duration: 0 })}>Save view</Button>
      <Button
        onClick={() => toast({
          title: 'Upload failed',
          description: 'report-q3.csv: the bucket is read-only.',
          intent: 'danger',
          duration: 0,
        })}
      >
        Fail an upload
      </Button>
      <Button
        onClick={() => toast({
          title: 'Moved 3 files to Archive',
          intent: 'neutral',
          action: { label: 'Undo', onClick: () => {} },
          duration: 0,
        })}
      >
        Move files
      </Button>
    </div>
  )
}

export const ToastStack: Story = {
  name: 'Toast',
  render: () => (
    <ToastProvider>
      <ToastButtons />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    await userEvent.click(canvas.getByRole('button', { name: 'Save view' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Fail an upload' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Move files' }))
    const region = await page.findByRole('region', { name: 'Notifications' })
    await expect(within(region).getByRole('alert')).toHaveTextContent('Upload failed')
    await expect(within(region).getAllByRole('status')).toHaveLength(2)
    await userEvent.click(within(region).getAllByRole('button', { name: 'Dismiss notification' })[0]!)
    await waitFor(() => expect(within(region).queryByText('View saved')).toBeNull())
  },
}

export const PaginationModes: Story = {
  name: 'Pagination',
  render: () => {
    const [page, setPage] = useState(2)
    const [cursor, setCursor] = useState(0)
    return (
      <div className="grid max-w-2xl gap-4">
        <Pagination label="Record pages" page={page} pageCount={5} onPageChange={setPage} summary={`${(page - 1) * 25 + 1}–${page * 25} of 118`} />
        <Pagination
          label="Object pages"
          hasPrevious={cursor > 0}
          hasNext={cursor < 2}
          onPrevious={() => setCursor(value => value - 1)}
          onNext={() => setCursor(value => value + 1)}
          summary={`Page ${cursor + 1} · opaque cursors`}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const records = canvas.getByRole('navigation', { name: 'Record pages' })
    await userEvent.click(within(records).getByRole('button', { name: 'Next' }))
    await expect(within(records).getByText('Page 3 of 5')).toBeVisible()
    const objects = canvas.getByRole('navigation', { name: 'Object pages' })
    await expect(within(objects).getByRole('button', { name: 'Previous' })).toBeDisabled()
    await userEvent.click(within(objects).getByRole('button', { name: 'Next' }))
    await expect(within(objects).getByRole('button', { name: 'Previous' })).toBeEnabled()
  },
}
