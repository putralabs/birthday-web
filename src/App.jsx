import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Opening from './components/Opening.jsx'
import Envelope from './components/Envelope.jsx'
import MusicPlayer from './components/Music/MusicPlayer.jsx'
import { AudioProvider, playSfx, useAudio } from './components/Music/AudioProvider.jsx'
import BirthdayRoom from './components/Room/BirthdayRoom.jsx'
import Confetti from './components/Celebration/Confetti.jsx'
import Fireworks from './components/Celebration/Fireworks.jsx'
import CustomCursor from './components/CustomCursor.jsx'
import { useBirthdayMode } from './hooks/useBirthdayMode.js'
import { useBirthdayState } from './hooks/useBirthdayState.js'
import { useFlowerState } from './hooks/useFlowerState.js'
import { birthdayData } from './data/birthdayData.js'

const FOCUS_DOTS = [
  ['wide', 'Room'],
  ['gift', 'Gift'],
  ['flower', 'Flower'],
  ['wishes', 'Wishes'],
  ['cake', 'Cake'],
  ['window', 'Window'],
  ['photos', 'Photos'],
]

function Experience() {
  const mode = useBirthdayMode()
  const { state, actions } = useBirthdayState()
  const { flower, flowerActions } = useFlowerState()
  const audio = useAudio()
  const [phase, setPhase] = useState('loading') // loading | gate | envelope | room
  const [preview, setPreview] = useState(false)
  const [progress, setProgress] = useState(0)
  const [sparkle, setSparkle] = useState(null)
  const confettiRef = useRef(null)
  const fireworksRef = useRef(null)
  const keys = useRef('')

  useEffect(() => {
    let done = false
    const images = birthdayData.memories.map((m) => m.image)
    let loaded = 0
    const total = images.length + 1
    const tick = () => {
      loaded += 1
      setProgress(Math.round((loaded / total) * 100))
      if (loaded >= total && !done) {
        done = true
        setTimeout(() => setPhase('gate'), 300)
      }
    }
    if (images.length === 0) tick()
    images.forEach((src) => {
      const img = new Image()
      img.onload = tick
      img.onerror = tick
      img.src = src
    })
    const fontsReady = document.fonts?.ready?.then(tick).catch(tick)
    if (!fontsReady) tick()
    const fallback = setTimeout(() => {
      if (!done) {
        done = true
        setProgress(100)
        setPhase('gate')
      }
    }, 4000)
    return () => clearTimeout(fallback)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.querySelector('[data-autofocus]')?.focus({ preventScroll: true })
      })
    })
  }, [phase])

  const enterEnvelope = useCallback((isPreview) => {
    playSfx('click')
    setPreview(isPreview)
    setPhase('envelope')
  }, [])

  const handleEnvelopeDone = useCallback(() => {
    if (!preview) {
      try {
        localStorage.setItem('birthdayVisited', 'true')
      } catch { /* private mode */ }
    }
    playSfx('sparkle')
    setPhase('room')
  }, [preview])

  const handleReplay = useCallback(() => {
    actions.reset()
    flowerActions.reset()
    setPreview(false)
    setPhase('gate')
  }, [actions, flowerActions])

  // Easter egg: type HAPPY for mini confetti
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.length !== 1) return
      keys.current = (keys.current + e.key.toUpperCase()).slice(-5)
      if (keys.current === 'HAPPY') {
        confettiRef.current?.burst(90)
        playSfx('success')
        keys.current = ''
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const inRoom = phase === 'room'
  const showPlayer = phase === 'envelope' || inRoom

  return (
    <div className="min-h-dvh bg-[#101426] text-[#FFF7EC]">
      <a href="#room" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-black">
        Lewati ke konten
      </a>

      <CustomCursor />
      <Confetti ref={confettiRef} />
      <Fireworks ref={fireworksRef} />

      {preview && inRoom && (
        <p className="fixed left-4 top-4 z-[80] rounded-full border border-[#E8C77B]/40 bg-black/50 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-[#E8C77B] backdrop-blur-sm">
          Preview Mode
        </p>
      )}

      <AnimatePresence mode="wait">
        {phase === 'loading' && (
          <motion.div
            key="loading"
            exit={{ opacity: 0 }}
            className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center"
            role="status"
            aria-label="Memuat"
          >
            <span aria-hidden="true" className="animate-glow text-2xl text-[#E8C77B]">✦</span>
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">Preparing something special...</p>
            <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Loading progress">
              <div className="h-full rounded-full bg-gradient-to-r from-[#F3A8C7] to-[#E8C77B] transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs tabular-nums text-white/35">{progress}%</p>
          </motion.div>
        )}

        {phase === 'gate' && (
          <Opening
            key="gate"
            mode={mode}
            preview={preview}
            onOpen={() => enterEnvelope(false)}
            onPreview={() => enterEnvelope(true)}
            sparkle={sparkle}
            onStarSparkle={(pos) => {
              setSparkle(pos)
              setTimeout(() => setSparkle(null), 800)
            }}
          />
        )}

        {phase === 'envelope' && (
          <motion.main
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.7 }}
            className="relative flex min-h-dvh items-center justify-center overflow-hidden py-16"
            style={{ background: 'radial-gradient(1000px 600px at 50% 40%, #1B2247 0%, #101426 60%, #0B0E20 100%)' }}
          >
            <Envelope onOpen={() => audio?.play?.()} onDone={handleEnvelopeDone} />
          </motion.main>
        )}

        {inRoom && (
          <motion.main
            key="room"
            id="room"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-dvh"
            style={{ background: 'radial-gradient(1200px 700px at 50% 20%, #1B2247 0%, #101426 55%, #0B0E20 100%)' }}
          >
            <BirthdayRoom
              state={state}
              actions={actions}
              flower={flower}
              flowerActions={flowerActions}
              audio={audio}
              confettiRef={confettiRef}
              fireworksRef={fireworksRef}
              onReplay={handleReplay}
            />
          </motion.main>
        )}
      </AnimatePresence>

      {showPlayer && audio && <MusicPlayer audio={audio} />}

      {inRoom && (
        <nav aria-label="Navigasi ruangan" className="fixed left-4 top-1/2 z-[80] hidden -translate-y-1/2 flex-col gap-3 md:flex">
          {FOCUS_DOTS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => actions.setFocus(id)}
              aria-label={`Fokus ke ${label}`}
              aria-current={state.focus === id ? 'true' : undefined}
              title={label}
              className={`block h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                state.focus === id ? 'scale-125 bg-[#F3A8C7] shadow-[0_0_12px_rgba(243,168,199,0.8)]' : 'bg-white/25 hover:bg-white/60'
              }`}
            />
          ))}
        </nav>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AudioProvider>
      <Experience />
    </AudioProvider>
  )
}
