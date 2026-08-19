import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import {
  GITHUB_SHOWCASE_VIEWS,
  GitHubShowcase,
  resolveGitHubShowcaseView,
} from '../../examples/clones/github/GitHubShowcase'
import {
  GITLAB_SHOWCASE_VIEWS,
  GitLabShowcase,
  resolveGitLabShowcaseView,
} from '../../examples/clones/gitlab/GitLabShowcase'
import {
  CODE_COLLABORATION_FIXTURE,
  type CodeCollaborationData,
} from '../../examples/clones/shared/codeCollaborationModel'

describe('code collaboration showcases', () => {
  it('documents every view and safely resolves unsupported view names', () => {
    expect(GITHUB_SHOWCASE_VIEWS).toEqual(['pull-request', 'files-changed', 'actions'])
    expect(GITLAB_SHOWCASE_VIEWS).toEqual(['merge-request', 'changes', 'pipeline'])
    expect(resolveGitHubShowcaseView('actions')).toBe('actions')
    expect(resolveGitHubShowcaseView('unknown')).toBe('pull-request')
    expect(resolveGitLabShowcaseView('changes')).toBe('changes')
    expect(resolveGitLabShowcaseView()).toBe('merge-request')
  })

  it('server-renders every GitHub and GitLab view', () => {
    for (const view of GITHUB_SHOWCASE_VIEWS) {
      const html = renderToStaticMarkup(<GitHubShowcase initialView={view} />)
      expect(html, `GitHub/${view}`).toContain('data-product="github"')
      expect(html, `GitHub/${view}`).toContain(`data-view="${view}"`)
      expect(html, `GitHub/${view}`).toContain('Normalize provider adapters')
      expect(html, `GitHub/${view}`).toContain('Jim Technologies')
    }

    for (const view of GITLAB_SHOWCASE_VIEWS) {
      const html = renderToStaticMarkup(<GitLabShowcase initialView={view} />)
      expect(html, `GitLab/${view}`).toContain('data-product="gitlab"')
      expect(html, `GitLab/${view}`).toContain(`data-view="${view}"`)
      expect(html, `GitLab/${view}`).toContain('Normalize provider adapters')
      expect(html, `GitLab/${view}`).toContain('Jim Technologies')
    }
  })

  it('keeps the provider information architecture and workflow language distinct', () => {
    const github = renderToStaticMarkup(<GitHubShowcase />)
    const gitlab = renderToStaticMarkup(<GitLabShowcase />)

    expect(github).toContain('Pull requests')
    expect(github).toContain('Squash and merge')
    expect(github).toContain('Files changed')
    expect(github).not.toContain('Approval requirements met')
    expect(github).not.toContain('Collapse sidebar')

    expect(gitlab).toContain('Merge requests')
    expect(gitlab).toContain('Approval requirements met')
    expect(gitlab).toContain('Collapse sidebar')
    expect(gitlab).not.toContain('Squash and merge')
    expect(gitlab).not.toContain('Type / to search')
  })

  it('renders host-owned repository and change-request data without product coupling', () => {
    const hostData: CodeCollaborationData = {
      ...CODE_COLLABORATION_FIXTURE,
      organization: 'Northwind Research',
      organizationSlug: 'northwind-research',
      repository: 'signal-engine',
      changeRequest: {
        ...CODE_COLLABORATION_FIXTURE.changeRequest,
        number: 907,
        title: 'Ship a host-owned adapter',
        summary: 'This content came from the consuming application.',
      },
    }

    const github = renderToStaticMarkup(<GitHubShowcase data={hostData} />)
    const gitlab = renderToStaticMarkup(<GitLabShowcase data={hostData} />)

    for (const html of [github, gitlab]) {
      expect(html).toContain('Northwind Research')
      expect(html).toContain('signal-engine')
      expect(html).toContain('Ship a host-owned adapter')
      expect(html).toContain('907')
      expect(html).toContain('This content came from the consuming application.')
    }
  })

  it('includes complete review, diff, and automation projections', () => {
    const githubDiff = renderToStaticMarkup(<GitHubShowcase initialView="files-changed" />)
    const githubChecks = renderToStaticMarkup(<GitHubShowcase initialView="actions" />)
    const gitlabChanges = renderToStaticMarkup(<GitLabShowcase initialView="changes" />)
    const gitlabPipeline = renderToStaticMarkup(<GitLabShowcase initialView="pipeline" />)

    expect(githubDiff).toContain('Filter changed files')
    expect(githubDiff).toContain('providerAdapter.ts')
    expect(githubChecks).toContain('Artifacts')
    expect(githubChecks).toContain('Re-run jobs')
    expect(gitlabChanges).toContain('Compare versions')
    expect(gitlabChanges).toContain('Submit review')
    expect(gitlabPipeline).toContain('Pipeline #2814')
    expect(gitlabPipeline).toContain('Pipeline stages')
  })
})
