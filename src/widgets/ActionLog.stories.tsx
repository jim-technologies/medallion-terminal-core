import type { Meta, StoryObj } from '@storybook/react'
import { ActionLog } from './ActionLog'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT, type ActionLogEntry } from '../core/DashboardContext'

const now = Date.now()
const sample: ActionLogEntry[] = [
  { receivedAt: now - 2_000,  actionId: 'place_order', clientRequestId: 'a1b2c3d4', status: 'ACTION_STATUS_PENDING',  message: 'Working — 0.3 BTC @ 67,820', terminal: false },
  { receivedAt: now - 14_000, actionId: 'place_order', clientRequestId: 'e5f6g7h8', status: 'ACTION_STATUS_OK',       message: 'Filled — 0.1 BTC @ 67,810', terminal: true },
  { receivedAt: now - 47_000, actionId: 'swap',        clientRequestId: 'i9j0k1l2', status: 'ACTION_STATUS_OK',       message: '5 ETH → 18,420 USDC',        terminal: true },
  { receivedAt: now - 180_000,actionId: 'place_order', clientRequestId: 'm3n4o5p6', status: 'ACTION_STATUS_REJECTED', message: 'Insufficient margin',         terminal: true },
  { receivedAt: now - 360_000,actionId: 'place_order', clientRequestId: 'q7r8s9t0', status: 'ACTION_STATUS_CANCELLED', message: 'User cancelled',             terminal: true },
]

const meta: Meta<typeof ActionLog> = {
  title: 'Widgets/ActionLog',
  component: ActionLog,
  decorators: [
    (Story) => (
      <DashboardContext.Provider value={{ ...DEFAULT_DASHBOARD_CONTEXT, recentActions: sample }}>
        <div style={{ height: 320, width: 520, background: '#18181b', padding: 12, borderRadius: 8 }}>
          <Story />
        </div>
      </DashboardContext.Provider>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof ActionLog>

export const Populated: Story = { args: {} }

export const Empty_: Story = {
  name: 'Empty',
  decorators: [
    (Story) => (
      <DashboardContext.Provider value={DEFAULT_DASHBOARD_CONTEXT}>
        <div style={{ height: 320, width: 520, background: '#18181b', padding: 12, borderRadius: 8 }}>
          <Story />
        </div>
      </DashboardContext.Provider>
    ),
  ],
  args: {},
}
