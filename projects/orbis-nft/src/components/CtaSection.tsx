import { useState, useEffect } from 'react'
import { MailIcon, TwitterIcon, GithubIcon } from './icons'

const CTA_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055729_72d66327-b59e-4ae9-bb70-de6ccb5ecdb0.mp4'

const SOCIAL_ITEMS = [
  { icon: MailIcon, href: '#' },
  { icon: TwitterIcon, href: '#' },
  { icon: GithubIcon, href: '#' },
]

export default function CtaSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative w-full bg-bg-dark">
      {/* Video — NOT object-cover, displays at native aspect ratio */}
      {mounted && (
        <video
          autoPlay loop muted playsInline
          className="w-full h-auto block"
        >
          <source src={CTA_VIDEO} type="video/mp4" />
        </video>
      )}

      {/* Text Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-end lg:pr-[20%] lg:pl-[15%] px-4">
        <div className="relative text-right max-w-3xl">
          {/* "Go beyond" cursive accent */}
          <span className="absolute -top-8 sm:-top-12 md:-top-16 lg:-top-20 -left-4 -rotate-1 font-condiment text-neon text-[17px] sm:text-[28px] md:text-[44px] lg:text-[68px] mix-blend-exclusion opacity-90 whitespace-nowrap select-none">
            Go beyond
          </span>

          <h2 className="font-grotesk uppercase text-cream text-[16px] sm:text-[24px] md:text-[40px] lg:text-[60px] leading-[1.1]">
            <div className="mb-4 md:mb-8 lg:mb-12">JOIN US.</div>
            <div>REVEAL WHAT'S HIDDEN.</div>
            <div>DEFINE WHAT'S NEXT.</div>
            <div>FOLLOW THE SIGNAL.</div>
          </h2>
        </div>
      </div>

      {/* Social Icons (Bottom-left) */}
      <div className="absolute left-[8%] bottom-[12%] lg:bottom-[20%]">
        <div className="liquid-glass rounded-[0.5rem] sm:rounded-[0.75rem] md:rounded-[1rem] lg:rounded-[1.25rem] inline-flex flex-col">
          {SOCIAL_ITEMS.map((item, i) => (
            <a
              key={i}
              href={item.href}
              className={`flex items-center justify-center text-cream hover:text-neon transition-colors cursor-pointer
                w-[14vw] sm:w-[14.375rem] md:w-[10.78125rem] lg:w-[16.77rem]
                h-[14vw] sm:h-[14.375rem] md:h-[10.78125rem] lg:h-[16.77rem]
                ${i < 2 ? 'border-b border-white/10' : ''}
              `}
            >
              <item.icon />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
