import Link from "next/link"
import { Button } from "./Button"
import { PointsDetails } from "./PointsDetails"
import { ResultCard } from "./ResultCard"
import { ConfettiBackground } from "./ConfettiBackground "
import WheelModal from "./WheelModal"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { apiCall, getLocalAccessToken } from "@/lib/utils"
import Image from "next/image"
import CountdownTimer from "./CountDownTimer"
import { toast } from "react-toastify"
import { useUser } from "../contexts/UserContext"
import w from "@/public/sounds/win.mp3"
import l from "@/public/sounds/fail-sound.mp3"

const SPIN_DURATION = 4 * 1000

export const SessionResult = ({
  leaderboard,
  session,
  game,
  rewardEarned,
  playerCount,
}) => {
  const [remainingWheelTime, setRemainingWheelTime] = useState(
    session.wheelDuration
  )
  const [isOpenWheelModal, setIsOpenWheelModal] = useState(false)
  const [wheelData, setWheelData] = useState([])
  const [spinning, setSpinning] = useState(false)
  const [winningPrize, setWiningPrize] = useState({
    type: "",
    amount: "",
  })
  const [spinned, setSpinned] = useState(false)
  const wheelRef = useRef(null)
  const [nextSession, setNextSession] = useState(null)
  const [winnerAudio] = useState(new Audio(w))
  const [loserAudio] = useState(new Audio(l))

  useEffect(() => {
    if (rewardEarned.type === "pot") {
      toast.success('Your Prize is on its way!"')
      winnerAudio.play()
    } else {
      loserAudio.play()
    }
  }, [loserAudio, rewardEarned.type, winnerAudio])

  // if game has sessions get the next session
  useEffect(() => {
    if (game && game.sessions && game.sessions.length > 0) {
      const nextSession = game.sessions.find(
        (session) => new Date(session.startTime) > new Date()
      )
      console.log({ nextSession })
      // get least time session
      if (nextSession) {
        // const nextSession = nextSessions.reduce((prev, current) =>
        //   prev.startTime < current.startTime ? prev : current
        // );
        setNextSession(nextSession)
      }
    }
  }, [game])

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingWheelTime((prev) => {
        if (prev > 0) {
          return prev - 1
        } else {
          clearInterval(interval)
          !spinning && setIsOpenWheelModal(false)
          return 0
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const accessToken = getLocalAccessToken()
    const getWheelData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/wheels/session/${session.id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        )
        const diamondQuantity = res.data.diamondsQty
        const ticketQuantity = res.data.ticketsQty

        const cashPrizes = res.data.cashPrizes
        // get average for each prize to set weight on wheel
        const totalPrizes = cashPrizes.length + 3
        const diamondWeight = diamondQuantity / totalPrizes
        const ticketWeight = ticketQuantity / totalPrizes

        const data = [
          {
            label: "No Prize",
            weight: 1,
          },
          {
            label: "2 Diamonds",
            weight: Math.max(1, diamondWeight),
          },
          {
            label: "1 Ticket",
            weight: Math.max(1, ticketWeight),
          },
        ]
        cashPrizes.forEach((prize) => {
          data.push({
            label: `$${prize.amount}`,
            weight: Math.max(1, prize.qty / totalPrizes),
          })
        })
        setWheelData(data)
      } catch (err) {
        setRemainingWheelTime(0)
        console.error("Error fetching wheel data:", err)
      }
    }
    getWheelData()
  }, [])

  const getWinningPrize = async () => {
    const data = apiCall("post", `/wheels/spin`, { sessionId: session.id })
    if (!data) {
      toast.error("Error spinning the wheel!")
    }

    return data
  }

  const handleSpin = async () => {
    if (spinning || spinned) {
      return toast.error("You can only spin once!")
    }
    setSpinning(true)
    const winningPrize = await getWinningPrize()
    let winningMessage = ""
    let winningItem = "noPrize"
    let winningIndex = 0
    if (winningPrize.type === "cashPrize") {
      winningMessage = `You won $${winningPrize.amount}`
      winningItem = `$${winningPrize.amount}`
      winningIndex = wheelData.findIndex((item) => item.label === winningItem)
    } else if (winningPrize.type === "diamonds") {
      winningMessage = `You won ${winningPrize.amount} diamonds`
      winningItem = "2 Diamonds"
      winningIndex = wheelData.findIndex((item) => item.label === "2 Diamonds")
    } else if (winningPrize.type === "tickets") {
      winningMessage = `You won ${winningPrize.amount} tickets`
      winningItem = "1 Ticket"
      winningIndex = wheelData.findIndex((item) => item.label === "1 Ticket")
    } else {
      winningMessage = "Better luck next time"
    }
    wheelRef.current.spinToItem(winningIndex, SPIN_DURATION, true, 2, 1)
    setTimeout(() => {
      setSpinning(false)
      setSpinned(true)
      setRemainingWheelTime(0)
      if (winningPrize.type === "noPrize" || !winningPrize.type) {
        toast.info(winningMessage)
      } else {
        toast.success(winningMessage)
      }
      setTimeout(() => {
        setIsOpenWheelModal(false)
      }, 3000)
    }, SPIN_DURATION)
  }

  const { user } = useUser()

  const handleJoinSession = async (id) => {
    if (!user || !nextSession) return
    if (user.tickets < nextSession.ticketsRequired) {
      toast.error("You don't have enough tickets. Buy tickets in the shop.")
      return
    }
    window.location.href = `${process.env.NEXT_PUBLIC_WEB_URL}/session/${id}`
  }

  const showAnimation = wheelData.length > 0
  const isWheelDisabled = remainingWheelTime <= 0 || spinned || !showAnimation

  return (
    <div className="content">
      <ConfettiBackground />
      <div className="flex flex-wrap gap-6 border-secondary lg:gap-16">
        <div className="flex-1">
          <div
            className={
              "h-full w-full text-nowrap rounded-[10px] bg-gradient-to-r from-[#3a4d56]/90 to-[#152c3a] pb-4 pl-4 pr-4 pt-4 text-white lg:pb-6 lg:pl-6 lg:pr-12 lg:pt-4"
            }
          >
            <h1
              className={`mb-4 font-basement text-lg font-bold tracking-wider lg:text-xl`}
            >
              You Ranked{" "}
              <span className="uppercase text-secondary">
                {leaderboard.currentUser.rank}
                {leaderboard.currentUser.rank === 1
                  ? "st"
                  : leaderboard.currentUser.rank === 2
                    ? "nd"
                    : leaderboard.currentUser.rank === 3
                      ? "rd"
                      : "th"}
              </span>
            </h1>
            <h1
              className={`mb-4 font-basement text-xl font-bold tracking-wider lg:text-3xl`}
            >
              Your Points{" "}
              <span className="uppercase text-secondary">
                {leaderboard.currentUser.totalPoints}
              </span>
            </h1>
            {/* <h1
              className={`font-basement font-bold text-lg lg:text-xl text-white	tracking-wider	 `}
            >
              Correct Answers{" "}
              <span className="text-secondary uppercase">
                {leaderboard.currentUser.totalPoints}
              </span>
              /{session.totalQuestions}
            </h1> */}
          </div>
        </div>
        <div className="flex-1">
          <ResultCard
            title="Reward"
            amount={rewardEarned.amount}
            type={rewardEarned.type}
            variant="secondary"
          />
        </div>
        <div
          className={`flex-1 text-center sm:text-start ${showAnimation ? "animate-wiggle" : ""} ${isWheelDisabled ? "opacity-60" : ""}`}
        >
          <div
            className={
              "relative h-full w-full cursor-pointer overflow-hidden text-nowrap rounded-[10px] bg-gradient-to-r from-[#3a4d56]/90 to-[#152c3a] pb-4 pl-4 pr-4 pt-4 hover:bg-secondary lg:pb-6 lg:pl-6 lg:pr-12 lg:pt-4"
            }
            onClick={() => {
              if (isWheelDisabled) return
              setIsOpenWheelModal(true)
            }}
          >
            <div className="relative z-10">
              <h1
                className={`mb-4 font-basement text-lg font-bold tracking-wider text-white lg:text-xl`}
              >
                Spin the wheel{" "}
              </h1>
              <h1
                className={`font-basement text-xl font-bold text-white lg:text-3xl`}
              >
                {remainingWheelTime}s
              </h1>
            </div>
            <Image
              src={"/images/wheel.png"}
              alt="wheel"
              width={320}
              height={320}
              className="absolute -bottom-28 -right-20"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col flex-wrap justify-center gap-10 rounded-[10px] bg-gradient-to-r from-[#3a4d56]/80 to-[#152c3a]/90 px-4 py-4 lg:mt-10 lg:flex-row lg:gap-16 lg:px-6 lg:py-11">
        <div className="flex flex-1 items-center">
          <h1 className="w-full text-center font-basement text-lg font-black text-white lg:text-start lg:text-3xl">
            Next Session Starting in
          </h1>
        </div>
        <div className="flex flex-1 items-center">
          {nextSession ? (
            <CountdownTimer time={nextSession.startTime} />
          ) : (
            <h1 className="w-full text-center font-basement text-lg font-black text-white lg:text-start lg:text-3xl">
              No upcoming sessions
            </h1>
          )}
        </div>
        <div className="flex flex-1 flex-row flex-wrap items-center justify-center gap-4 lg:flex-col lg:gap-8">
          <div className="flex flex-row items-center justify-center gap-4 lg:flex-col">
            {nextSession && (
              <div href={"/session"} className="flex justify-center">
                <Button
                  variant={"outlined"}
                  size="text-sm lg:text-2xl"
                  className={"w-full px-6 lg:px-9"}
                  onClick={() => handleJoinSession(nextSession.id)}
                >
                  Take a seat
                </Button>
              </div>
            )}
            <Link href={"/"} className="w-full">
              <Button
                variant={"outlinedWhite"}
                size="text-sm lg:text-2xl"
                className={"w-full px-12 lg:px-9"}
              >
                Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-basement text-2xl font-black text-white lg:text-4xl">
          Participants ({playerCount})
        </h2>
        <div className="mt-5 h-[370px] cursor-grab overflow-y-scroll scrollbar scrollbar-thumb-[#104061] scrollbar-thumb-rounded-full scrollbar-w-[5.6px] scrollbar-h-[5.6px] active:cursor-grabbing lg:mt-9">
          <div className="flex flex-wrap justify-between gap-0 lg:gap-14">
            <div className="flex-1">
              {leaderboard.top10.slice(0, 5).map((user, index) => (
                <PointsDetails
                  key={index}
                  rank={user.rank}
                  userName={user.username.slice(0, 10)}
                  points={user.totalPoints}
                  // profileImage={rank.profileImage}
                  // reward={rank.reward}
                  myRank={leaderboard.currentUser.rank}
                  bgColorGrey
                  showWinnerIcon
                />
              ))}
            </div>
            <div className="flex-1">
              {leaderboard.top10.slice(5, 10).map((user, index) => (
                <PointsDetails
                  key={index}
                  rank={user.rank}
                  userName={user.username.slice(0, 10)}
                  points={user.totalPoints}
                  // profileImage={rank.profileImage}
                  // reward={rank.reward}
                  myRank={leaderboard.currentUser.rank}
                  bgColorGrey
                  showWinnerIcon
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {isOpenWheelModal && (
        <WheelModal
          showModal={isOpenWheelModal}
          setShowModal={setIsOpenWheelModal}
          wheelData={wheelData}
          wheelRef={wheelRef}
          onSpin={handleSpin}
          spinning={spinning}
        />
      )}
    </div>
  )
}
