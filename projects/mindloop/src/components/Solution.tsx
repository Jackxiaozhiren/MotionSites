import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const features = [
  {
    title: "Curated Feed",
    description:
      "Hand-picked newsletters that match your interests, delivered straight to your inbox without the noise.",
  },
  {
    title: "Writer Tools",
    description:
      "Powerful analytics, audience insights, and monetization tools to help writers grow and thrive.",
  },
  {
    title: "Community",
    description:
      "Connect with like-minded readers and writers who share your passion for depth and quality.",
  },
  {
    title: "Distribution",
    description:
      "Reach the right audience with smart recommendations and cross-promotion opportunities.",
  },
];

export default function Solution() {
  return (
    <section className="py-32 md:py-44 border-t border-border/30 text-center px-4">
      <motion.span
        {...fadeUp(0)}
        className="text-xs tracking-[3px] uppercase text-muted-foreground block mb-4"
      >
        SOLUTION
      </motion.span>

      <motion.h2
        {...fadeUp(0.05)}
        className="text-4xl md:text-6xl font-medium tracking-[-1px] mb-12"
      >
        The platform for{" "}
        <span className="font-serif italic font-normal">meaningful</span> content
      </motion.h2>

      {/* Video */}
      <motion.div {...fadeUp(0.1)} className="max-w-5xl mx-auto mb-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full aspect-[3/1] object-cover rounded-2xl"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4"
            type="video/mp4"
          />
        </video>
      </motion.div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto text-left">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            {...fadeUp(0.15 + i * 0.08)}
          >
            <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
