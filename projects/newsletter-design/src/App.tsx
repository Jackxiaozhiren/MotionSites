import Hero from './components/Hero'
import IntroSection from './components/IntroSection'
import TransformSection from './components/TransformSection'
import RoadmapSection from './components/RoadmapSection'
import CtaCardSection from './components/CtaCardSection'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] py-10 px-4 font-sans">
      <div className="max-w-[640px] mx-auto shadow-2xl overflow-hidden ring-1 ring-white/5">
        <div className="bg-[#111111] text-[#F2F2F2]">
          <Hero />
          <IntroSection />
          <TransformSection />
          <RoadmapSection />
          <CtaCardSection />
          <Footer />
        </div>
      </div>
    </div>
  )
}
