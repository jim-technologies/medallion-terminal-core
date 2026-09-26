import type { Decorator, Meta, StoryObj } from '@storybook/react'
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

// Every kind of editor the grid opens, on one row each: text, a choice, a
// user, a number, a date, a date and time and Yes/No edit in their cell;
// lists and long text open over it.
const EDITING_VALUES: Record<string, { review_at: string; notes: string }> = {
  'work-101': { review_at: '2026-07-17T16:00:00Z', notes: 'Kickoff done. Waiting on the product feed export.' },
  'work-102': { review_at: '2026-07-20T17:30:00Z', notes: 'Renewal terms agreed in principle.\nLegal to confirm the notice period.' },
  'work-103': { review_at: '2026-07-28T15:00:00Z', notes: 'Pilot stores picked; hardware ships next week.' },
  'work-104': { review_at: '2026-07-14T18:00:00Z', notes: '' },
  'work-105': { review_at: '2026-07-21T16:15:00Z', notes: 'Blocked on access to the finance system.' },
}
const EDITING_STORY_DATA = {
  ...LIST_STORY_DATA,
  fields: [
    ...LIST_STORY_DATA.fields,
    { key: 'review_at', label: 'Review', type: 'RECORD_FIELD_TYPE_DATETIME' },
    { key: 'notes', label: 'Notes', type: 'RECORD_FIELD_TYPE_LONG_TEXT' },
  ],
  records: LIST_STORY_DATA.records.map(record => ({
    ...record,
    values: { ...record.values, ...EDITING_VALUES[record.id] },
  })),
  views: LIST_STORY_DATA.views.map(view => view.id === 'all_work'
    ? { ...view, visible_fields: ['name', 'stage', 'owner', 'value', 'due_date', 'review_at', 'completed', 'tags', 'reviewers', 'notes'] }
    : view),
}

// The story's backend never answers: a save stays pending, so the grid
// shows its saving state and nothing leaves the page.
const pendingBackend: Decorator[] = [
  Story => (
    <DashboardContext.Provider
      value={{
        ...DEFAULT_DASHBOARD_CONTEXT,
        backendUrl: 'https://backend.invalid',
        fetch: () => new Promise<Response>(() => {}),
      }}
    >
      <Story />
    </DashboardContext.Provider>
  ),
]

// F2 or a double-click edits a cell; the story opens the first record's
// title, which edits in its cell.
export const InlineEditing: Story = {
  name: 'Inline editing',
  args: { data: EDITING_STORY_DATA },
  decorators: pendingBackend,
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('grid', { name: 'Work items' })
    await userEvent.dblClick(within(grid).getAllByRole('gridcell')[0]!)
    await expect(await within(grid).findByRole('textbox', { name: 'Work item' })).toHaveFocus()
  },
}

// Long text (like a list of choices) is taller than a row, so its editor
// opens over the cell instead of inside it; the story opens the second
// record's notes.
export const EditorOverTheCell: Story = {
  name: 'Editor over the cell',
  args: { data: EDITING_STORY_DATA },
  decorators: pendingBackend,
  play: async ({ canvasElement }) => {
    const grid = within(canvasElement).getByRole('grid', { name: 'Work items' })
    const notes = grid.querySelector<HTMLElement>('[data-row-index="1"] [data-column-id="notes"]')!
    await userEvent.dblClick(notes)
    await expect(await within(document.body).findByRole('textbox', { name: 'Notes' })).toHaveFocus()
  },
}
