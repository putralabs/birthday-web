import { useState } from 'react'
import { motion } from 'framer-motion'
import { playSfx } from '../../hooks/useAudio.js'

// Window to the night sky. Curtains toggle. Fireworks glow during celebration.
// sillSlot: node opsional yang duduk di atas kusen (misal pot bunga).
export default function InteractiveWindow({ celebration, onInteract, sillSlot }) {
  const [open, setOpen] = useState(true)

  const toggle = () => {
    onInteract?.()
    playSfx('click')
    setOpen((o) => !o)
  }

  return (
    <div className="absolute z-10 w-[26%] md:w-[19%]" style={{ left: '4%', top: '9%' }}>
      <button
        onClick={toggle}
        aria-label={open ? 'Tutup gorden' : 'Buka gorden'}
        aria-expanded={open}
        className="relative block w-full cursor-pointer rounded-lg border-4 border-[#2a3358] bg-[#0B0E20]"
      >
        {/* sky */}
        <span aria-hidden="true" className="relative block aspect-[4/5] overflow-hidden rounded-sm">
          <span className="absolute inset-0 bg-gradient-to-b from-[#0B0E20] via-[#151A32] to-[#232c52]" />
          {/* moon */}
          <span className="absolute right-[18%] top-[12%] block h-7 w-7 rounded-full bg-[#FFF1D6] shadow-[0_0_16px_4px_rgba(255,241,214,0.35)]" />
          {/* stars */}
          {[
            ['12%', '18%'], ['30%', '34%'], ['55%', '14%'], ['72%', '40%'],
            ['22%', '58%'], ['64%', '62%'], ['42%', '74%'], ['82%', '22%'],
          ].map(([l, t], i) => (
            <span
              key={i}
              className="animate-glow absolute rounded-full bg-white/80"
              style={{ left: l, top: t, width: 2 + (i % 2), height: 2 + (i % 2), animationDelay: `${i * 0.4}s` }}
            />
          ))}
          {/* clouds */}
          <motion.span
            aria-hidden="true"
            className="absolute top-[46%] h-4 w-16 rounded-full bg-white/10 blur-[3px]"
            animate={{ x: ['-10%', '60%'] }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
          />
          {/* window mullions */}
          <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-[6px] -translate-x-1/2 bg-[#2a3358] shadow-[0_0_6px_rgba(0,0,0,0.6)]" />
          <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 bg-[#2a3358] shadow-[0_0_6px_rgba(0,0,0,0.6)]" />
          {/* fireworks glow */}
          {celebration && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0"
              animate={{ opacity: [0, 0.7, 0.1, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ background: 'radial-gradient(circle at 60% 30%, rgba(243,168,199,0.5), transparent 60%)' }}
            />
          )}
        </span>
        {/* curtains */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[26%] bg-gradient-to-r from-[#8f7fe8] to-[#6f61d6]"
          animate={{ x: open ? '-78%' : '0%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-[26%] bg-gradient-to-l from-[#8f7fe8] to-[#6f61d6]"
          animate={{ x: open ? '78%' : '0%' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </button>
      {/* windowsill with apron */}
      <div aria-hidden="true" className="mx-[-7%] h-[10px] rounded-sm bg-gradient-to-b from-[#efe6cc] to-[#a89a78] shadow-[0_4px_8px_rgba(0,0,0,0.5)]" />
      <div aria-hidden="true" className="mx-auto h-[8px] w-[70%] rounded-b-sm bg-[#2a3358]" />
      {/* barang di atas kusen. Pot selalu napak karena nempel ke jendela */}
      {sillSlot && (
        <div className="absolute left-1/2 z-10 w-[88px] -translate-x-1/2 md:w-[58%]" style={{ bottom: '8px' }}>
          {sillSlot}
        </div>
      )}
    </div>
  )
}
