import Image from "next/image"
import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment, use, useEffect, useState } from "react"
import { InfoIcon, ModalCrossIcon, QuestionIcon, TicketIcon } from "./Svgs"
import Slider from "react-slick"
import { Button } from "./Button"
import { usePrivy, useLogin } from "@privy-io/react-auth"
import { OptionSelect } from "./OptionSelect"
import { cn } from "@/lib/utils"

const WelcomeModal = ({ showModal, setShowModal }) => {
  const { ready, authenticated, user } = usePrivy()
  // TODO: map num values to words
  const [rewardsClicked, setRewardsClicked] = useState(false)
  const [stage, setStage] = useState(0)
  const { login } = useLogin()

  // if (user || !showModal) return null

  const disableLogin = !ready || (ready && authenticated)
  const handleAuth = () => {
    setShowModal(false)
    login()
  }

  const onAfterEnter = () => {
    setTimeout(() => {
      setStage((prev) => prev + 1)
    }, 2000)
  }

  function handleQuestionSubmit() {
    setTimeout(() => setStage(1), 1000)
  }

  function handleRewardsClick() {
    setRewardsClicked(true)
    setStage(3)
  }

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
              <Dialog.Panel className="relative w-full max-w-[450px] overflow-hidden rounded-[20px] border border-secondary bg-gradient-dialog p-4 backdrop-blur-sm transition-all md:mx-0 md:max-w-[800px] lg:max-w-[1104px]">
                {stage === 0 && (
                  <QuestionStep onSubmit={handleQuestionSubmit} />
                )}
                <TransitionNext show={stage === 1} onAfterEnter={onAfterEnter}>
                  <PrizeShow prize="ticket" />
                </TransitionNext>
                <TransitionNext show={stage === 2}>
                  <RewardStep onRewardsClick={handleRewardsClick} />
                </TransitionNext>
                <TransitionNext show={stage === 3} onAfterEnter={onAfterEnter}>
                  <PrizeShow prize="xperience" />
                </TransitionNext>
                <TransitionNext show={stage === 4}>
                  <ResultStep />
                </TransitionNext>

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

const TransitionNext = ({ show, children, onAfterEnter, onAfterLeave }) => (
  <Transition
    show={show}
    enter="duration-300"
    enterFrom="opacity-0 translate-y-1/2"
    enterTo="opacity-100 translate-y-0"
    leave="duration-200"
    leaveFrom="opacity-100 translate-y-0"
    leaveTo="opacity-0 -translate-y-1/2"
    afterEnter={onAfterEnter}
    afterLeave={onAfterLeave}
  >
    {children}
  </Transition>
)

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

const QuestionStep = ({ onSubmit }) => {
  const [selectIdx, setSelectIdx] = useState(-1)
  const answerIdx = 2

  const handleSelect = (idx) => {
    setSelectIdx(idx)
    onSubmit(idx)
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

const PrizeShow = ({ className, prize }) => {
  const isTicket = prize === "ticket"
  return (
    <div className={className}>
      <h2 className="mt-12 text-center font-basement text-lg font-bold md:mt-16 md:text-3xl">
        Congratulations! <br />
        You won
        <span className="text-secondary">
          {isTicket ? " 1 Ticket " : " 300 XP "}
        </span>
        !
      </h2>
      <div className="relative -left-[42%] -top-[90px] translate-x-1/2 md:-left-[38%] md:-mb-[75px] lg:-left-[25%]">
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

const RewardStep = ({ onRewardsClick }) => {
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

      <div className="mx-auto mb-16 mt-5 flex max-w-[700px] items-center justify-between">
        <p className="text-center font-basement text-lg font-bold md:text-3xl">
          Click on the Box to <br />{" "}
          <span className="text-secondary">Claim Your Rewards</span>
        </p>
        <button
          className="group relative flex h-[187px] w-[187px] items-center justify-center"
          onClick={onRewardsClick}
        >
          <img
            className="absolute left-0 top-0 h-full w-full"
            src={"/images/gift-box-bg.png"}
            alt="gift box"
          />
          <img
            className="animate-slowSpin absolute left-0 top-0 h-full w-full"
            src={"/images/gold-ring.png"}
            alt="gift box"
          />
          <img
            className="relative transition-transform group-hover:scale-110"
            width={87}
            height={89}
            src={"/images/gift-box.png"}
            alt="gift box"
          />
        </button>
      </div>
    </>
  )
}

const ResultStep = () => {
  return (
    <>
      <CommonHeader />
      <div className="group mx-auto mb-14 mt-16 max-w-[800px] cursor-pointer justify-between rounded-[6px] bg-secondary p-4 text-[#000] transition-colors hover:bg-primary hover:text-white md:flex md:p-8">
        <p className="text-center font-basement text-lg font-bold md:text-3xl">
          Claim your rewards
        </p>
        <div className="mt-3 flex items-center justify-center gap-7 md:mt-0">
          <div className="flex items-center gap-3">
            <div className="flex size-[42px] items-center justify-center rounded-full bg-[#C3932F] font-basement font-bold text-secondary group-hover:bg-[#EFB832]/20">
              Xp
            </div>
            <div>
              <p className="text-xl font-bold leading-none">300</p>
              <p>Xp</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full bg-danger-100/20 p-2">
              <TicketIcon width="26" height="26" className="text-danger-100" />
            </div>
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
