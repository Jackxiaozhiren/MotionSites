import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const platforms = [
  {
    icon: "/icon-chatgpt.svg",
    name: "ChatGPT",
    description: "Conversational AI that helps you brainstorm, draft, and refine ideas with natural dialogue.",
  },
  {
    icon: "/icon-perplexity.svg",
    name: "Perplexity",
    description: "AI-powered search engine that delivers precise answers with cited sources in real-time.",
  },
  {
    icon: "/icon-google.svg",
    name: "Google AI",
    description: "Advanced machine learning tools and models powering the next generation of smart applications.",
  },
];

export default function SearchChanged() {
  return (
    <section className="pt-52 md:pt-64 pb-6 md:pb-9 text-center px-4">
      <motion.h2
        {...fadeUp(0)}
        className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-[-2px] mb-4"
      >
        Search has <span className="font-serif italic font-normal">changed.</span> Have you?
      </motion.h2>

      <motion.p
        {...fadeUp(0.1)}
        className="text-muted-foreground text-lg max-w-2xl mx-auto mb-24"
      >
        The way we find information is evolving fast. AI-powered tools are reshaping how we
        discover, learn, and make decisions.
      </motion.p>

      {/* Platform Cards */}
      <div className="grid md:grid-cols-3 gap-12 md:gap-8 max-w-5xl mx-auto mb-20">
        {platforms.map((platform, i) => (
          <motion.div
            key={platform.name}
            {...fadeUp(0.1 + i * 0.1)}
            className="flex flex-col items-center text-center"
          >
            <div className="w-[200px] h-[200px] mx-auto mb-6">
              <img
                src={platform.icon}
                alt={platform.name}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-semibold text-base mb-2">{platform.name}</h3>
            <p className="text-muted-foreground text-sm max-w-[260px]">
              {platform.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.p {...fadeUp(0.4)} className="text-muted-foreground text-sm text-center">
        If you don&apos;t answer the questions, someone else will.
      </motion.p>
    </section>
  );
}
