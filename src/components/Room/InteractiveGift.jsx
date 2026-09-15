import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import Sparkles from '../Effects/Sparkles.jsx'
import { birthdayData } from '../../data/birthdayData.js'
import { playSfx } from '../../hooks/useAudio.js'

// Gift box: shake, ribbon, lid, light, particles, content (PRD 26-27).
export default function InteractiveGift({ opened, onOpen, onInteract, hint, style }) {
  const [phase, setPhase] = useState('closed') // closed | shaking | open
  const [burst, setBurst] = useState(0)

  const open = () => {
    onInteract?.()
    if (phase !== 'closed') return
    playSfx('click')
    navigator.vibrate?.(20)
    setPhase('shaking')
    setTimeout(() => {
      setPhase('open')
      setBurst((b) => b + 1)
      playSfx('gift')
      navigator.vibrate?.([20, 40, 20])
      onOpen()
    }, 550)
  }

  return (
    <div className="absolute z-10 w-28 md:w-36" style={{ right: '8%', bottom: '9%', ...style }}>
      <div className="relative">
        <Sparkles burstKey={burst} count={10} />
        <motion.button
          onClick={open}
          whileHover={phase === 'closed' ? { y: -4 } : {}}
          animate={phase === 'shaking' ? { rotate: [0, -6, 6, -4, 4, 0] } : { rotate: 0 }}
          transition={{ duration: 0.55 }}
          aria-label={opened ? 'Hadiah sudah dibuka' : 'Buka kotak hadiah'}
          className={`relative block w-full cursor-pointer ${hint ? 'hint-glow rounded-2xl' : ''}`}
          aria-expanded={opened}
        >
          {/* lid */}
          <motion.span
            aria-hidden="true"
            className="absolute -top-4 left-0 right-0 mx-auto block h-6 w-[110%] rounded-md bg-[#B9A7FF]"
            style={{ marginLeft: '-5%' }}
            animate={phase === 'open' ? { y: -26, rotate: -14, opacity: 0.9 } : { y: 0, rotate: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          {/* box */}
          <span aria-hidden="true" className="relative block h-20 w-full rounded-lg bg-[#8f7fe8] shadow-xl md:h-24">
            <span className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 bg-[#F3A8C7]/80" />
            {/* ribbon bow */}
            <motion.span
              className="absolute -top-2 left-1/2 h-5 w-10 -translate-x-1/2 rounded-full border-4 border-[#F3A8C7]"
              animate={phase === 'closed' ? { rotate: [0, 4, -4, 0] } : { opacity: 0, scale: 0.4 }}
              transition={phase === 'closed' ? { duration: 3, repeat: Infinity } : { duration: 0.4 }}
            />
          </span>
          {phase === 'open' && (
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute -top-10 left-1/2 h-16 w-16 -translate-x-1/2 rounded-full bg-[#FFF1D6]/60 blur-xl"
            />
          )}
        </motion.button>

        <AnimatePresence>
          {phase === 'open' && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-full left-1/2 z-30 mb-4 w-60 max-w-[78vw] -translate-x-[72%] rounded-2xl bg-[#FFF7EC] p-5 text-left text-[#1d2440] shadow-2xl sm:w-64"
              role="dialog"
              aria-label="Isi hadiah"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setPhase('closed')
                  document.getElementById('room-gift-anchor')?.focus?.()
                }}
                aria-label="Tutup hadiah"
                className="absolute right-2 top-2 flex min-h-[36px] min-w-[36px] cursor-pointer items-center justify-center rounded-full text-[#1d2440]/50 transition hover:bg-black/5"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="font-display text-lg italic" style={{ fontFamily: 'var(--font-display)' }}>
                {birthdayData.messages.giftTitle}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#1d2440]/75">{birthdayData.messages.gift}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span id="room-gift-anchor" tabIndex={-1} className="sr-only">Kotak hadiah</span>
    </div>
  )
}
