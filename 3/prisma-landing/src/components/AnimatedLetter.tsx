import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface AnimatedLetterProps {
  text: string;
  className?: string;
}

export default function AnimatedLetter({ text, className = '' }: AnimatedLetterProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');
  const totalChars = chars.length;

  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => {
        const charProgress = i / totalChars;
        const start = Math.max(0, charProgress - 0.1);
        const end = Math.min(1, charProgress + 0.05);

        return (
          <motion.span
            key={i}
            style={{ opacity: useTransform(scrollYProgress, [start, end], [0.2, 1]) }}
          >
            {char === ' ' ? ' ' : char}
          </motion.span>
        );
      })}
    </p>
  );
}
