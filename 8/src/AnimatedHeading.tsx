import { useEffect, useState } from 'react'

const CHAR_DELAY = 30
const INITIAL_DELAY = 200

export default function AnimatedHeading() {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), INITIAL_DELAY)
    return () => clearTimeout(timer)
  }, [])

  const text = 'Shaping tomorrow\nwith vision and action.'
  const lines = text.split('\n')
  const lineLengths = lines.map((l) => l.length)

  return (
    <h1
      className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4"
      style={{ letterSpacing: '-0.04em' }}
    >
      {lines.map((line, lineIdx) => (
        <span key={lineIdx} className="block">
          {line.split('').map((char, charIdx) => {
            const delay =
              lineIdx * lineLengths[lineIdx] * CHAR_DELAY + charIdx * CHAR_DELAY
            return (
              <span
                key={charIdx}
                className="inline-block transition-all"
                style={{
                  opacity: started ? 1 : 0,
                  transform: started ? 'translateX(0)' : 'translateX(-18px)',
                  transitionDuration: '500ms',
                  transitionDelay: `${delay}ms`,
                  transitionProperty: 'opacity, transform',
                }}
              >
                {char === ' ' ? ' ' : char}
              </span>
            )
          })}
        </span>
      ))}
    </h1>
  )
}
