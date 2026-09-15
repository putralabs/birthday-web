import { useEffect, useMemo, useState } from 'react'
import { birthdayStart } from './useBirthdayMode.js'

// Realtime countdown to 21 Dec 2026 00:00 WIB.
export function useCountdown() {
  const target = useMemo(() => birthdayStart().getTime(), [])
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = Math.max(0, target - now)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    done: diff <= 0,
  }
}
