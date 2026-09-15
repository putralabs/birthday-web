import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

// Dot + soft ring. States: default, hover/interactive (scale), click (press).
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const [enabled, setEnabled] = useState(false)
  const reduced = useReducedMotion()

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
    let pressed = false

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      hovering = !!(e.target instanceof Element && e.target.closest('a,button,input,[role="button"]'))
    }
    const onDown = () => {
      pressed = true
    }
    const onUp = () => {
      pressed = false
    }

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.18
      ringPos.y += (pos.y - ringPos.y) * 0.18
      if (dot.current) dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${pressed ? 0.6 : 1})`
      if (ring.current) {
        ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) scale(${pressed ? 0.8 : hovering ? 1.6 : 1})`
        ring.current.style.borderColor = hovering || pressed ? 'rgba(243,168,199,0.8)' : 'rgba(255,255,255,0.35)'
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100]">
        <div ref={dot} className="h-1.5 w-1.5 rounded-full bg-[#F3A8C7]" style={{ margin: '-3px 0 0 -3px' }} />
      </div>
      <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100]">
        <div
          ref={ring}
          className="h-8 w-8 rounded-full border"
          style={{ margin: '-16px 0 0 -16px', borderColor: 'rgba(255,255,255,0.35)', transition: 'border-color 200ms' }}
        />
      </div>
    </>
  )
}
