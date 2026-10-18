import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Hls from "hls.js";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const HLS_URL = "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";

export default function CTA() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(HLS_URL);
      hls.attachMedia(video);
      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = HLS_URL;
    }
  }, []);

  return (
    <section className="relative py-32 md:py-44 border-t border-border/30 overflow-hidden text-center">
      {/* HLS Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-background/45 z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <motion.div {...fadeUp(0)} className="mb-6">
          <div className="inline-flex items-center justify-center">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute w-10 h-10 rounded-full border-2 border-foreground/60" />
              <div className="w-5 h-5 rounded-full border border-foreground/60" />
            </div>
          </div>
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-4xl md:text-6xl font-serif italic font-normal mb-4"
        >
          Start Your Journey
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="text-muted-foreground text-lg mb-10 max-w-md mx-auto"
        >
          Join thousands of readers and writers already on Mindloop. Start your journey today.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="flex items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-foreground text-background rounded-lg px-8 py-3.5 font-semibold text-sm"
          >
            Subscribe Now
          </motion.button>
          <button className="liquid-glass rounded-lg px-8 py-3.5 text-sm font-semibold text-foreground">
            Start Writing
          </button>
        </motion.div>
      </div>
    </section>
  );
}
