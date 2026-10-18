import Logo from './Logo'
import { Menu, X } from 'lucide-react'

const navLinks = ['Vault', 'Plans', 'Install', 'News', 'Help']

export default function Navbar({
  mobileMenuOpen,
  onMenuToggle,
}: {
  mobileMenuOpen: boolean
  onMenuToggle: () => void
}) {
  return (
    <nav className="relative z-10 w-full px-5 sm:px-8 py-4 sm:py-5" style={{ maxWidth: 1280, margin: '0 auto' }}>
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <Logo />

        {/* Center: Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-text)' }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right: Desktop buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:shadow-lg active:scale-95"
            style={{ background: '#7342E2', color: '#fff' }}
          >
            Start For Free
          </button>
          <button
            className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:shadow-lg active:scale-95"
            style={{ background: 'var(--color-login-bg)', color: 'var(--color-text)' }}
          >
            Sign In
          </button>
        </div>

        {/* Mobile: Hamburger / X toggle */}
        <button
          className="md:hidden flex items-center justify-center"
          onClick={onMenuToggle}
          style={{ color: 'var(--color-text)' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  )
}
