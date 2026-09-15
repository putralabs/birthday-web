import { useCountdown } from '../hooks/useCountdown.js'
import { birthdayData } from '../data/birthday.js'

function pad(n) {
  return String(n).padStart(2, '0')
}

// Real progress from project start to birthday, not fake.
function useRealProgress() {
  const start = new Date(birthdayData.projectStart).getTime()
  const end = new Date(`${birthdayData.birthday}T00:00:00+07:00`).getTime()
  const now = Date.now()
  return Math.max(0, Math.min(1, (now - start) / (end - start)))
}

function Unit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div
        key={value}
        className="animate-flip-in font-display text-5xl text-[#FFF7EC] tabular-nums sm:text-6xl md:text-7xl"
        style={{ fontFamily: 'var(--font-display)' }}
        role="timer"
        aria-label={`${value} ${label}`}
      >
        {value}
      </div>
      <span className="mt-2 text-[11px] uppercase tracking-[0.3em] text-[#B9A7FF]/70">{label}</span>
    </div>
  )
}

export default function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown()
  const progress = useRealProgress()

  return (
    <div className="relative z-10 w-full max-w-xl">
      <h1
        data-autofocus
        tabIndex={-1}
        className="mt-4 font-display text-5xl italic text-[#FFF7EC] focus:outline-none sm:text-6xl"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Indah
      </h1>

      <div className="mt-10 flex items-start justify-center gap-5 sm:gap-8" aria-live="off">
        <Unit value={days} label="Days" />
        <Unit value={pad(hours)} label="Hrs" />
        <Unit value={pad(minutes)} label="Min" />
        <Unit value={pad(seconds)} label="Sec" />
      </div>

      <div className="mx-auto mt-10 max-w-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-[#FFF7EC]/45">Preparing the surprise</p>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress menuju hari ulang tahun"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F3A8C7] via-[#B9A7FF] to-[#E8C77B] transition-all duration-1000"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-2 text-[11px] text-[#FFF7EC]/35">{birthdayData.birthdayLabel} . Jakarta</p>
      </div>
    </div>
  )
}
