import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Starfield from './Starfield.jsx'
import Countdown from './Countdown.jsx'
import AdventTeasers from './Opening/AdventTeasers.jsx'
import { birthdayData } from '../data/birthday.js'

const birthdayLong = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
}).format(new Date(`${birthdayData.birthday}T00:00:00+07:00`))

// Gate screen. mode before: countdown + preview. birthday/after: birthday opening.
export default function Opening({ mode, preview, onOpen, onPreview, sparkle, onStarSparkle }) {
  return (
    <motion.header
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
      style={{ background: 'radial-gradient(1200px 700px at 50% 20%, #1B2247 0%, #101426 55%, #0B0E20 100%)' }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      aria-label="Pembuka"
    >
      <Starfield interactive onStarClick={onStarSparkle} />
      <div aria-hidden="true" className="animate-glow pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#B9A7FF]/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-2/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[#F3A8C7]/10 blur-3xl" />

      {sparkle && (
        <span aria-hidden="true" className="pointer-events-none absolute z-10 text-[#E8C77B]" style={{ left: sparkle.x, top: sparkle.y }}>
          <Sparkles className="h-5 w-5 animate-ping" />
        </span>
      )}

      {mode === 'before' && !preview ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 flex flex-col items-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mb-2 max-w-[300px] text-balance text-[11px] font-medium uppercase leading-loose tracking-[0.22em] text-[#B9A7FF] sm:max-w-none sm:tracking-[0.35em]"
          >
            Something special is waiting
          </motion.p>
          <Countdown />
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.2 }}
            onClick={onPreview}
            className="mt-10 min-h-[48px] cursor-pointer rounded-full border border-white/20 px-9 py-3.5 text-sm font-semibold tracking-wide text-[#FFF7EC] transition-all duration-300 hover:scale-[1.03] hover:border-[#F3A8C7]/60 hover:shadow-[0_0_40px_rgba(243,168,199,0.3)] active:scale-95"
          >
            Preview Surprise
          </motion.button>
          <AdventTeasers />
        </motion.div>
      ) : (
        <>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative z-10 mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-[#E8C77B]"
          >
            Today is your day
          </motion.p>

          <motion.h1
            data-autofocus
            tabIndex={-1}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 font-display text-5xl leading-tight text-[#FFF7EC] focus:outline-none sm:text-6xl md:text-7xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Indah Nurul
            <span className="block">Qur&apos;ani</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="relative z-10 mt-5 max-w-sm text-sm leading-relaxed text-white/60"
          >
            {birthdayData.birthdayLabel}. Aku siapin ini buat kamu.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="relative z-10 mt-2 text-xs capitalize tracking-[0.2em] text-[#E8C77B]/80"
          >
            {birthdayLong}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.7 }}
            className="relative z-10 mt-10"
          >
            <button
              onClick={onOpen}
              className="group min-h-[48px] cursor-pointer rounded-full bg-[#FFF7EC] px-9 py-3.5 text-sm font-semibold tracking-wide text-[#101426] shadow-[0_0_40px_rgba(243,168,199,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:shadow-[0_0_60px_rgba(243,168,199,0.5)] active:scale-95"
            >
              Open Your Surprise
              <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
            <p className="mt-4 text-[11px] uppercase tracking-[0.25em] text-white/35">psst, nyalakan suaranya</p>
          </motion.div>
        </>
      )}
    </motion.header>
  )
}
