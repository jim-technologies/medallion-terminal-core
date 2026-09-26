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
    // Previous is disabled on the first page; Next is live.
    expect(html).toMatch(/<button type="button" disabled=""[^>]*>.*?<span class="mtc-button-label">Previous<\/span>/)
    expect(html).toMatch(/<button type="button"(?! disabled)[^>]*>.*?<span class="mtc-button-label">Next<\/span>/)
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
    // A deep link can go back to the first page; there is no next cursor.
    expect(html).toMatch(/<button type="button"(?! disabled)[^>]*>.*?<span class="mtc-button-label">Newer<\/span>/)
    expect(html).toMatch(/<button type="button" disabled=""[^>]*>.*?<span class="mtc-button-label">Older<\/span>/)
    expect(html).not.toContain('opaque-current-page')
  })
})
