import type { Meta, StoryObj } from '@storybook/react'
import { CodeBrowser } from './CodeBrowser'

const meta: Meta<typeof CodeBrowser> = {
  title: 'Widgets/CodeBrowser',
  component: CodeBrowser,
  decorators: [
    (Story) => (
      <div style={{ height: 560, width: 940, background: '#18181b', padding: 16, borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CodeBrowser>

export const TypeScriptRepository: Story = {
  args: {
    data: {
      repository: 'analytics',
      ref: 'main',
      refs: ['main', 'release/2026.07'],
      path: 'src/customer.ts',
      entries: [
        { path: 'src/core', name: 'core', kind: 'REPOSITORY_ENTRY_KIND_DIRECTORY' },
        { path: 'src/customer.ts', name: 'customer.ts', kind: 'REPOSITORY_ENTRY_KIND_FILE', language: 'typescript', size_bytes: 412 },
        { path: 'src/index.ts', name: 'index.ts', kind: 'REPOSITORY_ENTRY_KIND_FILE', language: 'typescript', size_bytes: 94 },
      ],
      file: {
        path: 'src/customer.ts',
        language: 'typescript',
        size_bytes: 412,
        content: [
          "import type { Customer } from './core/types'",
          '',
          'export function customerHealth(customer: Customer): number {',
          '  const usage = Math.min(customer.activeUsers / customer.seats, 1)',
          '  const supportPenalty = Math.min(customer.openCases * 0.05, 0.3)',
          '  return Math.max(0, usage - supportPenalty)',
          '}',
        ].join('\n'),
      },
    },
  },
}
