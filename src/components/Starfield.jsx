import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion.js'

// Bintang canvas. Dikit di HP, banyak di laptop. Ada cadangan CSS kalau canvas mati.
export default function Starfield({ density = 1, className = '', interactive = false, onStarClick = null }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [noCanvas, setNoCanvas] = useState(false)

  const fallbackStars = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        left: `${(i * 37 + 11) % 100}%`,
        top: `${(i * 53 + 7) % 100}%`,
        size: 1 + ((i * 7) % 3),
        delay: `${(i % 5) * 0.7}s`,
      })),
    []
  )

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let ctx = null
    try {
      ctx = canvas.getContext('2d')
    } catch {
      ctx = null
    }
    if (!ctx) {
      setNoCanvas(true)
      return
    }
    let raf = 0
    let stars = []
    let w = 0
    let h = 0

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const mobile = w < 768
      const base = mobile ? 22 : 48
      const count = Math.round(base * density)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.16 + 0.04,
        tw: Math.random() * Math.PI * 2,
        twSpeed: Math.random() * 0.02 + 0.005,
        hue: Math.random(),
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        if (!reduced) {
          s.y -= s.speed
          s.tw += s.twSpeed
          if (s.y < -4) {
            s.y = h + 4
            s.x = Math.random() * w
          }
        }
        const alpha = reduced ? 0.7 : 0.35 + Math.abs(Math.sin(s.tw)) * 0.55
        const color =
          s.hue > 0.86 ? '243,168,199' : s.hue > 0.72 ? '185,167,255' : s.hue > 0.62 ? '232,199,123' : '255,255,255'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color},${alpha.toFixed(2)})`
        ctx.fill()
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [density, reduced])

  const handleClick = (e) => {
    if (!interactive || !onStarClick) return
    const rect = ref.current.getBoundingClientRect()
    onStarClick({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  if (noCanvas) {
    return (
      <div aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className}`}>
        {fallbackStars.map((s, i) => (
          <span
            key={i}
            className="animate-glow absolute rounded-full bg-white/70"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}
          />
        ))}
      </div>
    )
  }

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      onClick={handleClick}
      className={`absolute inset-0 ${interactive ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'} ${className}`}
    />
  )
}
