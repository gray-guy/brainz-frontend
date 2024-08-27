import Image from "next/image"
import React from "react"

const SessionCard = ({ game, activeIdx }) => {
  const { title, sessions, image } = game
  let minSliceStart = Math.max(0, sessions.length - 3)
  minSliceStart = Math.min(minSliceStart, activeIdx)

  return (
    <div className="h-auto w-full rounded-[10px] bg-primary-100 px-4 py-4 text-base shadow-sessionCard md:py-7 lg:px-5 lg:py-5">
      <h2 className="captilize font-grey-400 text-center font-basement text-lg font-bold md:text-left">
        {title}
      </h2>
      <div className="relative flex gap-1 md:gap-2">
        <div className="absolute left-0 z-[12] mt-2 max-w-full flex-1 lg:mt-6">
          {sessions
            .slice(minSliceStart, minSliceStart + 3)
            .map((session, index) => (
              <h1
                key={index}
                data-live={index + minSliceStart === activeIdx}
                className="truncate rounded-[8px] border border-[transparent] from-[#DFC80B]/40 to-[#FFED5A]/20 px-4 py-2 font-basement font-bold tracking-[1.5px] data-[live=true]:border-secondary data-[live=true]:bg-gradient-to-r data-[live=true]:text-secondary lg:px-[22px] lg:py-2.5"
                // onClick={() => onSessionClick(index)}
              >
                {session.topic?.title ?? `Session ${index + 1}`}
              </h1>
            ))}
        </div>
        <div className="mt-2 flex min-h-44 flex-1 items-center justify-center lg:mt-6">
          <div className="relative ml-auto h-full w-1/2">
            <Image
              src={image}
              layout="fill"
              objectFit="contain"
              alt="Next Game"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SessionCard
