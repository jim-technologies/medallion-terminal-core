import { useLayoutEffect, useState, type ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Dashboard } from '../../src/core/Dashboard'
import { MultiDashboard } from '../../src/core/MultiDashboard'
import {
  AUTHORIZED_WORKSPACE_TEMPLATE,
  GOVERNED_WORKFLOW_TEMPLATE,
  LARGE_COLLECTIONS_TEMPLATE,
  READINESS_BACKEND_HEADERS,
  READINESS_BACKEND_URL,
  READINESS_TABS,
  RESILIENCE_LAB_TEMPLATE,
} from './readinessTemplates'
import { installReadinessTerminalMock } from './readinessTerminalMock'

type ReadinessView = 'connected' | 'access' | 'resilience' | 'scale' | 'workflow'

interface ProductionReadinessShowcaseProps {
  view?: ReadinessView
}

function ProductionReadinessShowcase({
  view = 'connected',
}: ProductionReadinessShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (view === 'connected') {
    return (
      <MultiDashboard
        tabs={READINESS_TABS}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        backendUrl={READINESS_BACKEND_URL}
        backendHeaders={READINESS_BACKEND_HEADERS}
      />
    )
  }

  const template = view === 'access'
    ? AUTHORIZED_WORKSPACE_TEMPLATE
    : view === 'resilience'
      ? RESILIENCE_LAB_TEMPLATE
      : view === 'scale'
        ? LARGE_COLLECTIONS_TEMPLATE
        : GOVERNED_WORKFLOW_TEMPLATE

  return (
    <Dashboard
      template={template}
      backendUrl={READINESS_BACKEND_URL}
      backendHeaders={READINESS_BACKEND_HEADERS}
    />
  )
}

function ReadinessTerminalBoundary({ children }: { children: ReactNode }) {
  // Install before Dashboard's passive data-loading effects and restore when
  // Storybook unmounts the story. Only the reserved example.test origin is
  // intercepted; unrelated requests continue through the browser's fetch.
  useLayoutEffect(() => installReadinessTerminalMock(), [])
  return children
}

const meta = {
  title: 'Examples/Production Readiness',
  component: ProductionReadinessShowcase,
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    docs: {
      description: {
        component:
          'A generic, production-focused suite using the real Dashboard against a scoped '
          + 'in-browser TerminalService fixture. It proves host-owned authorization, safe denials, '
          + 'failure recovery, opaque-cursor scale, governed writes, and multi-tab composition '
          + 'without adding vendor-specific APIs to the library.',
      },
    },
  },
  decorators: [
    Story => (
      <ReadinessTerminalBoundary>
        <Story />
      </ReadinessTerminalBoundary>
    ),
  ],
  args: { view: 'connected' },
  argTypes: {
    view: {
      control: 'inline-radio',
      options: ['connected', 'access', 'resilience', 'scale', 'workflow'],
    },
  },
} satisfies Meta<typeof ProductionReadinessShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const ConnectedWorkspace: Story = {}

export const AuthorizedWorkspace: Story = {
  args: { view: 'access' },
}

export const FailureAndRecovery: Story = {
  args: { view: 'resilience' },
}

export const LargeCollections: Story = {
  args: { view: 'scale' },
}

export const GovernedWorkflow: Story = {
  args: { view: 'workflow' },
}
