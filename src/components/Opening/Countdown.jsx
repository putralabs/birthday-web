import { AnimatePresence, motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import Particles from '../Effects/Particles.jsx'
import AdventTeasers from './AdventTeasers.jsx'
import { birthdayData } from '../../data/birthdayData.js'

function pad(n) {
  return String(n).padStart(2, '0')
}

// Single digit with slide + blur + fade + small scale on change (PRD 6).
function Digit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="relative inline-flex h-[1.25em] items-center justify-center overflow-hidden" role="timer" aria-label={`${value} ${label}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: 20, opacity: 0, scale: 0.92, filter: 'blur(5px)' }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ y: -20, opacity: 0, scale: 0.92, filter: 'blur(5px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl tabular-nums text-[#FFF7EC] sm:text-6xl md:text-7xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="mt-2 text-[11px] uppercase tracking-[0.3em] text-[#B9A7FF]/70">{label}</span>
    </div>
  )
}

// Dark opening: stars, glow, countdown, short message, locked room, teasers.
export default function Countdown({ timeLeft, onPreview }) {
  const { days, hours, minutes, seconds } = timeLeft

  return (
    <motion.div
      className="relative z-10 flex w-full max-w-xl flex-col items-center px-6 py-16 text-center"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.7 }}
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#B9A7FF]">
        Something special is waiting
      </p>
      <h1
        data-autofocus
        tabIndex={-1}
        className="mt-4 font-display text-5xl italic text-[#FFF7EC] focus:outline-none sm:text-6xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Indah
      </h1>

      <div className="mt-10 flex items-start justify-center gap-5 sm:gap-8">
        <Digit value={days} label="Days" />
        <Digit value={pad(hours)} label="Hours" />
        <Digit value={pad(minutes)} label="Minutes" />
        <Digit value={pad(seconds)} label="Seconds" />
      </div>

      {/* locked birthday room preview */}
      <div className="mt-10 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
        <span aria-hidden="true" className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#1d2440]">
          <Lock className="h-5 w-5 text-[#B9A7FF]" />
        </span>
        <div className="text-left">
          <p className="text-sm font-medium text-white/85">Birthday room terkunci</p>
          <p className="text-xs text-white/45">Terbuka otomatis pada {birthdayData.birthdayLabel}.</p>
        </div>
      </div>

      <button
        onClick={onPreview}
        className="mt-8 min-h-[48px] cursor-pointer rounded-full border border-white/20 px-9 py-3.5 text-sm font-semibold tracking-wide text-[#FFF7EC] transition-all duration-300 hover:scale-[1.03] hover:border-[#F3A8C7]/60 hover:shadow-[0_0_40px_rgba(243,168,199,0.3)] active:scale-95"
      >
        Preview Surprise
      </button>

      <AdventTeasers />
      <Particles variant="stars" className="opacity-60" />
    </motion.div>
  )
}
