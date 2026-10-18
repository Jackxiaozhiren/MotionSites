import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle';

interface FeatureCardProps {
  index: number;
  children: React.ReactNode;
}

function FeatureCard({ index, children }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

function FeatureChecklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 sm:space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <Check className="w-4 h-4 sm:w-[18px] sm:h-[18px] mt-0.5 flex-shrink-0 text-primary" />
          <span className="text-gray-400 text-[11px] sm:text-xs md:text-sm">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Features() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-50px' });

  return (
    <section className="relative min-h-screen bg-black px-4 sm:px-6 md:px-8 py-20 sm:py-24 md:py-28">
      {/* Background noise */}
      <div className="bg-noise absolute inset-0 opacity-[0.15] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-10 sm:mb-12 md:mb-16">
          <WordsPullUpMultiStyle
            segments={[
              { text: 'Studio-grade workflows for visionary creators.', className: '' },
              { text: 'Built for pure vision. Powered by art.', className: 'text-gray-500' },
            ]}
          />
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1">
          {/* Card 1 - Video */}
          <FeatureCard index={0}>
            <div className="relative h-[320px] sm:h-[360px] lg:h-[480px] rounded-2xl overflow-hidden bg-black">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <p className="text-sm sm:text-base font-medium" style={{ color: '#E1E0CC' }}>
                  Your creative canvas.
                </p>
              </div>
            </div>
          </FeatureCard>

          {/* Card 2 - Project Storyboard */}
          <FeatureCard index={1}>
            <div className="bg-[#212121] h-[320px] sm:h-[360px] lg:h-[480px] rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col">
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85"
                alt=""
                className="w-10 h-10 sm:w-12 sm:h-12 rounded mb-3 sm:mb-4 object-cover"
              />
              <h3 className="text-primary text-sm sm:text-base md:text-lg font-medium mb-2">
                Project Storyboard. <span className="text-gray-500">(01)</span>
              </h3>
              <FeatureChecklist
                items={[
                  'Centralized project dashboard.',
                  'Real-time team collaboration.',
                  'Version control for every frame.',
                  'Drag-and-drop asset management.',
                ]}
              />
              <div className="mt-auto pt-3 sm:pt-4">
                <a href="#" className="inline-flex items-center gap-1.5 text-primary text-[11px] sm:text-xs md:text-sm font-medium group">
                  Learn more
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" style={{ transform: 'rotate(-45deg)' }} />
                </a>
              </div>
            </div>
          </FeatureCard>

          {/* Card 3 - Smart Critiques */}
          <FeatureCard index={2}>
            <div className="bg-[#212121] h-[320px] sm:h-[360px] lg:h-[480px] rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col">
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85"
                alt=""
                className="w-10 h-10 sm:w-12 sm:h-12 rounded mb-3 sm:mb-4 object-cover"
              />
              <h3 className="text-primary text-sm sm:text-base md:text-lg font-medium mb-2">
                Smart Critiques. <span className="text-gray-500">(02)</span>
              </h3>
              <FeatureChecklist
                items={[
                  'AI-powered frame analysis.',
                  'Contextual creative notes.',
                  'Seamless tool integrations.',
                ]}
              />
              <div className="mt-auto pt-3 sm:pt-4">
                <a href="#" className="inline-flex items-center gap-1.5 text-primary text-[11px] sm:text-xs md:text-sm font-medium group">
                  Learn more
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" style={{ transform: 'rotate(-45deg)' }} />
                </a>
              </div>
            </div>
          </FeatureCard>

          {/* Card 4 - Immersion Capsule */}
          <FeatureCard index={3}>
            <div className="bg-[#212121] h-[320px] sm:h-[360px] lg:h-[480px] rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col">
              <img
                src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85"
                alt=""
                className="w-10 h-10 sm:w-12 sm:h-12 rounded mb-3 sm:mb-4 object-cover"
              />
              <h3 className="text-primary text-sm sm:text-base md:text-lg font-medium mb-2">
                Immersion Capsule. <span className="text-gray-500">(03)</span>
              </h3>
              <FeatureChecklist
                items={[
                  'Notification silencing modes.',
                  'Curated ambient soundscapes.',
                  'Intelligent schedule syncing.',
                ]}
              />
              <div className="mt-auto pt-3 sm:pt-4">
                <a href="#" className="inline-flex items-center gap-1.5 text-primary text-[11px] sm:text-xs md:text-sm font-medium group">
                  Learn more
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" style={{ transform: 'rotate(-45deg)' }} />
                </a>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
