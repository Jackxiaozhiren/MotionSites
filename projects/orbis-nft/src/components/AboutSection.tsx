import { useState, useEffect } from 'react'

const ABOUT_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4'

const PARAGRAPH_TEXT = 'A digital object fixed beyond time and place. An exploration of distance, form, and silence in space'

export default function AboutSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      {mounted && (
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={ABOUT_VIDEO} type="video/mp4" />
        </video>
      )}

      {/* Content */}
      <div className="relative z-10 h-full max-w-[1831px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-24 flex flex-col justify-between">
        {/* Top Row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16">
          {/* Left: Heading */}
          <div className="relative flex-shrink-0">
            <h2 className="font-grotesk uppercase text-cream text-[32px] sm:text-[40px] md:text-[50px] lg:text-[60px] leading-[1.05] relative">
              Hello!<br />
              I'm orbis
            </h2>
            <span className="absolute -bottom-4 right-0 lg:right-4 -rotate-1 font-condiment text-neon text-[36px] sm:text-[44px] md:text-[56px] lg:text-[68px] mix-blend-exclusion opacity-90 whitespace-nowrap select-none">
              Orbis
            </span>
          </div>

          {/* Right: Paragraph */}
          <div className="lg:pt-4">
            <p className="font-mono text-[14px] sm:text-[16px] uppercase text-cream leading-relaxed max-w-[266px]">
              {PARAGRAPH_TEXT}
            </p>
          </div>
        </div>

        {/* Bottom Row - Decorative */}
        <div className="flex justify-between gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-6 w-full lg:w-auto">
            <p className="font-mono text-[14px] sm:text-[16px] uppercase leading-relaxed opacity-10 text-cream max-w-[500px]">
              {PARAGRAPH_TEXT}
            </p>
            <p className="font-mono text-[14px] sm:text-[16px] uppercase leading-relaxed opacity-10 text-cream max-w-[500px]">
              {PARAGRAPH_TEXT}
            </p>
          </div>

          {/* Right Column - hidden below lg */}
          <div className="hidden lg:flex flex-col gap-6">
            <p className="font-mono text-[16px] uppercase leading-relaxed opacity-10 text-cream max-w-[500px]">
              {PARAGRAPH_TEXT}
            </p>
            <p className="font-mono text-[16px] uppercase leading-relaxed opacity-10 text-cream max-w-[500px]">
              {PARAGRAPH_TEXT}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
