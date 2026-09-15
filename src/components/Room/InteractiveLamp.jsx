import { useState } from 'react'
import { motion } from 'framer-motion'
import { playSfx } from '../../hooks/useAudio.js'

// Hanging lamp with pull cord. OFF | ON. Never blocks progression (PRD 12).
export default function InteractiveLamp({ on, onToggle, hint, celebrating, onParty }) {
  const [flicker, setFlicker] = useState(0)

  const toggle = () => {
    playSfx('lamp')
    navigator.vibrate?.(20)
    if (!on) setFlicker((f) => f + 1)
    if (celebrating && onToggle) onParty?.()
    onToggle()
  }

  return (
    <div className="absolute left-1/2 top-0 z-20 w-24 -translate-x-1/2 md:w-28" style={{ left: '46%' }}>
      {/* cord */}
      <div aria-hidden="true" className="mx-auto h-14 w-[2px] bg-white/20 md:h-16" />
      <button
        onClick={toggle}
        aria-label={on ? 'Matikan lampu' : 'Nyalakan lampu'}
        aria-pressed={on}
        className={`relative mx-auto block min-h-[64px] min-w-[64px] cursor-pointer ${hint ? 'hint-glow' : ''}`}
      >
        {/* pull cord */}
        <motion.span
          aria-hidden="true"
          animate={{ rotate: [0, 6, -4, 0] }}
          transition={{ duration: 0.5 }}
          key={String(on)}
          className="absolute -right-1 top-6 block h-8 w-[2px] origin-top bg-white/30"
        >
          <span className="absolute -bottom-1 -left-[3px] block h-2 w-2 rounded-full bg-[#E8C77B]/80" />
        </motion.span>
        {/* shade */}
        <span aria-hidden="true" className="relative mx-auto block h-12 w-20 md:h-14 md:w-24">
          <span className="absolute inset-x-0 top-0 mx-auto h-full w-full bg-[#2a3358]" style={{ clipPath: 'polygon(28% 0, 72% 0, 100% 100%, 0 100%)' }} />
          {on && (
            <motion.span
              key={flicker}
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 1, 0.5, 1] }}
              transition={{ duration: 0.6 }}
              className="absolute -bottom-3 left-1/2 h-10 w-16 -translate-x-1/2 rounded-full bg-[#E8C77B]/50 blur-lg"
            />
          )}
        </span>
        {/* bulb */}
        <span
          aria-hidden="true"
          className={`mx-auto -mt-1 block h-4 w-4 rounded-full transition-all duration-700 ${
            on ? 'bg-[#FFF1D6] shadow-[0_0_18px_6px_rgba(232,199,123,0.55)]' : 'bg-white/20'
          }`}
        />
      </button>
      <span className="sr-only">{on ? 'Lampu menyala' : 'Lampu mati'}</span>
    </div>
  )
}
