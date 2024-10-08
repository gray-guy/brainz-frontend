import { DiamondIcon } from "./Svgs"

export const SessionButton = ({
  title = "50/50",
  count = 5,
  mainStyles = "bg-gradient-to-r from-[#2e414e] to-[#132836]",
  badgeBg = "bg-success/30",
  titleStyles = "text-2xl",
  countSize = "text-2xl",
  diamondSize = { width: "22", height: "22" },
  svgFill = "#58FF69",
  hover,
  ...props
}) => {
  return (
    <div
      className={`h-full rounded-[10px] transition duration-200 ease-in-out ${mainStyles} border border-[#051c2b] px-2 pb-[12px] pt-2 lg:px-4 ${
        hover ? "hover:border-white" : ""
      }`}
      {...props}
    >
      <div>
        <h1 className={`font-basement font-bold ${titleStyles} text-white`}>
          {title}
        </h1>
      </div>
      <div
        className={`mt-[6px] flex items-center justify-center gap-4 rounded-full py-1.5 ${badgeBg} max-w-[80px] md:max-w-[100px]`}
      >
        <h1 className={`font-basement font-normal ${countSize} text-white`}>
          {count}
        </h1>
        <DiamondIcon
          width={diamondSize.width}
          height={diamondSize.height}
          fill={svgFill}
        />
      </div>
    </div>
  )
}
