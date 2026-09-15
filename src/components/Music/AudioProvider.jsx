import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { birthdayData } from '../../data/birthdayData.js'

const MELODY = [
  [0, 0.75], [0, 0.75], [1, 1], [0, 1], [3, 1], [2, 2],
  [0, 0.75], [0, 0.75], [1, 1], [0, 1], [4, 1], [3, 2],
  [0, 0.75], [0, 0.75], [7, 1], [5, 1], [3, 1], [2, 1], [1, 2],
  [6, 0.75], [6, 0.75], [5, 1], [3, 1], [4, 1], [3, 2],
]
const SCALE = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25]
const BEAT = 0.42
export const SYNTH_LOOP = MELODY.reduce((s, [, l]) => s + l * BEAT, 0) + 0.6

// Quiet synth SFX mapped to PRD 50 names. Shared lazy context, low volume.
let sfxCtx = null
export function playSfx(kind = 'click') {
  try {
    if (!sfxCtx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return
      sfxCtx = new AC()
    }
    if (sfxCtx.state === 'suspended') sfxCtx.resume()
    const t0 = sfxCtx.currentTime
    const seq =
      {
        click: [[660, 0, 0.07]],
        tick: [[880, 0, 0.06]],
        lamp: [[392, 0, 0.12], [523, 0.08, 0.16]],
        pop: [[520, 0, 0.1], [300, 0.03, 0.1]],
        blow: [[400, 0, 0.25, 'sawtooth', 0.05]],
        bloom: [[660, 0, 0.15], [880, 0.1, 0.15], [1108, 0.2, 0.2]],
        gift: [[523, 0, 0.12], [659, 0.1, 0.12], [784, 0.2, 0.25]],
        sparkle: [[660, 0, 0.12], [880, 0.09, 0.12], [1320, 0.18, 0.18]],
        firework: [[200, 0, 0.4, 'sawtooth', 0.06], [1200, 0.05, 0.3]],
        success: [[523, 0, 0.2], [784, 0.12, 0.3]],
        heartbeat: [[58, 0, 0.18, 'sine', 0.3], [52, 0.22, 0.22, 'sine', 0.3]],
      }[kind] || [[660, 0, 0.07]]
    for (const [f, dt, dur, type = 'sine', vol = 0.1] of seq) {
      const o = sfxCtx.createOscillator()
      const g = sfxCtx.createGain()
      o.type = type
      o.frequency.value = f
      g.gain.setValueAtTime(0.0001, t0 + dt)
      g.gain.exponentialRampToValueAtTime(vol, t0 + dt + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dt + dur)
      o.connect(g).connect(sfxCtx.destination)
      o.start(t0 + dt)
      o.stop(t0 + dt + dur + 0.05)
    }
  } catch {
    /* audio unavailable */
  }
}

function playSynthMelody(ctx, master) {
  let t = ctx.currentTime + 0.1
  for (const [note, len] of MELODY) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = SCALE[note]
    const dur = len * BEAT
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.5, t + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.95)
    osc.connect(gain).connect(master)
    osc.start(t)
    osc.stop(t + dur)
    t += dur
  }
  return t
}

export function fmt(s) {
  if (!isFinite(s) || s < 0) return '0:00'
  const m = Math.floor(s / 60)
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`
}

export const AudioCtx = createContext(null)

// Global audio controller (PRD 52). Mounted once, never restarts on scene change.
export function AudioProvider({ children }) {
  const audioRef = useRef(null)
  const ctxRef = useRef(null)
  const masterRef = useRef(null)
  const analyserRef = useRef(null)
  const dataRef = useRef(null)
  const synthTimer = useRef(null)
  const synthStart = useRef(0)
  const duckRef = useRef(false)
  const [, setSynthTick] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [muted, setMutedState] = useState(() => {
    try {
      return localStorage.getItem('muted') === '1'
    } catch {
      return false
    }
  })
  const [volume, setVolumeState] = useState(() => {
    try {
      const v = Number(localStorage.getItem('volume'))
      return Number.isFinite(v) && v >= 0 && v <= 1 ? v : birthdayData.music.volume
    } catch {
      return birthdayData.music.volume
    }
  })
  const [hasFile, setHasFile] = useState(true)
  const [started, setStarted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const effVolume = (muted ? 0 : volume) * (duckRef.current ? 0.25 : 1)

  const ensureCtx = () => {
    if (ctxRef.current) return ctxRef.current
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctxRef.current = new AC()
    masterRef.current = ctxRef.current.createGain()
    masterRef.current.connect(ctxRef.current.destination)
    return ctxRef.current
  }

  const ensureAnalyser = () => {
    try {
      if (analyserRef.current || !audioRef.current) return
      const ctx = ensureCtx()
      if (!ctx) return
      const source = ctx.createMediaElementSource(audioRef.current)
      const an = ctx.createAnalyser()
      an.fftSize = 64
      an.smoothingTimeConstant = 0.75
      source.connect(an)
      an.connect(masterRef.current)
      analyserRef.current = an
      dataRef.current = new Uint8Array(an.frequencyBinCount)
    } catch {
      /* already connected or unsupported */
    }
  }

  const getLevels = useCallback(() => {
    const an = analyserRef.current
    if (!an || !dataRef.current) return null
    an.getByteFrequencyData(dataRef.current)
    const len = dataRef.current.length
    return [0, 1, 2, 3, 4, 5].map((i) => {
      const v = dataRef.current[Math.min(len - 1, Math.floor(((i + 1) * len) / 8))] || 0
      return v / 255
    })
  }, [])

  useEffect(() => {
    const a = new Audio(birthdayData.music.src)
    a.loop = true
    a.preload = 'auto'
    const onError = () => setHasFile(false)
    const onTime = () => setCurrentTime(a.currentTime)
    const onMeta = () => setDuration(a.duration || 0)
    a.addEventListener('error', onError)
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onMeta)
    audioRef.current = a
    return () => {
      a.pause()
      a.removeEventListener('error', onError)
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onMeta)
      if (synthTimer.current) clearTimeout(synthTimer.current)
      if (ctxRef.current) ctxRef.current.close().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = analyserRef.current ? 1 : effVolume
    if (masterRef.current && ctxRef.current) masterRef.current.gain.value = effVolume * 0.6
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume, muted])

  const persist = (v, m) => {
    try {
      localStorage.setItem('volume', String(v))
      localStorage.setItem('muted', m ? '1' : '0')
    } catch {
      /* private mode */
    }
  }

  const setVolume = useCallback((v) => {
    setVolumeState(v)
    persist(v, muted)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted])

  const setMuted = useCallback((m) => {
    setMutedState(m)
    persist(volume, m)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume])

  const startSynth = useCallback(() => {
    const ctx = ensureCtx()
    if (!ctx) return
    masterRef.current.gain.value = effVolume * 0.6
    if (ctx.state === 'suspended') ctx.resume()
    synthStart.current = Date.now()
    setDuration(SYNTH_LOOP)
    const loop = () => {
      const endTime = playSynthMelody(ctx, masterRef.current)
      setSynthTick((n) => n + 1)
      const ms = Math.max(500, (endTime - ctx.currentTime) * 1000 + 600)
      synthTimer.current = setTimeout(() => {
        if (audioRef.current?.dataset.mode === 'synth') loop()
      }, ms)
    }
    if (audioRef.current) audioRef.current.dataset.mode = 'synth'
    loop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isPlaying || audioRef.current?.dataset.mode !== 'synth') return
    const t = setInterval(() => {
      const el = (Date.now() - synthStart.current) / 1000
      setCurrentTime(el % SYNTH_LOOP)
    }, 500)
    return () => clearInterval(t)
  }, [isPlaying])

  const stopSynth = useCallback(() => {
    if (audioRef.current) audioRef.current.dataset.mode = ''
    if (synthTimer.current) clearTimeout(synthTimer.current)
    if (ctxRef.current) ctxRef.current.suspend().catch(() => {})
  }, [])

  const play = useCallback(async () => {
    setStarted(true)
    if (hasFile && audioRef.current) {
      try {
        audioRef.current.dataset.mode = 'file'
        await audioRef.current.play()
        ensureAnalyser()
        setIsPlaying(true)
        return true
      } catch {
        setHasFile(false)
      }
    }
    startSynth()
    setIsPlaying(true)
    return true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFile, startSynth])

  const pause = useCallback(() => {
    if (audioRef.current?.dataset.mode === 'synth') stopSynth()
    else audioRef.current?.pause()
    setIsPlaying(false)
  }, [stopSynth])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, pause, play])

  const seek = useCallback((s) => {
    if (audioRef.current?.dataset.mode === 'file' && audioRef.current) {
      audioRef.current.currentTime = s
      setCurrentTime(s)
    }
  }, [])

  const duck = useCallback((on) => {
    duckRef.current = on
    const v = (muted ? 0 : volume) * (on ? 0.25 : 1)
    if (audioRef.current && !analyserRef.current) audioRef.current.volume = v
    if (masterRef.current && ctxRef.current) masterRef.current.gain.value = v * 0.6
  }, [muted, volume])

  const value = useMemo(
    () => ({
      isPlaying, muted, volume, hasFile, started,
      currentTime, duration, progress: duration ? currentTime / duration : 0,
      play, pause, toggle, seek, duck, setMuted, setVolume, fmt, getLevels,
    }),
    [isPlaying, muted, volume, hasFile, started, currentTime, duration, play, pause, toggle, seek, duck, setMuted, setVolume, getLevels]
  )

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>
}

export function useAudio() {
  return useContext(AudioCtx)
}
