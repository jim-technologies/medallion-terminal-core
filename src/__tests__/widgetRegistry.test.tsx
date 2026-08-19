import type { ComponentType } from 'react'
import { describe, expect, it } from 'vitest'
import {
  BUILTIN_KEYS,
  createWidgetRegistry,
  getWidget,
  registerWidget,
} from '../core/WidgetRegistry'
import { validateTemplate } from '../core/validateTemplate'
import type { WidgetProps } from '../types/template'

const WidgetA: ComponentType<WidgetProps> = () => <div>A</div>
const WidgetB: ComponentType<WidgetProps> = () => <div>B</div>

describe('scoped widget registries', () => {
  it('keeps registrations isolated and includes built-ins by default', () => {
    const left = createWidgetRegistry()
    const right = createWidgetRegistry()
    left.register('workspace_widget', WidgetA)
    right.register('workspace_widget', WidgetB)

    expect(left.get('workspace_widget')).toBe(WidgetA)
    expect(right.get('workspace_widget')).toBe(WidgetB)
    expect(left.has('timeseries')).toBe(true)
    expect(right.has('timeseries')).toBe(true)
    expect(BUILTIN_KEYS.has('timeseries')).toBe(true)
  })

  it('can explicitly omit built-ins without mutating other registries', () => {
    const empty = createWidgetRegistry({ includeBuiltIns: false })
    const normal = createWidgetRegistry()
    expect(empty.has('timeseries')).toBe(false)
    expect(normal.has('timeseries')).toBe(true)
    expect(validateTemplate(
      { widgets: [{ component: 'timeseries' }] },
      empty.keys(),
      { includeBuiltIns: false },
    )).toEqual([
      expect.objectContaining({
        path: 'widgets[0].component',
        severity: 'warn',
      }),
    ])
  })

  it('feeds instance keys into template validation', () => {
    const registry = createWidgetRegistry()
    registry.register('workspace_widget', WidgetA)
    const issues = validateTemplate({
      widgets: [{ component: 'workspace_widget' }],
    }, registry.keys())
    expect(issues).toEqual([])
  })
})

describe('legacy global widget registration', () => {
  it('preserves global registration behavior without leaking into instances', () => {
    const name = '__legacy_registry_compatibility__'
    registerWidget(name, WidgetA)
    expect(getWidget(name)).toBe(WidgetA)
    expect(createWidgetRegistry().has(name)).toBe(false)
  })
})
