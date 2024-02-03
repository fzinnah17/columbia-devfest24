import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react";


export default function SliderDemo({ className, ...props }) {
  const [alignment, setAlignment] = useState(50);
  function handleChange(value) {
    setAlignment(value);
  }
  useEffect(() => {
    console.log(alignment);
  }, [alignment]);
  return (
    <div className="flex flex-col w-[40%] mr-8">
      <div className="flex flex-row justify-between">
        <div className="relative text-xs">{100 - alignment}%</div>
        <div className="relative text-xs">{alignment}%</div>
      </div>
      <Slider
        defaultValue={[50]}
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
