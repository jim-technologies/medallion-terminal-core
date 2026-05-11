import { getNested } from './getNested'

// Tiny predicate evaluator for WidgetAlert.when. Intentionally limited
// — comparisons against a path on the widget's data, with literal RHS.
// No function calls, no expressions, no eval. Anything more requires
// a custom widget that owns its own predicate logic.
//
// Format: a single term, or terms combined with `&&` / `||`.
//   <term> ::= <path> <op> <literal>
//   <path>    — dot path into `data`, with numeric segments indexing
//               into arrays. Same semantics as `getNested`.
//   <op>      — one of >, >=, <, <=, ==, !=
//   <literal> — number, "string" (double-quoted), true, false, or null
//   <expr>    — term [`&&`|`||` term ...]
//
// Precedence: `&&` binds tighter than `||`. No parens — keep it small.
// Example: `value > 70000 && volume > 1e8 || status == "ERROR"` parses
// as `(value>70000 && volume>1e8) || status=="ERROR"`.
//
// Returns false on malformed input — alerts are advisory, never throw.

const OP_RE = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/
type Op = '>' | '>=' | '<' | '<=' | '==' | '!='

export function evaluateAlert(data: unknown, when: string): boolean {
  const parsed = parseExpr(when)
  if (!parsed) return false
  return evalExpr(parsed, data)
}

// Exposed so the template validator can flag unparseable predicates at
// authoring time instead of waiting for them to silently no-op at runtime.
export function canParsePredicate(when: string): boolean {
  return parseExpr(when) !== null
}

type Term = { path: string; op: Op; rhs: unknown }
// OR of ANDs — flat, no nesting. Each inner array is AND-joined.
type Expr = Term[][]

function parseExpr(when: string): Expr | null {
  const trimmed = when.trim()
  if (!trimmed) return null
  const orGroups = splitTop(trimmed, '||')
  const out: Expr = []
  for (const group of orGroups) {
    const andTerms = splitTop(group, '&&')
    const terms: Term[] = []
    for (const raw of andTerms) {
      const term = parseTerm(raw)
      if (!term) return null
      terms.push(term)
    }
    if (terms.length === 0) return null
    out.push(terms)
  }
  return out.length === 0 ? null : out
}

// Split on `sep` at the top level. We don't have parens or strings that
// span operators here (literals are single-quoted-token-shaped — no
// embedded `&&` / `||`), so a simple indexOf walk suffices.
function splitTop(s: string, sep: '&&' | '||'): string[] {
  const out: string[] = []
  let depth = 0
  let last = 0
  let inStr = false
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '"') inStr = !inStr
    if (inStr) continue
    if (!inStr && s.startsWith(sep, i)) {
      out.push(s.slice(last, i))
      last = i + sep.length
      i += sep.length - 1
      continue
    }
    // No parens supported, but tolerate them defensively if an author
    // adds them — they fall through and parseTerm will reject.
    if (ch === '(') depth++
    if (ch === ')') depth--
    void depth
  }
  out.push(s.slice(last))
  // Preserve empty halves — a leading/trailing/double separator means
  // the expression is malformed, and parseTerm rejecting "" surfaces it.
  return out.map(t => t.trim())
}

function parseTerm(raw: string): Term | null {
  const m = raw.trim().match(OP_RE)
  if (!m) return null
  const [, path, op, rhsRaw] = m as [string, string, Op, string]
  return { path: path.trim(), op, rhs: parseLiteral(rhsRaw.trim()) }
}

function parseLiteral(raw: string): unknown {
  if (raw === 'true') return true
  if (raw === 'false') return false
  if (raw === 'null') return null
  // "string" with double quotes — strip them
  if (raw.length >= 2 && raw.startsWith('"') && raw.endsWith('"')) {
    return raw.slice(1, -1)
  }
  // Fall back to number; NaN means caller's literal was unparseable.
  const n = Number(raw)
  return Number.isNaN(n) ? raw : n
}

function evalExpr(expr: Expr, data: unknown): boolean {
  for (const andGroup of expr) {
    let allTrue = true
    for (const term of andGroup) {
      if (!compare(getNested(data, term.path), term.op, term.rhs)) {
        allTrue = false
        break
      }
    }
    if (allTrue) return true
  }
  return false
}

function compare(lhs: unknown, op: Op, rhs: unknown): boolean {
  // For numeric ops, coerce both sides; if either side isn't a number,
  // the comparison is false.
  if (op === '>' || op === '>=' || op === '<' || op === '<=') {
    const l = Number(lhs)
    const r = Number(rhs)
    if (!Number.isFinite(l) || !Number.isFinite(r)) return false
    switch (op) {
      case '>':  return l > r
      case '>=': return l >= r
      case '<':  return l < r
      case '<=': return l <= r
    }
  }
  // Equality compares strict but coerces numeric-string vs number to
  // match the most common author intent ("status == \"OK\"" /
  // "value == 0").
  if (op === '==') return lhs === rhs || (typeof lhs === 'number' && typeof rhs === 'number' && lhs === rhs)
  if (op === '!=') return !(lhs === rhs || (typeof lhs === 'number' && typeof rhs === 'number' && lhs === rhs))
  return false
}
