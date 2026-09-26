import type { Meta, StoryObj } from '@storybook/react'
import { Section } from './Section'

const meta: Meta<typeof Section> = {
  title: 'Widgets/Section',
  component: Section,
  decorators: [
    (Story) => (
      <div style={{ height: 32, width: 720, margin: 16, background: 'var(--mtc-surface)', border: '1px solid var(--mtc-border)', padding: 4, borderRadius: 'var(--mtc-radius-md)' }}>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Section>

export const Labelled: Story = { args: { options: { label: 'Risk' } } }
export const Plain: Story = { args: { options: {} } }
