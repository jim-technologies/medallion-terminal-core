import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { DashboardContext, DEFAULT_DASHBOARD_CONTEXT } from '../core/DashboardContext'
import { RecordGrid } from './RecordGrid'
import { RECORD_SET_STORY_DATA } from './recordStories.fixture'

const meta = {
  title: 'Widgets/Records/RecordGrid',
  component: RecordGrid,
  args: {
    data: RECORD_SET_STORY_DATA,
    options: { view_id: 'all_work', search: true, inline_edit: true },
    widgetId: 'records-grid',
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    Story => <div className="h-[32rem] bg-zinc-950 p-4 text-zinc-100"><Story /></div>,
  ],
} satisfies Meta<typeof RecordGrid>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// A backend enables inline editing; the story opens the first record's
// title for editing and sends nothing (Save is never pressed).
export const InlineEditing: Story = {
  name: 'Inline editing',
  decorators: [
    Story => (
      <DashboardContext.Provider value={{ ...DEFAULT_DASHBOARD_CONTEXT, backendUrl: 'https://backend.invalid' }}>
        <Story />
      </DashboardContext.Provider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('grid', { name: 'Work items' })
    await userEvent.dblClick(within(grid).getAllByRole('gridcell')[0]!)
    await expect(await within(grid).findByRole('textbox', { name: 'Work item' })).toHaveFocus()
  },
}

// Multi-select and multi-user fields: chips on one line in each row, the
// first two and then "+N", whose title names the rest.
const TAG_CHOICES = [
  { value: 'finance', label: 'Finance', color: 'info' },
  { value: 'board', label: 'Board review', color: 'warn' },
  { value: 'legal', label: 'Legal hold', color: 'danger' },
  { value: 'renewal', label: 'Renewal' },
]
const LIST_VALUES: Record<string, { tags: string[]; reviewers: string[] }> = {
  'work-101': { tags: ['finance', 'board', 'legal'], reviewers: ['jules', 'noah'] },
  'work-102': { tags: ['renewal'], reviewers: ['mina'] },
  'work-103': { tags: ['finance', 'board', 'legal', 'renewal'], reviewers: ['mina', 'jules', 'noah'] },
  'work-104': { tags: [], reviewers: [] },
  'work-105': { tags: ['legal', 'finance'], reviewers: ['noah'] },
}
const LIST_STORY_DATA = {
  ...RECORD_SET_STORY_DATA,
  fields: [
    ...RECORD_SET_STORY_DATA.fields,
    { key: 'tags', label: 'Tags', type: 'RECORD_FIELD_TYPE_MULTI_SELECT', choices: TAG_CHOICES },
    {
      key: 'reviewers',
      label: 'Reviewers',
      type: 'RECORD_FIELD_TYPE_USER',
      allow_multiple: true,
      choices: [
        { value: 'mina', label: 'Mina Patel' },
        { value: 'jules', label: 'Jules Chen' },
        { value: 'noah', label: 'Noah Williams' },
      ],
    },
  ],
  records: RECORD_SET_STORY_DATA.records.map(record => ({
    ...record,
    values: { ...record.values, ...LIST_VALUES[record.id] },
  })),
  views: RECORD_SET_STORY_DATA.views.map(view => view.id === 'all_work'
    ? { ...view, visible_fields: ['name', 'tags', 'reviewers', 'customer', 'stage', 'value', 'due_date', 'priority'] }
    : view),
}

export const ListsAndChips: Story = {
  name: 'Lists and chips',
  args: { data: LIST_STORY_DATA, options: { view_id: 'all_work', search: true } },
}
