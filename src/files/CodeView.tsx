import { forwardRef, useMemo, type CSSProperties, type HTMLAttributes } from 'react'
import { CopyButton } from '../components/Display'
import { cx, useControllableState } from '../components/utils'
import { useLocale, useMessage } from '../foundations/DesignSystemProvider'
import { formatNumber } from '../foundations/intl'
import { codeLanguage, tokenizeLine } from './codeTokens'

/** Props for a read-only source view. */
export interface CodeViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The source text. */
  code: string
  /** Accessible name of the code region, such as the file path. */
  label: string
  /**
   * Language name shown in the toolbar. JSON, YAML and SQL (and their usual
   * aliases and extensions) are also highlighted.
   */
  language?: string
  /** Lines rendered at most; the rest is summarised (5,000 when unset). */
  maxLines?: number
  /** Number of the first line (for excerpts). */
  startLine?: number
  /** Lines to highlight, by number. */
  highlightLines?: readonly number[]
  /** Controlled wrapping. */
  wrap?: boolean
  /** Initial wrapping when uncontrolled. */
  defaultWrap?: boolean
  onWrapChange?: (wrap: boolean) => void
  /** The source itself was cut before it got here (a bounded read). */
  truncatedNotice?: string
  /** Shows the copy action. */
  copyable?: boolean
  /** Height of the scrolling area (CSS or pixels). */
  height?: number | string
}

/**
 * Read-only source with line numbers (CSS counters, so selecting and copying
 * text never picks them up), a wrap toggle with a hanging indent, a copy
 * action for the whole source, a bounded line count, and token colours for
 * JSON, YAML and SQL (line by line, long lines plain). Text renders as React
 * text nodes; nothing is interpreted.
 */
export const CodeView = forwardRef<HTMLDivElement, CodeViewProps>(function CodeView(
  {
    code,
    label,
    language,
    maxLines = 5_000,
    startLine = 1,
    highlightLines,
    wrap,
    defaultWrap = false,
    onWrapChange,
    truncatedNotice,
    copyable = true,
    height,
    className,
    style,
    ...rest
  },
  ref,
) {
  const t = useMessage()
  const { locale } = useLocale()
  const [wrapped, setWrapped] = useControllableState({ value: wrap, defaultValue: defaultWrap, onChange: onWrapChange })
  const lines = useMemo(() => {
    const all = code.replace(/\r\n?/g, '\n').split('\n')
    if (all.length > 1 && all[all.length - 1] === '') all.pop()
    return all
  }, [code])
  const shown = useMemo(() => (lines.length > maxLines ? lines.slice(0, maxLines) : lines), [lines, maxLines])
  const highlighted = useMemo(() => new Set(highlightLines), [highlightLines])
  const syntax = codeLanguage(language)
  const tokens = useMemo(() => (syntax ? shown.map(line => tokenizeLine(line, syntax)) : null), [shown, syntax])
  return (
    <div {...rest} ref={ref} className={cx('mtc-code-view', className)} style={style}>
      <div className="mtc-code-view-toolbar">
        {language && <span className="mtc-code-view-language">{language}</span>}
        <span className="mtc-code-view-count">{t('code.lines', { count: formatNumber(lines.length, { locale }) })}</span>
        <label className="mtc-code-view-wrap">
          <input type="checkbox" checked={wrapped} onChange={event => setWrapped(event.target.checked)} />
          {t('code.wrap')}
        </label>
        {copyable && <CopyButton value={code} label={t('code.copy')} />}
      </div>
      {(truncatedNotice || shown.length < lines.length) && (
        <p className="mtc-code-view-notice" role="note">
          {truncatedNotice ?? t('code.truncated', {
            shown: formatNumber(shown.length, { locale }),
            total: formatNumber(lines.length, { locale }),
          })}
        </p>
      )}
      <pre
        className="mtc-code-view-body"
        data-wrap={wrapped || undefined}
        tabIndex={0}
        aria-label={label}
        style={{
          '--mtc-code-start': startLine - 1,
          '--mtc-code-gutter': `${String(startLine + shown.length - 1).length + 1}ch`,
          maxHeight: height,
        } as CSSProperties}
      >
        <code>
          {shown.map((line, index) => (
            <span
              key={index}
              className="mtc-code-line"
              data-highlight={highlighted.has(startLine + index) || undefined}
            >
              {tokens
                ? tokens[index]!.map((token, position) => (token.kind === 'plain'
                  ? token.text
                  : <span key={position} className="mtc-code-token" data-token={token.kind}>{token.text}</span>))
                : line}
            </span>
          ))}
        </code>
      </pre>
    </div>
  )
})
