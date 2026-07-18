import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  GOOGLE_DRIVE_SAMPLE_ITEMS,
  GoogleDriveShowcase,
  formatGoogleDriveBytes,
  selectGoogleDriveItems,
} from '../../examples/clones/google-drive/GoogleDriveShowcase'

describe('GoogleDriveShowcase', () => {
  it('projects the generic file records into Drive sections and folders', () => {
    const root = selectGoogleDriveItems(GOOGLE_DRIVE_SAMPLE_ITEMS, 'my-drive', null, '')
    const finance = selectGoogleDriveItems(GOOGLE_DRIVE_SAMPLE_ITEMS, 'my-drive', 'finance', '')
    const shared = selectGoogleDriveItems(GOOGLE_DRIVE_SAMPLE_ITEMS, 'shared', null, '')

    expect(root.some(item => item.id === 'finance')).toBe(true)
    expect(root.some(item => item.id === 'board-notes')).toBe(false)
    expect(finance.map(item => item.id)).toEqual(['board-notes', 'budget-model'])
    expect(shared.length).toBeGreaterThan(4)
    expect(shared.every(item => item.shared && !item.trashed)).toBe(true)
  })

  it('searches across folders while excluding trashed records', () => {
    expect(
      selectGoogleDriveItems(GOOGLE_DRIVE_SAMPLE_ITEMS, 'my-drive', null, 'roadmap')
        .map(item => item.id),
    ).toEqual(['product-roadmap'])
    expect(
      selectGoogleDriveItems(GOOGLE_DRIVE_SAMPLE_ITEMS, 'trash', null, 'legacy'),
    ).toEqual([])
  })

  it('formats neutral byte sizes for the product shell', () => {
    expect(formatGoogleDriveBytes()).toBe('—')
    expect(formatGoogleDriveBytes(864_320)).toBe('844 KB')
    expect(formatGoogleDriveBytes(248_512_512)).toBe('237 MB')
  })

  it('server-renders the complete application anatomy', () => {
    const html = renderToStaticMarkup(<GoogleDriveShowcase />)

    expect(html).toContain('Search in Drive')
    expect(html).toContain('My Drive')
    expect(html).toContain('Shared with me')
    expect(html).toContain('Ask Drive about your work')
    expect(html).toContain('Suggested')
    expect(html).toContain('Folders and files')
    expect(html).toContain('8.4 GB of 30 GB used')
  })

  it('accepts host-provided records without changing the clone presentation layer', () => {
    const html = renderToStaticMarkup(
      <GoogleDriveShowcase
        showAiShelf={false}
        items={[{
          id: 'customer-folder',
          kind: 'folder',
          name: 'Customer workspace',
          modified_at: '2026-07-17T18:00:00Z',
          owner: 'me',
        }]}
      />,
    )

    expect(html).toContain('Customer workspace')
    expect(html).not.toContain('Q3 operating plan')
  })
})
