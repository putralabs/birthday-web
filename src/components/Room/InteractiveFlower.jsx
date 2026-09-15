import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import FlowerPot from './FlowerPot.jsx'
import FlowerBloom from './FlowerBloom.jsx'
import FlowerParticles from './FlowerParticles.jsx'
import { playSfx } from '../../hooks/useAudio.js'

// Bunga utama di kamar (PRD 14-23). Sekali sentuh mekar bertahap,
// sentuh tengahnya lagi buat pesan rahasia. Fokus kamera pas pertama nemu.
export default function InteractiveFlower({ flower, actions, onDiscover, onSecret, hint, celebration, style }) {
  const [burst, setBurst] = useState(0)
  const [petalsUp, setPetalsUp] = useState(0)
  const { stage, secretFound } = flower
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  const open = stage === 'bloomed' || stage === 'full' || celebration

  const touch = () => {
    if (stage === 'bud' || stage === 'growing') {
      playSfx('bloom')
      navigator.vibrate?.(25)
      setBurst((b) => b + 1)
      actions.bloom()
      onDiscover?.()
    } else {
      playSfx('sparkle')
      navigator.vibrate?.(30)
      setPetalsUp((p) => p + 1)
      if (!secretFound) actions.unlockSecret()
      onSecret?.()
    }
  }

  return (
    <div className="absolute z-10 w-24 md:w-28" style={{ left: '7%', bottom: '30%', ...style }}>
      <div className="relative">
        <FlowerParticles burstKey={burst} gold={stage === 'full' || celebration} />
        <AnimatePresence>
          {petalsUp > 0 && (
            <motion.span
              key={petalsUp}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -90 }}
              transition={{ duration: 1.6 }}
              onAnimationComplete={() => setPetalsUp(0)}
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 text-lg text-[#E8C77B]"
            >
              ❀ ✦ ❀
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={touch}
          aria-label={stage === 'bud' || stage === 'growing' ? 'Sentuh kuncup bunga' : 'Sentuh bagian tengah bunga'}
          className={`block w-full cursor-pointer ${mobile ? 'min-h-[88px] min-w-[88px]' : 'min-h-[64px] min-w-[64px]'} ${hint ? 'hint-glow rounded-2xl' : ''}`}
        >
          <span aria-hidden="true" className="relative block w-full">
            {open && (
              <span className="animate-glow absolute left-1/2 top-2 h-16 w-16 -translate-x-1/2 rounded-full bg-[#F3A8C7]/25 blur-xl" />
            )}
            <span className="relative block w-full">
              <FlowerBloom stage={celebration ? 'full' : stage} />
            </span>
          </span>
        </button>
        <div className="-mt-4 w-full">
          <FlowerPot />
        </div>
        {open && <FallingPetals mobile={mobile} />}
      </div>
    </div>
  )
}

// Kelopak jatuh pelan di sekitar pot. Dikit aja biar ringan.
function FallingPetals({ mobile }) {
  const petals = mobile ? ['30%', '60%'] : ['20%', '45%', '70%']
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-8 block h-24 overflow-visible">
      {petals.map((left, i) => (
        <motion.span
          key={left}
          className="absolute top-0 text-xs text-[#F3A8C7]/80"
          style={{ left }}
          animate={{ y: [0, 44, 70], x: [0, 6 - i * 5, 0], opacity: [0, 0.9, 0], rotate: [0, 60, 120] }}
          transition={{ duration: 5 + i, repeat: Infinity, delay: i * 1.6, ease: 'easeInOut' }}
        >
          ❀
        </motion.span>
      ))}
    </span>
  )
}
