import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import {
  Avatar,
  Button,
  CopyButton,
  Icon,
  IconButton,
  Kbd,
  MetaRow,
  Panel,
  Skeleton,
  StatusBadge,
} from '.'

const meta = {
  title: 'Toolkit/Components/Display',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Display"
        title={context.name}
        description="Small display primitives shared by object pages, grids and product shells: status, keys, avatars, loading placeholders, copy actions, metadata rows and panels."
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

export const StatusKeysAndAvatars: Story = {
  name: 'StatusBadge, Kbd, Avatar & MetaRow',
  render: () => (
    <div className="grid gap-6">
      <section className="grid gap-2" aria-label="Status tones">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="ok">Active</StatusBadge>
          <StatusBadge tone="warning">Needs review</StatusBadge>
          <StatusBadge tone="danger">Failed</StatusBadge>
          <StatusBadge tone="info">Running</StatusBadge>
          <StatusBadge tone="neutral">Cancelled</StatusBadge>
          <StatusBadge tone="ok" size="medium">Healthy</StatusBadge>
        </div>
      </section>
      <section className="grid gap-2" aria-label="Keyboard hints">
        <p className="leading-7 text-[length:var(--mtc-font-size-sm)] text-[var(--mtc-muted)]">
          Search with <Kbd>Ctrl</Kbd> <Kbd>K</Kbd>, focus the filter with <Kbd>/</Kbd>, close with <Kbd>Esc</Kbd>.
        </p>
      </section>
      <section className="flex flex-wrap items-center gap-3" aria-label="Avatars">
        <Avatar name="Jamie Kim" />
        <Avatar name="Morgan Lee" />
        <Avatar name="Sync CRM" />
        <Avatar name="Ada Morgan" size={32} />
        <span className="flex items-center gap-2">
          <Avatar name="Daniel Reyes" decorative />
          <span>Daniel Reyes</span>
        </span>
      </section>
      <section aria-label="Metadata">
        <MetaRow
          items={[
            'Updated 18 min ago by Jamie Kim',
            'Revision 14',
            <span key="source">Source <a className="text-[var(--mtc-link)]" href="#/datasets/customer_360">gold.customer_360</a></span>,
          ]}
        />
      </section>
    </div>
  ),
}

const clipboardWrites: string[] = []
const copied = fn()
const fakeClipboard = {
  async writeText(text: string) {
    clipboardWrites.push(text)
  },
}

export const SkeletonsAndCopy: Story = {
  name: 'Skeleton & CopyButton',
  render: () => (
    <div className="grid gap-6 sm:grid-cols-2">
      <section className="grid gap-3" aria-label="Loading placeholders" aria-busy="true">
        <div className="flex items-center gap-3">
          <Skeleton shape="circle" />
          <Skeleton width="40%" />
        </div>
        <Skeleton lines={3} />
        <Skeleton shape="block" />
      </section>
      <section className="grid content-start gap-3" aria-label="Copy actions">
        <div className="flex items-center gap-2">
          <code className="font-mono text-[length:var(--mtc-font-size-sm)]">sha256:9f2c41e0a7</code>
          <CopyButton value="sha256:9f2c41e0a7" label="Copy hash" clipboard={fakeClipboard} onCopied={copied} />
        </div>
        <div className="flex items-center gap-2">
          <code className="font-mono text-[length:var(--mtc-font-size-sm)]">res-customer-northstar</code>
          <CopyButton value="res-customer-northstar" label="Copy object ID" clipboard={fakeClipboard} />
        </div>
      </section>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Copy hash' }))
    await expect(copied).toHaveBeenCalledWith('sha256:9f2c41e0a7')
    await expect(clipboardWrites).toContain('sha256:9f2c41e0a7')
    await waitFor(() => expect(canvas.getAllByRole('status').some(node => node.textContent === 'Copied')).toBe(true))
  },
}

export const PanelFrame: Story = {
  name: 'Panel',
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Panel
        title="Recent syncs"
        subtitle="3 runs"
        actions={<IconButton icon={<Icon name="refresh" />} aria-label="Refresh syncs" variant="ghost" size="small" />}
      >
        <ul className="grid">
          {['CRM accounts', 'Billing invoices', 'Support tickets'].map(name => (
            <li key={name} className="flex items-center justify-between border-b border-[var(--mtc-border)] px-3 py-2 last:border-b-0">
              <span>{name}</span>
              <StatusBadge tone="ok">Succeeded</StatusBadge>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Notes" padded footer={<Button size="small">Add note</Button>}>
        <p className="text-[var(--mtc-fg-soft)]">
          Panels are flat: a 1 px border, a 36 px header, and no shadow. Elevation belongs to overlays.
        </p>
      </Panel>
    </div>
  ),
}
