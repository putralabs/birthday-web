import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Heart, Sparkle, Star } from 'lucide-react'
import Starfield from './Starfield.jsx'
import { birthdayData } from '../data/birthday.js'

const seq = (delay) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function BirthdayHero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yGlow = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120])
  const yStars = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60])

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Birthday hero"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
      style={{ background: 'radial-gradient(1000px 620px at 50% 28%, #232C52 0%, #151A32 58%, #101426 100%)' }}
    >
      <motion.div aria-hidden="true" style={{ y: yStars }} className="absolute inset-0">
        <Starfield />
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ y: yGlow }}
        className="pointer-events-none absolute left-1/2 top-1/4 h-80 w-80 -translate-x-1/2 rounded-full bg-[#B9A7FF]/15 blur-3xl"
      />

      <motion.p {...seq(0.1)} className="relative z-10 text-[11px] font-medium uppercase tracking-[0.35em] text-[#E8C77B]">
        {birthdayData.heroEyebrow}
      </motion.p>

      <motion.h2
        data-autofocus
        tabIndex={-1}
        {...seq(0.35)}
        className="relative z-10 mt-6 font-display text-5xl text-[#FFF7EC] focus:outline-none sm:text-6xl md:text-8xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {birthdayData.heroTitle}
      </motion.h2>

      <motion.p
        {...seq(0.7)}
        className="relative z-10 mt-4 font-display text-2xl italic text-[#F3A8C7] sm:text-3xl md:text-4xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {birthdayData.name}
      </motion.p>

      <motion.div {...seq(1.05)} aria-hidden="true" className="relative z-10 mt-8 flex items-center gap-5 text-[#B9A7FF]/70">
        <Star className="animate-float-slow h-4 w-4" />
        <Sparkle className="h-5 w-5 text-[#E8C77B]" />
        <Heart className="h-4 w-4 fill-[#F3A8C7]/40 text-[#F3A8C7]" />
        <Sparkle className="h-5 w-5 text-[#E8C77B]" />
        <Star className="animate-float-slow h-4 w-4" style={{ animationDelay: '2s' }} />
      </motion.div>

      <motion.a
        {...seq(1.3)}
        href="#cake"
        className="relative z-10 mt-12 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs uppercase tracking-[0.25em] text-white/70 transition hover:border-[#F3A8C7]/50 hover:text-white"
      >
        Lihat kuenya <span aria-hidden="true">↓</span>
      </motion.a>
    </section>
  )
}
