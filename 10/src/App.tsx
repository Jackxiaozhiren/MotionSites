import { useState, type ComponentType } from 'react'
import { X, Circle } from 'lucide-react'

function InstagramIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function LinkedinIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260602_150901_c45b90ec-18d7-42ff-90e2-b95d7109e330.mp4'

const SERVICES = [
  'Website',
  'Mobile App',
  'Web App',
  'E-Commerce',
  'Visual Identity',
  '3D & Motion',
  'Digital Marketing',
  'Growth & Consulting',
  'Other',
] as const

function SocialBtn({
  icon: Icon,
  bg,
  color,
  href,
}: {
  icon: ComponentType<{ size: number }>
  bg: string
  color: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${bg} ${color} w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-80 transition-opacity`}
    >
      <Icon size={13} />
    </a>
  )
}

function App() {
  const [selected, setSelected] = useState<string[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  function toggleService(s: string) {
    setSelected((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSending(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6">
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden relative min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)] md:min-h-[calc(100vh-48px)] lg:h-[calc(100vh-48px)]">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        {/* Content layer */}
        <div className="relative z-10 flex flex-col min-h-[calc(100vh-24px)] sm:min-h-[calc(100vh-32px)] md:min-h-[calc(100vh-48px)] lg:h-full p-4 sm:p-6 md:p-8 gap-6">
          {/* Navbar */}
          <nav className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm pl-3 sm:pl-4 pr-2 py-2 w-full sm:w-auto flex items-center gap-3 sm:gap-6">
            {/* Logo */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 256 256"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z" fill="black" />
              <path d="M 256 128 L 128 128 L 0 0 L 128 0 Z" fill="black" />
            </svg>

            {/* Links - hidden on mobile */}
            <div className="hidden sm:flex items-center gap-6">
              {['Our story', 'Expertise', 'Our work', 'Journal'].map(
                (link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-gray-800 text-sm font-medium hover:opacity-60 transition-opacity whitespace-nowrap"
                  >
                    {link}
                  </a>
                ),
              )}
            </div>

            {/* CTA */}
            <a
              href="#"
              className="ml-auto bg-black text-white text-sm font-medium px-4 sm:px-5 py-2 rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Start a project
            </a>
          </nav>

          {/* Spacer */}
          <div className="flex-1 min-h-[2rem]" />

          {/* Bottom row */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            {/* Headline */}
            <p className="text-white text-3xl sm:text-4xl xl:text-5xl font-medium leading-tight drop-shadow-lg lg:max-w-lg xl:max-w-2xl shrink-0">
              We craft bold ideas
              <br />
              and ship them as{' '}
              <span
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: 'italic',
                  fontWeight: 400,
                }}
              >
                products
              </span>
            </p>

            {/* Contact form card */}
            <div className="w-full lg:w-[min(480px,45%)] shrink-0">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-4 sm:p-6 flex flex-col gap-4">
                {sent ? (
                  /* Success state */
                  <div className="flex flex-col items-center py-6 gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-xl">
                      ✓
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                      You're all set!
                    </h3>
                    <p className="text-sm text-gray-500">
                      Expect a reply within 24 hours.
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl sm:text-2xl font-semibold text-black tracking-tight">
                      Say hello! 👋
                    </h2>

                    {/* Email + socials */}
                    <div className="flex flex-row items-center justify-between gap-3 bg-gray-50 rounded-2xl px-4 py-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs text-gray-400 shrink-0">
                          Drop us a line
                        </span>
                        <a
                          href="mailto:hello@forma.co"
                          className="text-blue-600 font-semibold hover:underline truncate text-sm"
                        >
                          hello@forma.co
                        </a>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <SocialBtn
                          icon={X}
                          bg="bg-gray-100"
                          color="text-gray-800"
                          href="#"
                        />
                        <SocialBtn
                          icon={Circle}
                          bg="bg-pink-100"
                          color="text-pink-500"
                          href="#"
                        />
                        <SocialBtn
                          icon={InstagramIcon}
                          bg="bg-orange-100"
                          color="text-orange-400"
                          href="#"
                        />
                        <SocialBtn
                          icon={LinkedinIcon}
                          bg="bg-blue-100"
                          color="text-blue-600"
                          href="#"
                        />
                      </div>
                    </div>

                    {/* OR divider */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-gray-400 font-medium text-sm">
                        OR
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Form */}
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-4"
                    >
                      <label className="text-sm font-medium text-black">
                        Tell us about your vision
                      </label>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          placeholder="Full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="flex-1 min-w-0 text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="flex-1 min-w-0 text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>

                      <textarea
                        rows={4}
                        placeholder="What are you looking to build or improve..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
                      />

                      {/* Service tags */}
                      <div>
                        <label className="text-sm font-medium text-black mb-2 block">
                          I need help with...
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {SERVICES.map((s) => {
                            const active = selected.includes(s)
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => toggleService(s)}
                                className={`text-xs font-medium px-3 py-2 rounded-lg border transition-all ${
                                  active
                                    ? 'bg-gray-100 text-black border-black'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                                }`}
                              >
                                {s}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full bg-black text-white text-sm font-semibold py-3 rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-60"
                      >
                        {sending ? 'Sending...' : 'Send my message'}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
