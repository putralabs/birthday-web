import { useEffect, useState } from 'react'
import { birthdayData } from '../data/birthday.js'

// Jakarta calendar day, YYYY-MM-DD. Single date source: birthdayData.birthday.
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

// before | birthday | after
export function useBirthdayMode() {
  const [mode, setMode] = useState(() => resolveMode())

  useEffect(() => {
    const t = setInterval(() => setMode(resolveMode()), 30000)
    return () => clearInterval(t)
  }, [])

  return mode
}

function resolveMode() {
  // QA override cuma jalan di dev. Production selalu ikut tanggal asli
  // biar halaman awal tidak ganti-ganti.
  try {
    if (import.meta.env?.DEV) {
      const q = new URLSearchParams(window.location.search).get('as')
      if (q === 'before' || q === 'birthday' || q === 'after') return q
    }
  } catch {
    /* non-browser, ignore */
  }
  const today = jakartaYMD()
  if (today < birthdayData.birthday) return 'before'
  if (today === birthdayData.birthday) return 'birthday'
  return 'after'
}
