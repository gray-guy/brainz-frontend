import React from "react"
import { Button } from "./Button"
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
      <p className="font-basement text-base font-bold">{title}</p>
      <div className="flex">
        <div className="mt-4 max-w-[70%] flex-1">
          <div className="flex h-full flex-col overflow-hidden">
            <ul className="flex list-disc flex-col gap-1">
              {sessions.slice(0, 3).map((session, index) => {
                return (
                  <li
                    key={index}
                    className="list-disc truncate font-basement text-sm font-bold capitalize"
                  >
                    - {session.topic?.title ?? `Session ${index + 1}`}
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="mt-5">
            {/* <Button
              variant={"outlined"}
              className={"pt-1 pb-1 px-3.5 text-nowrap "}
              size="text-sm"
            >
              Remind me
            </Button> */}
          </div>
        </div>

        <div className="items-right flex flex-1 flex-col gap-1.5 text-right">
          <h1 className="font-basement text-lg font-bold text-white md:text-xl">
            {moment(startTime).format("MMMM")}
          </h1>
          <h1 className="font-basement text-3xl font-[900] text-white lg:text-4xl">
            {moment(startTime).format("DD")}
          </h1>
          <h1 className="font-basement text-lg font-bold text-white md:text-xl">
            {moment(startTime).format("h a")}
          </h1>
        </div>
      </div>
    </div>
  )
}

export default CryptoCard
