import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { Combobox } from '../components/FormControls'
import { DesignSystemProvider } from '../foundations/DesignSystemProvider'
import {
  formatBytes,
  formatDateTime,
  formatDuration,
  formatNumber,
  formatRelativeTime,
  type DateTimeOptions,
} from '../foundations/intl'
import {
  EN_MESSAGES,
  builtInMessages,
  formatMessage,
} from '../foundations/messages'
import { ZH_CN_MESSAGES } from '../foundations/messages-zh'
import { ErrorState, LoadingState } from '../workbench/States'

describe('message catalog', () => {
  it('builds in English only; other languages are passed as messages', () => {
    for (const locale of ['zh-CN', 'zh-Hans', 'zh', 'en', 'en-GB', 'fr-FR', '']) {
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
  it('renders a passed Chinese catalog and marks the subtree language', () => {
    const html = renderToStaticMarkup(
      <DesignSystemProvider locale="zh-CN" messages={ZH_CN_MESSAGES}>
        <LoadingState />
        <ErrorState message="HTTP 503" onRetry={() => {}} />
      </DesignSystemProvider>,
    )
    expect(html).toContain('lang="zh-CN"')
    expect(html).toContain('正在加载')
    expect(html).toContain('无法加载')
    expect(html).toContain('重试')
  })

  it('keeps English chrome for a Chinese locale unless a catalog is passed', () => {
    const html = renderToStaticMarkup(
      <DesignSystemProvider locale="zh-CN"><LoadingState /></DesignSystemProvider>,
    )
    expect(html).toContain('lang="zh-CN"')
    expect(html).toContain('Loading')
    expect(html).not.toContain('正在加载')
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

  it('keeps the host language in a nested scope that sets its own locale', () => {
    const html = renderToStaticMarkup(
      <DesignSystemProvider locale="zh-CN" messages={ZH_CN_MESSAGES}>
        <DesignSystemProvider locale="zh-CN" theme="light"><LoadingState /></DesignSystemProvider>
      </DesignSystemProvider>,
    )
    expect(html).toContain('正在加载')
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

  it('reuses byte formatters without caching values, locales or unit choices', async () => {
    vi.resetModules()
    const { formatBytes: bytes } = await import('../foundations/intl')
    const Native = Intl.NumberFormat
    const constructor = vi.spyOn(Intl, 'NumberFormat').mockImplementation(function (...args: ConstructorParameters<typeof Native>) { return new Native(...args) })
    try {
      const cases = [[-0, -0, 'byte'], [0, 0, 'byte'], [999.9, 999.9, 'byte'], [1000, 1, 'kilobyte'], [2300, 2.3, 'kilobyte'], [2_300_000, 2.3, 'megabyte'], [1e18, 1000, 'petabyte']] as const
      for (const locale of ['en', 'de-DE']) {
        for (const [input, value, unit] of cases) {
          expect(bytes(input, { locale })).toBe(new Native(locale, { style: 'unit', unit, unitDisplay: unit === 'byte' ? 'long' : 'short', maximumFractionDigits: unit === 'byte' ? 0 : 1 }).format(value))
        }
      }
      expect(constructor).toHaveBeenCalledTimes(8)
      for (const input of [-1, Number.NaN, Infinity, -Infinity]) expect(bytes(input, { locale: 'invalid_locale' })).toBe(String(input))
      expect(constructor).toHaveBeenCalledTimes(8)
    } finally {
      constructor.mockRestore()
    }
  })

  it('keeps locale, zone and both styles distinct while formatting new dates', async () => {
    vi.resetModules()
    const { formatDateTime: dateTime } = await import('../foundations/intl')
    const Native = Intl.DateTimeFormat
    const constructor = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(function (...args: ConstructorParameters<typeof Native>) { return new Native(...args) })
    try {
      const options: DateTimeOptions[] = [
        { locale: 'en', timeZone: 'UTC' },
        { locale: 'de-DE', timeZone: 'UTC' },
        { locale: 'en', timeZone: 'America/Los_Angeles' },
        { locale: 'en', timeZone: 'UTC', dateStyle: 'long' },
        { locale: 'en', timeZone: 'UTC', timeStyle: 'long' },
        { locale: 'en', timeZone: 'UTC', dateStyle: 'none' },
        { locale: 'en', timeZone: 'UTC', timeStyle: 'none' },
        { locale: 'en', timeZone: 'UTC', dateStyle: 'none', timeStyle: 'none' },
      ]
      for (const option of options) {
        const { locale = 'en', timeZone, dateStyle = 'medium', timeStyle = 'short' } = option
        const expected = new Native(locale, { timeZone, dateStyle: dateStyle === 'none' ? undefined : dateStyle, timeStyle: timeStyle === 'none' ? undefined : timeStyle })
        for (const value of [instant, new Date(instant), '2026-03-08T09:59:00Z', '2026-03-08T10:01:00Z']) {
          expect(dateTime(value, option)).toBe(expected.format(value instanceof Date ? value : new Date(value)))
        }
      }
      expect(constructor).toHaveBeenCalledTimes(options.length)
      for (const value of ['not a date', new Date(Number.NaN), Number.NaN, Infinity]) {
        expect(dateTime(value, { locale: 'invalid_locale', timeZone: 'Invalid/Zone' })).toBe(String(value))
      }
      expect(constructor).toHaveBeenCalledTimes(options.length)
    } finally {
      constructor.mockRestore()
    }
  })

  it('constructs afresh for the runtime zone instead of remembering its resolution', async () => {
    vi.resetModules()
    const { formatDateTime: dateTime } = await import('../foundations/intl')
    const Native = Intl.DateTimeFormat
    const constructor = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(function (...args: ConstructorParameters<typeof Native>) { return new Native(...args) })
    try {
      for (const value of [instant, instant + 86_400_000]) {
        expect(dateTime(value)).toBe(new Native('en', { timeZone: undefined, dateStyle: 'medium', timeStyle: 'short' }).format(value))
      }
      expect(constructor).toHaveBeenCalledTimes(2)
      expect(constructor.mock.calls.every(([, options]) => options?.timeZone === undefined)).toBe(true)
      dateTime(instant, { timeZone: 'UTC' })
      dateTime(instant + 1, { timeZone: 'UTC' })
      expect(constructor).toHaveBeenCalledTimes(3)
    } finally {
      constructor.mockRestore()
    }
  })

  it('preserves native coercion and errors for invalid or untyped options', async () => {
    vi.resetModules()
    const { formatBytes: bytes, formatDateTime: dateTime } = await import('../foundations/intl')
    const outcome = (read: () => string) => {
      try { return read() } catch (error) { return { name: (error as Error).name, message: (error as Error).message } }
    }
    const locales = ['invalid_locale', null, 1n, Symbol('locale'), { 0: 'en', length: 1, toJSON() { throw new Error('must not serialize native locale inputs') } }]
    for (const raw of locales) {
      const locale = raw as string
      expect(outcome(() => bytes(2300, { locale }))).toEqual(outcome(() => new Intl.NumberFormat(locale, { style: 'unit', unit: 'kilobyte', unitDisplay: 'short', maximumFractionDigits: 1 }).format(2.3)))
    }
    const options = [
      { locale: 'invalid_locale', timeZone: 'Invalid/Zone' },
      { locale: 1n, timeZone: 'UTC' },
      { locale: null, timeZone: 'UTC' },
      { timeZone: Symbol('zone') },
      { timeZone: 'Invalid/Zone' },
      { timeZone: 'UTC', dateStyle: 1n },
      { timeZone: 'UTC', timeStyle: 'invalid-style' },
    ]
    for (const raw of options) {
      const option = raw as DateTimeOptions
      const { locale = 'en', timeZone, dateStyle = 'medium', timeStyle = 'short' } = option
      expect(outcome(() => dateTime(instant, option))).toEqual(outcome(() => new Intl.DateTimeFormat(locale, { timeZone, dateStyle: dateStyle === 'none' ? undefined : dateStyle, timeStyle: timeStyle === 'none' ? undefined : timeStyle }).format(instant)))
    }
  })

  it('bounds byte formatter reuse to 64 entries without evicting on constructor errors', async () => {
    vi.resetModules()
    const { formatBytes: bytes } = await import('../foundations/intl')
    const Native = Intl.NumberFormat
    const constructor = vi.spyOn(Intl, 'NumberFormat').mockImplementation(function (...args: ConstructorParameters<typeof Native>) { return new Native(...args) })
    try {
      const keys = ['en', 'de', 'fr', 'es', 'it', 'pt', 'ja', 'ko', 'zh', 'ar', 'hi'].flatMap(locale => [1, 1e3, 1e6, 1e9, 1e12, 1e15].map(value => ({ locale, value })))
      for (const key of keys.slice(0, 64)) bytes(key.value, key)
      expect(constructor).toHaveBeenCalledTimes(64)
      expect(() => bytes(1, { locale: 'invalid_locale' })).toThrow(RangeError)
      bytes(keys[0]!.value, keys[0])
      expect(constructor).toHaveBeenCalledTimes(65)
      bytes(keys[64]!.value, keys[64])
      bytes(keys[0]!.value, keys[0])
      bytes(keys[0]!.value, keys[0])
      expect(constructor).toHaveBeenCalledTimes(67)
    } finally {
      constructor.mockRestore()
    }
  })

  it('bounds explicit-zone formatter reuse to 64 entries independently of byte formatters', async () => {
    vi.resetModules()
    const { formatDateTime: dateTime, formatBytes: bytes } = await import('../foundations/intl')
    const Native = Intl.DateTimeFormat
    const constructor = vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(function (...args: ConstructorParameters<typeof Native>) { return new Native(...args) })
    try {
      const styles = ['full', 'long', 'medium', 'short', 'none'] as const
      const keys = ['en', 'de', 'fr'].flatMap(locale => styles.flatMap(dateStyle => styles.map(timeStyle => ({ locale, timeZone: 'UTC', dateStyle, timeStyle }))))
      for (const key of keys.slice(0, 64)) dateTime(instant, key)
      expect(constructor).toHaveBeenCalledTimes(64)
      for (let index = 0; index < 65; index++) bytes(1, { locale: `en-x-cache${index}` })
      dateTime(instant, keys[0])
      expect(constructor).toHaveBeenCalledTimes(64)
      expect(() => dateTime(instant, { timeZone: 'Invalid/Zone' })).toThrow(RangeError)
      dateTime(instant, keys[0])
      expect(constructor).toHaveBeenCalledTimes(65)
      dateTime(instant, keys[64])
      dateTime(instant, keys[0])
      dateTime(instant, keys[0])
      expect(constructor).toHaveBeenCalledTimes(67)
    } finally {
      constructor.mockRestore()
    }
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
