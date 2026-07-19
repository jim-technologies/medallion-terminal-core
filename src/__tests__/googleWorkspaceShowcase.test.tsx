import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  GoogleWorkspaceEditor,
  workspaceCellName,
  workspaceColumnName,
  type WorkspaceDocumentContent,
} from '../../examples/clones/google/workspace/GoogleWorkspaceEditor'

describe('GoogleWorkspaceEditor', () => {
  it('generates spreadsheet coordinates beyond the first alphabet cycle', () => {
    expect(workspaceColumnName(0)).toBe('A')
    expect(workspaceColumnName(25)).toBe('Z')
    expect(workspaceColumnName(26)).toBe('AA')
    expect(workspaceColumnName(701)).toBe('ZZ')
    expect(workspaceCellName(8, 27)).toBe('AB9')
  })

  it('server-renders the complete Docs editing anatomy', () => {
    const html = renderToStaticMarkup(<GoogleWorkspaceEditor product="docs" />)

    expect(html).toContain('Q3 operating plan')
    expect(html).toContain('Q3 Operating Plan')
    expect(html).toContain('Executive summary')
    expect(html).toContain('Document outline')
    expect(html).toContain('Saved to Drive')
    expect(html).toContain('Share')
    expect(html).toContain('Account: Jun')
  })

  it('server-renders the Sheets grid, formula bar, and tabs', () => {
    const html = renderToStaticMarkup(
      <GoogleWorkspaceEditor product="sheets" initialCell="F7" initialGeminiOpen />,
    )

    expect(html).toContain('FY26 revenue model')
    expect(html).toContain('Formula bar')
    expect(html).toContain('$648,000')
    expect(html).toContain('Scenario plan')
    expect(html).toContain('Analyze and build faster')
  })

  it('server-renders the Slides filmstrip, canvas, and presentation controls', () => {
    const html = renderToStaticMarkup(
      <GoogleWorkspaceEditor product="slides" initialSlide={2} />,
    )

    expect(html).toContain('Q3 business review')
    expect(html).toContain('Revenue compounds as teams expand')
    expect(html).toContain('Click to add speaker notes')
    expect(html).toContain('Slideshow')
    expect(html).toContain('Add slide')
    expect(html).toContain('JIM TECHNOLOGIES')
  })

  it('accepts host-provided neutral document content', () => {
    const content: WorkspaceDocumentContent = {
      kind: 'document',
      title: 'Customer brief',
      heading: 'Northwind implementation brief',
      sections: [{
        heading: 'Decision',
        paragraphs: ['Launch the unified customer workspace in August.'],
      }],
    }
    const html = renderToStaticMarkup(
      <GoogleWorkspaceEditor product="docs" content={content} />,
    )

    expect(html).toContain('Customer brief')
    expect(html).toContain('Northwind implementation brief')
    expect(html).not.toContain('Q3 Operating Plan')
  })
})
