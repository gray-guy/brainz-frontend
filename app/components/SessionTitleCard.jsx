import React from "react"
export default function SessionTitleCard({
  bgColor,
  title,
  description,
  number,
  speed = null,
  noIcon,
  icon: IconComponent = () => <div />,
}) {
  return (
    <div
      className={`h-full w-full ${bgColor} rounded-[6px] px-5 pb-5 pt-5 lg:px-4 lg:pb-9 lg:pt-7`}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <h1 className="font-basement text-lg font-bold capitalize lg:text-2xl">
          {title}
        </h1>
        <h1 className="font-basement text-lg font-bold capitalize lg:text-2xl">
          {speed}
        </h1>
        {noIcon ? null : (
          <div
            className={`flex items-center justify-center gap-2 rounded-[80px] bg-success/20 px-3 py-0.5`}
          >
            <p className="font-inter text-base font-normal lg:text-xl">
              {number}
            </p>
            <IconComponent height={16} width={16} className={"text-success"} />
          </div>
        )}
      </div>
      <p className="pt-4 font-inter text-sm font-normal text-white md:text-base">
        {description}
      </p>
    </div>
  )
}
