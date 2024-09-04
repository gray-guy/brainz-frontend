import { usePrivy } from "@privy-io/react-auth"
import QRCode from "qrcode.react"
import { Button } from "./Button"
import { toast } from "react-toastify"
import { TextCopyIcon } from "./Svgs"
import Image from "next/image"
import { useEffect, useState } from "react"
import { apiCall } from "@/lib/utils"

const BuyWithUsdt = ({
  ticketAmount = 0,
  diamondAmount = 0,
  priceInOtherToken,
  price,
  selectedOption = "USDT",
  closeModal,
}) => {
  const { user } = usePrivy()
  const [code, setCode] = useState("0")

  //   useEffect(() => {
  //     const getCurrentPaymentCode = async () => {
  //       const newCode = await apiCall("get", "/current-payment-code")
  //       setCode(newCode)
  //     }
  //     getCurrentPaymentCode()
  //   }, [])

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Address copied to Clipboard!")
  }

  return (
    <div>
      <div className="flex justify-center">
        <h2 className="mt-10 max-w-[458px] font-basement text-lg font-bold md:text-2xl">
          You are purchasing{" "}
          {ticketAmount > 0 && <span>{ticketAmount} tickets </span>}
          {diamondAmount > 0 && <span> {diamondAmount} diamonds </span>}
          for {priceInOtherToken > 0 ? priceInOtherToken : price}{" "}
          {selectedOption}.
        </h2>
      </div>

      <div className="mt-5 flex w-full justify-between gap-8">
        <div>
          <div className="text-left font-inter text-sm font-medium text-grey-550 lg:text-sm">
            Send the amount of USDT of your choice to the following address to
            receive the equivalent in Coins.
          </div>
          <div className="lg:text-s my-3 text-left font-inter text-sm font-medium text-secondary">
            Only deposit over the BSC network. Do not use Ethereum, Base,
            Arbitrum or Optimism networks.
          </div>
          <div className="mb-3 text-left font-inter text-sm font-medium text-secondary lg:text-sm">
            Do NOT send NFT's to this USDT deposit address. In order to recover
            NFTs deposited to this address an administrative fee will be
            charged.
          </div>
        </div>
        <div className="relative">
          <QRCode
            size={160}
            value={user?.wallet?.address}
            bgColor={"#ffffff"} // The QR Background Color
            fgColor={"#000000"} // The Qr Color
            level={"Q"} // Levels Can be L,M,Q,H Default is L
            includeMargin={false}
            renderAs={"svg"}
          />
        </div>
      </div>

      <div>
        <div className="mt-8 max-w-full">
          <div className="text-left font-inter text-sm font-medium text-grey-550 lg:text-lg">
            YOUR PERSONAL USDT DEPOSIT ADDRESS
          </div>
          <div className="relative mt-2 flex w-full justify-between rounded-[20px] border border-primary-275 bg-primary">
            <input
              type="text"
              readOnly={true}
              placeholder={"0xjhsduh7ehpaefklafo8y678t78ghjkbn"}
              value={user?.wallet?.address}
              className={`text-gray-500 z-0 w-full bg-[transparent] px-4 py-4 text-white focus:outline-none`}
            />
            <Button
              variant={"outlined"}
              onClick={() => handleCopy(user?.wallet?.address)}
            >
              Copy Address
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-5 flex max-w-xs flex-col gap-4 text-left">
        <div className="flex justify-between gap-3">
          <h1 className="font-basement text-xl font-bold">You pay</h1>
          <div className="flex gap-3 align-middle">
            <Image
              src="/images/usdt-logo.png"
              width={40}
              height={40}
              alt="usdt logo"
            />
            <h1 className="font-basement text-xl font-bold">
              {priceInOtherToken > 0 ? priceInOtherToken : price}{" "}
              {selectedOption}
            </h1>
            <button onClick={() => handleCopy(price)}>
              <TextCopyIcon
                className="text-grey-200 hover:text-white"
                height="26"
                width="24"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="mb-3 mt-[48px] flex justify-center gap-[34px]">
        <button
          className="bg-transparent inline-flex items-center text-nowrap rounded-full border-2 border-white px-[41px] py-[4px] font-basement font-bold text-white duration-200 hover:bg-white hover:text-dark"
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default BuyWithUsdt
