import Link from "next/link"
import { CrossIcon } from "./Svgs"
import { formatNumber } from "@/lib/utils"

const bgColors = {
  success: "bg-success/25",
  danger: "bg-danger-100/25",
}

const bgIconColors = {
  success: "bg-success",
  danger: "bg-danger-100",
}
const Ticket = ({
  mainIcon: MainIcon,
  number,
  label,
  bgColor = "danger",
  href = "/",
}) => {
  const backgroundColor = bgColors[bgColor]
  const IconBackgroundColor = bgIconColors[bgColor]

  return (
    <Link href={href} className="group flex w-fit gap-2.5">
      <div
        className={`ease relative flex items-center transition duration-100 ${backgroundColor} h-10 w-10 justify-center rounded-full ${
          bgColor === "danger"
            ? "group-hover:bg-danger-100"
            : "group-hover:bg-success"
        } `}
      >
        <MainIcon
          className={` ${
            bgColor === "danger" && "text-danger-100 group-hover:text-dark"
          } ${
            bgColor === "success" && "text-[#58FF69] group-hover:text-dark"
          } `}
        />
        <div
          className={`flex items-center ${IconBackgroundColor} absolute -bottom-2 right-1 h-4 w-4 cursor-pointer rounded p-1`}
        >
          <CrossIcon />
        </div>
      </div>
      <div className="text-white">
        <h1 className="font-basement text-base font-bold">
          {formatNumber(number, true)}
        </h1>
        <p className="font-basement text-sm">{label}</p>
      </div>
    </Link>
  )
}

export default Ticket
