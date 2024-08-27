"use client"
import React, { useState } from "react"
import { CheckCirclekIcon, GreyCheckIcon } from "./Svgs"

const Input = ({
  label,
  className,
  showCheckIcon,
  isSaved,
  showCopy,
  ...props
}) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
    }, 5000)
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex justify-between pl-[6px] pr-[18px]">
        <label className="text-gray-550 pl-[6px] font-inter text-sm font-medium lg:text-lg">
          {label}
        </label>
        {showCheckIcon && (
          <span
            className={`text-lg lg:text-xl ${
              isSaved ? "text-green-500" : "text-gray-500"
            }`}
          >
            {isSaved ? <CheckCirclekIcon /> : <GreyCheckIcon />}
          </span>
        )}
      </div>

      <div className="relative mt-3">
        <input
          {...props}
          className={`w-full rounded-[20px] border border-primary-275 bg-primary px-4 py-4 focus:outline-none focus:ring-1 ${className} ${
            showCopy && "pr-[100px]"
          } `}
        />
        {showCopy && (
          <button
            className="absolute bottom-2.5 right-0 h-max rounded-md px-6 py-2 text-white focus:outline-none"
            onClick={() => handleCopy(props.value)}
          >
            {isCopied ? "Copied" : "Copy"}
          </button>
        )}
      </div>
    </div>
  )
}

export default Input
