import type { Meta, StoryObj } from '@storybook/react'
import { FileBrowser } from './FileBrowser'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT } from '../core/DashboardContext'

const meta: Meta<typeof FileBrowser> = {
  title: 'Widgets/FileBrowser',
  component: FileBrowser,
  decorators: [
    (Story) => (
      <DashboardContext.Provider
        value={{ ...DEFAULT_DASHBOARD_CONTEXT, ctx: { namespace: 'photos', path: '2024' } }}
      >
        <div style={{ height: 420, width: 720, background: '#18181b', borderRadius: 8 }}>
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
