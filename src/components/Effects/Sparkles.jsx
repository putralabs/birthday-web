import { motion } from 'framer-motion'

// Small reusable sparkle burst (balloons, gift, flower, secrets).
export default function Sparkles({ burstKey = 0, count = 8, colors = ['#E8C77B', '#F3A8C7', '#B9A7FF'] }) {
  if (!burstKey) return null
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / count
        return (
          <motion.span
            key={`${burstKey}-${i}`}
            initial={{ opacity: 1, x: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 0, x: Math.cos(angle) * 60, y: Math.sin(angle) * 60, scale: 1.1 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute text-base"
            style={{ color: colors[i % colors.length] }}
          >
            {i % 2 ? '♥' : '✦'}
          </motion.span>
        )
      })}
    </span>
  )
}
