// Snapshot — freeze a live dashboard into a static, self-contained
// Template.
//
// The terminal's flow: a user prompts the AI to build a dashboard,
// iterates until happy, then "shares" it. Sharing must capture exactly
// what's on screen — AI-generated analysis and metrics must NOT be
// recomputed or regenerated for the recipient. So a snapshot bakes each
// widget's *current* in-memory data into `source.inline`, dropping the
// live source (`source_id` / `url` / `stream` / polling). The result
// renders with the same widgets and layout but zero backend calls.
//
// This is a pure transform over (template, widgets, ctx, data). The
// Dashboard wires `getData` to read each widget's current data from a
// ref registry; tests pass a plain function. Binary media (image /
// video / pdf) is referenced by URL inside widget options, not inlined,
// so a snapshot stays small and a 2-hour video still seeks by Range.

import type { Template, WidgetConfig } from '../types/template'

// Stable key identifying a widget for data capture. Prefers the
// author-assigned id; falls back to grid index for anonymous widgets so
// every tile can still be frozen. Dashboard and buildSnapshot derive the
// key the same way so capture and bake line up.
export function widgetSnapshotKey(widget: WidgetConfig, index: number): string {
  return widget.id || `__mt_idx_${index}`
}

// Does this template render fully offline? True when every widget either
// has no source or carries inline data (no live source_id/url). Viewers
// use it to show a static-view badge and hide live-only chrome.
export function isStaticTemplate(template: Template): boolean {
  const widgets = template?.widgets
  if (!Array.isArray(widgets) || widgets.length === 0) return false
  return widgets.every(w => {
    const s = w.source
    if (!s) return true
    const hasInline = s.inline !== undefined || s.data !== undefined
    const hasLive = !!(s.source_id || s.url)
    return hasInline || !hasLive
  })
}

// Build a frozen Template from the live one. `getData(widget, index)`
// returns the widget's current rendered data (post-transform, as the
// widget sees it) or `undefined` if none was captured. ctx is baked in
// as the new defaults so interpolated titles/labels match the frame the
// user approved.
export function buildSnapshot(
  template: Template,
  widgets: WidgetConfig[],
  ctx: Record<string, string>,
  getData: (widget: WidgetConfig, index: number) => unknown,
  frozenAt?: string,
): Template {
  const frozenWidgets = widgets.map((w, i) => {
    const data = getData(w, i)
    if (data === undefined) {
      // No data captured. If the widget had a live source (still loading,
      // errored, or not yet registered), replace it with an empty inline
      // so the viewer paints "no data" instead of hitting a dead backend.
      // Otherwise (a sourceless widget like a clock or section) leave it.
      const s = w.source
      if (s && (s.source_id || s.url || s.stream)) {
        return { ...w, source: { inline: null } }
      }
      return w
    }
    // Bake the captured data; drop every live-source field. transform was
    // already applied when the data was captured, so it's intentionally
    // not carried over.
    return { ...w, source: { inline: data } }
  })

  const snapshot: Template = {
    ...template,
    context: { values: { ...ctx } },
    widgets: frozenWidgets,
  }
  if (frozenAt) snapshot.frozenAt = frozenAt
  return snapshot
}
