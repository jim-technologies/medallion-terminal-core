import { describe, expect, it } from 'vitest'
import { buildSnapshot, isStaticTemplate, widgetSnapshotKey } from '../core/snapshot'
import { validateTemplate } from '../core/validateTemplate'
import type { Template, WidgetConfig } from '../types/template'

describe('widgetSnapshotKey', () => {
  it('prefers the widget id', () => {
    expect(widgetSnapshotKey({ component: 'metric', id: 'px' }, 3)).toBe('px')
  })
  it('falls back to index for anonymous widgets', () => {
    expect(widgetSnapshotKey({ component: 'metric' }, 3)).toBe('__mt_idx_3')
  })
})

describe('isStaticTemplate', () => {
  it('is false for an empty template', () => {
    expect(isStaticTemplate({ widgets: [] })).toBe(false)
  })
  it('is true when every widget is inline or sourceless', () => {
    const tpl: Template = {
      widgets: [
        { component: 'metric', source: { inline: { value: 1 } } },
        { component: 'clock' }, // no source — still static
      ],
    }
    expect(isStaticTemplate(tpl)).toBe(true)
  })
  it('treats the legacy `data` alias as inline', () => {
    expect(isStaticTemplate({ widgets: [{ component: 'metric', source: { data: 1 } }] })).toBe(true)
  })
  it('is false when any widget has a live source', () => {
    const tpl: Template = {
      widgets: [
        { component: 'metric', source: { inline: { value: 1 } } },
        { component: 'table', source: { source_id: 'positions' } },
      ],
    }
    expect(isStaticTemplate(tpl)).toBe(false)
  })
  it('is false for a url source', () => {
    expect(isStaticTemplate({ widgets: [{ component: 'table', source: { url: '/x' } }] })).toBe(false)
  })
})

describe('buildSnapshot', () => {
  const liveTemplate: Template = {
    title: '${ctx.symbol} desk',
    columns: 12,
    context: { values: { symbol: 'BTC' } },
    widgets: [
      { id: 'px', component: 'metric', source: { source_id: 'price', stream: true } },
      { id: 'tbl', component: 'table', source: { url: '/api/positions', refreshIntervalMs: 5000 } },
      { component: 'clock' }, // anonymous, sourceless
    ],
  }
  const widgets = liveTemplate.widgets
  const ctx = { symbol: 'ETH' }
  const data: Record<string, unknown> = {
    px: { value: 3500 },
    tbl: { columns: ['sym'], rows: [['ETH']] },
  }
  const getData = (w: WidgetConfig, i: number) => data[widgetSnapshotKey(w, i)]

  it('bakes captured data into source.inline and drops the live source', () => {
    const snap = buildSnapshot(liveTemplate, widgets, ctx, getData, '2026-06-04T00:00:00.000Z')
    expect(snap.widgets[0].source).toEqual({ inline: { value: 3500 } })
    expect(snap.widgets[1].source).toEqual({ inline: { columns: ['sym'], rows: [['ETH']] } })
    // No live-source fields survive.
    expect(snap.widgets[0].source).not.toHaveProperty('source_id')
    expect(snap.widgets[0].source).not.toHaveProperty('stream')
    expect(snap.widgets[1].source).not.toHaveProperty('url')
    expect(snap.widgets[1].source).not.toHaveProperty('refreshIntervalMs')
  })

  it('produces a static template that validates clean', () => {
    const snap = buildSnapshot(liveTemplate, widgets, ctx, getData, '2026-06-04T00:00:00.000Z')
    expect(isStaticTemplate(snap)).toBe(true)
    expect(validateTemplate(snap)).toEqual([])
  })

  it('bakes the active ctx in as defaults and stamps frozenAt', () => {
    const snap = buildSnapshot(liveTemplate, widgets, ctx, getData, '2026-06-04T00:00:00.000Z')
    expect(snap.context).toEqual({ values: { symbol: 'ETH' } })
    expect(snap.frozenAt).toBe('2026-06-04T00:00:00.000Z')
  })

  it('leaves a sourceless widget untouched', () => {
    const snap = buildSnapshot(liveTemplate, widgets, ctx, getData)
    expect(snap.widgets[2]).toEqual({ component: 'clock' })
    expect(snap.frozenAt).toBeUndefined()
  })

  it('freezes a live widget with no captured data to an empty inline', () => {
    // px still loading → getData returns undefined → bake inline:null so
    // the viewer paints empty instead of hitting a dead backend.
    const snap = buildSnapshot(liveTemplate, widgets, ctx, () => undefined)
    expect(snap.widgets[0].source).toEqual({ inline: null })
    expect(snap.widgets[1].source).toEqual({ inline: null })
    expect(snap.widgets[2]).toEqual({ component: 'clock' })
    expect(isStaticTemplate(snap)).toBe(true)
  })

  it('captures the current (post-edit) widget set, not the original', () => {
    // Simulate an AI edit that added a widget after initial render.
    const edited: WidgetConfig[] = [
      ...widgets,
      { id: 'note', component: 'text', source: { source_id: 'ai_note' } },
    ]
    const withNote: Record<string, unknown> = { ...data, note: { text: 'frozen analysis' } }
    const snap = buildSnapshot(
      liveTemplate, edited, ctx,
      (w, i) => withNote[widgetSnapshotKey(w, i)],
      '2026-06-04T00:00:00.000Z',
    )
    expect(snap.widgets).toHaveLength(4)
    expect(snap.widgets[3].source).toEqual({ inline: { text: 'frozen analysis' } })
  })
})
