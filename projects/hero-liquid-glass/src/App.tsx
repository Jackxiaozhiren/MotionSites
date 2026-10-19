import { useState, type PointerEvent } from 'react'
import './App.css'

function App() {
  const [theme, setTheme] = useState<'violet' | 'aqua'>('violet')
  const [clear, setClear] = useState(false)
  function followPointer(e: PointerEvent<HTMLElement>) {
    const box = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', (e.clientX - box.left) + 'px')
    e.currentTarget.style.setProperty('--y', (e.clientY - box.top) + 'px')
  }
  return (
    <main className="glass-page" data-theme={theme} onPointerMove={followPointer}>
      <header className="nav">
        <a className="brand" href="#home"><b>✳</b> Glass Lab<span>.</span></a>
        <nav aria-label="Main navigation"><a href="#experiment">Experiments</a><a href="#about">How it works</a></nav>
        <a className="source-link" href="https://github.com/Jackxiaozhiren/MotionSites/tree/main/projects/hero-liquid-glass" target="_blank" rel="noopener noreferrer">View code ↗</a>
      </header>
      <section id="home" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">✦ CREATIVE FRONTEND EXPERIMENT / 030</p>
          <h1>Shape the<br/><em>invisible.</em></h1>
          <p className="description">An interactive playground for liquid glass, luminous gradients, and interfaces that feel alive.</p>
          <div className="actions">
            <a className="action-primary" href="#experiment">Explore the effect ↗</a>
            <a className="action-secondary" href="#about">Behind the glass ↓</a>
          </div>
          <p className="hint">MOVE YOUR POINTER · TRY THE CONTROLS</p>
        </div>
        <div className="stage" aria-label="Animated and interactive glass artwork">
          <div className="light light-a" aria-hidden="true"/><div className="light light-b" aria-hidden="true"/>
          <div className="orbit orbit-a" aria-hidden="true"/><div className="orbit orbit-b" aria-hidden="true"/>
          <div className={'glass-card' + (clear ? ' glass-card-clear' : '')}>
            <div className="card-header"><span>● ● ●</span><span>REFRACT / 001</span><span>↗</span></div>
            <div className="art"><i className="ring ring-one"/><i className="ring ring-two"/><span>✧</span></div>
            <div className="card-caption"><small>GLASS / STUDY</small><strong>Light in motion.</strong><small>01 — 03</small></div>
          </div>
          <div className="floating-note note-a">OPTICAL DEPTH<br/><b>96%</b></div>
          <div className="floating-note note-b"><span className="bubble"/> Live preview <b>Interactive</b></div>
        </div>
      </section>
      <section id="experiment" className="controls">
        <div><p className="eyebrow">PLAYGROUND / LIVE</p><h2>Make it yours.</h2><p>Adjust the atmosphere. Watch the light respond.</p></div>
        <div className="options" role="group" aria-label="Appearance options">
          <button type="button" className={theme === 'violet' ? 'selected' : ''} aria-pressed={theme === 'violet'} onClick={() => setTheme('violet')}>🟣 Violet haze</button>
          <button type="button" className={theme === 'aqua' ? 'selected' : ''} aria-pressed={theme === 'aqua'} onClick={() => setTheme('aqua')}>🔵 Ocean glass</button>
          <button type="button" aria-pressed={clear} onClick={() => setClear(c => !c)}>{clear ? '◉ Frosted' : '◎ Clear glass'}</button>
        </div>
      </section>
      <footer id="about"><span>CSS backdrops. Dynamic light. No third-party visual assets.</span><span>MotionSites / Experiment 030</span></footer>
    </main>
  )
}
export default App
