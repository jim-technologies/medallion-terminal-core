import { describe, it, expect } from 'vitest'
import { resolveSelection } from '../widgets/selectHelpers'

describe('resolveSelection', () => {
  const choices = [{ value: 'gd-movies' }, { value: 'gd-books' }]

  it('falls through an EMPTY-STRING ctx to the first choice and flags sync', () => {
    // Regression: the URL serializes an unset key as `?org=` (empty
    // string). `??` kept that empty string, so ctx.org never got the org
    // and dependent sources fired with an empty param.
    expect(resolveSelection('', undefined, choices)).toEqual({
      current: 'gd-movies',
      shouldSync: true,
    })
  })

  it('falls through an undefined ctx to the first choice and flags sync', () => {
    expect(resolveSelection(undefined, undefined, choices)).toEqual({
      current: 'gd-movies',
      shouldSync: true,
    })
  })

  it('prefers an explicit default over the first choice when ctx is empty', () => {
    expect(resolveSelection('', 'gd-books', choices)).toEqual({
      current: 'gd-books',
      shouldSync: true,
    })
  })

  it('keeps a real (non-empty) ctx value and never syncs over it', () => {
    expect(resolveSelection('gd-books', undefined, choices)).toEqual({
      current: 'gd-books',
      shouldSync: false,
    })
  })

  it('does not sync an empty value when there are no choices and no default', () => {
    expect(resolveSelection('', undefined, [])).toEqual({
      current: '',
      shouldSync: false,
    })
  })
})
