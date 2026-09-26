/**
 * The toolkit's user-facing strings, keyed. English is the default; hosts
 * select a built-in catalog with `DesignSystemProvider locale` and override
 * any key with `messages`. Placeholders are `{name}`.
 */
export const EN_MESSAGES = {
  'button.working': 'Working',
  'breadcrumbs.label': 'Breadcrumbs',
  'combobox.placeholder': 'Select…',
  'combobox.empty': 'No matching options',
  'dialog.close': 'Close dialog',
  'drawer.close': 'Close drawer',
  'splitPane.resize': 'Resize panes',
  'tag.remove': 'Remove',
  'toolbar.label': 'Toolbar',
  'tree.collapse': 'Collapse {label}',
  'tree.expand': 'Expand {label}',
  'state.loading': 'Loading',
  'state.retry': 'Retry',
  'state.error.title': 'Unable to load',
} as const

/** A key in the toolkit message catalog. */
export type MessageKey = keyof typeof EN_MESSAGES

/** A complete catalog: every key, translated. */
export type MessageCatalog = Readonly<Record<MessageKey, string>>

/** Simplified Chinese, matching the Terminal's `zh-CN` product catalog. */
export const ZH_CN_MESSAGES: MessageCatalog = {
  'button.working': '处理中',
  'breadcrumbs.label': '路径导航',
  'combobox.placeholder': '请选择…',
  'combobox.empty': '没有匹配的选项',
  'dialog.close': '关闭对话框',
  'drawer.close': '关闭抽屉',
  'splitPane.resize': '调整窗格大小',
  'tag.remove': '移除',
  'toolbar.label': '工具栏',
  'tree.collapse': '折叠 {label}',
  'tree.expand': '展开 {label}',
  'state.loading': '正在加载',
  'state.retry': '重试',
  'state.error.title': '无法加载',
}

const BUILT_IN_CATALOGS: Readonly<Record<string, MessageCatalog>> = {
  en: EN_MESSAGES,
  zh: ZH_CN_MESSAGES,
}

/**
 * The built-in catalog for a BCP 47 locale, by language (`zh-CN`, `zh-Hans`
 * and `zh` all select Simplified Chinese); English otherwise.
 */
export function builtInMessages(locale: string): MessageCatalog {
  const language = locale.toLowerCase().split(/[-_]/)[0] ?? 'en'
  return BUILT_IN_CATALOGS[language] ?? EN_MESSAGES
}

/** Values substituted into `{name}` placeholders. */
export type MessageValues = Readonly<Record<string, string | number>>

/** Fills `{name}` placeholders; unknown names are left as written. */
export function formatMessage(template: string, values?: MessageValues): string {
  if (!values) return template
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (match, name: string) => (
    name in values ? String(values[name]) : match
  ))
}
