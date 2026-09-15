import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Reveal from '../Reveal.jsx'
import { MemoryImage } from './MemoryGallery.jsx'
import { birthdayData } from '../../data/birthday.js'

// Small slow carousel. Drag, swipe, prev, next. Gentle autoplay, pauses on touch.
export default function PhotoCarousel() {
  const photos = birthdayData.memories.slice(0, 4)
  const [[index, dir], setIndex] = useState([0, 1])
  const [paused, setPaused] = useState(false)

  const go = (d) => setIndex(([i]) => [(i + d + photos.length) % photos.length, d])

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => go(1), 6000)
    return () => clearInterval(t)
  }, [paused, photos.length])

  return (
    <section aria-label="Carousel foto" className="mx-auto w-full max-w-xl px-6 pb-8">
      <Reveal className="text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Geser perlahan</p>
      </Reveal>
      <Reveal delay={0.1}>
        <div
          className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#1d2440]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
        >
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -80 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1)
                else if (info.offset.x > 60) go(-1)
              }}
              className="[&>img]:aspect-[16/10] [&>div]:aspect-[16/10]"
            >
              <MemoryImage photo={photos[index]} large />
            </motion.div>
          </AnimatePresence>
          <button onClick={() => go(-1)} aria-label="Foto sebelumnya" className="absolute left-2 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => go(1)} aria-label="Foto berikutnya" className="absolute right-2 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 flex justify-center gap-2" role="tablist" aria-label="Pilih foto">
          {photos.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Foto ${i + 1}`}
              onClick={() => setIndex([i, i > index ? 1 : -1])}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-[#F3A8C7]' : 'w-2 cursor-pointer bg-white/25 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
