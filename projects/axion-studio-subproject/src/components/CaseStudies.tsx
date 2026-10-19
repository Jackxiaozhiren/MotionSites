import { useDecorativeMedia } from '../useDecorativeMedia';
import { ArrowRight } from 'lucide-react';

function LinkIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CaseCard({
  videoSrc,
  bgColor,
  description,
  title,
  buttonText,
  dark,
}: {
  videoSrc: string;
  bgColor: string;
  description: string;
  title: string;
  buttonText: string;
  dark?: boolean;
}) {
  const { showVideo, onVideoError } = useDecorativeMedia();
  return (
    <div>
      <div className={`relative aspect-[329/246] rounded-2xl overflow-hidden ${bgColor} group cursor-pointer`}>
        {showVideo && <video
          src={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        preload="metadata"
        onError={onVideoError}
        />}
        <div className="absolute bottom-4 left-4">
          <div
            className={`flex items-center ${
              dark ? 'bg-gray-900' : 'bg-white'
            } h-9 rounded-full overflow-hidden transition-all duration-300 ease-in-out max-w-9 group-hover:max-w-[200px]`}
          >
            <div className="flex items-center gap-2 pl-0 group-hover:pl-3 transition-all duration-300 ease-in-out shrink-0">
              <span
                className={`text-[13px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 ${
                  dark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {buttonText}
              </span>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                dark ? 'bg-gray-900' : 'bg-white'
              }`}>
                {dark ? (
                  <ArrowRight
                    size={14}
                    className="text-white transition-transform duration-300 ease-in-out group-hover:rotate-0 -rotate-45"
                  />
                ) : (
                  <LinkIcon className="w-[14px] h-[14px] text-gray-900 transition-transform duration-300 ease-in-out group-hover:rotate-0 -rotate-45" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-[13px]/[14px] text-gray-600 mt-4 leading-relaxed">{description}</p>
      <h3 className="text-[14px]/[15px] font-semibold text-gray-900 mt-1">{title}</h3>
    </div>
  );
}

export default function CaseStudies() {
  return (
    <section className="bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28">
      <div className="max-w-[1440px] mx-auto">
        {/* Badge row */}
        <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-[11px]/[12px] font-semibold">2</span>
          </div>
          <span className="text-[12px]/[13px] font-medium border border-gray-300 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
            Featured client work
          </span>
        </div>

        {/* Heading */}
        <div className="px-5 sm:px-8 lg:px-12">
          <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 mb-10 sm:mb-14 lg:mb-16">
            Our projects
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7 px-5 sm:px-8 lg:px-12">
          {/* Card 1 - Narrativ */}
          <CaseCard
            videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4"
            bgColor="bg-[#1a1d2e]"
            description="Winner of Site of the Month 2025 — an interactive 3D showcase driving record engagement"
            title="Narrativ"
            buttonText="Learn more"
          />

          {/* Card 2 - Luminar */}
          <CaseCard
            videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4"
            bgColor="bg-[#6b6b6b]"
            description="Transforming a dated platform into a conversion-focused brand experience"
            title="Luminar"
            buttonText="View case study"
            dark
          />
        </div>
      </div>
    </section>
  );
}
