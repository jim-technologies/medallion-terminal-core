import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { Dashboard } from './Dashboard'
import { createWidgetRegistry } from './WidgetRegistry'
import type { Template, WidgetProps } from '../types/template'

const meta = {
  title: 'Toolkit/Integration/HostBridge',
  component: Dashboard,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Dashboard>

export default meta
type Story = StoryObj<typeof meta>

function ScopedSummary({ data }: WidgetProps) {
  const value = typeof data === 'object' && data && 'value' in data
    ? String((data as { value: unknown }).value)
    : 'No value'
  return <div className="p-5 text-sm">Scoped registry value: <strong>{value}</strong></div>
}

const scopedRegistry = createWidgetRegistry()
scopedRegistry.register('scoped_summary', ScopedSummary)

export const ScopedWidgetRegistry: Story = {
  args: {
    registry: scopedRegistry,
    template: {
      title: 'Scoped registry',
      widgets: [{
        id: 'custom',
        component: 'scoped_summary',
        span: 12,
        source: { inline: { value: 42 } },
      }],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitFor(() => expect(
      canvas.getByText(/Scoped registry value:/),
    ).toBeVisible())
    await expect(canvas.queryByText(/unknown component/)).not.toBeInTheDocument()
  },
}

const onIntent = fn()
const fileIntentTemplate: Template = {
  title: 'Host intent bridge',
  context: { values: { org: 'jim-technologies', path: '' } },
  widgets: [{
    id: 'files',
    component: 'file_browser',
    span: 12,
    source: {
      inline: {
        entries: [{
          id: 'object-quarterly-forecast',
          kind: 'document',
          name: 'quarterly-forecast.pdf',
          content_type: 'application/pdf',
          size_bytes: 64000,
        }],
      },
    },
  }],
}

export const HostIntentEmission: Story = {
  args: {
    template: fileIntentTemplate,
    onIntent,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const name = await canvas.findByText('quarterly-forecast.pdf')
    const row = name.closest('tr')
    if (!row) throw new Error('Expected file row')
    await userEvent.click(row)
    await expect(onIntent).toHaveBeenCalledWith({
      type: 'object.select',
      objectId: 'object-quarterly-forecast',
    })
    await userEvent.dblClick(row)
    await waitFor(() => expect(onIntent).toHaveBeenCalledWith({
      type: 'object.open',
      objectId: 'object-quarterly-forecast',
      mode: 'preview',
    }))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument())
  },
}
