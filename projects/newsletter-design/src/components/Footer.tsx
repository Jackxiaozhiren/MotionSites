import { MessageCircle, Rss, Image, Play, Briefcase, Music2 } from 'lucide-react'

const socialIcons = [
  { icon: MessageCircle, label: 'Facebook' },
  { icon: Rss, label: 'Twitter' },
  { icon: Image, label: 'Instagram' },
  { icon: Play, label: 'Youtube' },
  { icon: Briefcase, label: 'Linkedin' },
  { icon: Music2, label: 'Music2' },
]

export default function Footer() {
  return (
    <footer className="bg-[#080808] text-white pt-12 px-10 text-center border-t border-white/5">
      {/* Wordmark */}
      <div className="pb-8 flex justify-center">
        <a
          href="#"
          className="text-[30px] font-bold tracking-tight text-white hover:text-[#DCFF00] transition-colors"
        >
          Design Rocket
        </a>
      </div>

      {/* Disclaimer */}
      <p className="text-[12px] text-[#83837D] leading-[1.5] pb-8">
        Microsoft is a collaborator on this specific course. Microsoft does not endorse
        Design Rocket generally or other Design Rocket products.
      </p>

      {/* Divider */}
      <div className="flex justify-center pb-8">
        <div className="h-px w-24 bg-white/20" />
      </div>

      {/* Social icons */}
      <div className="flex justify-center gap-5 pb-5">
        {socialIcons.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.label}
              href="#"
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-[#1E1E1E] hover:border-white transition-colors"
              aria-label={item.label}
            >
              <Icon className="w-[18px] h-[18px]" />
            </a>
          )
        })}
      </div>

      {/* Unsubscribe note */}
      <p className="text-[10px] text-[#83837D] pb-4 leading-[1.6]">
        If you no longer want to receive updates on Design Rocket Certificates,
        you can unsubscribe at any time by clicking &ldquo;unsubscribe&rdquo; below.
      </p>

      {/* Link row */}
      <div className="text-[12px] pb-3">
        <a href="#" className="hover:underline">Support</a>
        <span className="text-[#8F8E88] mx-2">|</span>
        <a href="#" className="hover:underline">Privacy</a>
        <span className="text-[#8F8E88] mx-2">|</span>
        <a href="#" className="hover:underline">Terms</a>
        <span className="text-[#8F8E88] mx-2">|</span>
        <a href="#" className="hover:underline">Unsubscribe</a>
      </div>

      {/* Copyright */}
      <a href="#" className="text-[12px] text-white/80 hover:text-white inline-block">
        &copy;2026 Design Rocket, 660 4th Street #443, San Francisco, CA 94107 USA
      </a>

      {/* Trailing spacer */}
      <div className="pb-10" />
    </footer>
  )
}
