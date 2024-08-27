import { useState } from "react"
import { LinkIcon } from "./Svgs"
import { RightSidebar } from "./TransactionsRightbar"
import { tableData } from "../container/Profile/data"

const TransactionsTable = () => {
  const [open, setOpen] = useState(false)
  // const handleRightBar = () => setOpen(true);

  return (
    <div className="w-full overflow-x-scroll scrollbar scrollbar-thumb-[#104061] scrollbar-thumb-rounded-full scrollbar-w-[3px] scrollbar-h-[5px]">
      <table className="w-full table-auto text-white">
        <thead className="bg-primary">
          <tr className="h-[36px]">
            <th className="min-w-[200px] pl-[20px] text-start font-basement text-[14px] font-normal">
              Date
            </th>
            <th className="min-w-64 text-start font-basement text-[14px] font-normal">
              Title
            </th>
            <th className="min-w-56 text-start font-basement text-[14px] font-normal">
              Status
            </th>
            <th className="min-w-20 text-start font-basement text-[14px] font-normal">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => {
            const isPositive = item.amount.startsWith("+")
            const amountButtonClass = isPositive
              ? "bg-[#104838] text-[#30c551]"
              : "bg-danger-150/25 text-danger-150"

            return (
              <tr key={index} className="border-b border-primary-275">
                <td className="text-nowrap px-[20px] py-[20px] font-inter text-lg font-medium text-grey-600">
                  {item.date}
                </td>
                <td className="text-nowrap font-inter text-lg font-medium text-grey-600">
                  {item.title}
                </td>
                <td className="text-nowrap font-inter text-lg font-medium text-grey-600">
                  {item.status}
                </td>
                <td align="start" className="pb-3 pt-5">
                  <div className="flex items-center gap-4">
                    <button
                      className={`${amountButtonClass} rounded-[10px] px-3 py-[8px] text-lg font-bold hover:opacity-80`}
                    >
                      {item.amount}
                    </button>
                    <button className="m-0 p-0">
                      <LinkIcon className="cursor-pointer hover:text-secondary" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <RightSidebar open={open} setOpen={setOpen} />
    </div>
  )
}

export default TransactionsTable
