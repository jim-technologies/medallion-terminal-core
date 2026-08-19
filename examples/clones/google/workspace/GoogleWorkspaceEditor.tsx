import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { CLONE_DEMO_IDENTITY } from '../../demoIdentity'
import './GoogleWorkspaceEditor.css'

export type GoogleWorkspaceProduct = 'docs' | 'sheets' | 'slides'

export interface WorkspaceDocumentSection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
}

export interface WorkspaceDocumentContent {
  kind: 'document'
  title: string
  eyebrow?: string
  heading: string
  subtitle?: string
  sections: WorkspaceDocumentSection[]
}

export interface WorkspaceSpreadsheetContent {
  kind: 'spreadsheet'
  title: string
  columns: string[]
  rows: Array<Array<string | number>>
  sheetNames: string[]
}

export interface WorkspaceSlideData {
  id: string
  eyebrow?: string
  title: string
  body?: string
  layout: 'title' | 'metrics' | 'chart' | 'priorities' | 'timeline'
  accent?: string
}

export interface WorkspacePresentationContent {
  kind: 'presentation'
  title: string
  slides: WorkspaceSlideData[]
}

export type GoogleWorkspaceContent =
  | WorkspaceDocumentContent
  | WorkspaceSpreadsheetContent
  | WorkspacePresentationContent

export interface GoogleWorkspaceEditorProps {
  product: GoogleWorkspaceProduct
  content?: GoogleWorkspaceContent
  initialGeminiOpen?: boolean
  initialCommentsOpen?: boolean
  initialCell?: string
  initialSlide?: number
}

export const GOOGLE_DOCS_SAMPLE: WorkspaceDocumentContent = {
  kind: 'document',
  title: 'Q3 operating plan',
  eyebrow: 'FY26 · Strategy & operations',
  heading: 'Q3 Operating Plan',
  subtitle: 'A focused plan for durable growth, customer trust, and operating leverage.',
  sections: [
    {
      heading: 'Executive summary',
      paragraphs: [
        'Q3 is about converting strong product momentum into repeatable customer outcomes. '
        + 'We will concentrate investment in the workflows that make small teams measurably faster, '
        + 'while preserving the reliability and trust expected from critical business software.',
      ],
    },
    {
      heading: 'Company priorities',
      bullets: [
        'Ship the unified workspace beta to 50 design partners.',
        'Increase activation from first data connection to a live workflow.',
        'Establish weekly operating reviews with a single source of truth.',
      ],
    },
    {
      heading: 'Operating principles',
      paragraphs: [
        'Default to clarity. Every initiative has one owner, one measurable outcome, and an explicit '
        + 'decision date. Teams can move independently when interfaces and expectations are clear.',
      ],
    },
  ],
}

export const GOOGLE_SHEETS_SAMPLE: WorkspaceSpreadsheetContent = {
  kind: 'spreadsheet',
  title: 'FY26 revenue model',
  columns: ['Month', 'Revenue', 'COGS', 'Gross profit', 'OpEx', 'EBITDA', 'Margin', 'Status'],
  rows: [
    ['Jan', '$428,000', '$94,160', '$333,840', '$248,000', '$85,840', '20.1%', 'Actual'],
    ['Feb', '$462,000', '$101,640', '$360,360', '$252,000', '$108,360', '23.5%', 'Actual'],
    ['Mar', '$508,000', '$111,760', '$396,240', '$265,000', '$131,240', '25.8%', 'Actual'],
    ['Apr', '$544,000', '$119,680', '$424,320', '$277,000', '$147,320', '27.1%', 'Forecast'],
    ['May', '$591,000', '$130,020', '$460,980', '$284,000', '$176,980', '29.9%', 'Forecast'],
    ['Jun', '$648,000', '$142,560', '$505,440', '$296,000', '$209,440', '32.3%', 'Forecast'],
    ['Q2', '$1,783,000', '$392,260', '$1,390,740', '$857,000', '$533,740', '29.9%', 'Plan'],
  ],
  sheetNames: ['Revenue model', 'Assumptions', 'Customers', 'Scenario plan'],
}

export const GOOGLE_SLIDES_SAMPLE: WorkspacePresentationContent = {
  kind: 'presentation',
  title: 'Q3 business review',
  slides: [
    {
      id: 'cover',
      eyebrow: 'BOARD UPDATE · JULY 2026',
      title: 'Building the operating system for growing businesses',
      body: 'Q3 business review',
      layout: 'title',
      accent: '#7dd3fc',
    },
    {
      id: 'momentum',
      eyebrow: 'EXECUTIVE SUMMARY',
      title: 'Momentum in the core',
      body: 'Customers are consolidating fragmented workflows into one trusted workspace.',
      layout: 'metrics',
      accent: '#86efac',
    },
    {
      id: 'revenue',
      eyebrow: 'GROWTH',
      title: 'Revenue compounds as teams expand',
      body: 'Net retention and multi-workflow adoption continue to strengthen.',
      layout: 'chart',
      accent: '#fbbf24',
    },
    {
      id: 'priorities',
      eyebrow: 'Q3 PRIORITIES',
      title: 'Three bets, one operating cadence',
      body: 'Focus the roadmap on connected data, repeatable workflows, and trusted automation.',
      layout: 'priorities',
      accent: '#c4b5fd',
    },
    {
      id: 'next',
      eyebrow: 'NEXT 90 DAYS',
      title: 'From design partners to repeatable scale',
      body: 'A sequenced plan with clear owners and measurable decision gates.',
      layout: 'timeline',
      accent: '#fda4af',
    },
  ],
}

const PRODUCT_CONFIG = {
  docs: {
    label: 'Docs',
    color: '#4285f4',
    menus: ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Extensions', 'Help'],
    defaultContent: GOOGLE_DOCS_SAMPLE,
  },
  sheets: {
    label: 'Sheets',
    color: '#0f9d58',
    menus: ['File', 'Edit', 'View', 'Insert', 'Format', 'Data', 'Tools', 'Extensions', 'Help'],
    defaultContent: GOOGLE_SHEETS_SAMPLE,
  },
  slides: {
    label: 'Slides',
    color: '#f9ab00',
    menus: ['File', 'Edit', 'View', 'Insert', 'Slide', 'Arrange', 'Tools', 'Extensions', 'Help'],
    defaultContent: GOOGLE_SLIDES_SAMPLE,
  },
} satisfies Record<GoogleWorkspaceProduct, {
  label: string
  color: string
  menus: string[]
  defaultContent: GoogleWorkspaceContent
}>

export function workspaceColumnName(index: number): string {
  let value = index + 1
  let label = ''
  while (value > 0) {
    value -= 1
    label = String.fromCharCode(65 + (value % 26)) + label
    value = Math.floor(value / 26)
  }
  return label
}

export function workspaceCellName(row: number, column: number): string {
  return `${workspaceColumnName(column)}${row + 1}`
}

export function GoogleWorkspaceEditor({
  product,
  content,
  initialGeminiOpen = false,
  initialCommentsOpen = false,
  initialCell = 'B4',
  initialSlide = 0,
}: GoogleWorkspaceEditorProps) {
  const config = PRODUCT_CONFIG[product]
  const resolvedContent = content?.kind === expectedKind(product)
    ? content
    : config.defaultContent
  const [title, setTitle] = useState(resolvedContent.title)
  const [geminiOpen, setGeminiOpen] = useState(initialGeminiOpen)
  const [commentsOpen, setCommentsOpen] = useState(initialCommentsOpen)
  const [starred, setStarred] = useState(false)
  const [selectedCell, setSelectedCell] = useState(initialCell)
  const [selectedSlide, setSelectedSlide] = useState(initialSlide)

  useEffect(() => setTitle(resolvedContent.title), [resolvedContent.title])
  useEffect(() => setGeminiOpen(initialGeminiOpen), [initialGeminiOpen])
  useEffect(() => setCommentsOpen(initialCommentsOpen), [initialCommentsOpen])
  useEffect(() => setSelectedCell(initialCell), [initialCell])
  useEffect(() => setSelectedSlide(initialSlide), [initialSlide])

  return (
    <div
      className={`google-workspace-editor workspace-${product}`}
      style={{ '--workspace-accent': config.color } as CSSProperties}
    >
      <header className="workspace-header">
        <div className="workspace-product-mark">
          <WorkspaceProductIcon product={product} />
        </div>
        <div className="workspace-file-area">
          <div className="workspace-title-row">
            <input
              value={title}
              onChange={event => setTitle(event.target.value)}
              aria-label={`${config.label} file name`}
            />
            <button
              type="button"
              className={`workspace-plain-button workspace-star ${starred ? 'is-active' : ''}`}
              aria-label={starred ? 'Remove star' : 'Add star'}
              onClick={() => setStarred(value => !value)}
            >
              <WorkspaceIcon name={starred ? 'starFilled' : 'star'} />
            </button>
            <button type="button" className="workspace-plain-button" aria-label="Move file">
              <WorkspaceIcon name="folder" />
            </button>
            <span className="workspace-save-status"><WorkspaceIcon name="cloudDone" /> Saved to Drive</span>
          </div>
          <nav className="workspace-menu" aria-label={`${config.label} menus`}>
            {config.menus.map(menu => <button type="button" key={menu}>{menu}</button>)}
          </nav>
        </div>
        <div className="workspace-collaboration">
          <button type="button" className="workspace-history-button">
            <WorkspaceIcon name="history" /><span>Last edit 2 min ago</span>
          </button>
          <button
            type="button"
            className={`workspace-round-button ${commentsOpen ? 'is-active' : ''}`}
            aria-label="Comments"
            onClick={() => setCommentsOpen(open => !open)}
          >
            <WorkspaceIcon name="comment" />
          </button>
          <button type="button" className="workspace-round-button" aria-label="Join a call">
            <WorkspaceIcon name="video" />
          </button>
          <button
            type="button"
            className={`workspace-gemini-button ${geminiOpen ? 'is-active' : ''}`}
            aria-label="Ask Gemini"
            onClick={() => setGeminiOpen(open => !open)}
          >
            <WorkspaceIcon name="sparkles" />
          </button>
          {product === 'slides' && (
            <button type="button" className="workspace-present-button">
              <WorkspaceIcon name="play" /><span>Slideshow</span><WorkspaceIcon name="chevronDown" />
            </button>
          )}
          <button type="button" className="workspace-share-button">
            <WorkspaceIcon name="lock" /><span>Share</span>
          </button>
          <div className="workspace-collaborator-stack" aria-label="Active collaborators">
            <span className="is-maya">MR</span>
            <span className="is-lina">LT</span>
          </div>
          <button
            type="button"
            className="workspace-user-avatar"
            aria-label={`Account: ${CLONE_DEMO_IDENTITY.user}`}
          >
            {CLONE_DEMO_IDENTITY.user.charAt(0)}
          </button>
        </div>
      </header>

      <EditorToolbar product={product} />

      {product === 'sheets' && resolvedContent.kind === 'spreadsheet' && (
        <FormulaBar selectedCell={selectedCell} content={resolvedContent} />
      )}

      <div className="workspace-body">
        <div className="workspace-editor-region">
          {product === 'docs' && resolvedContent.kind === 'document' && (
            <DocsCanvas content={resolvedContent} commentsOpen={commentsOpen} />
          )}
          {product === 'sheets' && resolvedContent.kind === 'spreadsheet' && (
            <SheetsCanvas
              content={resolvedContent}
              selectedCell={selectedCell}
              onCellSelect={setSelectedCell}
            />
          )}
          {product === 'slides' && resolvedContent.kind === 'presentation' && (
            <SlidesCanvas
              content={resolvedContent}
              selectedSlide={selectedSlide}
              onSlideSelect={setSelectedSlide}
            />
          )}
        </div>

        {commentsOpen && (
          <CommentsPanel product={product} onClose={() => setCommentsOpen(false)} />
        )}
        {geminiOpen && (
          <GeminiPanel product={product} onClose={() => setGeminiOpen(false)} />
        )}
        <WorkspaceAppRail />
      </div>
    </div>
  )
}

function expectedKind(product: GoogleWorkspaceProduct): GoogleWorkspaceContent['kind'] {
  if (product === 'docs') return 'document'
  if (product === 'sheets') return 'spreadsheet'
  return 'presentation'
}

function EditorToolbar({ product }: { product: GoogleWorkspaceProduct }) {
  return (
    <div className="workspace-toolbar" role="toolbar" aria-label={`${PRODUCT_CONFIG[product].label} formatting`}>
      <ToolbarButton icon="undo" label="Undo" />
      <ToolbarButton icon="redo" label="Redo" />
      <ToolbarButton icon="print" label="Print" />
      <ToolbarButton icon="paint" label="Paint format" />
      <span className="workspace-toolbar-divider" />
      <ToolbarSelect label="100%" />
      <span className="workspace-toolbar-divider" />
      {product === 'docs' && <ToolbarSelect label="Normal text" wide />}
      {product === 'slides' && <ToolbarSelect label="Layout" />}
      {product === 'sheets' && (
        <>
          <ToolbarButton text="$" label="Format as currency" />
          <ToolbarButton text="%" label="Format as percent" />
          <ToolbarButton text=".0←" label="Decrease decimal places" />
          <ToolbarButton text=".00→" label="Increase decimal places" />
          <span className="workspace-toolbar-divider" />
        </>
      )}
      <ToolbarSelect label="Arial" wide />
      <ToolbarButton text="−" label="Decrease font size" />
      <span className="workspace-font-size">11</span>
      <ToolbarButton text="+" label="Increase font size" />
      <span className="workspace-toolbar-divider" />
      <ToolbarButton text="B" label="Bold" strong />
      <ToolbarButton text="I" label="Italic" italic />
      <ToolbarButton text="U" label="Underline" underline />
      <ToolbarButton icon="textColor" label="Text color" />
      {product === 'sheets' && <ToolbarButton icon="fill" label="Fill color" />}
      <span className="workspace-toolbar-divider" />
      <ToolbarButton icon="link" label="Insert link" />
      <ToolbarButton icon="commentAdd" label="Add comment" />
      {product !== 'sheets' && <ToolbarButton icon="image" label="Insert image" />}
      {product === 'sheets' && <ToolbarButton icon="chart" label="Insert chart" />}
      <span className="workspace-toolbar-divider" />
      <ToolbarButton icon="align" label="Align" />
      <ToolbarButton icon="list" label="List" />
      <span className="workspace-toolbar-spacer" />
      <button type="button" className="workspace-edit-mode"><WorkspaceIcon name="edit" /><span>Editing</span><WorkspaceIcon name="chevronDown" /></button>
    </div>
  )
}

function ToolbarButton({
  icon,
  text,
  label,
  strong,
  italic,
  underline,
}: {
  icon?: WorkspaceIconName
  text?: string
  label: string
  strong?: boolean
  italic?: boolean
  underline?: boolean
}) {
  return (
    <button
      type="button"
      className={`workspace-tool ${strong ? 'is-strong' : ''} ${italic ? 'is-italic' : ''} ${underline ? 'is-underline' : ''}`}
      aria-label={label}
      title={label}
    >
      {icon ? <WorkspaceIcon name={icon} /> : text}
    </button>
  )
}

function ToolbarSelect({ label, wide = false }: { label: string; wide?: boolean }) {
  return (
    <button type="button" className={`workspace-tool-select ${wide ? 'is-wide' : ''}`}>
      <span>{label}</span><WorkspaceIcon name="chevronDown" />
    </button>
  )
}

function FormulaBar({
  selectedCell,
  content,
}: {
  selectedCell: string
  content: WorkspaceSpreadsheetContent
}) {
  const value = useMemo(() => {
    const match = selectedCell.match(/^([A-Z]+)(\d+)$/)
    if (!match) return ''
    const column = match[1].split('').reduce((sum, letter) => sum * 26 + letter.charCodeAt(0) - 64, 0) - 1
    const row = Number(match[2]) - 1
    if (row === 0) return content.columns[column] ?? ''
    return String(content.rows[row - 1]?.[column] ?? '')
  }, [content, selectedCell])

  return (
    <div className="workspace-formula-bar">
      <span className="workspace-name-box">{selectedCell}</span>
      <button type="button" aria-label="Named ranges"><WorkspaceIcon name="chevronDown" /></button>
      <span className="workspace-formula-icon">fx</span>
      <input value={value} readOnly aria-label="Formula bar" />
    </div>
  )
}

function DocsCanvas({
  content,
  commentsOpen,
}: {
  content: WorkspaceDocumentContent
  commentsOpen: boolean
}) {
  return (
    <div className="workspace-docs-canvas">
      <aside className="workspace-doc-outline">
        <div><WorkspaceIcon name="outline" /><strong>Document outline</strong></div>
        <button type="button" className="is-active">{content.heading}</button>
        {content.sections.map(section => <button type="button" key={section.heading}>{section.heading}</button>)}
      </aside>
      <div className="workspace-doc-stage">
        <div className="workspace-doc-page">
          <div className="workspace-ruler" aria-hidden="true">
            <span className="workspace-ruler-margin is-start" />
            <span className="workspace-ruler-origin">0</span>
            <div className="workspace-ruler-scale">
              {Array.from({ length: 6 }, (_, index) => (
                <span className="workspace-ruler-unit" key={index}>{index + 1}</span>
              ))}
            </div>
            <span className="workspace-ruler-margin is-end" />
            <i className="workspace-ruler-indent is-first-line" />
            <i className="workspace-ruler-indent is-left" />
            <i className="workspace-ruler-indent is-right" />
          </div>
          <article className="workspace-paper" aria-label={content.title}>
            {content.eyebrow && <div className="workspace-doc-eyebrow">{content.eyebrow}</div>}
            <h1>{content.heading}</h1>
            {content.subtitle && <p className="workspace-doc-subtitle">{content.subtitle}</p>}
            <div className="workspace-doc-meta">
              <span><WorkspaceIcon name="person" /> {CLONE_DEMO_IDENTITY.user}</span>
              <span><WorkspaceIcon name="calendar" /> July 17, 2026</span>
              <span><WorkspaceIcon name="status" /> On track</span>
            </div>
            {content.sections.map((section, index) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && (
                  <ul>{section.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
                )}
                {index === 0 && (
                  <div className="workspace-doc-callout">
                    <span><WorkspaceIcon name="sparkles" /></span>
                    <div><strong>Q3 focus</strong><p>Make connected workflows the fastest path from raw data to a confident business decision.</p></div>
                  </div>
                )}
              </section>
            ))}
            <div className="workspace-doc-caret"><span>Maya</span></div>
            {commentsOpen && <span className="workspace-comment-anchor"><WorkspaceIcon name="comment" /></span>}
          </article>
        </div>
      </div>
    </div>
  )
}

function SheetsCanvas({
  content,
  selectedCell,
  onCellSelect,
}: {
  content: WorkspaceSpreadsheetContent
  selectedCell: string
  onCellSelect: (cell: string) => void
}) {
  const allRows = [content.columns, ...content.rows]
  const [activeSheet, setActiveSheet] = useState(content.sheetNames[0])

  useEffect(() => setActiveSheet(content.sheetNames[0]), [content.sheetNames])

  return (
    <div className="workspace-sheets-canvas">
      <div
        className="workspace-sheet-grid"
        style={{ '--sheet-columns': content.columns.length } as CSSProperties}
      >
        <span className="workspace-sheet-corner" />
        {content.columns.map((_, column) => (
          <button type="button" className="workspace-column-header" key={column}>
            {workspaceColumnName(column)}
          </button>
        ))}
        {allRows.map((row, rowIndex) => (
          <SheetRow
            key={rowIndex}
            row={row}
            rowIndex={rowIndex}
            columnCount={content.columns.length}
            selectedCell={selectedCell}
            onCellSelect={onCellSelect}
          />
        ))}
        {Array.from({ length: 10 }, (_, index) => (
          <SheetRow
            key={`empty-${index}`}
            row={[]}
            rowIndex={allRows.length + index}
            columnCount={content.columns.length}
            selectedCell={selectedCell}
            onCellSelect={onCellSelect}
          />
        ))}
      </div>
      <div className="workspace-sheet-tabs">
        <button type="button" aria-label="Add sheet"><WorkspaceIcon name="plus" /></button>
        <button type="button" aria-label="All sheets"><WorkspaceIcon name="menu" /></button>
        {content.sheetNames.map(name => (
          <button
            type="button"
            className={activeSheet === name ? 'is-active' : ''}
            key={name}
            onClick={() => setActiveSheet(name)}
          >
            {name}{activeSheet === name && <WorkspaceIcon name="chevronDown" />}
          </button>
        ))}
        <span />
        <small>All changes saved in Drive</small>
      </div>
    </div>
  )
}

function SheetRow({
  row,
  rowIndex,
  columnCount,
  selectedCell,
  onCellSelect,
}: {
  row: Array<string | number>
  rowIndex: number
  columnCount: number
  selectedCell: string
  onCellSelect: (cell: string) => void
}) {
  return (
    <>
      <button type="button" className="workspace-row-header">{rowIndex + 1}</button>
      {Array.from({ length: columnCount }, (_, columnIndex) => {
        const cell = workspaceCellName(rowIndex, columnIndex)
        const value = row[columnIndex] ?? ''
        const isStatus = columnIndex === columnCount - 1 && rowIndex > 0 && value
        return (
          <button
            aria-label={`${cell}: ${value || 'empty'}`}
            type="button"
            className={`workspace-cell ${rowIndex === 0 ? 'is-table-header' : ''} ${selectedCell === cell ? 'is-selected' : ''} ${isStatus ? `is-status status-${String(value).toLowerCase()}` : ''}`}
            key={cell}
            onClick={() => onCellSelect(cell)}
          >
            <span>{value}</span>
            {selectedCell === cell && <i />}
          </button>
        )
      })}
    </>
  )
}

function SlidesCanvas({
  content,
  selectedSlide,
  onSlideSelect,
}: {
  content: WorkspacePresentationContent
  selectedSlide: number
  onSlideSelect: (index: number) => void
}) {
  const active = content.slides[selectedSlide] ?? content.slides[0]
  return (
    <div className="workspace-slides-canvas">
      <aside className="workspace-filmstrip">
        {content.slides.map((slide, index) => (
          <button
            type="button"
            className={index === selectedSlide ? 'is-active' : ''}
            key={slide.id}
            onClick={() => onSlideSelect(index)}
          >
            <span className="workspace-slide-number">{index + 1}</span>
            <span className="workspace-slide-thumbnail">
              <SlideContent slide={slide} compact />
            </span>
          </button>
        ))}
        <button type="button" className="workspace-add-slide"><WorkspaceIcon name="plus" /> Add slide</button>
      </aside>
      <div aria-label="Slide editing canvas" className="workspace-slide-stage" tabIndex={0}>
        <div className="workspace-slide-canvas">
          <SlideContent slide={active} />
          <span className="workspace-live-cursor"><i /> Maya</span>
        </div>
        <div className="workspace-speaker-notes">
          <span>Click to add speaker notes</span>
        </div>
      </div>
    </div>
  )
}

function SlideContent({ slide, compact = false }: { slide: WorkspaceSlideData; compact?: boolean }) {
  return (
    <div
      className={`workspace-slide-content layout-${slide.layout} ${compact ? 'is-compact' : ''}`}
      style={{ '--slide-accent': slide.accent ?? '#7dd3fc' } as CSSProperties}
    >
      <span className="workspace-slide-orb orb-one" />
      <span className="workspace-slide-orb orb-two" />
      <div className="workspace-slide-copy">
        {slide.eyebrow && <small>{slide.eyebrow}</small>}
        <h2>{slide.title}</h2>
        {slide.body && <p>{slide.body}</p>}
      </div>
      {slide.layout === 'metrics' && (
        <div className="workspace-slide-metrics">
          <div><strong>+38%</strong><span>ARR growth</span></div>
          <div><strong>126%</strong><span>Net retention</span></div>
          <div><strong>4.8×</strong><span>Workflow depth</span></div>
        </div>
      )}
      {slide.layout === 'chart' && (
        <div className="workspace-slide-chart">
          {[31, 38, 48, 57, 69, 84].map((height, index) => (
            <i key={height} style={{ height: `${height}%` }}><span>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}</span></i>
          ))}
          <strong>$648k</strong>
        </div>
      )}
      {slide.layout === 'priorities' && (
        <div className="workspace-slide-priorities">
          <div><span>01</span><strong>Connected data</strong></div>
          <div><span>02</span><strong>Repeatable workflows</strong></div>
          <div><span>03</span><strong>Trusted automation</strong></div>
        </div>
      )}
      {slide.layout === 'timeline' && (
        <div className="workspace-slide-timeline">
          <span><i /><strong>July</strong><small>Design partner beta</small></span>
          <span><i /><strong>August</strong><small>Workflow marketplace</small></span>
          <span><i /><strong>September</strong><small>General availability</small></span>
        </div>
      )}
      <span className="workspace-slide-page">
        {CLONE_DEMO_IDENTITY.company.toUpperCase()} · {slide.id.toUpperCase()}
      </span>
    </div>
  )
}

function CommentsPanel({
  product,
  onClose,
}: {
  product: GoogleWorkspaceProduct
  onClose: () => void
}) {
  return (
    <aside className="workspace-side-panel workspace-comments-panel">
      <header><h2>Comments</h2><button type="button" onClick={onClose}><WorkspaceIcon name="close" /></button></header>
      <button type="button" className="workspace-comment-create"><WorkspaceIcon name="commentAdd" /> Add comment</button>
      <article>
        <span className="workspace-panel-avatar is-maya">MR</span>
        <div>
          <strong>Maya Rivera <small>12 min ago</small></strong>
          <p>{product === 'sheets'
            ? 'Can we add the downside scenario before the review?'
            : product === 'slides'
              ? 'This is the right headline. I would lead with retention.'
              : 'Can we make the activation target explicit here?'
          }</p>
          <button type="button">Reply</button>
          <button type="button">Resolve</button>
        </div>
      </article>
    </aside>
  )
}

function GeminiPanel({
  product,
  onClose,
}: {
  product: GoogleWorkspaceProduct
  onClose: () => void
}) {
  const copy = {
    docs: {
      title: 'Create, refine, and summarize',
      summary: 'This plan focuses Q3 investment on connected workflows, activation, and operating clarity.',
      prompts: ['Draft an executive summary', 'Make this more concise', 'Identify open decisions'],
      placeholder: 'Ask Gemini about this document',
    },
    sheets: {
      title: 'Analyze and build faster',
      summary: 'Revenue grows 51% from January to June while EBITDA margin expands by 12.2 points.',
      prompts: ['Create a forecast formula', 'Build a revenue chart', 'Explain the margin change'],
      placeholder: 'Ask Gemini about this spreadsheet',
    },
    slides: {
      title: 'Design and present with confidence',
      summary: 'This deck tells a clear story from momentum through Q3 priorities and execution.',
      prompts: ['Generate a new slide', 'Improve this headline', 'Create speaker notes'],
      placeholder: 'Ask Gemini about this presentation',
    },
  }[product]

  return (
    <aside className="workspace-side-panel workspace-gemini-panel">
      <header>
        <span><WorkspaceIcon name="sparkles" /></span>
        <h2>Gemini</h2>
        <button type="button" aria-label="More Gemini options"><WorkspaceIcon name="more" /></button>
        <button type="button" aria-label="Close Gemini" onClick={onClose}><WorkspaceIcon name="close" /></button>
      </header>
      <div className="workspace-gemini-intro">
        <span className="workspace-gemini-orb"><WorkspaceIcon name="sparkles" /></span>
        <h3>{copy.title}</h3>
        <p>{copy.summary}</p>
      </div>
      <div className="workspace-gemini-prompts">
        {copy.prompts.map(prompt => <button type="button" key={prompt}>{prompt}<WorkspaceIcon name="arrowUpRight" /></button>)}
      </div>
      <div className="workspace-gemini-input">
        <textarea aria-label={copy.placeholder} placeholder={copy.placeholder} />
        <div><button type="button"><WorkspaceIcon name="add" /></button><span /><button type="button"><WorkspaceIcon name="send" /></button></div>
      </div>
      <small className="workspace-gemini-disclaimer">Gemini can make mistakes, so double-check it.</small>
    </aside>
  )
}

function WorkspaceAppRail() {
  return (
    <aside className="workspace-app-rail" aria-label="Google Workspace side panel">
      <button type="button" className="is-calendar" aria-label="Calendar"><span>31</span></button>
      <button type="button" className="is-keep" aria-label="Keep"><WorkspaceIcon name="bulb" /></button>
      <button type="button" className="is-tasks" aria-label="Tasks"><WorkspaceIcon name="checkCircle" /></button>
      <button type="button" className="is-contacts" aria-label="Contacts"><WorkspaceIcon name="person" /></button>
      <i />
      <button type="button" aria-label="Get add-ons"><WorkspaceIcon name="plus" /></button>
    </aside>
  )
}

function WorkspaceProductIcon({ product }: { product: GoogleWorkspaceProduct }) {
  const color = PRODUCT_CONFIG[product].color
  return (
    <svg className={`workspace-product-icon is-${product}`} viewBox="0 0 36 42" aria-hidden="true">
      <path fill={color} d="M5 1h19l8 8v30a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2Z" />
      <path fill="rgba(255,255,255,.35)" d="M24 1v8h8Z" />
      {product === 'docs' && <path fill="#fff" d="M9 15h17v2H9zm0 5h17v2H9zm0 5h17v2H9zm0 5h12v2H9z" />}
      {product === 'sheets' && <path fill="#fff" d="M9 14h18v19H9V14Zm2 2v3h5v-3h-5Zm7 0v3h7v-3h-7Zm-7 5v4h5v-4h-5Zm7 0v4h7v-4h-7Zm-7 6v4h5v-4h-5Zm7 0v4h7v-4h-7Z" />}
      {product === 'slides' && <path fill="#fff" d="M8 14h20v17H8V14Zm3 3v11h14V17H11Z" />}
    </svg>
  )
}

type WorkspaceIconName =
  | 'add'
  | 'align'
  | 'arrowUpRight'
  | 'bulb'
  | 'calendar'
  | 'chart'
  | 'checkCircle'
  | 'chevronDown'
  | 'close'
  | 'cloudDone'
  | 'comment'
  | 'commentAdd'
  | 'edit'
  | 'fill'
  | 'folder'
  | 'history'
  | 'image'
  | 'link'
  | 'list'
  | 'lock'
  | 'menu'
  | 'more'
  | 'outline'
  | 'paint'
  | 'person'
  | 'play'
  | 'plus'
  | 'print'
  | 'redo'
  | 'send'
  | 'sparkles'
  | 'star'
  | 'starFilled'
  | 'status'
  | 'textColor'
  | 'undo'
  | 'video'

function WorkspaceIcon({ name }: { name: WorkspaceIconName }) {
  const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  const icons: Record<WorkspaceIconName, ReactNode> = {
    add: <path d="M12 5v14M5 12h14" {...line} />,
    align: <path d="M5 6h14M5 10h9M5 14h14M5 18h9" {...line} />,
    arrowUpRight: <path d="M7 17 17 7M9 7h8v8" {...line} />,
    bulb: <><path d="M8 15a6 6 0 1 1 8 0c-1 .8-1.5 1.6-1.5 3h-5c0-1.4-.5-2.2-1.5-3Z" {...line} /><path d="M10 21h4" {...line} /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" {...line} /><path d="M8 3v4M16 3v4M4 10h16" {...line} /></>,
    chart: <><path d="M5 19V9M10 19V5M15 19v-7M20 19V8" {...line} /><path d="M3 19h19" {...line} /></>,
    checkCircle: <><circle cx="12" cy="12" r="9" {...line} /><path d="m8 12 3 3 5-6" {...line} /></>,
    chevronDown: <path d="m7 9 5 5 5-5" {...line} />,
    close: <path d="M6 6l12 12M18 6 6 18" {...line} />,
    cloudDone: <><path d="M6 18h12a4 4 0 0 0 .7-7.9A7 7 0 0 0 5.3 9 4.5 4.5 0 0 0 6 18Z" {...line} /><path d="m9 13 2 2 4-4" {...line} /></>,
    comment: <path d="M4 5h16v12H9l-5 4V5Z" {...line} />,
    commentAdd: <><path d="M4 5h16v12H9l-5 4V5Z" {...line} /><path d="M9 11h6M12 8v6" {...line} /></>,
    edit: <><path d="m5 19 4-1 10-10-3-3L6 15l-1 4Z" {...line} /></>,
    fill: <><path d="m6 5 9 9-5 5-6-6 7-7" {...line} /><path d="M15 18h6" {...line} /></>,
    folder: <path d="M3 6h7l2 2h9v11H3V6Z" {...line} />,
    history: <><path d="M4 12a8 8 0 1 0 2-5.3L3 10" {...line} /><path d="M3 5v5h5M12 8v5l3 2" {...line} /></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2" {...line} /><circle cx="9" cy="9" r="2" {...line} /><path d="m4 17 5-5 4 4 2-2 5 4" {...line} /></>,
    link: <><path d="M9 15 7 17a3 3 0 0 1-4-4l3-3a3 3 0 0 1 4 0M15 9l2-2a3 3 0 0 1 4 4l-3 3a3 3 0 0 1-4 0M8 12h8" {...line} /></>,
    list: <><path d="M9 7h11M9 12h11M9 17h11" {...line} /><circle cx="5" cy="7" r="1" fill="currentColor" /><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="5" cy="17" r="1" fill="currentColor" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2" {...line} /><path d="M8 10V7a4 4 0 0 1 8 0v3" {...line} /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" {...line} />,
    more: <><circle cx="5" cy="12" r="1.5" fill="currentColor" /><circle cx="12" cy="12" r="1.5" fill="currentColor" /><circle cx="19" cy="12" r="1.5" fill="currentColor" /></>,
    outline: <path d="M5 6h14M5 11h9M5 16h12M5 21h7" {...line} />,
    paint: <><path d="M5 4h11v7H5V4ZM16 7h3v5l-7 3v5" {...line} /></>,
    person: <><circle cx="12" cy="8" r="4" {...line} /><path d="M5 21a7 7 0 0 1 14 0" {...line} /></>,
    play: <path d="m8 5 11 7-11 7V5Z" fill="currentColor" />,
    plus: <path d="M12 4v16M4 12h16" {...line} />,
    print: <><path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7z" {...line} /></>,
    redo: <path d="M9 7h5a6 6 0 0 1 6 6v1M16 4l4 3-4 3" {...line} />,
    send: <path d="m4 4 17 8-17 8 3-8-3-8Zm3 8h14" {...line} />,
    sparkles: <><path d="m12 2 1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2Z" {...line} /><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" {...line} /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" {...line} />,
    starFilled: <path fill="currentColor" d="m12 2.5 3 6 6.6 1-4.8 4.6 1.1 6.6-5.9-3.1-5.9 3.1 1.1-6.6-4.8-4.6 6.6-1 3-6Z" />,
    status: <><circle cx="12" cy="12" r="9" {...line} /><path d="m8 12 3 3 5-6" {...line} /></>,
    textColor: <><path d="m6 19 6-15 6 15M8 14h8" {...line} /><path d="M5 22h14" stroke="currentColor" strokeWidth="2" /></>,
    undo: <path d="M15 7h-5a6 6 0 0 0-6 6v1M8 4 4 7l4 3" {...line} />,
    video: <><rect x="3" y="6" width="14" height="12" rx="2" {...line} /><path d="m17 10 4-2v8l-4-2" {...line} /></>,
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true">{icons[name]}</svg>
}
