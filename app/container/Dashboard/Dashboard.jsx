"use client"
import { Button } from "@/app/components/Button"
import CryptoCard from "@/app/components/CryptoCard"
import SessionCard from "@/app/components/SessionCard"
import { TicketIcon } from "@/app/components/Svgs"
import { Tab } from "@headlessui/react"
import CountdownTimer from "@/app/components/CountDownTimer"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn, formatBalance } from "@/lib/utils"
import { toast } from "react-toastify"
import { useUser } from "@/app/contexts/UserContext"

export const Dashboard = ({
  games,
  nextGame,
  session,
  sessionIdx,
  wheelRewards,
}) => {
  const router = useRouter()
  const { user } = useUser()

  // re-fetch on session enj
  useEffect(() => {
    if (!session) return
    const currentTime = new Date()
    const startInterval = new Date(session.startTime) - currentTime + 500
    const endInterval = new Date(session.endTime) - currentTime + 500

    // update on session start, causes re-render
    // const startTimeId = setTimeout(() => {
    //   setNextGame((prev) => ({ ...prev }))
    // }, startInterval)

    // update on session end to next session or next game
    // const endTimeId = setTimeout(() => {
    //   getGames()
    // }, endInterval)

    return () => {
      // clearTimeout(startTimeId)
      // clearTimeout(endTimeId)
    }
  }, [session])

  const handleJoinSession = async (id) => {
    if (!user) {
      toast.error("Please connect your wallet first.")
      return
    }
    if (!session) return
    if (user.tickets < session.ticketsRequired) {
      toast.error("You don't have enough tickets. Buy tickets in the shop.")
      return
    }
    if (new Date() > new Date(session.startTime)) {
      toast.error("Can't join a live session!")
      return
    }

    router.push(`/session/${id}`)
  }

  return (
    <div className="bg-primary text-white">
      {nextGame && session ? (
        <div className="hidden w-full rounded-[10px] bg-primary-350 pb-5 lg:block">
          <div className="flex flex-wrap items-center justify-between gap-14 px-8 pt-4">
            <h1 className="flex-1 font-basement text-xl font-bold">
              Live Games
            </h1>
            <h1 className="flex-1 pl-1 font-basement text-2xl font-bold">
              Starting in
              <CountdownTimer time={session.startTime} />
            </h1>
          </div>
          <div className="mt-8 flex flex-col gap-16 px-14 lg:flex lg:flex-row lg:flex-wrap">
            <div className="mb-6 flex-1">
              <SessionCard game={nextGame} activeIdx={sessionIdx} />
            </div>
            <div className="mt-3 flex flex-1 flex-col lg:mt-0">
              <p className="pl-1 font-basement text-lg font-normal">
                {sessionIdx + 1} of {nextGame.sessions.length} Session
              </p>
              <div className="mb-6 flex flex-col xl:flex-row xl:justify-between">
                <div className="flex flex-col xl:items-center">
                  <p className="pt-9 font-basement text-xl font-normal">
                    Winner Pot Size
                  </p>
                  <p className="mt-1 text-sm">per session</p>
                  <h1 className="mt-1 font-basement text-2xl font-bold xl:mt-3">
                    {formatBalance(session?.netPotValue || 0)} USDT
                  </h1>
                </div>

                {!!wheelRewards && (
                  <div className="mt-10 hidden h-[90px] w-[2px] bg-secondary xl:block" />
                )}
                {!!wheelRewards && (
                  <div className="mt-2 flex flex-col xl:items-center xl:pt-9">
                    <p className="font-basement text-xl font-normal">
                      Spin the Wheel rewards
                    </p>
                    <p className="mt-1 text-sm">per session</p>
                    <h1 className="mt-1 font-basement text-2xl font-bold xl:mt-3">
                      {wheelRewards} USDT
                    </h1>
                  </div>
                )}
              </div>
              <div>
                <Button
                  className="group gap-[10px] border-2 py-2 hover:!bg-primary-350 hover:text-white"
                  disabled={!session || session.status !== "upcoming"}
                  onClick={() => handleJoinSession(session?.id)}
                >
                  <span className="text-xl font-bold">Join Session</span>
                  <TicketIcon
                    height={14}
                    width={14}
                    className={
                      "group-hover:text-danger-100 [&>path]:fill-danger-100 group-hover:[&>path]:fill-none"
                    }
                  />
                  <span className="text-sm font-medium">
                    {session.ticketsRequired} Ticket(s) Required
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden rounded-[10px] bg-primary-350 pb-4 lg:block">
          <div className="mb-5 w-full rounded-[10px]">
            <h1 className="pl-8 pt-4 font-basement text-xl font-bold">
              Live Games
            </h1>
            <div className="mt-20 flex flex-col items-center justify-center">
              <h1 className="font-basement text-xl font-bold">No live games</h1>
            </div>
          </div>
        </div>
      )}
      <div className="hidden rounded-[10px] bg-primary-350 pb-4 lg:block">
        <div className="mb-5 mt-4 w-full rounded-[10px]">
          <h1 className="pl-8 pt-4 font-basement text-xl font-bold">
            Upcoming Games
          </h1>
          {games.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-14 px-14 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {games.map((game, index) => (
                <CryptoCard key={index} idx={index} data={game} />
              ))}
            </div>
          ) : (
            <div className="mt-20 flex flex-col items-center justify-center">
              <h1 className="font-basement text-xl font-bold">
                No upcoming games
              </h1>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Screen Tabs */}
      <div className="pt-1 lg:hidden">
        <Tab.Group>
          <Tab.List className="flex w-full justify-center px-5">
            <Tab className={"w-full focus:outline-none"}>
              {({ selected }) => (
                <h1
                  className={cn(
                    "pb-2.5 pt-4 font-basement text-base font-bold focus:outline-none",
                    selected
                      ? "border-b-2 border-secondary focus:outline-none"
                      : "border-b-2 border-grey-500 text-grey-500"
                  )}
                >
                  Live Games
                </h1>
              )}
            </Tab>
            <Tab className={"w-full focus:outline-none"}>
              {({ selected }) => (
                <h1
                  className={cn(
                    "w-full pb-2.5 pt-4 font-basement text-base font-bold focus:outline-none",
                    selected
                      ? "border-b-2 border-secondary focus:outline-none"
                      : "border-b-2 border-grey-500 text-grey-500"
                  )}
                >
                  Upcoming Games
                </h1>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className={"pb-0"}>
            <Tab.Panel>
              {nextGame && session ? (
                <div className="mt-6 flex flex-col gap-4 px-5 text-center">
                  <div className="text-center">
                    <h1 className="pl-0 font-basement text-xl font-bold md:pl-8">
                      Starting in
                      <CountdownTimer time={nextGame.startTime} />
                    </h1>
                  </div>
                  <div className="flex-1 pr-6">
                    <SessionCard game={nextGame} activeIdx={sessionIdx} />
                  </div>
                  <div className="mt-8 flex flex-1 flex-col lg:mt-0">
                    <p className="pl-[5px] font-basement text-lg font-normal lg:text-xl">
                      {sessionIdx + 1} of {nextGame.sessions.length} Session
                    </p>

                    <div className="my-6 flex justify-center">
                      <div className="basis-full pt-2">
                        <p className="grow font-basement text-lg font-normal">
                          Winner Pot
                        </p>
                        <p className="mt-1 text-sm">per session</p>
                        <h1 className="mb-2 mt-3 font-basement text-xl font-bold">
                          {session?.netPotValue} USDT
                        </h1>
                      </div>

                      {!!wheelRewards && (
                        <div className="basis-full border-l pl-3 pt-2">
                          <p className="grow basis-full font-basement text-lg font-normal">
                            Spin the Wheel
                          </p>
                          <p className="mt-1 text-sm">per session</p>
                          <h1 className="mb-2 mt-3 font-basement text-xl font-bold">
                            {wheelRewards} USDT
                          </h1>
                        </div>
                      )}
                    </div>

                    <div className="mb-4 mt-2">
                      <Button
                        className="group gap-2 border-2 px-5 py-2 hover:!bg-primary-350 hover:text-white"
                        disabled={!session || session.status !== "upcoming"}
                        onClick={() => handleJoinSession(session?.id)}
                      >
                        <span className="text-xl font-bold">Join Session</span>
                        <TicketIcon
                          height={14}
                          width={14}
                          className={
                            "group-hover:text-danger-100 [&>path]:fill-danger-100 group-hover:[&>path]:fill-none"
                          }
                        />
                        <span className="text-sm font-medium">
                          {session?.ticketsRequired || 0} Ticket(s) Required
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-10 flex flex-col gap-4 pl-6 pr-12 text-center">
                  <div className="text-center">
                    <h1 className="pl-0 font-basement text-xl font-bold md:pl-8">
                      No Live Games
                    </h1>
                  </div>
                </div>
              )}
            </Tab.Panel>
            <Tab.Panel>
              {games.length ? (
                <div className="mb-5 mt-10 w-full rounded-[10px] pl-6 pr-10">
                  <div className="mt-4 flex flex-col gap-9 lg:flex-row">
                    {games.map((game, index) => (
                      <CryptoCard key={index} idx={index} data={game} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-10 flex flex-col gap-4 pl-6 pr-12 text-center">
                  <div className="text-center">
                    <h1 className="pl-0 font-basement text-xl font-bold md:pl-8">
                      No Upcoming Games
                    </h1>
                  </div>
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}
