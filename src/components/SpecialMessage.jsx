import Reveal from './Reveal.jsx'
import { birthdayData } from '../data/birthday.js'

export default function SpecialMessage() {
  return (
    <section id="special" aria-label="Pesan khusus" className="relative overflow-hidden bg-[#0d1122] px-6 py-28 md:py-36">
      <div aria-hidden="true" className="animate-glow pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B9A7FF]/10 blur-3xl" />
      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <span aria-hidden="true" className="animate-drift inline-block text-2xl text-[#E8C77B]">✦</span>
        </Reveal>
        <Reveal delay={0.1}>
          <blockquote className="mt-8 font-display text-2xl font-medium leading-relaxed text-[#FFF7EC] md:text-4xl md:leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
            {birthdayData.specialMessage.content}
          </blockquote>
        </Reveal>
        <Reveal delay={0.2}>
          <div aria-hidden="true" className="mx-auto mt-10 h-px w-16 bg-[#F3A8C7]/40" />
        </Reveal>
      </div>
    </section>
  )
}
