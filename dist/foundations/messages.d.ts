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
