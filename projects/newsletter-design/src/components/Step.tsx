import { ArrowRight } from 'lucide-react'

interface StepProps {
  number: number
  text: string
}

export default function Step({ number, text }: StepProps) {
  return (
    <div className="flex items-start gap-5 mb-6 last:mb-0">
      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-[#DCFF00] flex items-center justify-center text-[#0A0A0A] font-bold text-xs mt-1">
        {number}
      </div>
      <p className="text-[17px] leading-[1.55] text-[#E8E8E8]">{text}</p>
    </div>
  )
}
