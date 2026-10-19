import { useDecorativeMedia } from '../useDecorativeMedia';
import { motion } from 'framer-motion';

const FEATURED_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4';

export default function FeaturedVideoSection() {
  const { showVideo, onVideoError } = useDecorativeMedia();
  return (
    <section className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9 }}
          className="relative rounded-3xl overflow-hidden aspect-video"
        >
          {showVideo && <video
            className="w-full h-full object-cover"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            src={FEATURED_VIDEO}
          onError={onVideoError}
        />}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

          {/* Bottom overlay content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
              <p className="text-white/50 text-xs tracking-widest uppercase mb-3">Our Approach</p>
              <p className="text-white text-sm md:text-base leading-relaxed">
                We believe in the power of curiosity-driven exploration. Every project starts with a question, and every answer opens a new door to innovation.
              </p>
            </div>
            <motion.div
              className="liquid-glass rounded-full px-8 py-3 cursor-pointer flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white text-sm font-medium">Explore more</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
