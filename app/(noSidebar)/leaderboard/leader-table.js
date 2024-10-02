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
    <div>
      <h1 className="mb-10 text-center font-basement text-3xl font-bold text-secondary">
        SESSION RANKINGS
      </h1>
      {data.map((item, index) => (
        <div
          key={item.rank}
          className={cn(
            "px-3 [&:not(:last-child)>div]:border-b",
            item.rank <= 3 && "bg-primary-350"
          )}
        >
          <LeaderTableRow {...item} />
        </div>
      ))}
    </div>
  )
}

let rankSuffix = { 1: "st", 2: "nd", 3: "rd" }
const LeaderTableRow = ({ rank, username, level, reward, xpPoints }) => {
  const highlight = false

  return (
    <div
      className={cn(
        "grid grid-cols-leaderboard items-center gap-4 border-[#303241] py-4 font-medium text-white",
        highlight && "bg-[#9E9126] text-[#000]"
      )}
    >
      <div className="justify-self-end text-secondary">
        {rank <= 3 && <WinnerIcon width="28" height="25" />}
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
