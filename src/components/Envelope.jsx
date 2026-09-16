import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const TYPED_TITLE = 'Happy Birthday, Indah'
const TYPED_SUB = 'Masuk aja, kamarnya udah rapi.'

// Amplop: awalnya cuma amplop tertutup berlogo love, suratnya ngumpet
// total di balik kantong amplop. Dipencet, segel pecah, flap segitiga
// kebuka, surat naik keluar lewat mulut amplop, terus tampil paling depan.
// Judul diketik dulu huruf per huruf, subjudul nyusul diketik juga.
// Tombol lanjut baru muncul kalau semua ketikan beres (bukan timer).
export default function Envelope({ onDone, onOpen }) {
  const [stage, setStage] = useState('closed') // closed | opening | letter | done
  const [opened, setOpened] = useState(false)
  const [typedTitle, setTypedTitle] = useState(0)
  const [typedSub, setTypedSub] = useState(0)
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const open = () => {
    if (opened) return
    setOpened(true)
    onOpen?.()
    if (reduced) {
      setStage('done')
      return
    }
    setStage('opening')
    setTimeout(() => setStage('letter'), 950)
    setTimeout(() => setStage('done'), 2300)
  }

  const isClosed = stage === 'closed'
  const letterOut = stage === 'letter' || stage === 'done'
  const titleDone = typedTitle >= TYPED_TITLE.length
  const allDone = titleDone && typedSub >= TYPED_SUB.length
  // Isi surat dirender selagi naik (letter) biar ukuran kartu stabil.
  // Ketikan judul jalan bareng suratnya naik, subjudul nyusul.

  useEffect(() => {
    if (!letterOut) return
    if (reduced) {
      setTypedTitle(TYPED_TITLE.length)
      setTypedSub(TYPED_SUB.length)
      return
    }
    if (typedTitle >= TYPED_TITLE.length) return
    const t = setTimeout(() => setTypedTitle((n) => Math.min(TYPED_TITLE.length, n + 1)), 55)
    return () => clearTimeout(t)
  }, [letterOut, typedTitle, reduced])

  useEffect(() => {
    if (!titleDone || reduced) return
    if (typedSub >= TYPED_SUB.length) return
    const t = setTimeout(() => setTypedSub((n) => Math.min(TYPED_SUB.length, n + 1)), 35)
    return () => clearTimeout(t)
  }, [titleDone, typedSub, reduced])

  return (
    <motion.div
      data-autofocus
      tabIndex={-1}
      className="relative z-10 flex flex-col items-center px-6 text-center focus:outline-none"
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence>
        {letterOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(243,168,199,0.25),transparent_60%)]"
          />
        )}
      </AnimatePresence>

      <p className="mb-8 text-[11px] uppercase tracking-[0.35em] text-[#B9A7FF]">
        {isClosed ? 'Ada surat buat kamu' : stage === 'opening' ? 'Membuka...' : ' '}
      </p>

      <motion.button
        onClick={open}
        whileHover={isClosed ? { scale: 1.03 } : {}}
        whileTap={isClosed ? { scale: 0.97 } : {}}
        aria-label="Buka amplop digital"
        className="relative block w-72 cursor-pointer sm:w-80"
      >
        {/* surat. Pas tertutup dia ngumpet di balik kantong amplop,
            jadi tidak kelihatan sedikitpun. Baru naik pas kebuka. */}
        <motion.div
          initial={false}
          animate={letterOut ? { y: -128 } : { y: 84 }}
          transition={
            letterOut
              ? { duration: 1, ease: [0.22, 1, 0.36, 1] }
              : { duration: 0 }
          }
          style={{ zIndex: letterOut ? 30 : 0 }}
          className="absolute left-1/2 top-0 min-h-[40px] w-60 -translate-x-1/2 rounded-xl bg-[#FFF7EC] px-6 py-5 text-[#1d2440] sm:w-64"
        >
          <AnimatePresence>
            {letterOut && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="block"
              >
                <span aria-label={TYPED_TITLE} className="mt-3 block min-h-[72px] font-display text-2xl leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                  <span aria-hidden="true">{TYPED_TITLE.slice(0, typedTitle)}</span>
                  {!titleDone && (
                    <span aria-hidden="true" className="ml-0.5 inline-block h-6 w-[2px] animate-pulse bg-[#EE8FB5]" />
                  )}
                </span>
                <span aria-label={TYPED_SUB} className="mt-2 block min-h-[20px] text-sm text-[#1d2440]/60">
                  <span aria-hidden="true">{TYPED_SUB.slice(0, typedSub)}</span>
                  {titleDone && !allDone && (
                    <span aria-hidden="true" className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-[#EE8FB5]" />
                  )}
                </span>
              </motion.span>
            )}
          </AnimatePresence>
          {letterOut && (
            <span aria-hidden="true" className="pointer-events-none absolute -inset-3 -z-10 rounded-2xl bg-[#FFF1D6]/25 blur-xl" />
          )}
        </motion.div>

        {/* badan amplop: panel belakang, mulut gelap, kantong depan
            bentuk V biar flap dan badan nyambung */}
        <div className="relative mt-16 h-48 overflow-hidden rounded-2xl border border-white/10 bg-[#1d2440] shadow-2xl">
          {/* mulut amplop, kelihatan pas flap kebuka */}
          <div className="absolute inset-x-0 top-0 h-[46%] bg-[#0b0e20]" />
          {/* cahaya dari dalam pas kebuka */}
          <motion.div
            aria-hidden="true"
            initial={false}
            animate={{ opacity: letterOut ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-x-8 top-4 h-20 rounded-full bg-[#FFF1D6]/40 blur-xl"
          />
          {/* kantong depan + lipatan V */}
          <svg
            aria-hidden="true"
            viewBox="0 0 288 192"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <linearGradient id="env-pocket" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#2b3560" />
                <stop offset="1" stopColor="#232c52" />
              </linearGradient>
            </defs>
            {/* lipatan samping kiri kanan */}
            <polygon points="0,34 52,66 0,120" fill="#1a2140" opacity="0.8" />
            <polygon points="288,34 236,66 288,120" fill="#1a2140" opacity="0.8" />
            {/* kantong depan */}
            <polygon points="0,34 144,108 288,34 288,192 0,192" fill="url(#env-pocket)" />
            {/* garis lipatan V, penyangga flap dan kantong */}
            <polyline
              points="0,34 144,108 288,34"
              fill="none"
              stroke="#4a5a8c"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points="0,34 144,108 288,34"
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              transform="translate(0,2)"
            />
          </svg>
          {isClosed && (
            <p className="absolute bottom-6 left-0 right-0 text-xs uppercase tracking-[0.3em] text-white/40">
              pencet buat buka
            </p>
          )}
        </div>

        {/* flap segitiga + logo love. Segel pecah pas dibuka */}
        <motion.div
          initial={false}
          animate={isClosed ? { rotateX: 0 } : { rotateX: 168 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            zIndex: letterOut ? 10 : 20,
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}
          className="absolute left-0 right-0 top-16 h-28 bg-[#2a3358]"
        >
          <div className="relative mx-auto h-full w-full bg-gradient-to-b from-[#B9A7FF]/40 to-transparent">
            <span aria-hidden="true" className="absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 text-2xl text-[#F3A8C7]">
              ♥
            </span>
          </div>
        </motion.div>
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={isClosed ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute left-1/2 top-16 z-30 flex h-11 w-11 -translate-x-1/2 translate-y-[5.2rem] items-center justify-center rounded-full bg-gradient-to-br from-[#F3A8C7] to-[#d96c96] text-lg text-white shadow-lg"
        >
          ♥
        </motion.span>
      </motion.button>

      <div className="mt-8 flex min-h-[48px] items-center gap-3">
        {allDone && (
          <button
            onClick={onDone}
            className="min-h-[48px] cursor-pointer rounded-full bg-[#FFF7EC] px-10 py-3.5 text-sm font-semibold text-[#101426] shadow-[0_0_40px_rgba(243,168,199,0.35)] transition hover:scale-[1.03] active:scale-95"
          >
            Masuk ke kejutan
          </button>
        )}
      </div>
    </motion.div>
  )
}
