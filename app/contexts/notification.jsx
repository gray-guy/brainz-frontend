"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import profileImage from "@/public/images/avatar.png"
import { CheckCirclekIcon } from "../components/Svgs"
import Image from "next/image"
import { useRouter } from "next/navigation"
const Context = createContext()

export const NotificationContext = ({ children }) => {
  const [open, setOpen] = useState(false)
  const toggleOpen = () => {
    setOpen(!open)
  }
  return (
    <Context.Provider value={{ open, toggleOpen }}>
      {open && <Notification onClose={toggleOpen} />}
      {children}
    </Context.Provider>
  )
}
export const useNotification = () => useContext(Context)
export const Notification = ({ open, onClose }) => {
  const router = useRouter()
  useEffect(() => {
    let timer
    timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 4) {
          clearInterval(timer)
          // onClose(false);
          return 0
        } else {
          return prevProgress + 1
        }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [open])
  const handleRedirect = () => {
    router.push("/dashboard/profile")
  }
  return (
    <div className="shadow-lg fixed -right-[140px] top-12 z-50 w-full max-w-xs -translate-x-1/2 transform rounded-[10px] bg-primary-350 pb-4 pl-8 pr-8 pt-3 md:-right-[126px] md:max-w-md">
      <div className="text-white">
        <h1 className="text-start font-inter text-base font-semibold">
          Connected as
        </h1>
        <div
          className="flex cursor-pointer items-center justify-between gap-4"
          onClick={handleRedirect}
        >
          <div className="flex items-center gap-2 pt-2.5">
            <div className="relative min-h-10 min-w-10 rounded-full pt-2.5">
              <Image
                src={profileImage}
                alt="Profile"
                layout="fill"
                className="rounded-full"
                objectFit="contain"
              />
            </div>
            <p className="max-w-44 text-wrap text-left text-xl font-normal">
              Blue_guy78 0x1aCD...4754
            </p>
          </div>
          <div>
            <CheckCirclekIcon />
          </div>
        </div>
        <div className="mt-3 h-1 w-full overflow-hidden rounded bg-white">
          <div
            className="h-full bg-secondary"
            style={{
              width: `100%`,
              transition: "width .8s linear",
            }}
          />
        </div>
      </div>
    </div>
  )
}
