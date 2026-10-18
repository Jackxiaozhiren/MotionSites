import Step from './Step'
import SolidButton from './SolidButton'
import Divider from './Divider'

export default function TransformSection() {
  return (
    <>
      <div className="px-9 pb-8">
        <h2
          style={{ fontFamily: "'Instrument Serif', serif" }}
          className="text-center text-[46px] leading-[1.05] tracking-tight"
        >
          Transform how you lead with AI
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
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260419_065931_e3ca7b53-d32e-4ad5-81de-dc9d6fcfda6d.mp4"
              type="video/mp4"
            />
          </video>
        </a>
      </div>

      {/* Steps list */}
      <div className="px-[76px] pb-10">
        <div className="max-w-[489px] mx-auto">
          <Step
            number={1}
            text="Learn how to spot AI opportunities that boost productivity across roles and deliver visible results."
          />
          <Step
            number={2}
            text="Build structures that support your team so AI efficiencies multiply across the organization."
          />
          <Step
            number={3}
            text="Gain the skills to drive culture change like securing buy-in and reducing resistance."
          />
          <Step
            number={4}
            text="Get frameworks to deliver AI pilots that prove impact fast and build credibility with measurable results."
          />
        </div>
      </div>

      <div className="flex justify-center pb-14">
        <SolidButton label="Enroll Now" />
      </div>
      <Divider />
    </>
  )
}
