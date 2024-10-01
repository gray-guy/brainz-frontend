"use client"

import { WinnerIcon } from "@/app/components/Svgs"
import { cn } from "@/lib/utils"

const data = [
  {
    rank: 1,
    username: "Username",
    level: "Level",
    reward: "Reward",
    xpPoints: 203,
  },
  {
    rank: 2,
    username: "Username",
    level: "Level",
    reward: "Reward",
    xpPoints: 203,
  },
  {
    rank: 3,
    username: "Username",
    level: "Level",
    reward: "Reward",
    xpPoints: 203,
  },
  {
    rank: 4,
    username: "Username",
    level: "Level",
    reward: "Reward",
    xpPoints: 203,
  },
  {
    rank: 5,
    username: "Username",
    level: "Level",
    reward: "Reward",
    xpPoints: 203,
  },
]

export const LeaderTable = () => {
  return (
    <div className="px-3">
      {data.map((item) => (
        <LeaderTableRow key={item.rank} {...item} />
      ))}
    </div>
  )
}

let rankSuffix = { 1: "st", 2: "nd", 3: "rd" }
const LeaderTableRow = ({ rank, username, level, reward, xpPoints }) => {
  const isTop3 = rank <= 3
  const highlight = true

  return (
    <div
      className={cn(
        "grid-cols-leaderboard grid items-center gap-4 border-[#303241] py-4 font-medium text-white [&:not(:last-child)]:border-b",
        isTop3 && "bg-primary-350",
        highlight && "bg-[#9E9126] text-[#000]"
      )}
    >
      <div className="justify-self-center text-secondary">
        {isTop3 && <WinnerIcon width="28" height="25" />}
      </div>
      <p className="text-center font-basement text-lg font-medium">
        {rank + (rankSuffix[rank] ?? "nd")}
      </p>

      <div className={"flex items-center gap-3"}>
        <img width={36} height={36} src={"/images/usdc-logo.png"} />
        <div>
          <p className="md:text-lg">PlayerUsername</p>
          <p className="font-basement text-sm text-secondary">Level 2</p>
        </div>
      </div>

      <div className={"flex items-center gap-3"}>
        <img width={36} height={36} src={"/images/usdc-logo.png"} />
        <div>
          <p className="font-bold md:text-lg">204</p>
          <p className="text-sm">USD</p>
        </div>
      </div>

      <div className={"flex items-center gap-3"}>
        <img width={36} height={36} src={"/images/usdc-logo.png"} />
        <div>
          <p className="font-bold md:text-lg">204</p>
          <p className="text-sm">XP</p>
        </div>
      </div>
    </div>
  )
}
