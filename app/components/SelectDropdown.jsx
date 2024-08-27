import React, { useState, useRef, useEffect } from "react"
import { ArrowDownLightIcon, WalletIcon } from "./Svgs"
import Image from "next/image"

const SelectDropdown = ({ options, defaultIdx }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(
    options[defaultIdx] ?? options[0]
  )
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative cursor-pointer" ref={dropdownRef}>
      <div
        onClick={toggleDropdown}
        className={` ${
          isOpen ? "bg-primary-275" : "bg-primary-350"
        } focus:shadow-outline relative z-[11] flex w-full items-center justify-between rounded-lg border border-primary-275 py-2 pl-2.5 pr-4 transition duration-200 hover:bg-primary-275`}
      >
        <div className="flex items-center font-basement">
          <div className="mr-2.5 flex items-center rounded bg-primary px-2 py-1.5 font-bold text-grey-200">
            <span className="mr-2">
              <Image
                src={selectedOption.imageUrl}
                alt={selectedOption.name}
                width={20}
                height={20}
                className="object-cover"
              />
            </span>
            <p className="mr-2 text-sm">{selectedOption.balance}</p>
          </div>
          <p className="text-sm text-white">{selectedOption.symbol}</p>
        </div>

        <div className="ml-4">
          <ArrowDownLightIcon className={"text-grey-300"} />
        </div>
      </div>
      {isOpen && (
        <div className="shadow-lg absolute z-10 mt-[5px] w-full rounded-lg bg-dark-100 px-2 text-grey-200">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`py-2 hover:text-white ${
                index === options.length - 1
                  ? "border-b-0"
                  : "border-b-[0.5px] border-grey-200"
              }`}
            >
              <div className="flex items-center justify-around px-2 pb-2 pt-2.5">
                <div className="flex flex-1 font-basement font-normal">
                  <span>
                    <Image
                      src={option.imageUrl}
                      alt={option.name}
                      width={20}
                      height={20}
                      className="object-cover"
                    />
                  </span>
                  <p className="ml-2 text-sm">{option.balance}</p>
                </div>
                <p className="mr-2 text-sm">{option.symbol}</p>
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary-225 p-1">
                  <WalletIcon />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectDropdown
