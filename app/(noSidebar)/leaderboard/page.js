import Image from "next/image"
import { LeaderTable } from "./leader-table"
import { RankCard } from "./rank-card"
import { NextSessionCard } from "./next-session"

export default function Page() {
  return (
    <div>
      <div className="absolute -top-10 left-1/2 aspect-[1440/986] max-h-[900px] w-full min-w-[800px] -translate-x-1/2">
        <Image fill src="/images/leaderboard-bg.svg" alt="Leaderboard" />
      </div>
      <div className="relative mx-auto mb-16 mt-20 max-w-[1100px]">
        <div className="mb-14 grid grid-cols-2 gap-7">
          <RankCard />
          <NextSessionCard />
        </div>
        <LeaderTable />
      </div>
    </div>
  )
}
