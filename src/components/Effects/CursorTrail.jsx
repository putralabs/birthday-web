import { useEffect, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

// Capped low-opacity trail (max 12). Desktop precise pointers only.
export default function CursorTrail() {
  const [enabled, setEnabled] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    setEnabled(true)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return
    const trail = []
    let raf = 0
    const onMove = (e) => {
      trail.push({ x: e.clientX, y: e.clientY, life: 1 })
      if (trail.length > 12) trail.shift()
    }
    const loop = () => {
      const layer = document.getElementById('cursor-trail')
      if (layer) {
        trail.forEach((p) => {
          p.life -= 0.08
        })
        for (let i = trail.length - 1; i >= 0; i--) {
          if (trail[i].life <= 0) trail.splice(i, 1)
        }
        layer.innerHTML = trail
          .map(
            (p) =>
              `<span style="position:fixed;left:${p.x}px;top:${p.y}px;width:4px;height:4px;border-radius:99px;background:rgba(243,168,199,${(p.life * 0.35).toFixed(2)});pointer-events:none;transform:translate(-50%,-50%)"></span>`
          )
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
  return <div id="cursor-trail" aria-hidden="true" className="pointer-events-none fixed inset-0 z-[99]" />
}
