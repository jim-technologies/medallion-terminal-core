export type CodeReviewStatus = 'approved' | 'changes-requested' | 'pending'
export type CodeJobStatus = 'success' | 'running' | 'failed' | 'pending'
export type CodeDiffLineKind = 'context' | 'addition' | 'deletion'

export interface CodeCollaborator {
  id: string
  name: string
  handle: string
  color: string
  reviewStatus?: CodeReviewStatus
}

export interface CodeDiffLine {
  oldNumber?: number
  newNumber?: number
  kind: CodeDiffLineKind
  content: string
}

export interface CodeChangedFile {
  id: string
  path: string
  additions: number
  deletions: number
  status: 'added' | 'modified' | 'deleted'
  viewed?: boolean
  lines: readonly CodeDiffLine[]
}

export interface CodeReviewActivity {
  id: string
  actor: CodeCollaborator
  kind: 'comment' | 'approval' | 'commit' | 'system'
  timestamp: string
  body: string
  commitSha?: string
}

export interface CodePipelineJob {
  id: string
  name: string
  stage: string
  status: CodeJobStatus
  required?: boolean
  duration: string
  runner: string
  log: readonly string[]
}

export interface CodeChangeRequest {
  number: number
  title: string
  status: 'open' | 'merged' | 'closed'
  sourceBranch: string
  targetBranch: string
  summary: string
  commits: number
  additions: number
  deletions: number
  labels: readonly string[]
  issueReference: string
  author: CodeCollaborator
  assignees: readonly CodeCollaborator[]
  reviewers: readonly CodeCollaborator[]
  activity: readonly CodeReviewActivity[]
}

export interface CodeCollaborationData {
  organization: string
  organizationSlug: string
  repository: string
  visibility: 'Public' | 'Private' | 'Internal'
  stars: number
  forks: number
  openIssues: number
  openRequests: number
  changeRequest: CodeChangeRequest
  files: readonly CodeChangedFile[]
  jobs: readonly CodePipelineJob[]
  pipeline: {
    id: number
    sha: string
    ref: string
    createdAt: string
    duration: string
  }
}

const JUN: CodeCollaborator = {
  id: 'jun',
  name: 'Jun',
  handle: 'jun',
  color: '#315ea8',
}

const MAYA: CodeCollaborator = {
  id: 'maya',
  name: 'Maya Chen',
  handle: 'mayachen',
  color: '#7c4d9f',
  reviewStatus: 'approved',
}

const OMAR: CodeCollaborator = {
  id: 'omar',
  name: 'Omar Rahman',
  handle: 'omar-r',
  color: '#9b5a2b',
  reviewStatus: 'approved',
}

export const CODE_COLLABORATION_FIXTURE: CodeCollaborationData = {
  organization: 'Jim Technologies',
  organizationSlug: 'jim-technologies',
  repository: 'medallion-platform',
  visibility: 'Private',
  stars: 28,
  forks: 3,
  openIssues: 18,
  openRequests: 4,
  changeRequest: {
    number: 126,
    title: 'Normalize provider adapters',
    status: 'open',
    sourceBranch: 'feature/provider-contract',
    targetBranch: 'main',
    summary: 'Introduce a typed normalization boundary so hosts can swap providers without leaking vendor-specific fields into the presentation layer.',
    commits: 3,
    additions: 144,
    deletions: 9,
    labels: ['enhancement', 'platform'],
    issueReference: 'ENG-482',
    author: JUN,
    assignees: [JUN],
    reviewers: [MAYA, OMAR],
    activity: [
      {
        id: 'review-maya',
        actor: MAYA,
        kind: 'approval',
        timestamp: '42 minutes ago',
        body: 'The contract is clear and the provider metadata remains available at the boundary.',
      },
      {
        id: 'commit-jun',
        actor: JUN,
        kind: 'commit',
        timestamp: '31 minutes ago',
        body: 'Add conformance fixtures for normalize and denormalize',
        commitSha: '9e7f1ac',
      },
      {
        id: 'comment-omar',
        actor: OMAR,
        kind: 'comment',
        timestamp: '12 minutes ago',
        body: 'The retry metadata test now covers the host-owned fallback path. Approved.',
      },
    ],
  },
  files: [
    {
      id: 'adapter',
      path: 'src/core/providerAdapter.ts',
      additions: 48,
      deletions: 6,
      status: 'modified',
      lines: [
        { oldNumber: 18, newNumber: 18, kind: 'context', content: 'export interface ProviderAdapter<TSource, TCanonical> {' },
        { newNumber: 19, kind: 'addition', content: '  readonly provider: string' },
        { newNumber: 20, kind: 'addition', content: '  normalize(source: TSource, options?: NormalizeOptions): TCanonical' },
        { newNumber: 21, kind: 'addition', content: '  denormalize(value: TCanonical): TSource' },
        { oldNumber: 19, newNumber: 22, kind: 'context', content: '}' },
        { oldNumber: 25, kind: 'deletion', content: 'export function normalizeProvider(value: unknown) {' },
        { newNumber: 29, kind: 'addition', content: 'export function createProviderAdapter<TSource, TCanonical>(' },
        { newNumber: 30, kind: 'addition', content: '  adapter: ProviderAdapter<TSource, TCanonical>,' },
        { newNumber: 31, kind: 'addition', content: '): Readonly<ProviderAdapter<TSource, TCanonical>> {' },
        { newNumber: 32, kind: 'addition', content: '  return Object.freeze(adapter)' },
        { oldNumber: 26, newNumber: 33, kind: 'context', content: '}' },
      ],
    },
    {
      id: 'adapter-test',
      path: 'src/core/providerAdapter.test.ts',
      additions: 72,
      deletions: 0,
      status: 'added',
      viewed: true,
      lines: [
        { newNumber: 1, kind: 'addition', content: "import { describe, expect, it } from 'vitest'" },
        { newNumber: 2, kind: 'addition', content: "import { createProviderAdapter } from './providerAdapter'" },
        { newNumber: 4, kind: 'addition', content: "describe('provider adapter contract', () => {" },
        { newNumber: 5, kind: 'addition', content: "  it('round-trips provider metadata', () => {" },
        { newNumber: 6, kind: 'addition', content: '    const normalized = adapter.normalize(source)' },
        { newNumber: 7, kind: 'addition', content: '    expect(adapter.denormalize(normalized)).toEqual(source)' },
        { newNumber: 8, kind: 'addition', content: '  })' },
        { newNumber: 9, kind: 'addition', content: '})' },
      ],
    },
    {
      id: 'integrations',
      path: 'docs/integrations.md',
      additions: 24,
      deletions: 3,
      status: 'modified',
      lines: [
        { oldNumber: 42, newNumber: 42, kind: 'context', content: '## Provider adapters' },
        { newNumber: 43, kind: 'addition', content: '' },
        { newNumber: 44, kind: 'addition', content: 'Adapters own provider-specific normalization and denormalization.' },
        { newNumber: 45, kind: 'addition', content: 'Presentation components consume only the canonical contract.' },
        { oldNumber: 43, kind: 'deletion', content: 'Components may read provider fields directly.' },
      ],
    },
  ],
  jobs: [
    {
      id: 'lint',
      name: 'Lint & typecheck',
      stage: 'validate',
      status: 'success',
      duration: '42s',
      runner: 'ubuntu-latest',
      log: ['Prepare runner', 'Install pnpm dependencies', 'Run TypeScript compiler', 'Run Buf lint', 'Process completed with exit code 0'],
    },
    {
      id: 'unit',
      name: 'Unit tests',
      stage: 'test',
      status: 'success',
      duration: '1m 18s',
      runner: 'ubuntu-latest',
      log: ['Restore Vitest cache', 'Run 541 unit tests', '541 passed', 'Upload coverage summary', 'Process completed with exit code 0'],
    },
    {
      id: 'storybook',
      name: 'Storybook',
      stage: 'test',
      status: 'success',
      duration: '2m 44s',
      runner: 'ubuntu-latest',
      log: ['Build Storybook', 'Run interaction suite', '308 stories passed', 'Run accessibility checks', 'Process completed with exit code 0'],
    },
    {
      id: 'package',
      name: 'Package',
      stage: 'package',
      status: 'success',
      duration: '31s',
      runner: 'ubuntu-latest',
      log: ['Build library entry points', 'Validate package exports', 'Check package contents', 'Process completed with exit code 0'],
    },
    {
      id: 'deploy',
      name: 'Deploy preview',
      stage: 'deploy',
      status: 'running',
      required: false,
      duration: '36s',
      runner: 'jim-runner-04',
      log: ['Download build artifact', 'Provision preview environment', 'Publish static assets', 'Waiting for health check'],
    },
  ],
  pipeline: {
    id: 2814,
    sha: '9e7f1ac',
    ref: 'feature/provider-contract',
    createdAt: '18 minutes ago',
    duration: '4m 19s',
  },
}

export function codeFileStatusLabel(status: CodeChangedFile['status']): string {
  if (status === 'added') return 'Added'
  if (status === 'deleted') return 'Deleted'
  return 'Modified'
}
