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

  const refetchUser = useCallback(async () => {
    const userData = await apiCall("get", "/profile")
    if (userData) {
      setUser(userData.profile)
    }
  }, [])

  useEffect(() => {
    const fetchQuestions = async () => {
      const onboardQuestion = await apiCall("get", "/questions/onboard")
      if (onboardQuestion) {
        setOnboardQuiz(onboardQuestion)
      }
    }
    fetchQuestions()
  }, [])

  useEffect(() => {
    // if (sessionStorage.getItem("shownWelcome")) return
    setTimeout(() => {
      setShowWelcome(true)
      sessionStorage.setItem("shownWelcome", true)
    }, 2500)
  }, [])

  useEffect(() => {
    if (user) {
      setShowWelcome(false)
      sessionStorage.setItem("shownWelcome", true)
    }
  }, [user])

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
        onboardQuiz={onboardQuiz}
      />
    </UserContext.Provider>
  )
}

export default UserProvider

export const useUser = () => {
  return useContext(UserContext)
}
