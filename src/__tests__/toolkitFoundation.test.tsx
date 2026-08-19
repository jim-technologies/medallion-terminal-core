import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { Button } from '../components/Button'
import { FormField, Input } from '../components/FormControls'
import { Breadcrumbs } from '../components/Navigation'
import { DesignSystemProvider } from '../foundations/DesignSystemProvider'
import { PropertyList } from '../workbench/PropertyList'
import { SplitPane } from '../workbench/SplitPane'
import { LoadingState } from '../workbench/States'
import {
  fileEntryIdentity,
  isFolder,
  previewKind,
  type FileBrowserEntry,
} from '../widgets/fileBrowserHelpers'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')

describe('design-system foundations', () => {
  it('renders deterministic scoped theme and density attributes for SSR', () => {
    const render = () => renderToStaticMarkup(
      <DesignSystemProvider theme="high-contrast" density="compact">
        <Button>Inspect</Button>
      </DesignSystemProvider>,
    )
    const first = render()
    expect(first).toBe(render())
    expect(first).toContain('class="mtc-root mtc-design-system mtc-theme-high-contrast"')
    expect(first).toContain('data-theme="high-contrast"')
    expect(first).toContain('data-density="compact"')
  })

  it('disables loading actions and exposes their busy state', () => {
    const html = renderToStaticMarkup(
      <DesignSystemProvider>
        <Button loading loadingLabel="Saving">Save</Button>
      </DesignSystemProvider>,
    )
    expect(html).toContain('disabled=""')
    expect(html).toContain('aria-busy="true"')
    expect(html).toContain('Saving')
  })

  it('publishes scoped density, intent, and reduced-motion tokens', () => {
    for (const token of [
      '--mtc-background',
      '--mtc-foreground',
      '--mtc-intent-info',
      '--mtc-space-4',
      '--mtc-radius-lg',
      '--mtc-elevation-2',
      '--mtc-duration-normal',
      '--mtc-control-height-md',
    ]) expect(css).toContain(token)
    expect(css).toContain('.mtc-root[data-density="compact"]')
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).not.toMatch(/^\s*(?:html|body)\s*[{,]/m)
  })

  it('preserves child field IDs and merges external and generated descriptions', () => {
    const html = renderToStaticMarkup(
      <DesignSystemProvider>
        <div id="external-help">External help</div>
        <FormField id="ignored-id" label="Name" description="Field help" error="Required">
          <Input id="stable-name" aria-describedby="external-help" />
        </FormField>
      </DesignSystemProvider>,
    )
    expect(html).toContain('for="stable-name"')
    expect(html).toContain('id="stable-name"')
    expect(html).toContain(
      'aria-describedby="external-help stable-name-description stable-name-error"',
    )
  })

  it('keeps split-pane host styles and reports the physical separator axis', () => {
    const html = renderToStaticMarkup(
      <DesignSystemProvider>
        <SplitPane
          primary="Explorer"
          secondary="Content"
          orientation="horizontal"
          style={{ backgroundColor: 'red' }}
        />
      </DesignSystemProvider>,
    )
    expect(html).toContain('aria-orientation="vertical"')
    expect(html).toContain('background-color:red')
  })

  it('handles one-item breadcrumb limits without duplicating locations', () => {
    const html = renderToStaticMarkup(
      <DesignSystemProvider>
        <Breadcrumbs
          maxItems={1}
          items={[
            { label: 'Root', href: '#root' },
            { label: 'Current' },
          ]}
        />
      </DesignSystemProvider>,
    )
    expect(html).not.toContain('Root')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain('Current')
  })

  it('renders arbitrary property values safely when JSON has no representation', () => {
    const html = renderToStaticMarkup(
      <DesignSystemProvider>
        <PropertyList
          items={[
            { label: 'Handler', value: function inspectObject() {} },
            { label: 'Private marker', value: Symbol('private') },
          ]}
        />
      </DesignSystemProvider>,
    )

    expect(html).toContain('Handler')
    expect(html).toContain('inspectObject')
    expect(html).toContain('Private marker')
    expect(html).toContain('Symbol(private)')
  })

  it('keeps skeleton loading output bounded for malformed host input', () => {
    const html = renderToStaticMarkup(
      <DesignSystemProvider>
        <LoadingState variant="skeleton" lines={Number.NaN} />
      </DesignSystemProvider>,
    )

    expect(html.match(/<span/g)).toHaveLength(3)
    expect(html).toContain('aria-busy="true"')
  })
})

describe('object-aware file entries', () => {
  it('prefers stable IDs and retains path fallback', () => {
    expect(fileEntryIdentity({
      id: 'object-1',
      path: 'reports/a.pdf',
      name: 'a.pdf',
    })).toBe('id:object-1')
    expect(fileEntryIdentity({
      path: 'reports/a.pdf',
      name: 'a.pdf',
    })).toBe('path:reports/a.pdf')
    expect(fileEntryIdentity({ name: 'a.pdf' }, 'reports')).toBe('path:reports/a.pdf')
  })

  it('uses explicit container and semantic metadata before filename extensions', () => {
    expect(isFolder({ kind: 'video', is_container: true })).toBe(true)
    expect(isFolder({ kind: 'folder', is_container: false })).toBe(false)
    expect(previewKind('application/pdf', 'misleading.mp4', 'document')).toBe('pdf')
    expect(previewKind('video/mp4', 'misleading.jpg', 'video')).toBe('video')
    expect(previewKind(undefined, 'legacy.mp4')).toBe('video')
  })

  it('preserves capabilities and unresolved link metadata as passive fields', () => {
    const entry: FileBrowserEntry = {
      id: 'link-1',
      kind: 'document',
      name: 'shortcut',
      capabilities: ['read', 'open'],
      symlink_target_id: 'target-1',
    }
    expect(entry.capabilities).toEqual(['read', 'open'])
    expect(entry.symlink_target_id).toBe('target-1')
  })
})
