import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MailOpen } from 'lucide-react'
import { birthdayData } from '../../data/birthdayData.js'
import { playSfx } from '../../hooks/useAudio.js'

// Personal letter: envelope → unfold → slow typewriter + skip (PRD 40).
export default function PersonalLetter({ onDone }) {
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const text = birthdayData.messages.letter
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!open || reduce) {
      if (open && reduce) setTyped(text.length)
      return
    }
    if (typed >= text.length) return
    const t = setTimeout(() => setTyped((n) => Math.min(text.length, n + 2)), 28)
    return () => clearTimeout(t)
  }, [open, typed, text.length, reduce])

  if (!open) {
    return (
      <div className="text-center">
        <button
          onClick={() => { playSfx('gift'); setOpen(true) }}
          aria-label="Buka surat"
          className="mx-auto block cursor-pointer rounded-2xl border border-white/10 bg-[#1d2440] px-10 py-8 transition hover:scale-[1.02] hover:border-[#F3A8C7]/40"
        >
          <MailOpen className="mx-auto h-8 w-8 text-[#F3A8C7]" aria-hidden="true" />
          <span className="mt-3 block text-[11px] uppercase tracking-[0.3em] text-white/50">Tap to open</span>
          <span className="mt-1 block font-display text-xl italic text-[#FFF7EC]" style={{ fontFamily: 'var(--font-display)' }}>For Indah</span>
        </button>
      </div>
    )
  }

  const done = typed >= text.length
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-sm bg-[#FFF7EC] p-6 text-left text-[#1d2440] shadow-xl md:p-8"
      aria-label="Surat pribadi"
      aria-live="polite"
    >
      <p className="font-display text-lg leading-relaxed md:text-xl md:leading-relaxed" style={{ fontFamily: 'var(--font-display)' }}>
        <span aria-hidden="true">{skipped ? text : text.slice(0, typed)}</span>
        <span className="sr-only">{text}</span>
        {!done && !skipped && <span aria-hidden="true" className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[#EE8FB5]" />}
      </p>
      <p className="mt-4 text-right text-sm italic text-[#1d2440]/60">{birthdayData.messages.letterSign}</p>
      <div className="mt-5 flex flex-wrap justify-end gap-3">
        {!done && !skipped && (
          <button onClick={() => setSkipped(true)} className="min-h-[44px] cursor-pointer rounded-full border border-[#1d2440]/15 px-6 py-2 text-xs uppercase tracking-[0.2em] text-[#1d2440]/60 transition hover:text-[#1d2440]">
            Skip animation
          </button>
        )}
        {(done || skipped) && (
          <button onClick={onDone} className="min-h-[48px] cursor-pointer rounded-full bg-[#1d2440] px-8 py-3 text-sm font-semibold text-white transition hover:scale-[1.03] active:scale-95">
            Lanjut ke kenangan →
          </button>
        )}
      </div>
    </motion.article>
  )
}
