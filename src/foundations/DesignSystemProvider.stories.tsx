import type { Meta, StoryObj } from '@storybook/react'
import { Badge, Button, Input } from '../components'
import { DesignSystemProvider } from './DesignSystemProvider'
import type { Density as DensityValue, PresentationTheme } from './types'

const meta = {
  title: 'Toolkit/Foundations/DesignSystemProvider',
  component: DesignSystemProvider,
  args: { children: null },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof DesignSystemProvider>

export default meta
type Story = StoryObj<typeof meta>

const themes: PresentationTheme[] = ['dark', 'operator', 'light', 'high-contrast']

export const Themes: Story = {
  render: () => (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {themes.map(theme => (
        <DesignSystemProvider key={theme} theme={theme} density="comfortable">
          <FoundationSample theme={theme} density="comfortable" />
        </DesignSystemProvider>
      ))}
    </div>
  ),
}

export const DensityModes: Story = {
  render: () => (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {(['compact', 'comfortable'] as DensityValue[]).map(density => (
        <DesignSystemProvider key={density} density={density}>
          <FoundationSample theme="dark" density={density} />
        </DesignSystemProvider>
      ))}
    </div>
  ),
}

function FoundationSample({
  theme,
  density,
}: {
  theme: PresentationTheme
  density: DensityValue
}) {
  return (
    <section className="min-h-[24rem] bg-[var(--mtc-bg)] p-6 text-[var(--mtc-fg)]">
      <div className="mx-auto grid max-w-xl gap-4 rounded-[var(--mtc-radius-lg)] border border-[var(--mtc-border)] bg-[var(--mtc-surface)] p-5 shadow-[var(--mtc-elevation-1)]">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold capitalize">{theme}</h2>
          <Badge>{density}</Badge>
        </div>
        <p className="text-sm text-[var(--mtc-muted)]">
          Scoped surfaces, typography, intents, density, focus, and motion.
        </p>
        <Input aria-label={`${theme} search`} placeholder="Search objects" />
        <div className="flex flex-wrap gap-2">
          <Button intent="primary" variant="solid">Primary action</Button>
          <Button>Secondary</Button>
          <Button intent="danger" variant="ghost">Remove</Button>
        </div>
      </div>
    </section>
  )
}
