import { convertSecondsToHMS } from "@/lib/utils"
import React, { useState, useEffect, useRef } from "react"
import TickingSound from "@/public/sounds/countdown-sound.wav"

export const Counter = ({ timeRemaining, isTickingEnabled }) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [color, setColor] = useState("bg-secondary")
  const [soundPlayed, setSoundPlayed] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    setTime(convertSecondsToHMS(timeRemaining || 0))
  }, [timeRemaining])

  // Function to pad single digit numbers with leading zero
  const padZero = (num) => {
    return num < 10 ? `0${num}` : num
  }

  // Function to play the sound
  const playSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(TickingSound)
    }
    audioRef.current.play().catch((error) => {
      // Play failed - handle error
      console.error("Failed to play sound:", error)
    })
  }

  // Function to stop the sound
  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  // when time is less than 10 seconds, change color to red amd play sound
  useEffect(() => {
    if (timeRemaining !== null) {
      if (timeRemaining <= 10) {
        setColor("bg-[red]")
      }
      if (timeRemaining <= 10 && !soundPlayed && isTickingEnabled) {
        setSoundPlayed(true)
        playSound()
      }
    }
  }, [timeRemaining])

  useEffect(() => {
    return () => {
      stopSound()
    }
  }, [])

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-[10px] md:h-16 md:w-16 lg:h-20 lg:w-20 ${color}`}
        >
          <h1 className="md:2xl font-basement text-lg font-black text-dark sm:text-xl lg:text-3xl">
            {padZero(time.hours)}
          </h1>
        </div>
        <p className="font-basement text-5xl font-black text-white">:</p>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-[10px] md:h-16 md:w-16 lg:h-20 lg:w-20 ${color}`}
        >
          <h1 className="md:2xl font-basement text-lg font-black text-dark sm:text-xl lg:text-3xl">
            {padZero(time.minutes)}
          </h1>
        </div>
        <p className="font-basement text-5xl font-black text-white">:</p>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-[10px] md:h-16 md:w-16 lg:h-20 lg:w-20 ${color}`}
        >
          <h1 className="md:2xl font-basement text-lg font-black text-dark sm:text-xl lg:text-3xl">
            {padZero(time.seconds)}
          </h1>
        </div>
      </div>
    </div>
  )
}
