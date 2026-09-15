import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from './Reveal.jsx'

const MAX_STARS = 8

// Optional wish jar. Browser state only, no server.
export default function WishJar() {
  const [stars, setStars] = useState(0)
  const full = stars >= MAX_STARS

  const add = () => {
    if (full) return
    setStars((s) => Math.min(MAX_STARS, s + 1))
  }

  return (
    <section aria-label="Wish jar" className="mx-auto max-w-md px-6 py-20 text-center">
      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#E8C77B]">Wish jar</p>
        <h2 className="mt-4 font-display text-3xl text-[#FFF7EC] md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
          Simpan harapan <span className="italic text-[#E8C77B]">di sini</span>
        </h2>
      </Reveal>

      <Reveal delay={0.12}>
        <div aria-hidden="true" className="relative mx-auto mt-8 h-52 w-40">
          {/* jar */}
          <div className="absolute bottom-0 left-1/2 h-40 w-36 -translate-x-1/2 rounded-b-3xl rounded-t-lg border-2 border-white/20 bg-white/5" />
          <div className="absolute left-1/2 top-8 h-4 w-28 -translate-x-1/2 rounded-full bg-[#B9A7FF]/40" />
          {/* stars inside */}
          <AnimatePresence>
            {Array.from({ length: stars }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: -70, scale: 0.4 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                className="absolute text-[#E8C77B]"
                style={{
                  left: `${18 + ((i * 37) % 64)}%`,
                  bottom: `${14 + ((i * 23) % 58)}px`,
                  fontSize: 13 + ((i * 7) % 8),
                }}
              >
                ★
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <p className="mt-4 text-sm text-white/55" role="status" aria-live="polite">
          {full ? 'Udah kesimpen semua. Doain ya.' : `${stars}/${MAX_STARS} bintang kesimpen`}
        </p>
        <button
          onClick={add}
          disabled={full}
          className="mt-4 min-h-[48px] cursor-pointer rounded-full border border-[#E8C77B]/40 px-8 py-3 text-xs uppercase tracking-[0.25em] text-[#E8C77B] transition hover:bg-[#E8C77B]/10 disabled:cursor-default disabled:opacity-40"
        >
          {full ? 'Tersimpan' : 'Make a wish'}
        </button>
      </Reveal>
    </section>
  )
}
