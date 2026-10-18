import { motion } from 'framer-motion';
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle';
import AnimatedLetter from './AnimatedLetter';

export default function About() {
  return (
    <section className="bg-black px-4 sm:px-6 md:px-8 py-20 sm:py-28 md:py-36 flex justify-center">
      <div className="bg-[#101010] w-full max-w-6xl rounded-2xl md:rounded-3xl px-6 sm:px-10 md:px-16 py-12 sm:py-16 md:py-20 text-center">
        {/* Label */}
        <motion.p
          className="text-primary text-[10px] sm:text-xs tracking-wider mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          Visual arts
        </motion.p>

        {/* Multi-style Headline */}
        <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-3xl mx-auto leading-[0.95] sm:leading-[0.9]" style={{ color: '#E1E0CC' }}>
          <WordsPullUpMultiStyle
            segments={[
              { text: 'I am Marcus Chen,', className: 'font-normal' },
              { text: 'a self-taught director.', className: 'italic font-serif' },
              { text: 'I have skills in color grading, visual effects, and narrative design.', className: 'font-normal' },
            ]}
          />
        </div>

        {/* Scroll-linked Animated Body */}
        <div className="mt-8 sm:mt-10 md:mt-12 max-w-2xl mx-auto overflow-hidden">
          <AnimatedLetter
            text="Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals."
            className="text-[#DEDBC8] text-xs sm:text-sm md:text-base leading-relaxed break-words"
          />
        </div>
      </div>
    </section>
  );
}
