import { motion } from 'framer-motion'

// Bunga rakitan SVG: tangkai, daun, kelopak luar, kelopak dalam,
// mahkota, dan putik. Mekar bertahap sesuai stage, bukan scale 0 ke 1.
const OUTER = [0, 45, 90, 135, 180, 225, 270, 315]
const INNER = [22, 82, 142, 202, 262, 322]
const SEPALS = [0, 72, 144, 216, 288]

// openness per stage: 0 kuncup rapat, 1 mekar penuh
const OPEN = { bud: 0.15, growing: 0.5, bloomed: 0.85, full: 1 }

export default function FlowerBloom({ stage = 'bud', sway = true }) {
  const open = OPEN[stage] ?? 0.15
  const warm = stage === 'full'
  const innerOpen = Math.max(0, (open - 0.35) / 0.65)

  return (
    <motion.svg
      viewBox="0 0 140 175"
      className="h-auto w-full overflow-visible"
      aria-hidden="true"
      animate={sway ? { rotate: [-1.4, 1.4, -1.4] } : { rotate: 0 }}
      transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '70px 168px' }}
    >
      <defs>
        <linearGradient id="fb-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3c6b4a" />
          <stop offset="0.5" stopColor="#5c8f68" />
          <stop offset="1" stopColor="#3c6b4a" />
        </linearGradient>
        <linearGradient id="fb-outer" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d97b9c" />
          <stop offset="0.55" stopColor="#f3a8c7" />
          <stop offset="1" stopColor="#fbd3e3" />
        </linearGradient>
        <linearGradient id="fb-inner" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e78bb0" />
          <stop offset="1" stopColor="#fde6ef" />
        </linearGradient>
        <radialGradient id="fb-center" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#fff3d6" />
          <stop offset="0.6" stopColor="#e8c77b" />
          <stop offset="1" stopColor="#c9a24d" />
        </radialGradient>
      </defs>

      {/* bayangan tanah */}
      <ellipse cx="70" cy="166" rx="20" ry="4" fill="rgba(0,0,0,0.25)" />

      {/* tangkai */}
      <motion.path
        d="M70 166 C 67 135, 74 105, 70 66"
        stroke="url(#fb-stem)"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        initial={false}
        animate={{ opacity: 1 }}
      />

      {/* daun bawah */}
      <motion.g
        initial={false}
        animate={{ rotate: stage === 'bud' ? -14 : -26, scale: stage === 'bud' ? 0.75 : 1 }}
        transition={{ duration: 1.2 }}
        style={{ transformOrigin: '68px 132px' }}
      >
        <path d="M68 132 C 50 126, 38 128, 30 140 C 42 146, 58 144, 68 132 Z" fill="#4e7d5a" />
        <path d="M66 133 C 54 132, 44 134, 34 139" stroke="#3a6146" strokeWidth="1.5" fill="none" />
      </motion.g>
      {/* daun atas */}
      <motion.g
        initial={false}
        animate={{ rotate: stage === 'bud' ? 12 : 24, scale: stage === 'bud' ? 0.75 : 1 }}
        transition={{ duration: 1.2 }}
        style={{ transformOrigin: '72px 112px' }}
      >
        <path d="M72 112 C 88 104, 100 106, 108 118 C 96 124, 80 122, 72 112 Z" fill="#557f5b" />
        <path d="M74 113 C 86 111, 96 113, 104 118" stroke="#3f6650" strokeWidth="1.5" fill="none" />
      </motion.g>

      {/* kelopak luar */}
      <g>
        {OUTER.map((a) => (
          <motion.ellipse
            key={a}
            cx="70"
            cy="34"
            rx="11"
            ry="21"
            fill="url(#fb-outer)"
            stroke="#d96c96"
            strokeWidth="1"
            initial={false}
            animate={{ rotate: a, scaleY: 0.3 + open * 0.7, opacity: 0.6 + open * 0.4 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: '70px 56px' }}
          />
        ))}
      </g>

      {/* kelopak dalam */}
      <g>
        {INNER.map((a) => (
          <motion.ellipse
            key={a}
            cx="70"
            cy="42"
            rx="7.5"
            ry="14"
            fill="url(#fb-inner)"
            stroke="#e78bb0"
            strokeWidth="0.8"
            initial={false}
            animate={{ rotate: a, scaleY: 0.25 + innerOpen * 0.75, opacity: innerOpen }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: '70px 56px' }}
          />
        ))}
      </g>

      {/* daun kelopak di bawah bunga */}
      <g>
        {SEPALS.map((a) => (
          <motion.path
            key={a}
            d="M70 58 L64 74 L76 74 Z"
            fill="#4e7d5a"
            initial={false}
            animate={{ rotate: a, scale: 0.6 + open * 0.5 }}
            transition={{ duration: 1.2 }}
            style={{ transformOrigin: '70px 58px' }}
          />
        ))}
      </g>

      {/* kuncup pembungkus, menyusut pas mekar */}
      <motion.ellipse
        cx="70"
        cy="54"
        rx="11"
        ry="14"
        fill="#c25e85"
        opacity={0.9}
        initial={false}
        animate={{ scale: 1.1 - open * 0.85, opacity: 0.9 - open * 0.75 }}
        transition={{ duration: 1.2 }}
        style={{ transformOrigin: '70px 56px' }}
      />

      {/* tengah bunga */}
      <circle cx="70" cy="54" r="8" fill="url(#fb-center)" opacity={0.4 + open * 0.6} />
      <g opacity={0.3 + open * 0.7}>
        {[
          [63, 50], [77, 50], [66, 60], [74, 60], [70, 47],
        ].map(([x, y], i) => (
          <g key={i}>
            <line x1="70" y1="54" x2={x} y2={y} stroke="#a3762a" strokeWidth="1.2" />
            <circle cx={x} cy={y} r="1.8" fill="#fff3d6" />
          </g>
        ))}
      </g>
      {warm && <circle cx="70" cy="54" r="15" fill="rgba(232,199,123,0.22)" />}
    </motion.svg>
  )
}
