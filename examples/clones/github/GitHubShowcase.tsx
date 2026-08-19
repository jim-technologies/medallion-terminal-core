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
import './GitHubShowcase.css'

export const GITHUB_SHOWCASE_VIEWS = ['pull-request', 'files-changed', 'actions'] as const
export type GitHubShowcaseView = typeof GITHUB_SHOWCASE_VIEWS[number]

export interface GitHubShowcaseProps {
  data?: CodeCollaborationData
  initialView?: GitHubShowcaseView | string
  initialSelectedFile?: string
  companyName?: string
  repositoryName?: string
  userName?: string
  onViewChange?: (view: GitHubShowcaseView) => void
  onSelectFile?: (fileId: string) => void
  onToggleViewed?: (fileId: string, viewed: boolean) => void
  onSubmitComment?: (comment: string) => void
  onMerge?: () => void
  onRerunJob?: (jobId: string) => void
}

export function resolveGitHubShowcaseView(view?: string): GitHubShowcaseView {
  return GITHUB_SHOWCASE_VIEWS.includes(view as GitHubShowcaseView)
    ? view as GitHubShowcaseView
    : 'pull-request'
}

function Avatar({ person, name, size = 32 }: { person?: CodeCollaborator; name?: string; size?: number }) {
  const label = person?.name ?? name ?? 'User'
  return (
    <span
      className="gh-avatar"
      style={{ '--gh-avatar-color': person?.color ?? '#57606a', width: size, height: size } as CSSProperties}
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
    <button className="gh-icon-button" type="button" aria-label={label}>
      <OperationalShowcaseIcon name={icon} size={17} />
    </button>
  )
}

function GitHubMark() {
  return (
    <span className="gh-mark" aria-label="GitHub" role="img">
      <OperationalShowcaseIcon name="graph" size={19} />
    </span>
  )
}

export function GitHubShowcase({
  data = CODE_COLLABORATION_FIXTURE,
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
  onRerunJob,
}: GitHubShowcaseProps) {
  const [view, setView] = useState<GitHubShowcaseView>(() => resolveGitHubShowcaseView(initialView))
  const [selectedFileId, setSelectedFileId] = useState(initialSelectedFile ?? data.files[0]?.id ?? '')
  const [selectedJobId, setSelectedJobId] = useState(data.jobs[0]?.id ?? '')
  const [fileFilter, setFileFilter] = useState('')
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
  const filteredFiles = useMemo(() => {
    const query = fileFilter.trim().toLowerCase()
    return query ? data.files.filter(file => file.path.toLowerCase().includes(query)) : data.files
  }, [data.files, fileFilter])
  const selectedFile = filteredFiles.find(file => file.id === selectedFileId) ?? filteredFiles[0] ?? data.files[0]
  const selectedJob = data.jobs.find(job => job.id === selectedJobId) ?? data.jobs[0]

  const chooseView = (next: GitHubShowcaseView) => {
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
    <div className="github-showcase" data-product="github" data-view={view}>
      <header className="gh-global-header">
        <IconButton icon="menu" label="Open navigation" />
        <GitHubMark />
        <a className="gh-global-context" href="#repository">Dashboard</a>
        <label className="gh-global-search">
          <OperationalShowcaseIcon name="search" size={15} />
          <input aria-label="Search GitHub" placeholder="Type / to search" />
          <kbd>/</kbd>
        </label>
        <div className="gh-global-actions">
          <button className="gh-create-button" type="button"><OperationalShowcaseIcon name="plus" size={15} /> <span>Create</span></button>
          <IconButton icon="ticket" label="Issues" />
          <IconButton icon="graph" label="Pull requests" />
          <IconButton icon="inbox" label="Inbox" />
          <Avatar person={currentUser} size={29} />
        </div>
      </header>

      <section className="gh-repository-header" id="repository">
        <div className="gh-repository-title">
          <OperationalShowcaseIcon name="code" size={17} />
          <a href="#organization" title={organization}>{data.organizationSlug}</a>
          <span>/</span>
          <a href="#repository"><strong>{repository}</strong></a>
          <span className="gh-visibility">{data.visibility}</span>
        </div>
        <div className="gh-repository-actions">
          <button type="button"><OperationalShowcaseIcon name="bell" size={14} /> Notifications</button>
          <button type="button"><OperationalShowcaseIcon name="graph" size={14} /> Fork <b>{data.forks}</b></button>
          <button type="button">☆ Star <b>{data.stars}</b></button>
        </div>
      </section>

      <nav className="gh-repository-nav" aria-label="Repository">
        <button type="button"><OperationalShowcaseIcon name="code" size={16} />Code</button>
        <button type="button"><OperationalShowcaseIcon name="ticket" size={16} />Issues <span>{data.openIssues}</span></button>
        <button className="is-active" type="button"><OperationalShowcaseIcon name="graph" size={16} />Pull requests <span>{data.openRequests}</span></button>
        <button type="button"><OperationalShowcaseIcon name="play" size={16} />Actions</button>
        <button type="button"><OperationalShowcaseIcon name="layers" size={16} />Projects</button>
        <button type="button"><OperationalShowcaseIcon name="shield" size={16} />Security</button>
        <button type="button"><OperationalShowcaseIcon name="chart" size={16} />Insights</button>
      </nav>

      <main className="gh-main">
        <header className="gh-pull-header">
          <div>
            <h1>{data.changeRequest.title} <span>#{data.changeRequest.number}</span></h1>
            <p>
              <span className="gh-open-pill"><OperationalShowcaseIcon name="graph" size={15} /> Open</span>
              <strong>{data.changeRequest.author.handle}</strong> wants to merge {data.changeRequest.commits} commits into{' '}
              <code>{data.changeRequest.targetBranch}</code> from <code>{data.changeRequest.sourceBranch}</code>
            </p>
          </div>
          <button className="gh-edit-button" type="button">Edit</button>
        </header>

        <nav className="gh-pull-tabs" aria-label="Pull request sections">
          <PullTab active={view === 'pull-request'} count={data.changeRequest.activity.length + 2} icon="message" label="Conversation" onClick={() => chooseView('pull-request')} />
          <PullTab active={false} count={data.changeRequest.commits} icon="timeline" label="Commits" />
          <PullTab active={view === 'actions'} count={data.jobs.length} icon="check" label="Checks" onClick={() => chooseView('actions')} />
          <PullTab active={view === 'files-changed'} count={data.files.length} icon="document" label="Files changed" onClick={() => chooseView('files-changed')} />
        </nav>

        {view === 'pull-request' && (
          <GitHubConversation
            data={data}
            organization={organization}
            currentUser={currentUser}
            submittedComments={submittedComments}
            commentDraft={commentDraft}
            onCommentChange={setCommentDraft}
            onSubmitComment={submitComment}
            onMerge={onMerge}
          />
        )}
        {view === 'files-changed' && selectedFile && (
          <GitHubFilesChanged
            data={data}
            files={filteredFiles}
            selectedFile={selectedFile}
            fileFilter={fileFilter}
            viewedFiles={viewedFiles}
            onFilterChange={setFileFilter}
            onSelectFile={chooseFile}
            onToggleViewed={toggleViewed}
          />
        )}
        {view === 'actions' && selectedJob && (
          <GitHubChecks
            data={data}
            selectedJob={selectedJob}
            onSelectJob={setSelectedJobId}
            onRerunJob={onRerunJob}
          />
        )}
      </main>
    </div>
  )
}

function PullTab({
  active,
  count,
  icon,
  label,
  onClick,
}: {
  active: boolean
  count: number
  icon: OperationalShowcaseIconName
  label: string
  onClick?: () => void
}) {
  return (
    <button className={active ? 'is-active' : ''} type="button" onClick={onClick}>
      <OperationalShowcaseIcon name={icon} size={15} />
      {label}
      <span>{count}</span>
    </button>
  )
}

function GitHubConversation({
  data,
  organization,
  currentUser,
  submittedComments,
  commentDraft,
  onCommentChange,
  onSubmitComment,
  onMerge,
}: {
  data: CodeCollaborationData
  organization: string
  currentUser: CodeCollaborator
  submittedComments: readonly string[]
  commentDraft: string
  onCommentChange: (value: string) => void
  onSubmitComment: (event: FormEvent) => void
  onMerge?: () => void
}) {
  const request = data.changeRequest
  return (
    <div className="gh-conversation-layout">
      <section className="gh-timeline" aria-label="Pull request conversation">
        <article className="gh-comment">
          <Avatar person={request.author} size={40} />
          <div className="gh-comment-card">
            <header>
              <span><strong>{request.author.handle}</strong> commented <time>2 hours ago</time></span>
              <button type="button" aria-label="More comment actions"><OperationalShowcaseIcon name="more" size={17} /></button>
            </header>
            <div className="gh-comment-body">
              <p>{request.summary}</p>
              <h2>What changed</h2>
              <ul>
                <li>Added a canonical provider adapter interface.</li>
                <li>Covered round-trip metadata with conformance fixtures.</li>
                <li>Documented the host-owned integration boundary.</li>
              </ul>
              <label><input type="checkbox" checked readOnly /> Test every registered adapter</label>
              <label><input type="checkbox" checked readOnly /> Preserve provider metadata</label>
            </div>
          </div>
        </article>

        {request.activity.map(item => (
          item.kind === 'commit' ? (
            <div className="gh-timeline-event" key={item.id}>
              <span className="gh-event-icon"><OperationalShowcaseIcon name="code" size={14} /></span>
              <Avatar person={item.actor} size={22} />
              <p><strong>{item.actor.handle}</strong> committed <a href="#commit">{item.commitSha}</a> — {item.body}</p>
              <time>{item.timestamp}</time>
            </div>
          ) : (
            <article className={`gh-comment is-${item.kind}`} key={item.id}>
              <Avatar person={item.actor} size={40} />
              <div className="gh-comment-card">
                <header>
                  <span>
                    <strong>{item.actor.handle}</strong>
                    {item.kind === 'approval' ? ' approved these changes ' : ' reviewed '}
                    <time>{item.timestamp}</time>
                  </span>
                  {item.kind === 'approval' && <span className="gh-approved-badge"><OperationalShowcaseIcon name="check" size={13} /> Approved</span>}
                </header>
                <div className="gh-comment-body"><p>{item.body}</p></div>
              </div>
            </article>
          )
        ))}

        {submittedComments.map((comment, index) => (
          <article className="gh-comment" key={`${comment}-${index}`}>
            <Avatar person={currentUser} size={40} />
            <div className="gh-comment-card">
              <header><span><strong>{currentUser.handle}</strong> commented <time>just now</time></span></header>
              <div className="gh-comment-body"><p>{comment}</p></div>
            </div>
          </article>
        ))}

        <section className="gh-merge-card">
          <div className="gh-merge-status"><OperationalShowcaseIcon name="check" size={20} /></div>
          <div>
            <h2>This branch has no conflicts with the base branch</h2>
            <p>All required checks passed and two approving reviews are present.</p>
            <button type="button" onClick={onMerge}>Squash and merge <OperationalShowcaseIcon name="chevron-down" size={14} /></button>
          </div>
          <IconButton icon="more" label="More merge options" />
        </section>

        <form className="gh-new-comment" onSubmit={onSubmitComment}>
          <Avatar person={currentUser} size={40} />
          <div>
            <div className="gh-comment-toolbar"><button className="is-active" type="button">Write</button><button type="button">Preview</button><span /><button type="button" aria-label="Insert code"><OperationalShowcaseIcon name="code" size={15} /></button><button type="button" aria-label="Attach a file"><OperationalShowcaseIcon name="link" size={15} /></button></div>
            <textarea aria-label="Leave a comment" placeholder="Leave a comment" value={commentDraft} onChange={event => onCommentChange(event.target.value)} />
            <footer><span>Markdown is supported</span><button className="gh-secondary-button" type="button">Close pull request</button><button className="gh-primary-button" type="submit">Comment</button></footer>
          </div>
        </form>
      </section>

      <aside className="gh-pull-sidebar" aria-label="Pull request details">
        <SidebarPeople title="Reviewers" people={request.reviewers} />
        <SidebarPeople title="Assignees" people={request.assignees} />
        <section><header><strong>Labels</strong><button type="button" aria-label="Edit labels"><OperationalShowcaseIcon name="settings" size={14} /></button></header><div className="gh-labels">{request.labels.map(label => <span key={label}>{label}</span>)}</div></section>
        <section><header><strong>Projects</strong><button type="button" aria-label="Edit projects"><OperationalShowcaseIcon name="settings" size={14} /></button></header><p>{organization} launch readiness</p></section>
        <section><header><strong>Milestone</strong></header><p>Platform foundation</p><div className="gh-progress"><i /></div><small>4 of 6 issues complete</small></section>
        <section><header><strong>Development</strong></header><p>Successfully merging this pull request may close <a href="#issue">{request.issueReference}</a>.</p></section>
      </aside>
    </div>
  )
}

function SidebarPeople({ title, people }: { title: string; people: readonly CodeCollaborator[] }) {
  return (
    <section>
      <header><strong>{title}</strong><button type="button" aria-label={`Edit ${title.toLowerCase()}`}><OperationalShowcaseIcon name="settings" size={14} /></button></header>
      {people.map(person => (
        <div className="gh-person-row" key={person.id}>
          <Avatar person={person} size={22} />
          <span>{person.handle}</span>
          {person.reviewStatus === 'approved' && <span className="gh-review-check" title="Approved"><OperationalShowcaseIcon name="check" size={14} /></span>}
        </div>
      ))}
    </section>
  )
}

function GitHubFilesChanged({
  data,
  files,
  selectedFile,
  fileFilter,
  viewedFiles,
  onFilterChange,
  onSelectFile,
  onToggleViewed,
}: {
  data: CodeCollaborationData
  files: readonly CodeChangedFile[]
  selectedFile: CodeChangedFile
  fileFilter: string
  viewedFiles: ReadonlySet<string>
  onFilterChange: (value: string) => void
  onSelectFile: (file: CodeChangedFile) => void
  onToggleViewed: (fileId: string, viewed: boolean) => void
}) {
  return (
    <section className="gh-files-view" aria-label="Files changed">
      <header className="gh-files-toolbar">
        <div className="gh-diff-summary">
          <strong>{data.files.length} files changed</strong>
          <span className="is-add">+{data.changeRequest.additions}</span>
          <span className="is-delete">−{data.changeRequest.deletions}</span>
          <i><b style={{ width: `${Math.round(data.changeRequest.additions / (data.changeRequest.additions + data.changeRequest.deletions) * 100)}%` }} /></i>
        </div>
        <label><OperationalShowcaseIcon name="filter" size={14} /><input aria-label="Filter changed files" placeholder="Filter files…" value={fileFilter} onChange={event => onFilterChange(event.target.value)} /></label>
        <button className="gh-secondary-button" type="button">Changes from all commits <OperationalShowcaseIcon name="chevron-down" size={13} /></button>
        <button className="gh-primary-button" type="button">Review changes</button>
      </header>
      <div className="gh-diff-layout">
        <aside className="gh-file-tree" aria-label="Changed files">
          <header><strong>Files</strong><button type="button" aria-label="Collapse file tree"><OperationalShowcaseIcon name="chevron-left" size={15} /></button></header>
          <div className="gh-tree-folder"><OperationalShowcaseIcon name="chevron-down" size={13} /><OperationalShowcaseIcon name="code" size={14} /><strong>medallion-platform</strong></div>
          {files.length ? files.map(file => (
            <button
              className={file.id === selectedFile.id ? 'is-active' : ''}
              key={file.id}
              type="button"
              aria-label={`Open ${file.path}`}
              onClick={() => onSelectFile(file)}
            >
              <span className={`gh-file-status is-${file.status}`}>{file.status === 'added' ? 'A' : file.status === 'deleted' ? 'D' : 'M'}</span>
              <span>{file.path}</span>
              {viewedFiles.has(file.id) && <OperationalShowcaseIcon name="check" size={13} />}
            </button>
          )) : <p className="gh-empty-files">No files match this filter.</p>}
        </aside>
        <div className="gh-diff-content">
          <div className="gh-review-progress">
            <OperationalShowcaseIcon name="check" size={17} />
            <span><strong>{viewedFiles.size} of {data.files.length} files viewed</strong><small>Mark files as viewed as you complete the review.</small></span>
            <i><b style={{ width: `${data.files.length ? Math.round(viewedFiles.size / data.files.length * 100) : 0}%` }} /></i>
          </div>
          <DiffFile
            file={selectedFile}
            viewed={viewedFiles.has(selectedFile.id)}
            onToggleViewed={checked => onToggleViewed(selectedFile.id, checked)}
          />
        </div>
      </div>
    </section>
  )
}

function DiffFile({ file, viewed, onToggleViewed }: { file: CodeChangedFile; viewed: boolean; onToggleViewed: (viewed: boolean) => void }) {
  return (
    <article className="gh-diff-file">
      <header>
        <div><OperationalShowcaseIcon name="document" size={15} /><strong>{file.path}</strong><span>{codeFileStatusLabel(file.status)}</span></div>
        <div><span className="is-add">+{file.additions}</span><span className="is-delete">−{file.deletions}</span><label><input type="checkbox" checked={viewed} onChange={event => onToggleViewed(event.target.checked)} /> Viewed</label><IconButton icon="more" label="More file actions" /></div>
      </header>
      <div className="gh-hunk-header">@@ -18,9 +18,16 @@ export interface ProviderAdapter</div>
      <div className="gh-code-lines" role="region" aria-label={`Diff for ${file.path}`}>
        {file.lines.map((line, index) => (
          <div className={`gh-code-line is-${line.kind}`} key={`${line.content}-${index}`}>
            <span>{line.oldNumber ?? ''}</span>
            <span>{line.newNumber ?? ''}</span>
            <button type="button" aria-label={`Comment on line ${line.newNumber ?? line.oldNumber ?? index + 1}`}>+</button>
            <code>{line.kind === 'addition' ? '+' : line.kind === 'deletion' ? '−' : ' '}{line.content || ' '}</code>
          </div>
        ))}
      </div>
    </article>
  )
}

function GitHubChecks({
  data,
  selectedJob,
  onSelectJob,
  onRerunJob,
}: {
  data: CodeCollaborationData
  selectedJob: CodePipelineJob
  onSelectJob: (jobId: string) => void
  onRerunJob?: (jobId: string) => void
}) {
  return (
    <section className="gh-checks-view" aria-label="Checks">
      <header className="gh-checks-summary">
        <span className="gh-checks-success"><OperationalShowcaseIcon name="check" size={22} /></span>
        <div><h2>All required checks have passed</h2><p>{data.jobs.filter(job => job.status === 'success').length} successful and {data.jobs.filter(job => job.status === 'running').length} optional preview in progress</p></div>
        <button className="gh-secondary-button" type="button" onClick={() => onRerunJob?.(selectedJob.id)}><OperationalShowcaseIcon name="refresh" size={14} /> Re-run jobs <OperationalShowcaseIcon name="chevron-down" size={13} /></button>
      </header>
      <div className="gh-checks-layout">
        <aside className="gh-checks-sidebar">
          <header><strong>CI</strong><span>{data.jobs.length} jobs</span></header>
          {data.jobs.map(job => (
            <button className={job.id === selectedJob.id ? 'is-active' : ''} type="button" key={job.id} onClick={() => onSelectJob(job.id)}>
              <span className={`gh-job-icon is-${job.status}`}>{job.status === 'running' ? '◌' : '✓'}</span>
              <span><strong>{job.name}</strong><small>{job.duration} · {job.runner}{job.required === false ? ' · optional' : ''}</small></span>
            </button>
          ))}
        </aside>
        <article className="gh-job-detail">
          <header>
            <div><span className={`gh-job-icon is-${selectedJob.status}`}>{selectedJob.status === 'running' ? '◌' : '✓'}</span><span><h2>{selectedJob.name}</h2><p>{selectedJob.status === 'running' ? 'In progress' : 'Completed successfully'} in {selectedJob.duration}</p></span></div>
            <IconButton icon="more" label="Job options" />
          </header>
          <div className="gh-workflow-meta">
            <span><OperationalShowcaseIcon name="code" size={14} /> {data.pipeline.sha}</span>
            <span><OperationalShowcaseIcon name="graph" size={14} /> {data.pipeline.ref}</span>
            <span><OperationalShowcaseIcon name="clock" size={14} /> {data.pipeline.createdAt}</span>
          </div>
          <ol className="gh-job-log">
            {selectedJob.log.map((line, index) => (
              <li key={line}><span>{String(index + 1).padStart(2, '0')}</span><time>00:0{index + 1}</time><code>{line}</code>{index < selectedJob.log.length - 1 && <OperationalShowcaseIcon name="check" size={14} />}</li>
            ))}
          </ol>
          <footer className="gh-artifacts">
            <div><OperationalShowcaseIcon name="package" size={18} /><span><strong>Artifacts</strong><small>storybook-static · 18.4 MB · expires in 7 days</small></span></div>
            <button className="gh-secondary-button" type="button"><OperationalShowcaseIcon name="download" size={14} /> Download</button>
          </footer>
        </article>
      </div>
    </section>
  )
}
