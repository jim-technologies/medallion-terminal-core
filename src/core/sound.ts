// Tiny WebAudio beep. No imported assets — generates a short tone at
// run time. Different severities get distinct frequencies so a trader
// can tell warn from error without looking at the screen.

const FREQ: Record<string, number> = {
  warn:  720, // mid
  error: 480, // low — more alarming
}
const DURATION_MS = 160
// Conservative default volume. A trading-floor terminal is usually loud
// enough already; we err quiet so the first beep doesn't jumpscare.
const VOLUME = 0.08

let cached: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (cached) return cached
  const W = window as typeof window & { webkitAudioContext?: typeof AudioContext }
  const Ctor = window.AudioContext || W.webkitAudioContext
  if (!Ctor) return null
  cached = new Ctor()
  return cached
}

export function playAlertBeep(severity: 'info' | 'ok' | 'warn' | 'error'): void {
  const freq = FREQ[severity]
  if (!freq) return // 'info' and 'ok' are silent — only warn/error make noise
  const audio = getCtx()
  if (!audio) return
  // Browsers suspend the context until the first user gesture. Resume
  // is a no-op once it's running.
  if (audio.state === 'suspended') audio.resume().catch(() => {})
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.value = 0
  osc.connect(gain)
  gain.connect(audio.destination)
  const t = audio.currentTime
  // Linear ramps prevent the click that a hard gate would produce.
  gain.gain.linearRampToValueAtTime(VOLUME, t + 0.02)
  gain.gain.linearRampToValueAtTime(0, t + DURATION_MS / 1000)
  osc.start(t)
  osc.stop(t + DURATION_MS / 1000 + 0.05)
}
