import { useRef, useEffect, useState, useMemo } from "react";
import { useScroll } from "framer-motion";

interface WordRevealProps {
  text: string;
  highlights?: string[];
  className?: string;
  highlightClassName?: string;
  motionValue: import("framer-motion").MotionValue<number>;
  wordOffset: number;
}

function WordRevealWords({
  text,
  highlights = [],
  className = "",
  motionValue,
  wordOffset,
}: Omit<WordRevealProps, "highlightClassName"> & { highlightClassName?: never }) {
  const words = useMemo(() => text.split(" "), [text]);
  const [opacities, setOpacities] = useState<number[]>(() =>
    new Array(words.length).fill(0.15)
  );

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest: number) => {
      const newOpacities = words.map((_, i) => {
        const globalIdx = wordOffset + i;
        const wordStart = (globalIdx / 40) * 0.6;
        const wordEnd = Math.min(wordStart + 0.12, 1);
        const p = Math.max(0, Math.min(1, (latest - wordStart) / (wordEnd - wordStart)));
        return 0.15 + p * 0.85;
      });
      setOpacities(newOpacities);
    });
    return unsubscribe;
  }, [motionValue, words, wordOffset]);

  return (
    <span className={className}>
      {words.map((word, i) => {
        const clean = word.replace(/[^a-zA-Z]/g, "");
        const isHighlighted = highlights.includes(clean);
        return (
          <span
            key={`${i}`}
            className="word-reveal"
            style={{
              opacity: opacities[i],
              color: isHighlighted ? "hsl(0 0% 100%)" : undefined,
            }}
          >
            {word}{i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
}

export default function Mission() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const paragraph1 =
    "We're building a space where curiosity meets clarity — where readers find depth, writers find reach, and every newsletter becomes a conversation worth having.";
  const paragraph2 =
    "A platform where content, community, and insight flow together — with less noise, less friction, and more meaning for everyone involved.";

  const words1 = paragraph1.split(" "); // used for wordOffset

  return (
    <section
      ref={containerRef}
      className="pt-0 pb-32 md:pb-44 text-center px-4"
    >
      {/* Video */}
      <div className="flex justify-center mb-20">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-w-[800px] aspect-square object-cover rounded-2xl"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Scroll-driven word reveal */}
      <div className="max-w-5xl mx-auto">
        <p className="text-2xl md:text-4xl lg:text-5xl font-medium tracking-[-1px] leading-tight mb-10">
          <WordRevealWords
            text={paragraph1}
            highlights={["curiosity", "meets", "clarity"]}
            motionValue={scrollYProgress as import("framer-motion").MotionValue<number>}
            wordOffset={0}
          />
        </p>
        <p className="text-xl md:text-2xl lg:text-3xl font-medium leading-snug">
          <WordRevealWords
            text={paragraph2}
            motionValue={scrollYProgress as import("framer-motion").MotionValue<number>}
            wordOffset={words1.length}
          />
        </p>
      </div>
    </section>
  );
}
