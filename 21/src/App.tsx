import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const NAV_LINKS = ['Gallery', 'Styles', 'API', 'Pricing', 'Blog'];
const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_080827_a9e5ad52-b6ee-4e79-b393-d936f179cfd7.mp4';

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return reduced;
}

function LogoMark() {
  return (
    <svg width="44" height="26" viewBox="0 0 44 26" fill="none" aria-hidden>
      <rect x="0" y="3" width="14" height="20" rx="3" fill="white" />
      <rect x="16" y="3" width="12" height="20" rx="3" fill="white" />
      <rect x="30" y="3" width="14" height="20" rx="3" fill="white" />
    </svg>
  );
}

function App() {
  const [mounted, setMounted] = useState(false);
  const [framesReady, setFramesReady] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const reducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoBgRef = useRef<HTMLDivElement>(null);
  const displayCanvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLCanvasElement[]>([]);

  /* mount fade-in */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* Effect 1 — Memory-bounded frame capture (boomerang). */
  useEffect(() => {
    framesRef.current = [];
    setFramesReady(false);
    if (reducedMotion || mediaFailed) return;

    const video = videoRef.current;
    if (!video) return;

    let capturing = true;
    let started = false;
    let lastTime = -1;
    let vfcId: number | undefined;
    let rafId: number | undefined;
    const frames: HTMLCanvasElement[] = [];
    // 480×270 RGBA × 48 frames is about 24 MB, versus an unbounded
    // full-resolution canvas for every video frame.
    const MAX_WIDTH = 480;
    const MAX_FRAMES = 48;
    const MIN_INTERVAL = 1 / 8;

    function finishCapture() {
      if (!capturing) return;
      capturing = false;
      if (frames.length > 1) {
        framesRef.current = frames;
        setFramesReady(true);
        video!.pause();
      }
    }

    function captureFrame() {
      if (!capturing || !video || video.readyState < 2 || !video.videoWidth) return;
      if (lastTime >= 0 && video.currentTime - lastTime < MIN_INTERVAL) return;
      lastTime = video.currentTime;

      const scale = Math.min(1, MAX_WIDTH / video.videoWidth);
      const w = Math.max(1, Math.round(video.videoWidth * scale));
      const h = Math.max(1, Math.round(video.videoHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const context = canvas.getContext('2d');
      if (!context) return;
      try {
        context.drawImage(video, 0, 0, w, h);
        frames.push(canvas);
        if (frames.length >= MAX_FRAMES) finishCapture();
      } catch {
        // A remote video can fail due to CORS. Keep the static fallback.
        capturing = false;
        setMediaFailed(true);
      }
    }

    function startCapture() {
      if (started || !capturing) return;
      started = true;
      video.play().catch(() => setMediaFailed(true));

      function loop() {
        if (!capturing) return;
        captureFrame();
        if (!capturing) return;
        if (video!.requestVideoFrameCallback) {
          vfcId = video!.requestVideoFrameCallback(loop);
        } else {
          rafId = requestAnimationFrame(loop);
        }
      }
      loop();
    }

    video.addEventListener('loadedmetadata', startCapture);
    video.addEventListener('ended', finishCapture);
    if (video.readyState >= 1) startCapture();

    return () => {
      capturing = false;
      if (vfcId !== undefined && video.cancelVideoFrameCallback) {
        video.cancelVideoFrameCallback(vfcId);
      }
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      video.removeEventListener('loadedmetadata', startCapture);
      video.removeEventListener('ended', finishCapture);
      video.pause();
      framesRef.current = [];
    };
  }, [reducedMotion, mediaFailed]);

  /* Effect 2 — Pause playback when the tab is hidden. */
  useEffect(() => {
    if (!framesReady || reducedMotion) return;
    const canvas = displayCanvasRef.current;
    const frames = framesRef.current;
    if (!canvas || frames.length < 2) return;

    canvas.width = frames[0].width;
    canvas.height = frames[0].height;
    const context = canvas.getContext('2d');
    if (!context) return;

    let index = 0;
    let direction = 1;
    let last = performance.now();
    let rafId: number;
    function render(now: number) {
      if (!document.hidden && now - last >= 1000 / 24) {
        context!.drawImage(frames[index], 0, 0);
        index += direction;
        if (index >= frames.length - 1) {
          index = frames.length - 1;
          direction = -1;
        } else if (index <= 0) {
          index = 0;
          direction = 1;
        }
        last = now;
      }
      rafId = requestAnimationFrame(render);
    }
    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [framesReady, reducedMotion]);

  /* Effect 3 — Event-driven parallax; no idle animation loop. */
  useEffect(() => {
    const wrapper = videoBgRef.current;
    if (!wrapper || reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;

    function onMouseMove(event: MouseEvent) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      gsap.to(wrapper, {
        x: ((event.clientX - cx) / cx) * 20,
        y: ((event.clientY - cy) / cy) * 20,
        duration: 0.6,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.killTweensOf(wrapper);
      gsap.set(wrapper, { x: 0, y: 0 });
    };
  }, [reducedMotion]);

  return (
    <div className="min-h-screen bg-black text-white font-body overflow-x-hidden">
      {/* Video background layer */}
      <div
        ref={videoBgRef}
        className="fixed top-0 left-0 w-full h-full z-0 scale-[1.08] origin-center bg-gradient-to-br from-[#152f42] via-[#121e35] to-black"
        aria-hidden="true"
      >
        <video
          ref={videoRef}
          src={reducedMotion || mediaFailed ? undefined : VIDEO_SRC}
          muted
          playsInline
          preload="metadata"
          onError={() => setMediaFailed(true)}
          crossOrigin="anonymous"
          className="w-full h-full object-cover"
          style={{ display: reducedMotion || mediaFailed || framesReady ? 'none' : 'block' }}
        />
        <canvas
          ref={displayCanvasRef}
          className="w-full h-full object-cover"
          style={{ display: !reducedMotion && framesReady ? 'block' : 'none' }}
        />
      </div>

      {/* Hero title */}
      <div
        className={`fixed left-0 right-0 z-20 w-full px-4 text-center transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
        style={{ top: '126px' }}
      >
        <h1 className="hero-title select-none">MicroVisuals</h1>
      </div>

      {/* Nav */}
      <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap">
        <div className="liquid-glass flex items-center gap-6 rounded px-4 py-2.5">
          <LogoMark />
          <div className="flex items-center gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                className="text-sm font-body font-light text-white/70 hover:text-white transition-colors duration-200"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-4">
            <a className="text-sm font-body font-light text-white/70 hover:text-white transition-colors duration-200">
              Sign in
            </a>
            <button className="liquid-glass-strong text-sm font-body font-medium text-white rounded px-4 py-1.5 transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_16px_2px_rgba(255,255,255,0.12)] active:scale-[0.97]">
              Try it free
            </button>
          </div>
        </div>
      </nav>

      {/* Bottom row */}
      <div
        className={`fixed bottom-12 left-0 right-0 px-10 flex items-end justify-between z-20 transition-all duration-1000 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <p className="text-sm font-body font-light text-white/75 max-w-[220px] leading-relaxed">
          Forma's AI understands context, composition, and style like a creative
          director would.
        </p>

        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center gap-3">
          <button className="group relative bg-white text-black text-sm font-body font-medium rounded px-6 py-3 overflow-hidden active:scale-[0.97] transition-all duration-200 shadow-[0_0_0_0_rgba(255,255,255,0)] hover:shadow-[0_0_24px_4px_rgba(255,255,255,0.25)] hover:scale-[1.03]">
            <span className="relative z-10">Start generating</span>
            <span className="absolute inset-0 bg-gradient-to-b from-white to-white/85 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>

          <button className="liquid-glass group text-white text-sm font-body font-medium rounded px-6 py-3 active:scale-[0.97] transition-all duration-200 hover:scale-[1.03] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_2px_rgba(255,255,255,0.07)]">
            See templates
          </button>
        </div>

        <p className="text-sm font-body font-light text-white/75 max-w-[220px] leading-relaxed text-right">
          Describe what you see in your head — get images that actually match.
        </p>
      </div>
    </div>
  );
}

export default App;
