import TextRollButton from './TextRollButton';

export default function AboutSection() {
  return (
    <section className="bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        {/* Badge row */}
        <div className="px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 flex items-center justify-center">
            <span className="text-white text-[11px]/[12px] font-semibold">1</span>
          </div>
          <span className="text-[12px]/[13px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-900">
            Introducing Axion
          </span>
        </div>

        {/* Heading */}
        <div className="px-5 sm:px-8 lg:px-12">
          <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 mb-12 sm:mb-16 lg:mb-28">
            Strategy-led creatives, delivering{' '}
            <br className="hidden sm:block" />
            <span className="sm:hidden">&nbsp;</span>
            results in digital and beyond.
          </h2>
        </div>

        {/* Content - Mobile/Tablet (lg:hidden) */}
        <div className="lg:hidden px-5 sm:px-8 lg:px-12">
          <p className="text-[15px]/[17px] leading-[1.6] font-medium text-gray-900 mb-6">
            Through research, creative thinking and iteration we help growing brands realize their digital full potential.
          </p>
          <div className="mb-8">
            <TextRollButton
              text="About our studio"
              bgColor="bg-[#F26522]"
              hoverBgColor="hover:bg-[#e05a1a]"
              circleBg="bg-white"
              iconColor="text-[#F26522]"
              circleSize="w-7 h-7"
              className="pl-5 pr-2 py-2"
            />
          </div>
        </div>

        {/* Images - Mobile/Tablet */}
        <div className="lg:hidden flex flex-col sm:flex-row gap-4 sm:gap-5 px-5 sm:px-8 lg:px-12">
          <div className="sm:w-[45%]">
            <img
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
              alt="Axion studio work"
              className="w-full aspect-[438/346] object-cover rounded-xl sm:rounded-2xl"
            />
          </div>
          <div className="sm:w-[55%]">
            <img
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
              alt="Axion studio team"
              className="w-full aspect-[900/600] object-cover rounded-xl sm:rounded-2xl"
            />
          </div>
        </div>

        {/* Content - Desktop (hidden lg:grid) */}
        <div className="hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8 px-5 sm:px-8 lg:px-12">
          {/* Left - Small image */}
          <div className="self-end">
            <img
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85"
              alt="Axion studio work"
              className="w-full aspect-[438/346] object-cover rounded-2xl"
            />
          </div>
          {/* Center - Paragraph + Button */}
          <div className="self-start flex justify-end">
            <div>
              <p className="text-[16px]/[18px] leading-[1.65] font-medium text-gray-900 whitespace-nowrap mb-5">
                Through research, creative thinking<br />
                and iteration we help growing brands<br />
                realize their digital full potential.
              </p>
              <TextRollButton
                text="About our studio"
                bgColor="bg-[#F26522]"
                hoverBgColor="hover:bg-[#e05a1a]"
                circleBg="bg-white"
                iconColor="text-[#F26522]"
                circleSize="w-7 h-7"
                className="pl-5 pr-2 py-2"
              />
            </div>
          </div>
          {/* Right - Large image */}
          <div className="self-end">
            <img
              src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85"
              alt="Axion studio team"
              className="w-full aspect-[3/2] object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
