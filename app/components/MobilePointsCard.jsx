import Image from "next/image"
import React from "react"

export const MobilePointsCard = ({ data }) => {
  const { rank, totalPoints, username } = data
  return (
    <div className="flex w-full items-center gap-3 rounded-[4px] bg-gradient-to-r from-white/20 to-[#C6C6C6]/10 px-2.5 py-1.5">
      {/* <div className="relative border rounded-full min-w-6 min-h-6 border-secondary">
        <Image
          src={profileImage}
          alt="profile"
          layout="fill"
          className="rounded-full"
          draggable={false}
          priority={true}
        />
      </div> */}
      <div>
        <h1 className="flex gap-3 font-basement font-bold text-secondary">
          <span> R{rank}:</span>
          {totalPoints}
        </h1>
        <h1 className="font-basement font-normal text-white">{username}</h1>
      </div>
    </div>
  )
}
