import { describe, expect, it } from 'vitest'
import { validateTemplate } from '../core/validateTemplate'
import type { Template } from '../types/template'

describe('validateTemplate', () => {
  it('accepts a minimal valid template', () => {
    const tpl: Template = {
      widgets: [{ component: 'metric', source: { inline: { value: 1 } } }],
    }
    expect(validateTemplate(tpl)).toEqual([])
  })

  it('flags unknown components as warnings', () => {
    const tpl: Template = {
      widgets: [{ component: 'nonexistent_widget', source: { inline: 1 } }],
    }
    const issues = validateTemplate(tpl)
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ severity: 'warn', path: 'widgets[0].component' })
  })

  it('accepts custom widgets via knownExtra', () => {
    const tpl: Template = {
      widgets: [{ component: 'kelly', source: { inline: 1 } }],
    }
    expect(validateTemplate(tpl, ['kelly'])).toEqual([])
  })

  it('errors on multiple source modes', () => {
    const tpl: Template = {
      widgets: [{ component: 'metric', source: { source_id: 'x', url: 'https://y' } }],
    }
    const issues = validateTemplate(tpl)
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ severity: 'error', path: 'widgets[0].source' })
  })

  it('warns on stream + refreshIntervalMs together', () => {
    const tpl: Template = {
      widgets: [{ component: 'timeseries', source: { url: 'x', stream: true, refreshIntervalMs: 1000 } }],
    }
    const issues = validateTemplate(tpl)
    expect(issues.some(i => i.message.includes('refresh'))).toBe(true)
  })

  it('warns on span out of range', () => {
    const tpl: Template = {
      widgets: [{ component: 'metric', span: 99, source: { inline: 1 } }],
    }
    expect(validateTemplate(tpl)).toEqual([
      { path: 'widgets[0].span', severity: 'warn', message: 'span 99 out of range 1..12' },
    ])
  })

  it('errors on unparseable alert predicate', () => {
    const tpl: Template = {
      widgets: [{
        component: 'metric',
        source: { inline: 1 },
        alert: { when: 'just words', message: 'hi' },
      }],
    }
    const issues = validateTemplate(tpl)
    expect(issues.some(i => i.severity === 'error' && i.path === 'widgets[0].alert.when')).toBe(true)
  })

  it('accepts AND/OR alert predicates', () => {
    const tpl: Template = {
      widgets: [{
        component: 'metric',
        source: { inline: 1 },
        alert: { when: 'value > 70000 && volume > 1e8', message: 'whale' },
      }],
    }
    expect(validateTemplate(tpl)).toEqual([])
  })

  it('errors on non-object template', () => {
    expect(validateTemplate(null as never)).toHaveLength(1)
  })
})
