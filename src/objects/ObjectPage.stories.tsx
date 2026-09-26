import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { Button, Icon, IconButton, Menu, Panel } from '../components'
import { ActivityFeed, LinkGraph, LinkPanel, ObjectPage, PropertyPanel } from '.'
import {
  CUSTOMER,
  CUSTOMER_ACTIVITY,
  CUSTOMER_HISTORY,
  CUSTOMER_LINKS,
  CUSTOMER_PROPERTIES,
  STORY_NOW,
  TYPES,
} from './objectStories.fixture'

const meta = {
  title: 'Toolkit/Objects/ObjectPage',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj

function CustomerPage() {
  return (
    <ObjectPage
      breadcrumbs={[
        { label: 'Ontology', href: '#/ontology' },
        { label: 'Customer', href: '#/ontology/types/customer' },
        { label: 'Northstar Labs' },
      ]}
      header={{
        type: TYPES.customer,
        typeHref: '#/ontology/types/customer',
        title: 'Northstar Labs',
        objectId: 'res-customer-northstar',
        status: { label: 'Active', tone: 'ok' },
        meta: ['Updated 18 min ago by Jamie Kim', 'Revision 14', 'Source gold.customer_360'],
        actions: (
          <>
            <Menu
              label="Actions"
              trigger={<span className="mtc-button"><Icon name="bolt" /> Actions <Icon name="chevron-down" /></span>}
              items={[{ id: 'renew', label: 'Start renewal' }, { id: 'assign', label: 'Assign owner' }]}
            />
            <Button intent="primary" variant="solid">Edit properties</Button>
            <IconButton icon={<Icon name="more" />} aria-label="More object actions" />
          </>
        ),
      }}
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          panel: (
            <div className="grid gap-4 lg:grid-cols-2">
              <PropertyPanel properties={CUSTOMER_PROPERTIES} now={STORY_NOW} headingLevel={2} />
              <LinkPanel groups={CUSTOMER_LINKS} actions={<IconButton icon={<Icon name="graph" />} aria-label="Open link graph" variant="ghost" size="small" />} />
              <Panel title="Link graph" subtitle="1 hop · 17 objects">
                <LinkGraph center={CUSTOMER} groups={CUSTOMER_LINKS} label="Links of Northstar Labs" height={280} />
              </Panel>
              <Panel title="Activity" padded actions={<a className="text-[length:var(--mtc-font-size-sm)] text-[var(--mtc-link)]" href="#/activity">All activity</a>}>
                <ActivityFeed items={CUSTOMER_ACTIVITY} now={STORY_NOW} aria-label="Recent activity" />
              </Panel>
            </div>
          ),
        },
        { id: 'properties', label: 'Properties', count: CUSTOMER_PROPERTIES.length, panel: <PropertyPanel properties={CUSTOMER_PROPERTIES} now={STORY_NOW} /> },
        { id: 'links', label: 'Links', count: 17, panel: <LinkPanel groups={CUSTOMER_LINKS} maxItems={10} /> },
        {
          id: 'history',
          label: 'History',
          count: CUSTOMER_HISTORY.length,
          panel: (
            <Panel title="Revisions" padded>
              <ActivityFeed items={CUSTOMER_HISTORY} variant="timeline" aria-label="Revision history" />
            </Panel>
          ),
        },
      ]}
    />
  )
}

export const CustomerObjectPage: Story = {
  name: 'Customer object',
  render: () => <CustomerPage />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { name: 'Northstar Labs', level: 1 })).toBeVisible()
    const overview = canvas.getByRole('tab', { name: 'Overview' })
    await expect(overview).toHaveAttribute('aria-selected', 'true')
    overview.focus()
    await userEvent.keyboard('{End}')
    await expect(canvas.getByRole('tab', { name: /History/ })).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('list', { name: 'Revision history' })).toBeVisible()
    await userEvent.keyboard('{Home}')
    await expect(overview).toHaveAttribute('aria-selected', 'true')
  },
}
