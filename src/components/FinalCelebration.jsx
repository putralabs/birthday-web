import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import Starfield from './Starfield.jsx'
import Reveal from './Reveal.jsx'
import { birthdayData } from '../data/birthday.js'

// Sequenced finale: bg -> stars -> cake -> candles -> name -> sparkles -> fireworks+confetti.
export default function FinalCelebration({ onReplay, onCelebrate, onCakeClick }) {
  const [stage, setStage] = useState(0)
  const [wishCount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishStars') || '[]').length
    } catch {
      return 0
    }
  })
  const ref = useRef(null)
  const fired = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || fired.current) return
        fired.current = true
        ;[1, 2, 3, 4].forEach((s, i) => {
          setTimeout(() => {
            setStage(s)
            if (s === 4) onCelebrate?.()
          }, 700 * (i + 1))
        })
        obs.disconnect()
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [onCelebrate])

  return (
    <section ref={ref} id="final" aria-label="Final celebration" className="relative overflow-hidden px-6 py-28 text-center md:py-40">
      <Starfield density={1.2} />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full bg-[#F3A8C7]/10 blur-3xl" />

      <div className="relative">
        {stage >= 1 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 60, damping: 16 }}
            className="mx-auto w-fit"
          >
            <button onClick={onCakeClick} aria-label="Kue final, klik untuk kejutan" className="cursor-pointer">
              <svg viewBox="0 0 200 170" className="animate-cake-float mx-auto h-auto w-[200px]" aria-hidden="true">
                <ellipse cx="100" cy="160" rx="80" ry="8" fill="rgba(0,0,0,0.45)" />
                <rect x="35" y="105" width="130" height="50" rx="10" fill="#FFF7EC" />
                <rect x="35" y="105" width="130" height="14" rx="7" fill="#F3A8C7" />
                <rect x="55" y="65" width="90" height="40" rx="8" fill="#F6EDDD" />
                <rect x="55" y="65" width="90" height="12" rx="6" fill="#B9A7FF" />
                <rect x="94" y="30" width="12" height="36" rx="3" fill="#E8C77B" />
                {stage >= 2 && (
                  <>
                    <motion.ellipse
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
                      className="animate-flicker"
                      cx="100"
                      cy="20"
                      rx="6"
                      ry="10"
                      fill="#FFF3C4"
                      style={{ transformOrigin: '100px 30px' }}
                    />
                    <motion.ellipse
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="animate-glow"
                      cx="100"
                      cy="22"
                      rx="18"
                      ry="20"
                      fill="rgba(232,199,123,0.25)"
                    />
                  </>
                )}
              </svg>
            </button>
          </motion.div>
        )}

        {stage >= 3 && (
          <Reveal>
            <h2 className="mt-8 font-display text-4xl text-[#FFF7EC] md:text-6xl" style={{ fontFamily: 'var(--font-display)' }}>
              {birthdayData.finalTitle}
            </h2>
            <p className="mt-4 text-sm uppercase tracking-[0.3em] text-[#E8C77B]">{birthdayData.finalSubtitle}</p>
          </Reveal>
        )}

        {stage >= 4 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div aria-hidden="true" className="pointer-events-none relative mx-auto h-10 w-64">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-[#F3A8C7]/70"
                  style={{ left: `${10 + i * 18}%` }}
                  animate={{ y: [10, -24, 10], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.5 }}
                >
                  ♥
                </motion.span>
              ))}
            </div>
            <button
              onClick={onReplay}
              className="relative z-10 mt-6 inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full bg-[#FFF7EC] px-9 py-3.5 text-sm font-semibold text-[#101426] shadow-[0_0_40px_rgba(185,167,255,0.35)] transition hover:scale-[1.03] active:scale-95"
            >
              <RotateCcw className="h-4 w-4" /> Replay
            </button>
            <div className="relative z-10 mt-4">
              <a
                href={birthdayData.reply.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-full border border-[#F3A8C7]/40 px-7 py-2.5 text-xs uppercase tracking-[0.25em] text-[#F3A8C7] transition hover:bg-[#F3A8C7]/10"
              >
                {birthdayData.reply.label}
              </a>
            </div>
            {wishCount > 0 && (
              <p className="relative z-10 mt-5 text-xs text-[#E8C77B]/80" role="status">
                <span aria-hidden="true">{'✦ '.repeat(Math.min(wishCount, 8))}</span>
                {wishCount} wish darimu tersimpan di langit malam ini.
              </p>
            )}
            <p className="relative z-10 mt-8 text-[11px] uppercase tracking-[0.3em] text-white/30">
              dibuat khusus untuk {birthdayData.shortName}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
