import TermsConditionsModal from "@/app/components/ConditionsModal"
import { apiCall, getLocalAccessToken } from "@/lib/utils"
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react"
import WelcomeModal from "../components/WelcomeModal"

const UserContext = createContext(null)

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [onboardQuiz, setOnboardQuiz] = useState([])
  const [showWelcome, setShowWelcome] = useState(false)

  const handleAccepToc = async () => {
    const data = await apiCall("patch", "/profile", { acceptedToc: true })
    if (data) {
      setUser((prev) => ({ ...prev, ...data.profile }))
    }
  }

  useEffect(() => {
    const fetchQuestions = async () => {
      const onboardQuestion = await apiCall("get", "/questions/onboard")
      if (onboardQuestion) {
        setOnboardQuiz(onboardQuestion)
      }
    }
    fetchQuestions()
  }, [])

  console.log("onboardQuiz===>", onboardQuiz)

  useEffect(() => {
    if (sessionStorage.getItem("showWelcome")) return
    setTimeout(() => {
      setShowWelcome(true)
      sessionStorage.setItem("showWelcome", true)
    }, 2500)
  }, [])

  const refetchUser = useCallback(async () => {
    const userData = await apiCall("get", "/profile")
    if (userData) {
      setUser(userData.profile)
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, refetchUser }}>
      {children}
      <TermsConditionsModal
        isOpen={!!user && !user.hasAcceptedToc}
        onAccept={handleAccepToc}
      />
      <WelcomeModal
        showModal={!user && showWelcome}
        setShowModal={setShowWelcome}
      />
    </UserContext.Provider>
  )
}

export default UserProvider

export const useUser = () => {
  return useContext(UserContext)
}
