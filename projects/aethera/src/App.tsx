import { useEffect, useRef } from 'react'

function App() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let animationId: number

    const checkTime = () => {
      if (!video) return
      const currentTime = video.currentTime
      const duration = video.duration

      if (duration === 0) {
        animationId = requestAnimationFrame(checkTime)
        return
      }

      if (currentTime < 0.5) {
        video.style.opacity = String(currentTime / 0.5)
      } else if (duration - currentTime <= 0.5) {
        video.style.opacity = String((duration - currentTime) / 0.5)
      } else {
        video.style.opacity = '1'
      }

      animationId = requestAnimationFrame(checkTime)
    }

    const handleEnded = () => {
      video.style.opacity = '0'
      setTimeout(() => {
        video.currentTime = 0
        video.play()
      }, 100)
    }

    video.addEventListener('ended', handleEnded)
    animationId = requestAnimationFrame(checkTime)

    return () => {
      cancelAnimationFrame(animationId)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4"
          className="w-full h-full object-cover"
          style={{
            position: 'absolute',
            top: '300px',
            right: 0,
            bottom: 0,
            left: 0,
          }}
          muted
          playsInline
          autoPlay
          loop={false}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-3xl tracking-tight font-instrument text-black">
            Aethera<sup>®</sup>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-black transition-colors">Home</a>
            <a href="#" className="text-sm text-[#6F6F6F] transition-colors">Studio</a>
            <a href="#" className="text-sm text-[#6F6F6F] transition-colors">About</a>
            <a href="#" className="text-sm text-[#6F6F6F] transition-colors">Journal</a>
            <a href="#" className="text-sm text-[#6F6F6F] transition-colors">Reach Us</a>
            <button className="rounded-full px-6 py-2.5 text-sm bg-black text-white hover:scale-105 transition-transform">
              Begin Journey
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pb-40"
        style={{ paddingTop: 'calc(8rem - 75px)' }}
      >
        <h1 className="text-5xl sm:text-7xl md:text-8xl max-w-7xl font-normal font-instrument leading-[0.95] tracking-[-2.46px] animate-fade-rise">
          <span className="text-black">Beyond </span>
          <span className="text-[#6F6F6F] italic">silence,</span>
          <span className="text-black"> we build </span>
          <span className="text-[#6F6F6F] italic">the eternal.</span>
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mt-8 leading-relaxed text-[#6F6F6F] animate-fade-rise-delay">
          Building platforms for brilliant minds, fearless makers, and thoughtful souls. Through the noise, we craft digital havens for deep work and pure flows.
        </p>
        <button className="rounded-full px-14 py-5 text-base mt-12 bg-black text-white hover:scale-105 transition-transform animate-fade-rise-delay-2">
          Begin Journey
        </button>
      </section>
    </div>
  )
}

export default App
