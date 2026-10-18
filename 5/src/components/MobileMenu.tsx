import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'
import { X } from 'lucide-react'

const navLinks = ['Vault', 'Plans', 'Install', 'News', 'Help']

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const sheetVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.35, ease: [0.55, 0, 1, 0.45] },
  },
}

const linkItemVariants = {
  hidden: { x: 24, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.18 + i * 0.07,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export default function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(25,40,55,0.35)', backdropFilter: 'blur(4px)' }}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed top-0 right-0 z-50 flex flex-col"
            style={{
              width: 'min(88vw, 360px)',
              height: '100dvh',
              background: '#CFC8C5',
              boxShadow: '-12px 0 48px rgba(25,40,55,0.18)',
            }}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5">
              <Logo />
              <motion.button
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 40,
                  height: 40,
                  background: 'rgba(25,40,55,0.1)',
                }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(25,40,55,0.12)', margin: '0 24px' }} />

            {/* Nav links */}
            <div className="flex flex-col px-6 py-6 gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link}
                  href="#"
                  className="px-4 py-3 rounded-xl font-medium transition-colors hover:bg-black/10"
                  style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}
                  variants={linkItemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                >
                  {link}
                </motion.a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 px-6 mt-auto pb-8">
              <motion.button
                className="w-full py-3.5 rounded-full font-semibold"
                style={{ background: '#7342E2', color: '#fff', fontSize: '0.95rem' }}
                variants={linkItemVariants}
                initial="hidden"
                animate="visible"
                custom={5}
              >
                Start For Free
              </motion.button>
              <motion.button
                className="w-full py-3.5 rounded-full font-semibold"
                style={{ background: '#F2F2EE', color: 'var(--color-text)', fontSize: '0.95rem' }}
                variants={linkItemVariants}
                initial="hidden"
                animate="visible"
                custom={6}
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
