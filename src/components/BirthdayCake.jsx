import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import Candle from './Candle.jsx'
import BlowDetector from './BlowDetector.jsx'
import Reveal from './Reveal.jsx'
import { playSfx } from '../hooks/useAudio.js'

const CANDLE_COLORS = ['#F3A8C7', '#B9A7FF', '#E8C77B', '#F3A8C7', '#B9A7FF']

// Flow: unlit -> light the candles (stagger) -> blow out -> last one dims -> all out.
export default function BirthdayCake({ onAllOut, onLastCandle }) {
  const [phase, setPhase] = useState('unlit') // unlit | lighting | active | done
  const [lit, setLit] = useState([false, false, false, false, false])
  const [wobble, setWobble] = useState(0)
  const doneRef = useRef(false)
  const lastRef = useRef(false)

  const lightAll = useCallback(() => {
    if (phase !== 'unlit') return
    setPhase('lighting')
    CANDLE_COLORS.forEach((_, i) => {
      setTimeout(() => {
        playSfx('pop')
        setLit((prev) => {
          const next = [...prev]
          next[i] = true
          return next
        })
        if (i === CANDLE_COLORS.length - 1) {
          setTimeout(() => setPhase('active'), 450)
        }
      }, 350 * (i + 1))
    })
  }, [phase])

  const blow = useCallback((i) => {
    if (phase !== 'active') return
    playSfx('pop')
    navigator.vibrate?.(30)
    setLit((prev) => {
      if (!prev[i]) return prev
      const next = [...prev]
      next[i] = false
      return next
    })
  }, [phase])

  const blowOne = useCallback(() => {
    if (phase !== 'active') return
    setLit((prev) => {
      const idx = prev.findIndex(Boolean)
      if (idx === -1) return prev
      const next = [...prev]
      next[idx] = false
      return next
    })
  }, [phase])

  const remaining = lit.filter(Boolean).length

  // Final moment: one candle left, dim the music and darken the scene.
  useEffect(() => {
    if (phase === 'active' && remaining === 1 && !lastRef.current) {
      lastRef.current = true
      onLastCandle?.(true)
    }
    if (remaining !== 1 && lastRef.current && phase === 'active') {
      // stays dim until all out; no-op
    }
  }, [remaining, phase, onLastCandle])

  useEffect(() => {
    if (phase === 'active' && remaining === 0 && !doneRef.current) {
      doneRef.current = true
      setPhase('done')
      onLastCandle?.(false)
      const t = setTimeout(() => onAllOut?.(), 2000) // 2 second pause, then celebration
      return () => clearTimeout(t)
    }
  }, [remaining, phase, onAllOut, onLastCandle])

  return (
    <section id="cake" aria-label="Kue ulang tahun" className="relative mx-auto w-full max-w-3xl px-6 py-24 text-center md:py-32">
      {/* dim overlay on last candle */}
      <AnimatePresence>
        {phase === 'active' && remaining === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-10 bg-[#0B0E20]/60"
          />
        )}
      </AnimatePresence>

      <Reveal className="relative z-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#B9A7FF]">Saatnya berdoa dalam hati</p>
        <h2 className="mt-4 font-display text-4xl text-[#FFF7EC] md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
          {phase === 'unlit' || phase === 'lighting' ? (
            <>Nyalakan <span className="italic text-[#E8C77B]">lilinnya</span></>
          ) : (
            <>Tiup lilinnya <span className="italic text-[#F3A8C7]">satu per satu</span></>
          )}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/55" role="status" aria-live="polite">
          {phase === 'unlit' && 'Lilinnya masih mati. Nyalakan dulu.'}
          {phase === 'lighting' && 'Menyala satu per satu...'}
          {phase === 'active' && remaining > 1 && `Tersisa ${remaining} lilin menyala. Klik apinya.`}
          {phase === 'active' && remaining === 1 && 'Tinggal satu. Yang terakhir, yang paling berarti.'}
          {phase === 'done' && 'Semua lilin padam.'}
        </p>
      </Reveal>

      <div className="animate-cake-float relative z-20 mx-auto mt-12 w-fit select-none">
        <div className="relative z-10 flex items-end justify-center gap-1.5 sm:gap-3" role="group" aria-label="Lilin ulang tahun">
          {lit.map((isLit, i) => (
            <Candle key={i} index={i} lit={isLit} color={CANDLE_COLORS[i]} onBlow={() => blow(i)} />
          ))}
        </div>

        <div onClick={() => setWobble((w) => w + 1)} title="Klik kuenya">
          <motion.div key={wobble} animate={wobble ? { rotate: [0, -2.5, 2, -1, 0] } : {}} transition={{ duration: 0.5 }}>
            <svg viewBox="0 0 340 250" className="mx-auto -mt-1 h-auto w-[280px] cursor-pointer drop-shadow-2xl sm:w-[340px]" role="img" aria-label="Kue ulang tahun tiga lapis dengan lima lilin">
              <ellipse cx="170" cy="238" rx="130" ry="12" fill="rgba(0,0,0,0.45)" />
              <rect x="60" y="150" width="220" height="80" rx="14" fill="#FFF7EC" />
              <rect x="60" y="150" width="220" height="22" rx="11" fill="#F3A8C7" />
              <circle cx="90" cy="196" r="7" fill="#F3A8C7" />
              <circle cx="140" cy="200" r="7" fill="#B9A7FF" />
              <circle cx="190" cy="196" r="7" fill="#F3A8C7" />
              <circle cx="240" cy="200" r="7" fill="#E8C77B" />
              <rect x="95" y="88" width="150" height="62" rx="12" fill="#F6EDDD" />
              <rect x="95" y="88" width="150" height="18" rx="9" fill="#B9A7FF" />
              <circle cx="125" cy="122" r="6" fill="#F3A8C7" />
              <circle cx="170" cy="126" r="6" fill="#E8C77B" />
              <circle cx="215" cy="122" r="6" fill="#B9A7FF" />
              <rect x="125" y="34" width="90" height="54" rx="10" fill="#FFF7EC" />
              <rect x="125" y="34" width="90" height="15" rx="7" fill="#E8C77B" />
              <circle cx="170" cy="22" r="10" fill="#EE8FB5" />
              <path d="M162 14 l8 -6 8 6 -8 3z" fill="#4ADE80" />
            </svg>
          </motion.div>
        </div>
      </div>

      <Reveal delay={0.15} className="relative z-20 mt-8 flex flex-col items-center gap-4">
        {phase === 'unlit' && (
          <button
            onClick={lightAll}
            className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full bg-[#E8C77B] px-8 py-3.5 text-sm font-semibold text-[#101426] shadow-[0_0_36px_rgba(232,199,123,0.4)] transition hover:scale-[1.03] active:scale-95"
          >
            <Flame className="h-4 w-4" /> Light the candles
          </button>
        )}
        <BlowDetector active={phase === 'active'} onBlow={blowOne} />
      </Reveal>
    </section>
  )
}
