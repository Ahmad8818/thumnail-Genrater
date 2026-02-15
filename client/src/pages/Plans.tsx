import SoftBackdrop from "../components/SoftBackdrop"
import PricingSection from "../sections/PricingSection"

const Plans = () => {
  return (
    <>
    <SoftBackdrop/>
    <div className="w-full h-full   " >
    <PricingSection/>
    </div>
    <div className="w-full text-xs flex flex-col items-center justify-center m-5 mt-30">
      <span>Create stunning images  for just <span className="text-pink-500 font-semibold">5 credits </span>and generate immersive</span>
      <span> videos and Thumbnails for <span className="text-pink-500 font-semibold">10 credits</span>.</span>
       
    </div>
    </>
  )
}

export default Plans