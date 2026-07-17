import type { Meta, StoryObj } from '@storybook/react'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT } from '../core/DashboardContext'
import { RecordForm } from './RecordForm'
import { RECORD_SET_STORY_DATA } from './recordStories.fixture'

const meta = {
  title: 'Widgets/Records/RecordForm',
  component: RecordForm,
  args: {
    data: RECORD_SET_STORY_DATA,
    options: { mode: 'auto', view_id: 'intake', columns: 1 },
    widgetId: 'record-form',
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => (
      <DashboardContext.Provider value={{
        ...DEFAULT_DASHBOARD_CONTEXT,
        ctx: { table_id: 'work_items', record_id: 'work-101' },
      }}>
        <div className="h-[36rem] max-w-xl bg-zinc-950 p-4 text-zinc-100"><Story /></div>
      </DashboardContext.Provider>
    ),
  ],
} satisfies Meta<typeof RecordForm>

export default meta
type Story = StoryObj<typeof meta>

export const SelectedRecord: Story = {}
export const NewRecord: Story = {
  args: { options: { mode: 'create', view_id: 'intake', columns: 1 } },
}
