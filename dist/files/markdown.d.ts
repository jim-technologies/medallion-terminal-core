/**
 * Markdown to sanitised HTML. `marked` passes raw HTML, `javascript:` URLs
 * and event attributes through, so its output always goes through
 * DOMPurify before it reaches the DOM. Both load only when a Markdown
 * document is actually rendered.
 */
export declare function renderMarkdown(source: string): Promise<string>;
