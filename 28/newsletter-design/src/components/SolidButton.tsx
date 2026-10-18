interface SolidButtonProps {
  label: string
}

export default function SolidButton({ label }: SolidButtonProps) {
  return (
    <button className="inline-block bg-white text-[#0A0A0A] font-bold rounded-lg px-8 py-3 hover:bg-[#E8E8E8] hover:-translate-y-0.5 transition-all duration-200">
      {label}
    </button>
  )
}
