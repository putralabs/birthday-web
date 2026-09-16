import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

function LightboxImage({ photo }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div className="flex max-h-[55vh] min-h-[200px] w-full items-center justify-center bg-gradient-to-br from-[#F3A8C7] to-[#B9A7FF] md:max-h-[60vh]" role="img" aria-label={photo.alt}>
        <span className="font-display text-5xl italic text-white/90" style={{ fontFamily: 'var(--font-display)' }}>I</span>
      </div>
    )
  }
  return (
    <img
      src={photo.image}
      alt={photo.alt}
      onError={() => setFailed(true)}
      className="block h-auto max-h-[55vh] w-auto max-w-full object-contain md:max-h-[60vh]"
    />
  )
}

export default function PhotoLightbox({ photos, index, onClose, onNav }) {
  const photo = photos[index]

  const prev = useCallback(() => onNav((index - 1 + photos.length) % photos.length), [index, photos.length, onNav])
  const next = useCallback(() => onNav((index + 1) % photos.length), [index, photos.length, onNav])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  const [tx, setTx] = useState(null)

  if (!photo) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={`Foto: ${photo.caption}`}
      onClick={onClose}
      onTouchStart={(e) => setTx(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (tx == null) return
        const dx = e.changedTouches[0].clientX - tx
        if (dx > 50) prev()
        else if (dx < -50) next()
        setTx(null)
      }}
    >
      <button onClick={onClose} aria-label="Tutup foto" className="absolute right-4 top-4 flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20">
        <X className="h-5 w-5" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Foto sebelumnya" className="absolute left-2 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:left-6">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); next() }} aria-label="Foto berikutnya" className="absolute right-2 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:right-6">
        <ChevronRight className="h-5 w-5" />
      </button>

      <motion.figure
        key={photo.image + index}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[85dvh] w-fit max-w-[92vw] flex-col overflow-hidden rounded-lg bg-[#FFF7EC] p-3 pb-4 shadow-2xl md:max-w-2xl"
      >
        <div className="flex min-h-0 shrink items-center justify-center overflow-hidden rounded-md bg-[#1d2440]">
          <LightboxImage photo={photo} />
        </div>
        {/* w-0 min-w-full: caption ngikutin lebar foto, bukan sebaliknya.
            Tanpa ini teks panjang bikin bingkai melar dan foto portrait
            kelihatan sempit dengan ruang kosong di kiri-kanan. */}
        <figcaption className="max-h-[24vh] w-0 min-w-full shrink-0 overflow-y-auto px-2 pt-3 text-center font-display text-base italic leading-relaxed text-[#1d2440]" style={{ fontFamily: 'var(--font-display)' }}>
          {photo.caption}
        </figcaption>
      </motion.figure>
      <p className="mt-3 text-xs tracking-widest text-white/40">{index + 1} / {photos.length}</p>
    </motion.div>
  )
}

export function LightboxHost({ photos, index, setIndex }) {
  return (
    <AnimatePresence>
      {index != null && (
        <PhotoLightbox photos={photos} index={index} onClose={() => setIndex(null)} onNav={setIndex} />
      )}
    </AnimatePresence>
  )
}
