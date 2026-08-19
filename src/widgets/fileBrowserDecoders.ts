// Lightweight text-family decoders used by FileBrowser. Binary formats that
// browsers cannot render natively (for example HEIC and MKV) deliberately go
// through the host's asset-application resolver or a backend-generated web
// representation instead of pulling a large WASM runtime into Terminal Core.

// fetchText pulls the raw bytes from a URL as UTF-8 text. Used by the
// text-family previews (json/yaml/markdown/csv/text). Throws on
// non-2xx so the overlay can surface the error.
export async function fetchText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
  return res.text()
}

// prettyJSON parses + re-serialises with 2-space indent. Returns the
// original input unchanged if it isn't valid JSON, so a malformed file
// still shows readable contents instead of erroring out.
export function prettyJSON(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

// parseCSV is a deliberately tiny splitter — handles quoted fields with
// embedded commas and CRLF line endings. RFC-4180-ish. Good enough for
// preview; users who need real CSV parsing in their dashboards can do
// it server-side.
export function parseCSV(raw: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i]
    if (inQuotes) {
      if (c === '"' && raw[i + 1] === '"') { cur += '"'; i++; continue }
      if (c === '"') { inQuotes = false; continue }
      cur += c
      continue
    }
    if (c === '"') { inQuotes = true; continue }
    if (c === ',') { row.push(cur); cur = ''; continue }
    if (c === '\n' || c === '\r') {
      if (c === '\r' && raw[i + 1] === '\n') i++
      row.push(cur); cur = ''
      rows.push(row); row = []
      continue
    }
    cur += c
  }
  if (cur !== '' || row.length > 0) { row.push(cur); rows.push(row) }
  return rows
}

// renderMarkdown lazy-loads marked (~30 KB) + DOMPurify and renders the
// input to SANITISED HTML. marked does NOT sanitise — it passes raw HTML,
// `javascript:` URLs, and `onerror=` attributes straight through — so the
// output MUST go through DOMPurify before it reaches
// dangerouslySetInnerHTML, otherwise untrusted markdown (e.g. scraped
// content) is a stored-XSS vector. Both libs load only when a markdown
// file is actually previewed. Returns the original text wrapped in <pre>
// on parse failure so the user still sees something.
export async function renderMarkdown(raw: string): Promise<string> {
  const [{ marked }, { default: DOMPurify }] = await Promise.all([
    import('marked'),
    import('dompurify'),
  ])
  try {
    const html = (await marked.parse(raw, { async: true })) as string
    return DOMPurify.sanitize(html)
  } catch {
    return `<pre>${escapeHtml(raw)}</pre>`
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}
