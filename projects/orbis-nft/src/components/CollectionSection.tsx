import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'

const NFTS = [
  {
    video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_053923_22c0a6a5-313c-474c-85ff-3b50d25e944a.mp4',
    score: '8.7/10',
  },
  {
    video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_054411_511c1b7a-fb2f-42ef-bf6c-32c0b1a06e79.mp4',
    score: '9/10',
  },
  {
    video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_055427_ac7035b5-9f3b-4289-86fc-941b2432317d.mp4',
    score: '8.2/10',
  },
]

function NftCard({ video, score }: { video: string; score: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="liquid-glass rounded-[32px] p-[18px] hover:bg-white/10 transition-colors">
      {/* Video Container */}
      <div className="relative w-full pb-[100%] rounded-[24px] overflow-hidden">
        {mounted && (
          <video
            autoPlay loop muted playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={video} type="video/mp4" />
          </video>
        )}
      </div>

      {/* Overlay Bar */}
      <div className="liquid-glass rounded-[20px] px-5 py-4 mt-3 flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-cream/70">RARITY SCORE:</p>
          <p className="font-mono text-[16px] text-cream">{score}</p>
        </div>
        <button className="w-12 h-12 rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-purple-500/50 hover:scale-110 transition-transform cursor-pointer flex-shrink-0">
          <ChevronRight size={20} className="text-white" />
        </button>
      </div>
    </div>
  )
}

export default function CollectionSection() {
  return (
    <section className="w-full bg-bg-dark py-16 md:py-20 lg:py-24">
      <div className="max-w-[1831px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 md:mb-16 lg:mb-20">
          {/* Left: Heading */}
          <div>
            <h2 className="font-grotesk uppercase text-cream text-[32px] sm:text-[40px] md:text-[50px] lg:text-[60px] leading-[1.05]">
              Collection of
            </h2>
            <div className="ml-12 md:ml-24 lg:ml-32">
              <span className="font-condiment text-neon text-[32px] sm:text-[40px] md:text-[50px] lg:text-[60px]">Space</span>
              <span className="font-grotesk uppercase text-cream text-[32px] sm:text-[40px] md:text-[50px] lg:text-[60px] ml-4">objects</span>
            </div>
          </div>

          {/* Right: SEE ALL CREATORS */}
          <div className="flex-shrink-0">
            <div className="flex flex-col">
              <div className="flex items-end gap-2">
                <span className="font-grotesk uppercase text-cream text-[32px] sm:text-[40px] md:text-[50px] lg:text-[60px] leading-none">
                  SEE
                </span>
                <div className="flex flex-col leading-none pb-1">
                  <span className="font-grotesk uppercase text-cream text-[20px] sm:text-[24px] md:text-[28px] lg:text-[36px]">
                    ALL
                  </span>
                  <span className="font-grotesk uppercase text-cream text-[20px] sm:text-[24px] md:text-[28px] lg:text-[36px]">
                    CREATORS
                  </span>
                </div>
              </div>
              <div className="bg-neon w-full h-[6px] md:h-[8px] lg:h-[10px] mt-1 rounded-sm" />
            </div>
          </div>
        </div>

        {/* NFT Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NFTS.map((nft, i) => (
            <NftCard key={i} video={nft.video} score={nft.score} />
          ))}
        </div>
      </div>
    </section>
  )
}
