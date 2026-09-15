import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import MusicVisualizer from './MusicVisualizer.jsx'

export default function MusicPlayer({ audio }) {
  const [open, setOpen] = useState(false)
  const { isPlaying, muted, progress, currentTime, duration, fmt } = audio

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 max-md:bottom-4 max-md:right-4">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-56 rounded-2xl border border-white/10 bg-[#151A32]/95 p-4 shadow-xl backdrop-blur-md"
            role="group"
            aria-label="Kontrol musik"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[#F3A8C7]">
                <MusicVisualizer playing={isPlaying} audio={audio} />
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/50">
                  {isPlaying ? 'Playing' : 'Paused'}
                </span>
              </span>
              <button
                onClick={() => audio.setMuted(!muted)}
                aria-label={muted ? 'Suarakan musik' : 'Bisukan musik'}
                className="cursor-pointer rounded-full p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
            {/* progress */}
            <div className="mt-3">
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                onChange={(e) => audio.seek(Number(e.target.value))}
                disabled={!audio.hasFile}
                aria-label="Progress lagu"
                className="h-1 w-full cursor-pointer accent-[#F3A8C7] disabled:opacity-40"
              />
              <div className="mt-1 flex justify-between text-[10px] tabular-nums text-white/40">
                <span>{fmt(currentTime)}</span>
                <span>{fmt(duration)}</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={audio.volume}
              onChange={(e) => audio.setVolume(Number(e.target.value))}
              aria-label="Volume musik"
              className="mt-2 h-1 w-full cursor-pointer accent-[#B9A7FF]"
            />
            <div className="sr-only" aria-hidden={!progress}>Progress {Math.round((progress || 0) * 100)} persen</div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={audio.toggle}
        aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
        onContextMenu={(e) => {
          e.preventDefault()
          setOpen((v) => !v)
        }}
        className={`relative flex min-h-[52px] min-w-[52px] cursor-pointer items-center justify-center rounded-full border transition-all duration-300 ${
          isPlaying
            ? 'border-[#F3A8C7]/40 bg-[#F3A8C7]/15 text-[#F3A8C7] shadow-[0_0_24px_rgba(243,168,199,0.35)]'
            : 'border-white/10 bg-[#151A32]/90 text-white/80 backdrop-blur-md hover:text-white'
        }`}
      >
        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
      </button>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Buka panel musik"
        aria-expanded={open}
        className="flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#151A32]/90 text-white/60 backdrop-blur-md transition hover:text-white"
      >
        <MusicVisualizer playing={isPlaying} audio={audio} />
      </button>
    </div>
  )
}
