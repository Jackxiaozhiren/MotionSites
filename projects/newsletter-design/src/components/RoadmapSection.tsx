import SolidButton from './SolidButton'

export default function RoadmapSection() {
  return (
    <>
      <div className="pb-7 px-9">
        <h2
          style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-center text-[46px] leading-[1.05] tracking-tight"
        >
          Build your AI
          <br />
          transformation roadmap
        </h2>
      </div>

      {/* Video card */}
      <div className="px-[42px] pb-10">
        <a href="#" className="block overflow-hidden rounded-[14px] group">
          <video
            className="w-full h-[370px] object-cover rounded-[14px] transition-transform duration-700 group-hover:scale-[1.03]"
            autoPlay
            muted
            loop
            playsInline
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260417_110451_9f82b157-dc92-4a9f-a341-c25594ec20e1.mp4"
              type="video/mp4"
            />
          </video>
        </a>
      </div>

      <div className="px-[78px] pb-8">
        <p className="text-center text-[18px] leading-[1.55]">
          You&rsquo;ll finish this hands-on course with a personal AI Transformation Plan: your playbook for pilot proposals, data strategy and governance. Use it to help secure buy-in, guide rollout, and scale adoption responsibly.
        </p>
      </div>

      <div className="flex justify-center pb-14">
        <SolidButton label="Learn More" />
      </div>
    </>
  )
}
