import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

// Kamera virtual (PRD 61). Tiap fokus atur scale, geser x/y, dan titik origin.
const PRESETS = {
  wide: { scale: 1, x: 0, y: 0, origin: '50% 50%' },
  gift: { scale: 1.4, x: -3, y: -4, origin: '84% 78%' },
  flower: { scale: 1.35, x: 4, y: -2, origin: '13.5% 54%' },
  cake: { scale: 1.45, x: 0, y: -5, origin: '50% 60%' },
  window: { scale: 1.35, x: 5, y: 3, origin: '13.5% 26%' },
  photos: { scale: 1.4, x: -4, y: 2, origin: '88% 30%' },
  wishes: { scale: 1.35, x: 3, y: -3, origin: '71% 52%' },
}

// Mobile: dunia tetap selebar layar biar semua benda kelihatan.
// Pas fokus, zoom lebih dekat ke bendanya. Origin di titik benda
// biar benda itu diam di tempat pas ngezoom.
const MOBILE_PRESETS = {
  wide: { scale: 1, origin: '50% 50%' },
  gift: { scale: 1.8, origin: '88% 70%' },
  flower: { scale: 1.8, origin: '17% 32%' },
  cake: { scale: 1.9, origin: '50% 60%' },
  window: { scale: 1.8, origin: '17% 35%' },
  photos: { scale: 1.8, origin: '89% 35%' },
  wishes: { scale: 1.8, origin: '66% 52%' },
}

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const fn = (e) => setMobile(e.matches)
    setMobile(mq.matches)
    mq.addEventListener?.('change', fn)
    return () => mq.removeEventListener?.('change', fn)
  }, [])
  return mobile
}

export default function RoomCamera({ focus, children }) {
  const reduce = useReducedMotion()
  const mobile = useIsMobile()
  const anim = reduce ? { duration: 0 } : { duration: 1, ease: [0.22, 1, 0.36, 1] }

  if (mobile) {
    const p = MOBILE_PRESETS[focus] || MOBILE_PRESETS.wide
    return (
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: p.origin }}
        initial={false}
        animate={{ scale: p.scale }}
        transition={anim}
      >
        {children}
      </motion.div>
    )
  }

  const p = PRESETS[focus] || PRESETS.wide
  return (
    <motion.div
      className="absolute inset-0"
      style={{ transformOrigin: p.origin }}
      initial={false}
      animate={{ scale: p.scale, x: `${p.x}%`, y: `${p.y}%` }}
      transition={anim}
    >
      {children}
    </motion.div>
  )
}
