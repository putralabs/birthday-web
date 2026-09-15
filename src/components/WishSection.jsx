import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cake, Sparkles } from 'lucide-react'
import { birthdayData } from '../data/birthday.js'
import { playSfx } from '../hooks/useAudio.js'

// PRD 18: tap the cake -> sparkles/hearts/light burst -> Make a wish -> Done? Continue.
// Continue locks one star into the sky (localStorage, survives revisits).
export default function WishSection({ active, onContinue }) {
  const [stage, setStage] = useState('tap') // tap | wish | done
  const [burst, setBurst] = useState(0)
  const [wishNo, setWishNo] = useState(0)

  useEffect(() => {
    if (!active) return
    if (stage !== 'wish') return
    const t = setTimeout(() => setStage('done'), 3500)
    return () => clearTimeout(t)
  }, [active, stage])

  const tapCake = () => {
    setBurst((b) => b + 1)
    playSfx('sparkle')
    navigator.vibrate?.(25)
    if (stage === 'tap') {
      setTimeout(() => setStage('wish'), 900)
    }
  }

  return (
    <section id="wish" aria-label="Make a wish" className="relative mx-auto max-w-2xl px-6 py-20 text-center">
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {stage === 'tap' && (
              <>
                <p className="text-sm text-white/55">{birthdayData.wishTapCue}</p>
                <motion.button
                  key={burst}
                  onClick={tapCake}
                  whileTap={{ scale: 0.94 }}
                  animate={burst ? { scale: [1, 1.06, 1] } : {}}
                  aria-label="Ketuk kue untuk membuat harapan"
                  className="relative mx-auto mt-6 flex min-h-[120px] min-w-[120px] cursor-pointer items-center justify-center rounded-full border border-[#E8C77B]/30 bg-[#E8C77B]/10 shadow-[0_0_60px_rgba(232,199,123,0.25)]"
                >
                  <Cake className="h-14 w-14 text-[#E8C77B]" aria-hidden="true" />
                  {burst > 0 && (
                    <motion.span
                      initial={{ opacity: 0.9, scale: 0.6 }}
                      animate={{ opacity: 0, scale: 2.2 }}
                      transition={{ duration: 0.9 }}
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[#E8C77B]/30 blur-md"
                    />
                  )}
                </motion.button>
                {burst > 0 && (
                  <div aria-hidden="true" className="pointer-events-none relative mx-auto mt-2 h-10 w-56">
                    {[...Array(8)].map((_, i) => (
                      <motion.span
                        key={`${burst}-${i}`}
                        className="absolute text-[#E8C77B]"
                        style={{ left: `${6 + i * 12}%`, top: `${(i % 3) * 10}px` }}
                        initial={{ opacity: 0, scale: 0.4 }}
                        animate={{ opacity: [0, 1, 0], scale: 1.2, y: -18 }}
                        transition={{ duration: 1, delay: i * 0.06 }}
                      >
                        {i % 2 ? '♥' : '✦'}
                      </motion.span>
                    ))}
                  </div>
                )}
              </>
            )}

            {stage !== 'tap' && (
              <>
                <Sparkles className="mx-auto h-6 w-6 text-[#E8C77B]" aria-hidden="true" />
                <h2 className="mt-4 font-display text-4xl italic text-[#FFF7EC] md:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
                  {birthdayData.wishTitle}
                </h2>
                <div aria-hidden="true" className="pointer-events-none relative mx-auto mt-6 h-12 w-64">
                  {[...Array(8)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="absolute text-[#E8C77B]"
                      style={{ left: `${8 + i * 11}%`, top: `${(i % 3) * 14}px` }}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                      ✦
                    </motion.span>
                  ))}
                </div>
              </>
            )}

            <div className="mt-4 min-h-[60px]">
              {stage === 'done' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <p className="mb-4 text-sm text-white/55">{birthdayData.wishDone}</p>
                  <button
                    onClick={() => {
                      try {
                        const stars = JSON.parse(localStorage.getItem('wishStars') || '[]')
                        stars.push(new Date().toISOString())
                        localStorage.setItem('wishStars', JSON.stringify(stars))
                        setWishNo(stars.length)
                      } catch {
                        /* private mode, wish still counts this visit */
                      }
                      playSfx('chime')
                      navigator.vibrate?.(40)
                      onContinue()
                    }}
                    className="min-h-[48px] cursor-pointer rounded-full bg-[#F3A8C7] px-10 py-3.5 text-sm font-semibold text-[#101426] shadow-[0_0_36px_rgba(243,168,199,0.4)] transition hover:scale-[1.03] hover:bg-[#f7bcd4] active:scale-95"
                  >
                    Continue
                  </button>
                  {wishNo > 0 && (
                    <p className="mt-3 text-xs text-[#E8C77B]/80" role="status">
                      Wish ke-{wishNo} terkunci di langit. Ia menunggumu di final.
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
