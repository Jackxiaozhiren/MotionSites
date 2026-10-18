import { ArrowRight } from 'lucide-react';

interface TextRollButtonProps {
  text: string;
  bgColor?: string;
  hoverBgColor?: string;
  textColor?: string;
  circleBg?: string;
  iconColor?: string;
  circleSize?: string;
  className?: string;
}

export default function TextRollButton({
  text,
  bgColor = 'bg-[#F26522]',
  hoverBgColor = 'hover:bg-[#e05a1a]',
  textColor = 'text-white',
  circleBg = 'bg-white',
  iconColor = 'text-[#F26522]',
  circleSize = 'w-7 h-7 sm:w-8 sm:h-8',
  className = '',
}: TextRollButtonProps) {
  return (
    <button
      className={`group inline-flex items-center gap-2 rounded-full pl-5 sm:pl-6 pr-2 py-2 ${bgColor} ${hoverBgColor} transition-colors duration-300 ${textColor} ${className}`}
    >
      <div className="overflow-hidden h-[20px] leading-[20px]">
        <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
          <span className="text-[13px]/[20px] sm:text-[14px]/[20px] font-medium">{text}</span>
          <span className="text-[13px]/[20px] sm:text-[14px]/[20px] font-medium">{text}</span>
        </div>
      </div>
      <div
        className={`${circleSize} rounded-full ${circleBg} flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45`}
      >
        <ArrowRight className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColor}`} strokeWidth={2} />
      </div>
    </button>
  );
}
