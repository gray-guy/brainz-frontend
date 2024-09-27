import Image from "next/image"
import { Dialog, Transition } from "@headlessui/react"
import React, { forwardRef, Fragment, useEffect, useRef, useState } from "react"
import { InfoIcon, ModalCrossIcon, QuestionIcon, TicketIcon } from "./Svgs"
import { usePrivy, useLogin } from "@privy-io/react-auth"
import { OptionSelect } from "./OptionSelect"
import { cn } from "@/lib/utils"

const WelcomeModal = ({ showModal, onboardQuiz, setShowModal }) => {
  const { ready, authenticated, user } = usePrivy()
  // TODO: map num values to words
  const [stage, setStage] = useState(0)
  const { login } = useLogin()

  if (user || !showModal || onboardQuiz?.length < 2) return null

  // const disableLogin = !ready || (ready && authenticated)
  const handleAuth = () => {
    setShowModal(false)
    login()
  }

  const onAfterEnter = () => {
    setTimeout(() => {
      setStage((prev) => prev + 1)
    }, 3000)
  }

  const handleQuestionSubmit = () => {
    setTimeout(() => setStage(1), 1500)
  }
  const handleRewardsClick = () => setStage(3)

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
          <Dialog.Backdrop className="bg-gradient-backdrop fixed inset-0 z-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 z-[51] overflow-y-auto text-white">
          <div className="flex min-h-full items-center justify-center p-2 md:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-gradient-dialog relative w-full max-w-[450px] overflow-hidden rounded-[20px] border border-secondary p-4 backdrop-blur-sm transition-all md:mx-0 md:max-w-[800px] lg:max-w-[1104px]">
                {stage === 0 && (
                  <QuestionStep
                    onSubmit={handleQuestionSubmit}
                    onboardQuiz={onboardQuiz}
                    handleAuth={handleAuth}
                  />
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
                  <ResultStep onLoginClick={handleAuth} />
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
    enter="duration-500 ease-in-out"
    enterFrom="opacity-0 translate-y-1/2"
    enterTo="opacity-100 translate-y-0"
    leave="duration-300"
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
        "mt-12 text-center font-basement text-lg font-bold md:mt-20 md:text-3xl",
        className
      )}
    >
      Flex Your <span className="text-secondary">Skills</span>,{" "}
      <span className="text-secondary">Stack</span> Prizes!
    </h2>
    <p className="mb-7 text-center text-sm md:mb-10 md:text-base">
      Join our Live Trivia Games and Quests to play skill games and win prizes
    </p>
  </>
)

const QuestionStep = ({ onSubmit, onboardQuiz, handleAuth }) => {
  const [selectIdx, setSelectIdx] = useState(-1)
  const [questionIdx, setQuestionIdx] = useState(0)
  const question1Ref = useRef()
  const question2Ref = useRef()

  const handleSelect = (idx, isCorrect) => {
    setSelectIdx(idx)
    if (!isCorrect && questionIdx === 0) {
      setTimeout(() => {
        setQuestionIdx(1)
        setSelectIdx(-1)

        question1Ref.current.style.transform = "translateX(calc(-100% - 16px))"
        question2Ref.current.style.transform = "translateX(calc(-100% - 16px))"
      }, 1500)
    } else {
      onSubmit(idx)
    }
  }

  return (
    <>
      <CommonHeader />
      <div className="lg:px-14">
        <div className="grid auto-cols-[100%] grid-flow-col gap-4 overflow-hidden transition-transform">
          <Question
            ref={question1Ref}
            quizData={onboardQuiz[0]}
            selectIdx={selectIdx}
            handleSelect={handleSelect}
          />
          <Question
            ref={question2Ref}
            quizData={onboardQuiz[1]}
            selectIdx={selectIdx}
            handleSelect={handleSelect}
          />
        </div>
        <p className="mt-3 flex gap-3 rounded-[6px] bg-secondary/15 px-3 py-5 text-sm md:mt-4">
          <InfoIcon className="text-secondary" />
          <span>
            Your prize is waiting! Take the trivia challenge to claim it!
          </span>
        </p>
      </div>

      <div className="mb-5 mt-7 flex justify-center md:mb-10 md:mt-14">
        <button className="text-center text-sm" onClick={handleAuth}>
          Skip to <span className="text-secondary">Login / Sign Up</span>
        </button>
      </div>
    </>
  )
}

const Question = forwardRef(({ quizData, selectIdx, handleSelect }, ref) => {
  const letters = ["A", "B", "C", "D"]

  const isAnswerSelected = selectIdx !== -1
  const answerIdx = quizData.correctAnswer - 1

  const getVariant = (idx) => {
    if (!isAnswerSelected || idx !== selectIdx) return "default"
    return idx === answerIdx ? "success" : "danger"
  }

  return (
    <div ref={ref} className="transition-transform duration-300 ease-in-out">
      <p className="flex items-center gap-3">
        <QuestionIcon />
        <span className="font-medium lg:text-xl">{quizData.question}</span>
      </p>
      <div className="mt-3 space-y-1 md:mt-4 md:space-y-3">
        {quizData.answers.map((answerDesc, idx) => (
          <div
            key={answerDesc}
            className="cursor-pointer"
            onClick={() => handleSelect(idx, idx === answerIdx)}
          >
            <OptionSelect
              key={letters[idx]}
              classes={{
                root: "font-inter rounded-[10px] ",
              }}
              alphabet={letters[idx]}
              description={answerDesc}
              isActive={selectIdx === idx}
              variant={getVariant(idx)}
              answer={isAnswerSelected}
            />
          </div>
        ))}
      </div>
    </div>
  )
})

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
      <div className="relative -left-[42%] -top-6 translate-x-1/2 md:-left-[38%] md:-top-[90px] md:-mb-[75px] lg:-left-[25%]">
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

      <div className="mt-14 grid touch-pan-x grid-flow-col gap-2 max-md:auto-cols-[280px] max-md:overflow-x-auto md:items-center md:justify-center md:gap-4">
        <OnboardCard
          image="/images/onboard-reward-1.png"
          text="Win USDT Prizes through Live Games & Quests"
        />
        <OnboardCard
          image="/images/onboard-reward-2.png"
          text="Participate in challenges and games to gather tickets."
          className="md:mb-32"
        />
        <OnboardCard
          image="/images/onboard-reward-3.png"
          text="Complete quests to collect exciting diamonds prizes."
        />
      </div>

      <div className="mx-auto mb-10 mt-8 flex max-w-[700px] flex-col items-center justify-between md:mb-16 md:mt-5 md:flex-row">
        <p className="mb-4 text-center font-basement text-lg font-bold md:mb-0 md:text-3xl">
          Click on the Box to <br />{" "}
          <span className="text-secondary">Claim Your Rewards</span>
        </p>
        <button
          className="group relative flex size-[120px] items-center justify-center md:size-[187px]"
          onClick={onRewardsClick}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="absolute left-0 top-0 h-full w-full"
            src={"/images/gift-box-bg.png"}
            alt="gift box"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="animate-slowSpin absolute left-0 top-0 h-full w-full"
            src={"/images/gold-ring.png"}
            alt="gift box"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="relative scale-[0.6] transition-transform duration-300 ease-in-out group-hover:scale-[0.7] md:scale-100 md:group-hover:scale-110"
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

const ResultStep = ({ onLoginClick }) => {
  return (
    <>
      <CommonHeader />
      <div className="group mx-auto mb-8 mt-10 max-w-[800px] cursor-pointer justify-between rounded-[6px] bg-secondary p-4 text-[#000] transition-all duration-500 ease-in-out hover:scale-105 hover:bg-primary hover:text-white md:mb-14 md:mt-16 md:flex md:p-8">
        <p className="text-center font-basement text-lg font-bold md:text-3xl">
          Claim your rewards
        </p>
        <div
          onClick={onLoginClick}
          className="mt-3 flex items-center justify-center gap-7 md:mt-0"
        >
          <div className="flex items-center gap-3">
            <div className="text-black flex size-[42px] items-center justify-center rounded-full bg-gray-100/30 font-basement font-bold group-hover:bg-[#EFB832]/20 group-hover:text-secondary">
              Xp
            </div>
            <div>
              <p className="text-xl font-bold leading-none">300</p>
              <p>Xp</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full bg-gray-100/30 p-2 group-hover:bg-danger-100/20">
              <TicketIcon
                width="26"
                height="26"
                className="text-black group-hover:text-danger-100"
              />
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
      "bg-gradient-onboard-card shadow-onboardCard max-w-[300px] rounded-[8px] border border-secondary-100 p-[10px]",
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
    <p className="px-[30px] py-3 text-center md:py-[21px]">{text}</p>
  </div>
)

export default WelcomeModal
