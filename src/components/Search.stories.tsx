import { useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import { Button, CommandPalette, Icon, Kbd, SearchField, TypeGlyph, type CommandGroup } from '.'

const meta = {
  title: 'Toolkit/Components/Search',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Search"
        title={context.name}
        description="Search is the front door: a search field with scope tokens and a focus shortcut, and a global palette of results grouped by type."
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

const submitted = fn()

export const SearchFieldWithTokens: Story = {
  name: 'SearchField',
  render: () => {
    const [query, setQuery] = useState('north')
    const [scoped, setScoped] = useState(true)
    return (
      <div className="grid max-w-xl gap-4">
        <SearchField
          label="Search customers"
          placeholder="Search objects"
          value={query}
          onValueChange={setQuery}
          tokens={scoped ? [{ id: 'type', label: 'Customer', icon: <TypeGlyph icon="building" color="teal" size={16} /> }] : []}
          onRemoveToken={() => setScoped(false)}
          onSubmit={submitted}
          shortcut="/"
        />
        <SearchField label="Search files" placeholder="Search files" value="" onValueChange={() => {}} shortcut="/" size="small" />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Search customers' })
    await userEvent.click(input)
    await userEvent.keyboard('{Enter}')
    await expect(submitted).toHaveBeenCalledWith('north')
    await userEvent.keyboard('{Escape}')
    await expect(input).toHaveValue('')
    await userEvent.keyboard('{Backspace}')
    await expect(canvas.queryByRole('button', { name: 'Remove Customer' })).toBeNull()
    await userEvent.type(input, 'harbor')
    await expect(canvas.getByRole('button', { name: 'Clear search' })).toBeVisible()
  },
}

const opened = fn()

const CATALOG = [
  { id: 'cus-northstar', label: 'Northstar Labs', type: 'Customer', icon: 'building' as const, color: 'teal' as const, detail: 'CUS-01842' },
  { id: 'cus-northwind', label: 'Northwind Health', type: 'Customer', icon: 'building' as const, color: 'teal' as const, detail: 'CUS-01805' },
  { id: 'per-ada', label: 'Ada Morgan', type: 'Person', icon: 'person' as const, color: 'violet' as const, detail: 'Technical lead · Northstar Labs' },
  { id: 'ctr-msa', label: 'Northstar master agreement', type: 'Contract', icon: 'contract' as const, color: 'amber' as const, detail: 'Signed Jan 4, 2026' },
  { id: 'ord-4481', label: 'ORD-4481', type: 'Order', icon: 'order' as const, color: 'orange' as const, detail: '$18,240.00 · Northstar Labs' },
]

function PaletteDemo({ initiallyOpen = false, initialQuery = '' }: { initiallyOpen?: boolean; initialQuery?: string }) {
  const [open, setOpen] = useState(initiallyOpen)
  const [query, setQuery] = useState(initialQuery)
  const groups = useMemo<CommandGroup[]>(() => {
    const needle = query.trim().toLowerCase()
    const matches = CATALOG.filter(entry => !needle || entry.label.toLowerCase().includes(needle) || entry.detail.toLowerCase().includes(needle))
    const byType = new Map<string, typeof CATALOG>()
    for (const entry of matches) byType.set(entry.type, [...(byType.get(entry.type) ?? []), entry])
    return [
      ...[...byType.entries()].map(([type, entries]) => ({
        id: type,
        label: type,
        items: entries.map(entry => ({
          id: entry.id,
          label: entry.label,
          description: entry.detail,
          icon: <TypeGlyph icon={entry.icon} color={entry.color} size={20} />,
        })),
      })),
      {
        id: 'commands',
        label: 'Commands',
        items: [{ id: 'cmd:new', label: 'New customer', icon: <Icon name="add" />, shortcut: 'N' }],
      },
    ]
  }, [query])
  return (
    <div className="flex items-center gap-3">
      <Button startIcon={<Icon name="search" />} onClick={() => setOpen(true)}>
        Search objects, types, and resources <Kbd>Ctrl K</Kbd>
      </Button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        groups={groups}
        onSelect={item => opened(item.id)}
        placeholder="Search objects, types, and resources"
      />
    </div>
  )
}

export const CommandPaletteGrouped: Story = {
  name: 'CommandPalette',
  render: () => <PaletteDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const page = within(document.body)
    const trigger = canvas.getByRole('button', { name: /Search objects/ })
    await userEvent.click(trigger)
    const dialog = await page.findByRole('dialog', { name: 'Command palette' })
    const input = within(dialog).getByRole('combobox')
    await expect(input).toHaveFocus()
    await userEvent.keyboard('north')
    await expect(within(dialog).getByRole('group', { name: 'Customer' })).toBeVisible()
    await expect(within(dialog).getByRole('option', { name: /^Northstar Labs/ })).toHaveAttribute('aria-selected', 'true')
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await expect(opened).toHaveBeenCalledWith('cus-northwind')
    await waitFor(() => expect(page.queryByRole('dialog')).toBeNull())
    await expect(trigger).toHaveFocus()
  },
}

export const CommandPaletteOpen: Story = {
  name: 'CommandPalette (open)',
  render: () => <PaletteDemo initiallyOpen initialQuery="north" />,
}
