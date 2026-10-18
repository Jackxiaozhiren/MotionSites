function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4"
      />

      {/* Navbar */}
      <nav className="absolute top-0 left-0 right-0 z-20 px-6 md:px-10 pt-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left pill */}
          <div className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur rounded-full pl-4 pr-6 py-3">
            <svg
              viewBox="0 0 256 256"
              className="h-5 w-5"
              fill="#ffffff"
            >
              <path d="M 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 128 L 64 128 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z M 128 64 L 128 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 Z M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 128 0 L 192 0 Z" />
            </svg>
            <span className="text-white text-sm font-normal tracking-tight">
              securify
            </span>
          </div>

          {/* Center pill — hidden on mobile */}
          <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2">
            {["platform", "solutions", "company", "support"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right button */}
          <button
            type="button"
            className="bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors"
          >
            get started
          </button>
        </div>
      </nav>

      {/* Foreground Content */}
      <div className="relative h-full w-full">
        {/* Stat block — top right */}
        <div className="absolute right-6 md:right-24 top-[14%]">
          <div className="flex items-center gap-3 justify-end">
            <span className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight">
              +65k
            </span>
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1 text-right">
            startups use
          </p>
        </div>

        {/* Headline: "protect" */}
        <h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-4 md:left-10 top-[18%]">
          protect
        </h1>

        {/* Description */}
        <p className="absolute left-6 md:left-10 top-[46%] max-w-[240px] text-[15px] leading-snug text-white/90">
          we can guarding your data with utmost care, empowering you with privacy
          everywhere
        </p>

        {/* Headline: "your" */}
        <h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] right-4 md:right-10 top-[38%]">
          your
        </h1>

        {/* Headline: "data" */}
        <h1 className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-[18%] md:left-[28%] top-[58%]">
          data
        </h1>

        {/* Stat block — bottom left */}
        <div className="absolute left-6 md:left-20 bottom-20 md:bottom-24">
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-medium tracking-tight">
              +1.5b
            </span>
            <span className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1">
            gb data was protected
          </p>
        </div>

        {/* Stat block — bottom right */}
        <div className="absolute right-6 md:right-20 bottom-16 md:bottom-20">
          <div className="flex items-center gap-3 justify-end">
            <span className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight">
              +300k
            </span>
          </div>
          <p className="text-xs md:text-sm text-white/70 mt-1 text-right">
            downloads
          </p>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />
    </section>
  );
}

export default HeroSection;
