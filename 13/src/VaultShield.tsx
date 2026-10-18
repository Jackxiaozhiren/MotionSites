import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRightCircle,
  Zap,
  LockKeyhole,
  Fingerprint,
  Menu,
  X,
} from 'lucide-react'

const navLinks = ['Vault', 'Plans', 'Install', 'News', 'Help']

const logo = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    fill="none"
    overflow="visible"
    viewBox="0 0 256 256"
  >
    <path
      d="M 64 128 L 64.5 128 L 32 95 L 0 64 L 0 0 L 64 0 L 128 64 L 128 64.5 L 161 32 L 192 0 L 256 0 L 256 64 L 192 128 L 128 128 L 128 192 L 96 223 L 63.5 256 L 0 256 L 0 192 Z M 256 192 L 224 223 L 191.5 256 L 128 256 L 128 192 L 192 128 L 256 128 Z"
      fill="#192837"
    />
  </svg>
)

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const sheetItem = {
  hidden: { opacity: 0, x: 24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.18 + i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export default function VaultShield() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
    >
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4"
          type="video/mp4"
        />
      </video>

      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-white/30" />

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="px-5 sm:px-8 py-4 sm:py-5 mx-auto max-w-[1280px] flex items-center justify-between">
          {/* Left: Logo */}
          <a href="#" className="flex items-center gap-2 no-underline" style={{ color: 'var(--color-text)' }}>
            {logo}
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              VaultShield
            </span>
          </a>

          {/* Center: Nav links (desktop) */}
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="text-sm font-medium no-underline transition-opacity duration-200 hover:opacity-60"
                  style={{ color: 'var(--color-text)' }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>

          {/* Right: Buttons (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#"
              className="text-sm font-semibold no-underline rounded-full px-5 py-2.5 transition-all duration-200 hover:brightness-110"
              style={{ background: 'var(--color-accent)', color: '#fff' }}
            >
              Start For Free
            </a>
            <a
              href="#"
              className="text-sm font-semibold no-underline rounded-full px-5 py-2.5 transition-all duration-200 hover:brightness-95"
              style={{ background: 'var(--color-login-bg)', color: 'var(--color-text)' }}
            >
              Sign In
            </a>
          </div>

          {/* Mobile: Hamburger */}
          <button
            className="md:hidden flex items-center justify-center bg-transparent border-none p-1 cursor-pointer"
            style={{ color: 'var(--color-text)' }}
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </nav>

        {/* Mobile Menu Sheet */}
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-40"
                style={{ background: 'rgba(25,40,55,0.35)', backdropFilter: 'blur(4px)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setMenuOpen(false)}
              />

              {/* Sheet */}
              <motion.div
                className="fixed right-0 top-0 z-50 flex flex-col"
                style={{
                  width: 'min(88vw, 360px)',
                  height: '100dvh',
                  background: '#CFC8C5',
                  boxShadow: '-12px 0 48px rgba(25,40,55,0.18)',
                }}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Header: Logo + Close */}
                <div className="flex items-center justify-between px-6 py-5">
                  <a href="#" className="flex items-center gap-2 no-underline" style={{ color: 'var(--color-text)' }}>
                    {logo}
                    <span
                      className="text-lg font-semibold tracking-tight"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      VaultShield
                    </span>
                  </a>
                  <button
                    className="flex items-center justify-center bg-transparent border-none p-1 cursor-pointer"
                    style={{ color: 'var(--color-text)' }}
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={28} />
                  </button>
                </div>

                {/* Divider */}
                <div className="mx-6" style={{ height: 1, background: 'rgba(25,40,55,0.12)' }} />

                {/* Nav Links */}
                <div className="flex flex-col gap-1 px-6 py-6">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link}
                      href="#"
                      className="text-lg font-medium no-underline py-3 transition-opacity duration-200 hover:opacity-60"
                      style={{ color: 'var(--color-text)' }}
                      custom={i}
                      variants={sheetItem}
                      initial="hidden"
                      animate="visible"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link}
                    </motion.a>
                  ))}
                </div>

                {/* Bottom CTA buttons */}
                <div className="mt-auto px-6 pb-8 flex flex-col gap-3">
                  <motion.a
                    href="#"
                    className="text-center text-sm font-semibold no-underline rounded-full px-5 py-3 transition-all duration-200 hover:brightness-110"
                    style={{ background: 'var(--color-accent)', color: '#fff' }}
                    custom={navLinks.length}
                    variants={sheetItem}
                    initial="hidden"
                    animate="visible"
                  >
                    Start For Free
                  </motion.a>
                  <motion.a
                    href="#"
                    className="text-center text-sm font-semibold no-underline rounded-full px-5 py-3 transition-all duration-200 hover:brightness-95"
                    style={{ background: 'var(--color-login-bg)', color: 'var(--color-text)' }}
                    custom={navLinks.length + 1}
                    variants={sheetItem}
                    initial="hidden"
                    animate="visible"
                  >
                    Sign In
                  </motion.a>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Hero Content */}
        <div
          className="mx-auto max-w-[1280px] px-5 sm:px-8"
          style={{ paddingTop: 'clamp(40px, 8vw, 72px)' }}
        >
          <div className="max-w-[560px]">
            {/* Heading */}
            <motion.h1
              className="m-0"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(1.65rem, 5vw, 3rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: 'var(--color-text)',
                marginBottom: 24,
              }}
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <Zap
                size={24}
                style={{
                  color: 'var(--color-text)',
                  display: 'inline',
                  verticalAlign: 'middle',
                  position: 'relative',
                  top: -2,
                }}
              />
              Lock Down Your Passwords{' '}
              <LockKeyhole
                size={24}
                style={{
                  color: 'var(--color-text)',
                  display: 'inline',
                  verticalAlign: 'middle',
                  position: 'relative',
                  top: -2,
                }}
              />{' '}
              with Ironclad Security
              <Fingerprint
                size={24}
                style={{
                  color: 'var(--color-text)',
                  display: 'inline',
                  verticalAlign: 'middle',
                  position: 'relative',
                  top: -2,
                }}
              />
            </motion.h1>

            {/* Subtext */}
            <motion.p
              className="m-0"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                lineHeight: 1.65,
                opacity: 0.8,
                maxWidth: 560,
              }}
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              Zero stress, total control. VaultShield keeps you covered with
              unbreakable storage, one-tap access, and pro-grade tools for your
              non-stop world.
            </motion.p>

            {/* CTA Button */}
            <motion.a
              href="#"
              className="inline-flex items-center no-underline mt-8"
              style={{
                background: 'var(--color-accent)',
                color: '#fff',
                borderRadius: 50,
                padding: '17px 24px',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                boxShadow: '0 4px 24px rgba(115,66,226,0.28)',
                minWidth: 210,
              }}
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              whileHover={{ scale: 1.04, filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="flex items-center justify-between w-full gap-8">
                Get It Free
                <ArrowRightCircle size={20} />
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  )
}
