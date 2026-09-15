import { AnimatePresence, motion } from 'framer-motion'

// Petal + sparkle burst when the flower blooms. Counts toward particle budget.
export default function FlowerParticles({ burstKey = 0, gold = false }) {
  const mobile = typeof window !== 'undefined' && window.innerWidth < 768
  const n = mobile ? 5 : 9
  return (
    <AnimatePresence>
      {burstKey > 0 && (
        <span key={burstKey} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-6 flex items-center justify-center">
          {Array.from({ length: n }).map((_, i) => {
            const angle = -Math.PI / 2 + ((i - (n - 1) / 2) * Math.PI) / (n * 0.9)
            return (
              <motion.span
                key={i}
                initial={{ opacity: 1, x: 0, y: 0, scale: 0.6, rotate: 0 }}
                animate={{ opacity: 0, x: Math.cos(angle) * 70, y: Math.sin(angle) * 70, scale: 1, rotate: 120 }}
                transition={{ duration: 1.4, ease: 'easeOut' }}
                className="absolute text-sm"
                style={{ color: gold ? '#E8C77B' : '#F3A8C7' }}
              >
                {i % 2 ? '✦' : '❀'}
              </motion.span>
            )
          })}
        </span>
      )}
    </AnimatePresence>
  )
}
