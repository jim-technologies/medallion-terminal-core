/** Hooks a host gives the Markdown renderer. */
export interface MarkdownOptions {
  /**
   * Rewrites a link's destination, such as a repository-relative path to a
   * route or a raw-file URL; return it unchanged to keep it.
   */
  resolveHref?: (href: string) => string
  /** Rewrites an image's source the same way. */
  resolveImage?: (src: string) => string
}

/**
 * Markdown to sanitised HTML. `marked` passes raw HTML, `javascript:` URLs
 * and event attributes through, so its output always goes through
 * DOMPurify before it reaches the DOM. Both load only when a Markdown
 * document is actually rendered. The resolvers run on the parsed tokens,
 * before rendering, so what they return is still sanitised.
 */
export async function renderMarkdown(source: string, { resolveHref, resolveImage }: MarkdownOptions = {}): Promise<string> {
  const [{ Marked }, { default: DOMPurify }] = await Promise.all([
    import('marked'),
    import('dompurify'),
  ])
  try {
    const marked = new Marked({
      walkTokens(token) {
        if (token.type === 'link' && resolveHref) token.href = resolveHref(token.href)
        else if (token.type === 'image' && resolveImage) token.href = resolveImage(token.href)
      },
    })
    const html = (await marked.parse(source, { async: true })) as string
    return DOMPurify.sanitize(html, { FORBID_TAGS: ['style', 'form', 'input', 'button'], FORBID_ATTR: ['style'] })
  } catch {
    return `<pre>${escapeHtml(source)}</pre>`
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, character => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!
  ))
}
