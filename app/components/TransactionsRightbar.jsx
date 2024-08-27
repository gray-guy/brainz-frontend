import { useEffect, useRef } from "react"
import { BankIcon, ModalCrossIcon } from "./Svgs"
import { Button } from "./Button"

export const RightSidebar = ({ open, setOpen }) => {
  const sidebarRef = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  return (
    <div ref={sidebarRef} className="mr-[20px]">
      <div
        className={`fixed right-0 top-0 h-full w-[512px] transform overflow-y-scroll bg-primary-375 px-[54px] pt-[60px] text-center text-white transition-transform scrollbar scrollbar-thumb-primary scrollbar-thumb-rounded-full scrollbar-w-[10px] ${
          open ? "translate-x-0" : "translate-x-full"
        } z-40`}
      >
        <div>
          <h1 className="font-inter text-[26px] font-[800]">
            Transaction Details
          </h1>
          <button
            onClick={() => setOpen(false)}
            className="absolute right-[50px] top-[36px] text-2xl focus:outline-none"
          >
            <ModalCrossIcon height="19" width="19" />
          </button>
        </div>
        <div className="mt-14 flex flex-col items-center justify-center border-b border-grey pb-6">
          <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-[3px] border-secondary bg-primary-425">
            <BankIcon />
          </div>
          <h1 className="mt-4 text-start font-basement text-[34px] font-bold text-white">
            +25 USDT
          </h1>
          <h1 className="mt-[6px] text-start font-basement text-[22px] font-bold text-white">
            Completed
          </h1>
        </div>
        <h1 className="mt-5 text-start font-basement text-xl font-bold text-white">
          Transaction Details
        </h1>
        <div className="pb-[82px]">
          <div>
            <h1 className="mt-5 text-start font-basement font-inter text-lg font-bold text-white">
              Transaction ID:
            </h1>
            <p className="text-start font-basement font-inter text-lg font-[600] font-bold text-grey-600">
              656599538
            </p>
          </div>
          <div>
            <h1 className="mt-5 text-start font-basement font-inter text-lg font-bold text-white">
              Description:
            </h1>
            <p className="text-start font-basement font-inter text-lg font-[600] font-bold text-grey-600">
              Reward
            </p>
          </div>
          <div>
            <h1 className="mt-5 text-start font-basement font-inter text-lg font-bold text-white">
              Session & ID:
            </h1>
            <p className="text-start font-basement font-inter text-lg font-[600] font-bold text-grey-600">
              Cryto <br />
              545451454
            </p>
          </div>
          <div>
            <h1 className="mt-5 text-start font-basement font-inter text-lg font-bold text-white">
              Completed:
            </h1>
            <p className="text-start font-basement font-inter text-lg font-[600] font-bold text-grey-600">
              22 March, 2024
            </p>
          </div>
          <div className="mt-14 flex flex-col items-center justify-center">
            <h1 className="mt-5 border-b pb-[4px] text-start font-basement font-inter text-lg font-bold text-white">
              Session Details
            </h1>
            <Button variant={"outlined"} className={"mt-8"}>
              Download Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
