import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'cake', label: 'Cake' },
  { id: 'message', label: 'Message' },
  { id: 'memories', label: 'Memories' },
  { id: 'special', label: 'Special' },
]

export default function FloatingNavigation({ visible }) {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    if (!visible) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [visible])

  if (!visible) return null

  return (
    <nav aria-label="Navigasi section" className="fixed left-4 top-1/2 z-[80] hidden -translate-y-1/2 flex-col gap-3 md:flex">
      {SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-label={`Ke section ${label}`}
          aria-current={active === id ? 'true' : undefined}
          className={`block h-2.5 w-2.5 rounded-full transition-all duration-300 ${
            active === id ? 'scale-125 bg-[#F3A8C7] shadow-[0_0_12px_rgba(243,168,199,0.8)]' : 'bg-white/25 hover:bg-white/60'
          }`}
        />
      ))}
    </nav>
  )
}
