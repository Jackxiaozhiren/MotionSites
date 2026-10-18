import FadeIn from './FadeIn'
import AnimatedHeading from './AnimatedHeading'

function App() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="px-6 md:px-12 lg:px-16 pt-6">
          <div className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between">
            <span className="text-2xl font-semibold tracking-tight">VEX</span>
            <div className="hidden md:flex gap-8 text-sm">
              {['Story', 'Investing', 'Building', 'Advisory'].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="hover:text-gray-300 transition-colors"
                  >
                    {link}
                  </a>
                )
              )}
            </div>
            <button className="bg-white text-black px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
              Start a Chat
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-12 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end lg:gap-8">
            {/* Left Column */}
            <div>
              <AnimatedHeading />

              <FadeIn delay={800} duration={1000}>
                <p className="text-base md:text-lg text-gray-300 mb-5">
                  We back visionaries and craft ventures that define what comes
                  next.
                </p>
              </FadeIn>

              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-white text-black px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Start a Chat
                  </button>
                  <button className="liquid-glass border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-black transition-all">
                    Explore Now
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Right Column */}
            <FadeIn delay={1400} duration={1000}>
              <div className="flex items-end justify-start lg:justify-end mt-6 lg:mt-0">
                <div className="liquid-glass border border-white/20 px-6 py-3 rounded-xl">
                  <span className="text-lg md:text-xl lg:text-2xl font-light">
                    Investing. Building. Advisory.
                  </span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
