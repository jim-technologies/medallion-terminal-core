import type { WidgetConfig } from '../types/template'
import type { DispatchOptions, WidgetAction } from './DashboardContext'

// Pure reducer for widget mutations. Used by Dashboard.dispatch.
//
// Rules:
//   - If `replaceAll` is set, drop existing widgets before applying.
//   - `action.remove` deletes the targeted widget (no-op if absent).
//   - Otherwise, an action with a matching id merges into that widget;
//     a non-matching id appends a new widget.
export function applyActions(
  prev: WidgetConfig[],
  actions: WidgetAction[],
  options?: DispatchOptions,
): WidgetConfig[] {
  const next = options?.replaceAll ? [] : [...prev]
  for (const action of actions) {
    const idx = next.findIndex(w => w.id === action.targetId)
    if (action.remove) {
      if (idx >= 0) next.splice(idx, 1)
      continue
    }
    if (idx >= 0) {
      next[idx] = {
        ...next[idx],
        ...(action.component !== undefined && { component: action.component }),
        ...(action.title !== undefined && { title: action.title }),
        ...(action.span !== undefined && { span: action.span }),
        ...(action.height !== undefined && { height: action.height }),
        ...(action.source !== undefined && { source: action.source }),
        ...(action.options !== undefined && { options: action.options }),
      }
    } else {
      next.push({
        id: action.targetId,
        component: action.component || 'placeholder',
        title: action.title,
        span: action.span,
        height: action.height,
        source: action.source,
        options: action.options,
      })
    }
  }
  return next
}
