import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { Combobox } from '../components/FormControls'
import { DesignSystemProvider } from '../foundations/DesignSystemProvider'
import {
  formatBytes,
  formatDateTime,
  formatDuration,
  formatNumber,
  formatRelativeTime,
} from '../foundations/intl'
import {
  EN_MESSAGES,
  ZH_CN_MESSAGES,
  builtInMessages,
  formatMessage,
} from '../foundations/messages'
import { ErrorState, LoadingState } from '../workbench/States'

describe('message catalog', () => {
  it('selects the built-in catalog by language', () => {
    for (const locale of ['zh-CN', 'zh-Hans', 'zh', 'ZH_cn']) {
      expect(builtInMessages(locale)).toBe(ZH_CN_MESSAGES)
    }
    for (const locale of ['en', 'en-GB', 'fr-FR', '']) {
      expect(builtInMessages(locale)).toBe(EN_MESSAGES)
    }
  })

  it('translates every English key and keeps every placeholder', () => {
    const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort()
    expect(Object.keys(ZH_CN_MESSAGES).sort()).toEqual(Object.keys(EN_MESSAGES).sort())
    for (const [key, english] of Object.entries(EN_MESSAGES)) {
      const chinese = ZH_CN_MESSAGES[key as keyof typeof EN_MESSAGES]
      expect(chinese.trim(), key).not.toBe('')
      expect(placeholders(chinese), key).toEqual(placeholders(english))
    }
  })

  it('fills known placeholders and leaves unknown ones as written', () => {
    expect(formatMessage('Expand {label}', { label: 'Sales' })).toBe('Expand Sales')
    expect(formatMessage('{count} of {total}', { count: 3 })).toBe('3 of {total}')
    expect(formatMessage('No placeholders')).toBe('No placeholders')
  })
})

describe('locale on the design-system scope', () => {
  it('renders the built-in Chinese strings and marks the subtree language', () => {
    const html = renderToStaticMarkup(
      <DesignSystemProvider locale="zh-CN">
        <LoadingState />
        <ErrorState message="HTTP 503" onRetry={() => {}} />
      </DesignSystemProvider>,
    )
    expect(html).toContain('lang="zh-CN"')
    expect(html).toContain('正在加载')
    expect(html).toContain('无法加载')
    expect(html).toContain('重试')
  })

  it('layers host overrides over the catalog and inherits them in nested scopes', () => {
    const html = renderToStaticMarkup(
      <DesignSystemProvider messages={{ 'state.loading': 'Fetching records' }}>
        <DesignSystemProvider theme="light">
          <LoadingState />
          <Combobox aria-label="Owner" value="" onValueChange={() => {}} options={[]} />
        </DesignSystemProvider>
      </DesignSystemProvider>,
    )
    expect(html).toContain('Fetching records')
    expect(html).toContain('placeholder="Select…"')
  })

  it('keeps English defaults and omits lang outside an explicit locale', () => {
    const html = renderToStaticMarkup(<LoadingState />)
    expect(html).toContain('Loading')
    expect(renderToStaticMarkup(<DesignSystemProvider>x</DesignSystemProvider>)).not.toContain('lang=')
  })
})

describe('Intl formatters', () => {
  const instant = Date.UTC(2026, 9, 18, 15, 4)

  it('formats numbers and SI byte sizes per locale', () => {
    expect(formatNumber(1234567.8)).toBe('1,234,567.8')
    expect(formatNumber(1234567.8, { locale: 'de-DE' })).toBe('1.234.567,8')
    expect(formatBytes(0)).toBe('0 bytes')
    expect(formatBytes(532)).toBe('532 bytes')
    expect(formatBytes(2_300_000)).toBe('2.3 MB')
    expect(formatBytes(1_000_000_000_000_000_000)).toBe('1,000 PB')
    expect(formatBytes(-1)).toBe('-1')
  })

  it('formats absolute dates in the given time zone and keeps unparseable input', () => {
    expect(formatDateTime(instant, { timeZone: 'UTC' })).toBe('Oct 18, 2026, 3:04 PM')
    expect(formatDateTime(new Date(instant), { timeZone: 'UTC', timeStyle: 'none' })).toBe('Oct 18, 2026')
    expect(formatDateTime('2026-10-18T15:04:00Z', { locale: 'zh-CN', timeZone: 'Asia/Shanghai' }))
      .toBe('2026年10月18日 23:04')
    expect(formatDateTime('not a date')).toBe('not a date')
  })

  it('formats relative time against an explicit clock', () => {
    expect(formatRelativeTime(instant - 5 * 60_000, { now: instant })).toBe('5 minutes ago')
    expect(formatRelativeTime(instant + 3 * 86_400_000, { now: instant })).toBe('in 3 days')
    expect(formatRelativeTime(instant - 86_400_000, { now: instant })).toBe('yesterday')
    expect(formatRelativeTime(instant - 5 * 60_000, { locale: 'zh-CN', now: instant })).toBe('5分钟前')
  })

  it('rounds waits up to their largest whole unit', () => {
    expect(formatDuration(30_000)).toBe('30 seconds')
    expect(formatDuration(1)).toBe('1 second')
    expect(formatDuration(90_000)).toBe('2 minutes')
    expect(formatDuration(2 * 3_600_000)).toBe('2 hours')
    expect(formatDuration(30_000, { locale: 'zh-CN' })).toBe('30秒钟')
  })
})
