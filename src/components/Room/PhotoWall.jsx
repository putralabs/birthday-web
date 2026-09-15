import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { birthdayData } from '../../data/birthdayData.js'

// Photos as room decor: sway, shadow, tape, hover tilt, click to zoom (PRD 24).
export default function PhotoWall({ onZoom, onSecret, hint, style }) {
  const photos = birthdayData.memories.slice(0, 3)
  const taps = useRef({})
  const [, setTick] = useState(0)

  const click = (i) => {
    taps.current[i] = (taps.current[i] || 0) + 1
    setTick((t) => t + 1)
    if (i === 0 && taps.current[i] === 3) onSecret?.()
    else onZoom(i)
  }

  return (
    <div className="absolute z-10 w-[24%] min-w-[72px]" style={{ right: '4%', top: '11%', ...style }} role="group" aria-label="Dinding foto">
      <div className="flex flex-col gap-2">
        {photos.map((p, i) => (
          <motion.button
            key={p.image}
            onClick={() => click(i)}
            whileHover={{ rotate: 0, scale: 1.06 }}
            animate={{ rotate: [-2 + i, 2 - i, -2 + i] }}
            transition={
              { rotate: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut' } }
            }
            aria-label={`Perbesar foto: ${p.title}`}
            className={`block cursor-pointer bg-[#FFF7EC] p-1 pb-1 shadow-[0_8px_24px_rgba(0,0,0,0.45)] ${hint && i === 0 ? 'hint-glow' : ''}`}
            style={{ rotate: `${-2 + i * 2}deg` }}
          >
            <span aria-hidden="true" className="mx-auto -mt-2 mb-1 block h-3 w-10 rotate-[-4deg] bg-[#E8C77B]/60" />
            <RoomThumb image={p.image} alt={p.title} />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function RoomThumb({ image, alt }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className="flex aspect-square w-full items-center justify-center bg-gradient-to-br from-[#F3A8C7] to-[#B9A7FF]" role="img" aria-label={alt}>
        <span className="font-display text-xl italic text-white/90" style={{ fontFamily: 'var(--font-display)' }}>I</span>
      </span>
    )
  }
  return <img src={image} alt={alt} loading="lazy" onError={() => setFailed(true)} className="aspect-square w-full bg-[#1d2440] object-cover" />
}
