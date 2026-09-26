import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import { PropertyValue } from '.'
import { EVERY_KIND, STORY_NOW } from './objectStories.fixture'

const meta = {
  title: 'Toolkit/Objects/PropertyValue',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Objects"
        title={context.name}
        description="A value's kind decides its font, alignment, format and affordance. Panels add secondary detail (currency code, relative time, copy); grid cells keep one line."
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

export const EveryKind: Story = {
  name: 'Every kind',
  render: () => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-collapse text-left">
        <caption className="mtc-visually-hidden">Property kinds rendered in panels and grids</caption>
        <thead>
          <tr className="text-[length:var(--mtc-font-size-sm)] text-[var(--mtc-muted)]">
            <th scope="col" className="w-40 border-b border-[var(--mtc-border-strong)] px-3 py-2 font-medium">Kind</th>
            <th scope="col" className="border-b border-[var(--mtc-border-strong)] px-3 py-2 font-medium">Panel</th>
            <th scope="col" className="w-64 border-b border-[var(--mtc-border-strong)] px-3 py-2 font-medium">Grid cell</th>
          </tr>
        </thead>
        <tbody>
          {EVERY_KIND.map(property => (
            <tr key={property.id} className="border-b border-[var(--mtc-border)]">
              <th scope="row" className="px-3 py-1.5 align-middle font-normal text-[length:var(--mtc-font-size-sm)] text-[var(--mtc-muted)]">
                {property.label}
              </th>
              <td className="max-w-[26rem] px-3 py-1.5 align-middle">
                <PropertyValue value={property.value} kind={property.kind} format={property.format} tones={property.tones} now={STORY_NOW} />
              </td>
              <td className="max-w-64 px-3 py-1.5 align-middle">
                <div className="min-w-0 max-w-60">
                  <PropertyValue value={property.value} kind={property.kind} format={property.format} tones={property.tones} context="grid" now={STORY_NOW} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getAllByText('$284,000.00').length).toBe(2)
    await expect(canvas.getAllByText('18.0%').length).toBe(2)
    await expect(canvas.getAllByText('in 23 days').length).toBe(1)
    await expect(canvas.getAllByRole('link', { name: /northstar\.example\/docs/ })[0]).toHaveAttribute('rel', 'noopener noreferrer')
    // A non-http URL never becomes a link.
    await expect(canvas.queryByRole('link', { name: /javascript:/ })).toBeNull()
  },
}
