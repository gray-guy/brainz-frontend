import axios from "axios"
import Dashboard from "@/app/container/Dashboard"
import Loader from "../components/Loader"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export default async function Page() {
  const fetchedGames = await axios.get(`${BASE_URL}/games`)
  const currentTime = new Date()
  const validGames = fetchedGames.data.filter((game) => {
    if (game.sessions.length === 0) return false
    return currentTime < new Date(game.endTime)
  })
  validGames.sort((a, b) => new Date(a.endTime) - new Date(b.endTime))
  let nextGame = null
  let upcomingGames = []
  if (validGames.length > 0) {
    nextGame = validGames[0]
    upcomingGames = validGames.slice(1)
  }

  let session = null
  let sessionIdx = 0
  if (nextGame) {
    nextGame.sessions.forEach((session) => {
      if (currentTime > new Date(session.endTime)) {
        session.status = "completed"
      } else if (currentTime < new Date(session.startTime)) {
        session.status = "upcoming"
      } else {
        session.status = "live"
      }
    })

    // TODO: what's the second check on length?
    const findFunc = (item, idx, self) =>
      item.status === "upcoming" || self.length - 1 === idx
    sessionIdx = nextGame.sessions.findIndex(findFunc)
    session = nextGame.sessions.find(findFunc)
  }

  let wheelRewards = null
  if (session) {
    try {
      const wheelResp = await axios.get(
        `${BASE_URL}/wheels/session/${session.id}?getOnlyRewards=true`
      )
      wheelRewards = wheelResp.data.totalRewards
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div>
      <Loader />
      <Dashboard
        nextGame={nextGame}
        games={upcomingGames}
        sessionIdx={sessionIdx}
        session={session}
        wheelRewards={wheelRewards}
      />
    </div>
  )
}
