import { useState, useEffect } from 'react'

export function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let index = 0
    let intervalId: number
    let cancelled = false

    const startTyping = () => {
      intervalId = window.setInterval(() => {
        index++
        if (cancelled) return
        setDisplayed(text.slice(0, index))
        if (index >= text.length) {
          clearInterval(intervalId)
          setDone(true)
        }
      }, speed)
    }

    const delayTimeout = window.setTimeout(startTyping, startDelay)

    return () => {
      cancelled = true
      clearTimeout(delayTimeout)
      clearInterval(intervalId)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}
