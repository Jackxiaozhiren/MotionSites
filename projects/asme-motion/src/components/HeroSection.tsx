import { useRef, useEffect } from 'react';
import { Globe, ArrowRight, Camera, MessageCircle } from 'lucide-react';

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4';

function useVideoFade(videoRef: React.RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let fadeAnimId: number | null = null;
    let loopTimerId: ReturnType<typeof setTimeout> | null = null;

    function fadeTo(from: number, to: number, duration: number, onDone?: () => void) {
      const start = performance.now();
      function step(now: number) {
        const t = Math.min((now - start) / duration, 1);
        video!.style.opacity = String(from + (to - from) * t);
        if (t < 1) {
          fadeAnimId = requestAnimationFrame(step);
        } else {
          fadeAnimId = null;
          onDone?.();
        }
      }
      fadeAnimId = requestAnimationFrame(step);
    }

    function handleCanPlay() {
      video!.play().catch(() => {});
      fadeTo(0, 1, 500);
    }

    function handleTimeUpdate() {
      if (!video || video.duration === 0) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && video.style.opacity !== '0') {
        if (fadeAnimId) cancelAnimationFrame(fadeAnimId);
        const current = parseFloat(video.style.opacity) || 1;
        fadeTo(current, 0, 500);
      }
    }

    function handleEnded() {
      video!.style.opacity = '0';
      loopTimerId = setTimeout(() => {
        video!.currentTime = 0;
        video!.play().catch(() => {});
        fadeTo(0, 1, 500);
      }, 100);
    }

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      if (fadeAnimId) cancelAnimationFrame(fadeAnimId);
      if (loopTimerId) clearTimeout(loopTimerId);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoRef]);
}

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useVideoFade(videoRef);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black flex flex-col">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        style={{ opacity: 0 }}
        muted
        autoPlay
        playsInline
        preload="auto"
        src={HERO_VIDEO}
      />

      {/* Navbar */}
      <nav className="relative z-20 px-6 pt-6">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-2">
            <Globe size={24} className="text-white" />
            <span className="text-white font-semibold text-lg">Asme</span>
            <div className="hidden md:flex items-center gap-8 ml-8">
              <a href="#" className="text-white/80 hover:text-white text-sm font-medium">Features</a>
              <a href="#" className="text-white/80 hover:text-white text-sm font-medium">Pricing</a>
              <a href="#" className="text-white/80 hover:text-white text-sm font-medium">About</a>
            </div>
          </div>
          {/* Right */}
          <div className="flex items-center gap-4">
            <span className="text-white text-sm font-medium cursor-pointer">Sign Up</span>
            <div className="liquid-glass rounded-full px-6 py-2 cursor-pointer">
              <span className="text-white text-sm font-medium">Login</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1
          className="text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Know it then <em className="italic">all</em>
        </h1>

        {/* Email Input */}
        <div className="max-w-xl w-full mt-8">
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-transparent flex-1 text-white placeholder:text-white/40 outline-none text-sm"
            />
            <button className="bg-white rounded-full p-3 text-black flex-shrink-0 cursor-pointer">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <p className="text-white text-sm leading-relaxed px-4 mt-6 max-w-md">
          Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
        </p>

        <div className="liquid-glass rounded-full px-8 py-3 mt-6 cursor-pointer hover:bg-white/5 transition-colors">
          <span className="text-white text-sm font-medium">Manifesto</span>
        </div>
      </div>

      {/* Social Footer */}
      <div className="relative z-10 flex justify-center gap-4 pb-12">
        <div className="liquid-glass rounded-full p-4 cursor-pointer text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Camera size={20} />
        </div>
        <div className="liquid-glass rounded-full p-4 cursor-pointer text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <MessageCircle size={20} />
        </div>
        <div className="liquid-glass rounded-full p-4 cursor-pointer text-white/80 hover:text-white hover:bg-white/5 transition-all">
          <Globe size={20} />
        </div>
      </div>
    </section>
  );
}
