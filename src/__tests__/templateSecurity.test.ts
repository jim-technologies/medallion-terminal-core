import { describe, expect, it } from 'vitest'
import {
  DEFAULT_IFRAME_SANDBOX,
  DEFAULT_UNTRUSTED_TEMPLATE_POLICY,
  validateTemplateTrust,
  type TemplateTrustPolicy,
} from '../core/templateSecurity'
import type { Template } from '../types/template'

const policy: TemplateTrustPolicy = {
  ...DEFAULT_UNTRUSTED_TEMPLATE_POLICY,
  allowedUrlOrigins: ['https://api.example.com'],
  allowedIframeOrigins: ['https://dashboards.example.com'],
  allowedHeaders: ['accept', 'content-type'],
  minRefreshIntervalMs: 5000,
}

describe('validateTemplateTrust', () => {
  it('uses a strict iframe sandbox by default', () => {
    expect(DEFAULT_IFRAME_SANDBOX).toBe('')
  })

  it('accepts allowed source URLs and relative URLs', () => {
    const tpl: Template = {
      widgets: [
        { component: 'metric', source: { url: 'https://api.example.com/metric', refreshIntervalMs: 5000 } },
        { component: 'table', source: { url: '/api/table', headers: { Accept: 'application/json' } } },
      ],
    }
    expect(validateTemplateTrust(tpl, policy)).toEqual([])
  })

  it('rejects URL origins outside the host allow-list', () => {
    const tpl: Template = {
      widgets: [{ component: 'metric', source: { url: 'https://evil.example.net/metric' } }],
    }
    const issues = validateTemplateTrust(tpl, policy)
    expect(issues).toContainEqual({
      path: 'widgets[0].source.url',
      severity: 'error',
      message: 'URL origin https://evil.example.net is not allowed',
    })
  })

  it('rejects sensitive or non-allow-listed request headers', () => {
    const tpl: Template = {
      widgets: [{
        component: 'metric',
        source: {
          url: 'https://api.example.com/metric',
          headers: {
            Authorization: 'Bearer secret',
            'X-Trace-Id': 'abc',
          },
        },
      }],
    }
    const issues = validateTemplateTrust(tpl, policy)
    expect(issues.some(i => i.path === 'widgets[0].source.headers.Authorization')).toBe(true)
    expect(issues.some(i => i.path === 'widgets[0].source.headers.X-Trace-Id')).toBe(true)
  })

  it('rejects polling intervals below the host minimum', () => {
    const tpl: Template = {
      widgets: [{
        component: 'timeseries',
        source: { url: 'https://api.example.com/ticks', refreshIntervalMs: 100 },
      }],
    }
    const issues = validateTemplateTrust(tpl, policy)
    expect(issues).toContainEqual({
      path: 'widgets[0].source.refreshIntervalMs',
      severity: 'error',
      message: 'refreshIntervalMs 100 is below host minimum 5000',
    })
  })

  it('validates iframe URLs and sandbox policy', () => {
    const tpl: Template = {
      widgets: [{
        component: 'iframe',
        source: {
          inline: {
            url: 'https://dashboards.example.com/audit',
          },
        },
      }],
    }
    expect(validateTemplateTrust(tpl, policy)).toEqual([])
  })

  it('rejects iframe sandbox escape tokens', () => {
    const tpl: Template = {
      widgets: [{
        component: 'iframe',
        source: {
          inline: {
            url: 'https://dashboards.example.com/audit',
            sandbox: 'allow-scripts allow-same-origin allow-top-navigation',
          },
        },
      }],
    }
    const issues = validateTemplateTrust(tpl, policy)
    expect(issues.some(i => i.message.includes('allow-top-navigation'))).toBe(true)
    expect(issues.some(i => i.message.includes('allow-scripts and allow-same-origin'))).toBe(true)
  })

  it('uses iframe origins for iframe options.url', () => {
    const tpl: Template = {
      widgets: [{
        component: 'iframe',
        options: {
          url: 'https://dashboards.example.com/audit',
          sandbox: 'allow-scripts',
        },
      }],
    }
    expect(validateTemplateTrust(tpl, policy)).toEqual([])
  })

  it('rejects URL origin template substitution', () => {
    const tpl: Template = {
      widgets: [{ component: 'metric', source: { url: 'https://${ctx.host}/metric' } }],
    }
    const issues = validateTemplateTrust(tpl, policy)
    expect(issues).toContainEqual({
      path: 'widgets[0].source.url',
      severity: 'error',
      message: 'URL origin may not contain template substitution',
    })
  })

  it('rejects relative URLs that could become absolute after interpolation', () => {
    const tpl: Template = {
      widgets: [
        { component: 'metric', source: { url: '${ctx.url}' } },
        { component: 'metric', source: { url: 'http${ctx.scheme}://api.example.com/metric' } },
        { component: 'metric', source: { url: '/${ctx.path}' } },
      ],
    }
    const issues = validateTemplateTrust(tpl, policy)
    expect(issues.filter(i => i.message.includes('relative URL template substitution'))).toHaveLength(3)
  })

  it('allows path/query interpolation after a fixed relative delimiter', () => {
    const tpl: Template = {
      widgets: [
        { component: 'metric', source: { url: '/api/${ctx.id}' } },
        { component: 'metric', source: { url: 'api/metric?symbol=${ctx.symbol}' } },
        { component: 'metric', source: { url: '?filter=${ctx.query}' } },
      ],
    }
    expect(validateTemplateTrust(tpl, policy)).toEqual([])
  })
})
