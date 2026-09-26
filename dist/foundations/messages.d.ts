/**
 * The toolkit's user-facing strings, keyed. English is the default; hosts
 * select a built-in catalog with `DesignSystemProvider locale` and override
 * any key with `messages`. Placeholders are `{name}`.
 */
export declare const EN_MESSAGES: {
    readonly 'button.working': 'Working';
    readonly 'breadcrumbs.label': 'Breadcrumbs';
    readonly 'combobox.placeholder': 'Select…';
    readonly 'combobox.empty': 'No matching options';
    readonly 'dialog.close': 'Close dialog';
    readonly 'drawer.close': 'Close drawer';
    readonly 'splitPane.resize': 'Resize panes';
    readonly 'tag.remove': 'Remove';
    readonly 'toolbar.label': 'Toolbar';
    readonly 'tree.collapse': 'Collapse {label}';
    readonly 'tree.expand': 'Expand {label}';
    readonly 'state.loading': 'Loading';
    readonly 'state.retry': 'Retry';
    readonly 'state.error.title': 'Unable to load';
    readonly 'state.details': 'Details';
    readonly 'state.requestId': 'Request ID';
    readonly 'state.errorCode': 'Code';
    readonly 'error.unauthenticated.title': 'Sign-in required';
    readonly 'error.unauthenticated.description': 'Your session has ended. Sign in again to continue.';
    readonly 'error.forbidden.title': 'You don’t have access';
    readonly 'error.forbidden.description': 'Ask an owner for access.';
    readonly 'error.not_found.title': 'Not found';
    readonly 'error.not_found.description': 'It doesn’t exist or was moved.';
    readonly 'error.rate_limited.title': 'Too many requests';
    readonly 'error.rate_limited.description': 'Wait a moment, then try again.';
    readonly 'error.rate_limited.retryIn': 'Try again in {duration}.';
    readonly 'error.unavailable.title': 'Service unavailable';
    readonly 'error.unavailable.description': 'The service did not respond. Try again shortly.';
    readonly 'error.invalid.title': 'Request not accepted';
    readonly 'error.invalid.description': 'The service could not accept this request.';
    readonly 'error.unknown.description': 'Something went wrong while loading this.';
    readonly 'state.accessDenied.resource': 'Ask an owner of {resource} for access.';
    readonly 'state.notFound.resource': '{resource} doesn’t exist or was moved.';
    readonly 'state.signedOut.title': 'You’re signed out';
    readonly 'state.signedOut.description': 'Sign in to continue.';
    readonly 'state.signedOut.action': 'Sign in';
    readonly 'state.sessionExpired.title': 'Your session expired';
    readonly 'state.sessionExpired.description': 'Your work on this page is kept. Continue to renew your session.';
    readonly 'state.sessionExpired.action': 'Continue';
    readonly 'state.stale.title': 'Data may be out of date';
    readonly 'state.stale.description': 'Last updated {time}.';
    readonly 'state.stale.generic': 'This view has not refreshed recently.';
    readonly 'state.stale.action': 'Refresh';
    readonly 'copy.label': 'Copy';
    readonly 'copy.copied': 'Copied';
    readonly 'value.yes': 'Yes';
    readonly 'value.no': 'No';
    readonly 'value.more': '+{count}';
    readonly 'value.moreTitle': '{count} more: {items}';
    readonly 'value.fields': '{count} fields';
    readonly 'value.newTab': '(opens in a new tab)';
    readonly 'panel.filter': 'Filter';
    readonly 'propertyPanel.title': 'Properties';
    readonly 'propertyPanel.count': '{shown} of {total}';
    readonly 'propertyPanel.filter': 'Filter properties';
    readonly 'propertyPanel.noMatch': 'No properties match “{query}”';
    readonly 'objectHeader.copyId': 'Copy ID';
    readonly 'dataGrid.selectAll': 'Select all rows';
    readonly 'dataGrid.selectRow': 'Select {label}';
    readonly 'dataGrid.empty': 'No rows';
    readonly 'dataGrid.loading': 'Loading rows';
    readonly 'dataGrid.loadingMore': 'Loading more rows';
    readonly 'dataGrid.rowActions': 'Actions for {label}';
    readonly 'linkPanel.title': 'Links';
    readonly 'linkPanel.summary': '{types} link types · {objects} objects';
    readonly 'linkPanel.viewAll': 'View all {count}';
    readonly 'linkPanel.empty': 'No links';
    readonly 'linkPanel.incoming': 'incoming';
    readonly 'graph.zoomIn': 'Zoom in';
    readonly 'graph.zoomOut': 'Zoom out';
    readonly 'graph.reset': 'Reset view';
    readonly 'graph.more': '{count} more';
    readonly 'graph.moreLabel': '{count} more {relation} {type}';
    readonly 'pagination.label': 'Pages';
    readonly 'pagination.previous': 'Previous';
    readonly 'pagination.next': 'Next';
    readonly 'pagination.page': 'Page {page} of {count}';
    readonly 'pagination.pageOnly': 'Page {page}';
    readonly 'search.clear': 'Clear search';
    readonly 'search.removeToken': 'Remove {label}';
    readonly 'facet.clear': 'Clear';
    readonly 'facet.showMore': 'Show {count} more';
    readonly 'facet.showLess': 'Show fewer';
    readonly 'navRail.collapse': 'Collapse navigation';
    readonly 'navRail.expand': 'Expand navigation';
    readonly 'palette.label': 'Command palette';
    readonly 'palette.placeholder': 'Search or type a command';
    readonly 'palette.results': 'Results';
    readonly 'palette.empty': 'No results';
    readonly 'palette.loading': 'Searching';
    readonly 'palette.navigate': 'navigate';
    readonly 'palette.select': 'select';
    readonly 'palette.close': 'close';
    readonly 'toast.region': 'Notifications';
    readonly 'toast.dismiss': 'Dismiss notification';
    readonly 'activity.empty': 'No activity yet';
    readonly 'stat.increase': 'Increase';
    readonly 'stat.decrease': 'Decrease';
};
/** A key in the toolkit message catalog. */
export type MessageKey = keyof typeof EN_MESSAGES;
/** A complete catalog: every key, translated. */
export type MessageCatalog = Readonly<Record<MessageKey, string>>;
/** Simplified Chinese, matching the Terminal's `zh-CN` product catalog. */
export declare const ZH_CN_MESSAGES: MessageCatalog;
/**
 * The built-in catalog for a BCP 47 locale, by language (`zh-CN`, `zh-Hans`
 * and `zh` all select Simplified Chinese); English otherwise.
 */
export declare function builtInMessages(locale: string): MessageCatalog;
/** Values substituted into `{name}` placeholders. */
export type MessageValues = Readonly<Record<string, string | number>>;
/** Fills `{name}` placeholders; unknown names are left as written. */
export declare function formatMessage(template: string, values?: MessageValues): string;
