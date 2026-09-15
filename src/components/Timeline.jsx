import Reveal from './Reveal.jsx'
import { birthdayData } from '../data/birthday.js'

// Vertical on mobile, asymmetric alternating on desktop.
export default function Timeline() {
  return (
    <section id="timeline" aria-label="Timeline kenangan" className="mx-auto w-full max-w-4xl px-6 py-24 md:py-32">
      <Reveal className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#B9A7FF]">Jejak kecil</p>
        <h2 className="mt-4 font-display text-4xl text-[#FFF7EC] md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
          Timeline <span className="italic text-[#E8C77B]">kenangan</span>
        </h2>
      </Reveal>

      <ol className="relative mt-14 space-y-12 md:space-y-0 md:before:absolute md:before:bottom-4 md:before:left-1/2 md:before:top-2 md:before:w-px md:before:bg-gradient-to-b md:before:from-[#F3A8C7]/60 md:before:via-[#B9A7FF]/40 md:before:to-transparent max-md:before:absolute max-md:before:bottom-4 max-md:before:left-[11px] max-md:before:top-2 max-md:before:w-px max-md:before:bg-gradient-to-b max-md:before:from-[#F3A8C7]/60 max-md:before:via-[#B9A7FF]/40 max-md:before:to-transparent">
        {birthdayData.timeline.map((t, i) => {
          const left = i % 2 === 0
          return (
            <Reveal key={t.title} delay={Math.min(i * 0.06, 0.25)}>
              <li className={`relative md:flex md:w-full ${left ? 'md:justify-start' : 'md:justify-end'} max-md:pl-12 md:py-6`}>
                <span aria-hidden="true" className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#F3A8C7]/40 bg-[#151A32] text-[10px] text-[#F3A8C7] md:left-1/2 md:top-8 md:-translate-x-1/2">
                  ✦
                </span>
                <div className={`md:w-[42%] ${left ? 'md:pr-2 md:text-right' : 'md:pl-2'}`}>
                  <p className="font-display text-4xl text-white/15" style={{ fontFamily: 'var(--font-display)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-[#E8C77B]/80">{t.date}</p>
                  <h3 className="mt-1 font-display text-xl text-[#FFF7EC] md:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{t.description}</p>
                </div>
              </li>
            </Reveal>
          )
        })}
      </ol>
    </section>
  )
}
