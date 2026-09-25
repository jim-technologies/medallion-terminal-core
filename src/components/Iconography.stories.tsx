import type { Meta, StoryObj } from '@storybook/react'
import { StoryFrame } from '../../.storybook/StoryFrame'
import { ICON_NAMES, Icon, TYPE_COLORS, TypeGlyph, typeColorFor, type IconName } from '.'

const meta = {
  title: 'Toolkit/Components/Iconography',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Iconography"
        title={context.name}
        description="One first-party icon set on a 24-unit grid with 1.75-unit strokes, and the type glyph that gives each object type its identity."
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

export const IconSet: Story = {
  name: 'Icon set',
  render: () => (
    <ul
      aria-label="Built-in icons"
      className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4 lg:grid-cols-6"
    >
      {ICON_NAMES.map(name => (
        <li key={name} className="flex min-w-0 items-center gap-2 py-1 text-[var(--mtc-fg-soft)]">
          <Icon name={name} size={16} />
          <span className="truncate text-[length:var(--mtc-font-size-sm)] text-[var(--mtc-muted)]">{name}</span>
        </li>
      ))}
    </ul>
  ),
}

const sampleTypes: readonly { id: string; label: string; icon: IconName }[] = [
  { id: 'customer', label: 'Customer', icon: 'building' },
  { id: 'person', label: 'Person', icon: 'person' },
  { id: 'contract', label: 'Contract', icon: 'contract' },
  { id: 'order', label: 'Order', icon: 'order' },
  { id: 'shipment', label: 'Shipment', icon: 'truck' },
  { id: 'dataset', label: 'Dataset', icon: 'dataset' },
]

export const TypeGlyphs: Story = {
  name: 'Type glyphs',
  render: () => (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h2 className="text-[length:var(--mtc-font-size-lg)] font-semibold">Identity slots</h2>
        <ul aria-label="Type identity slots" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {TYPE_COLORS.map(color => (
            <li key={color} className="flex items-center gap-2">
              <TypeGlyph color={color} icon="object" size={24} />
              <span className="text-[length:var(--mtc-font-size-sm)] text-[var(--mtc-muted)]">{color}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid gap-2">
        <h2 className="text-[length:var(--mtc-font-size-lg)] font-semibold">Sizes</h2>
        <ul aria-label="Object types" className="grid gap-2">
          {sampleTypes.map(type => (
            <li key={type.id} className="flex items-center gap-3">
              {([16, 20, 24, 40] as const).map(size => (
                <TypeGlyph key={size} color={typeColorFor(type.id)} icon={type.icon} size={size} />
              ))}
              <span className="text-[length:var(--mtc-font-size-md)]">{type.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="flex items-center gap-2 text-[length:var(--mtc-font-size-md)] text-[var(--mtc-fg-soft)]">
        <TypeGlyph color="teal" icon="building" size={16} label="Customer" />
        Standalone glyphs take a label; glyphs beside a type name stay decorative.
      </p>
    </div>
  ),
}
