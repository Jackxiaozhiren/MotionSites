interface Logo {
  src: string;
  alt: string;
  gradient: { from: string; to: string };
}

const logos: Logo[] = [
  { src: `${import.meta.env.BASE_URL}logos/procure.svg`, alt: 'Procure', gradient: { from: '#3b82f6', to: '#8b5cf6' } },
  { src: `${import.meta.env.BASE_URL}logos/shopify.svg`, alt: 'Shopify', gradient: { from: '#f59e0b', to: '#eab308' } },
  { src: `${import.meta.env.BASE_URL}logos/blender.svg`, alt: 'Blender', gradient: { from: '#3b82f6', to: '#06b6d4' } },
  { src: `${import.meta.env.BASE_URL}logos/figma.svg`, alt: 'Figma', gradient: { from: '#a855f7', to: '#ec4899' } },
  { src: `${import.meta.env.BASE_URL}logos/spotify.svg`, alt: 'Spotify', gradient: { from: '#22c55e', to: '#16a34a' } },
  { src: `${import.meta.env.BASE_URL}logos/lottielab.svg`, alt: 'Lottielab', gradient: { from: '#84cc16', to: '#10b981' } },
  { src: `${import.meta.env.BASE_URL}logos/googlecloud.svg`, alt: 'Google Cloud', gradient: { from: '#0ea5e9', to: '#38bdf8' } },
  { src: `${import.meta.env.BASE_URL}logos/bing.svg`, alt: 'Bing', gradient: { from: '#06b6d4', to: '#14b8a6' } },
];

function LogoCard({ logo }: { logo: Logo }) {
  return (
    <div className="group relative h-24 w-40 shrink-0 flex items-center justify-center rounded-full bg-white border border-slate-200/60 shadow-sm hover:border-slate-300 transition-all overflow-hidden">
      <div
        className="absolute inset-0 scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out"
        style={{ background: `linear-gradient(135deg, ${logo.gradient.from}, ${logo.gradient.to})` }}
      />
      <img
        src={logo.src}
        alt={logo.alt}
        className="relative z-10 h-8 w-auto object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300"
      />
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="group w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]">
      <div className="flex gap-4 w-max animate-marquee group-hover:[animation-play-state:paused] will-change-transform">
        {[...logos, ...logos].map((logo, i) => (
          <LogoCard key={`${logo.alt}-${i}`} logo={logo} />
        ))}
      </div>
    </div>
  );
}
