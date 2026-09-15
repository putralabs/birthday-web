import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { playSfx } from '../../hooks/useAudio.js'

const WELCOME = 'Welcome to your little birthday room.'

// Cinematic envelope: appears, moves toward camera, opens with light,
// card slides out, camera zoom, then the room. (PRD 8)
export default function Envelope({ onDone }) {
  const [stage, setStage] = useState('approach') // approach | wait | opening | card | zoom
  const [typed, setTyped] = useState('')
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const t = setTimeout(() => setStage('wait'), reduced ? 200 : 1400)
    return () => clearTimeout(t)
  }, [reduced])

  useEffect(() => {
    if (stage !== 'zoom') return
    if (reduced) {
      setTyped(WELCOME)
    } else {
      let i = 0
      const t = setInterval(() => {
        i += 1
        setTyped(WELCOME.slice(0, i))
        if (i >= WELCOME.length) clearInterval(t)
      }, 55)
    }
    const done = setTimeout(onDone, reduced ? 1200 : 3400)
    return () => {
      // interval cleared on unmount via closure below
      clearTimeout(done)
    }
  }, [stage, reduced, onDone])

  const open = () => {
    if (stage !== 'wait') return
    playSfx('gift')
    navigator.vibrate?.(25)
    setStage('opening')
    setTimeout(() => setStage('card'), 1100)
    setTimeout(() => setStage('zoom'), 2600)
  }

  return (
    <motion.div
      data-autofocus
      tabIndex={-1}
      className="relative z-10 flex flex-col items-center px-6 text-center focus:outline-none"
      animate={stage === 'zoom' ? { scale: 1.3, opacity: 0 } : { scale: 1, opacity: 1 }}
      transition={{ duration: 1.1, ease: 'easeInOut' }}
      exit={{ opacity: 0 }}
    >
      <AnimatePresence>
        {(stage === 'card' || stage === 'zoom') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,241,214,0.4),transparent_60%)]"
          />
        )}
      </AnimatePresence>

      {stage === 'zoom' ? (
        <p aria-label={WELCOME} className="font-display text-2xl italic text-[#FFF7EC] sm:text-3xl" style={{ fontFamily: 'var(--font-display)' }}>
          <span aria-hidden="true">{typed}</span>
          {typed.length < WELCOME.length && (
            <span aria-hidden="true" className="ml-0.5 inline-block h-5 w-[2px] animate-pulse bg-[#E8C77B]" />
          )}
        </p>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={stage === 'wait' || stage === 'opening' || stage === 'card' ? { scale: 1.08, opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-8 text-[11px] uppercase tracking-[0.35em] text-[#B9A7FF]">
            {stage === 'approach' ? 'Sesuatu mendekat...' : stage === 'wait' ? 'Ketuk amplopnya' : 'Membuka...'}
          </p>
          <motion.button
            onClick={open}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Buka amplop digital"
            className="relative block w-72 cursor-pointer sm:w-80"
          >
            <motion.div
              animate={stage === 'wait' ? { y: 10 } : { y: -70 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-0 w-60 -translate-x-1/2 rounded-xl bg-[#FFF7EC] px-6 py-5 text-[#1d2440] shadow-xl sm:w-64"
            >
              <p className="font-display text-xl italic" style={{ fontFamily: 'var(--font-display)' }}>
                For Indah
              </p>
            </motion.div>
            <div className="relative mt-16 h-48 overflow-hidden rounded-2xl border border-white/10 bg-[#1d2440] shadow-2xl">
              <div className="absolute inset-x-0 bottom-0 top-10 bg-[#232c52]" />
              {(stage === 'opening' || stage === 'card') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,241,214,0.85),transparent_65%)]"
                />
              )}
              <p className="absolute bottom-6 left-0 right-0 text-xs uppercase tracking-[0.3em] text-white/40">
                tap to open
              </p>
            </div>
            <motion.div
              animate={stage === 'wait' || stage === 'approach' ? { rotateX: 0 } : { rotateX: 168 }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
              className="absolute left-0 right-0 top-16 h-24 bg-[#2a3358]"
            >
              <div className="mx-auto h-full w-full bg-gradient-to-b from-[#B9A7FF]/40 to-transparent" />
            </motion.div>
          </motion.button>
          {stage !== 'wait' && stage !== 'approach' && (
            <button
              onClick={onDone}
              className="mt-8 min-h-[44px] cursor-pointer rounded-full border border-white/15 px-6 py-2.5 text-xs uppercase tracking-[0.25em] text-white/60 transition hover:text-white"
            >
              Skip
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
