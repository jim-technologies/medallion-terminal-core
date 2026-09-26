import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { StoryFrame } from '../../.storybook/StoryFrame'
import { CodeView, FilePreview } from '.'
import { TYPESCRIPT, fakeFileFetch } from './fileStories.fixture'

const meta = {
  title: 'Toolkit/Files',
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => (
      <StoryFrame
        eyebrow="Toolkit · Files"
        title={context.name}
        description="Bounded, safe previews: text read at most 1 MB, CSV at most 1,000 × 100 into a windowed grid, images and PDFs only with a valid signature, HTML and SVG never rendered, Markdown sanitised."
      >
        <Story />
      </StoryFrame>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

export const CsvTable: Story = {
  name: 'CSV preview',
  render: () => <FilePreview file={{ name: 'orders.csv', url: '/files/orders.csv' }} fetch={fakeFileFetch} height={360} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const grid = await canvas.findByRole('grid', { name: 'orders.csv' })
    await expect(grid).toHaveAttribute('aria-rowcount', '1001')
    await expect(canvas.getByText('Showing 1,000 of 1,200 rows and 5 of 5 columns.')).toBeVisible()
    await expect(within(grid).getByRole('columnheader', { name: 'customer' })).toBeVisible()
  },
}

export const MarkdownDocument: Story = {
  name: 'Markdown preview',
  render: () => <FilePreview file={{ name: 'review.md', url: '/files/review.md' }} fetch={fakeFileFetch} height={420} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('heading', { name: 'Quarterly operating review' })).toBeVisible()
    await expect(canvasElement.querySelector('.mtc-markdown script')).toBeNull()
    await expect(canvas.getByRole('link', { name: 'link' })).toHaveAttribute('href', 'https://example.com/report')
    await expect(canvas.getByRole('table')).toBeVisible()
  },
}

const downloaded = fn()

export const SignatureChecks: Story = {
  name: 'Images and signature checks',
  render: () => (
    <div className="grid gap-4 md:grid-cols-2">
      <FilePreview file={{ name: 'chart.png', url: '/files/chart.png' }} fetch={fakeFileFetch} />
      <FilePreview file={{ name: 'renamed.png', url: '/files/renamed.png' }} fetch={fakeFileFetch} onDownload={() => downloaded('renamed.png')} />
      <FilePreview file={{ name: 'contract-scan.pdf', url: '/files/contract-scan.pdf', sizeBytes: 80_000_000 }} fetch={fakeFileFetch} onDownload={() => downloaded('contract-scan.pdf')} />
      <FilePreview file={{ name: 'installer.exe', url: '/files/installer.exe' }} fetch={fakeFileFetch} onDownload={() => downloaded('installer.exe')} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('img', { name: 'chart.png' })).toHaveAttribute('src', expect.stringMatching(/^blob:/))
    await expect(await canvas.findByText('Preview blocked')).toBeVisible()
    await expect(canvas.getByText('The file’s contents are not a valid PNG, so it is not shown.')).toBeVisible()
    await expect(canvas.getByText('80 MB is over the 50 MB preview limit.')).toBeVisible()
    await expect(canvas.getByText('No preview for this file type')).toBeVisible()
    await userEvent.click(canvas.getAllByRole('button', { name: 'Download' })[0]!)
    await expect(downloaded).toHaveBeenCalledWith('renamed.png')
  },
}

export const SourceAndText: Story = {
  name: 'Code, JSON and bounded text',
  render: () => (
    <div className="grid gap-4">
      <FilePreview file={{ name: 'customers.tsx', url: '/files/customers.tsx' }} fetch={fakeFileFetch} height={200} />
      <FilePreview file={{ name: 'config.json', url: '/files/config.json' }} fetch={fakeFileFetch} height={180} />
      <FilePreview file={{ name: 'server.log', url: '/files/server.log' }} fetch={fakeFileFetch} height={160} limits={{ textBytes: 2_000 }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByLabelText('customers.tsx')).toBeVisible()
    await expect(canvas.getByText('TypeScript')).toBeVisible()
    await expect(await canvas.findByText('"horizon_days": 90,')).toBeVisible()
    // A reduced limit keeps the story small; the default is 1 MB.
    await expect(await canvas.findByText(/^Showing the first 2 kB of [\d.]+ kB\.$/)).toBeVisible()
  },
}

export const CodeViewControls: Story = {
  name: 'CodeView',
  render: () => (
    <CodeView
      code={TYPESCRIPT}
      label="src/Customers.tsx"
      language="TypeScript"
      highlightLines={[11, 12]}
      height={320}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const code = canvas.getByLabelText('src/Customers.tsx')
    await expect(canvas.getByText('18 lines')).toBeVisible()
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Wrap lines' }))
    await expect(code).toHaveAttribute('data-wrap', 'true')
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Wrap lines' }))
    await waitFor(() => expect(code).not.toHaveAttribute('data-wrap'))
  },
}
