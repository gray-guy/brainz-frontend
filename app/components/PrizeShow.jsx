const lookup = {
  ticket: {
    name: "Ticket",
    imageProps: {
      src: "/images/ticket-prize.png",
      width: 320,
      height: 235,
    },
  },
  xp: {
    name: "XP",
    imageProps: {
      src: "/images/xpnce-prize.png",
      width: 384,
      height: 277,
    },
  },
}

export const PrizeShow = ({ className, amount, prize, onComplete }) => {
  const data = lookup[prize]

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
          You won{" "}
          <span className="text-secondary">
            {amount} {data.name}
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
        <TicketGlowSvg className="absolute left-1/2 top-1/2 w-[200%] translate-x-[-50%] translate-y-[-50%]" />
        <Image
          className="relative z-20"
          {...data.imageProps}
          alt="prize image"
        />
      </motion.div>
    </div>
  )
}

const TicketGlowSvg = ({ className }) => {
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
