"use client"
import React, { useCallback, useEffect, useState } from "react"
import { Button } from "./Button"
import { PriceAdjuster } from "./PriceAdjuster"
import { LinkIcon } from "./Svgs"
import { apiCall, formatWalletAddress } from "@/lib/utils"
import { isAddress } from "viem"
import { toast } from "react-toastify"
import { useUser } from "../contexts/UserContext"
import { RefreshCw } from "lucide-react"

const isMainnet = process.env.NEXT_PUBLIC_CHAIN === "bsc"

const WithdrawRewards = () => {
  const { user, setUser } = useUser()
  const [recipient, setRecipient] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [tableData, setTableData] = useState([])
  const [amount, setAmount] = useState(0)
  const [isFetching, setisFetching] = useState(false)
  const [errors, setErrors] = useState({})

  const fetchTableData = useCallback(async () => {
    const data = await apiCall("get", "/withdraw/self")
    if (data) setTableData(data)
  }, [])

  useEffect(() => {
    fetchTableData().finally(() => setIsLoading(false))
  }, [fetchTableData])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isAddress(recipient)) {
      toast.error("Please enter a valid address")
      return
    }
    if (amount <= 0 || amount > user.credit) {
      toast.error("Please enter a valid amount (between 0 and your credit)")
      return
    }
    console.log("Submitted", JSON.stringify({ recipient, amount }))
    const data = await apiCall("post", "/withdraw", {
      amount,
      walletAddress: recipient,
    })
    if (data) {
      toast.success("Your withdraw request was submitted successfully")
      // TODO: refetch user profile data
      setUser((prev) => ({ ...prev, credit: prev.credit - amount }))
      setTableData((prev) => [data.data, ...prev])
    }
    setAmount(0)
    setRecipient("")
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3 className="font-basement text-lg font-bold text-white lg:text-2xl">
          Withdraw Rewards
        </h3>
        <div className="mt-8 max-w-[512px]">
          <label className="font-basement text-base font-bold text-white lg:text-xl">
            Receiving Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder={`Paste your address here`}
            className={`text-gray-500 z-0 mt-2.5 w-full rounded-[20px] border border-primary-275 bg-primary py-4 pl-4 pr-[88px] text-white focus:outline-none`}
          />
        </div>
        <div className="mt-7">
          <h1 className="font-basement text-base font-bold text-white lg:text-xl">
            Withdrawal Amount ({user.credit})
          </h1>
          <div className="mt-2.5">
            <PriceAdjuster
              value={amount}
              currency={"USDT"}
              onChange={(value) => setAmount(value)}
            />
          </div>
        </div>
        <Button
          variant={"outlined"}
          className={"mt-10 px-7 py-2"}
          size="text-base lg:text-lg"
          type="submit"
        >
          Request Withdrawal
        </Button>
      </form>

      {(isLoading || tableData.length > 0) && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="mb-5 mt-10 font-basement text-lg font-bold text-white lg:text-2xl">
              Withdraw Requests
            </h3>

            <button
              className={`p-3 text-white ${isFetching ? "animate-spin" : ""}`}
              onClick={async () => {
                try {
                  setisFetching(true)
                  await fetchTableData()
                } finally {
                  setisFetching(false)
                }
              }}
              title="Refresh Data"
            >
              <RefreshCw />
            </button>
          </div>
          {isLoading ? (
            <div className="z-50 h-10 w-10 animate-spin rounded-full border-4 border-secondary border-s-secondary/20" />
          ) : (
            <WithdrawTable tableData={tableData} />
          )}
        </>
      )}
    </div>
  )
}

const WithdrawTable = ({ tableData }) => {
  return (
    <div className="w-full overflow-x-scroll scrollbar scrollbar-thumb-[#104061] scrollbar-thumb-rounded-full scrollbar-w-[3px] scrollbar-h-[5px]">
      <table className="w-full table-auto text-white">
        <thead className="bg-primary">
          <tr className="h-[36px] [&>th]:text-start [&>th]:font-basement [&>th]:font-normal">
            <th className="min-w-36 pl-[20px] text-[14px]">Date</th>
            <th className="min-w-44 text-[14px]">Status</th>
            <th className="min-w-44 text-[14px]">Address</th>
            <th className="min-w-20 text-[14px]">Amount</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => {
            return (
              <tr key={index} className="border-b border-primary-275">
                <td className="text-nowrap px-[20px] py-[20px] font-inter text-lg font-medium text-grey-600">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="text-nowrap font-inter text-lg font-medium text-grey-600">
                  {item.status === "initiated"
                    ? "waitingApproval"
                    : item.status}
                </td>
                <td
                  title={item.walletAddress}
                  className="text-nowrap font-inter text-lg font-medium text-grey-600"
                >
                  {formatWalletAddress(item.walletAddress)}
                </td>
                <td align="start">
                  <div className="flex items-center gap-2 px-4">
                    <span
                      className={`rounded-[10px] p-1 text-lg font-bold hover:opacity-80`}
                    >
                      {item.amount}
                    </span>
                    {item.txHash && (
                      <a
                        target="_blank"
                        rel="noopener"
                        href={`https://${isMainnet ? "bscscan" : "testnet.bscscan"}.com/tx/${item.txHash}`}
                        className="m-0 p-0"
                      >
                        <LinkIcon className="cursor-pointer hover:text-secondary" />
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default WithdrawRewards
