import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
}

export default function WordsPullUp({ text, className = '', showAsterisk = false }: WordsPullUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const words = text.split(' ');

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const isLastWord = i === words.length - 1;
        const endsWithA = isLastWord && showAsterisk && word.toLowerCase().endsWith('a');
        return (
          <motion.span
            key={i}
            className="inline-block mr-[0.3em] relative"
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: i * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {endsWithA && (
              <span
                className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]"
                style={{ lineHeight: 1 }}
              >
                *
              </span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
}
