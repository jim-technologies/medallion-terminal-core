import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import { Panel } from '../components'
import { ActivityFeed, FacetList, type ActivityItem, type FacetGroup } from '.'
import { CUSTOMER, PEOPLE, STORY_NOW, TYPES } from './objectStories.fixture'

const meta = {
  title: 'Toolkit/Objects/Explore',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Objects"
        title={context.name}
        description="Search-first exploration: facets with counts narrow an object set, and activity shows who did what to which object."
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

const INITIAL: FacetGroup[] = [
  {
    id: 'type',
    label: 'Object type',
    mode: 'single',
    selected: ['customer'],
    options: [
      { value: 'all', label: 'All objects', count: 71, icon: 'table' },
      { value: 'customer', label: 'Customer', count: 5, type: TYPES.customer },
      { value: 'person', label: 'Person', count: 12, type: TYPES.person },
      { value: 'contract', label: 'Contract', count: 4, type: TYPES.contract },
      { value: 'order', label: 'Order', count: 48, type: TYPES.order },
      { value: 'employment', label: 'Employment', count: 2, type: TYPES.employment },
    ],
  },
  {
    id: 'segment',
    label: 'Segment',
    mode: 'multi',
    selected: ['enterprise', 'mid-market'],
    maxVisible: 3,
    options: [
      { value: 'enterprise', label: 'Enterprise', count: 3 },
      { value: 'mid-market', label: 'Mid-market', count: 2 },
      { value: 'startup', label: 'Startup', count: 0 },
      { value: 'public-sector', label: 'Public sector', count: 1 },
      { value: 'non-profit', label: 'Non-profit', count: 0 },
    ],
  },
  {
    id: 'status',
    label: 'Status',
    mode: 'multi',
    selected: ['active'],
    options: [
      { value: 'active', label: 'Active', count: 4 },
      { value: 'churned', label: 'Churned', count: 1 },
    ],
  },
]

export const FacetRail: Story = {
  name: 'FacetList',
  render: () => {
    const [groups, setGroups] = useState(INITIAL)
    return (
      <div className="w-60 rounded-[var(--mtc-radius-md)] border border-[var(--mtc-border)] bg-[var(--mtc-surface)]">
        <FacetList
          label="Filters"
          groups={groups}
          onChange={(groupId, values) => setGroups(current => current.map(group => (
            group.id === groupId ? { ...group, selected: values } : group
          )))}
          onClear={() => setGroups(current => current.map(group => ({ ...group, selected: group.mode === 'single' ? ['all'] : [] })))}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('radio', { name: /Person/ }))
    await expect(canvas.getByRole('radio', { name: /Person/ })).toBeChecked()
    await userEvent.click(canvas.getByRole('checkbox', { name: /Enterprise/ }))
    await expect(canvas.getByRole('checkbox', { name: /Enterprise/ })).not.toBeChecked()
    await userEvent.click(canvas.getByRole('button', { name: 'Show 2 more' }))
    await expect(canvas.getByRole('checkbox', { name: /Non-profit/ })).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Show fewer' }))
    await userEvent.click(canvas.getByRole('radio', { name: /Customer/ }))
  },
}

const minutes = (count: number) => STORY_NOW - count * 60_000

const FEED: ActivityItem[] = [
  { id: 'a1', actor: { name: 'Jamie Kim' }, verb: 'updated', object: CUSTOMER, summary: 'Churn risk Healthy → Watch', timestamp: minutes(18) },
  { id: 'a2', actor: { name: 'Morgan Lee' }, verb: 'linked', object: { id: 'ctr-msa', title: 'Northstar master agreement', type: TYPES.contract, href: '#/objects/ctr-msa' }, timestamp: minutes(60 * 24 * 57) },
  { id: 'a3', actor: { name: 'Sync CRM' }, verb: 'created', object: PEOPLE.ada, timestamp: minutes(60 * 24 * 86) },
]

const RUN: ActivityItem[] = [
  { id: 'e1', verb: 'Run started', summary: 'orders-sync · attempt 1', timestamp: '2026-09-25T15:02:11Z', tone: 'info' },
  { id: 'e2', verb: 'Step completed', summary: 'fetch-orders · 1,284 rows', timestamp: '2026-09-25T15:02:40Z', tone: 'ok' },
  { id: 'e3', verb: 'Step failed', summary: 'load-warehouse · connection reset', timestamp: '2026-09-25T15:03:05Z', tone: 'danger' },
  { id: 'e4', verb: 'Retry scheduled', summary: 'backoff 30 s', timestamp: '2026-09-25T15:03:05Z', tone: 'warning' },
  { id: 'e5', verb: 'Run completed', timestamp: '2026-09-25T15:04:02Z', tone: 'ok' },
]

export const ActivityFeedAndTimeline: Story = {
  name: 'ActivityFeed',
  render: () => (
    <div className="grid gap-4 lg:grid-cols-2">
      <Panel title="Activity" padded>
        <ActivityFeed items={FEED} now={STORY_NOW} aria-label="Object activity" />
      </Panel>
      <Panel title="Run history" subtitle="orders-sync" padded>
        <ActivityFeed items={RUN} variant="timeline" aria-label="Run events" />
      </Panel>
    </div>
  ),
}
