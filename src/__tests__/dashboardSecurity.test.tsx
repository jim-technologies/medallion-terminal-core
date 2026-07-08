import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Dashboard } from '../core/Dashboard'
import { DEFAULT_UNTRUSTED_TEMPLATE_POLICY } from '../core/templateSecurity'
import type { Template } from '../types/template'

const urlTemplate: Template = {
  widgets: [{
    id: 'external',
    component: 'metric',
    source: { url: 'https://api.example.com/metric' },
  }],
}

describe('Dashboard template trust enforcement', () => {
  it('blocks URL templates by default when the origin is not allow-listed', () => {
    const html = renderToStaticMarkup(<Dashboard template={urlTemplate} />)
    expect(html).toContain('Template blocked')
    expect(html).toContain('URL origin https://api.example.com is not allowed')
  })

  it('renders trusted URL templates when explicitly opted in', () => {
    const html = renderToStaticMarkup(<Dashboard template={urlTemplate} templateTrust="trusted" />)
    expect(html).not.toContain('Template blocked')
  })

  it('renders untrusted URL templates when the host policy allows the origin', () => {
    const html = renderToStaticMarkup(
      <Dashboard
        template={urlTemplate}
        templateTrustPolicy={{
          ...DEFAULT_UNTRUSTED_TEMPLATE_POLICY,
          allowedUrlOrigins: ['https://api.example.com'],
        }}
      />,
    )
    expect(html).not.toContain('Template blocked')
  })
})
