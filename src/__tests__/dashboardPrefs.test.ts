import { describe, expect, it } from 'vitest'
import { createPrefStore, type PrefStorage } from '../core/dashboardPrefs'

function memoryStorage(initial: Record<string, string> = {}) {
  const items = new Map(Object.entries(initial))
  const writes: Array<[string, string]> = []
  const storage: PrefStorage = {
    getItem: key => items.get(key) ?? null,
    setItem: (key, value) => {
      writes.push([key, value])
      items.set(key, value)
    },
  }
  return { storage, items, writes }
}

describe('dashboard preference store', () => {
  it('writes nothing when hydration applies the stored values', () => {
    const { storage, writes } = memoryStorage({
      'medallion-terminal:refreshIntervalMs': '5000',
      'medallion-terminal:compact': 'true',
    })
    const prefs = createPrefStore(storage)
    const refresh = prefs.read<number | null>('refreshIntervalMs', null)
    const compact = prefs.read('compact', false)
    const sound = prefs.read('soundEnabled', false)
    expect([refresh, compact, sound]).toEqual([5000, true, false])

    prefs.write('refreshIntervalMs', refresh)
    prefs.write('compact', compact)
    prefs.write('soundEnabled', sound)
    expect(writes).toEqual([])
  })

  it('writes each change once, including a change back to the hydrated value', () => {
    const { storage, items, writes } = memoryStorage({ 'medallion-terminal:compact': 'false' })
    const prefs = createPrefStore(storage)
    prefs.read('compact', false)

    prefs.write('compact', true)
    prefs.write('compact', true)
    prefs.write('compact', false)
    expect(writes).toEqual([
      ['medallion-terminal:compact', 'true'],
      ['medallion-terminal:compact', 'false'],
    ])
    expect(items.get('medallion-terminal:compact')).toBe('false')
  })

  it('replaces an unreadable stored value on the first write', () => {
    const { storage, writes } = memoryStorage({ 'medallion-terminal:soundEnabled': '{not json' })
    const prefs = createPrefStore(storage)
    expect(prefs.read('soundEnabled', false)).toBe(false)

    prefs.write('soundEnabled', false)
    expect(writes).toEqual([['medallion-terminal:soundEnabled', 'false']])
  })

  it('reads the fallback and writes nothing without storage, or when storage denies', () => {
    const absent = createPrefStore(undefined)
    expect(absent.read('compact', true)).toBe(true)
    absent.write('compact', false)

    const denying: PrefStorage = {
      getItem: () => { throw new Error('denied') },
      setItem: () => { throw new Error('denied') },
    }
    const denied = createPrefStore(denying)
    expect(denied.read('compact', true)).toBe(true)
    expect(() => denied.write('compact', false)).not.toThrow()
  })
})
