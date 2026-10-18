import { ArrowRight } from 'lucide-react'

export default function CtaCardSection() {
  return (
    <div className="px-14 pb-12">
      <div className="bg-[#D8F90A] rounded-[10px] px-8 py-12 text-center">
        <h2
          style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-[#1E1E1E] text-[52px] leading-[1.02] tracking-tight mb-3"
        >
          Ready to lead AI
          <br />
          at work?
        </h2>
        <p className="text-[#1E1E1E] text-[18px] leading-[1.5] mb-8 px-4">
          Enroll now and be the leader your team has been waiting for.
        </p>
        <button className="inline-flex items-center gap-3 bg-[#0A0A0A] text-white font-bold rounded-lg px-6 py-3 hover:bg-[#1E1E1E] hover:-translate-y-0.5 transition-all duration-200">
          Enroll Now
          <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
