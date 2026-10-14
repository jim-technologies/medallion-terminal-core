/** Hooks a host gives the Markdown renderer. */
export interface MarkdownOptions {
    /**
     * Rewrites a link's destination, such as a repository-relative path to a
     * route or a raw-file URL; return it unchanged to keep it.
     */
    resolveHref?: (href: string) => string;
    /** Rewrites an image's source the same way. */
    resolveImage?: (src: string) => string;
}
/**
 * Markdown to sanitised HTML. `marked` passes raw HTML, `javascript:` URLs
 * and event attributes through, so its output always goes through
 * DOMPurify before it reaches the DOM. Both load only when a Markdown
 * document is actually rendered. The resolvers run on the parsed tokens,
 * before rendering, so what they return is still sanitised.
 */
export declare function renderMarkdown(source: string, { resolveHref, resolveImage }?: MarkdownOptions): Promise<string>;
