import { useCallback, useState } from 'react'

// Flower stages: bud -> growing -> bloomed -> full (PRD 15, 23).
export function useFlowerState() {
  const [stage, setStage] = useState('bud')
  const [discovered, setDiscovered] = useState(false)
  const [secretFound, setSecretFound] = useState(() => {
    try {
      return localStorage.getItem('flowerSecret') === '1'
    } catch {
      return false
    }
  })

  const grow = useCallback(() => {
    setStage((s) => (s === 'bud' ? 'growing' : s))
  }, [])

  const bloom = useCallback(() => {
    setDiscovered(true)
    setStage('bloomed')
  }, [])

  const fullBloom = useCallback(() => {
    setStage('full')
  }, [])

  const unlockSecret = useCallback(() => {
    setSecretFound(true)
    try {
      localStorage.setItem('flowerSecret', '1')
    } catch {
      /* private mode */
    }
  }, [])

  const reset = useCallback(() => {
    setStage('bud')
    setDiscovered(false)
  }, [])

  return {
    flower: { stage, discovered, bloomed: stage === 'bloomed' || stage === 'full', secretFound },
    flowerActions: { grow, bloom, fullBloom, unlockSecret, reset },
  }
}
