import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

const COLORS = ['#F3A8C7', '#B9A7FF', '#E8C77B', '#FFF7EC', '#7DD3FC', '#EE8FB5']

// Confetti canvas. Cuma keluar pas rayain, berhenti sendiri. Ada cadangan CSS.
const Confetti = forwardRef(function Confetti(_, ref) {
  const canvasRef = useRef(null)
  const parts = useRef([])
  const raf = useRef(0)
  const reduced = useReducedMotion()
  const [noCanvas, setNoCanvas] = useState(false)
  const [cssBurst, setCssBurst] = useState(0)

  const ctx2d = () => {
    const c = canvasRef.current
    if (!c) return null
    try {
      return c.getContext('2d')
    } catch {
      return null
    }
  }

  const resize = () => {
    const c = canvasRef.current
    if (!c) return
    const ctx = ctx2d()
    if (!ctx) {
      setNoCanvas(true)
      return
    }
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = window.innerWidth * dpr
    c.height = window.innerHeight * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  useEffect(() => {
    const dprCheck = ctx2d()
    if (!dprCheck) {
      setNoCanvas(true)
      return
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  const tick = () => {
    const ctx = ctx2d()
    if (!ctx) return
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    parts.current = parts.current.filter((p) => p.life > 0 && p.y < window.innerHeight + 40)
    for (const p of parts.current) {
      p.vy += p.gravity
      p.vx *= 0.99
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      p.life -= 1
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 60))
      ctx.fillStyle = p.color
      if (p.shape === 'circle') {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else if (p.shape === 'heart') {
        ctx.font = `${p.size + 6}px serif`
        ctx.fillText('♥', -p.size / 2, p.size / 2)
      } else if (p.shape === 'star') {
        ctx.font = `${p.size + 6}px serif`
        ctx.fillText('✦', -p.size / 2, p.size / 2)
      } else if (p.shape === 'text') {
        ctx.font = `bold ${p.size + 8}px Inter, sans-serif`
        ctx.fillText(p.text, -p.size / 2, p.size / 2)
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      }
      ctx.restore()
    }
    if (parts.current.length > 0) raf.current = requestAnimationFrame(tick)
    else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  }

  useImperativeHandle(ref, () => ({
    burst(n = 160, opts = {}) {
      if (!ctx2d()) {
        setNoCanvas(true)
        setCssBurst((k) => k + 1)
        return
      }
      if (reduced) n = Math.min(n, 30)
      const mobile = window.innerWidth < 768
      if (mobile) n = Math.round(n * 0.55)
      const origins = opts.origins || [
        { x: window.innerWidth * 0.12, y: window.innerHeight * 0.35, dir: 1 },
        { x: window.innerWidth * 0.88, y: window.innerHeight * 0.35, dir: -1 },
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.25, dir: 0 },
      ]
      for (let i = 0; i < n; i++) {
        const o = origins[i % origins.length]
        // Every 5th piece carries a letter of her name when opts.name is set.
        const useLetter = opts.name && i % 5 === 0
        parts.current.push({
          x: o.x + (Math.random() - 0.5) * 60,
          y: o.y + (Math.random() - 0.5) * 30,
          vx: (Math.random() - 0.5) * 9 + o.dir * 3,
          vy: -Math.random() * 9 - 2,
          gravity: 0.22 + Math.random() * 0.12,
          size: 5 + Math.random() * 7,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.3,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          shape: useLetter ? 'text' : ['rect', 'rect', 'circle', 'heart', 'star'][(Math.random() * 5) | 0],
          text: useLetter ? opts.name[(i / 5) % opts.name.length | 0] : '',
          life: 130 + Math.random() * 70,
        })
      }
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(tick)
    },
  }))

  if (noCanvas) {
    // Simple CSS fallback: a shower of sparkles on each burst.
    return (
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
        {cssBurst > 0 && (
          <div key={cssBurst} className="absolute inset-0">
            {Array.from({ length: reduced ? 8 : 20 }).map((_, i) => (
              <span
                key={i}
                className="animate-smoke absolute text-lg"
                style={{
                  left: `${4 + ((i * 47) % 92)}%`,
                  top: `${18 + ((i * 29) % 30)}%`,
                  color: COLORS[i % COLORS.length],
                  animationDelay: `${(i % 6) * 0.12}s`,
                }}
              >
                {i % 3 === 0 ? '♥' : '✦'}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] h-full w-full"
    />
  )
})

export default Confetti
