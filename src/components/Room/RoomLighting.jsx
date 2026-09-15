import { AnimatePresence, motion } from 'framer-motion'
import Particles from '../Effects/Particles.jsx'

// Lighting states: dark | warm | celebration | final (PRD 29).
export default function RoomLighting({ lighting, lampOn }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      {/* base dark veil */}
      <AnimatePresence>
        {lighting === 'dark' && (
          <motion.div
            key="dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-[#070a18]/65"
          />
        )}
      </AnimatePresence>

      {/* warm lamp glow. Cuma nyala kalau lampunya nyala */}
      <AnimatePresence>
        {lampOn && (
          <motion.div
            key="warm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="absolute inset-0"
            style={{ background: 'radial-gradient(600px 380px at 46% 22%, rgba(232,199,123,0.22), transparent 65%)' }}
          />
        )}
      </AnimatePresence>

      {/* celebration tint */}
      <AnimatePresence>
        {(lighting === 'celebration' || lighting === 'final') && (
          <motion.div
            key="party"
            initial={{ opacity: 0 }}
            animate={{ opacity: lighting === 'final' ? 0.9 : 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="absolute inset-0"
            style={{ background: 'radial-gradient(700px 420px at 50% 60%, rgba(243,168,199,0.14), rgba(185,167,255,0.08) 55%, transparent 75%)' }}
          />
        )}
      </AnimatePresence>

      {/* dust in lamplight */}
      {lampOn && <Particles variant="dust" density={0.7} />}
    </div>
  )
}
