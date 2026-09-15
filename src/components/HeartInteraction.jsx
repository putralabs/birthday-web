import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Reveal from './Reveal.jsx'
import { playSfx } from '../hooks/useAudio.js'

const SURPRISE_AT = 7

export default function HeartInteraction({ onBurst, onComplete }) {
  const [count, setCount] = useState(0)
  const [hearts, setHearts] = useState([])
  const done = count >= SURPRISE_AT

  const tap = () => {
    if (done) return
    const next = count + 1
    setCount(next)
    playSfx('tick')
    navigator.vibrate?.(20)
    const id = Date.now() + Math.random()
    const burst = Array.from({ length: 6 }, (_, i) => ({
      id: `${id}-${i}`,
      x: (Math.random() - 0.5) * 220,
      y: -60 - Math.random() * 140,
      s: 12 + Math.random() * 14,
    }))
    setHearts((h) => [...h.slice(-24), ...burst])
    setTimeout(() => setHearts((h) => h.filter((x) => !x.id.startsWith(String(id)))), 1200)
    if (next === SURPRISE_AT) {
      onBurst?.()
      setTimeout(() => onComplete?.(), 2200)
    }
  }

  return (
    <section id="heart" aria-label="Interaksi hati" className="mx-auto max-w-xl px-6 py-24 text-center md:py-32">
      <Reveal>
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#F3A8C7]">Tap the heart</p>
        <h2 className="mt-4 font-display text-4xl text-[#FFF7EC] md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
          Satu ketukan <span className="italic text-[#F3A8C7]">untukmu</span>
        </h2>
      </Reveal>

      <Reveal delay={0.12}>
        <div className="relative mx-auto mt-10 flex h-64 items-center justify-center">
          <AnimatePresence>
            {hearts.map((h) => (
              <motion.span
                key={h.id}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 0, x: h.x, y: h.y, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                aria-hidden="true"
                className="pointer-events-none absolute text-[#F3A8C7]"
                style={{ fontSize: h.s }}
              >
                ♥
              </motion.span>
            ))}
          </AnimatePresence>

          <motion.button
            onClick={tap}
            whileTap={{ scale: 1.18 }}
            animate={done ? { scale: [1, 1.3, 1] } : { scale: [1, 1 + Math.min(count * 0.02, 0.16), 1] }}
            transition={{ duration: 0.4 }}
            aria-label={`Ketuk hati, sudah ${count} kali`}
            className="relative flex min-h-[120px] min-w-[120px] cursor-pointer items-center justify-center rounded-full border border-[#F3A8C7]/25 bg-[#F3A8C7]/10 p-10 shadow-[0_0_60px_rgba(243,168,199,0.25)] transition hover:bg-[#F3A8C7]/15"
          >
            <Heart className="h-16 w-16 fill-[#F3A8C7] text-[#F3A8C7] md:h-20 md:w-20" aria-hidden="true" />
          </motion.button>
        </div>

        <p className="text-sm text-white/55" role="status" aria-live="polite">
          {done ? 'Itu dia, heart burst. Lanjut ya.' : `${count} ketukan, teruskan?`}
        </p>
        {!done && (
          <div aria-hidden="true" className="mx-auto mt-4 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-[#F3A8C7] to-[#B9A7FF] transition-all duration-300" style={{ width: `${(count / SURPRISE_AT) * 100}%` }} />
          </div>
        )}
      </Reveal>
    </section>
  )
}
