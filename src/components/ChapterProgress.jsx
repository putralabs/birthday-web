import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'

const CHAPTERS = [
  { id: 'hero', label: 'Pembuka' },
  { id: 'cake', label: 'Kue' },
  { id: 'wish', label: 'Wish' },
  { id: 'message', label: 'Pesan' },
  { id: 'memories', label: 'Kenangan' },
  { id: 'timeline', label: 'Jejak' },
  { id: 'special', label: 'Untukmu' },
  { id: 'final', label: 'Final' },
]

// Thin journey bar: overall scroll progress + current chapter name.
export default function ChapterProgress({ visible }) {
  const [current, setCurrent] = useState(0)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    if (!visible) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = CHAPTERS.findIndex((c) => c.id === e.target.id)
            if (idx !== -1) setCurrent(idx)
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    CHAPTERS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[80]" aria-hidden="true">
      <motion.div
        className="h-[3px] origin-left bg-gradient-to-r from-[#F3A8C7] via-[#B9A7FF] to-[#E8C77B]"
        style={{ scaleX: scrollYProgress }}
      />
      <p className="mt-2 text-center text-[10px] uppercase tracking-[0.3em] text-white/40">
        {CHAPTERS[current].label} · {current + 1}/{CHAPTERS.length}
      </p>
    </div>
  )
}
