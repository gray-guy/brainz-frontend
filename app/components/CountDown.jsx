import React, { useEffect, useState } from "react"
import SessionTitleCard from "./SessionTitleCard"
import { DiamondIcon } from "./Svgs"
import { Counter } from "./Counter"
import { calculateTimeLeft, formatBalance } from "@/lib/utils"
import { Button } from "./Button"

export const CountDown = ({
  session,
  timeRemaining,
  onReconnect,
  showReconnect,
}) => {
  return (
    <div className="flex w-full flex-col sm:flex-col md:flex-row lg:flex-row">
      <div className="w-full px-0 lg:w-2/3 lg:px-12">
        <div className="relative flex h-full flex-col items-center justify-center text-white">
          <div className="text-center">
            <p className="mb-[20px] font-basement text-base font-normal uppercase lg:text-lg">
              starting in
            </p>
            <div>
              <Counter
                timeRemaining={timeRemaining || null}
                isTickingEnabled={true}
              />
            </div>
            <div className="mt-3 flex flex-col items-center justify-between lg:mt-9">
              <p className="mb-3 font-basement text-lg font-normal lg:text-xl">
                Pot
              </p>
              <p className="font-basement text-2xl font-bold lg:text-3xl">
                {formatBalance(session.netPotValue || 0)} USDT
              </p>
            </div>
          </div>
          {showReconnect && (
            <Button
              onClick={onReconnect}
              className="mx-auto mt-5 lg:absolute lg:bottom-10"
            >
              Reconnect
            </Button>
          )}
        </div>
      </div>
      {/* second grid */}
      <div className="mt-6 flex flex-col items-center text-white lg:mt-0">
        <div className="w-full">
          <h2 className="mb-5 font-basement text-xl font-bold capitalize text-white lg:mb-7 lg:text-2xl">
            Rules
          </h2>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="mb-4 w-full lg:mb-0 lg:w-1/2">
              <SessionTitleCard
                title="Speed Matters"
                speed=""
                description="Answer quickly. In case of 2 or more players reaching the highest score, the player with the quickest completion time wins."
                bgColor="bg-gradient-to-r from-[#283b49] to-[#0f2433]"
                noIcon
              />
            </div>
            <div className="flex-1">
              <SessionTitleCard
                title="Free Spin The Wheel"
                speed=""
                description="At the end of each session, every player will get a free spin of the wheel, offering a chance to win more prizes!"
                bgColor="bg-gradient-to-r from-[#283b49] to-[#0f2433]"
                noIcon
              />
            </div>
          </div>
        </div>
        <div className="mt-4 w-full lg:mt-9">
          <p className="mb-5 font-basement text-xl font-semibold text-white lg:flex lg:items-end lg:text-2xl">
            You can only use 1 of these in a Session
          </p>
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="mb-4 flex-1 lg:mb-0">
              <SessionTitleCard
                title="50/50"
                number="1"
                icon={DiamondIcon}
                description="Use a 50/50 to remove 2 wrong answers from the board."
                bgColor="bg-gradient-to-r from-[#06262c] to-[#05212a]"
              />
            </div>
            <div className="flex-1">
              <SessionTitleCard
                title="Auto correct"
                number="2"
                icon={DiamondIcon}
                description="The Auto-correct is your free pass to skip a question but still get the points"
                bgColor="bg-gradient-to-r from-[#06262c] to-[#05212a]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
