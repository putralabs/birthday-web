import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Sparkles from '../Effects/Sparkles.jsx'
import { birthdayData } from '../../data/birthdayData.js'
import { playSfx } from '../../hooks/useAudio.js'

// Hidden heart object: scale, heartbeat, particles, secret message (PRD 44).
export default function InteractiveHeart({ onFound, style }) {
  const [beat, setBeat] = useState(0)
  const [open, setOpen] = useState(false)

  const tap = () => {
    playSfx('success')
    navigator.vibrate?.([20, 40, 20])
    setBeat((b) => b + 1)
    setOpen(true)
    onFound?.()
  }

  return (
    <div className="absolute z-10" style={{ right: '31%', top: '34%', ...style }}>
      <div className="relative">
        <Sparkles burstKey={beat} count={6} />
        <motion.button
          onClick={tap}
          whileHover={{ scale: 1.2, opacity: 1 }}
          animate={beat ? { scale: [1, 1.45, 1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.9 }}
          key={beat}
          aria-label="Hati kecil yang tersembunyi"
          className="block min-h-[48px] min-w-[48px] cursor-pointer opacity-60 transition-opacity hover:opacity-100"
        >
          <Heart className="h-5 w-5 fill-[#F3A8C7]/80 text-[#F3A8C7]" aria-hidden="true" />
        </motion.button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute bottom-full left-1/2 z-30 mb-2 w-56 max-w-[70vw] -translate-x-1/2 rounded-2xl bg-[#FFF7EC] p-4 text-left text-[#1d2440] shadow-2xl"
              role="status"
            >
              <p className="text-[11px] uppercase tracking-[0.25em] text-[#EE8FB5]">You found this one.</p>
              <p className="mt-1 text-sm leading-relaxed text-[#1d2440]/80">{birthdayData.messages.heart}</p>
              <button
                onClick={() => setOpen(false)}
                className="mt-2 min-h-[36px] cursor-pointer text-xs uppercase tracking-[0.2em] text-[#1d2440]/50 transition hover:text-[#1d2440]"
              >
                Tutup
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
