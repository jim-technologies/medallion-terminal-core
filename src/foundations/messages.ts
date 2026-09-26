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
  'state.details': 'Details',
  'state.requestId': 'Request ID',
  'state.errorCode': 'Code',
  'error.unauthenticated.title': 'Sign-in required',
  'error.unauthenticated.description': 'Your session has ended. Sign in again to continue.',
  'error.forbidden.title': 'You don’t have access',
  'error.forbidden.description': 'Ask an owner for access.',
  'error.not_found.title': 'Not found',
  'error.not_found.description': 'It doesn’t exist or was moved.',
  'error.rate_limited.title': 'Too many requests',
  'error.rate_limited.description': 'Wait a moment, then try again.',
  'error.rate_limited.retryIn': 'Try again in {duration}.',
  'error.unavailable.title': 'Service unavailable',
  'error.unavailable.description': 'The service did not respond. Try again shortly.',
  'error.invalid.title': 'Request not accepted',
  'error.invalid.description': 'The service could not accept this request.',
  'error.unknown.description': 'Something went wrong while loading this.',
  'state.accessDenied.resource': 'Ask an owner of {resource} for access.',
  'state.notFound.resource': '{resource} doesn’t exist or was moved.',
  'state.signedOut.title': 'You’re signed out',
  'state.signedOut.description': 'Sign in to continue.',
  'state.signedOut.action': 'Sign in',
  'state.sessionExpired.title': 'Your session expired',
  'state.sessionExpired.description': 'Your work on this page is kept. Continue to renew your session.',
  'state.sessionExpired.action': 'Continue',
  'state.stale.title': 'Data may be out of date',
  'state.stale.description': 'Last updated {time}.',
  'state.stale.generic': 'This view has not refreshed recently.',
  'state.stale.action': 'Refresh',
  'copy.label': 'Copy',
  'copy.copied': 'Copied',
  'value.yes': 'Yes',
  'value.no': 'No',
  'value.more': '+{count}',
  'value.moreTitle': '{count} more: {items}',
  'value.fields': '{count} fields',
  'value.newTab': '(opens in a new tab)',
  'panel.filter': 'Filter',
  'propertyPanel.title': 'Properties',
  'propertyPanel.count': '{shown} of {total}',
  'propertyPanel.filter': 'Filter properties',
  'propertyPanel.noMatch': 'No properties match “{query}”',
  'objectHeader.copyId': 'Copy ID',
  'dataGrid.selectAll': 'Select all rows',
  'dataGrid.selectRow': 'Select {label}',
  'dataGrid.empty': 'No rows',
  'dataGrid.loading': 'Loading rows',
  'dataGrid.loadingMore': 'Loading more rows',
  'dataGrid.rowActions': 'Actions for {label}',
  'linkPanel.title': 'Links',
  'linkPanel.summary': '{types} link types · {objects} objects',
  'linkPanel.viewAll': 'View all {count}',
  'linkPanel.empty': 'No links',
  'linkPanel.incoming': 'incoming',
  'graph.zoomIn': 'Zoom in',
  'graph.zoomOut': 'Zoom out',
  'graph.reset': 'Reset view',
  'graph.more': '{count} more',
  'graph.moreLabel': '{count} more {relation} {type}',
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
  'state.details': '详细信息',
  'state.requestId': '请求 ID',
  'state.errorCode': '代码',
  'error.unauthenticated.title': '需要登录',
  'error.unauthenticated.description': '您的会话已结束。请重新登录以继续。',
  'error.forbidden.title': '您没有访问权限',
  'error.forbidden.description': '请向所有者申请访问权限。',
  'error.not_found.title': '未找到',
  'error.not_found.description': '内容不存在或已被移动。',
  'error.rate_limited.title': '请求过多',
  'error.rate_limited.description': '请稍候再试。',
  'error.rate_limited.retryIn': '请在 {duration}后重试。',
  'error.unavailable.title': '服务不可用',
  'error.unavailable.description': '服务没有响应，请稍后重试。',
  'error.invalid.title': '请求未被接受',
  'error.invalid.description': '服务无法接受此请求。',
  'error.unknown.description': '加载时出现问题。',
  'state.accessDenied.resource': '请向 {resource} 的所有者申请访问权限。',
  'state.notFound.resource': '{resource} 不存在或已被移动。',
  'state.signedOut.title': '您已退出登录',
  'state.signedOut.description': '请登录后继续。',
  'state.signedOut.action': '登录',
  'state.sessionExpired.title': '您的会话已过期',
  'state.sessionExpired.description': '此页面上的工作会保留。请继续以续期会话。',
  'state.sessionExpired.action': '继续',
  'state.stale.title': '数据可能已过时',
  'state.stale.description': '最后更新于{time}。',
  'state.stale.generic': '此视图最近没有刷新。',
  'state.stale.action': '刷新',
  'copy.label': '复制',
  'copy.copied': '已复制',
  'value.yes': '是',
  'value.no': '否',
  'value.more': '+{count}',
  'value.moreTitle': '另外 {count} 项：{items}',
  'value.fields': '{count} 个字段',
  'value.newTab': '（在新标签页中打开）',
  'panel.filter': '筛选',
  'propertyPanel.title': '属性',
  'propertyPanel.count': '{shown} / {total}',
  'propertyPanel.filter': '筛选属性',
  'propertyPanel.noMatch': '没有与“{query}”匹配的属性',
  'objectHeader.copyId': '复制 ID',
  'dataGrid.selectAll': '选择所有行',
  'dataGrid.selectRow': '选择 {label}',
  'dataGrid.empty': '没有行',
  'dataGrid.loading': '正在加载行',
  'dataGrid.loadingMore': '正在加载更多行',
  'dataGrid.rowActions': '{label} 的操作',
  'linkPanel.title': '链接',
  'linkPanel.summary': '{types} 种链接类型 · {objects} 个对象',
  'linkPanel.viewAll': '查看全部 {count} 个',
  'linkPanel.empty': '没有链接',
  'linkPanel.incoming': '传入',
  'graph.zoomIn': '放大',
  'graph.zoomOut': '缩小',
  'graph.reset': '重置视图',
  'graph.more': '另外 {count} 个',
  'graph.moreLabel': '另外 {count} 个 {relation} {type}',
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
