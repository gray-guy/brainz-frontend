import Image from "next/image"
import { Dialog, Transition } from "@headlessui/react"
import React, { forwardRef, Fragment, useEffect, useRef, useState } from "react"
import {
  InfoIcon,
  ModalCrossIcon,
  QuestionIcon,
  TicketIcon,
  XpIcon,
} from "./Svgs"
import { usePrivy, useLogin } from "@privy-io/react-auth"
import { motion } from "framer-motion"
import { OptionSelect } from "./OptionSelect"
import { cn } from "@/lib/utils"
import { PointConfetti } from "./PointConfetti"

const WelcomeModal = ({ showModal, onboardQuiz, setShowModal }) => {
  const { ready, authenticated, user } = usePrivy()
  // TODO: map num values to words
  const [stage, setStage] = useState(0)
  const { login } = useLogin()

  const isPrizeStage = stage === 1 || stage === 3

  if (user || !showModal || onboardQuiz?.length < 2) return null

  // const disableLogin = !ready || (ready && authenticated)
  const handleAuth = () => {
    setShowModal(false)
    login()
  }

  const handleQuestionSubmit = () => {
    setTimeout(() => setStage(1), 2500)
  }
  const handleRewardsClick = () => setStage(3)
  const onComplete = () => {
    setStage((prev) => prev + 1)
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
              <Dialog.Panel
                className={cn(
                  "relative w-full max-w-[450px] overflow-hidden rounded-[20px] border border-secondary p-4 transition-all md:mx-0 md:max-w-[800px] lg:max-w-[1104px]",
                  isPrizeStage
                    ? "bg-[#0F233C]"
                    : "bg-gradient-dialog backdrop-blur-sm"
                )}
              >
                {stage === 0 && (
                  <QuestionStep
                    onSubmit={handleQuestionSubmit}
                    onboardQuiz={onboardQuiz}
                    handleAuth={handleAuth}
                  />
                )}
                {stage === 1 && (
                  <PrizeShow prize="ticket" onComplete={onComplete} />
                )}
                {stage === 2 && (
                  <motion.div animate={{ y: ["50%", 0], opacity: [0, 100] }} transition={{duration: 0.4}}>
                    <RewardStep onRewardsClick={handleRewardsClick} />
                  </motion.div>
                )}
                {stage === 3 && (
                  <PrizeShow prize="xp" onComplete={onComplete} />
                )}
                {stage === 4 && (
                  <motion.div animate={{ y: ["50%", 0], opacity: [0, 100] }}>
                    <ResultStep onLoginClick={handleAuth} />
                  </motion.div>
                )}
                {(stage === 0 || stage === 4) && (
                  <button
                    className="absolute right-5 top-5 inline-block cursor-pointer bg-[#2B506A] p-2 hover:text-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    <ModalCrossIcon width="16" height="16" />
                  </button>
                )}
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
Question.displayName = "Question"

const PrizeShow = ({ className, prize, onComplete }) => {
  const isTicket = prize === "ticket"
  return (
    <div className={cn(className, "min-h-[560px]")}>
      <motion.div
        animate={{ y: [90, 0] }}
        transition={{ delay: 0.1 }}
        className="relative z-20 mt-12 font-basement font-bold md:mt-16"
      >
        <h3 className="mb-1 text-center font-basement text-2xl">
          Congratulations!
        </h3>
        <h2 className="text-center text-xl font-bold md:text-4xl">
          You won
          <span className="text-secondary">
            {isTicket ? " 1 Ticket " : " 300 XP "}
          </span>
          !
        </h2>
      </motion.div>
      <PointConfetti
        tweenDuration={1500}
        initialVelocityX={5}
        onConfettiComplete={onComplete}
        gravity={0.1}
        recycle={false}
      />
      <motion.div
        animate={{
          opacity: [0.4, 0.8, 1, 1],
          scale: [0.8, 1.25, 1],
        }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10 mx-auto mb-4 mt-7 flex h-[348px] w-[448px] items-center justify-center"
      >
        {isTicket ? (
          <>
            <GlowSvg className="absolute left-1/2 top-1/2 w-[200%] translate-x-[-50%] translate-y-[-50%]" />
            <Image
              className="relative z-20"
              src={"/images/ticket-prize.png"}
              width={320}
              height={235}
              alt="prize"
            />
          </>
        ) : (
          <>
            <GlowSvg className="absolute left-1/2 top-1/2 w-[200%] translate-x-[-50%] translate-y-[-50%]" />
            <Image
              className="relative z-20"
              src={"/images/xpnce-prize.png"}
              width={384}
              height={277}
              alt="prize"
            />
          </>
        )}
      </motion.div>
    </div>
  )
}

const GlowSvg = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1056"
      height="956"
      fill="none"
      className={className}
      viewBox="0 0 1056 956"
    >
      <g filter="url(#filter0_f_5820_11693)">
        <path fill="#1D82BC" d="M304 304H752V652H304z"></path>
      </g>
      <defs>
        <filter
          id="filter0_f_5820_11693"
          width="1056"
          height="956"
          x="0"
          y="0"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
          <feBlend
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          ></feBlend>
          <feGaussianBlur
            result="effect1_foregroundBlur_5820_11693"
            stdDeviation="152"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
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
            className="absolute left-0 top-0 h-full w-full animate-slowSpin"
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
      <div className="group relative mx-auto mb-8 mt-10 max-w-[800px] cursor-pointer justify-between rounded-[6px] bg-secondary p-4 text-[#000] transition-all duration-500 ease-in-out hover:bg-primary hover:text-white md:mb-14 md:mt-16 md:flex md:p-8 lg:hover:scale-105">
        <button className="absolute inset-0" onClick={onLoginClick} />
        <p className="text-center font-basement text-lg font-bold md:text-3xl">
          Claim your rewards
        </p>
        <div className="mt-3 flex items-center justify-center gap-7 md:mt-0">
          <div className="flex items-center gap-3">
            <div className="text-black flex size-[42px] items-center justify-center rounded-full bg-[#8B7E11]/60 font-basement font-bold text-[#3F3908] group-hover:bg-[#EFB832]/20 group-hover:text-secondary">
              <XpIcon className="group-hover:[&_.xp-text]:fill-[#9A8C1B]" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">300</p>
              <p>Xp</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full bg-danger-100/20 p-2">
              <TicketIcon
                width="26"
                height="26"
                className="text-black text-danger-100"
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
    <p className="px-[30px] py-3 text-center md:py-[21px]">{text}</p>
  </div>
)

export default WelcomeModal
