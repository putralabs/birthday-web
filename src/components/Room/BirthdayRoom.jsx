import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cake as CakeIcon, Gift, MailOpen, RotateCcw, Sparkles, X } from 'lucide-react'
import RoomCamera from './RoomCamera.jsx'
import RoomLighting from './RoomLighting.jsx'
import InteractiveLamp from './InteractiveLamp.jsx'
import InteractiveBalloon from './InteractiveBalloon.jsx'
import InteractiveFlower from './InteractiveFlower.jsx'
import InteractiveGift from './InteractiveGift.jsx'
import InteractiveWindow from './InteractiveWindow.jsx'
import PhotoWall from './PhotoWall.jsx'
import InteractiveHeart from './InteractiveHeart.jsx'
import SecretStars from './SecretStars.jsx'
import Candle from '../Cake/Candle.jsx'
import CakeFigure, { CAKE_CANDLE_COLORS } from '../Cake/CakeFigure.jsx'
import BlowDetector from '../Cake/BlowDetector.jsx'
import PhotoLightbox from '../Memories/PhotoLightbox.jsx'
import Particles from '../Effects/Particles.jsx'
import PersonalLetter from '../Letter/PersonalLetter.jsx'
import { birthdayData } from '../../data/birthdayData.js'
import { playSfx } from '../../hooks/useAudio.js'
import { useReducedMotion } from '../../hooks/useReducedMotion.js'

const BALLOONS = [
  { id: 'b1', color: '#F3A8C7', left: '6%', mLeft: '6%', top: '12%', size: 54, duration: 6, delay: 0, surprise: 'heart', stringH: 210 },
  { id: 'b2', color: '#B9A7FF', left: '22%', mLeft: '22%', top: '8%', size: 62, duration: 7.5, delay: 0.8, surprise: 'message', stringH: 250 },
  { id: 'b3', color: '#E8C77B', left: '72%', mLeft: '72%', top: '11%', size: 48, duration: 5.5, delay: 1.6, surprise: null, stringH: 215 },
  { id: 'b4', color: '#EE8FB5', left: '38%', mLeft: '38%', top: '15%', size: 44, duration: 6.8, delay: 2.2, surprise: 'stars', stringH: 110 },
]

// Object registry (PRD 78). Tambah objek di sini tanpa ubah struktur room.
export const ROOM_OBJECTS = [
  { id: 'lamp', type: 'interactive', position: { x: 46, y: 8 }, action: 'toggleLamp' },
  { id: 'window', type: 'ambient', position: { x: 13, y: 26 }, action: 'toggleCurtains' },
  { id: 'photos', type: 'interactive', position: { x: 82, y: 28 }, action: 'zoomPhoto' },
  { id: 'flower', type: 'interactive', position: { x: 13, y: 54 }, action: 'bloomFlower' },
  { id: 'wishes', type: 'interactive', position: { x: 70, y: 52 }, action: 'openWishes' },
  { id: 'gift', type: 'interactive', position: { x: 88, y: 85 }, action: 'openGift' },
  { id: 'cake', type: 'climax', position: { x: 50, y: 60 }, action: 'revealCake' },
]

export default function BirthdayRoom({ state, actions, flower, flowerActions, audio, confettiRef, fireworksRef, onReplay }) {
  const { lampOn, roomLight, focus, giftOpened, cakeRevealed, candles, cakeReady, wish, wishText, celebrationStarted, popped, foundSecrets, hint } = state
  const reduce = useReducedMotion()
  const [toast, setToast] = useState(null)
  const [overlay, setOverlay] = useState(null) // null | cake | wishes | message | letter | memories | final
  const [lightboxFromRoom, setLightboxFromRoom] = useState(null)
  const [par, setPar] = useState({ x: 0, y: 0 })
  const [wishDraft, setWishDraft] = useState(wishText || '')
  const [wishNote, setWishNote] = useState(0)
  const idleTimer = useRef(null)
  const toastTimer = useRef(null)
  const briefTimer = useRef(null)
  const focusRef = useRef(focus)
  const litCount = candles.filter(Boolean).length

  useEffect(() => { focusRef.current = focus }, [focus])
  useEffect(() => () => clearTimeout(briefTimer.current), [])

  // Zoom hint sekilas lalu langsung kembali ke wide.
  // Guard focusRef mencegah timer basi menimpa fokus baru.
  const zoomBriefly = useCallback((id, ms = 1800) => {
    clearTimeout(briefTimer.current)
    focusRef.current = id
    actions.setFocus(id)
    briefTimer.current = setTimeout(() => {
      if (focusRef.current === id) {
        focusRef.current = 'wide'
        actions.setFocus('wide')
      }
    }, ms)
  }, [actions])

  const say = useCallback((text, ms = 4200) => {
    setToast(text)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), ms)
  }, [])

  const poke = useCallback(() => {
    actions.setHint(null)
    clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => {
      if (!state.lampOn) actions.setHint('lamp')
      else if (!state.giftOpened) actions.setHint('gift')
      else if (!flower.discovered) actions.setHint('flower')
      else if (!state.celebrationStarted) actions.setHint('cake')
    }, 9000)
  }, [actions, state.lampOn, state.giftOpened, state.celebrationStarted, flower.discovered])

  useEffect(() => {
    poke()
    return () => clearTimeout(idleTimer.current)
  }, [poke])

  // Lamp on → flower starts growing (PRD 15).
  useEffect(() => {
    if (lampOn && flower.stage === 'bud') flowerActions.grow()
  }, [lampOn, flower.stage, flowerActions])

  // Celebration → flower full bloom (PRD 19 fallback).
  useEffect(() => {
    if (celebrationStarted && flower.stage !== 'full') flowerActions.fullBloom()
  }, [celebrationStarted, flower.stage, flowerActions])

  // Dim music on last candle (PRD 35).
  useEffect(() => {
    audio?.duck?.(cakeRevealed && litCount === 1)
  }, [litCount, cakeRevealed, audio])

  // All candles out → wish moment → celebration build-up.
  // cakeReady memastikan rangkaian nyala selesai dulu, jadi tombol
  // rayakan tidak nongol saat lilin masih proses nyala.
  // Rayakan wajib 4 syarat: lampu nyala, bunga mekar, gift kebuka,
  // semua lilin padam. Lampu dan gift sudah dikunci di revealCake.
  useEffect(() => {
    if (!cakeRevealed || !cakeReady || litCount > 0 || !flower.bloomed || wish !== 'idle') return
    actions.setWish('wish')
    const t = setTimeout(() => {
      playSfx('heartbeat')
      setOverlay(null)
      actions.setFocus('wide')
    }, 600)
    return () => clearTimeout(t)
  }, [litCount, cakeRevealed, cakeReady, flower.bloomed, wish, actions])

  const onMouse = reduce ? undefined : (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    setPar({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 })
  }

  const revealCake = () => {
    poke()
    if (!lampOn) {
      actions.setHint('lamp')
      actions.setFocus('wide')
      say('Nyalain lampunya dulu biar kelihatan.')
      return
    }
    if (!giftOpened) {
      actions.setHint('gift')
      zoomBriefly('gift')
      say('Buka hadiahnya dulu. Ada di kanan bawah.')
      return
    }
    playSfx('pop')
    actions.setFocus('cake')
    setOverlay('cake')
    if (!cakeRevealed) {
      actions.setCakeRevealed(true)
      CAKE_CANDLE_COLORS.forEach((_, i) => {
        setTimeout(() => {
          playSfx('tick')
          actions.lightCandle(i)
          if (i === CAKE_CANDLE_COLORS.length - 1) actions.setCakeReady(true)
        }, 500 + 380 * (i + 1))
      })
    }
  }

  const blow = (i) => {
    poke()
    playSfx('blow')
    navigator.vibrate?.(30)
    actions.blowCandle(i)
  }

  const registerWish = () => {
    playSfx('success')
    navigator.vibrate?.([30, 60, 30])
    actions.saveWishText(wishDraft.trim())
    actions.setWish('registered')
    // Tutup sheet kue biar selebrasi kelihatan, tidak ketutup.
    setOverlay(null)
    actions.setFocus('cake')
    // Candle finale build-up: pause → heartbeat → confetti → window fireworks.
    setTimeout(() => {
      confettiRef.current?.burst(140)
      fireworksRef.current?.launch(1)
      playSfx('firework')
    }, 700)
    setTimeout(() => {
      actions.setCelebration(true)
      actions.setRoomLight('celebration')
      actions.setFocus('window')
      fireworksRef.current?.launch(4)
      confettiRef.current?.burst(150, { name: 'INDAH' })
    }, 2200)
    setTimeout(() => {
      actions.setRoomLight('final')
      setOverlay('message')
      actions.setFocus('wide')
    }, 5200)
  }

  const openMemories = () => {
    setOverlay('memories')
    actions.setFocus('photos')
  }

  const openWishes = () => {
    poke()
    playSfx('sparkle')
    setWishNote(0)
    actions.setFocus('wishes')
    setOverlay('wishes')
  }

  const focusFlower = () => {
    poke()
    zoomBriefly('flower', 1500)
  }

  const memories = birthdayData.memories

  return (
    <div
      className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col overflow-hidden px-4 pb-10 pt-6 md:px-8"
      onMouseMove={onMouse}
      aria-label="Birthday room interaktif"
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#E8C77B]">Welcome to your little birthday room</p>
          <h2 data-autofocus tabIndex={-1} className="mt-2 font-display text-3xl text-[#FFF7EC] focus:outline-none md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
            Ketuk benda di ruangan ini.
          </h2>
        </div>
        <div className="hidden gap-2 md:flex" role="group" aria-label="Aksi cepat">
          <button onClick={revealCake} className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.2em] text-white/70 transition hover:border-[#E8C77B]/50 hover:text-white">
            <CakeIcon className="h-4 w-4" /> Cake
          </button>
          <button onClick={() => { zoomBriefly('gift'); say('Hadiahnya di kanan bawah. Buka pelan pelan.') }} className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.2em] text-white/70 transition hover:border-[#F3A8C7]/50 hover:text-white">
            <Gift className="h-4 w-4" /> Gift
          </button>
          <button onClick={onReplay} className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.2em] text-white/70 transition hover:border-white/40 hover:text-white">
            <RotateCcw className="h-4 w-4" /> Replay
          </button>
        </div>
      </div>

      {/* Room shell full dari teks Ketuk sampai bawah. Furnitur dan kamera
          di dalamnya, jadi ikut membesar sekalian. */}
      <div className="relative w-full flex-1 overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.5)]" style={{ minHeight: 'min(72vh, 640px)' }}>
        {/* ceiling + crown molding */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[6%] bg-[#0d1129]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-[6%] h-[1%] bg-[#E8C77B]/25" />
        {/* upper wall with subtle pattern */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[7%] h-[55%]"
          style={{
            background: '#26305a',
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0 10px, transparent 10px 26px), radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1.6px)',
            backgroundSize: 'auto, 24px 24px',
            transform: `translate(${par.x * -8}px, ${par.y * -6}px)`,
          }}
        />
        {/* framed mini art on the wall */}
        <div aria-hidden="true" className="absolute rounded-[3px] bg-[#3a2c20] p-[4px] shadow-[0_6px_16px_rgba(0,0,0,0.5)]" style={{ left: '33.5%', top: '21%', width: '9%' }}>
          <div className="flex aspect-[4/5] flex-col items-center justify-center gap-1 bg-gradient-to-b from-[#101736] to-[#3b2c4e]">
            <span className="text-sm leading-none text-[#FFF1D6] md:text-lg">☾</span>
            <span className="text-[8px] leading-none text-white/70">✦ ✦</span>
          </div>
        </div>
        <div aria-hidden="true" className="absolute rounded-[3px] bg-[#3a2c20] p-[4px] shadow-[0_6px_16px_rgba(0,0,0,0.5)]" style={{ left: '58%', top: '19%', width: '11%' }}>
          <div className="flex aspect-[4/5] flex-col items-center justify-center gap-1 bg-gradient-to-b from-[#2c2140] to-[#54383f]">
            <span className="text-base leading-none text-[#F3A8C7] md:text-xl">❀</span>
            <span className="h-px w-1/2 bg-[#E8C77B]/50" />
          </div>
        </div>
        {/* garland */}
        <svg aria-hidden="true" viewBox="0 0 800 60" className="absolute inset-x-0 top-[7%] h-12 w-full opacity-70" preserveAspectRatio="none">
          <path d="M0 8 Q 200 44 400 14 T 800 20" stroke="#E8C77B" strokeWidth="2" fill="none" opacity="0.6" />
          {Array.from({ length: 12 }).map((_, i) => (
            <g key={i} transform={`translate(${40 + i * 64}, ${18 + (i % 3) * 6})`}>
              <polygon points="0,-7 6,5 0,2 -6,5" fill={['#F3A8C7', '#B9A7FF', '#E8C77B'][i % 3]} opacity="0.9" />
            </g>
          ))}
        </svg>
        {/* chair rail with highlight */}
        <div aria-hidden="true" className="absolute inset-x-0 top-[62%] h-[1.5%] bg-[#101426]/80" />
        <div aria-hidden="true" className="absolute inset-x-0 top-[62%] h-[2px] bg-white/15" />
        {/* paneled wainscot */}
        <div aria-hidden="true" className="absolute inset-x-0 top-[63.5%] flex h-[4.5%] items-stretch justify-evenly bg-[#232c4e] px-[3%]">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="my-[3px] w-[12%] rounded-[2px] border border-black/50 bg-white/[0.03]"
              style={{ boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.14)' }}
            />
          ))}
        </div>
        {/* baseboard */}
        <div aria-hidden="true" className="absolute inset-x-0 top-[68%] h-[2.5%] bg-gradient-to-b from-[#efe6cc] to-[#c9bd9c]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-[68%] h-[2px] bg-black/30" />
        {/* plank floor with staggered butt joints */}
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[29.5%] overflow-hidden" style={{ background: 'linear-gradient(180deg, #4a3a32 0%, #33261f 70%, #241a15 100%)', transform: `translate(${par.x * 8}px, 0)` }}>
          {Array.from({ length: 5 }).map((_, r) => (
            <div
              key={r}
              className="relative w-full border-b border-black/50"
              style={{
                height: '20%',
                background: r % 2 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.10)',
                backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 90px, rgba(0,0,0,0.35) 90px 92px)',
                backgroundPositionX: `${r * 37}px`,
              }}
            />
          ))}
          <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-white/10" />
        </div>
        {/* cahaya lampu ikut di dalam layer kamera biar nempel sama lampunya pas zoom */}
        {/* cool moonlight pool under the window */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[3%] h-[9%] w-[26%] rounded-[50%] bg-[#9db4ff]/20 blur-xl transition-opacity duration-1000"
          style={{ left: '3%', opacity: lampOn ? 0.3 : 0.8 }}
        />
        {/* patterned rug centered under the cake table */}
        <div aria-hidden="true" className="absolute bottom-[1.5%] left-1/2 h-[13%] w-[60%] -translate-x-1/2">
          <div className="absolute inset-0 rounded-[50%] bg-[#4e2633] shadow-[0_10px_24px_rgba(0,0,0,0.45)]" />
          <div className="absolute inset-[12%] rounded-[50%] border-2 border-[#E8C77B]/50 bg-[#6e3644]" />
          <div className="absolute inset-[26%] rounded-[50%] bg-[#4e2633]" />
          <div className="absolute left-1/2 top-1/2 aspect-square h-[52%] -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[#E8C77B]/60" />
        </div>
        {/* camera layer with all interactive objects */}
        <RoomCamera focus={focus}>
          <div style={{ transform: `translate(${par.x * 18}px, ${par.y * 10}px)` }} className="absolute inset-0">
            {/* jendela di dinding belakang. Pot bunga duduk di kusennya.
                Furnitur dicat di depannya */}
            <InteractiveWindow
              celebration={celebrationStarted}
              onInteract={poke}
              sillSlot={
                <InteractiveFlower
                  style={{ position: 'relative', left: 'auto', bottom: 'auto', width: '100%' }}
                  flower={flower}
                  actions={flowerActions}
                  hint={hint === 'flower'}
                  celebration={celebrationStarted}
                  onDiscover={() => { focusFlower(); say('Tuh bunganya mulai buka. Coba pencet tengahnya.') }}
                  onSecret={() => { actions.findSecret('flower'); say(birthdayData.secrets.flower) }}
                />
              }
            />
            {/* cone cahaya mulai dari bohlam, bukan dari atas lampu */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[19%] h-[51%] w-[46%] -translate-x-1/2 transition-opacity duration-700"
              style={{
                left: '46%',
                opacity: lampOn ? 1 : 0,
                background: 'linear-gradient(180deg, rgba(255,220,160,0.22), rgba(255,220,160,0.05) 70%, transparent)',
                clipPath: 'polygon(47% 0, 53% 0, 100% 100%, 0 100%)',
                filter: 'blur(6px)',
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-[2%] left-1/2 h-[10%] w-[44%] -translate-x-1/2 rounded-[50%] bg-[#ffdf9e]/25 blur-xl transition-opacity duration-700"
              style={{ opacity: lampOn ? 1 : 0 }}
            />
            {/* armchair next to the window */}
            <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: '18%', bottom: '4%', width: '17%', height: '37%' }}>
              <div className="absolute inset-x-[8%] bottom-0 h-[6%] rounded-[50%] bg-black/45 blur-[4px]" />
              <div className="absolute bottom-[2%] left-[10%] h-[9%] w-[5%] rounded bg-gradient-to-b from-[#5b4232] to-[#3a2a20]" />
              <div className="absolute bottom-[2%] right-[10%] h-[9%] w-[5%] rounded bg-gradient-to-b from-[#5b4232] to-[#3a2a20]" />
              <div className="absolute inset-x-[10%] top-0 h-[64%] rounded-t-[2rem] border border-black/40 bg-gradient-to-b from-[#4a5794] via-[#3a4678] to-[#28304f]" />
              <div className="absolute inset-x-[19%] top-[7%] h-[45%] rounded-t-[1.6rem] border border-black/30 bg-gradient-to-b from-[#5a68a8] to-[#3f4c82] shadow-[inset_0_-8px_14px_rgba(0,0,0,0.35)]" />
              <div className="absolute bottom-[9%] left-0 top-[34%] w-[18%] rounded-[1.2rem] border border-black/40 bg-gradient-to-b from-[#414d85] to-[#28304f]" />
              <div className="absolute bottom-[9%] right-0 top-[34%] w-[18%] rounded-[1.2rem] border border-black/40 bg-gradient-to-b from-[#414d85] to-[#28304f]" />
              <div className="absolute inset-x-[16%] bottom-[9%] top-[52%] rounded-xl border border-black/40 bg-[#333d68]" />
              <div className="absolute inset-x-[19%] bottom-[17%] top-[49%] rounded-lg bg-gradient-to-b from-[#525f9c] to-[#3f4c82] shadow-[inset_0_-6px_10px_rgba(0,0,0,0.3)]" />
              <div className="absolute inset-x-[19%] bottom-[17%] h-[3px] bg-[#E8C77B]/30" />
              <div className="absolute left-[25%] top-[39%] h-[20%] w-[30%] rotate-[-8deg] rounded-lg border border-black/25 bg-gradient-to-br from-[#F3A8C7] to-[#d97b9c] shadow-md">
                <span className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a34a68]" />
              </div>
            </div>
            {/* meja utama pakai taplak. Kue ditaruh di atasnya */}
            <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: '34%', bottom: '2%', width: '32%', height: '36%' }}>
              <div className="absolute inset-x-[4%] bottom-0 h-[5%] rounded-[50%] bg-black/45 blur-[4px]" />
              <div
                className="absolute inset-x-[6%] bottom-[1%] top-[8%] bg-[#8f6f5e]"
                style={{ clipPath: 'polygon(7% 0, 93% 0, 100% 100%, 0 100%)', boxShadow: 'inset 0 -18px 24px rgba(0,0,0,0.35)' }}
              />
              <div className="absolute inset-x-[6%] bottom-[1%] top-[8%] opacity-25" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 18px, rgba(0,0,0,0.5) 18px 20px)', clipPath: 'polygon(7% 0, 93% 0, 100% 100%, 0 100%)' }} />
              <div className="absolute inset-x-[6%] bottom-[1%] h-[3%] bg-[#5e2f3d]/60" style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)' }} />
              <div className="absolute inset-x-0 top-0 h-[8%] rounded-t-lg bg-gradient-to-b from-[#8a6247] to-[#54382a] shadow-[0_3px_6px_rgba(0,0,0,0.5)]" />
              <div className="absolute left-1/2 top-[1%] h-[7%] w-[34%] -translate-x-1/2 rounded-[2px] bg-gradient-to-r from-[#c9a24d] via-[#E8C77B] to-[#c9a24d]" />
            </div>
            {/* cake plate on the tabletop */}
            <div aria-hidden="true" className="pointer-events-none absolute left-1/2 w-[120px] max-w-[46%] -translate-x-1/2 rounded-[50%] border border-[#c9a24d]/60 bg-gradient-to-b from-white to-[#d9cfae] shadow-md md:w-[170px]" style={{ bottom: '37.4%', height: '2%' }} />
            {/* credenza isi buku. Hati kecil ditaruh di atasnya */}
            <div aria-hidden="true" className="pointer-events-none absolute" style={{ left: '66%', bottom: '3%', width: '13%', height: '42%' }}>
              <div className="absolute inset-x-[4%] bottom-0 h-[4%] rounded-[50%] bg-black/45 blur-[4px]" />
              <div className="absolute bottom-[1%] left-[10%] h-[12%] w-[6%] bg-gradient-to-b from-[#5b4232] to-[#3a2a20]" />
              <div className="absolute bottom-[1%] right-[10%] h-[12%] w-[6%] bg-gradient-to-b from-[#5b4232] to-[#3a2a20]" />
              <div className="absolute inset-x-0 bottom-[12%] top-[5%] rounded-sm border border-black/40 bg-gradient-to-b from-[#7a563d] via-[#6b4c3a] to-[#4e3427]" />
              <div className="absolute bottom-[15%] left-[6%] top-[12%] w-[40%] rounded-[3px] border border-black/40 bg-black/15" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }} />
              <div className="absolute bottom-[15%] right-[6%] top-[12%] w-[40%] rounded-[3px] border border-black/40 bg-black/15" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)' }} />
              <div className="absolute bottom-[46%] left-[34%] top-[36%] w-[9%] rounded-full bg-gradient-to-br from-[#ffe9a8] to-[#c9a24d] shadow-sm">
                <span className="absolute left-[2px] top-[2px] h-[3px] w-[3px] rounded-full bg-white/80" />
              </div>
              <div className="absolute bottom-[46%] right-[34%] top-[36%] w-[9%] rounded-full bg-gradient-to-br from-[#ffe9a8] to-[#c9a24d] shadow-sm">
                <span className="absolute left-[2px] top-[2px] h-[3px] w-[3px] rounded-full bg-white/80" />
              </div>
              <div className="absolute inset-x-0 top-0 h-[6%] rounded bg-gradient-to-b from-[#9a6f4e] to-[#5e3d2d] shadow-[0_2px_5px_rgba(0,0,0,0.5)]" />
              <div className="absolute inset-x-0 top-[5%] h-[2px] bg-white/20" />
              {/* book row standing on the surface. Di HP disembunyiin
                  biar muat sama toples */}
              <div className="absolute -top-[15%] left-[10%] hidden origin-bottom-left items-end gap-[3px] scale-[0.7] md:flex md:scale-100">
                <span className="relative block w-[9px] rounded-t-sm bg-[#F3A8C7]" style={{ height: '34px' }}>
                  <span className="absolute inset-y-[3px] left-[1px] w-[2px] bg-white/70" />
                </span>
                <span className="relative block w-[9px] rounded-t-sm bg-[#B9A7FF]" style={{ height: '42px' }}>
                  <span className="absolute inset-y-[3px] left-[1px] w-[2px] bg-white/70" />
                </span>
                <span className="relative block w-[9px] rounded-t-sm bg-[#E8C77B]" style={{ height: '30px' }}>
                  <span className="absolute inset-y-[3px] left-[1px] w-[2px] bg-white/70" />
                </span>
              </div>
            </div>
            {/* gift contact shadow on the floor */}
            <div aria-hidden="true" className="pointer-events-none absolute rounded-[50%] bg-black/45 blur-[4px]" style={{ left: '81.5%', bottom: '2%', width: '14%', height: '2.5%' }} />
            {/* small deco gift on the floor, right of the gift corner */}
            <div aria-hidden="true" className="pointer-events-none absolute" style={{ right: '1%', bottom: '3%', width: '5%' }}>
              <div className="relative mx-auto origin-bottom scale-75 md:scale-100" style={{ width: '42px', height: '44px' }}>
                <span className="absolute bottom-0 left-1/2 h-[8px] w-[30px] -translate-x-1/2 rounded-[50%] bg-black/40 blur-[2px]" />
                <span className="absolute bottom-[4px] left-1/2 h-[10px] w-[16px] -translate-x-1/2 rotate-[-18deg] rounded-[50%] border-2 border-[#F3A8C7]" />
                <span className="absolute bottom-[4px] left-1/2 h-[10px] w-[16px] -translate-x-1/2 rotate-[18deg] rounded-[50%] border-2 border-[#F3A8C7]" />
                <span className="absolute bottom-[10px] left-1/2 h-[26px] w-[42px] -translate-x-1/2 rounded-[4px] border border-black/25 bg-gradient-to-b from-[#c4b3ff] to-[#9a86e8]" />
                <span className="absolute bottom-[10px] left-1/2 h-[26px] w-[8px] -translate-x-1/2 bg-[#F3A8C7]/90" />
                <span className="absolute bottom-[32px] left-1/2 h-[8px] w-[48px] -translate-x-1/2 rounded-[3px] bg-[#8f7fe8] shadow-sm" />
                <span className="absolute bottom-[14px] left-[64%] h-[14px] w-[10px] rotate-[24deg] rounded-[1px] bg-[#FFF7EC]/90 text-center text-[6px] leading-[14px] text-[#a34a68]">♥</span>
              </div>
            </div>
            <PhotoWall
              style={{ right: '5%', top: '11%', width: '11%' }}
              hint={hint === 'photos'}
              onZoom={(i) => { poke(); setLightboxFromRoom(i) }}
              onSecret={() => { poke(); actions.findSecret('photo'); say(birthdayData.secrets.photo) }}
            />
            <SecretStars
              found={foundSecrets}
              onFind={(id) => { poke(); actions.findSecret(id); playSfx('sparkle') }}
              onUnlockAll={() => { confettiRef.current?.burst(90); say(birthdayData.secrets.starsUnlocked) }}
            />
            <InteractiveLamp
              on={lampOn}
              hint={hint === 'lamp'}
              celebrating={celebrationStarted}
              onToggle={() => { poke(); actions.toggleLamp(); if (!lampOn) say('Nah gitu. Hangat kan sekarang.') }}
              onParty={() => { actions.findSecret('lamp-party'); say(birthdayData.secrets.lamp) }}
            />
            <InteractiveHeart style={{ left: '19.5%', bottom: '11%', right: 'auto', top: 'auto' }} onFound={() => { poke(); actions.findSecret('heart'); }} />
            {BALLOONS.map((b) => (
              <InteractiveBalloon
                key={b.id}
                {...b}
                popped={!!popped[b.id]}
                hint={false}
                onPop={(id, surprise) => {
                  poke()
                  actions.setPopped({ ...popped, [id]: true })
                  if (surprise === 'message') say(birthdayData.secrets.balloon)
                  if (surprise === 'heart') confettiRef.current?.burst(50)
                  if (surprise === 'stars') { actions.findSecret('balloon-stars'); say('Duar. Jadi bintang kecil tuh.') }
                }}
              />
            ))}
            <InteractiveGift
              style={{ right: '5.5%', bottom: '3%' }}
              opened={giftOpened}
              hint={hint === 'gift'}
              onInteract={() => { poke(); zoomBriefly('gift') }}
              onOpen={() => { actions.setGiftOpened(true); actions.setFocus('wide'); say('Disimpen ya pesannya. Sekarang lihat ke meja tengah.') }}
            />
            {/* toples harapan di atas lemari. PRD 46 */}
            <div className="absolute z-10 left-[65.5%] md:left-[71%] w-[52px] md:w-[64px]" style={{ bottom: '44%' }}>
              <button
                onClick={openWishes}
                aria-label="Buka toples harapan"
                className="block w-full cursor-pointer rounded-2xl p-1 min-h-[52px] min-w-[52px] md:min-h-[64px] md:min-w-[64px]"
              >
                <span aria-hidden="true" className="relative mx-auto block h-16 w-12">
                  <span className="absolute left-1/2 top-0 h-2 w-8 -translate-x-1/2 rounded-full bg-[#B9A7FF]/70" />
                  <span className="absolute bottom-0 left-1/2 h-12 w-12 -translate-x-1/2 rounded-b-2xl rounded-t-md border-2 border-white/25 bg-white/5" />
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#E8C77B]">★ ★</span>
                  <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-[#F3A8C7]">★</span>
                </span>
              </button>
            </div>
            {/* tombol meja kue. Kue nangkring di atas meja */}
            <div className="absolute z-10" style={{ left: '38%', bottom: '37.5%', width: '24%' }}>
              <button
                onClick={revealCake}
                aria-label={cakeRevealed ? 'Lihat kue ulang tahun' : 'Temukan kue ulang tahun'}
                className={`flex w-full cursor-pointer items-end justify-center ${hint === 'cake' ? 'hint-glow rounded-2xl' : ''} min-h-[72px]`}
              >
                <span aria-hidden="true" className="relative mx-auto block w-fit">
                  {(hint === 'cake' || !cakeRevealed) && <span className="animate-glow absolute -inset-3 rounded-full bg-[#E8C77B]/20 blur-lg" />}
                  <CakeFigure miniCandles candles={candles} float className="w-24 md:w-36" />
                </span>
              </button>
            </div>
          </div>
        </RoomCamera>

        <RoomLighting lighting={roomLight} lampOn={lampOn} />
        {/* vignette above room + lighting for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
          style={{ boxShadow: 'inset 0 0 110px rgba(4,6,16,0.55), inset 0 24px 60px rgba(4,6,16,0.35)' }}
        />
        {celebrationStarted && <Particles variant="sparkles" density={0.8} />}

        {/* toast */}
        <AnimatePresence>
          {toast && (
            <motion.p
              key={toast}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="status"
              className="absolute left-1/2 z-40 w-max max-w-[86%] -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-5 py-2.5 text-center text-sm text-[#FFF7EC] backdrop-blur-sm"
              style={{ top: '15%' }}
            >
              {toast}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* progress dots */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/40" aria-label="Progres kejutan">
        {[
          ['Lampu', lampOn],
          ['Gift', giftOpened],
          ['Bunga', flower.bloomed],
          ['Cake', cakeRevealed],
          ['Rayakan', celebrationStarted],
        ].map(([label, done]) => (
          <span key={label} className={`rounded-full border px-3 py-1 ${done ? 'border-[#E8C77B]/50 text-[#E8C77B]' : 'border-white/10'}`}>
            {done ? '✦ ' : '○ '}{label}
          </span>
        ))}
      </div>

      {/* aksi HP. Tombol di atas cuma muncul di laptop */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 md:hidden">
        <button onClick={openWishes} className="min-h-[44px] cursor-pointer rounded-full border border-white/15 px-5 py-2 text-xs text-white/70">Toples harapan</button>
      </div>

      {/* wish moment banner */}
      <AnimatePresence>
        {wish === 'wish' && !overlay && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto mt-6 max-w-md text-center" role="status">
            <p className="font-display text-3xl italic text-[#FFF7EC]" style={{ fontFamily: 'var(--font-display)' }}>Make a wish.</p>
            <p className="mt-2 text-sm text-white/55">Pejamkan mata sebentar, lalu tulis atau simpan harapanmu di kue.</p>
            <button onClick={() => { actions.setFocus('cake'); setOverlay('cake') }} className="mt-4 min-h-[48px] cursor-pointer rounded-full bg-[#E8C77B] px-8 py-3 text-sm font-semibold text-[#101426] transition hover:scale-[1.03] active:scale-95">
              Tulis harapan
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* cake bottom sheet */}
      <AnimatePresence>
        {overlay === 'cake' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[75] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label="Kue ulang tahun" onClick={() => { setOverlay(null); actions.setFocus('wide') }}>
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#151A32] p-6 text-center shadow-2xl md:p-8"
            >
              <button onClick={() => { setOverlay(null); actions.setFocus('wide') }} aria-label="Tutup kue" className="absolute right-3 top-3 flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
              <p className="text-[11px] uppercase tracking-[0.3em] text-[#B9A7FF]">
                {litCount > 0 ? `Tersisa ${litCount} lilin menyala` : !cakeReady ? 'Lilin menyala satu per satu...' : !flower.bloomed ? 'Bunganya belum mekar.' : 'Semua lilin padam'}
              </p>
              <div className="relative mx-auto mt-4 w-[260px]" role="group" aria-label="Lilin ulang tahun">
                <CakeFigure candles={candles} label="Kue ulang tahun" className="w-full" />
                {/* lilin nancap di tingkat atas, dikecilin ngikutin
                    proporsi lilin di kue meja */}
                {candles.map((lit, i) => (
                  <div
                    key={i}
                    className="absolute -translate-x-1/2 origin-bottom scale-[0.55]"
                    style={{ left: ['32%', '41%', '50%', '59%', '68%'][i], bottom: '105px' }}
                  >
                    <Candle index={i} lit={lit} color={CAKE_CANDLE_COLORS[i]} onBlow={() => blow(i)} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-col items-center gap-3">
                <BlowDetector active={litCount > 0} onBlow={() => blow(-1)} />
                {litCount > 0 && (
                  <button onClick={() => blow(-1)} className="min-h-[48px] cursor-pointer rounded-full bg-[#FFF7EC] px-8 py-3 text-sm font-semibold text-[#101426] transition hover:scale-[1.03] active:scale-95">
                    Tiup satu lilin
                  </button>
                )}
                {litCount === 0 && cakeReady && !flower.bloomed && (
                  <div className="w-full">
                    <p className="text-sm leading-relaxed text-white/60">Satu lagi. Mekarkan bunganya dulu yang di kusen jendela.</p>
                    <button onClick={() => { setOverlay(null); focusFlower() }} className="mt-3 min-h-[48px] w-full cursor-pointer rounded-full bg-[#FFF7EC] px-8 py-3 text-sm font-semibold text-[#101426] transition hover:scale-[1.02] active:scale-95">
                      Ke bunga
                    </button>
                  </div>
                )}
                {litCount === 0 && cakeReady && flower.bloomed && wish !== 'idle' && wish !== 'registered' && (
                  <div className="w-full">
                    <label htmlFor="wish-input" className="text-xs uppercase tracking-[0.25em] text-white/50">Make a wish...</label>
                    <input
                      id="wish-input"
                      value={wishDraft}
                      onChange={(e) => setWishDraft(e.target.value)}
                      placeholder="Tulis harapanmu (tersimpan di HP ini saja)"
                      maxLength={140}
                      className="mt-2 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#E8C77B]/60 focus:outline-none"
                    />
                    <button onClick={registerWish} className="mt-3 min-h-[48px] w-full cursor-pointer rounded-full bg-[#F3A8C7] px-8 py-3 text-sm font-semibold text-[#101426] transition hover:scale-[1.02] active:scale-95">
                      <Sparkles className="mr-2 inline h-4 w-4" />Kunci harapan & rayakan
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* toples harapan. PRD 46. Catatan keluar satu per satu */}
      <AnimatePresence>
        {overlay === 'wishes' && (
          <Sheet onClose={() => { setOverlay(null); actions.setFocus('wide') }} label="Toples harapan">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#E8C77B]">A little wish for you</p>
            <div className="mx-auto mt-4 min-h-[96px] max-w-md rounded-2xl bg-[#FFF7EC] p-5 text-left text-[#1d2440]">
              <p key={wishNote} className="text-sm leading-relaxed">{birthdayData.wishes[wishNote]}</p>
            </div>
            <p className="mt-3 text-xs text-white/40">{wishNote + 1} dari {birthdayData.wishes.length}</p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => setWishNote((n) => (n - 1 + birthdayData.wishes.length) % birthdayData.wishes.length)}
                className="min-h-[44px] cursor-pointer rounded-full border border-white/15 px-6 py-2 text-xs uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
              >
                Balik
              </button>
              <button
                onClick={() => setWishNote((n) => (n + 1) % birthdayData.wishes.length)}
                className="min-h-[44px] cursor-pointer rounded-full bg-[#FFF7EC] px-6 py-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#101426] transition hover:scale-[1.03]"
              >
                Lanjut
              </button>
            </div>
          </Sheet>
        )}
      </AnimatePresence>

      {/* celebration message */}
      <AnimatePresence>
        {overlay === 'message' && (
          <Sheet onClose={() => { setOverlay(null); actions.setFocus('wide') }} label="Pesan ulang tahun">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#E8C77B]">Happy Birthday</p>
            <h3 className="mt-2 font-display text-3xl text-[#FFF7EC] md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>
              Indah Nurul Qur&apos;ani
            </h3>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/70">{birthdayData.messages.final}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={() => setOverlay('letter')} className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full bg-[#FFF7EC] px-7 py-3 text-sm font-semibold text-[#101426] transition hover:scale-[1.03] active:scale-95">
                <MailOpen className="h-4 w-4" /> Buka surat
              </button>
              <button onClick={openMemories} className="min-h-[48px] cursor-pointer rounded-full border border-white/15 px-7 py-3 text-sm text-white/75 transition hover:border-[#F3A8C7]/50 hover:text-white">
                Lihat kenangan
              </button>
            </div>
          </Sheet>
        )}
      </AnimatePresence>

      {/* letter */}
      <AnimatePresence>
        {overlay === 'letter' && (
          <Sheet onClose={() => setOverlay('message')} label="Surat untuk Indah">
            <PersonalLetter onDone={openMemories} />
          </Sheet>
        )}
      </AnimatePresence>

      {/* memories */}
      <AnimatePresence>
        {overlay === 'memories' && (
          <Sheet wide onClose={() => { setOverlay(null); actions.setFocus('wide') }} label="Kenangan">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#E8C77B]">A Little Timeline</p>
            <h3 className="mt-2 font-display text-3xl text-[#FFF7EC]" style={{ fontFamily: 'var(--font-display)' }}>Potongan cerita <span className="italic text-[#F3A8C7]">tentangmu</span></h3>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {memories.map((m, i) => (
                <button key={m.image + i} onClick={() => setLightboxFromRoom(i)} aria-label={`Perbesar: ${m.title}`} className="group cursor-pointer overflow-hidden rounded-2xl bg-[#FFF7EC] p-1.5 pb-2 text-left shadow-lg transition hover:scale-[1.03]">
                  <RoomMemoryThumb image={m.image} alt={m.title} />
                  <span className="block px-1.5 pb-1 pt-1.5 font-display text-xs italic text-[#1d2440]" style={{ fontFamily: 'var(--font-display)' }}>{m.title}</span>
                  <span className="block px-1.5 pb-1 text-[10px] uppercase tracking-[0.15em] text-[#1d2440]/45">{m.date}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setOverlay('final')} className="mt-6 min-h-[48px] cursor-pointer rounded-full bg-[#E8C77B] px-8 py-3 text-sm font-semibold text-[#101426] transition hover:scale-[1.03] active:scale-95">
              Ke akhir cerita →
            </button>
          </Sheet>
        )}
      </AnimatePresence>

      {/* final */}
      <AnimatePresence>
        {overlay === 'final' && (
          <Sheet onClose={() => { setOverlay(null); actions.setFocus('wide') }} label="Akhir cerita">
            <span aria-hidden="true" className="text-2xl text-[#E8C77B]">✦</span>
            <h3 className="mt-3 font-display text-3xl text-[#FFF7EC] md:text-4xl" style={{ fontFamily: 'var(--font-display)' }}>Happy Birthday, Indah.</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/60">For Indah. {birthdayData.messages.finalCredit}</p>
            {wishText && (
              <p className="mx-auto mt-4 max-w-sm rounded-2xl border border-[#E8C77B]/25 bg-[#E8C77B]/5 px-4 py-3 text-sm italic text-[#E8C77B]" role="note">
                Harapanmu tersimpan: “{wishText}”
              </p>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button onClick={onReplay} className="inline-flex min-h-[48px] cursor-pointer items-center gap-2 rounded-full bg-[#FFF7EC] px-8 py-3 text-sm font-semibold text-[#101426] transition hover:scale-[1.03] active:scale-95">
                <RotateCcw className="h-4 w-4" /> Replay the surprise
              </button>
              <a href={birthdayData.reply.url} target="_blank" rel="noreferrer" className="inline-flex min-h-[48px] items-center rounded-full border border-[#F3A8C7]/40 px-7 py-3 text-xs uppercase tracking-[0.2em] text-[#F3A8C7] transition hover:bg-[#F3A8C7]/10">
                {birthdayData.reply.label}
              </a>
            </div>
          </Sheet>
        )}
      </AnimatePresence>

      {/* room photo lightbox */}
      <AnimatePresence>
        {lightboxFromRoom != null && (
          <PhotoLightbox
            photos={memories.map((m) => ({ image: m.image, caption: `${m.title}. ${m.description}`, alt: m.title }))}
            index={lightboxFromRoom}
            onClose={() => { setLightboxFromRoom(null); actions.setFocus('wide') }}
            onNav={(v) => setLightboxFromRoom(typeof v === 'function' ? v(lightboxFromRoom) : v)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function Sheet({ children, onClose, label, wide }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[75] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label={label} onClick={onClose}>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className={`relative max-h-[86dvh] w-full overflow-y-auto rounded-3xl border border-white/10 bg-[#151A32] p-6 text-center shadow-2xl md:p-8 ${wide ? 'max-w-2xl' : 'max-w-lg'}`}
      >
        <button onClick={onClose} aria-label="Tutup" className="absolute right-3 top-3 flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white">
          <X className="h-5 w-5" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  )
}

function RoomMemoryThumb({ image, alt }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span className="flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br from-[#F3A8C7] to-[#B9A7FF]" role="img" aria-label={alt}>
        <span className="font-display text-2xl italic text-white/90" style={{ fontFamily: 'var(--font-display)' }}>I</span>
      </span>
    )
  }
  return <img src={image} alt={alt} loading="lazy" onError={() => setFailed(true)} className="aspect-square w-full rounded-xl bg-[#1d2440] object-cover" />
}
