import React from "react"
import moment from "moment"

const cardClasses = [
  "bg-primary-100 shadow-cryptoCardOne",
  "bg-[#ED64A6] shadow-cryptoCardTwo",
  "bg-[#9F7AEA] shadow-cryptoCardThree",
]

const CryptoCard = ({ idx, data }) => {
  const { title, sessions, startTime } = data
  return (
    <div
      className={`${cardClasses[idx % 3]} w-full rounded-[10px] px-4 py-4 lg:px-5 lg:py-5`}
    >
      <div className="grid grid-cols-4 font-basement">
        <div className="col-span-3 mr-3">
          <p className="line-clamp-2 min-h-14 text-center text-lg font-bold md:text-xl">
            {title}
          </p>
          <ul className="mt-3 list-disc gap-1 space-y-1">
            {sessions.slice(0, 2).map((session, index) => (
              <li
                key={index}
                className="list-disc truncate text-sm font-bold capitalize"
              >
                - {session.topic?.title ?? `Session ${index + 1}`}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 text-center">
          <h1 className="text-lg md:text-xl">
            {moment(startTime).format("MMM")}
          </h1>
          <h1 className="text-3xl font-[900] lg:text-4xl">
            {moment(startTime).format("DD")}
          </h1>
          <h1 className="text-lg md:text-xl">
            {moment(startTime).format("h a")}
          </h1>
        </div>
      </div>
    </div>
  )
}

export default CryptoCard
