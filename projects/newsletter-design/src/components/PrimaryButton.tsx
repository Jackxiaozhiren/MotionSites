import { ArrowRight } from 'lucide-react'

interface PrimaryButtonProps {
  label: string
}

export default function PrimaryButton({ label }: PrimaryButtonProps) {
  return (
    <button className="inline-flex items-center gap-3 bg-[#DCFF00] text-[#0A0A0A] font-bold rounded-lg px-6 py-3 hover:bg-[#c9ea00] hover:-translate-y-0.5 transition-all duration-200">
      {label}
      <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
    </button>
  )
}
