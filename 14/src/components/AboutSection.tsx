import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const headingItem = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } },
  };

  return (
    <section className="bg-black pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          variants={container}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.p variants={item} className="text-white/40 text-sm tracking-widest uppercase">
            About Us
          </motion.p>
          <motion.h2
            variants={headingItem}
            className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mt-6"
          >
            <span style={{ fontFamily: "'Instrument Serif', serif" }} className="italic text-white/60">
              Pioneering then ideas
            </span>
            <br className="hidden md:block" />
            <span style={{ fontFamily: "'Instrument Serif', serif" }} className="italic text-white/60">
              {' '}for minds that then create, build, and inspire.
            </span>
          </motion.h2>
        </motion.div>
      </div>
    </section>
  );
}
