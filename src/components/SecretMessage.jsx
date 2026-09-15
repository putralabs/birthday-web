import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Reveal from './Reveal.jsx'
import { birthdayData } from '../data/birthday.js'
import { playSfx } from '../hooks/useAudio.js'

// Three hidden stars. Each unlocks a secret card. All three: special surprise.
const SPOTS = [
  { left: '8%', top: '18%' },
  { left: '86%', top: '34%' },
  { left: '70%', top: '78%' },
]

export default function SecretMessage({ onUnlockAll }) {
  const [found, setFound] = useState([])
  const all = found.length >= 3

  const find = (i) => {
    if (found.includes(i)) return
    playSfx('sparkle')
    navigator.vibrate?.(40)
    const next = [...found, i]
    setFound(next)
    if (next.length === 3) setTimeout(() => onUnlockAll?.(), 600)
  }

  return (
    <section aria-label="Pesan rahasia" className="relative mx-auto max-w-xl px-6 py-20 text-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {SPOTS.map((s, i) => (
          <button
            key={i}
            tabIndex={-1}
            onClick={() => find(i)}
            aria-hidden="true"
            className={`pointer-events-auto absolute h-11 w-11 cursor-pointer rounded-full transition ${
              found.includes(i) ? 'text-[#E8C77B]' : 'text-white/15 hover:text-white/40'
            }`}
            style={{ left: s.left, top: s.top }}
          >
            <span className={`block text-lg ${found.includes(i) ? '' : 'animate-drift'}`}>✦</span>
          </button>
        ))}
      </div>

      <Reveal>
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/35">
          {found.length === 0 ? 'Katanya ada bintang yang bisa diklik' : `${found.length}/3 secrets found`}
        </p>
      </Reveal>

      <div className="mt-6 space-y-4">
        <AnimatePresence>
          {found.map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-[#E8C77B]/25 bg-[#E8C77B]/5 p-5"
              role="status"
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#E8C77B]">Secret unlocked</p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{birthdayData.secrets[i].message}</p>
            </motion.div>
          ))}
        </AnimatePresence>

        {all && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-gradient-to-br from-[#F3A8C7]/20 to-[#B9A7FF]/20 p-6"
            role="status"
          >
            <p className="font-display text-xl italic text-[#FFF7EC]" style={{ fontFamily: 'var(--font-display)' }}>
              {birthdayData.secretsUnlocked}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
