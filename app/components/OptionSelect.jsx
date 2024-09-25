import { cn } from "@/lib/utils"
import React from "react"

export const OptionSelect = ({
  alphabet = "A",
  description = "Lorem ipsum dolor sit amet, consectur.",
  variant = "default",
  answer = false,
  isActive = false,
  classes = {},
  ...rest
}) => {
  let backgroundColor, borderColor
  switch (variant) {
    case "success":
      backgroundColor = answer ? "bg-[#207E35] text-white" : "bg-[#8D4343]"
      borderColor = answer ? "border-[#0D3616]" : "border-[#532C2C]"
      break
    case "danger":
      backgroundColor = "bg-[#8D4343] !text-white"
      borderColor = answer ? "border-[#0D3616]" : "border-[#532C2C]"
      break
    default:
      backgroundColor = isActive ? "bg-secondary text-[#000]" : "bg-primary-350"
      borderColor = "border-primary-375"
      break
  }

  return (
    <div
      {...rest}
      className={cn(
        "flex items-center gap-3 font-basement lg:gap-5",
        backgroundColor,
        borderColor,
        isActive && "hover:bg-[#0A3049]",
        "border-1 w-full rounded-[20px] border px-4 py-2 hover:border-[#C2CBD1] lg:px-5",
        classes.root
      )}
    >
      <div className="flex items-center justify-center rounded-[8px] border border-primary-375 bg-primary px-3 py-1.5 lg:px-5 lg:py-2.5">
        <h1 className="text-sm font-normal text-white lg:text-lg">
          {alphabet}
        </h1>
      </div>
      <p
        className={`text-sm font-normal md:text-lg ${isActive ? "text-[#000]" : "text-white"}`}
      >
        {description}
      </p>
    </div>
  )
}
