import Image from "next/image";
import React from "react";

const SessionCard = ({ game, activeIdx }) => {
  const { title, sessions, image } = game;
  let minSliceStart = Math.max(0, sessions.length - 3);
  minSliceStart = Math.min(minSliceStart, activeIdx);

  return (
    <div className="bg-primary-100 h-auto rounded-[10px] w-full text-base py-4 px-4 lg:py-5 lg:px-5 shadow-sessionCard md:py-7">
      <h2 className="captilize font-basement text-lg font-bold font-grey-400 text-center md:text-left">
        {title}
      </h2>
      <div className="flex gap-1 md:gap-2 relative">
        <div className="flex-1 mt-2 lg:mt-6 absolute left-0 max-w-full z-[12]">
          {sessions
            .slice(minSliceStart, minSliceStart + 3)
            .map((session, index) => (
              <h1
                key={index}
                data-live={index + minSliceStart === activeIdx}
                className="truncate font-basement font-bold tracking-[1.5px] px-4 lg:px-[22px] rounded-[8px] data-[live=true]:text-secondary data-[live=true]:bg-gradient-to-r from-[#DFC80B]/40 to-[#FFED5A]/20 border border-[transparent] data-[live=true]:border-secondary py-2 lg:py-2.5"
                // onClick={() => onSessionClick(index)}
              >
                {session.topic?.title ?? `Session ${index + 1}`}
              </h1>
            ))}
        </div>
        <div className="flex-1 flex items-center justify-center mt-2 lg:mt-6 min-h-44">
          <div className="relative w-1/2 h-full ml-auto">
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
  );
};

export default SessionCard;
