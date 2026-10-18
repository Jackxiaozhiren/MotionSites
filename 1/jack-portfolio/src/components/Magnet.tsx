import { useRef, useState, ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  className = '',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('translate3d(0, 0, 0)');
  const [transition, setTransition] = useState('transform 0.6s ease-in-out');

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    if (
      Math.abs(dx) > rect.width / 2 + padding ||
      Math.abs(dy) > rect.height / 2 + padding
    ) {
      setTransform('translate3d(0, 0, 0)');
      setTransition('transform 0.6s ease-in-out');
      return;
    }

    setTransition('transform 0.3s ease-out');
    setTransform(`translate3d(${dx / strength}px, ${dy / strength}px, 0)`);
  };

  const handleMouseLeave = () => {
    setTransform('translate3d(0, 0, 0)');
    setTransition('transform 0.6s ease-in-out');
  };

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
