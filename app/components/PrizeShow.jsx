import Image from "next/image"
import { motion } from "framer-motion"
import { PointConfetti } from "./PointConfetti"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

const lookup = {
  ticket: {
    name: "Ticket",
    boxProps: {},
    imageProps: {
      src: "/images/ticket-prize.png",
      width: 320,
      height: 235,
      className: "max-md:w-[240px]",
    },
  },
  usdt: {
    name: "USDT",
    boxProps: {
      className: "h-[300px]",
    },
    imageProps: {
      src: "/images/usdt-coins.png",
      width: 410,
      height: 244,
      className: "max-md:w-[240px]",
    },
    shadow: (
      <UsdtShadow className="absolute -bottom-[10px] left-1/2 -translate-x-1/2" />
    ),
  },
  diamond: {
    name: "Diamond",
    boxProps: {
      className: "h-[383px]",
    },
    imageProps: {
      src: "/images/diamond-prize.png",
      width: 324,
      height: 261,
      className: "max-md:w-[240px]",
    },
    shadow: (
      <DiamondShadow className="absolute -bottom-[10px] left-1/2 -translate-x-1/2" />
    ),
  },
  xp: {
    name: "XP",
    boxProps: {
      className: "h-[295px]",
    },
    imageProps: {
      src: "/images/xp-coins.png",
      width: 368,
      height: 214,
      className: "max-md:w-[240px]",
    },
    shadow: (
      <XpShadow className="absolute -bottom-[10px] left-1/2 -translate-x-1/2" />
    ),
  },
}

export const PrizeShow = ({
  className,
  amount,
  prize,
  onComplete,
  onContinue,
}) => {
  const data = lookup[prize]

  return (
    <div className={cn(className, "min-h-[440px] md:min-h-[560px]")}>
      <motion.div
        animate={{ y: [90, 0] }}
        transition={{ delay: 0.1 }}
        className="relative z-20 mt-12 font-basement font-bold md:mt-16"
      >
        <h3 className="mb-1 text-center font-basement text-xl md:text-2xl">
          Congratulations!
        </h3>
        <h2 className="text-center text-2xl font-bold md:text-4xl">
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
        className={cn(
          "relative z-10 mx-auto mb-4 flex h-[348px] w-[448px] max-w-full items-center justify-center md:mt-7",
          data.boxProps.className
        )}
      >
        <GlowSvg className="absolute left-1/2 top-1/2 z-0 w-[200%] translate-x-[-50%] translate-y-[-50%]" />
        <Image
          style={{ position: "relative", zIndex: 20 }}
          // TODO: see why default className is not working
          className={cn("relative z-20", data.imageProps.className)}
          {...data.imageProps}
          alt="prize image"
        />
        {data.shadow}
      </motion.div>
      {onContinue && (
        <motion.div
          className="relative z-20 mt-10 flex justify-center md:mt-16"
          transition={{ delay: 0.4 }}
          animate={{ opacity: [0, 1] }}
        >
          <Button onClick={onContinue}>Continue</Button>
        </motion.div>
      )}
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

function UsdtShadow(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="416"
      height="103"
      fill="none"
      viewBox="0 0 416 103"
      {...props}
    >
      <g filter="url(#filter0_f_5832_4922)" opacity="0.4">
        <ellipse cx="208" cy="51.725" fill="#000" rx="174" ry="17"></ellipse>
      </g>
      <defs>
        <filter
          id="filter0_f_5832_4922"
          width="416"
          height="102"
          x="0"
          y="0.725"
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
            result="effect1_foregroundBlur_5832_4922"
            stdDeviation="17"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  )
}

function XpShadow(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="416"
      height="103"
      fill="none"
      {...props}
      viewBox="0 0 416 103"
    >
      <g filter="url(#filter0_f_5830_15934)" opacity="0.4">
        <ellipse cx="208" cy="51.725" fill="#000" rx="174" ry="17"></ellipse>
      </g>
      <defs>
        <filter
          id="filter0_f_5830_15934"
          width="416"
          height="102"
          x="0"
          y="0.725"
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
            result="effect1_foregroundBlur_5830_15934"
            stdDeviation="17"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  )
}

function DiamondShadow(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="306"
      height="102"
      fill="none"
      {...props}
      viewBox="0 0 306 102"
    >
      <g filter="url(#filter0_f_5832_4885)" opacity="0.4">
        <ellipse cx="153" cy="51" fill="#000" rx="119" ry="17"></ellipse>
      </g>
      <defs>
        <filter
          id="filter0_f_5832_4885"
          width="306"
          height="102"
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
            result="effect1_foregroundBlur_5832_4885"
            stdDeviation="17"
          ></feGaussianBlur>
        </filter>
      </defs>
    </svg>
  )
}
