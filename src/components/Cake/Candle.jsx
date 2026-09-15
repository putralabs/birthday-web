import { useEffect, useRef, useState } from 'react'

// Single candle: flame -> shrink -> smoke -> idle. Click/tap to blow out.
export default function Candle({ lit, color = '#B9A7FF', onBlow, index }) {
  const [stage, setStage] = useState(lit ? 'flame' : 'idle')
  const prevLit = useRef(lit)

  useEffect(() => {
    if (prevLit.current && !lit) {
      setStage('dying')
      const t1 = setTimeout(() => setStage('smoke'), 260)
      const t2 = setTimeout(() => setStage('idle'), 2200)
      prevLit.current = lit
      return () => {
        clearTimeout(t1)
        clearTimeout(t2)
      }
    }
    if (lit) setStage('flame')
    prevLit.current = lit
  }, [lit])

  return (
    <button
      onClick={onBlow}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && lit) {
          e.preventDefault()
          onBlow()
        }
      }}
      aria-label={lit ? `Tiup lilin ${index + 1}` : `Lilin ${index + 1} sudah mati`}
      className="group flex min-h-[44px] min-w-[36px] cursor-pointer flex-col items-center justify-end p-1"
    >
      <span className="relative flex h-12 w-8 items-end justify-center" aria-hidden="true">
        {(stage === 'flame' || stage === 'dying') && (
          <>
            {stage === 'flame' && (
              <span className="animate-glow absolute bottom-6 h-14 w-14 rounded-full bg-[#ffb450]/25 blur-md" />
            )}
            <span
              className={`relative block h-8 w-[14px] rounded-full bg-gradient-to-t from-[#F6A85C] via-[#FFD98A] to-[#FFF7EC] transition-all duration-300 ${
                stage === 'flame' ? 'animate-flicker scale-100 opacity-100' : 'scale-x-50 scale-y-0 opacity-0'
              }`}
              style={{ transformOrigin: '50% 100%' }}
            />
          </>
        )}
        {stage === 'smoke' && (
          <span
            key={`smoke-${index}`}
            className="animate-smoke absolute bottom-6 block h-6 w-2 rounded-full bg-white/40 blur-[3px]"
          />
        )}
      </span>
      <span aria-hidden="true" className="block h-2 w-[2px] bg-[#3a3a3a]" />
      <span
        aria-hidden="true"
        className={`block h-14 w-3.5 rounded-t-md border-x border-white/20 transition-transform duration-500 md:h-16 ${
          stage === 'dying' ? '-rotate-3' : ''
        }`}
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 45%), ${color}`,
        }}
      />
    </button>
  )
}
