import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

// Ambient canvas particles: stars | dust | petals. Budget 300 desktop / 100 mobile.
export default function Particles({ variant = 'stars', density = 1, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [noCanvas, setNoCanvas] = useState(false)

  const fallback = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
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
    let parts = []
    let w = 0
    let h = 0

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const mobile = window.innerWidth < 768
      const budget = Math.round((mobile ? 100 : 300) * (variant === 'petals' ? 0.12 : 0.25) * density)
      parts = Array.from({ length: Math.max(8, budget) }, () => makeOne())
    }

    const makeOne = () => {
      const r = Math.random()
      return {
        x: Math.random() * (w || window.innerWidth),
        y: Math.random() * (h || window.innerHeight),
        r: variant === 'petals' ? 2 + Math.random() * 3 : 0.4 + Math.random() * 1.6,
        vy: variant === 'dust' ? -(0.05 + Math.random() * 0.12) : -(0.04 + Math.random() * 0.16),
        vx: variant === 'petals' ? (Math.random() - 0.5) * 0.5 : (Math.random() - 0.5) * 0.08,
        tw: Math.random() * Math.PI * 2,
        twSpeed: 0.005 + Math.random() * 0.02,
        rot: Math.random() * Math.PI * 2,
        hue: r,
      }
    }

    const color = (p) => {
      if (variant === 'petals') return '243,168,199'
      if (variant === 'dust') return '232,199,123'
      if (p.hue > 0.86) return '243,168,199'
      if (p.hue > 0.72) return '185,167,255'
      if (p.hue > 0.62) return '232,199,123'
      return '255,255,255'
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        if (!reduced) {
          p.x += p.vx
          p.y += p.vy
          p.tw += p.twSpeed
          p.rot += 0.01
          if (p.y < -6) {
            p.y = h + 6
            p.x = Math.random() * w
          }
          if (p.x < -6) p.x = w + 6
          if (p.x > w + 6) p.x = -6
        }
        const alpha = variant === 'petals' ? 0.8 : reduced ? 0.6 : 0.25 + Math.abs(Math.sin(p.tw)) * 0.5
        ctx.save()
        ctx.translate(p.x, p.y)
        if (variant === 'petals') {
          ctx.rotate(p.rot)
          ctx.fillStyle = `rgba(${color(p)},${alpha.toFixed(2)})`
          ctx.beginPath()
          ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = `rgba(${color(p)},${alpha.toFixed(2)})`
          ctx.beginPath()
          ctx.arc(0, 0, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
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
  }, [variant, density, reduced])

  if (noCanvas) {
    return (
      <div aria-hidden="true" className={`absolute inset-0 overflow-hidden ${className}`}>
        {fallback.map((s, i) => (
          <span
            key={i}
            className="animate-glow absolute rounded-full bg-white/60"
            style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay }}
          />
        ))}
      </div>
    )
  }

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`} />
}
