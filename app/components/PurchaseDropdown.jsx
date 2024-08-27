import React, { useState, useRef, useEffect } from "react"
import { ArrowDownLightIcon, ArrowIcon } from "./Svgs"

const PurchaseDropdown = ({ options, onChange, defaultOption = "ETH" }) => {
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
        className="focus:shadow-outline relative z-[11] flex w-full items-center leading-tight focus:outline-none"
      >
        <div className="flex w-full items-center justify-between rounded-[10px] border border-primary-275 bg-primary px-6 py-3 font-basement md:px-8">
          <div className="flex flex-col rounded text-start font-bold text-grey-200">
            <p className="mb-[4px] font-basement text-xs font-normal">
              YOU PAY
            </p>
            <h1 className="text-sm text-white md:text-base">
              {selectedOption.price || options[0].price}
            </h1>
          </div>
          <div className="flex items-center text-white">
            <span className="mr-2">
              {selectedOption.icon || options[0].icon}
            </span>
            <h2 className="text-sm md:text-base">
              {selectedOption.label || options[0].label}
            </h2>

            <div className="ml-2.5">
              <ArrowDownLightIcon className={"text-grey-300"} />
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="absolute z-10 -mt-1 w-full rounded bg-dark-100 text-grey-200">
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
              <div className="flex items-center justify-between pb-2 pl-8 pr-[54px] pt-2.5">
                <div className="flex font-basement font-normal">
                  <p className="text-sm md:text-base">{option.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span>{option.icon}</span>
                  <p className="text-sm md:text-base">{option.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PurchaseDropdown
