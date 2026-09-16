import { useCallback, useEffect, useMemo, useState } from 'react'
import { birthdayData } from '../data/birthdayData.js'

export function jakartaYMD(d = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d)
}

export function birthdayStart() {
  return new Date(`${birthdayData.birthday}T00:00:00+07:00`)
}

function resolveMode() {
  try {
    if (import.meta.env?.DEV) {
      const q = new URLSearchParams(window.location.search).get('as')
      if (q === 'before' || q === 'birthday' || q === 'after') return q
    }
  } catch {
    /* non-browser */
  }
  const today = jakartaYMD()
  if (today < birthdayData.birthday) return 'before'
  if (today === birthdayData.birthday) return 'birthday'
  return 'after'
}

// Central experience state (PRD 76, 77). Music lives in AudioProvider so it never restarts.
export function useBirthdayState() {
  const [mode, setMode] = useState(() => resolveMode())
  const [now, setNow] = useState(() => Date.now())
  const [scene, setScene] = useState('loading')
  const [lampOn, setLampOn] = useState(false)
  const [roomLight, setRoomLight] = useState('dark') // dark | warm | celebration | final
  const [focus, setFocus] = useState('wide') // wide | gift | flower | cake | window | photos
  const [giftOpened, setGiftOpened] = useState(false)
  const [cakeRevealed, setCakeRevealed] = useState(false)
  const [candles, setCandles] = useState([false, false, false, false, false])
  // true kalau rangkaian nyala satu per satu sudah selesai.
  // Mencegah status wish kebuka saat hitungan masih nol di awal.
  const [cakeReady, setCakeReady] = useState(false)
  const [wish, setWish] = useState('idle') // idle | wish | registered
  const [wishText, setWishText] = useState(() => {
    try {
      return localStorage.getItem('wishText') || ''
    } catch {
      return ''
    }
  })
  const [celebrationStarted, setCelebration] = useState(false)
  const [popped, setPopped] = useState({})
  // Secret ketemu cuma seumur sesi. Refresh = ngulang dari nol.
  const [foundSecrets, setFoundSecrets] = useState([])
  const [hint, setHint] = useState(null)
  const [session, setSession] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setNow(Date.now())
      setMode(resolveMode())
    }, 1000)
    return () => clearInterval(t)
  }, [])

  const target = useMemo(() => birthdayStart().getTime(), [])
  const diff = Math.max(0, target - now)
  const timeLeft = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    done: diff <= 0,
  }

  // Bersihin sisa simpanan versi lama biar refresh beneran dari nol.
  useEffect(() => {
    try {
      localStorage.removeItem('foundSecrets')
    } catch {
      /* private mode */
    }
  }, [])

  const toggleLamp = useCallback(() => {
    setLampOn((on) => {
      const next = !on
      setRoomLight((l) => {
        if (l === 'celebration' || l === 'final') return l
        return next ? 'warm' : 'dark'
      })
      return next
    })
  }, [])

  const lightCandle = useCallback((i) => {
    setCandles((prev) => {
      const next = [...prev]
      next[i] = true
      return next
    })
  }, [])

  const blowCandle = useCallback((i) => {
    setCandles((prev) => {
      if (i === -1) {
        const idx = prev.findIndex(Boolean)
        if (idx === -1) return prev
        const next = [...prev]
        next[idx] = false
        return next
      }
      if (!prev[i]) return prev
      const next = [...prev]
      next[i] = false
      return next
    })
  }, [])

  const findSecret = useCallback((id) => {
    setFoundSecrets((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const saveWishText = useCallback((text) => {
    setWishText(text)
    try {
      localStorage.setItem('wishText', text)
    } catch {
      /* private mode */
    }
  }, [])

  const reset = useCallback(() => {
    setLampOn(false)
    setRoomLight('dark')
    setFocus('wide')
    setGiftOpened(false)
    setCakeRevealed(false)
    setCandles([false, false, false, false, false])
    setCakeReady(false)
    setWish('idle')
    setCelebration(false)
    setPopped({})
    setHint(null)
    setSession((s) => s + 1)
  }, [])

  return {
    state: {
      mode, timeLeft, scene, lampOn, roomLight, focus,
      giftOpened, cakeRevealed, candles, cakeReady, wish, wishText,
      celebrationStarted, popped, foundSecrets, hint, session,
    },
    actions: {
      setScene, toggleLamp, setRoomLight, setFocus,
      setGiftOpened, setCakeRevealed, lightCandle, blowCandle, setCakeReady,
      setWish, saveWishText, setCelebration, setPopped,
      findSecret, setHint, reset,
    },
  }
}
