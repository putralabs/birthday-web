import { MailOpen } from 'lucide-react'
import Reveal from './Reveal.jsx'
import { birthdayData } from '../data/birthday.js'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

// Paper card, paragraphs fade+slide in stagger. Typing reserved for short lines only.
export default function BirthdayMessage() {
  const { title, paragraphs, sign } = birthdayData.birthdayMessage
  return (
    <section id="message" aria-label="Birthday message" className="mx-auto w-full max-w-2xl px-6 py-24 md:py-32">
      <Reveal className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#B9A7FF]">{title}</p>
      </Reveal>
      <Reveal delay={0.12}>
        <article className="relative mt-8 rounded-sm bg-[#FFF7EC] p-8 text-left text-[#1d2440] shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-12">
          <span aria-hidden="true" className="absolute inset-x-8 top-0 h-6 -translate-y-3 rotate-[-1deg] bg-[#E8C77B]/50" />
          <MailOpen className="h-6 w-6 text-[#EE8FB5]" aria-hidden="true" />
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.12} y={18}>
              <p
                className="mt-4 font-display text-lg leading-relaxed md:text-xl md:leading-relaxed"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {p}
              </p>
            </Reveal>
          ))}
          <p className="mt-6 text-right text-sm italic text-[#1d2440]/60">{sign}</p>
          <span aria-hidden="true" className="absolute -right-3 -top-3 rotate-12 rounded-md bg-[#E8C77B] px-3 py-1.5 text-xs font-bold text-[#101426] shadow-lg">
            untuk Indah
          </span>
        </article>
      </Reveal>
      <Reveal delay={0.2} className="mt-10 text-center">
        <button
          onClick={() => scrollTo('memories')}
          className="min-h-[48px] cursor-pointer rounded-full border border-white/15 px-8 py-3 text-xs uppercase tracking-[0.25em] text-white/70 transition hover:border-[#F3A8C7]/50 hover:text-white"
        >
          Continue
        </button>
      </Reveal>
    </section>
  )
}
