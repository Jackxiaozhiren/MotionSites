import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      <HeroSection />
    </div>
  )
}
