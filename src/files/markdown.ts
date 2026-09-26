/**
 * Markdown to sanitised HTML. `marked` passes raw HTML, `javascript:` URLs
 * and event attributes through, so its output always goes through
 * DOMPurify before it reaches the DOM. Both load only when a Markdown
 * document is actually rendered.
 */
export async function renderMarkdown(source: string): Promise<string> {
  const [{ marked }, { default: DOMPurify }] = await Promise.all([
    import('marked'),
    import('dompurify'),
  ])
  try {
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
