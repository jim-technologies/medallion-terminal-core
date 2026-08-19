import { useRef, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import {
  Button,
  ContextMenu,
  Dialog,
  Drawer,
  Icon,
  IconButton,
  Input,
  Menu,
  Popover,
  Tooltip,
  type MenuItem,
} from '.'

const meta = {
  title: 'Toolkit/Components/Overlays',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Overlays"
        title={context.name}
        description="Dismissible interaction layers with keyboard navigation, focus management, and focus restoration built into their contracts."
        spacious
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

const inspectAction = fn()
const menuItems: MenuItem[] = [
  { id: 'open', label: 'Open details', icon: <Icon name="external-link" />, onSelect: inspectAction },
  { id: 'duplicate', label: 'Duplicate', shortcut: '⌘D' },
  { id: 'separator', separator: true },
  { id: 'archive', label: 'Archive', disabled: true },
  { id: 'delete', label: 'Delete', intent: 'danger' },
]

export const TooltipControl: Story = {
  name: 'Tooltip',
  render: () => (
    <Tooltip content="Refresh source metadata">
      <IconButton icon={<Icon name="settings" />} aria-label="Source settings" />
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Source settings' })
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await expect(canvas.getByRole('tooltip')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('tooltip')).not.toBeInTheDocument()
  },
}

export const PopoverControl: Story = {
  name: 'Popover',
  render: () => (
    <Popover
      trigger={<span className="mtc-button">View filters</span>}
      triggerAriaLabel="View filters"
      title="Active filters"
    >
      <div className="grid gap-3">
        <label className="grid gap-1 text-xs">
          Owner
          <Input value="Jun" readOnly />
        </label>
        <Button size="small">Clear filters</Button>
      </div>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'View filters' })
    await userEvent.click(trigger)
    await expect(canvas.getByRole('dialog', { name: 'Active filters' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument())
    await expect(trigger).toHaveFocus()
  },
}

export const MenuControl: Story = {
  name: 'Menu',
  render: () => (
    <Menu
      label="Object actions"
      trigger={<span className="mtc-button">Actions <Icon name="chevron-down" /></span>}
      items={menuItems}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Object actions' })
    trigger.focus()
    await userEvent.keyboard('{ArrowDown}')
    const menu = await canvas.findByRole('menu', { name: 'Object actions' })
    await waitFor(() => expect(
      within(menu).getByRole('menuitem', { name: 'Open details' }),
    ).toHaveFocus())
    await userEvent.keyboard('{Enter}')
    await expect(inspectAction).toHaveBeenCalled()
    await expect(trigger).toHaveFocus()
  },
}

export const ContextMenuControl: Story = {
  name: 'Context menu',
  render: () => (
    <ContextMenu label="Selected row actions" items={menuItems} className="rounded border border-[var(--mtc-border)] bg-[var(--mtc-surface)] p-8">
      <div className="text-sm">Focus this row and press Shift+F10, or use the secondary pointer button.</div>
    </ContextMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const region = canvas.getByLabelText('Selected row actions')
    region.focus()
    await userEvent.keyboard('{Shift>}{F10}{/Shift}')
    await expect(canvas.getByRole('menu', { name: 'Selected row actions' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(region).toHaveFocus()
  },
}

export const DialogControl: Story = {
  name: 'Dialog',
  render: () => <DialogExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Open dialog' })
    await userEvent.click(trigger)
    const dialog = await canvas.findByRole('dialog', { name: 'Create object' })
    await expect(within(dialog).getByRole('textbox', { name: 'Object name' })).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(trigger).toHaveFocus()
  },
}

export const DrawerControl: Story = {
  name: 'Drawer',
  render: () => <DrawerExample />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Open inspector drawer' })
    await userEvent.click(trigger)
    const drawer = await canvas.findByRole('dialog', { name: 'Object inspector' })
    await expect(drawer).toBeVisible()
    await userEvent.click(within(drawer).getByRole('button', { name: 'Close drawer' }))
    await expect(trigger).toHaveFocus()
  },
}

function DialogExample() {
  const [open, setOpen] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Create object"
        description="Add a presentation-only object to this example."
        initialFocusRef={nameRef}
        footer={(
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button intent="primary" variant="solid" onClick={() => setOpen(false)}>Create</Button>
          </>
        )}
      >
        <label className="grid gap-1 text-xs">
          Object name
          <Input ref={nameRef} aria-label="Object name" placeholder="Untitled object" />
        </label>
      </Dialog>
    </>
  )
}

function DrawerExample() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open inspector drawer</Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Object inspector"
        description="Arbitrary host metadata"
        footer={<Button onClick={() => setOpen(false)}>Done</Button>}
      >
        <div className="grid gap-4 text-sm">
          <p>Selected object: Quarterly forecast</p>
          <Input aria-label="Object owner" value="Jun" readOnly />
        </div>
      </Drawer>
    </>
  )
}
