import { LeaderTable } from "./leader-table"
import { RankCard } from "./rank-card"

export default function Page() {
  return (
    <div>
      <div className="mx-auto mt-20 mb-16 max-w-[1100px]">
        <div className="mb-14 grid grid-cols-2 gap-7">
          <RankCard />
          <RankCard />
        </div>
        <h1 className="mb-10 text-center font-basement text-3xl font-bold text-secondary">
          SESSION RANKINGS
        </h1>
        <LeaderTable />
      </div>
    </div>
  )
}
