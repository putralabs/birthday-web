import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

const COLORS = ['#F3A8C7', '#B9A7FF', '#E8C77B', '#FFF7EC', '#7DD3FC']

// Canvas fireworks, limited particles, fires only on celebration moments.
const Fireworks = forwardRef(function Fireworks(_, ref) {
  const canvasRef = useRef(null)
  const rockets = useRef([])
  const sparks = useRef([])
  const raf = useRef(0)
  const reduced = useReducedMotion()
  const [noCanvas, setNoCanvas] = useState(false)

  useEffect(() => {
    const c = canvasRef.current
    if (!c || !c.getContext) {
      setNoCanvas(true)
      return
    }
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      c.width = window.innerWidth * dpr
      c.height = window.innerHeight * dpr
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  const tick = () => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    rockets.current = rockets.current.filter((r) => r.y > r.targetY && r.life > 0)
    for (const r of rockets.current) {
      r.y -= r.speed
      r.life -= 1
      ctx.beginPath()
      ctx.arc(r.x, r.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = r.color
      ctx.fill()
      if (r.y <= r.targetY) {
        explode(r.x, r.y, r.color)
        r.life = 0
      }
    }
    sparks.current = sparks.current.filter((s) => s.life > 0)
    for (const s of sparks.current) {
      s.vy += 0.05
      s.x += s.vx
      s.y += s.vy
      s.life -= 1
      ctx.globalAlpha = Math.max(0, s.life / 70)
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
      ctx.fillStyle = s.color
      ctx.fill()
      ctx.globalAlpha = 1
    }
    if (rockets.current.length || sparks.current.length) raf.current = requestAnimationFrame(tick)
    else ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
  }

  const explode = (x, y, color) => {
    const n = reduced ? 14 : 42
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n + Math.random() * 0.3
      const sp = 1.5 + Math.random() * 3.5
      sparks.current.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp - 1,
        size: 1.2 + Math.random() * 1.8,
        color: Math.random() > 0.4 ? color : COLORS[(Math.random() * COLORS.length) | 0],
        life: 50 + Math.random() * 30,
      })
    }
  }

  useImperativeHandle(ref, () => ({
    launch(count = 3) {
      const c = canvasRef.current
      if (!c || !c.getContext) return
      const n = reduced ? 1 : window.innerWidth < 768 ? Math.min(count, 2) : count
      for (let i = 0; i < n; i++) {
        setTimeout(() => {
          rockets.current.push({
            x: window.innerWidth * (0.2 + Math.random() * 0.6),
            y: window.innerHeight,
            targetY: window.innerHeight * (0.2 + Math.random() * 0.25),
            speed: 7 + Math.random() * 3,
            color: COLORS[(Math.random() * COLORS.length) | 0],
            life: 300,
          })
          cancelAnimationFrame(raf.current)
          raf.current = requestAnimationFrame(tick)
        }, i * 450)
      }
    },
  }))

  if (noCanvas) return null
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[65] h-full w-full"
    />
  )
})

export default Fireworks
