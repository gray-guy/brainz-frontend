"use client"
import Link from "next/link"
import homeBanner from "../../../public/images/homebanner.png"
import logo from "../../../public/images/brainz-logo.svg"
import iphone from "@/public/images/IPhoneFrame.png"
import robot from "@/public/images/robot.png"
import Image from "next/image"
import WaveAnimation from "@/app/components/Wave"
import Footer from "@/app/components/Footer"
import { Button } from "@/app/components/Button"
import { WinBox } from "@/app/components/WinBox"
import { winBoxData } from "./data"
import { useEffect, useState } from "react"
import { calculateTimeLeft } from "@/lib/utils"

export const Waitlist = () => {
  const targetTime = new Date(Date.UTC(2024, 6, 2, 18, 0))

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetTime))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTime))
    }, 1000)

    return () => clearInterval(timer)
  }, [targetTime])

  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${homeBanner.src})`,
          width: "100%",
          objectFit: "cover",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          backgroundPosition: "center",
          backgroundRepeat: " no-repeat",
          backgroundSize: "cover",
        }}
        className="flex flex-col items-center"
      >
        <div className="container flex flex-col items-center justify-center px-6 py-14 text-center">
          <Link href={"/"} className="relative h-12 w-20 lg:h-16 lg:w-28">
            <Image
              src={logo}
              alt="Logo"
              fill={"layout"}
              objectFit="contain"
              draggable={false}
              priority={true}
            />
          </Link>
          <p className="-mt-4 font-basement text-white">
            Play Trivia, Win Crypto.
          </p>
        </div>

        <div className="container flex items-center justify-between px-6 py-8 text-white max-lg:flex-col max-lg:gap-20 lg:max-w-[1065px] lg:py-14">
          <div className="max-lg:text- w-full lg:w-[60%]">
            <h1 className="font-basement text-2xl font-bold md:text-3xl lg:text-4xl">
              PLAY LIVE TRIVIA GAMES
            </h1>
            <p className="mt-5 text-base font-normal lg:text-xl">
              Compete Against Other Players{" "}
            </p>
            <p className="mt-2 text-base font-semibold lg:text-xl">
              To Win The Pot!
            </p>
            <ul className="mt-4 flex list-disc flex-col gap-3 pl-5 text-base capitalize lg:text-xl">
              <li>
                Use{" "}
                <span className="font-semibold text-secondary">
                  any crypto token
                </span>{" "}
                to enter the game
              </li>
              <li>
                Win the game and
                <span className="font-semibold text-secondary">
                  {" "}
                  collect the pot
                </span>
              </li>
              <li>
                <span className="font-semibold text-secondary">
                  Paid in USDT
                </span>{" "}
                straight into your wallet
              </li>
            </ul>
            <div className="mt-16 flex flex-col gap-10 lg:mt-20">
              <div>
                <p className="text-base font-normal max-lg:text-center">
                  First Game Pot Size
                </p>{" "}
                <h1 className="mt-2 font-basement text-xl font-bold max-lg:text-center md:text-2xl">
                  1,000 USDT
                </h1>
              </div>
              <div className="klaviyo-form-S9y8UP"></div>
            </div>
          </div>
          <div className="flex h-max w-full items-center justify-center lg:w-1/2 lg:justify-end">
            <Image
              src={iphone}
              alt="iphone"
              priority={true}
              className="max-w-80"
            />
          </div>
        </div>

        <div className="container flex flex-col items-center justify-center px-6 py-14 text-center text-white">
          <h1 className="font-basement text-xl font-bold md:text-2xl lg:text-3xl">
            JOIN THE RAFFLE
          </h1>
          <p className="mt-5 font-basement text-xl font-semibold lg:text-2xl">
            <span className="text-secondary"> $1,000 USD</span> in Prizes
          </p>
        </div>

        <div className="container flex flex-col items-center justify-center px-6 pb-14 pt-10 text-white">
          <div className="flex w-full justify-between gap-5 rounded-[20px] bg-primary-300 px-5 py-8 max-md:flex-col md:items-center md:py-16 lg:gap-10 lg:px-10">
            <div>
              <h3 className="font-basement text-lg font-semibold lg:text-xl">
                1. Join the Waitlist
              </h3>
              {/* <p className="text-grey-100 mt-2">
                Post about Brainz on Twitter, Insta or Tiktok
              </p> */}
            </div>
            <div className="w-[1px] bg-grey-250 md:h-28"></div>
            <div>
              <h3 className="font-basement text-lg font-semibold lg:text-xl">
                2. Re-share our Post
              </h3>
              <p className="mt-2 text-grey-100">
                On{" "}
                <Link
                  href={
                    "https://x.com/playbrainz/status/1805621828984926418?s=48&t=7Op3EQmNa6RTyJkkvVkmtw"
                  }
                  target="_blank"
                  className="text-secondary underline"
                >
                  Twitter
                </Link>
                , On{" "}
                <Link
                  href={
                    "https://www.instagram.com/p/C8pLzu0tri7/?igsh=MXIxNms1eTNlY2dsbA=="
                  }
                  target="_blank"
                  className="text-secondary underline"
                >
                  Instagram
                </Link>
              </p>
            </div>
            <div className="w-[1px] bg-grey-250 md:h-28"></div>
            <div>
              <h3 className="font-basement text-lg font-semibold lg:text-xl">
                3. Create your Own Post
              </h3>
              <p className="mt-2 text-grey-100">
                Post on Twitter or Insta and tag @PlayBrainz
              </p>
              <p className="mt-2 text-secondary">
                This is how we’ll pick the winner for the 500 USDT!
              </p>
            </div>
          </div>
        </div>

        <div className="container flex flex-col items-center justify-center px-6 pt-6 text-center lg:pt-12">
          <h1 className="font-basement text-3xl font-bold text-white md:text-4xl">
            THE PRIZES
          </h1>
          <p className="mt-4 max-w-lg text-sm font-normal uppercase text-grey-100 lg:tracking-[3.2px]">
            Winners are announced before our first game on JULY 2 AT 2PM ET/ 8PM
            CET
          </p>

          <div className="relative -bottom-14 mt-5 grid w-full grid-cols-[repeat(auto-fit,minmax(300px,1fr))] justify-center gap-8 pb-14">
            {winBoxData.map((item, index) => (
              <WinBox
                key={index}
                imageSrc={item.imageSrc}
                title={item.title}
                height={"h-full"}
                imageBg={item.imageBg}
              />
            ))}
          </div>
          <p className="mt-10 text-sm font-normal uppercase text-grey-100 lg:tracking-[3.2px]">
            We reserve the right to close or ban, temporarily or permanently,
            any user&apos;s account as we deem fraudulent, or any user who
            violates these terms and conditions.
          </p>
          <div className="mt-10 h-[1px] w-full bg-secondary"></div>
        </div>
      </div>

      <div className="relative w-full overflow-hidden pb-28 pt-14">
        <div className="container relative z-10 mx-auto flex flex-col items-center justify-center px-6 text-white lg:max-w-[1065px]">
          <h1 className="text-center font-basement text-xl font-bold text-white md:text-2xl">
            UPCOMING GAME
          </h1>
          <div className="mt-10 flex w-full items-center gap-16 max-lg:flex-col">
            <div className="flex w-full max-lg:justify-center lg:w-1/2">
              <div className="relative w-full max-w-sm rounded-lg border bg-primary px-6 pb-16 pt-10 shadow-glow">
                <div className="relative z-10">
                  <h1 className="text-center font-basement text-lg font-bold text-white md:text-xl">
                    PLAY TRIVIA, WIN CRYPTO
                  </h1>
                  <p className="mt-2 text-center font-basement text-sm font-bold text-white">
                    JULY 2 AT 2PM ET/ 8PM CET
                  </p>
                  <div className="mt-12 space-y-2 pb-5 font-basement text-sm">
                    <p className="px-4 text-white">Crypto 101</p>
                    <p className="w-max rounded-md border border-secondary bg-[linear-gradient(91deg,_rgba(223,_200,_11,_0.30)_-0.05%,_#2F2A00_99.66%)] px-4 py-0.5 font-bold text-secondary">
                      The Everything Quiz
                    </p>
                    {/* <p className=" text-white px-4 ">Crypto Tokens</p> */}
                  </div>
                  <p className="mt-10 px-4 text-white">Prize Reward</p>
                  <h1 className="mt-1 w-max rounded-full border border-secondary px-4 py-0.5 font-basement text-lg font-bold text-white md:text-xl">
                    1,000 USDT
                  </h1>
                </div>
                <Image
                  src={robot}
                  alt="robot"
                  priority={true}
                  className="absolute -right-[15%] bottom-0 h-[70%] object-contain"
                />
                <Image
                  src={logo}
                  alt="brainz"
                  priority={true}
                  className="absolute bottom-2 right-2 w-10 object-contain"
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center lg:w-1/2">
              <h1 className="text-center font-basement text-lg text-white md:text-xl">
                STARTING IN
              </h1>{" "}
              <div className="mt-6 flex items-center gap-3">
                {timeLeft.days && (
                  <>
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary font-basement text-xl font-bold text-[#000000]">
                      {String(timeLeft.days).padStart(2, "0")}d
                    </div>
                    <span className="font-basement text-4xl font-bold">:</span>
                  </>
                )}
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary font-basement text-xl font-bold text-[#000000]">
                  {String(timeLeft.hours).padStart(2, "0")}h
                </div>
                <span className="font-basement text-4xl font-bold">:</span>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary font-basement text-xl font-bold text-[#000000]">
                  {String(timeLeft.minutes).padStart(2, "0")}m
                </div>{" "}
                <span className="font-basement text-4xl font-bold">:</span>
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary font-basement text-xl font-bold text-[#000000]">
                  {String(timeLeft.seconds).padStart(2, "0")}s
                </div>
              </div>
              <p className="mt-10 px-4 text-white">Prize Rewards</p>
              <h1 className="mt-1 font-basement text-xl font-bold text-white md:text-2xl">
                1,000 USDT
              </h1>
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 -z-10 h-full max-h-full overflow-hidden">
          <WaveAnimation height={900} />
        </div>
      </div>
      <div className="m-2 border-t border-grey-250">
        <Footer />
      </div>
    </div>
  )
}
