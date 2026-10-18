import { motion } from 'framer-motion'
import { ArrowRightCircle, Zap, LockKeyhole, Fingerprint } from 'lucide-react'
import React from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function HeroContent() {
  return (
    <div
      className="relative z-10 mx-auto px-5 sm:px-8"
      style={{ maxWidth: 1280 }}
    >
      <div
        className="mx-auto flex flex-col items-center"
        style={{ maxWidth: 660, paddingTop: 'clamp(40px, 8vw, 72px)', paddingBottom: 48 }}
      >
        {/* Heading */}
        <motion.h1
          className="text-center"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(1.65rem, 5vw, 3rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            color: 'var(--color-text)',
            margin: 0,
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Lock{' '}
          <span style={{ display: 'inline', verticalAlign: 'middle', position: 'relative', top: -2, margin: '0 4px' }}>
            <Zap size={24} color="#192837" />
          </span>{' '}
          Down Your{' '}
          <span style={{ display: 'inline', verticalAlign: 'middle', position: 'relative', top: -2, margin: '0 4px' }}>
            <LockKeyhole size={24} color="#192837" />
          </span>{' '}
          Passwords{' '}
          with Ironclad Security{' '}
          <span style={{ marginLeft: 6, display: 'inline', verticalAlign: 'middle' }}>
            <Fingerprint size={24} color="#192837" />
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          className="text-center"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            color: 'var(--color-text)',
            opacity: 0.8,
            maxWidth: 560,
            lineHeight: 1.65,
            margin: '20px 0 0',
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          Zero stress, total control. Unbreakable storage, one-tap access, and
          pro-grade tools for your non-stop world.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="mt-8"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <button
            className="flex items-center justify-between gap-8 font-semibold text-white transition-all"
            style={{
              background: '#7342E2',
              borderRadius: 50,
              fontSize: 'clamp(0.9rem, 2vw, 1rem)',
              padding: '17px 24px',
              minWidth: 210,
              boxShadow: '0 4px 24px rgba(115,66,226,0.28)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.04)'
              e.currentTarget.style.filter = 'brightness(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.filter = 'brightness(1)'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'scale(0.96)'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'scale(1.04)'
            }}
          >
            Get It Free
            <ArrowRightCircle size={20} />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
