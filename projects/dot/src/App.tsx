import { useState, useEffect } from "react";
import { motion } from "motion/react";

function TypingMessages() {
  const messages = ["Are you here?", "Yes, I am.", "Speak soon."];
  const [text, setText] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentMessage = messages[messageIndex];

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && text === currentMessage) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timer);
    }

    if (isDeleting && text === "") {
      setIsDeleting(false);
      setMessageIndex((prev) => (prev + 1) % messages.length);
      return;
    }

    const speed = isDeleting ? 50 : 100;

    timer = setTimeout(() => {
      if (isDeleting) {
        setText(text.slice(0, -1));
      } else {
        setText(currentMessage.slice(0, text.length + 1));
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, messageIndex, currentMessage, messages.length]);

  return (
    <div className="absolute left-[48.5%] md:left-[47.5%] lg:left-[48.5%] -translate-x-1/2 bottom-[32%] z-30 w-[110px] sm:w-[130px] flex justify-start text-left">
      <span
        className="font-nokia text-[#2A3616] text-[10px] sm:text-[14px] leading-tight break-words min-h-[1.5em]"
        style={{ fontFamily: '"Nokia Cellphone FC Small", monospace' }}
      >
        {text}
        <motion.span
          className="w-[5px] h-[12px] bg-[#2A3616] ml-[3px] align-middle inline-block"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </span>
    </div>
  );
}

function Navbar() {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 pointer-events-none">
      <nav className="pointer-events-auto backdrop-blur-md rounded-full bg-white/70 border border-black/10 flex items-center justify-between px-6 py-2">
        <span className="font-instrument text-[28px] tracking-tight text-[#1a1a1a]">
          dot.
        </span>
        <div className="hidden md:flex items-center gap-10">
          {["Philosophy", "Trust", "Access", "Tribe"].map((link) => (
            <a
              key={link}
              href="#"
              className="font-sans text-[14px] text-[#1a1a1a] hover:opacity-50 transition-opacity no-underline"
            >
              {link}
            </a>
          ))}
        </div>
        <button className="relative group bg-[#0871E7] rounded-full text-white font-sans text-[14px] px-5 py-2 shadow-[inset_0_-4px_4px_rgba(255,255,255,0.39)] outline-1 outline-[#0871E7] -outline-offset-1 cursor-pointer overflow-hidden">
          <div className="absolute w-[80%] h-4 left-[10%] top-[1px] bg-gradient-to-b from-[#DEF0FC] to-transparent rounded-[12px] transition-transform duration-300 group-hover:scale-x-105" />
          Link up
        </button>
      </nav>
    </div>
  );
}

function Hero() {
  return (
    <section className="min-h-screen bg-[#F3F4ED] pt-24 md:pt-32 flex flex-col items-center relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          aria-hidden="true"
          preload="none"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260427_054418_a6d194f0-ac86-4df9-abe5-ded73e596d7c.mp4"
            type="video/mp4"
            media="(prefers-reduced-motion: no-preference)"
          />
        </video>
        <div className="absolute inset-0 bg-white/5" />
      </div>

      {/* Typing Messages overlay on phone */}
      <TypingMessages />

      {/* Hero Text */}
      <div className="relative z-20 pointer-events-none text-center px-4 mt-8 md:mt-16">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-instrument text-[38px] md:text-[56px] lg:text-[72px] leading-[0.85] tracking-tight text-[#1a1a1a] mb-6"
        >
          Short notes. <br /> Daily calm.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-[16px] md:text-[18px] text-[#1a1a1a]/70 leading-relaxed font-normal max-w-xl mx-auto"
        >
          Linked with a single anonymous peer. One message every day. A quiet
          rhythm in the digital noise.
        </motion.p>
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
}

export default App;
