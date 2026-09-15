import { useEffect, useRef, useState } from 'react'

// Optional mic blow detection (PRD 33). Never required, tap always works.
export function useBlowDetection(onBlow, active) {
  const [micOn, setMicOn] = useState(false)
  const [supported, setSupported] = useState(true)
  const ctxRef = useRef(null)
  const stopRef = useRef(false)
  const onBlowRef = useRef(onBlow)
  onBlowRef.current = onBlow

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) setSupported(false)
  }, [])

  useEffect(() => {
    return () => {
      stopRef.current = true
      ctxRef.current?.close?.().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!active && micOn) {
      stopRef.current = true
      ctxRef.current?.close?.().catch(() => {})
      ctxRef.current = null
      setMicOn(false)
    }
  }, [active, micOn])

  const enable = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const AC = window.AudioContext || window.webkitAudioContext
      const ctx = new AC()
      ctxRef.current = ctx
      stopRef.current = false
      const src = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      src.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      setMicOn(true)
      let cooldown = 0
      const check = () => {
        if (stopRef.current || ctx.state === 'closed') {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        analyser.getByteTimeDomainData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128
          sum += v * v
        }
        const rms = Math.sqrt(sum / data.length)
        if (rms > 0.2 && Date.now() > cooldown) {
          cooldown = Date.now() + 700
          onBlowRef.current?.()
        }
        requestAnimationFrame(check)
      }
      check()
    } catch {
      setSupported(false)
    }
  }

  return { micOn, supported, enable }
}
