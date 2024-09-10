import React, { useMemo } from "react"
import { useEffect, useState } from "react"

const CountdownTimer = ({
  restTimeRemaining,
  totalRestTimeRemaining,
}) => {
  const [timerCount, setTimerCount] = useState(totalRestTimeRemaining)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerCount((prevCount) => (prevCount > 1 ? prevCount - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const circumference = 2 * Math.PI * 45 // 45 is the radius
  const timerOffset =
    circumference - (restTimeRemaining / totalRestTimeRemaining) * circumference


  return (
    <div className="mt-6 flex min-h-[340px] max-w-[900px] flex-col items-center justify-center rounded-[20px] border border-primary-275 bg-primary-350 py-10 font-basement text-white md:min-h-[390px]">
      <p className="mb-6 mt-0 text-center text-lg font-bold md:mb-10 lg:text-2xl">
        Next Question In...
      </p>
      <div className="relative flex h-[150px] items-center justify-center">
        <svg
          className="absolute"
          width="150px"
          height="150px"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={timerOffset}
            className="transition-stroke text-secondary duration-1000 ease-linear"
          />
        </svg>
        <span className="text-2xl font-bold lg:text-5xl">
          {restTimeRemaining}
        </span>
      </div>
    </div>
  )
}

export default CountdownTimer
