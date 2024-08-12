"use client"
import ConfirmationModal from "@/app/components/ConfirmationModal"
import { CountDown } from "@/app/components/CountDown"
import { ProgressBar } from "@/app/components/Progressbar"
import ReconnectModal from "@/app/components/ReconnectModal"
import { SelectAnswer } from "@/app/components/SelectAnswer"
import { SessionHeader } from "@/app/components/SessionHeader"
import { SessionResult } from "@/app/components/SessionResult"
import { apiCall } from "@/lib/utils"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { io } from "socket.io-client"

export const Session = ({ params }) => {
  const [stage, setStage] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [step, setStep] = useState(0)
  const [session, setSession] = useState({})
  const [sessionState, setSessionState] = useState({})
  const [loadingData, setLoadingData] = useState(true)
  const [game, setGame] = useState({})
  const [remainingTime, setRemainingTime] = useState(0)
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(0)
  const [restTimeRemaining, setRestTimeRemaining] = useState(0)
  const [question, setQuestion] = useState()
  const router = useRouter()
  const socketRef = useRef(null)
  const [leaderboard, setLeaderboard] = useState({ top10: [] })
  const [powerUsed, setPowerUsed] = useState({
    fiftyFifty: false,
    autoCorrect: false
  })
  const [isBanned, setIsBanned] = useState(false)
  const [rewardEarned, setRewardEarned] = useState({})
  const [isConnected, setIsConnected] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(true)
  const [joined, setJoined] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [isSessionEnd, setIsSessionEnd] = useState(false)
  const [playerCount, setPlayerCount] = useState(0)

  useEffect(() => {
    const getSession = async (id) => {
      const sessionData = await apiCall("get", `/sessions/${id}`)
      if (!sessionData) {
        toast.error("Session not found!")
        setIsExpired(true)
        return
      }
      setSession(sessionData)
      if (new Date(sessionData.endTime) < new Date()) {
        setIsExpired(true)
      }
      // TODO: add relevant info on session api return value
      const gameData = await apiCall("get", `/games/${sessionData.gameID}`)
      setGame(gameData)
    }

    const getSessionStats = async (id) => {
      const sessionStatsData = await apiCall(
        "get",
        `/session-stats/session/${id}`
      )
      setSessionState(sessionStatsData)
    }

    Promise.all([getSession(params.id), getSessionStats(params.id)]).finally(
      () => setLoadingData(false)
    )
  }, [params.id])

  useEffect(() => {
    if (loadingData || isBanned) return
    if (!isExpired && sessionState.isJoined) {
      setStage("countdown")
      setShowConfirmationModal(false)
      setJoined(true)
    }
  }, [isExpired, isBanned, loadingData, sessionState])

  useEffect(() => {
    if (stage === "selectAnswer") {
      const handleBeforeUnload = (event) => {
        event.preventDefault()
        event.returnValue = ""
        setShowModal(true)
      }

      const handleBackNavigation = (event) => {
        event.preventDefault()
        setShowModal(true)
      }

      window.addEventListener("beforeunload", handleBeforeUnload)
      window.history.pushState(null, null, window.location.pathname)
      window.addEventListener("popstate", handleBackNavigation)

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload)
        window.removeEventListener("popstate", handleBackNavigation)
      }
    }
  }, [showModal, stage])

  const handleAnswerSelect = (answer) => {
    setQuestion({ ...question, answer })
    if (socketRef.current) {
      socketRef.current.emit("submitAnswer", { answer })
    }
    document.dispatchEvent(new CustomEvent("answerSubmitted"))
  }

  const handleUsePower = (powerType) => {
    if (questionTimeRemaining <= 0) {
      toast.error("You cannot use a powerup now!")
      return
    }
    if (powerType === "fifty-fifty" && question.answers.length < 4) {
      toast.error("This powerup cannot be used for this question!")
      return
    }
    if (powerUsed[powerType]) {
      toast.error("You have already used this powerup!")
      return
    }
    if (socketRef.current) {
      socketRef.current.emit("usePower", { powerType })
    }
  }

  useEffect(() => {
    if (!joined || socketRef.current) return

    const token = localStorage.getItem("token")
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      reconnectionDelayMax: 10000,
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    socketRef.current = socket

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id)
    })
    socket.on("disconnect", (reason) => {
      setIsConnected(false)
      console.log(`Socket disconnected: ${reason}`)
    })
    socket.on("error", ({ message }) => {
      if (message.includes("ended")) {
        setIsExpired(true)
        setShowConfirmationModal(true)
      }
      toast.error(message)
    })

    socket.on("sessionNotStarted", ({ timeRemaining }) => {
      setRemainingTime(timeRemaining)
    })
    socket.on("questionTimeRemaining", ({ timeRemaining }) => {
      setQuestionTimeRemaining(timeRemaining)
    })
    socket.on("restTimeRemaining", ({ timeRemaining }) => {
      setRestTimeRemaining(timeRemaining)
    })
    socket.on("userLeaderboard", (data) => {
      setLeaderboard((prev) => ({ ...prev, currentUser: data }))
    })
    socket.on("leaderboardUpdate", ({ totalPlayers, top10 }) => {
      setPlayerCount(totalPlayers)
      setLeaderboard((prev) => ({ ...prev, top10 }))
    })

    socket.on("newQuestion", ({ question, count }) => {
      setStage("selectAnswer")
      if (count) {
        setStep(count)
      } else {
        setStep((prev) => prev + 1)
      }
      const q = question.question
      q.answers = q.answers.map((ans, idx) => ({ index: idx, text: ans }))
      setQuestion(q)
    })

    socket.on("sessionComplete", () => {
      setIsSessionEnd(true)
      setTimeout(() => {
        setStage("sessionResult")
      }, 4000)
    })

    socket.on("rewardSuccess", (data) => {
      setRewardEarned(data)
    })

    socket.on("banned", ({ message }) => {
      setStage("")
      setIsBanned(true)
      setShowConfirmationModal(true)
      toast.error(message)
    })

    socket.emit("joinSession", { sessionId: params.id })
    setIsConnected(true)
  }, [joined, params.id])

  // useEffect(() => {
  //   return () => {
  //     const sock = socketRef.current;
  //     if (sock?.connected) sock.close();
  //   };
  // }, []);

  useEffect(() => {
    if (!socketRef.current) return

    socketRef.current.on("fiftyFifty", ({ answers }) => {
      if (!question) return
      const correctAnswer = question.answers.find(
        (ans) => ans.text === answers[0]
      )
      const wrongAnswers = question.answers.filter(
        (ans) => ans.text !== answers[0]
      )
      const randomIndex = Math.floor(Math.random() * wrongAnswers.length)
      let newAnswers = [correctAnswer, wrongAnswers[randomIndex]]
      newAnswers = newAnswers.sort(() => Math.random() - 0.5)
      setQuestion({ ...question, answers: newAnswers, answer: null })
      setPowerUsed((prev) => ({ ...prev, fiftyFifty: true }))
      toast.success("Fifty-Fifty powerup applied!")
    })

    socketRef.current.on("autoCorrect", ({ answer }) => {
      if (!question) return
      setQuestion({ ...question, answer })
      setPowerUsed((prev) => ({ ...prev, fiftyFifty: true }))
      socketRef.current.emit("submitAnswer", { answer })
      toast.success("Auto-correct powerup applied!")
    })
    socketRef.current.on("answerSubmitted", ({ correctAnswer }) => {
      if (!question) return
      setQuestion({ ...question, correctAnswer })
    })

    return () => {
      socketRef.current?.off("fiftyFifty")
      socketRef.current?.off("autoCorrect")
      socketRef.current?.off("answerSubmitted")
    }
  }, [question])

  const handleConfirmStart = async () => {
    const data = await apiCall("post", "/session-stats", {
      sessionID: params.id
    })
    if (data) {
      toast.success(data.message || "Session joined successfully!")
      setJoined(true)
      setShowConfirmationModal(false) // Hide the confirmation modal
      setStage("countdown") // Change the stage to countdown
    }
  }

  const handleCancelStart = () => {
    router.replace("/")
    // window.location.href = `${process.env.NEXT_PUBLIC_WEB_URL}/dashboard`;
  }

  const progess = (step / session.totalQuestions) * 100 - 1

  const handleReconnect = () => {
    if (!socketRef.current) return
    const sock = socketRef.current
    if (!sock.active) {
      sock.connect()
    }
    sock.emit("joinSession", { sessionId: params.id })
    setIsConnected(true)
  }

  if (loadingData) {
    return (
      <div className="z-[1000000] flex h-screen w-full items-center justify-center gap-4 bg-primary text-white">
        <div className="z-50 h-10 w-10 animate-spin rounded-full border-4 border-secondary border-s-secondary/20" />
        Loading
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        className="absolute right-4 top-4 z-[101] bg-secondary"
        onClick={() => {
          if (socketRef.current) socketRef.current.disconnect()
        }}
      >
        disconnect
      </button>
      {stage === "countdown" && !showConfirmationModal && (
        <>
          <SessionHeader title={game.title} />
          <div className="px-6 pb-3 pt-8 lg:px-7 lg:pb-7 lg:pt-10">
            <CountDown
              showReconnect={!isConnected}
              onReconnect={handleReconnect}
              session={session}
              timeRemaining={remainingTime}
            />
          </div>
        </>
      )}
      {stage === "selectAnswer" && !showConfirmationModal && (
        <>
          <div className="hidden md:block">
            <SessionHeader />
          </div>
          <div className="fixed left-0 top-[76px] z-30 hidden h-2 w-full transition ease-in md:block">
            <ProgressBar progress={progess} step={step} />
          </div>
          <div className="mt-0 md:mt-8 lg:mt-10">
            <SelectAnswer
              isSessionEnded={isSessionEnd}
              playerCount={playerCount}
              setSelectedOption={handleAnswerSelect}
              question={question}
              step={step}
              progress={progess}
              questionTimeRemaining={questionTimeRemaining}
              restTimeRemaining={restTimeRemaining}
              leaderboard={leaderboard}
              handleUsePower={handleUsePower}
              title={game.title}
              powerUsed={powerUsed}
              session={session}
              stage={stage}
              // handleStageChange={handleStageChange}
            />
          </div>
        </>
      )}
      {stage === "sessionResult" && !showConfirmationModal && (
        <>
          <SessionHeader />
          <div className="pl-6 pr-6 pt-8 md:pl-14 md:pr-16 lg:pt-10">
            <SessionResult
              playerCount={playerCount}
              leaderboard={leaderboard}
              session={session}
              game={game}
              rewardEarned={rewardEarned}
            />
          </div>
        </>
      )}
      {/* {showModal && (
        <BackModal
          showModal={showModal}
          setShowModal={setShowModal}
          onContinue={handleContinue}
          onLeaveClick={handleLeave}
        />
      )} */}
      <ReconnectModal
        showModal={
          stage !== "countdown" && stage !== "sessionResult" && !isConnected
        }
        onReconnect={handleReconnect}
      />
      <ConfirmationModal
        ticketsAmount={session?.ticketsRequired}
        showModal={showConfirmationModal}
        onConfirm={handleConfirmStart}
        onCancel={handleCancelStart}
        isExpired={isExpired}
        isBanned={isBanned}
      />
    </div>
  )
}
