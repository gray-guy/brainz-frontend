import Image from "next/image"
import { WinnerDarkIcon, WinnerIcon } from "./Svgs"

export const PointsDetails = ({
  rank = "01",
  userName = "User9850",
  points = "5 pts",
  reward = "",
  profileImage,
  showWinnerIcon = false,
  ranked = false,
  bgColorGrey,
  myRank,
  participants,
  ...rest
}) => {
  const ActiveRankStyles = myRank
    ? "items-center bg-[#FFE61A] pb-[10px] pt-2.5 border-none rounded-[8px]"
    : ""

  const bgGreyStyles =
    bgColorGrey &&
    "items-center bg-[#344653] pb-[14px] pt-[14px] px-[20px] lg:px-[28px] border-none rounded-[8px]"

  const textStyles =
    ranked || myRank ? "font-basement font-bold text-dark" : "text-white "
  const rankNumStyles = ranked || myRank ? "text-dark" : "text-white"
  return (
    <div
      className={`mb-[16px] flex w-full items-center justify-between border-b border-grey-475 px-3 pb-[10px] ${ActiveRankStyles} ${bgGreyStyles} ${
        !showWinnerIcon && "pl-[38px]"
      } `}
      {...rest}
    >
      <div className="mr-[26px] flex items-center gap-[6px]">
        {myRank && !participants && <WinnerDarkIcon />}
        {showWinnerIcon && !myRank && (
          <WinnerIcon className={"text-secondary"} />
        )}
        <h1 className={`font-basement text-base font-bold ${rankNumStyles}`}>
          {rank}
        </h1>
      </div>
      <div className="flex items-center justify-center gap-4">
        {/* <div className="relative w-[24px] h-[24px] rounded-full border border-secondary">
          <Image
            src={profileImage}
            alt="profile"
            layout="fill"
            className="rounded-full"
            draggable={false}
            priority={true}
          />
        </div> */}
        <h1
          className={`text-nowrap font-basement text-sm font-bold lg:text-base ${textStyles}`}
        >
          {userName}
        </h1>
      </div>
      <div className="ml-[44px] flex items-center justify-center">
        <p
          className={`text-nowrap font-basement text-sm font-bold lg:text-base ${textStyles}`}
        >
          {points}
        </p>
      </div>
      {/* {!participants && (
        <div className="flex items-center justify-center ml-[44px]">
          <p
            className={`font-bold font-basement text-sm lg:text-base text-nowrap	 ${textStyles}`}
          >
            Reward: {reward}
          </p>
        </div>
      )} */}
    </div>
  )
}
