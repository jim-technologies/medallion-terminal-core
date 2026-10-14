import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { SourceError, type SourceErrorKind } from '../core/sourceError'
import { DesignSystemProvider } from '../foundations/DesignSystemProvider'
import { ZH_CN_MESSAGES } from '../foundations/messages-zh'
import {
  AccessDeniedState,
  NotFoundState,
  RateLimitedState,
  SessionExpiredState,
  SignedOutState,
  SourceErrorState,
  StaleState,
} from '../workbench/States'
import { SessionPortContext } from '../workbench/sessionContext'

const html = (node: React.ReactNode) => renderToStaticMarkup(node)
const withSession = (node: React.ReactNode) => html(<SessionPortContext.Provider value>{node}</SessionPortContext.Provider>)

describe('access, session and freshness states', () => {
  it('names the denied scope and keeps the request id under Details', () => {
    const denied = new SourceError('payroll:read scope required', {
      kind: 'forbidden',
      code: 'permission_denied',
      requestId: 'req_81M',
    })
    const markup = html(<AccessDeniedState resource="bucket finance" error={denied} />)
    expect(markup).toContain('data-state="access-denied"')
    expect(markup).toContain('You don’t have access')
    // The resource is the whole description: the title already says the rest.
    expect(markup).toContain('<div class="mtc-state-description">bucket finance</div>')
    expect(markup).toContain('<code>req_81M</code>')
    expect(html(<AccessDeniedState />)).toContain('Ask an owner for access.')
  })

  it('offers sign-in and session renewal only when the host can do them', () => {
    const signedOut = html(<SignedOutState />)
    expect(signedOut).not.toContain('<button')
    expect(signedOut).not.toContain('mtc-state-description')
    expect(html(<SignedOutState onSignIn={() => {}} />)).toContain('Sign in</span></button>')
    const expired = html(<SessionExpiredState onContinue={() => {}} />)
    expect(expired).toContain('Your session expired')
    expect(expired).toContain('Your work is kept.')
    expect(expired).toContain('Continue</span></button>')
  })

  it('states the wait for rate limits from the prop or the error', () => {
    expect(html(<RateLimitedState retryAfterMs={30_000} />)).toContain('Try again in 30 seconds.')
    const limited = new SourceError('slow down', { kind: 'rate_limited', retryAfterMs: 120_000 })
    expect(html(<RateLimitedState error={limited} />)).toContain('Try again in 2 minutes.')
    expect(html(<RateLimitedState />)).toContain('Wait a moment, then try again.')
  })

  it('says how old stale data is against an explicit clock', () => {
    const now = Date.UTC(2026, 8, 25, 12, 0)
    expect(html(<StaleState lastUpdated={now - 7 * 60_000} now={now} />)).toContain('Last updated 7 minutes ago.')
    expect(html(<StaleState />)).toContain('This view has not refreshed recently.')
  })

  it('names a missing object', () => {
    expect(html(<NotFoundState resource="Report Q3" />)).toContain('Report Q3 doesn’t exist or was moved.')
  })

  it('translates every state with the scope catalog', () => {
    const markup = html(
      <DesignSystemProvider locale="zh-CN" messages={ZH_CN_MESSAGES}>
        <AccessDeniedState resource="finance" />
        <SessionExpiredState onContinue={() => {}} />
        <StaleState lastUpdated={0} now={5 * 60_000} />
      </DesignSystemProvider>,
    )
    expect(markup).toContain('您没有访问权限')
    expect(markup).toContain('您的会话已过期')
    expect(markup).toContain('最后更新于5分钟前。')
  })
})

describe('SourceErrorState', () => {
  const states: [SourceErrorKind, string][] = [
    ['unauthenticated', 'data-error-kind="unauthenticated"'],
    ['forbidden', 'data-state="access-denied"'],
    ['not_found', 'data-state="not-found"'],
    ['rate_limited', 'data-state="rate-limited"'],
    ['unavailable', 'data-error-kind="unavailable"'],
    ['invalid', 'data-error-kind="invalid"'],
    ['unknown', 'data-error-kind="unknown"'],
  ]
  for (const [kind, marker] of states) {
    it(`renders ${kind} as its own state`, () => {
      const error = new SourceError('detail', { kind, requestId: 'req-1' })
      const markup = html(<SourceErrorState error={error} onRetry={() => {}} />)
      expect(markup).toContain(marker)
      expect(markup).toContain('<code>req-1</code>')
    })
  }

  it('treats a 401 as an expired session only inside a shell with a session port', () => {
    const error = new SourceError('expired', { kind: 'unauthenticated' })
    const anonymous = html(<SourceErrorState error={error} onRetry={() => {}} />)
    expect(anonymous).toContain('data-error-kind="unauthenticated"')
    expect(anonymous).toContain('Retry</span></button>')
    expect(anonymous).not.toContain('data-state="session-expired"')
    const inShell = withSession(<SourceErrorState error={error} onRetry={() => {}} />)
    expect(inShell).toContain('data-state="session-expired"')
    expect(inShell).toContain('Continue</span></button>')
  })

  it('renews an expired session through the retry action when no renewal is wired', () => {
    const error = new SourceError('expired', { kind: 'unauthenticated' })
    expect(withSession(<SourceErrorState error={error} onRetry={() => {}} />)).toContain('Continue</span></button>')
    expect(withSession(<SourceErrorState error={error} />)).not.toContain('<button')
  })

  it('lets a host message replace the default explanation of any kind', () => {
    const denied = new SourceError('scope', { kind: 'forbidden' })
    expect(html(<SourceErrorState error={denied} message="No read access to this repository." />))
      .toContain('No read access to this repository.')
    const broken = new SourceError('boom', { kind: 'unavailable' })
    expect(html(<SourceErrorState error={broken} message="The gateway didn’t answer." />))
      .toContain('The gateway didn’t answer.')
  })
})
