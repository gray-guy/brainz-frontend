import { usePrivy } from "@privy-io/react-auth"
import QRCode from "qrcode.react"
import { Button } from "./Button"
import { toast } from "react-toastify"
import { TextCopyIcon } from "./Svgs"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { apiCall } from "@/lib/utils"

const BuyWithUsdt = ({
  packId,
  ticketAmount = 0,
  diamondAmount = 0,
  price,
  closeModal,
}) => {
  const { user } = usePrivy()
  const [buyData, setBuyData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBuying, setIsBuying] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [encodedPrice, setEncodedPrice] = useState("")

  console.log("buyData===>", buyData)

  const getBuyData = useCallback(async () => {
    const data = await apiCall("get", `/buy-requests/self`)
    // NOTE: user have only one open buy request
    if (data && data[0]?.packID === packId) {
      setBuyData(data[0])
    }
  }, [packId])

  useEffect(() => {
    if (!buyData) {
      setEncodedPrice("");
      return
    }
    setEncodedPrice(price + String(buyData.paymentCode).padStart(4, "0"))
  }, [price, buyData])

  // TODO: use sse or something to auto update buy data when it is closed
  useEffect(() => {
    getBuyData().finally(() => setIsLoading(false))
  }, [getBuyData])

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    toast.success("Address copied to Clipboard!")
  }

  const handleCancel = async () => {
    if (!buyData) return
    setIsCanceling(true)
    const data = await apiCall("patch", `/buy-requests/${buyData.id}`)
    if (data) {
      setBuyData(null)
    }
    setIsCanceling(false)
  }

  const handleBuy = async () => {
    setIsBuying(true)
    const data = await apiCall("post", "/buy-requests", {
      packID: packId,
    })
    if (data) {
      setBuyData(data)
    }
    setIsBuying(false)
  }

  return (
    <div>
      <div className="flex justify-center">
        <h2 className="mt-10 max-w-[458px] font-basement text-lg md:text-2xl">
          You are purchasing
          {ticketAmount > 0 && (
            <span className="font-bold"> {ticketAmount} tickets </span>
          )}
          {diamondAmount > 0 && (
            <span className="font-bold"> {diamondAmount} diamonds </span>
          )}
        </h2>
      </div>

      {isLoading ? (
        <div>Loading</div>
      ) : (
        <div
          style={{ gridTemplateColumns: "1fr 250px" }}
          className="mt-5 grid w-full justify-between text-left font-basement"
        >
          <div className="text-lg md:text-xl">
            <p className="mb-5 font-bold text-secondary">
              Only deposit over the BSC network.
            </p>
            <p className="text-sm md:text-lg">Amount</p>
            <div className="text-lg font-bold md:text-xl">
              {encodedPrice ? (
                <p className="flex gap-2">
                  <span>{encodedPrice} USDT</span>
                  <button onClick={() => handleCopy(encodedPrice)}>
                    <TextCopyIcon
                      className="text-grey-200 hover:text-white"
                      height="30"
                      width="30"
                    />
                  </button>
                </p>
              ) : (
                <Button
                  onClick={handleBuy}
                  isLoading={isBuying}
                  className="mt-2 w-full"
                >
                  Create Buy Request
                </Button>
              )}
            </div>
          </div>
          <div className="relative justify-self-center">
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
          <div className="col-span-2">
            <p className="text-sm md:text-lg">Send to:</p>
            <p className="flex gap-2 text-sm md:text-lg">
              <span className="rounded-[5px] bg-primary px-3">
                {user?.wallet?.address}
              </span>
              <button onClick={() => handleCopy(price)}>
                <TextCopyIcon
                  className="text-grey-200 hover:text-white"
                  height="30"
                  width="30"
                />
              </button>
            </p>
          </div>
        </div>
      )}

      <div className="mb-3 mt-[48px] flex justify-center gap-[34px]">
        {buyData && (
          <Button
            variant="outlinedWhite"
            onClick={handleCancel}
            disabled={ isCanceling }
          >
            Close buy request
          </Button>
        )}
      </div>
    </div>
  )
}

export default BuyWithUsdt
