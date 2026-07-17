import type { Template } from '../types/template'
import { canParsePredicate } from './alerts'

// Built-in components — kept in sync with WidgetRegistry. Custom widgets
// registered via registerWidget() are accepted at runtime and would
// otherwise show up here as warnings; pass them via knownExtra so the
// validator stays quiet for app-specific names.
export const BUILTIN_COMPONENTS: ReadonlySet<string> = new Set([
  'timeseries', 'candlestick', 'table', 'metric', 'text', 'prompt',
  'gauge', 'distribution', 'heatmap', 'events', 'catalog', 'asset_catalog',
  'object_view', 'code_browser', 'record_grid', 'record_board',
  'record_calendar', 'record_form', 'orderbook',
  'paired_grid', 'trade', 'ticker', 'volume_profile', 'stat_strip',
  'bar_chart', 'scatter', 'clock', 'treemap', 'image', 'iframe',
  'histogram', 'section', 'area_chart', 'slider', 'select', 'boxplot',
  'radar', 'dag', 'multi_select', 'json', 'sparkline', 'action_log', 'alert_log', 'tape',
  'file_browser',
])

export type ValidationSeverity = 'error' | 'warn'

export interface ValidationIssue {
  path: string
  severity: ValidationSeverity
  message: string
}

// Walks a template and surfaces the authoring mistakes that lose time at
// runtime: unknown components, conflicting source modes, span out of
// range, malformed alert predicates. Returns [] for a valid template.
// Never throws — a validator that crashes on bad input is useless.
export function validateTemplate(
  template: Template,
  knownExtra?: Iterable<string>,
): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  if (!template || typeof template !== 'object') {
    issues.push({ path: '', severity: 'error', message: 'template is not an object' })
    return issues
  }
  if (!Array.isArray(template.widgets)) {
    issues.push({ path: 'widgets', severity: 'error', message: 'widgets must be an array' })
    return issues
  }
  const known = knownExtra ? new Set([...BUILTIN_COMPONENTS, ...knownExtra]) : BUILTIN_COMPONENTS

  template.widgets.forEach((w, i) => {
    const p = `widgets[${i}]`
    if (!w || typeof w !== 'object') {
      issues.push({ path: p, severity: 'error', message: 'widget is not an object' })
      return
    }
    if (!w.component || typeof w.component !== 'string') {
      issues.push({ path: `${p}.component`, severity: 'error', message: 'missing component' })
    } else if (!known.has(w.component)) {
      issues.push({
        path: `${p}.component`,
        severity: 'warn',
        message: `unknown component "${w.component}" — register via registerWidget() or fix the spelling`,
      })
    }
    if (w.span != null && (!Number.isInteger(w.span) || w.span < 1 || w.span > 12)) {
      issues.push({ path: `${p}.span`, severity: 'warn', message: `span ${w.span} out of range 1..12` })
    }
    if (w.refresh_policy != null &&
        w.refresh_policy !== 'global' &&
        w.refresh_policy !== 'self' &&
        w.refresh_policy !== 'manual') {
      issues.push({
        path: `${p}.refresh_policy`,
        severity: 'error',
        message: `refresh_policy ${JSON.stringify(w.refresh_policy)} must be "global" | "self" | "manual"`,
      })
    }
    if (w.source) {
      const s = w.source
      const modes: string[] = []
      if (s.source_id) modes.push('source_id')
      if (s.url) modes.push('url')
      if (s.inline !== undefined || s.data !== undefined) modes.push('inline')
      if (modes.length > 1) {
        issues.push({
          path: `${p}.source`,
          severity: 'error',
          message: `multiple source modes set (${modes.join(', ')}); pick one`,
        })
      } else if (modes.length === 0) {
        issues.push({
          path: `${p}.source`,
          severity: 'warn',
          message: 'source declared but no mode (source_id / url / inline)',
        })
      }
      if (s.stream && (s.refreshIntervalMs ?? s.refreshInterval)) {
        issues.push({
          path: `${p}.source`,
          severity: 'warn',
          message: 'stream + refreshIntervalMs both set; refresh is ignored on streaming sources',
        })
      }
    }
    if (w.alert) {
      if (typeof w.alert.when !== 'string' || !canParsePredicate(w.alert.when)) {
        issues.push({
          path: `${p}.alert.when`,
          severity: 'error',
          message: `alert predicate ${JSON.stringify(w.alert.when)} does not parse`,
        })
      }
      if (typeof w.alert.message !== 'string' || !w.alert.message) {
        issues.push({ path: `${p}.alert.message`, severity: 'warn', message: 'alert has no message' })
      }
    }
  })

  return issues
}
