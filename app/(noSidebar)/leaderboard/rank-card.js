export const RankCard = () => {
  return (
    <div className="rounded-md border border-primary-275 bg-primary-350 p-10 text-white">
      <div className="flex font-basement">
        <div>
          <p>You Ranked</p>
          <p className="mt-2 font-bold">
            <span className="text-xl text-secondary">25th</span> / <br />
            230 Players
          </p>
        </div>
        <div className="mx-6 h-[95px] w-[2px] bg-primary-275" />
        <div>
          <p>You Scored</p>
          <p className="mt-2 font-bold">
            <span className="text-xl text-secondary">3,000</span> <br />
            Points
          </p>
        </div>
      </div>
      <div className="my-7 h-[2px] w-full bg-primary-275" />
      <div>
        <h3 className="mb-4 font-basement font-bold">Rewards Earned</h3>
        <div className="flex justify-between">
          <Reward
            imgSrc="/images/usdc-logo.png"
            label="USDC"
            subLabel="10,000"
          />
          <Reward
            imgSrc="/images/usdc-logo.png"
            label="USDC"
            subLabel="10,000"
          />
          <Reward
            imgSrc="/images/usdc-logo.png"
            label="USDC"
            subLabel="10,000"
          />
        </div>
      </div>
    </div>
  )
}

const Reward = ({ imgSrc, label, subLabel, className }) => (
  <div className={"flex items-center gap-3"}>
    <img width={36} height={36} src={"/images/usdc-logo.png"} />
    <div>
      <p className="font-bold !leading-none md:text-lg">{label}</p>
      <p className="font-basement text-sm font-medium">{subLabel}</p>
    </div>
  </div>
)
