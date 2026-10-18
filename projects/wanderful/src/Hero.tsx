import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}

export default function Hero() {
  const videoWrapperRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only animate in response to pointer input. No idle requestAnimationFrame loop.
  useEffect(() => {
    const wrapper = videoWrapperRef.current
    if (!wrapper || reducedMotion || !window.matchMedia('(pointer: fine)').matches) return

    const handleMouse = (event: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      gsap.to(wrapper, {
        x: ((event.clientX - cx) / cx) * 20,
        y: ((event.clientY - cy) / cy) * 20,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouse)
      gsap.killTweensOf(wrapper)
      gsap.set(wrapper, { x: 0, y: 0 })
    }
  }, [reducedMotion])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Video Background */}
      <div ref={videoWrapperRef} aria-hidden="true" className="fixed inset-0 z-0 origin-center scale-[1.08] bg-gradient-to-br from-[#0d2030] via-[#21465b] to-[#101520]">
        {!reducedMotion && <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedMetadata={event => { event.currentTarget.playbackRate = 1.25 }}
          className="w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260510_060007_60275ce7-030c-4668-a160-8f364ec537d3.mp4"
        />}
      </div>

      {/* Dark overlay for text readability */}
      <div className="fixed inset-0 z-[1] bg-black/40" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-10 py-5 sm:py-8 flex justify-between items-center">
        <div className="text-[17px] font-semibold tracking-tight text-white">
          Wanderful<sup>TM</sup>
        </div>

        <nav className="liquid-glass hidden md:flex rounded-full px-2 py-2 items-center gap-1">
          {['JOURNEY', 'BENEFITS', 'JOURNAL', 'GUIDEBOOK'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[11px] font-medium tracking-[0.12em] text-white/90 hover:text-white px-4 py-1.5 rounded-full transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </nav>

        <a
          href="#"
          className="liquid-glass rounded-full px-5 py-2.5 text-[11px] font-medium tracking-[0.12em] text-white/90 hover:text-white"
        >
          GET ROAMING
        </a>
      </header>

      {/* Hero Headline */}
      <div className="fixed top-[120px] left-0 right-0 z-20 text-center">
        <h1 style={{ fontSize: 'clamp(40px, 5.4vw, 72px)' }} className="font-['Inter'] font-normal leading-[1.1] tracking-[-0.02em]">
          <div
            className={`text-white transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Venture without edges.
          </div>
          <div
            className={`text-[rgba(255,255,255,0.55)] transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Uncover with keen instinct.
          </div>
        </h1>
      </div>

      {/* Bottom Block */}
      <div
        className={`fixed bottom-14 left-0 right-0 z-20 flex flex-col items-center gap-6 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
        style={{ transitionDelay: '500ms' }}
      >
        <p className="max-w-[620px] text-[15px] leading-relaxed text-center">
          <span className="text-white">Our smart itineraries shape around you — your rhythm, your vibe, your hunger for adventure.</span>
          <span className="text-white/55"> Each getaway is tailored, seamless, and wholly yours.</span>
        </p>

        <a href="https://github.com/Jackxiaozhiren/MotionSites/tree/main/22"
          target="_blank" rel="noopener noreferrer"
          className="bg-white text-black text-[15px] font-medium rounded-full px-8 py-3.5 transition-all duration-200 hover:scale-[1.03] hover:shadow-[0_0_32px_4px_rgba(255,255,255,0.2)]">
          Explore concept source ↗
        </a>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium tracking-[0.14em] text-white/70">
            INTERACTIVE CONCEPT · NO BOOKING SERVICE
          </span>
        </div>
      </div>
    </div>
  )
}
