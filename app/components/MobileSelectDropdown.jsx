import React, { useState, useRef, useEffect } from "react"
import { ArrowDownLightIcon, ArrowIcon, WalletIcon } from "./Svgs"

const MobileSelectDropdown = ({ options, onChange, defaultOption = "ETH" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(defaultOption)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    if (onChange) {
      onChange(option)
    }
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
        } focus:shadow-outline relative z-[11] flex w-full items-center rounded-lg border border-primary-275 py-2 pl-2.5 pr-4 transition duration-200 hover:bg-primary-275`}
      >
        <div className="flex w-full items-center justify-between">
          <div className="mr-2.5 flex w-[270px] items-center justify-between rounded bg-primary px-3 py-2.5 font-bold text-grey-200">
            <span className="mr-2">
              {selectedOption.icon || options[0].icon}
            </span>
            <p className="font-sm mr-2">
              {selectedOption.price || options[0].price}
            </p>
          </div>
          <div className="flex items-center">
            <p className="text-base text-white">
              {selectedOption.label || options[0].label}
            </p>
            <div className="ml-2.5">
              <ArrowDownLightIcon className={"text-grey-300"} />
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="shadow-lg absolute z-10 -mt-1 w-full rounded bg-dark-100 px-[8px] text-grey-200">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`px-4 py-2 hover:text-white ${
                index === options.length - 1
                  ? "border-b-0"
                  : "border-b-[0.5px] border-grey-200"
              }`}
            >
              <div className="flex items-center justify-between pb-2 pt-2.5">
                <div className="flex font-basement font-normal">
                  <span>{option.icon}</span>
                  <p className="ml-2 text-sm">{option.price}</p>
                </div>
                <p className="text-sm">{option.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MobileSelectDropdown
