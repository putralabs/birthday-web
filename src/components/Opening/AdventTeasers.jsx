import { motion } from 'framer-motion'
import { Gift, Lock } from 'lucide-react'
import { birthdayData } from '../../data/birthdayData.js'
import { birthdayStart } from '../../hooks/useBirthdayState.js'

// One teaser unlocks per day approaching the birthday. Locked ones show a hint.
export default function AdventTeasers() {
  const daysLeft = Math.max(0, Math.ceil((birthdayStart().getTime() - Date.now()) / 86400000))

  return (
    <div className="mx-auto mt-12 w-full max-w-md">
      <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Menuju hari H</p>
      <div className="mt-4 space-y-3">
        {birthdayData.teasers.map((t) => {
          const open = daysLeft <= t.daysOut
          return (
            <div
              key={t.title}
              className={`flex items-start gap-3 rounded-2xl border p-4 text-left ${
                open ? 'border-[#E8C77B]/30 bg-[#E8C77B]/5' : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              {open ? (
                <Gift className="mt-0.5 h-4 w-4 shrink-0 text-[#E8C77B]" aria-hidden="true" />
              ) : (
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-white/30" aria-hidden="true" />
              )}
              <div>
                <p className={`text-[11px] uppercase tracking-[0.25em] ${open ? 'text-[#E8C77B]' : 'text-white/35'}`}>
                  {t.title}
                </p>
                {open ? (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="mt-1 text-sm leading-relaxed text-white/80">
                    {t.text}
                  </motion.p>
                ) : (
                  <p className="mt-1 text-xs text-white/35">Terkunci, kembali lagi nanti.</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
