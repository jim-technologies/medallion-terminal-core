import { useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import {
  OperationalShowcaseIcon,
  operationalShowcaseInitials,
  type OperationalShowcaseIconName,
} from '../shared/OperationalShowcasePrimitives'
import {
  CODE_COLLABORATION_FIXTURE,
  codeFileStatusLabel,
  type CodeChangedFile,
  type CodeCollaborator,
  type CodeCollaborationData,
  type CodePipelineJob,
} from '../shared/codeCollaborationModel'
import './GitLabShowcase.css'

export const GITLAB_SHOWCASE_VIEWS = ['merge-request', 'changes', 'pipeline'] as const
export type GitLabShowcaseView = typeof GITLAB_SHOWCASE_VIEWS[number]

export const GITLAB_SHOWCASE_FIXTURE: CodeCollaborationData = {
  ...CODE_COLLABORATION_FIXTURE,
  changeRequest: {
    ...CODE_COLLABORATION_FIXTURE.changeRequest,
    number: 84,
  },
}

export interface GitLabShowcaseProps {
  data?: CodeCollaborationData
  initialView?: GitLabShowcaseView | string
  initialSelectedFile?: string
  companyName?: string
  repositoryName?: string
  userName?: string
  onViewChange?: (view: GitLabShowcaseView) => void
  onSelectFile?: (fileId: string) => void
  onToggleViewed?: (fileId: string, viewed: boolean) => void
  onSubmitComment?: (comment: string) => void
  onMerge?: () => void
  onRetryPipeline?: (pipelineId: number) => void
}

export function resolveGitLabShowcaseView(view?: string): GitLabShowcaseView {
  return GITLAB_SHOWCASE_VIEWS.includes(view as GitLabShowcaseView)
    ? view as GitLabShowcaseView
    : 'merge-request'
}

function GitLabMark() {
  return (
    <span className="gl-mark" aria-label="GitLab" role="img">
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <path fill="#e24329" d="m18 31.2 6.5-20H11.5z" />
        <path fill="#fc6d26" d="m18 31.2-12.4-9 5.9-11zM18 31.2l12.4-9-5.9-11z" />
        <path fill="#fca326" d="M5.6 22.2 3.2 14.8l8.3-3.6zM30.4 22.2l2.4-7.4-8.3-3.6z" />
        <path fill="#e24329" d="M3.2 14.8 5.7 7l5.8 4.2zM32.8 14.8 30.3 7l-5.8 4.2z" />
      </svg>
    </span>
  )
}

function Avatar({ person, name, size = 30 }: { person?: CodeCollaborator; name?: string; size?: number }) {
  const label = person?.name ?? name ?? 'User'
  return (
    <span
      className="gl-avatar"
      style={{ '--gl-avatar-color': person?.color ?? '#586069', width: size, height: size } as CSSProperties}
      title={label}
      aria-label={label}
      role="img"
    >
      {operationalShowcaseInitials(label)}
    </span>
  )
}

function IconButton({ icon, label }: { icon: OperationalShowcaseIconName; label: string }) {
  return (
    <button className="gl-icon-button" type="button" aria-label={label}>
      <OperationalShowcaseIcon name={icon} size={17} />
    </button>
  )
}

export function GitLabShowcase({
  data = GITLAB_SHOWCASE_FIXTURE,
  initialView,
  initialSelectedFile,
  companyName,
  repositoryName,
  userName = 'Jun',
  onViewChange,
  onSelectFile,
  onToggleViewed,
  onSubmitComment,
  onMerge,
  onRetryPipeline,
}: GitLabShowcaseProps) {
  const [view, setView] = useState<GitLabShowcaseView>(() => resolveGitLabShowcaseView(initialView))
  const [selectedFileId, setSelectedFileId] = useState(initialSelectedFile ?? data.files[0]?.id ?? '')
  const [selectedJobId, setSelectedJobId] = useState(data.jobs[data.jobs.length - 1]?.id ?? data.jobs[0]?.id ?? '')
  const [viewedFiles, setViewedFiles] = useState(
    () => new Set(data.files.filter(file => file.viewed).map(file => file.id)),
  )
  const [commentDraft, setCommentDraft] = useState('')
  const [submittedComments, setSubmittedComments] = useState<readonly string[]>([])

  const organization = companyName ?? data.organization
  const repository = repositoryName ?? data.repository
  const currentUser = data.changeRequest.author.name === userName
    ? data.changeRequest.author
    : { ...data.changeRequest.author, name: userName, handle: userName.toLowerCase().replace(/\s+/g, '-') }
  const selectedFile = data.files.find(file => file.id === selectedFileId) ?? data.files[0]
  const selectedJob = data.jobs.find(job => job.id === selectedJobId) ?? data.jobs[0]
  const stages = useMemo(
    () => [...new Set(data.jobs.map(job => job.stage))],
    [data.jobs],
  )

  const chooseView = (next: GitLabShowcaseView) => {
    setView(next)
    onViewChange?.(next)
  }
  const chooseFile = (file: CodeChangedFile) => {
    setSelectedFileId(file.id)
    onSelectFile?.(file.id)
  }
  const toggleViewed = (fileId: string, checked: boolean) => {
    setViewedFiles(current => {
      const next = new Set(current)
      if (checked) next.add(fileId)
      else next.delete(fileId)
      return next
    })
    onToggleViewed?.(fileId, checked)
  }
  const submitComment = (event: FormEvent) => {
    event.preventDefault()
    const comment = commentDraft.trim()
    if (!comment) return
    setSubmittedComments(current => [...current, comment])
    setCommentDraft('')
    onSubmitComment?.(comment)
  }

  return (
    <div className="gitlab-showcase" data-product="gitlab" data-view={view}>
      <header className="gl-global-header">
        <a className="gl-brand" href="#project"><GitLabMark /><strong>GitLab</strong></a>
        <nav aria-label="Global">
          <button type="button">Projects <OperationalShowcaseIcon name="chevron-down" size={12} /></button>
          <button type="button">Groups <OperationalShowcaseIcon name="chevron-down" size={12} /></button>
          <button type="button">Activity</button>
        </nav>
        <label className="gl-global-search">
          <OperationalShowcaseIcon name="search" size={15} />
          <input aria-label="Search GitLab" placeholder="Search or go to…" />
          <kbd>/</kbd>
        </label>
        <div className="gl-global-actions">
          <IconButton icon="plus" label="Create new" />
          <IconButton icon="ticket" label="Issues" />
          <IconButton icon="graph" label="Merge requests" />
          <IconButton icon="bell" label="To-do list" />
          <Avatar person={currentUser} size={29} />
        </div>
      </header>

      <div className="gl-workspace" id="project">
        <ProjectSidebar data={data} organization={organization} repository={repository} />
        <main className="gl-project-main">
          <header className="gl-project-bar">
            <div className="gl-project-identity"><span>JT</span><strong>{organization} / {repository}</strong><small>{data.visibility}</small></div>
            <div><button type="button"><OperationalShowcaseIcon name="bell" size={14} /> Notifications</button><button type="button">☆ Star <b>{data.stars}</b></button></div>
          </header>

          <div className="gl-content">
            <nav className="gl-breadcrumbs" aria-label="Breadcrumb">
              <a href="#organization">{organization}</a><span>/</span><a href="#project">{repository}</a><span>/</span><a href="#merge-requests">Merge requests</a><span>/</span><strong>!{data.changeRequest.number}</strong>
            </nav>

            <header className="gl-merge-header">
              <div><span className="gl-open-state">Open</span><h1>{data.changeRequest.title}</h1><p>Merge request <strong>!{data.changeRequest.number}</strong> · opened by <a href="#author">{data.changeRequest.author.name}</a> {data.pipeline.createdAt}</p></div>
              <div><button className="gl-secondary-button" type="button">Edit</button><button className="gl-primary-button" type="button"><OperationalShowcaseIcon name="code" size={14} /> Code <OperationalShowcaseIcon name="chevron-down" size={12} /></button></div>
            </header>

            <nav className="gl-merge-tabs" aria-label="Merge request sections">
              <MergeTab active={view === 'merge-request'} label="Overview" count={data.changeRequest.activity.length + 2} onClick={() => chooseView('merge-request')} />
              <MergeTab active={false} label="Commits" count={data.changeRequest.commits} />
              <MergeTab active={view === 'pipeline'} label="Pipelines" count={1} onClick={() => chooseView('pipeline')} />
              <MergeTab active={view === 'changes'} label="Changes" count={data.files.length} onClick={() => chooseView('changes')} />
            </nav>

            {view === 'merge-request' && (
              <GitLabOverview
                data={data}
                currentUser={currentUser}
                commentDraft={commentDraft}
                submittedComments={submittedComments}
                onCommentChange={setCommentDraft}
                onSubmitComment={submitComment}
                onMerge={onMerge}
              />
            )}
            {view === 'changes' && selectedFile && (
              <GitLabChanges
                data={data}
                selectedFile={selectedFile}
                viewedFiles={viewedFiles}
                onSelectFile={chooseFile}
                onToggleViewed={toggleViewed}
              />
            )}
            {view === 'pipeline' && selectedJob && (
              <GitLabPipeline
                data={data}
                stages={stages}
                selectedJob={selectedJob}
                onSelectJob={setSelectedJobId}
                onRetryPipeline={onRetryPipeline}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function ProjectSidebar({
  data,
  organization,
  repository,
}: {
  data: CodeCollaborationData
  organization: string
  repository: string
}) {
  const items: readonly [OperationalShowcaseIconName, string, string?][] = [
    ['home', 'Project overview'],
    ['code', 'Repository'],
    ['ticket', 'Issues', String(data.openIssues)],
    ['graph', 'Merge requests', String(data.openRequests)],
    ['timeline', 'CI/CD'],
    ['shield', 'Secure'],
    ['package', 'Deploy'],
    ['chart', 'Monitor'],
    ['inventory', 'Plan'],
    ['settings', 'Settings'],
  ]
  return (
    <aside className="gl-project-sidebar">
      <div className="gl-sidebar-project"><span>JT</span><div><strong>{repository}</strong><small>{organization}</small></div></div>
      <label><OperationalShowcaseIcon name="search" size={14} /><input aria-label="Filter project navigation" placeholder="Filter navigation" /></label>
      <nav aria-label="Project">
        {items.map(([icon, label, count]) => (
          <button className={label === 'Merge requests' ? 'is-active' : ''} type="button" key={label}>
            <OperationalShowcaseIcon name={icon} size={16} /><span>{label}</span>{count && <b>{count}</b>}{['Repository', 'CI/CD', 'Secure', 'Deploy', 'Monitor', 'Plan'].includes(label) && <OperationalShowcaseIcon name="chevron-right" size={13} />}
          </button>
        ))}
      </nav>
      <button className="gl-collapse-sidebar" type="button"><OperationalShowcaseIcon name="chevron-left" size={15} /> Collapse sidebar</button>
    </aside>
  )
}

function MergeTab({ active, label, count, onClick }: { active: boolean; label: string; count: number; onClick?: () => void }) {
  return <button className={active ? 'is-active' : ''} type="button" onClick={onClick}>{label}<span>{count}</span></button>
}

function GitLabOverview({
  data,
  currentUser,
  commentDraft,
  submittedComments,
  onCommentChange,
  onSubmitComment,
  onMerge,
}: {
  data: CodeCollaborationData
  currentUser: CodeCollaborator
  commentDraft: string
  submittedComments: readonly string[]
  onCommentChange: (value: string) => void
  onSubmitComment: (event: FormEvent) => void
  onMerge?: () => void
}) {
  const request = data.changeRequest
  return (
    <div className="gl-overview-layout">
      <section className="gl-overview-main">
        <div className="gl-gate-grid">
          <section className="gl-gate-card is-success">
            <span><OperationalShowcaseIcon name="check" size={18} /></span>
            <div><strong>Required pipeline checks passed</strong><small>Pipeline #{data.pipeline.id} · optional preview running</small></div>
            <button type="button">View pipeline</button>
          </section>
          <section className="gl-gate-card is-approved">
            <span><OperationalShowcaseIcon name="check" size={18} /></span>
            <div><strong>Approval requirements met</strong><small>2 of 2 required approvals</small></div>
            <div className="gl-avatar-stack">{request.reviewers.map(person => <Avatar key={person.id} person={person} size={24} />)}</div>
          </section>
        </div>

        <article className="gl-description-card">
          <header><div><Avatar person={request.author} size={32} /><span><strong>{request.author.name}</strong> requested to merge <code>{request.sourceBranch}</code> into <code>{request.targetBranch}</code></span></div><IconButton icon="more" label="Description actions" /></header>
          <div>
            <p>{request.summary}</p>
            <h2>Implementation</h2>
            <ul>
              <li>Define the provider-neutral contract at the host boundary.</li>
              <li>Retain extension metadata for lossless round trips.</li>
              <li>Run the same conformance fixture against every adapter.</li>
            </ul>
            <h2>Validation</h2>
            <label><input type="checkbox" checked readOnly /> Unit and conformance tests pass</label>
            <label><input type="checkbox" checked readOnly /> Storybook contract examples are updated</label>
          </div>
        </article>

        <section className="gl-activity">
          <header><h2>Activity</h2><div><button className="is-active" type="button">All activity</button><button type="button">Comments</button><button type="button">History</button></div></header>
          <div className="gl-system-note"><span><OperationalShowcaseIcon name="graph" size={15} /></span><p><strong>{request.author.name}</strong> changed the target branch from <code>develop</code> to <code>{request.targetBranch}</code></p><time>1 hour ago</time></div>
          {request.activity.map(item => (
            <article className={`gl-note is-${item.kind}`} key={item.id}>
              <Avatar person={item.actor} size={36} />
              <div>
                <header><span><strong>{item.actor.name}</strong> {item.kind === 'approval' ? 'approved this merge request' : item.kind === 'commit' ? 'pushed a commit' : 'commented'}</span><time>{item.timestamp}</time></header>
                <p>{item.body}</p>
                {item.commitSha && <a href="#commit"><code>{item.commitSha}</code> View commit</a>}
              </div>
            </article>
          ))}
          {submittedComments.map((comment, index) => (
            <article className="gl-note" key={`${comment}-${index}`}>
              <Avatar person={currentUser} size={36} />
              <div><header><span><strong>{currentUser.name}</strong> commented</span><time>just now</time></header><p>{comment}</p></div>
            </article>
          ))}
        </section>

        <section className="gl-merge-widget">
          <header><span><OperationalShowcaseIcon name="check" size={18} /></span><div><strong>Ready to merge</strong><small>Required checks passed, discussions resolved, and approvals complete.</small></div></header>
          <div className="gl-merge-method"><label><input type="checkbox" defaultChecked /> Squash commits when merge request is accepted</label><label><input type="checkbox" defaultChecked /> Delete source branch</label></div>
          <footer><button className="gl-primary-button" type="button" onClick={onMerge}>Merge</button><button className="gl-secondary-button" type="button">Merge options <OperationalShowcaseIcon name="chevron-down" size={12} /></button></footer>
        </section>

        <form className="gl-reply-box" onSubmit={onSubmitComment}>
          <div className="gl-reply-tabs"><button className="is-active" type="button">Write</button><button type="button">Preview</button><span /><IconButton icon="code" label="Insert code" /><IconButton icon="link" label="Attach file" /></div>
          <textarea aria-label="Add a comment" placeholder="Write a comment or drag your files here…" value={commentDraft} onChange={event => onCommentChange(event.target.value)} />
          <footer><span>Markdown and quick actions are supported</span><button className="gl-secondary-button" type="button">Start thread</button><button className="gl-primary-button" type="submit">Comment</button></footer>
        </form>
      </section>

      <aside className="gl-merge-sidebar" aria-label="Merge request details">
        <DetailPeople title="Assignee" people={request.assignees} />
        <DetailPeople title="Reviewers" people={request.reviewers} showStatus />
        <section><header><strong>Labels</strong><button type="button">Edit</button></header><div className="gl-labels">{request.labels.map(label => <span key={label}>{label}</span>)}</div></section>
        <section><header><strong>Milestone</strong><button type="button">Edit</button></header><a href="#milestone">Platform foundation</a><div className="gl-progress"><i /></div><small>67% complete</small></section>
        <section><header><strong>Time tracking</strong><button type="button">Edit</button></header><p>No estimate or time spent</p></section>
        <section><header><strong>Participants</strong></header><div className="gl-participants">{[request.author, ...request.reviewers].map(person => <Avatar person={person} key={person.id} size={28} />)}</div><small>3 participants</small></section>
        <section><header><strong>Linked items</strong></header><a href="#issue">{request.issueReference} · Provider abstraction</a></section>
        <section><header><strong>Notifications</strong></header><button className="gl-secondary-button" type="button"><OperationalShowcaseIcon name="bell" size={14} /> Subscribe</button></section>
        <p className="gl-reference">Reference: {data.organizationSlug}/{data.repository}!{request.number}</p>
      </aside>
    </div>
  )
}

function DetailPeople({
  title,
  people,
  showStatus = false,
}: {
  title: string
  people: readonly CodeCollaborator[]
  showStatus?: boolean
}) {
  return (
    <section>
      <header><strong>{title}</strong><button type="button">Edit</button></header>
      {people.map(person => (
        <div className="gl-person" key={person.id}><Avatar person={person} size={25} /><span><strong>{person.name}</strong><small>@{person.handle}</small></span>{showStatus && <em><OperationalShowcaseIcon name="check" size={13} /> Approved</em>}</div>
      ))}
    </section>
  )
}

function GitLabChanges({
  data,
  selectedFile,
  viewedFiles,
  onSelectFile,
  onToggleViewed,
}: {
  data: CodeCollaborationData
  selectedFile: CodeChangedFile
  viewedFiles: ReadonlySet<string>
  onSelectFile: (file: CodeChangedFile) => void
  onToggleViewed: (fileId: string, viewed: boolean) => void
}) {
  return (
    <section className="gl-changes-view" aria-label="Changes">
      <div className="gl-compare-bar">
        <div><span>Source</span><code>{data.changeRequest.sourceBranch}</code></div>
        <OperationalShowcaseIcon name="chevron-right" size={17} />
        <div><span>Target</span><code>{data.changeRequest.targetBranch}</code></div>
        <button className="gl-secondary-button" type="button">Compare versions <OperationalShowcaseIcon name="chevron-down" size={12} /></button>
      </div>
      <header className="gl-changes-summary">
        <div><h2>Changes</h2><p>{data.files.length} files · <span className="is-add">+{data.changeRequest.additions}</span> <span className="is-delete">−{data.changeRequest.deletions}</span></p></div>
        <div className="gl-review-progress"><span>{viewedFiles.size} / {data.files.length} viewed</span><i><b style={{ width: `${Math.round(viewedFiles.size / data.files.length * 100)}%` }} /></i></div>
        <button className="gl-secondary-button" type="button">Hide whitespace changes</button>
        <button className="gl-primary-button" type="button">Submit review</button>
      </header>
      <div className="gl-changes-layout">
        <aside className="gl-change-list" aria-label="Changed files">
          <header><label><OperationalShowcaseIcon name="search" size={14} /><input aria-label="Search changed files" placeholder="Search files" /></label><button type="button" aria-label="Changed file options"><OperationalShowcaseIcon name="more" size={16} /></button></header>
          {data.files.map(file => (
            <button className={file.id === selectedFile.id ? 'is-active' : ''} type="button" key={file.id} onClick={() => onSelectFile(file)} aria-label={`Open ${file.path}`}>
              <span className={`gl-file-badge is-${file.status}`}>{file.status === 'added' ? 'A' : file.status === 'deleted' ? 'D' : 'M'}</span>
              <span><strong>{file.path.slice(file.path.lastIndexOf('/') + 1)}</strong><small>{file.path.split('/').slice(0, -1).join('/')}/</small></span>
              {viewedFiles.has(file.id) && <OperationalShowcaseIcon name="check" size={14} />}
            </button>
          ))}
        </aside>
        <article className="gl-diff-card">
          <header>
            <div><span className={`gl-file-badge is-${selectedFile.status}`}>{selectedFile.status === 'added' ? 'A' : selectedFile.status === 'deleted' ? 'D' : 'M'}</span><span><strong>{selectedFile.path}</strong><small>{codeFileStatusLabel(selectedFile.status)}</small></span></div>
            <div><span className="is-add">+{selectedFile.additions}</span><span className="is-delete">−{selectedFile.deletions}</span><label><input type="checkbox" checked={viewedFiles.has(selectedFile.id)} onChange={event => onToggleViewed(selectedFile.id, event.target.checked)} /> Viewed</label><IconButton icon="more" label="File actions" /></div>
          </header>
          <div className="gl-diff-mode"><span>@@ -18,9 +18,16 @@</span><button type="button">Side-by-side</button><button className="is-active" type="button">Inline</button></div>
          <div className="gl-code-lines" role="region" aria-label={`Diff for ${selectedFile.path}`}>
            {selectedFile.lines.map((line, index) => (
              <div className={`gl-code-line is-${line.kind}`} key={`${line.content}-${index}`}>
                <span>{line.oldNumber ?? ''}</span><span>{line.newNumber ?? ''}</span>
                <button type="button" aria-label={`Comment on line ${line.newNumber ?? line.oldNumber ?? index + 1}`}><OperationalShowcaseIcon name="message" size={12} /></button>
                <code>{line.kind === 'addition' ? '+' : line.kind === 'deletion' ? '−' : ' '}{line.content || ' '}</code>
              </div>
            ))}
          </div>
          <footer><button type="button"><OperationalShowcaseIcon name="message" size={14} /> Add a comment to this file</button></footer>
        </article>
      </div>
    </section>
  )
}

function GitLabPipeline({
  data,
  stages,
  selectedJob,
  onSelectJob,
  onRetryPipeline,
}: {
  data: CodeCollaborationData
  stages: readonly string[]
  selectedJob: CodePipelineJob
  onSelectJob: (jobId: string) => void
  onRetryPipeline?: (pipelineId: number) => void
}) {
  const completed = data.jobs.filter(job => job.status === 'success').length
  return (
    <section className="gl-pipeline-view" aria-label="Pipeline details">
      <header className="gl-pipeline-header">
        <span className="gl-running-status"><OperationalShowcaseIcon name="activity" size={21} /></span>
        <div><h2>Pipeline #{data.pipeline.id}</h2><p>Triggered {data.pipeline.createdAt} by <strong>{data.changeRequest.author.name}</strong> for <code>{data.pipeline.ref}</code></p></div>
        <dl><div><dt>Status</dt><dd>Running</dd></div><div><dt>Jobs</dt><dd>{completed} / {data.jobs.length}</dd></div><div><dt>Duration</dt><dd>{data.pipeline.duration}</dd></div></dl>
        <button className="gl-secondary-button" type="button" onClick={() => onRetryPipeline?.(data.pipeline.id)}><OperationalShowcaseIcon name="refresh" size={14} /> Retry</button>
        <IconButton icon="more" label="Pipeline actions" />
      </header>

      <section className="gl-stage-graph" aria-label="Pipeline stages">
        <header><h2>Jobs</h2><div><span className="is-success">● Passed</span><span className="is-running">● Running</span><span>○ Pending</span></div></header>
        <div className="gl-stage-columns">
          {stages.map((stage, stageIndex) => (
            <section key={stage}>
              <header><strong>{stage}</strong><span>{data.jobs.filter(job => job.stage === stage).length}</span></header>
              {data.jobs.filter(job => job.stage === stage).map(job => (
                <button className={`is-${job.status} ${job.id === selectedJob.id ? 'is-selected' : ''}`} type="button" key={job.id} onClick={() => onSelectJob(job.id)}>
                  <span>{job.status === 'success' ? '✓' : job.status === 'running' ? '◌' : '○'}</span>
                  <span><strong>{job.name}</strong><small>{job.duration}{job.required === false ? ' · optional' : ''}</small></span>
                  <OperationalShowcaseIcon name="chevron-right" size={13} />
                </button>
              ))}
              {stageIndex < stages.length - 1 && <i className="gl-stage-connector" />}
            </section>
          ))}
        </div>
      </section>

      <div className="gl-pipeline-lower">
        <section className="gl-jobs-table">
          <header><h2>Pipeline jobs</h2><label><OperationalShowcaseIcon name="filter" size={14} /><input aria-label="Filter pipeline jobs" placeholder="Filter jobs" /></label></header>
          <div className="gl-job-table-head"><span>Status</span><span>Job</span><span>Stage</span><span>Runner</span><span>Duration</span></div>
          {data.jobs.map(job => (
            <button className={job.id === selectedJob.id ? 'is-active' : ''} type="button" key={job.id} onClick={() => onSelectJob(job.id)}>
              <span className={`gl-job-status is-${job.status}`}>{job.status === 'success' ? 'Passed' : job.status === 'running' ? 'Running' : job.status}</span>
              <strong>{job.name}</strong><span>{job.stage}</span><code>{job.runner}</code><time>{job.duration}</time>
            </button>
          ))}
        </section>

        <aside className="gl-job-drawer">
          <header><div><span className={`gl-job-orb is-${selectedJob.status}`}>{selectedJob.status === 'success' ? '✓' : '◌'}</span><span><h2>{selectedJob.name}</h2><p>{selectedJob.stage} · {selectedJob.runner}</p></span></div><IconButton icon="more" label="Job actions" /></header>
          <ol>
            {selectedJob.log.map((line, index) => <li key={line}><span>{index + 1}</span><code>{line}</code></li>)}
          </ol>
          <footer><span><OperationalShowcaseIcon name="clock" size={14} /> {selectedJob.duration}</span><button className="gl-secondary-button" type="button"><OperationalShowcaseIcon name="download" size={14} /> Download log</button></footer>
        </aside>
      </div>
    </section>
  )
}
