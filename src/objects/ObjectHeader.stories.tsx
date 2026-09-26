import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import { Button, Icon, IconButton, Menu } from '../components'
import { PropertyList } from '../workbench'
import { ObjectChip, ObjectHeader } from '.'
import { CUSTOMER, PEOPLE, TYPES } from './objectStories.fixture'

const meta = {
  title: 'Toolkit/Objects/ObjectHeader',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Objects"
        title={context.name}
        description="The object's identity: a 40 px type glyph, the type eyebrow in the type's colour with the monospace id, the title, status and metadata. The compact variant serves inspectors and hover cards."
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

const navigate = fn()

export const ObjectPageHeader: Story = {
  name: 'Object page header',
  render: () => (
    <ObjectHeader
      type={TYPES.customer}
      typeHref="#/ontology/types/customer"
      title="Northstar Labs"
      objectId="res-customer-northstar"
      status={{ label: 'Active', tone: 'ok' }}
      meta={['Updated 18 min ago by Jamie Kim', 'Revision 14', 'Source gold.customer_360']}
      actions={(
        <>
          <Menu
            label="Actions"
            trigger={<span className="mtc-button"><Icon name="bolt" /> Actions <Icon name="chevron-down" /></span>}
            items={[
              { id: 'renew', label: 'Start renewal' },
              { id: 'assign', label: 'Assign owner' },
            ]}
          />
          <Button intent="primary" variant="solid">Edit properties</Button>
          <IconButton icon={<Icon name="more" />} aria-label="More object actions" />
        </>
      )}
    />
  ),
}

export const InspectorHeader: Story = {
  name: 'Compact (inspector)',
  render: () => (
    <div className="max-w-sm rounded-[var(--mtc-radius-md)] border border-[var(--mtc-border)] p-3">
      <ObjectHeader
        compact
        type={TYPES.customer}
        title="Northstar Labs"
        objectId="CUS-01842"
        status={{ label: 'Active', tone: 'ok' }}
        actions={<IconButton icon={<Icon name="external-link" />} aria-label="Open object" size="small" />}
      />
    </div>
  ),
}

export const ChipsAndHoverCards: Story = {
  name: 'ObjectChip & HoverCard',
  render: () => (
    <div className="grid gap-4">
      <p className="flex flex-wrap items-center gap-2">
        Account owner
        <ObjectChip
          object={PEOPLE.ada}
          onNavigate={(object, event) => navigate(object.id, event.type)}
          hoverCard={(
            <div className="grid gap-3">
              <ObjectHeader compact type={TYPES.person} title="Ada Morgan" objectId="per-ada-morgan" headingLevel={3} />
              <PropertyList
                items={[
                  { id: 'role', label: 'Role', value: 'Technical lead' },
                  { id: 'employer', label: 'Employer', value: CUSTOMER },
                ]}
              />
            </div>
          )}
        />
      </p>
      <p className="flex flex-wrap items-center gap-3">
        <span>Links:</span>
        <ObjectChip object={CUSTOMER} />
        <ObjectChip object={{ id: 'ord-4481', title: 'ORD-4481', type: TYPES.order, href: '#/objects/ord-4481' }} mono />
        <ObjectChip object={{ id: 'ctr-msa', title: 'Northstar master agreement', type: TYPES.contract }} />
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const chip = canvas.getByRole('link', { name: 'Ada Morgan' })
    await userEvent.click(chip)
    await expect(navigate).toHaveBeenCalledWith('per-ada-morgan', 'click')
    chip.focus()
    await waitFor(() => expect(document.querySelector('.mtc-hover-card')).toBeVisible())
    await expect(chip).toHaveAttribute('aria-describedby')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(document.querySelector('.mtc-hover-card')).toBeNull())
  },
}
