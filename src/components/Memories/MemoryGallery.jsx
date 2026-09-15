import { useState } from 'react'
import Reveal from '../Reveal.jsx'
import { LightboxHost } from './PhotoLightbox.jsx'
import { birthdayData } from '../../data/birthday.js'

export function MemoryImage({ photo, large = false }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className={`flex w-full items-center justify-center bg-gradient-to-br from-[#F3A8C7] to-[#B9A7FF] ${large ? 'aspect-[4/3]' : 'aspect-square'}`} role="img" aria-label={photo.alt}>
        <span className="font-display text-5xl italic text-white/90" style={{ fontFamily: 'var(--font-display)' }}>I</span>
      </div>
    )
  }
  return (
    <img
      src={photo.image}
      alt={photo.alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`w-full bg-[#1d2440] object-cover ${large ? 'aspect-[4/3]' : 'aspect-square'}`}
    />
  )
}

// Polaroid + offset asymmetric layout. Hover straightens on desktop, tap opens on mobile.
export default function MemoryGallery() {
  const [lightbox, setLightbox] = useState(null)
  const photos = birthdayData.memories
  const tilts = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-1']

  return (
    <section id="memories" aria-label="Galeri kenangan" className="mx-auto w-full max-w-5xl px-6 py-24 md:py-32">
      <Reveal className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#E8C77B]">Memories</p>
        <h2 className="mt-4 font-display text-4xl text-[#FFF7EC] md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
          Potongan cerita <span className="italic text-[#F3A8C7]">tentangmu</span>
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/55">Klik fotonya untuk melihat lebih dekat.</p>
      </Reveal>

      {/* Mobile: horizontal snap row. Tablet/desktop: asymmetric grid. */}
      <div className="mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 md:[scrollbar-width:auto] [&::-webkit-scrollbar]:hidden md:[&::-webkit-scrollbar]:block">
        {photos.map((p, i) => (
          <Reveal
            key={p.image}
            delay={Math.min(i * 0.08, 0.3)}
            className={
              i === 0
                ? 'min-w-[85%] snap-center sm:min-w-[60%] md:min-w-0'
                : `min-w-[68%] snap-center sm:min-w-[44%] md:min-w-0 ${i === 3 ? 'md:mt-10' : ''} ${i === 4 ? 'md:-mt-6' : ''}`
            }
          >
            <figure
              onClick={() => setLightbox(i)}
              onKeyDown={(e) => e.key === 'Enter' && setLightbox(i)}
              tabIndex={0}
              role="button"
              aria-label={`Buka foto: ${p.caption}`}
              className={`group cursor-pointer bg-[#FFF7EC] p-2.5 pb-3 shadow-[0_16px_50px_rgba(0,0,0,0.4)] transition-all duration-500 hover:z-10 hover:rotate-0 hover:scale-[1.04] hover:shadow-[0_20px_60px_rgba(243,168,199,0.25)] ${tilts[i % tilts.length]}`}
            >
              <div className="overflow-hidden">
                <div className="transition-transform duration-500 group-hover:scale-105">
                  <MemoryImage photo={p} />
                </div>
              </div>
              <figcaption
                className="px-1 pt-2.5 text-center font-display text-sm italic leading-snug text-[#1d2440] md:opacity-70 md:transition md:group-hover:opacity-100"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {p.caption}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <LightboxHost photos={photos} index={lightbox} setIndex={setLightbox} />
    </section>
  )
}
