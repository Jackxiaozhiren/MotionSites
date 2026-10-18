import { useState, useRef, useEffect } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

const EMAIL = 'hello@mainframe.co'

export default function HeroSection() {
  const [open, setOpen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL)
  }

  return (
    <div className="bg-neutral-950">
      {/* Background Video */}
      <MouseScrubVideo />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-10 px-5 sm:px-8 py-4 sm:py-5 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] tracking-tight text-black"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe®
          </span>
          <span
            className="text-[25px] sm:text-[30px] text-black select-none"
            style={{ letterSpacing: '-0.02em' }}
          >
            ✳︎
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-0 text-[23px] text-black">
          <a href="#" className="hover:opacity-60 transition-opacity">Labs</a>
          <span className="mx-1">, </span>
          <a href="#" className="hover:opacity-60 transition-opacity">Studio</a>
          <span className="mx-1">, </span>
          <a href="#" className="hover:opacity-60 transition-opacity">Openings</a>
          <span className="mx-1">, </span>
          <a href="#" className="hover:opacity-60 transition-opacity">Shop</a>
        </div>

        {/* Desktop CTA */}
        <a
          href="#"
          className="hidden md:inline text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
        >
          Get in touch
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] items-center justify-center p-1"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-[2px] bg-black block transition-all duration-300 ${
              open ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black block transition-all duration-300 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black block transition-all duration-300 ${
              open ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[9] md:hidden bg-white/95 backdrop-blur-sm flex flex-col justify-center items-start px-8 gap-8 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <a href="#" className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity">Labs</a>
        <a href="#" className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity">Studio</a>
        <a href="#" className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity">Openings</a>
        <a href="#" className="text-[32px] font-medium text-black hover:opacity-60 transition-opacity">Shop</a>
        <a href="#" className="text-[32px] font-medium text-black underline underline-offset-4 hover:opacity-60 transition-opacity">Get in touch</a>
      </div>

      {/* Hero Content */}
      <section className="relative z-[1] h-screen h-[100dvh] flex flex-col justify-end md:justify-center pb-12 md:pb-0 px-5 sm:px-8 md:px-10 overflow-hidden">
        <div className="max-w-xl relative z-10">
          <HeroIntro />
          <TypewriterLine />
          <PillButtons onCopy={handleCopy} />
        </div>
      </section>
    </div>
  )
}

/* ─── Sub-components ─── */

function MouseScrubVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const VIDEO_URL =
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4'

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const SENSITIVITY = 0.8
    let prevX = -1
    let targetTime = 0
    let seeking = false

    const onMouse = (e: MouseEvent) => {
      if (prevX === -1) {
        prevX = e.clientX
        return
      }
      const delta = e.clientX - prevX
      prevX = e.clientX
      const dur = el.duration
      if (!dur || !isFinite(dur)) return
      targetTime = Math.max(0, Math.min(dur, targetTime + (delta / window.innerWidth) * SENSITIVITY * dur))
      if (!seeking) {
        seeking = true
        el.currentTime = targetTime
      }
    }

    const onSeeked = () => {
      seeking = false
      const dur = el.duration
      if (dur && isFinite(dur) && Math.abs(el.currentTime - targetTime) > 0.01) {
        seeking = true
        el.currentTime = targetTime
      }
    }

    window.addEventListener('mousemove', onMouse)
    el.addEventListener('seeked', onSeeked)

    el.addEventListener('loadedmetadata', () => {
      el.currentTime = 0
    })

    return () => {
      window.removeEventListener('mousemove', onMouse)
      el.removeEventListener('seeked', onSeeked)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      muted
      playsInline
      preload="auto"
      className="fixed inset-0 z-0 w-full h-full object-cover"
      style={{ objectPosition: '70% center' }}
    >
      <source src={VIDEO_URL} type="video/mp4" />
    </video>
  )
}

function HeroIntro() {
  return (
    <p
      className="pointer-events-none select-none mb-5 sm:mb-6 text-black"
      style={{
        fontSize: 'clamp(18px, 4vw, 26px)',
        lineHeight: 1.3,
        fontWeight: 400,
        filter: 'blur(4px)',
      }}
    >
      Hey there, meet A.R.I.A,
      <br />
      Mainframe's Adaptive Response Interface Agent
    </p>
  )
}

function TypewriterLine() {
  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?',
  )

  return (
    <p
      className="text-black mb-5 sm:mb-6"
      style={{
        fontSize: 'clamp(18px, 4vw, 26px)',
        lineHeight: 1.35,
        fontWeight: 400,
        minHeight: '54px',
      }}
    >
      {displayed}
      {!done && (
        <span
          className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px]"
          style={{ animation: 'blink 1s step-end infinite' }}
        />
      )}
    </p>
  )
}

const FADE_IN_STYLE = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
`

function PillButtons({ onCopy }: { onCopy: () => void }) {
  return (
    <div
      className="flex flex-wrap gap-y-1"
      style={{
        opacity: 0,
        animation: 'fadeInUp 0.4s ease 0.4s forwards',
      }}
    >
      <style>{FADE_IN_STYLE}</style>
      {[
        'Pitch us an idea',
        'Come work here',
        'Send a brief hello',
        'See how we operate',
      ].map((label) => (
        <a
          key={label}
          href="#"
          className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
        >
          {label}
        </a>
      ))}

      {/* Outline pill with email */}
      <button
        onClick={onCopy}
        className="inline-flex items-center justify-center bg-transparent text-white border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 gap-2 sm:gap-3"
      >
        <span>Reach us: <span className="underline underline-offset-1">hello@mainframe.co</span></span>
        <span className="shrink-0">
          <CopyIcon />
        </span>
      </button>
    </div>
  )
}
