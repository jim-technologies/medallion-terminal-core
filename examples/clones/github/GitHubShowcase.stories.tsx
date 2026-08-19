import type { Meta, StoryObj } from '@storybook/react'
import { GitHubShowcase } from './GitHubShowcase'

const meta = {
  title: 'Clones/GitHub',
  component: GitHubShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'GitHub',
    cloneProduct: 'GitHub',
    cloneNamespace: 'github',
    docs: {
      description: {
        component: 'A dedicated GitHub repository reference with pull-request conversation, review timeline, file-tree diffs, checks, job logs, artifacts, and merge readiness. Data and mutations remain host-owned.',
      },
    },
  },
  args: { initialView: 'pull-request' },
  argTypes: {
    initialView: { control: 'inline-radio', options: ['pull-request', 'files-changed', 'actions'] },
    data: { control: false },
  },
} satisfies Meta<typeof GitHubShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const PullRequest: Story = {}
export const FilesChanged: Story = { args: { initialView: 'files-changed' } }
export const Checks: Story = { args: { initialView: 'actions' } }
