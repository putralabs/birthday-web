import { motion } from 'framer-motion'
import Particles from '../Effects/Particles.jsx'
import { birthdayData } from '../../data/birthdayData.js'

const birthdayLong = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Jakarta',
}).format(new Date(`${birthdayData.birthday}T00:00:00+07:00`))

// Birthday reveal: countdown becomes "Today is your day." (PRD 7).
export default function BirthdayReveal({ onOpen }) {
  return (
    <motion.header
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16 text-center"
      style={{ background: 'radial-gradient(1200px 700px at 50% 20%, #1B2247 0%, #101426 55%, #0B0E20 100%)' }}
      exit={{ opacity: 0, scale: 1.12 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      aria-label="Birthday reveal"
    >
      <Particles variant="stars" density={1.2} />
      <div aria-hidden="true" className="animate-glow pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#B9A7FF]/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-2/3 h-56 w-56 -translate-x-1/2 rounded-full bg-[#F3A8C7]/10 blur-3xl" />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="relative z-10 mb-5 text-[11px] font-medium uppercase tracking-[0.35em] text-[#E8C77B]"
      >
        Today is your day.
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
        {birthdayData.messages.hero}
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
        transition={{ duration: 0.9, delay: 1.9 }}
        className="relative z-10 mt-10"
      >
        <button
          onClick={onOpen}
          className="group min-h-[48px] cursor-pointer rounded-full bg-[#FFF7EC] px-9 py-3.5 text-sm font-semibold tracking-wide text-[#101426] shadow-[0_0_40px_rgba(243,168,199,0.35)] transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:shadow-[0_0_60px_rgba(243,168,199,0.5)] active:scale-95"
        >
          Open Your Surprise
          <span aria-hidden="true" className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
        </button>
      </motion.div>
    </motion.header>
  )
}
