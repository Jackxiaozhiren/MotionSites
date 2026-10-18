import { useState, useEffect, type ComponentType, type SVGProps } from 'react'
import { MailIcon, TwitterIcon, GithubIcon } from './icons'

const NAV_LINKS = ['Homepage', 'Gallery', 'Buy NFT', 'FAQ', 'Contact']

const HERO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_045634_e1c98c76-1265-4f5c-882a-4276f2080894.mp4'

function SocialButton({ icon: Icon }: { icon: ComponentType<SVGProps<SVGSVGElement>> }) {
  return (
    <button className="liquid-glass w-14 h-14 rounded-[1rem] flex items-center justify-center text-cream hover:bg-white/10 transition-colors cursor-pointer">
      <Icon />
    </button>
  )
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden rounded-b-[32px]">
      {/* Video Background */}
      {mounted && (
        <video
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col max-w-[1831px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex items-center justify-between pt-6 lg:pt-8">
          {/* Logo */}
          <span className="font-grotesk text-[16px] uppercase text-cream tracking-wider">
            Orbis.Nft
          </span>

          {/* Desktop Nav */}
          <nav className="hidden lg:block liquid-glass rounded-[28px] px-[52px] py-[24px]">
            <ul className="flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-grotesk text-[13px] uppercase text-cream hover:text-neon transition-colors tracking-wide"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Desktop Social */}
          <div className="hidden lg:flex flex-col gap-3">
            <SocialButton icon={MailIcon} />
            <SocialButton icon={TwitterIcon} />
            <SocialButton icon={GithubIcon} />
          </div>
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex items-center">
          <div className="relative lg:ml-32">
            <div className="relative inline-block max-w-[780px]">
              <h1 className="font-grotesk uppercase text-cream leading-[1.05] md:leading-[1] text-[40px] sm:text-[60px] md:text-[75px] lg:text-[90px]">
                Beyond earth<br />
                and ( its ) familiar boundaries
              </h1>

              {/* Cursive Accent */}
              <span className="absolute -right-16 sm:-right-20 md:-right-28 top-2 md:top-6 -rotate-1 font-condiment text-neon text-[24px] sm:text-[28px] md:text-[36px] lg:text-[48px] mix-blend-exclusion opacity-90 whitespace-nowrap select-none">
                Nft collection
              </span>
            </div>

            {/* Mobile Social */}
            <div className="flex lg:hidden items-center gap-4 mt-8">
              <SocialButton icon={MailIcon} />
              <SocialButton icon={TwitterIcon} />
              <SocialButton icon={GithubIcon} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
