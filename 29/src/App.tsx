import { ChevronRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Marquee from './components/Marquee';

function App() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-8">
      {/* Hero Container */}
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
        {/* Video Background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          {/* Gradient fallback for when video fails to load */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#e6eef8] via-[#d2e1f1] to-[#c4d5e9]" />
          {!reducedMotion && <video
            autoPlay
            loop
            muted
            playsInline
            className="relative w-full h-full object-cover scale-105 transition-transform duration-1000"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4"
              type="video/mp4"
            />
          </video>}
        </div>

        {/* Text Content */}
        <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col items-start gap-5 max-w-2xl"
          >
            <h1 className="font-display text-[42px] md:text-[56px] font-medium tracking-tight text-[#0a1b33] leading-tight">
              Foundation of the<br />new digital epoch
            </h1>

            <p className="font-sans text-[14px] md:text-[15px] text-[#64748b] leading-relaxed max-w-xl">
              Designing products, powering ecosystems and laying the foundation of a decentralized web for enterprises, builders and communities alike.
            </p>

            <motion.button
              type="button"
              whileHover={reducedMotion ? undefined : { scale: 1.05 }}
              whileTap={reducedMotion ? undefined : { scale: 0.95 }}
              className="bg-[#0a152d] text-white rounded-full px-8 py-3 font-semibold font-sans tracking-wide text-sm cursor-pointer"
            >
              Contact Us
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Bottom Navbar */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
          <motion.nav
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40"
          >
            {/* Logo */}
            <div className="w-9 h-9 bg-white border border-slate-100 shadow-sm rounded-full flex items-center justify-center mr-1">
              <span className="text-sm text-slate-600">✦</span>
            </div>

            {/* Nav Links */}
            <button type="button" className="text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33] px-4 py-2 cursor-pointer transition-colors">
              Products
            </button>
            <button type="button" className="text-[12px] font-semibold text-slate-500 hover:text-[#0a1b33] px-4 py-2 cursor-pointer transition-colors">
              Docs
            </button>

            {/* Get in touch */}
            <button type="button" className="bg-white px-5 py-2 rounded-full text-[12px] font-semibold text-[#0a1b33] border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all flex items-center gap-1.5 cursor-pointer ml-1">
              Get in touch
              <ChevronRight size={14} />
            </button>
          </motion.nav>
        </div>
      </div>

      {/* Marquee */}
      <div className="w-full max-w-[1400px] mt-10">
        <Marquee />
      </div>
    </div>
  );
}

export default App;
