import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

function CharReveal({
  char,
  scrollYProgress,
  index,
  total,
}: {
  char: string;
  scrollYProgress: motion.MotionValue<number>;
  index: number;
  total: number;
}) {
  const start = index / total;
  const end = Math.min(start + 0.08, 1);
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="invisible">{char === ' ' ? ' ' : char}</span>
      <motion.span
        style={{ opacity }}
        className="absolute inset-0"
        aria-hidden="true"
      >
        {char === ' ' ? ' ' : char}
      </motion.span>
    </span>
  );
}

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export default function AnimatedText({ text, className = '' }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');

  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => (
        <CharReveal
          key={i}
          char={char}
          scrollYProgress={scrollYProgress}
          index={i}
          total={chars.length}
        />
      ))}
    </p>
  );
}
