import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '640 / 820' }}>
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260419_064822_f120e48a-d545-45dd-a02d-facb07829888.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(17,17,17,0) 45%, rgba(17,17,17,0.45) 68%, rgba(17,17,17,0.9) 88%, rgba(17,17,17,1) 100%)',
        }}
      />

      {/* Foreground */}
      <div className="relative z-10 h-full flex flex-col items-center text-center px-6 pt-12 pb-10">
        {/* Brand block */}
        <div style={{ fontFamily: "'Instrument Serif', serif" }} className="text-[28px] leading-[0.95] tracking-tight text-white">
          Design Rocket
        </div>
        <div className="text-[13px] tracking-[0.22em] font-medium text-white mt-1">
          CERTIFICATES
        </div>

        {/* Spacer */}
        <div className="mt-40" />

        {/* Now Available */}
        <div className="text-white text-[13px] tracking-[0.28em] font-semibold">
          NOW AVAILABLE
        </div>

        {/* Flex spacer */}
        <div className="flex-1" />

        {/* Headline */}
        <h1
          style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-white text-[58px] leading-[1.02] tracking-tight max-w-[560px]"
        >
          Learn to lead AI
          and unlock new value
        </h1>

        {/* CTA */}
        <button className="mt-10 inline-flex items-center gap-3 bg-[#D8F90A] text-[#1E1E1E] font-semibold rounded-full px-8 py-4 hover:bg-[#c9ea00] hover:-translate-y-0.5 transition-all duration-200">
          Enroll Now
          <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
