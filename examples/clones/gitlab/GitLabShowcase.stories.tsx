import type { Meta, StoryObj } from '@storybook/react'
import { GitLabShowcase } from './GitLabShowcase'

const meta = {
  title: 'Clones/GitLab',
  component: GitLabShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'GitLab',
    cloneProduct: 'GitLab',
    cloneNamespace: 'gitlab',
    docs: {
      description: {
        component: 'A dedicated GitLab project reference with merge-request approvals, reviewer and assignee roles, changed-file review, pipeline stages, jobs, logs, and merge controls. Data and mutations remain host-owned.',
      },
    },
  },
  args: { initialView: 'merge-request' },
  argTypes: {
    initialView: { control: 'inline-radio', options: ['merge-request', 'changes', 'pipeline'] },
    data: { control: false },
  },
} satisfies Meta<typeof GitLabShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const MergeRequest: Story = {}
export const Changes: Story = { args: { initialView: 'changes' } }
export const Pipeline: Story = { args: { initialView: 'pipeline' } }
