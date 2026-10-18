// Simple inline SVG icons since lucide-react removed brand icons
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
    </svg>
  );
}

const navLinks = ["Home", "How It Works", "Philosophy", "Use Cases"];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 md:px-28 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="relative w-7 h-7 flex items-center justify-center">
          <div className="absolute w-7 h-7 rounded-full border-2 border-foreground/60" />
          <div className="w-3 h-3 rounded-full border border-foreground/60" />
        </div>
        <span className="font-semibold text-foreground">Mindloop</span>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-3 text-sm font-medium">
        {navLinks.map((link, i) => (
          <span key={link}>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              {link}
            </a>
            {i < navLinks.length - 1 && (
              <span className="text-muted-foreground/40 ml-3">•</span>
            )}
          </span>
        ))}
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-3">
        <a href="#" className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <InstagramIcon className="w-4 h-4" />
        </a>
        <a href="#" className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <LinkedinIcon className="w-4 h-4" />
        </a>
        <a href="#" className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <XIcon className="w-4 h-4" />
        </a>
      </div>
    </nav>
  );
}
