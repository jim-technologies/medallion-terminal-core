# Makefile contract (jim-technologies open-source repositories)

Every repository answers these verbs with these exact names and meanings.
`make help` lists them (the `## comment` convention). The Makefile is a
router: targets delegate to native tooling or guard; logic lives in scripts.

## Required verbs

| Verb | Meaning |
|---|---|
| `make fmt` | Rewrite formatting in place, every language in the repo |
| `make test` | The full test suite, offline and hermetic. Polyglot repos MAY add `test-<lang>` sub-verbs; `test` runs them all |
| `make validate` | The gate, runnable locally, exactly what CI runs: public-surface guard + version parity + format check + lint + typecheck + `test`. CI never checks more or less than this verb |
| `make build` | Produce the artifacts locally |
| `make generate` | (Required where code is generated from schemas) Regenerate; `validate` fails if committed output is stale |
| `make release` | Publish to public ecosystems only — git tag for Go modules, npm, PyPI, crates.io — with one VERSION shared by every language SDK. MUST refuse a dirty or unpushed tree. Runs from a maintainer's machine; CI never publishes |

## The public-surface guard (part of `validate`)

`validate` MUST fail if internal or private codenames, private
infrastructure names, or references to private repositories appear anywhere
in code, docs, examples, or the Makefile itself.

`scripts/public-surface-check` enforces that, over three streams: the content
of every tracked file, every tracked path, and the commit messages a push
would publish. A finding against a commit message means the message must be
rewritten before the branch is pushed; fixing the file is not enough.

Exceptions live in `.public-surface-allow` at the repository root, one line
each, and every one carries the reason it is justified. The guard re-runs
every category probe after loading those rules, so a rule broad enough to
switch a category off is rejected rather than obeyed, and
`scripts/public-surface-check-test` runs alongside the guard so the gate goes
red if the guard itself stops working.

## Explicitly FORBIDDEN

- `make deploy` — libraries deploy nowhere.
- Dependencies that resolve only privately (every `go.mod`/`package.json`/
  lockfile entry must build for a stranger).
- CI secrets of any kind — CI runs `make validate`, nothing else.
- Any encrypted-secret store; these repositories hold no secrets.

## Required furniture

`LICENSE` · `CHANGELOG.md` · a single `VERSION` file shared by every language SDK ·
`make help` self-documentation
