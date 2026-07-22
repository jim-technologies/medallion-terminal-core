import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  DashboardContext,
  DEFAULT_DASHBOARD_CONTEXT,
} from '../core/DashboardContext'
import { CursorPager, cursorPageTokenKey } from '../widgets/CursorPager'

describe('CursorPager', () => {
  it('derives isolated default keys and honors an explicit key', () => {
    expect(cursorPageTokenKey('assets')).toBe('assets_page_token')
    expect(cursorPageTokenKey()).toBe('page_token')
    expect(cursorPageTokenKey('assets', { page_token_key: 'catalog_cursor' }))
      .toBe('catalog_cursor')
  })

  it('stays hidden when neither direction is available', () => {
    expect(renderToStaticMarkup(<CursorPager widgetId="assets" />)).toBe('')
  })

  it('renders a forward-only first page without exposing the token', () => {
    const html = renderToStaticMarkup(
      <CursorPager
        widgetId="assets"
        nextPageToken="opaque-secret-cursor"
        ariaLabel="Asset pages"
      />,
    )

    expect(html).toContain('aria-label="Asset pages"')
    expect(html).toContain('data-page-token-key="assets_page_token"')
    expect(html).toContain('<button type="button" disabled=""')
    expect(html).toContain('>Next</button>')
    expect(html).not.toContain('opaque-secret-cursor')
  })

  it('supports a deep-linked cursor and product-appropriate labels', () => {
    const html = renderToStaticMarkup(
      <DashboardContext.Provider value={{
        ...DEFAULT_DASHBOARD_CONTEXT,
        ctx: { history_cursor: 'opaque-current-page' },
      }}>
        <CursorPager
          widgetId="conversation"
          options={{
            page_token_key: 'history_cursor',
            previous_label: 'Newer',
            next_label: 'Older',
          }}
        />
      </DashboardContext.Provider>,
    )

    expect(html).toContain('data-page-token-key="history_cursor"')
    expect(html).toContain('>Newer</button>')
    expect(html).toContain('disabled=""')
    expect(html).toContain('>Older</button>')
    expect(html).not.toContain('opaque-current-page')
  })
})
