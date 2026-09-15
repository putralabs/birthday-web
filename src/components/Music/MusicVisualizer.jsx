import { useEffect, useRef } from 'react'

// Tiny equalizer bars driven by real frequency data when available,
// CSS pulse fallback otherwise. Rests when paused or reduced motion.
export default function MusicVisualizer({ playing, audio }) {
  const bars = useRef([])
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced) return
    let raf = 0
    const loop = () => {
      const lv = playing ? audio?.getLevels?.() : null
      bars.current.forEach((el, i) => {
        if (!el) return
        if (lv) {
          el.style.animation = 'none'
          el.style.height = `${4 + lv[i] * 12}px`
          el.style.opacity = '1'
        } else if (playing) {
          el.style.height = ''
          el.style.opacity = ''
          el.style.animation = `eq-bounce ${0.7 + (i % 3) * 0.22}s ease-in-out ${i * 0.12}s infinite`
        } else {
          el.style.animation = 'none'
          el.style.height = '5px'
          el.style.opacity = '0.5'
        }
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [playing, audio, reduced])

  return (
    <span className="flex items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          ref={(el) => {
            bars.current[i] = el
          }}
          className="w-[3px] rounded-full bg-current"
          style={{ height: 14, transformOrigin: 'bottom' }}
        />
      ))}
    </span>
  )
}
