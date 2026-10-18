import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const GIFS_ROW1 = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
];

const GIFS_ROW2 = [
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

const TRIPLED_ROW1 = [...GIFS_ROW1, ...GIFS_ROW1, ...GIFS_ROW1];
const TRIPLED_ROW2 = [...GIFS_ROW2, ...GIFS_ROW2, ...GIFS_ROW2];

function MarqueeRow({
  images,
  scrollYProgress,
  dir,
}: {
  images: string[];
  scrollYProgress: motion.MotionValue<number>;
  dir: 'right' | 'left';
}) {
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    dir === 'right' ? [-200, 200] : [200, -200]
  );

  return (
    <motion.div
      className="flex gap-3"
      style={{ x, willChange: 'transform' }}
    >
      {images.map((src, i) => (
        <img
          key={`${src}-${i}`}
          src={src}
          alt=""
          className="w-[420px] h-[270px] rounded-2xl object-cover flex-shrink-0"
          loading="lazy"
        />
      ))}
    </motion.div>
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section ref={sectionRef} className="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      <div className="flex flex-col gap-3">
        <MarqueeRow images={TRIPLED_ROW1} dir="right" scrollYProgress={scrollYProgress} />
        <MarqueeRow images={TRIPLED_ROW2} dir="left" scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}
