import PrimaryButton from './PrimaryButton'
import Divider from './Divider'

export default function IntroSection() {
  return (
    <>
      <div className="px-[78px] pb-8 pt-4">
        <p className="text-center text-[18px] leading-[1.55]">
          Built in collaboration with Microsoft, this certificate course gives you the toolkit to lead AI transformation across your organization. Learn to spot opportunities, launch AI pilots, and scale adoption grounded in responsible practices and proven frameworks.
        </p>
      </div>
      <div className="flex justify-center pb-14">
        <PrimaryButton label="Get Started" />
      </div>
      <Divider />
    </>
  )
}
