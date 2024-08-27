"use client"
import { apiCall, authenticate, getWalletBalance } from "@/lib/utils"
import { getAccessToken, usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useUser } from "../contexts/UserContext"
import { useWallet } from "../contexts/WalletContext"

const Loader = ({ children }) => {
  const { ready, authenticated, logout } = usePrivy()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const { user, setUser } = useUser()
  const {
    walletAddress,
    tokens,
    setTokens,
    walletBalances,
    setWalletBalances,
    provider,
    platformAddress,
    setPlatformAddress,
  } = useWallet()

  useEffect(() => {
    const checkAuthentication = async () => {
      if (ready && authenticated) {
        let token = localStorage.getItem("token")
        const expiresAt = localStorage.getItem("expiresAt")
        const expired = new Date(expiresAt) < new Date()

        if (!token || expired) {
          const data = await authenticate()
          if (!data) {
            logout()
            return
          }
          token = data.token

          const userData = await apiCall("get", "/profile")
          setUser(userData.profile)
        } else if (!user) {
          const userData = await apiCall("get", "/profile")
          if (!userData) {
            logout()
            return
          }
          setUser(userData.profile)
        }
        setLoggedIn(true)
      } else if (ready && !authenticated) {
        router.push("/")
        localStorage.removeItem("token")
        localStorage.removeItem("expiresAt")
      }

      setLoading(false)
    }

    if (ready) {
      checkAuthentication()
    }
  }, [ready, authenticated, router])

  useEffect(() => {
    const getBalances = async () => {
      const tokens = await apiCall("get", "/tokens")
      if (tokens) {
        setTokens((prev) => [...prev, ...tokens])
        if (provider && walletBalances.length <= 1) {
          tokens.forEach(async (token) => {
            if (token.isNative) return
            const balance = await getWalletBalance({
              provider,
              walletAddress,
              tokenAddress: token.contractAddress,
            })
            const balanceDetails = {
              balance,
              symbol: token.symbol,
              imageUrl: token.imageUrl,
            }
            setWalletBalances((prev) => ({
              ...prev,
              [token.symbol.toUpperCase()]: balanceDetails,
            }))
          })
        }
      }
    }
    // TEST
    const getPlatformAddress = async () => {
      const data = await apiCall("get", "/platformWallet")
      if (data) {
        setPlatformAddress(data.platformWallet)
      }
    }
    if (loggedIn) {
      getBalances()
    }

    if (loggedIn && !platformAddress) {
      getPlatformAddress()
    }
  }, [loggedIn, provider])

  // if (!ready || loading) {
  //   return (
  //     <div className="z-[1000000] flex h-screen w-full items-center justify-center gap-4 bg-primary text-white">
  //       <div className="z-50 h-10 w-10 animate-spin rounded-full border-4 border-secondary border-s-secondary/20" />
  //       Loading
  //     </div>
  //   )
  // }

  // if (authenticated && loggedIn && !loading) {
  //   return children
  // }

  return null
}

export default Loader
