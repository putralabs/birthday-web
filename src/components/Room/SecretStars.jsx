import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sparkles from '../Effects/Sparkles.jsx'
import { birthdayData } from '../../data/birthdayData.js'
import { playSfx } from '../../hooks/useAudio.js'

const SPOTS = [
  { left: '30%', top: '12%', needs: 3 },
  { left: '62%', top: '8%', needs: 1 },
  { left: '48%', top: '30%', needs: 1 },
]

// Clickable stars. Not all stars are active. First one needs 3 clicks (PRD 45, 58).
export default function SecretStars({ found, onFind, onUnlockAll }) {
  const [counts, setCounts] = useState({})
  const [burst, setBurst] = useState({})
  const [open, setOpen] = useState(null)

  const click = (i) => {
    if (found.includes(`star-${i}`)) {
      setOpen(i)
      return
    }
    const need = SPOTS[i].needs
    const c = (counts[i] || 0) + 1
    setCounts((p) => ({ ...p, [i]: c }))
    playSfx('sparkle')
    navigator.vibrate?.(25)
    if (c >= need) {
      setBurst((b) => ({ ...b, [i]: (b[i] || 0) + 1 }))
      onFind(`star-${i}`)
      setOpen(i)
      const total = found.length + 1
      if (total >= 3) setTimeout(() => onUnlockAll?.(), 700)
    }
  }

  return (
    <>
      {SPOTS.map((s, i) => (
        <div key={i} className="absolute z-10" style={{ left: s.left, top: s.top }}>
          <div className="relative">
            <Sparkles burstKey={burst[i] || 0} count={6} />
            <motion.button
              onClick={() => click(i)}
              whileHover={{ scale: 1.4 }}
              animate={found.includes(`star-${i}`) ? { scale: 1.25 } : { scale: 1 }}
              aria-label={`Bintang rahasia ${i + 1}`}
              className={`block min-h-[44px] min-w-[44px] cursor-pointer text-lg transition ${
                found.includes(`star-${i}`) ? 'text-[#E8C77B]' : 'text-white/35 hover:text-white/70'
              }`}
            >
              <span aria-hidden="true" className={found.includes(`star-${i}`) ? '' : 'animate-drift block'}>✦</span>
            </motion.button>
          </div>
        </div>
      ))}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-[38%] left-1/2 z-40 w-64 -translate-x-1/2 rounded-2xl border border-[#E8C77B]/30 bg-[#151A32]/95 p-4 text-center shadow-2xl backdrop-blur-sm"
            role="status"
          >
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#E8C77B]">
              {found.length >= 3 ? 'Special surprise unlocked' : 'One more little surprise'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              {found.length >= 3 && open === 2
                ? birthdayData.secrets.starsUnlocked
                : birthdayData.secrets.stars[open]}
            </p>
            <button
              onClick={() => setOpen(null)}
              className="mt-2 min-h-[36px] cursor-pointer text-xs uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
            >
              Tutup
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
