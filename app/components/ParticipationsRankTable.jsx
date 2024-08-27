import Image from "next/image"
import { WinnerIcon } from "./Svgs"

export const ParticipationsRankTable = ({
  rank,
  userName,
  points,
  profileImage,
  isCurrentUser,
  animate,
  ...rest
}) => {
  const winnerRank = rank <= 3
  const winnerOpacity = winnerRank ? 1 : 0
  const winnerTextColor = isCurrentUser ? "dark" : "secondary"
  const rankStyles = isCurrentUser
    ? "items-center bg-[#FFE61A] text-dark pt-2.5 border-none rounded-lg opacity-100"
    : ""
  const animationClass =
    isCurrentUser && animate
      ? "transition-transform duration-500 ease-in-out animate-bounce"
      : ""

  return (
    <div
      className={`mb-4 flex items-center justify-between border-b border-grey-475 px-3 pb-2.5 ${rankStyles} ${animationClass}`}
      {...rest}
    >
      <div className="mr-6 flex items-center gap-1.5">
        <WinnerIcon
          className={`opacity-${winnerOpacity} text-${winnerTextColor}`}
        />
        <h1
          className={`w-6 font-basement text-base font-bold ${
            isCurrentUser ? "text-dark" : "text-white"
          }`}
        >
          {rank}
        </h1>
      </div>
      <div className="flex items-center justify-center gap-4">
        {/* <div className="relative w-6 h-6 border rounded-full min-w-6 min-h-6 max-w-6 max-h-6 border-secondary">
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
          className={`font-basement text-base font-bold ${
            isCurrentUser ? "text-dark" : "text-white"
          }`}
        >
          {userName.slice(0, 10)}
        </h1>
      </div>
      <div className="ml-11 flex items-center justify-center">
        <p
          className={`font-basement text-base font-bold ${
            isCurrentUser ? "text-dark" : "text-white"
          }`}
        >
          {points}
        </p>
      </div>
    </div>
  )
}

export default ParticipationsRankTable
