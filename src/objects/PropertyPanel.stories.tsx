import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import { PropertyPanel } from '.'
import { CUSTOMER_PROPERTIES, STORY_NOW } from './objectStories.fixture'

const meta = {
  title: 'Toolkit/Objects/PropertyPanel',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Objects"
        title={context.name}
        description="An object's properties grouped under muted labels, each value typed by PropertyValue. The header counts what the filter shows."
      >
        <div className="max-w-2xl">
          <Story />
        </div>
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

export const GroupedAndFilterable: Story = {
  name: 'Grouped and filterable',
  render: () => <PropertyPanel properties={CUSTOMER_PROPERTIES} now={STORY_NOW} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('12 of 12')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'Filter properties' }))
    await userEvent.keyboard('renewal')
    await expect(canvas.getByText('1 of 12')).toBeVisible()
    await expect(canvas.getByText('Oct 18, 2026')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(canvas.getByText('12 of 12')).toBeVisible()
  },
}
