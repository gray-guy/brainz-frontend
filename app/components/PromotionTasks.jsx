import { apiCall } from "@/lib/utils"
import { useUser } from "../contexts/UserContext"
import { useEffect, useState } from "react"
import { TickIcon } from "./Svgs"

export const PromotionTasks = () => {
  const { user } = useUser()

  const [loading, setLoading] = useState(true)
  const [steps, setSteps] = useState([
    false, // Verify Email
    false, // buy tickets
    false, // Play Game
  ])
  const [rewardAmt, setRewardAmt] = useState(0)
  const stepLabels = ["Verify Email", "Purchase Tickets", "Play Game"]

  useEffect(() => {
    const getUserTasks = async () => {
      const tasksData = await apiCall("get", "/users/tasks")
      if (tasksData) {
        setSteps([
          tasksData.verifyEmail,
          tasksData.buyTicket,
          tasksData.buyTicket ? tasksData.playGame : false,
        ])
        setRewardAmt(tasksData.rewardAmt)
      }
    }
    getUserTasks().finally(() => setLoading(false))
  }, [user])

  if (!user || loading) return null
  const completedStepsCount = steps.filter(Boolean).length

  return (
    <div className="rounded-[10px] bg-primary-350 px-[13px] py-3 font-basement">
      <div className="flex justify-between border-b-[4px] border-white pb-2">
        <p className="text-[14px] font-normal text-white">
          Complete Steps <br />& win{" "}
          <span className="text-[#00FF1A]">{rewardAmt} diamonds</span>
        </p>
        <div className="mt-2 flex">
          <p className="text-secondary">{completedStepsCount}</p>
          <span className="text-white">/3</span>
        </div>
      </div>
      {stepLabels.map((label, index) => (
        <div key={index}>
          <div className="mt-2.5 flex items-center justify-between">
            <p className="text-[14px] font-normal text-white duration-200">
              {label}
            </p>
            <div
              className="group flex h-[26px] w-[26px] items-center justify-center rounded-full border-[3px] border-[#445764]"
              style={{
                backgroundColor: steps[index] ? "yellow" : "transparent",
                color: steps[index] ? "black" : "#445764",
                borderColor: steps[index] ? "yellow" : "#445764",
              }}
            >
              <TickIcon />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
