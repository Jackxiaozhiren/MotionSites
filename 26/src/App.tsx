import { useEffect, useRef, useState, useCallback } from 'react'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pipelineRef = useRef<HTMLDivElement>(null)
  const nodeStackRef = useRef<HTMLDivElement>(null)
  const nodeXRef = useRef<HTMLDivElement>(null)
  const nodeShieldRef = useRef<HTMLDivElement>(null)
  const beamGlowRef = useRef<SVGPathElement>(null)
  const beamCoreRef = useRef<SVGPathElement>(null)
  const gradientRef = useRef<SVGLinearGradientElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      document.body.style.overflow = prev ? '' : 'hidden'
      return !prev
    })
  }, [])

  useEffect(() => {
    let animationId: number
    let state: 'p1' | 'splash' | 'p2' | 'idle' = 'p1'
    let lastStateChange = performance.now()
    let percentage = 0

    const updatePath = () => {
      if (
        !pipelineRef.current ||
        !nodeStackRef.current ||
        !nodeXRef.current ||
        !nodeShieldRef.current ||
        !beamGlowRef.current ||
        !beamCoreRef.current
      )
        return

      const pRect = pipelineRef.current.getBoundingClientRect()
      const sRect = nodeStackRef.current.getBoundingClientRect()
      const xRect = nodeXRef.current.getBoundingClientRect()
      const shRect = nodeShieldRef.current.getBoundingClientRect()

      const startX = sRect.left + sRect.width / 2 - pRect.left
      const startY = sRect.top + sRect.height / 2 - pRect.top
      const midX = xRect.left + xRect.width / 2 - pRect.left
      const midY = xRect.top + xRect.height / 2 - pRect.top
      const endX = shRect.left + shRect.width / 2 - pRect.left
      const endY = shRect.top + shRect.height / 2 - pRect.top

      const d = `M ${startX},${startY} L ${midX},${midY} L ${endX},${endY}`
      beamGlowRef.current.setAttribute('d', d)
      beamCoreRef.current.setAttribute('d', d)

      const svg = beamGlowRef.current.closest('svg')
      if (svg) {
        svg.setAttribute('viewBox', `0 0 ${pRect.width} ${pRect.height}`)
      }
    }

    const updateGradient = () => {
      if (!gradientRef.current) return
      const center = percentage * 100
      const halfWidth = 5
      gradientRef.current.setAttribute('x1', `${center - halfWidth}%`)
      gradientRef.current.setAttribute('x2', `${center + halfWidth}%`)
      gradientRef.current.setAttribute('y1', '0%')
      gradientRef.current.setAttribute('y2', '0%')
    }

    const animate = (timestamp: number) => {
      const elapsed = timestamp - lastStateChange

      switch (state) {
        case 'p1': {
          const t = Math.min(elapsed / 800, 1)
          const ease = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2
          percentage = ease * 0.5

          updateGradient()

          if (nodeStackRef.current) {
            if (percentage < 0.4 && !nodeStackRef.current.classList.contains('active')) {
              nodeStackRef.current.classList.add('active')
            } else if (percentage >= 0.4) {
              nodeStackRef.current.classList.remove('active')
            }
          }

          if (t >= 1) {
            state = 'splash'
            lastStateChange = timestamp
            if (beamGlowRef.current) beamGlowRef.current.style.opacity = '0'
            if (beamCoreRef.current) beamCoreRef.current.style.opacity = '0'
            if (splashRef.current) {
              splashRef.current.classList.remove('animate')
              void splashRef.current.offsetWidth
              splashRef.current.classList.add('animate')
            }
          }
          break
        }

        case 'splash': {
          if (elapsed >= 800) {
            state = 'p2'
            lastStateChange = timestamp
            if (beamGlowRef.current) beamGlowRef.current.style.opacity = '1'
            if (beamCoreRef.current) beamCoreRef.current.style.opacity = '1'
            if (splashRef.current) splashRef.current.classList.remove('animate')
          }
          break
        }

        case 'p2': {
          const t = Math.min(elapsed / 800, 1)
          const ease = 1 - (1 - t) * (1 - t) * (1 - t)
          percentage = 0.5 + ease * 0.5

          updateGradient()

          if (nodeShieldRef.current) {
            if (percentage > 0.6 && !nodeShieldRef.current.classList.contains('active')) {
              nodeShieldRef.current.classList.add('active')
            } else if (percentage <= 0.6) {
              nodeShieldRef.current.classList.remove('active')
            }
          }

          if (t >= 1) {
            if (nodeShieldRef.current) nodeShieldRef.current.classList.remove('active')
            state = 'idle'
            lastStateChange = timestamp
          }
          break
        }

        case 'idle': {
          if (elapsed >= 1000) {
            state = 'p1'
            lastStateChange = timestamp
            percentage = 0
          }
          break
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    updatePath()
    animationId = requestAnimationFrame(animate)

    const handleResize = () => updatePath()
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <>
      <nav>
        <span className="nav-logo">Xero</span>
        <div className={`nav-menu${menuOpen ? ' active' : ''}`}>
          <ul className="nav-links">
            <li><a href="#">Method</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Docs</a></li>
          </ul>
          <div className="nav-actions">
            <button className="btn-login">Log in</button>
            <button className="btn-signup">Sign up</button>
          </div>
        </div>
        <button
          className={`menu-toggle${menuOpen ? ' active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
        </button>
      </nav>

      <section className="hero-card">
        <div className="hero-grid"></div>

        <div className="icon-pipeline" ref={pipelineRef}>
          <svg className="beam-svg">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="beam-gradient" gradientUnits="userSpaceOnUse" ref={gradientRef}>
                <stop offset="0%" stopColor="#b04090" stopOpacity="0" />
                <stop offset="20%" stopColor="#b04090" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fff" stopOpacity="1" />
                <stop offset="80%" stopColor="#c8a0e0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c8a0e0" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              ref={beamGlowRef}
              d=""
              stroke="url(#beam-gradient)"
              strokeWidth="2"
              fill="none"
              filter="url(#glow)"
              opacity="0.6"
            />
            <path
              ref={beamCoreRef}
              d=""
              stroke="url(#beam-gradient)"
              strokeWidth="0.8"
              fill="none"
            />
          </svg>

          <div className="icon-node node-light-right" ref={nodeStackRef} id="node-stack">
            <svg viewBox="0 0 24 24">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>

          <div className="pipeline-line"></div>

          <div className="center-wrapper">
            <div className="splash" ref={splashRef}></div>
            <div className="icon-node-center" ref={nodeXRef} id="node-x">
              <svg viewBox="0 0 40 40" fill="none">
                <path d="M9 9 L31 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M31 9 L9 31" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M6 9 h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M34 9 h-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M6 31 h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M34 31 h-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="pipeline-line right"></div>

          <div className="icon-node node-light-left" ref={nodeShieldRef} id="node-shield">
            <svg viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
        </div>

        <div className="hero-content">
          <h1 className="hero-heading">
            The simple way
            <strong>encryption your data</strong>
          </h1>
          <p className="hero-sub">
            Fully managed data encrypting service and annotation<br />
            platform for teams of all industries.
          </p>
          <a href="#" className="btn-cta">Get Started</a>
        </div>
      </section>

      <div className="brands">
        <div className="brand-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" />
            <path fill="#0a0a0f" d="M8 9h8v2H8zm0 4h6v2H8z" />
          </svg>
          Expedia
        </div>
        <div className="brand-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="7" r="4" />
            <circle cx="5" cy="16" r="3.5" />
            <circle cx="19" cy="16" r="3.5" />
          </svg>
          asana
        </div>
        <div className="brand-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="4,8 20,8" />
            <polyline points="6,12 18,12" />
            <polyline points="4,16 20,16" />
          </svg>
          zenefits
        </div>
        <div className="brand-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="15.5" cy="8.5" r="2.5" fill="currentColor" stroke="none" />
            <circle cx="8.5" cy="8.5" r="2" />
            <path d="M10 10 L14 7" />
            <path d="M10 7 L14 10" />
          </svg>
          HubS<span className="hubspot-dot"></span>t
        </div>
        <div className="brand-item">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="3" x2="12" y2="21" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
          loom
        </div>
      </div>
    </>
  )
}

export default App
