import { useState } from "react";
import {
  Search,
  User,
  Menu,
  X,
  Star,
  Clock,
  Calendar,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV_LINKS = [
  "Movies",
  "TV Series",
  "Editor's Pick",
  "Interviews",
  "User Reviews",
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-black font-[Inter]">
      {/* Background video — fullscreen, fixed */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4"
      />

      {/* Bottom blur overlay — pure blur, NO dark tint */}
      <div
        className="pointer-events-none absolute inset-0 z-1"
        style={{
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          maskImage: "linear-gradient(to top, black 0%, transparent 45%)",
          WebkitMaskImage:
            "linear-gradient(to top, black 0%, transparent 45%)",
        }}
      />

      {/* Navbar */}
      <nav className="relative z-50 flex shrink-0 items-center justify-between px-4 py-5 sm:px-6 md:px-12 md:py-6">
        {/* Logo */}
        <span
          className="inline-flex animate-blur-fade-up items-center"
          style={{ animationDelay: "0ms" }}
        >
          <span className="text-lg font-semibold tracking-[0.15em] sm:text-xl md:text-2xl">
            CINEMATIC
          </span>
        </span>

        {/* Center nav — lg+ */}
        <div className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link}
              href="#"
              className="animate-blur-fade-up text-sm text-white/70 transition-colors hover:text-white"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search — sm+ */}
          <div
            className="hidden animate-blur-fade-up sm:block"
            style={{ animationDelay: "350ms" }}
          >
            <button className="group liquid-glass flex items-center gap-2 rounded-full px-5 py-2 text-sm text-white/80 transition-colors hover:text-white md:px-6">
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>

          {/* User — sm+ */}
          <div
            className="hidden animate-blur-fade-up sm:block"
            style={{ animationDelay: "400ms" }}
          >
            <button className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white">
              <User size={18} />
            </button>
          </div>

          {/* Hamburger — < lg */}
          <button
            className="liquid-glass animate-blur-fade-up flex h-10 w-10 items-center justify-center rounded-full text-white lg:hidden"
            style={{ animationDelay: "350ms" }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={`absolute transition-all duration-500 ease-out ${
                menuOpen
                  ? "rotate-180 scale-50 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            >
              <Menu size={20} />
            </span>
            <span
              className={`absolute transition-all duration-500 ease-out ${
                menuOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-180 scale-50 opacity-0"
              }`}
            >
              <X size={20} />
            </span>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`absolute left-0 right-0 z-40 border-b border-t border-white/10 bg-black/90 shadow-2xl backdrop-blur-xl transition-all duration-500 ease-out lg:hidden ${
            menuOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-3 opacity-0"
          }`}
          style={{ top: "100%" }}
        >
          <div className="flex flex-col gap-1 px-4 pb-2 pt-4">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link}
                href="#"
                className="rounded-lg px-3 py-3 text-sm text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                style={{
                  animation:
                    menuOpen && i < 5
                      ? `slideIn 0.35s ease-out ${50 * i}ms forwards`
                      : "none",
                  opacity: 0,
                  transform: "translateX(-12px)",
                }}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Search & User — mobile only */}
          <div className="flex items-center gap-3 border-t border-white/10 px-4 py-4 sm:hidden">
            <button className="liquid-glass flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm text-white/80 transition-colors hover:text-white">
              <Search size={18} />
              <span>Search</span>
            </button>
            <button className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white">
              <User size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero content — flex-1 fills remaining space, justify-end pushes to bottom */}
      <main className="relative z-10 flex flex-1 flex-col justify-end px-4 pb-10 sm:px-6 md:px-12 md:pb-16">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:gap-8">
          {/* Left */}
          <div className="min-w-0 flex-1">
            {/* Metadata row */}
            <div className="mb-5 flex flex-wrap items-center gap-4 text-xs sm:mb-6 sm:gap-6 sm:text-sm md:mb-8">
              <span
                className="animate-blur-fade-up flex items-center gap-1.5 font-medium text-white/90"
                style={{ animationDelay: "300ms" }}
              >
                <Star
                  size={16}
                  className="fill-white sm:h-[18px] sm:w-[18px]"
                />
                8.7/10 IMDB
              </span>
              <span
                className="animate-blur-fade-up flex items-center gap-1.5 text-white/60"
                style={{ animationDelay: "350ms" }}
              >
                <Clock size={16} />
                132 min
              </span>
              <span
                className="animate-blur-fade-up flex items-center gap-1.5 text-white/60"
                style={{ animationDelay: "400ms" }}
              >
                <Calendar size={16} />
                April, 2025
              </span>
            </div>

            {/* Title */}
            <h1
              className="animate-blur-fade-up mb-3 text-[clamp(2rem,5vw,4.5rem)] font-[350] leading-[1.08] tracking-[-0.03em] sm:text-5xl md:mb-4 md:text-6xl lg:text-7xl xl:text-8xl"
              style={{ animationDelay: "450ms" }}
            >
              Step Through.
              <br />
              Work Smarter.
            </h1>

            {/* Description */}
            <p
              className="animate-blur-fade-up mb-8 max-w-xl text-sm leading-relaxed text-white/50 sm:text-base md:mb-10 md:text-lg lg:max-w-2xl lg:text-xl"
              style={{ animationDelay: "550ms" }}
            >
              A voyage through forgotten realms, where past and future
              intertwine.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                className="animate-blur-fade-up flex items-center gap-2.5 rounded-full bg-white px-7 py-[11px] text-sm font-semibold text-black shadow-lg shadow-white/10 transition-all hover:bg-white/90 hover:shadow-white/20 active:scale-[0.97] sm:px-8 sm:py-3"
                style={{ animationDelay: "650ms" }}
              >
                <Play size={18} fill="black" />
                Watch Now
              </button>
              <button
                className="liquid-glass animate-blur-fade-up rounded-full px-7 py-[11px] text-sm font-medium text-white/80 transition-all hover:text-white sm:px-8 sm:py-3"
                style={{ animationDelay: "750ms" }}
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Right — navigation arrows */}
          <div className="flex shrink-0 flex-row gap-3 self-start md:self-end md:flex-col">
            <button
              className="liquid-glass animate-blur-fade-up flex items-center gap-2 rounded-full px-5 py-[11px] text-sm text-white/70 transition-all hover:text-white sm:px-6 sm:py-3"
              style={{ animationDelay: "850ms" }}
            >
              <ChevronLeft size={18} />
              <span>Previous</span>
            </button>
            <button
              className="liquid-glass animate-blur-fade-up flex items-center gap-2 rounded-full px-5 py-[11px] text-sm text-white/70 transition-all hover:text-white sm:px-6 sm:py-3"
              style={{ animationDelay: "950ms" }}
            >
              <span>Next</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* Mobile menu slide-in keyframes */}
      <style>{`
        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
