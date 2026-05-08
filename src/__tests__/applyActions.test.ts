import { describe, it, expect } from 'vitest'
import { applyActions } from '../core/applyActions'
import type { WidgetConfig } from '../types/template'

const widgets: WidgetConfig[] = [
  { id: 'a', component: 'metric', title: 'A', span: 4 },
  { id: 'b', component: 'timeseries', title: 'B', span: 8 },
]

describe('applyActions', () => {
  it('updates an existing widget by id (merge, missing fields preserved)', () => {
    const out = applyActions(widgets, [{ targetId: 'a', title: 'A2' }])
    expect(out[0]).toEqual({ id: 'a', component: 'metric', title: 'A2', span: 4 })
    expect(out[1]).toBe(widgets[1])
  })

  it('appends a new widget when targetId is unknown', () => {
    const out = applyActions(widgets, [{ targetId: 'c', component: 'gauge' }])
    expect(out).toHaveLength(3)
    expect(out[2].id).toBe('c')
    expect(out[2].component).toBe('gauge')
  })

  it('removes a widget when action.remove is set', () => {
    const out = applyActions(widgets, [{ targetId: 'a', remove: true }])
    expect(out).toHaveLength(1)
    expect(out[0].id).toBe('b')
  })

  it('remove on missing id is a no-op', () => {
    const out = applyActions(widgets, [{ targetId: 'zzz', remove: true }])
    expect(out).toHaveLength(2)
  })

  it('replaceAll drops existing widgets before applying actions', () => {
    const out = applyActions(
      widgets,
      [{ targetId: 'x', component: 'gauge' }, { targetId: 'y', component: 'heatmap' }],
      { replaceAll: true },
    )
    expect(out).toHaveLength(2)
    expect(out.map(w => w.id)).toEqual(['x', 'y'])
  })

  it('replaceAll with no actions clears the dashboard', () => {
    const out = applyActions(widgets, [], { replaceAll: true })
    expect(out).toEqual([])
  })

  it('does not mutate the input array', () => {
    const before = [...widgets]
    applyActions(widgets, [{ targetId: 'a', remove: true }])
    expect(widgets).toEqual(before)
  })

  it('falls back to "placeholder" when creating a widget without component', () => {
    const out = applyActions([], [{ targetId: 'new', title: 'T' }])
    expect(out[0].component).toBe('placeholder')
  })
})
