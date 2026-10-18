import { motion } from 'framer-motion'
import { Button } from './ui/button'

const navLinks = ['Home', 'Pricing', 'About', 'Contact']

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-5 font-body relative z-20"
    >
      <div className="text-xl font-semibold tracking-tight text-foreground">
        ✦ Nexora
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link}
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {link}
          </a>
        ))}
        <Button className="rounded-full px-5 text-sm font-medium">
          Get Started
        </Button>
      </div>
    </motion.nav>
  )
}
