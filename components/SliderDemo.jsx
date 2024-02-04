import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react";
import { updateSlider, getSlider } from "@/actions/actions";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function SliderDemo({ className, ...props }) {
  const router = useRouter();
  const [alignment, setAlignment] = useState(50);
  const [isDefault, setIsDefault] = useState(true);

  async function handleChange(value) {
    await updateSlider(value[0]);
    setAlignment(value);
    router.refresh();
  }
  useEffect(() => {
    async function getSliderValue() {
      const res = await getSlider();
      // console.log('RES IS ', res, typeof res);
      setAlignment(res);
      setIsDefault(false);
    }
    getSliderValue();
  }, []);
  if (isDefault) {
    return <FaSpinner className='animate-spin m-auto' />
  }


  return (
    <div className="flex flex-col w-[40%] mr-8">
      <div className="flex flex-row justify-between">
        <div className="relative text-xs">{100 - alignment}%</div>
        <div className="relative text-xs">{alignment}%</div>
      </div>
      <Slider
        defaultValue={[alignment]}
        max={100}
        step={10}
        className={cn("w-[100%] grow-1", className)}
        {...props}
        onValueChange={(value) => {handleChange(value)}}
      />
      <div className="flex justify-between w-[100%]  text-sm">
        <div>Left</div>
        <div>Right</div>
      </div>
    </div>
  )
}
