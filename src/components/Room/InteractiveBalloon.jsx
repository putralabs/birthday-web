import { AnimatePresence, motion } from 'framer-motion'
import Sparkles from '../Effects/Sparkles.jsx'
import { playSfx } from '../../hooks/useAudio.js'

// Floating balloon. Click: scale, pop, particles, sound. Some hide surprises.
// stringH ties the balloon to nearby furniture (px). Di HP balon dan
// tali dikecilin dan boleh geser pakai mLeft biar tidak bertumpuk.
export default function InteractiveBalloon({ id, color, left, mLeft, top, size = 56, duration = 6, delay = 0, surprise = null, popped, onPop, hint, stringH = 32 }) {
  const pop = () => {
    if (popped) return
    playSfx('pop')
    navigator.vibrate?.(35)
    onPop(id, surprise)
  }
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  const s = mobile ? Math.round(size * 0.85) : size
  const sh = mobile ? Math.round(stringH * 0.5) : stringH

  return (
    <div className="absolute z-10" style={{ left: mobile && mLeft ? mLeft : left, top }}>
      <AnimatePresence>
        {!popped && (
          <motion.div
            exit={{ scale: 1.35, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [-3, 3, -3] }}
              transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
            >
              <button
                onClick={pop}
                aria-label={`Pecahkan balon ${id}`}
                className={`block min-h-[56px] min-w-[56px] cursor-pointer ${hint ? 'hint-glow rounded-full' : ''}`}
              >
                <span
                  aria-hidden="true"
                  className="block rounded-full shadow-lg"
                  style={{
                    width: s,
                    height: s * 1.2,
                    background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), ${color} 55%)`,
                    borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
                  }}
                />
                <span aria-hidden="true" className="mx-auto block w-[2px] bg-white/30" style={{ marginTop: -2, height: sh }} />
              </button>
            </motion.div>
            <Sparkles burstKey={0} />
          </motion.div>
        )}
      </AnimatePresence>
      {popped && (
        <span aria-hidden="true" className="block text-lg text-white/50">
          ✦
        </span>
      )}
    </div>
  )
}
