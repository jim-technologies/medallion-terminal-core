import type { Meta, StoryObj } from '@storybook/react'
import { ProductArchetypeShowcase } from '../../shared/archetypes/ProductArchetypeShowcase'

const meta = {
  title: 'Clones/OpenAI/ChatGPT',
  component: ProductArchetypeShowcase,
  parameters: {
    layout: 'fullscreen',
    cloneVendor: 'OpenAI',
    cloneProduct: 'OpenAI ChatGPT',
    cloneNamespace: 'openai-chatgpt',
    docs: { description: { component: 'A ChatGPT-style assistant reference with conversation history, project context, tool-ready prompting, structured answers, and an editable canvas presentation.' } },
  },
  args: { product: 'openai-chatgpt', initialView: 'conversation' },
  argTypes: {
    product: { control: false },
    initialView: { control: 'inline-radio', options: ['conversation', 'projects', 'canvas'] },
  },
} satisfies Meta<typeof ProductArchetypeShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const AssistantConversation: Story = {}
export const ProjectContext: Story = { args: { initialView: 'projects' } }
export const CanvasWorkspace: Story = { args: { initialView: 'canvas' } }
