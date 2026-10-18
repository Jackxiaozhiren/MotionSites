import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

export default function Hero() {
  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden" style={{ background: 'radial-gradient(circle at 52% 40%, #19332b 0%, #0b1717 46%, #000000 95%)' }}>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4"
          type="video/mp4"
        />
      </video>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent z-[1]" />

      {/* Content */}
      <div className="relative z-10 pt-28 md:pt-32 text-center px-4 max-w-5xl mx-auto">
        {/* Avatar Row */}
        <motion.div
          {...fadeUp(0)}
          className="flex items-center justify-center mb-6"
        >
          <div className="flex -space-x-2">
            <img
              src={`${import.meta.env.BASE_URL}avatar-1.svg`}
              alt="avatar"
              className="w-8 h-8 rounded-full border-2 border-background"
            />
            <img
              src={`${import.meta.env.BASE_URL}avatar-2.svg`}
              alt="avatar"
              className="w-8 h-8 rounded-full border-2 border-background"
            />
            <img
              src={`${import.meta.env.BASE_URL}avatar-3.svg`}
              alt="avatar"
              className="w-8 h-8 rounded-full border-2 border-background"
            />
          </div>
          <span className="text-muted-foreground text-sm ml-3">
            7,000+ people already subscribed
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] mb-6"
        >
          Get <span className="font-serif italic font-normal">Inspired</span> with Us
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-lg text-hero-subtitle max-w-2xl mx-auto mb-10"
        >
          Join our feed for meaningful updates, news around technology and a shared journey toward depth and direction.
        </motion.p>

        {/* Email Form */}
        <motion.div
          {...fadeUp(0.3)}
          className="liquid-glass rounded-full p-2 max-w-lg mx-auto flex items-center"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-transparent flex-1 px-4 py-3 outline-none text-foreground placeholder:text-muted-foreground/50"
          />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-foreground text-background rounded-full px-8 py-3 font-semibold text-sm whitespace-nowrap"
          >
            SUBSCRIBE
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
