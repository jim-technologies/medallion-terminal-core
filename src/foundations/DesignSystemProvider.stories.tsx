import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Badge, Button, Combobox, Input } from '../components'
import { ErrorState, LoadingState, PropertyList } from '../workbench'
import { DesignSystemProvider, useLocale, usePortalContainer } from './DesignSystemProvider'
import { formatBytes, formatDateTime, formatDuration, formatNumber, formatRelativeTime } from './intl'
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
        <DesignSystemProvider key={theme} theme={theme}>
          <FoundationSample theme={theme} density="standard" />
        </DesignSystemProvider>
      ))}
    </div>
  ),
}

export const DensityModes: Story = {
  render: () => (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-3">
      {(['compact', 'standard', 'comfortable'] as DensityValue[]).map(density => (
        <DesignSystemProvider key={density} density={density}>
          <FoundationSample theme="dark" density={density} />
        </DesignSystemProvider>
      ))}
    </div>
  ),
}

export const PortalContainer: Story = {
  name: 'Portal container',
  render: () => (
    <DesignSystemProvider theme="light" density="compact">
      <PortalSample />
    </DesignSystemProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Open portalled panel' }))
    const panel = await waitFor(() => {
      const element = document.querySelector<HTMLElement>('[data-testid="portalled-panel"]')
      if (!element) throw new Error('panel not portalled yet')
      return element
    })
    // The panel lives outside the story root yet keeps the scope's theme,
    // density and fonts.
    await expect(canvasElement.contains(panel)).toBe(false)
    const host = panel.closest<HTMLElement>('.mtc-portal-root')
    await expect(host?.dataset.theme).toBe('light')
    await expect(host?.dataset.density).toBe('compact')
    await expect(getComputedStyle(panel).fontFamily).toContain('Inter')
    await userEvent.click(canvas.getByRole('button', { name: 'Close portalled panel' }))
    await waitFor(() => expect(document.querySelector('[data-testid="portalled-panel"]')).toBeNull())
  },
}

// The zh-CN column renders CJK glyphs from system fonts (only Latin is
// vendored), so this story is asserted by its play test, not by pixels.
export const LocaleAndMessages: Story = {
  name: 'Locale and messages',
  render: () => (
    <div className="grid gap-4 bg-[var(--mtc-bg)] p-6 md:grid-cols-2">
      <DesignSystemProvider locale="en" timeZone="UTC">
        <LocaleSample />
      </DesignSystemProvider>
      <DesignSystemProvider locale="zh-CN" timeZone="Asia/Shanghai">
        <LocaleSample />
      </DesignSystemProvider>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const english = within(canvasElement.querySelector<HTMLElement>('[lang="en"]')!)
    const chinese = within(canvasElement.querySelector<HTMLElement>('[lang="zh-CN"]')!)
    await expect(english.getByText('Loading')).toBeVisible()
    await expect(english.getByRole('button', { name: 'Retry' })).toBeVisible()
    await expect(english.getByPlaceholderText('Select…')).toBeVisible()
    await expect(english.getByText('2.3 MB')).toBeVisible()
    await expect(chinese.getByText('正在加载')).toBeVisible()
    await expect(chinese.getByRole('button', { name: '重试' })).toBeVisible()
    await expect(chinese.getByPlaceholderText('请选择…')).toBeVisible()
    await expect(chinese.getByText('无法加载')).toBeVisible()
  },
}

const SAMPLE_INSTANT = Date.UTC(2026, 9, 18, 15, 4)

function LocaleSample() {
  const { locale, timeZone } = useLocale()
  return (
    <section className="grid content-start gap-3 rounded-[var(--mtc-radius-md)] border border-[var(--mtc-border)] bg-[var(--mtc-surface)] p-4 text-[var(--mtc-fg)]">
      <h2 className="text-[length:var(--mtc-font-size-lg)] font-semibold">{locale}</h2>
      <LoadingState compact />
      <ErrorState compact message="HTTP 503" onRetry={() => {}} />
      <Combobox aria-label={`${locale} owner`} value="" onValueChange={() => {}} options={[]} />
      <PropertyList
        items={[
          { label: 'Count', value: formatNumber(1234567.8, { locale }) },
          { label: 'Size', value: formatBytes(2_300_000, { locale }) },
          { label: 'Updated', value: formatDateTime(SAMPLE_INSTANT, { locale, timeZone }) },
          {
            label: 'Relative',
            value: formatRelativeTime(SAMPLE_INSTANT - 5 * 60_000, { locale, now: SAMPLE_INSTANT }),
          },
          { label: 'Wait', value: formatDuration(30_000, { locale }) },
        ]}
      />
    </section>
  )
}

function PortalSample() {
  const container = usePortalContainer()
  const [open, setOpen] = useState(false)
  return (
    <section className="grid min-h-[16rem] content-start gap-3 bg-[var(--mtc-bg)] p-6 text-[var(--mtc-fg)]">
      <p className="text-[length:var(--mtc-font-size-md)] text-[var(--mtc-muted)]">
        Portalled layers render into a body-level host that carries this scope's theme.
      </p>
      <div>
        <Button onClick={() => setOpen(value => !value)}>
          {open ? 'Close portalled panel' : 'Open portalled panel'}
        </Button>
      </div>
      {open && container && createPortal(
        <div
          data-testid="portalled-panel"
          role="note"
          className="mtc-popover fixed right-6 bottom-6 grid gap-1 p-3 text-[length:var(--mtc-font-size-md)]"
        >
          <strong>Portalled panel</strong>
          <span className="text-[var(--mtc-muted)]">Themed outside the story root.</span>
        </div>,
        container,
      )}
    </section>
  )
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
