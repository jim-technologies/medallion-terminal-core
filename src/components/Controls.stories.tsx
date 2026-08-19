import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import { DesignSystemProvider } from '../foundations'
import {
  Badge,
  Button,
  ButtonGroup,
  Callout,
  Checkbox,
  Combobox,
  FormField,
  Icon,
  IconButton,
  Input,
  Radio,
  Switch,
  Tag,
  TextArea,
  type ComboboxOption,
} from '.'

const meta = {
  title: 'Toolkit/Components/Controls',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Controls"
        title={context.name}
        description="Reusable controls and feedback primitives with shared intent, sizing, density, and accessible state behavior."
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

const primaryAction = fn()

export const IconAndButtons: Story = {
  name: 'Icon, Button, IconButton & ButtonGroup',
  render: () => (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3" aria-label="Icon examples">
        <Icon name="folder" label="Folder" size={20} />
        <Icon name="search" label="Search" size={20} />
        <Icon name="settings" label="Settings" size={20} />
        <Icon name="warning" label="Warning" size={20} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button intent="primary" variant="solid" onClick={primaryAction}>Create object</Button>
        <Button startIcon={<Icon name="search" />}>Search</Button>
        <Button loading loadingLabel="Saving">Save</Button>
        <Button disabled>Disabled</Button>
        <IconButton icon={<Icon name="settings" />} aria-label="Open settings" />
        <ButtonGroup label="View density">
          <Button size="small">Compact</Button>
          <Button size="small">Comfortable</Button>
        </ButtonGroup>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Create object' }))
    await expect(primaryAction).toHaveBeenCalled()
    await expect(canvas.getByRole('button', { name: 'Saving' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Disabled' })).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Open settings' })).toBeVisible()
  },
}

export const InputTextAreaAndFormField: Story = {
  name: 'Input, TextArea & FormField',
  render: () => (
    <form className="grid gap-4" onSubmit={event => event.preventDefault()}>
      <FormField label="Object name" description="Visible to workspace members" required>
        <Input placeholder="Quarterly forecast" />
      </FormField>
      <FormField label="Description">
        <TextArea rows={4} placeholder="Describe this object" />
      </FormField>
      <FormField label="Identifier" error="Use lowercase letters and dashes">
        <Input value="Invalid Value" readOnly />
      </FormField>
    </form>
  ),
}

export const CheckboxRadioAndSwitch: Story = {
  name: 'Checkbox, Radio & Switch',
  render: () => <ChoiceExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const switchControl = canvas.getByRole('switch', { name: /^Stream updates/ })
    await expect(switchControl).not.toBeChecked()
    await userEvent.click(switchControl)
    await expect(switchControl).toBeChecked()
    await userEvent.click(canvas.getByRole('radio', { name: 'Comfortable rows' }))
    await expect(canvas.getByRole('radio', { name: 'Comfortable rows' })).toBeChecked()
  },
}

const environmentOptions: ComboboxOption[] = [
  { value: 'production', label: 'Production', description: 'Customer-facing data' },
  { value: 'staging', label: 'Staging', description: 'Pre-release validation' },
  { value: 'archive', label: 'Archive', description: 'Read-only history', disabled: true },
]

export const ComboboxControl: Story = {
  name: 'Combobox',
  render: () => <ComboboxExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const combobox = canvas.getByRole('combobox', { name: 'Environment' })
    await userEvent.click(combobox)
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect(combobox).toHaveValue('Production')
    await userEvent.clear(combobox)
    await userEvent.type(combobox, 'stag')
    await expect(canvas.getByRole('option', { name: /Staging/ })).toBeVisible()
  },
}

export const TagBadgeAndCallout: Story = {
  name: 'Tag, Badge & Callout',
  render: () => (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Tag intent="primary">Selected</Tag>
        <Tag intent="success" onRemove={() => {}} removeLabel="Remove approved tag">Approved</Tag>
        <Badge dot intent="warning">Pending</Badge>
        <Badge intent="danger">3 errors</Badge>
      </div>
      <Callout
        title="Source needs attention"
        intent="warning"
        actions={<Button size="small">Review source</Button>}
      >
        The last successful synchronization completed 18 minutes ago.
      </Callout>
    </div>
  ),
}

export const LightComfortable: Story = {
  name: 'Light · Comfortable',
  parameters: { backgrounds: { default: 'light' } },
  render: () => (
    <DesignSystemProvider theme="light" density="comfortable">
      <div className="grid gap-4 bg-[var(--mtc-bg)] p-6">
        <Input aria-label="Light theme input" placeholder="Search" />
        <Button intent="primary" variant="solid">Continue</Button>
        <Callout title="Ready" intent="success">All checks passed.</Callout>
      </div>
    </DesignSystemProvider>
  ),
}

export const CompactDensity: Story = {
  name: 'Compact density',
  render: () => (
    <DesignSystemProvider density="compact">
      <div className="flex flex-wrap gap-2 bg-[var(--mtc-bg)] p-4">
        <Input aria-label="Compact input" placeholder="Filter" className="max-w-52" />
        <Button>Apply</Button>
        <Badge dot intent="success">Live</Badge>
      </div>
    </DesignSystemProvider>
  ),
}

function ChoiceExample() {
  const [checked, setChecked] = useState(false)
  const [density, setDensity] = useState('compact')
  return (
    <div className="grid gap-4">
      <Checkbox label="Include linked objects" description="Adds one relationship level" defaultChecked />
      <div role="radiogroup" aria-label="Row density" className="grid gap-2">
        <Radio
          name="density"
          value="compact"
          label="Compact rows"
          checked={density === 'compact'}
          onChange={() => setDensity('compact')}
        />
        <Radio
          name="density"
          value="comfortable"
          label="Comfortable rows"
          checked={density === 'comfortable'}
          onChange={() => setDensity('comfortable')}
        />
      </div>
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        label="Stream updates"
        description="Receive changes as they happen"
      />
    </div>
  )
}

function ComboboxExample() {
  const [value, setValue] = useState<string | null>('staging')
  return (
    <FormField label="Environment">
      <Combobox
        aria-label="Environment"
        value={value}
        onValueChange={setValue}
        options={environmentOptions}
      />
    </FormField>
  )
}
