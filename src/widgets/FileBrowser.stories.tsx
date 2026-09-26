import { Suspense } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { TypeGlyph } from '../components/TypeGlyph'
import { FileBrowser } from './FileBrowser'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT } from '../core/DashboardContext'
import {
  AssetOpenProvider,
  type AssetApplicationFrameProps,
  type AssetAppRendererProps,
  type ResolveAssetIntent,
} from '../core/AssetOpen'

function JimVideoPlayer({ asset }: AssetAppRendererProps) {
  return (
    <div className="h-full min-h-[26rem] bg-black flex items-center justify-center">
      <div className="w-full max-w-3xl aspect-video border border-zinc-800 bg-zinc-950 shadow-2xl flex flex-col">
        <div className="flex-1 flex items-center justify-center text-5xl text-zinc-700">▶</div>
        <div className="h-12 border-t border-zinc-800 px-4 flex items-center gap-3">
          <span className="size-2 rounded-full bg-sky-400" />
          <span className="text-xs text-zinc-300 truncate">{asset.name}</span>
          <span className="ml-auto text-[10px] uppercase tracking-wider text-zinc-600">
            Jim Technologies
          </span>
        </div>
      </div>
    </div>
  )
}

function ReviewRoomPlayer({ asset }: AssetAppRendererProps) {
  return (
    <div className="h-full min-h-[26rem] grid grid-cols-[1fr_18rem] bg-zinc-950">
      <div className="m-4 border border-zinc-800 bg-black flex items-center justify-center text-zinc-600">
        Review preview · {asset.name}
      </div>
      <aside className="border-l border-zinc-800 p-4 text-xs text-zinc-500">
        <div className="uppercase tracking-wider text-[10px] mb-3">Review notes</div>
        No comments yet.
      </aside>
    </div>
  )
}

function WorkspaceApplicationPane({
  request,
  application,
  Renderer,
  close,
  chooseApplication,
}: AssetApplicationFrameProps) {
  return (
    <section
      role="region"
      aria-label={`${application.name} workspace pane`}
      className="fixed inset-y-8 right-8 z-[60] w-[min(48rem,calc(100vw-4rem))] overflow-hidden rounded-lg border border-zinc-700 bg-zinc-950 shadow-2xl"
    >
      <header className="h-11 flex items-center gap-2 border-b border-zinc-800 px-3">
        <span className="text-xs text-zinc-200">{application.name}</span>
        <span className="min-w-0 flex-1 truncate text-[10px] text-zinc-500">
          {request.asset.name}
        </span>
        <button type="button" onClick={chooseApplication} className="text-xs text-zinc-400">
          Open with…
        </button>
        <button type="button" onClick={close} className="text-xs text-zinc-400">
          Close pane
        </button>
      </header>
      <Suspense fallback={<div className="p-4 text-xs text-zinc-500">Loading…</div>}>
        <Renderer
          asset={request.asset}
          intent={request.intent}
          application={application}
          launchContext={application.launchContext}
          close={close}
          chooseApplication={chooseApplication}
        />
      </Suspense>
    </section>
  )
}

const resolveWorkspacePlayer: ResolveAssetIntent = request => ({
  applications: [
    {
      id: 'jim-player-installation',
      name: 'Jim Video Player',
      description: 'Focused playback with workspace controls',
      renderer: 'jim-video-player',
      accepts: ['video/*'],
      intents: ['play'],
      icon: 'JP',
      launchContext: { assetId: request.asset.id },
    },
    {
      id: 'review-room-installation',
      name: 'Review Room',
      description: 'Playback with comments and approvals',
      renderer: 'review-room-player',
      accepts: ['video/mp4'],
      intents: ['play'],
      icon: 'RR',
    },
  ],
  preferredApplicationId: 'jim-player-installation',
})
const saveWorkspacePreference = fn()

const meta: Meta<typeof FileBrowser> = {
  title: 'Widgets/FileBrowser',
  component: FileBrowser,
  decorators: [
    (Story) => (
      <DashboardContext.Provider
        value={{ ...DEFAULT_DASHBOARD_CONTEXT, ctx: { namespace: 'photos', path: '2024' } }}
      >
        <div style={{ height: 420, width: 720, margin: 16, background: 'var(--mtc-surface)', border: '1px solid var(--mtc-border)', borderRadius: 'var(--mtc-radius-md)' }}>
          <Story />
        </div>
      </DashboardContext.Provider>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof FileBrowser>

export const Mixed: Story = {
  args: {
    data: {
      entries: [
        { kind: 'folder', name: 'travel' },
        { kind: 'folder', name: 'birthdays' },
        { kind: 'file', name: 'beach.jpg', size_bytes: 2_300_000, content_type: 'image/jpeg', modified_at: '2026-03-12' },
        { kind: 'file', name: 'notes.txt', size_bytes: 412, content_type: 'text/plain', modified_at: '2026-03-08' },
        { kind: 'file', name: 'cake.png',  size_bytes: 980_000, content_type: 'image/png', modified_at: '2026-02-19' },
      ],
    },
  },
}

export const EmptyFolder: Story = {
  args: { data: { entries: [] } },
}

export const OnlyFolders: Story = {
  args: {
    data: {
      entries: [
        { kind: 'folder', name: 'archive' },
        { kind: 'folder', name: 'shared' },
        { kind: 'folder', name: 'inbox' },
      ],
    },
  },
}

export const WorkspaceApplications: Story = {
  decorators: [
    Story => (
      <AssetOpenProvider
        resolveAssetIntent={resolveWorkspacePlayer}
        renderers={{
          'jim-video-player': JimVideoPlayer,
          'review-room-player': ReviewRoomPlayer,
        }}
        savePreference={saveWorkspacePreference}
      >
        <Story />
      </AssetOpenProvider>
    ),
  ],
  args: {
    data: {
      entries: [
        { kind: 'folder', name: 'campaigns' },
        {
          id: 'asset-launch-reel',
          kind: 'file',
          name: 'launch-reel.mp4',
          size_bytes: 48_200_000,
          content_type: 'video/mp4',
          modified_at: '2026-07-22',
        },
        {
          id: 'asset-brief',
          kind: 'file',
          name: 'launch-brief.pdf',
          size_bytes: 840_000,
          content_type: 'application/pdf',
          modified_at: '2026-07-21',
        },
      ],
    },
    options: {
      open_with: true,
      download_url: '/download',
      media_url_template: '/media?namespace={namespace}&path={path}',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Open launch-reel.mp4 with another application',
      }),
    )
    const chooser = await canvas.findByRole('dialog', {
      name: 'Open launch-reel.mp4 with',
    })
    await waitFor(async () => {
      await expect(
        within(chooser).getByRole('button', { name: /Jim Video Player/ }),
      ).toBeVisible()
      await expect(
        within(chooser).getByRole('button', { name: /Review Room/ }),
      ).toBeVisible()
    })
    await userEvent.click(
      within(chooser).getByRole('checkbox', {
        name: 'Always use my choice for video/mp4',
      }),
    )
    await userEvent.click(
      within(chooser).getByRole('button', { name: /Jim Video Player/ }),
    )
    await expect(saveWorkspacePreference).toHaveBeenCalledWith(
      expect.objectContaining({
        selection: {
          kind: 'application',
          applicationId: 'jim-player-installation',
        },
      }),
    )
    const player = await canvas.findByRole('dialog', {
      name: 'Jim Video Player: launch-reel.mp4',
    })
    await expect(within(player).getByText('Jim Technologies')).toBeVisible()
  },
}

export const HostControlledApplicationPane: Story = {
  decorators: [
    Story => (
      <AssetOpenProvider
        resolveAssetIntent={resolveWorkspacePlayer}
        renderers={{
          'jim-video-player': JimVideoPlayer,
          'review-room-player': ReviewRoomPlayer,
        }}
        applicationFrame={WorkspaceApplicationPane}
      >
        <Story />
      </AssetOpenProvider>
    ),
  ],
  args: WorkspaceApplications.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Open launch-reel.mp4 with another application',
      }),
    )
    const chooser = await canvas.findByRole('dialog', {
      name: 'Open launch-reel.mp4 with',
    })
    await userEvent.click(
      within(chooser).getByRole('button', { name: /Jim Video Player/ }),
    )
    const pane = await canvas.findByRole('region', {
      name: 'Jim Video Player workspace pane',
    })
    await expect(within(pane).getByText('Jim Technologies')).toBeVisible()
    await expect(canvas.queryByRole('dialog', {
      name: 'Jim Video Player: launch-reel.mp4',
    })).not.toBeInTheDocument()
  },
}

const opened = fn()
const renamed = fn()
const selected = fn()

export const HostExtensions: Story = {
  args: {
    data: {
      entries: [
        { kind: 'folder', name: 'contracts', path: 'finance/contracts' },
        { id: 'obj-q3', kind: 'file', name: 'q3-forecast.csv', size_bytes: 48_200, content_type: 'text/csv', modified_at: '2026-09-24T16:20:00Z', path: 'finance/q3-forecast.csv' },
        { id: 'obj-board', kind: 'file', name: 'board-deck.pdf', size_bytes: 2_400_000, content_type: 'application/pdf', modified_at: '2026-09-22T09:05:00Z', path: 'finance/board-deck.pdf' },
        { id: 'obj-notes', kind: 'file', name: 'notes.md', size_bytes: 3_120, content_type: 'text/markdown', modified_at: '2026-09-21T11:40:00Z', path: 'finance/notes.md' },
      ],
    },
    selection: 'multi',
    entryIcon: entry => (entry.kind === 'folder' ? <TypeGlyph icon="folder" color="azure" size={16} /> : undefined),
    entryHref: (_entry, path) => `#/b/finance/f/${path}`,
    onOpen: (entry, path) => {
      opened(path)
      return entry.kind !== 'folder'
    },
    onSelectionChange: entries => selected(entries.map(entry => entry.name)),
    contextActions: (entry, path) => [
      { id: 'rename', label: 'Rename', shortcut: 'F2', onSelect: () => renamed(path) },
      { id: 'download', label: 'Download', disabled: entry.kind === 'folder' },
      { id: 'sep', separator: true },
      { id: 'delete', label: 'Delete', intent: 'danger' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = canvas.getByRole('grid', { name: /Files in/ })
    await expect(canvasElement.querySelector('[data-mtc-file-browser]')).not.toBeNull()
    const rows = grid.querySelectorAll('[data-mtc-entry-kind="file"]')
    await expect(rows).toHaveLength(3)
    await expect(canvas.getByRole('link', { name: 'q3-forecast.csv' })).toHaveAttribute('href', '#/b/finance/f/finance/q3-forecast.csv')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Select q3-forecast.csv' }))
    await expect(selected).toHaveBeenLastCalledWith(['q3-forecast.csv'])
    const cell = grid.querySelector<HTMLElement>('[data-mtc-entry-path="finance/q3-forecast.csv"] [role="gridcell"]:nth-child(2)')!
    cell.focus()
    await userEvent.keyboard('{Enter}')
    await expect(opened).toHaveBeenCalledWith('finance/q3-forecast.csv')
    await userEvent.keyboard('{Shift>}{F10}{/Shift}')
    const menu = await within(document.body).findByRole('menu', { name: 'Actions for q3-forecast.csv' })
    await userEvent.click(within(menu).getByRole('menuitem', { name: /Rename/ }))
    await expect(renamed).toHaveBeenCalledWith('finance/q3-forecast.csv')
  },
}
