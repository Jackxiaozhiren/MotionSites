import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="relative min-h-svh w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          type="video/mp4"
        />
      </video>

      {/* Navigation */}
      <nav className="relative z-10 flex max-w-7xl flex-row items-center justify-between px-8 py-6 mx-auto">
        <div
          className="text-3xl tracking-tight text-foreground"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Velorah<sup className="text-xs">®</sup>
        </div>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <a href="#" className="text-sm text-foreground transition-colors">
              Home
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Studio
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Journal
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Reach Us
            </a>
          </li>
        </ul>

        <Button className="rounded-full px-6 py-2.5 text-sm text-foreground max-md:hidden">
          Begin Journey
        </Button>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center px-6 pt-32 pb-40 text-center">
        <h1
          className="animate-fade-rise max-w-7xl text-5xl leading-[0.95] tracking-[-2.46px] font-normal sm:text-7xl md:text-8xl"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Where{" "}
          <em className="not-italic text-muted-foreground">dreams</em> rise
          through{" "}
          <em className="not-italic text-muted-foreground">
            the silence.
          </em>
        </h1>

        <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          We&rsquo;re designing tools for deep thinkers, bold creators, and
          quiet rebels. Amid the chaos, we build digital spaces for sharp focus
          and inspired work.
        </p>

        <Button className="animate-fade-rise-delay-2 mt-12 rounded-full px-14 py-5 text-base text-foreground">
          Begin Journey
        </Button>
      </section>
    </div>
  );
}

export default App;
