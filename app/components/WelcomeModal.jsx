import Image from "next/image"
import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment, use, useEffect, useState } from "react"
import { InfoIcon, ModalCrossIcon, QuestionIcon } from "./Svgs"
import Slider from "react-slick"
import { Button } from "./Button"
import { usePrivy, useLogin } from "@privy-io/react-auth"
import { OptionSelect } from "./OptionSelect"
import { cn } from "@/lib/utils"

const WelcomeModal = ({ showModal, setShowModal }) => {
  const { ready, authenticated, user } = usePrivy()
  // TODO: map num values to words
  const [stage, setStage] = useState(0)
  const { login } = useLogin()

  // if (user || !showModal) return null

  const disableLogin = !ready || (ready && authenticated)
  const handleAuth = () => {
    setShowModal(false)
    login()
  }

  const handleStage = (stage) => {
    setStage(stage)
  }

  const isPrizeScreen = stage === 1 || stage === 3

  // useEffect(() => {
  //   if (isPrizeScreen) {
  //     setTimeout(() => {
  //       setStage((prev) => prev + 1)
  //     }, 2000)
  //   }
  // }, [isPrizeScreen])

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative" onClose={() => setShowModal(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-gradient-backdrop backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-[51] overflow-y-auto text-white">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-[400px] overflow-hidden rounded-[20px] border border-secondary bg-gradient-dialog p-4 backdrop-blur-sm transition-all md:mx-0 md:max-w-[800px] lg:max-w-[1104px]">
                {stage === 0 && <QuestionStep handleStage={handleStage} />}
                {stage === 1 && <PrizeShow prize="ticket" />}
                {stage === 2 && <RewardStep handleStage={handleStage} />}
                {stage === 3 && <PrizeShow prize="xperience" />}
                {stage === 4 && <ResultStep />}

                <button
                  className="absolute right-5 top-5 inline-block cursor-pointer bg-[#2B506A] p-2 hover:text-secondary"
                  onClick={() => setShowModal(false)}
                >
                  <ModalCrossIcon width="16" height="16" />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

const CommonHeader = ({ className }) => (
  <>
    <h2
      className={cn(
        "mt-20 text-center font-basement text-lg font-bold md:text-3xl",
        className
      )}
    >
      Flex Your <span className="text-secondary">Skills</span>,{" "}
      <span className="text-secondary">Stack</span> Prizes!
    </h2>
    <p className="mb-10 text-center text-sm md:text-base">
      Join our Live Trivia Games and Quests to play skill games and win prizes
    </p>
  </>
)

const QuestionStep = ({ handleStage }) => {
  const [selectIdx, setSelectIdx] = useState(-1)
  const answerIdx = 2

  const handleSelect = (idx) => {
    setSelectIdx(idx)
    setTimeout(() => {
      handleStage(1)
    }, 1000)
  }

  const isAnswerSelected = selectIdx !== -1
  const getVariant = (idx) => {
    if (!isAnswerSelected || idx !== selectIdx) return "default"
    return idx === answerIdx ? "success" : "danger"
  }
  return (
    <>
      <CommonHeader />
      <div className="lg:px-14">
        <p className="mb-4 flex items-center gap-3">
          <QuestionIcon />
          <span className="font-medium lg:text-xl">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quae,
            ipsum.
          </span>
        </p>

        <div className="mb-5 space-y-3">
          {["A", "B", "C", "D"].map((letter, idx) => (
            <div className="cursor-pointer" onClick={() => handleSelect(idx)}>
              <OptionSelect
                key={letter}
                classes={{
                  root: "font-inter rounded-[10px] ",
                }}
                alphabet={letter}
                description="Lorem ipsum dolor sit amet, consectur."
                isActive={selectIdx === idx}
                variant={getVariant(idx)}
                answer={isAnswerSelected}
              />
            </div>
          ))}
        </div>
        <p className="flex gap-3 rounded-[6px] bg-secondary/15 px-3 py-5 text-sm">
          <InfoIcon className="text-secondary" />
          <span>
            Your prize is waiting! Take the trivia challenge to claim it!
          </span>
        </p>
      </div>

      <div className="mb-10 mt-14 text-center text-sm">
        Skip to <span className="text-secondary">Login / Sign Up</span>
      </div>
    </>
  )
}

const PrizeShow = ({ prize }) => {
  const isTicket = prize === "ticket"
  return (
    <div className="grid">
      <h2 className="mt-12 text-center font-basement text-lg font-bold md:mt-16 md:text-3xl">
        Congratulations! <br />
        You won
        <span className="text-secondary">
          {isTicket ? " 1 Ticket " : " 300 XP "}
        </span>
        !
      </h2>
      <div className="relative -left-[42%] -top-[18%] translate-x-1/2 md:-left-[38%] md:-mb-[75px] lg:-left-[25%]">
        <Image
          src={isTicket ? "/images/ticket-win.png" : "/images/xp-win.png"}
          width={714}
          height={622}
          alt="prize"
        />
      </div>
    </div>
  )
}

const RewardStep = ({ handleStage }) => {
  const handleClicked = () => {
    handleStage(3)
  }

  return (
    <>
      <CommonHeader />

      <div className="mt-14 flex items-center justify-center gap-4">
        <OnboardCard
          image="/images/onboard-reward-1.png"
          text="Win USDT Prizes through Live Games & Quests"
        />
        <OnboardCard
          image="/images/onboard-reward-2.png"
          text="Participate in challenges and games to gather tickets."
          className="mb-32"
        />
        <OnboardCard
          image="/images/onboard-reward-3.png"
          text="Complete quests to collect exciting diamonds prizes."
        />
      </div>

      <div className="mx-auto mb-20 mt-14 flex max-w-[700px] justify-between">
        <p className="text-center font-basement text-lg font-bold md:text-3xl">
          Click on the Box to <br />{" "}
          <span className="text-secondary">Claim Your Rewards</span>
        </p>
        <div onClick={handleClicked}>Box</div>
      </div>
    </>
  )
}

const ResultStep = () => {
  return (
    <>
      <CommonHeader />
      <div className="mx-auto mb-14 mt-8 flex max-w-[800px] cursor-pointer justify-between rounded-[6px] bg-secondary p-10 text-[#000] transition-colors hover:bg-primary hover:text-white">
        <p className="text-center font-basement text-lg font-bold md:text-3xl">
          Claim your rewards
        </p>
        <div className="flex items-center gap-7">
          <div className="flex items-center gap-3">
            <Image
              src="/images/usdc-logo.png"
              width={48}
              height={48}
              alt="Xp Icon"
            />
            <div>
              <p className="text-xl font-bold leading-none">300</p>
              <p>Xp</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Image
              src="/images/usdc-logo.png"
              width={48}
              height={48}
              alt="Xp Icon"
            />
            <div>
              <p className="text-xl font-bold leading-none">1</p>
              <p>Ticket</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const OnboardCard = ({ image, text, className }) => (
  <div
    className={cn(
      "max-w-[300px] rounded-[8px] border border-secondary-100 bg-gradient-onboard-card p-[10px] shadow-onboardCard",
      className
    )}
  >
    <Image
      className="mx-auto"
      src={image}
      width={275}
      height={189}
      alt="image with usdc logo "
    />
    <p className="px-[30px] py-[21px] text-center">{text}</p>
  </div>
)

export default WelcomeModal
