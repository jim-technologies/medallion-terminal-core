# Package17: terminal-core dependency currency

Branch `chore/deps-latest-20261022`, base `a51019aca18bbdf43bc1e7cfcd22e74e955f5e57`. Product VERSION/package version remain0.8.0. No proto contract, canonical ID, point-in-time field, persistence format or feature default changes. Generated proto files change only their generator version comment. Rollback is the prior dependency branch/tree and its committed dist; consumers continue using their existing released-tag commits until the owner releases this branch.

## Versions

| Component | Before | After |
|---|---|---|
| Flox Node24 |24.20.0|24.21.0(newest offered nodejs_24)|
| Flox/pinned package manager |pnpm11.27.0|12.9.0|
| Buf |1.72.0|1.73.0|
| React / ReactDOM |19.3.0|19.3.1|
| Storybook family |10.6.0|10.6.3|
| Vitest/browser provider |4.1.11|5.0.5|
| Vite / React plugin |8.3.1 /6.1.1|8.3.5 /6.1.2|
| MapLibre |6.11.2|6.15.0|
| DOMPurify / marked |3.4.16 /18.0.14|3.4.17 /18.1.1|
| Hyparquet writer / reader |0.16.10 /1.31.1|0.17.0 /1.31.5|
| Protobuf ES/runtime |2.15.0|2.16.0|
| Axe browser tests |4.13.0|4.14.0|

TypeScript7.0.2, Playwright1.64.1 and the remaining direct families already resolve to their latest admitted versions. Node type definitions follow the tested Node24 runtime family; a blind latest update selected Node26 definitions, so that was corrected before compilation. All authored Flox packages now have explicit latest-offered constraints; three supported systems and package groups remain. Transactional `flox edit` plus `flox upgrade` resolved and built the environment successfully; catalog offers alone were not treated as solver proof.

## Package policy and artifacts

The existing one-day package-age requirement is explicit as1440minutes with strict checking. No wildcard exclusions or enforcement bypasses were added. pnpm12's ordinary two-document lock retains package-manager enforcement. The source scanner was checked against that real lock: it still finds all expected runtime packages (DOMPurify,hyparquet-writer,marked plus the runtime closure); an empty parser result would fail qualification. This source scan uses Trivy's normal production dependency scope, not a claim that all boot-manager or dev-tool packages were audited. Browser tests and full validation remain mandatory. New library dist chunks and declarations are regenerated and committed rather than supplied through a sibling checkout.

## Qualification

The library build and type declarations pass on the new Flox environment. The first full gate found Vitest5's removed top-level benchmark export; all21 workloads now use the official awaited test-context fixture, and the dedicated Node benchmark command passes21/21 with ordinary unit/Storybook selections unchanged. The benchmark runner warns about module-export getter overhead; this qualification proves the workloads run and does not claim production timings or a performance improvement. Lint, source-generation freshness and type checks pass after the correction.

A pnpm12 source-scan diagnostic parses the same five-package runtime closure and reports0fixedHIGH/0CRITICAL, matching the clean baseline. No candidate image exists: this repository owns a Git-distributed library, with no Dockerfile; image counts are not invented. The full gate, final clean-head scanner result, exact counts and source/cgroup receipts are recorded in the parent delivery report after this source snapshot is frozen. No full-gate success is claimed in advance.

Only the main session may merge, tag or release the kit and advance consumers to a published tag. No consumer is repinned to this unreleased branch. No apply, cluster write, migration or backfill occurs in this qualification.

## Accessibility and browser qualification

Axe4.14 identified visible text missing from accessible action names. The
affected names now include displayed initials, identifiers, counts, shortcuts
and truncated graph text while retaining their full action descriptions.
Keyboard selectors follow those names. Twenty-eight accessibility-tree
baselines come from reviewed browser output; existing PNG baselines and pixel
tolerances remain unchanged.

Browser validation honors its bounded worker setting, builds a fresh phase-0
catalog and refuses an already-running server. The phase-1 performance build,
browser projects, assertions, deadlines and retry policy remain unchanged.
The history fixture exposes an explicit completion signal so tests observe
the real busy state before rows arrive, including Back, Forward and refresh.

Host runs retained module-fetch failures caused by network-change events.
An isolated loopback-network smoke passed the same existing keyboard case in
Chromium, Firefox and WebKit. Full validation still must run every ordinary
stage and assertion; final counts and the exact network environment belong in
the delivery report. Public demonstration video URLs returned HTTP403 in a
separate read-only check; ordinary source tests do not establish their live
availability.

Release this refreshed library before repinning and publishing consumer
updates. Dependencies already inlined into a consumer's immutable library
bundle do not change merely because its application lockfile is refreshed.
