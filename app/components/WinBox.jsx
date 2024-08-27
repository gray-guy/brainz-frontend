"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export const WinBox = ({
  imageSrc,
  title,
  description,
  height,
  imageBg = "#2c8293",
  ...rest
}) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [setIsLoading])
  return (
    <div
      className={`w-full rounded-[20px] bg-primary-300 px-3 pb-9 pt-5 text-center ${height} shadow`}
      {...rest}
    >
      {isLoading ? (
        <Skeleton height={230} borderRadius={"1.5rem"} count={1} />
      ) : (
        <div
          className="relative h-[180px] w-full overflow-hidden rounded-[20px] lg:h-[230px]"
          style={{
            background: imageBg,
          }}
        >
          <Image
            src={imageSrc}
            alt="Reward Box"
            layout="fill"
            objectFit="contain"
            draggable={false}
            priority={true}
          />
        </div>
      )}

      <h1 className="mt-4 px-4 font-basement text-base font-bold text-white lg:mt-8 lg:px-10 lg:text-lg">
        {title}
      </h1>
      <p className="px-2 pt-2 text-center font-inter text-base font-normal text-grey-100 lg:px-1 lg:text-lg">
        {description}
      </p>
    </div>
  )
}
