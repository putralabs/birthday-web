import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion.js'

// Small dot + soft ring. Scales on interactive hover. Desktop precise pointers only.
export default function CustomCursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const reduced = useReducedMotion()
  const trail = useRef([])

  useEffect(() => {
    if (reduced) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    setEnabled(true)
    document.documentElement.classList.add('custom-cursor-on')
    return () => document.documentElement.classList.remove('custom-cursor-on')
  }, [reduced])

  useEffect(() => {
    if (!enabled) return
    const pos = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let raf = 0
    let hovering = false

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const t = e.target
      hovering = !!(t instanceof Element && t.closest('a,button,input,[role="button"]'))
      // capped trail
      trail.current.push({ x: e.clientX, y: e.clientY, life: 1 })
      if (trail.current.length > 10) trail.current.shift()
    }

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18
      ringPos.y += (pos.y - ringPos.y) * 0.18
      if (dot.current) dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) scale(${hovering ? 1.6 : 1})`
        ring.current.style.borderColor = hovering ? 'rgba(243,168,199,0.8)' : 'rgba(255,255,255,0.35)'
      }
      const layer = document.getElementById('cursor-trail')
      if (layer) {
        trail.current.forEach((p) => { p.life -= 0.06 })
        trail.current = trail.current.filter((p) => p.life > 0)
        layer.innerHTML = trail.current
          .map((p) => `<span style="position:fixed;left:${p.x}px;top:${p.y}px;width:4px;height:4px;border-radius:99px;background:rgba(243,168,199,${(p.life * 0.5).toFixed(2)});pointer-events:none;transform:translate(-50%,-50%)"></span>`)
          .join('')
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div id="cursor-trail" aria-hidden="true" className="pointer-events-none fixed inset-0 z-[99]" />
      <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100]">
        <div ref={dot} className="h-1.5 w-1.5 rounded-full bg-[#F3A8C7]" style={{ margin: '-3px 0 0 -3px' }} />
      </div>
      <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100]">
        <div ref={ring} className="h-8 w-8 rounded-full border" style={{ margin: '-16px 0 0 -16px', borderColor: 'rgba(255,255,255,0.35)', transition: 'border-color 200ms' }} />
      </div>
    </>
  )
}
