import { getNested } from './getNested'

// Tiny predicate evaluator for WidgetAlert.when. Intentionally limited
// — comparisons against a path on the widget's data, with literal RHS.
// No function calls, no expressions, no eval. Anything more requires
// a custom widget that owns its own predicate logic.
//
// Format: "<path> <op> <literal>"
//   <path>    — dot path into `data`, with numeric segments indexing
//               into arrays. Same semantics as `getNested`.
//   <op>      — one of >, >=, <, <=, ==, !=
//   <literal> — number, "string" (double-quoted), true, false, or null
//
// Returns false on malformed input — alerts are advisory, never throw.

const OP_RE = /^(\S.*?)\s+(>=|<=|==|!=|>|<)\s+(.+)$/
type Op = '>' | '>=' | '<' | '<=' | '==' | '!='

export function evaluateAlert(data: unknown, when: string): boolean {
  const m = when.trim().match(OP_RE)
  if (!m) return false
  const [, path, op, rhsRaw] = m as [string, string, Op, string]
  const lhs = getNested(data, path.trim())
  const rhs = parseLiteral(rhsRaw.trim())
  return compare(lhs, op, rhs)
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
