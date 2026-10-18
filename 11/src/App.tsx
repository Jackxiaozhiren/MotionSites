import { useCallback, useEffect, useRef } from 'react'
import { ArrowRight, Camera, Globe, X } from 'lucide-react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4'

const FADE_DURATION = 500 // ms
const FADE_OUT_LEAD = 550 // ms before video ends to start fading

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const animRef = useRef<number>(0)

  const fade = useCallback((from: number, to: number, duration: number) => {
    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const opacity = from + (to - from) * t
      if (videoRef.current) videoRef.current.style.opacity = String(opacity)
      if (t < 1) animRef.current = requestAnimationFrame(step)
    }
    cancelAnimationFrame(animRef.current)
    animRef.current = requestAnimationFrame(step)
  }, [])

  const fadingOutRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      if (video.duration && video.currentTime >= video.duration - FADE_OUT_LEAD / 1000) {
        if (!fadingOutRef.current) {
          fadingOutRef.current = true
          fade(parseFloat(video.style.opacity) || 1, 0, FADE_DURATION)
        }
      }
    }

    const onEnded = () => {
      video.style.opacity = '0'
      setTimeout(() => {
        video.currentTime = 0
        video.play()
        fadingOutRef.current = false
        fade(0, 1, FADE_DURATION)
      }, 100)
    }

    const onLoadStart = () => {
      video.style.opacity = '0'
    }

    const onCanPlay = () => {
      fade(0, 1, FADE_DURATION)
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('ended', onEnded)
    video.addEventListener('loadstart', onLoadStart)
    video.addEventListener('canplay', onCanPlay)

    return () => {
      cancelAnimationFrame(animRef.current)
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('ended', onEnded)
      video.removeEventListener('loadstart', onLoadStart)
      video.removeEventListener('canplay', onCanPlay)
    }
  }, [fade])

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop={false}
      playsInline
      className="absolute inset-0 w-full h-full object-cover translate-y-[17%]"
      style={{ opacity: 0 }}
    >
      <source src={VIDEO_URL} type="video/mp4" />
    </video>
  )
}

function LiquidGlass({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div
      className={className}
      style={{
        background: 'rgba(255, 255, 255, 0.01)',
        backgroundBlendMode: 'luminosity',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        border: 'none',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: '1.4px',
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%, rgba(255,255,255,0.45) 100%)',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

function HeroNav() {
  return (
    <nav className="relative z-20 px-6 py-6">
      <LiquidGlass className="rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe size={24} className="text-white" />
          <span className="text-white font-semibold text-lg">Asme</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Features</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">Pricing</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm font-medium">About</a>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-white text-sm font-medium">Sign Up</button>
          <LiquidGlass className="rounded-full px-6 py-2">
            <span className="text-white text-sm font-medium">Login</span>
          </LiquidGlass>
        </div>
      </LiquidGlass>
    </nav>
  )
}

function EmailInput() {
  return (
    <LiquidGlass className="rounded-full pl-6 pr-2 py-2 flex items-center gap-3 max-w-xl mx-auto w-full">
      <input
        type="email"
        placeholder="Enter your email"
        className="bg-transparent text-white placeholder:text-white/40 text-base outline-none flex-1 min-w-0"
      />
      <button
        className="bg-white rounded-full p-3 text-black flex-shrink-0 hover:opacity-90 transition-opacity"
        aria-label="Subscribe"
      >
        <ArrowRight size={20} />
      </button>
    </LiquidGlass>
  )
}

function SocialIcon({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <LiquidGlass className="rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all">
      <Icon size={20} aria-label={label} />
    </LiquidGlass>
  )
}

function HeroContent() {
  return (
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
      <h1
        className="text-5xl md:text-6xl lg:text-7xl text-white mb-8 tracking-tight whitespace-nowrap"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Built for the curious
      </h1>

      <div className="max-w-xl w-full space-y-4">
        <EmailInput />

        <p className="text-white text-sm leading-relaxed px-4">
          Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
        </p>

        <div className="flex justify-center">
          <LiquidGlass className="rounded-full px-8 py-3 hover:bg-white/5 transition-colors inline-flex">
            <span className="text-white text-sm font-medium">Manifesto</span>
          </LiquidGlass>
        </div>
      </div>
    </div>
  )
}

function SocialFooter() {
  return (
    <div className="relative z-10 flex justify-center gap-4 pb-12">
      <SocialIcon icon={Camera} label="Instagram" />
      <SocialIcon icon={X} label="Twitter" />
      <SocialIcon icon={Globe} label="Website" />
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-black overflow-hidden relative flex flex-col">
      <BackgroundVideo />
      <HeroNav />
      <HeroContent />
      <SocialFooter />
    </div>
  )
}
