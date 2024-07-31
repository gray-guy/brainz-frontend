"use client";
import { cn } from "@/lib/utils";
import { TabSwitch } from "../tab-switch";
import Image from "next/image";

export default function HTPPage() {
  return (
    <div>
      <TabSwitch activeId="htp" />
      <div className="mb-20">
        <ul className="text-2xl space-y-6 list-disc pl-7">
          <li>To enter a game you must use a Ticket.</li>
          <li>You can buy tickets using Credit Card or Crypto.</li>
        </ul>
      </div>
      <StepDivider stepNum={1} />
      <Step1 />
      <StepDivider stepNum={2} />
      <Step2 />
      <StepDivider stepNum={3} />
      <Step3 />
      <StepDivider stepNum={4} />
      <Step4 />
    </div>
  );
}

const Step1 = () => {
  return (
    <div className="mt-16 mb-20">
      <div className="flex justify-between mb-16">
        <h3 className="text-4xl font-bold mt-12 max-w-[320px]">
          <span className="text-secondary">Buying </span>
          Tickets
          <span className="inline-block mt-6">Using Crypto</span>
        </h3>
        <div className="mr-24">
          <Image
            width={277}
            height={305}
            alt="ticket card"
            src="/images/ticket-card.png"
          />
        </div>
      </div>
      <div className="text-2xlc">
        <p className="text-3xlc font-bold mb-7">
          If you are connected with an{" "}
          <span className="underline">email address</span>
        </p>
        <ol className="list-decimal pl-8 mb-8">
          <li>Go to “shop”(Link)</li>
          <li>Choose a pack and click Buy Now</li>
          <li>Select “Checkout with Crypto”</li>
          <li>Choose which crypto to pay with from the drop-down</li>
          <li>
            A unique QR code will be generated for you to send your crypto
          </li>
          <li>
            After a few minutes, you will get your tickets directly into your
            account
          </li>
        </ol>
        <p className="mb-8">
          <span className="text-secondary">IMPORTANT: </span>
          The QR code is a single-use address. Do not attempt to deposit funds
          to the same QR code more than once. You must generate a new QR code
          for each purchase.
        </p>
        <p className="text-3xlc font-bold mb-7">
          If you are connected with a <span className="underline">wallet</span>:
        </p>
        <ol className="list-decimal pl-8 mb-8">
          <li> Go to “shop”(Link)</li>
          <li> Choose a Pack and click Buy Now</li>
          <li> Select checkout with Crypto</li>
          <li> Confirm the transaction</li>
        </ol>
        <p className="mb-6">
          <span className="text-secondary">IMPORTANT: </span>
          To complete the transaction, you must have enough gas tokens to pay
          the transaction fee. Ensure you have sufficient gas tokens in your
          wallet
        </p>
      </div>
    </div>
  );
};

const Step2 = () => {
  return (
    <div className="mt-24">
      <h3 className="text-4xl font-bold mb-[34px]">
        <span className="text-secondary">Look For </span>
        Next Game
      </h3>
      <div className="flex items-start gap-6 justify-between">
        <div>
          <Image
            width={577}
            height={304}
            alt="live game card"
            src="/images/live-game.png"
          />
        </div>
        <div>
          <Image
            className="flex-shrink"
            width={312}
            height={458}
            alt="game start countdown"
            src="/images/countdown.png"
          />
        </div>
      </div>
    </div>
  );
};

const Step3 = () => {
  return (
    <div className="mt-16 mb-20">
      <h3 className="text-4xl font-bold mb-16">
        <span className="text-secondary">The Game </span>
        Play
      </h3>

      <div>
        <Image
          width={1448}
          height={915}
          alt="screenshot of game question"
          src="/images/game-play.png"
        />
      </div>
    </div>
  );
};

const Step4 = () => {
  return (
    <div className="mt-20 mb-4">
      <div className="flex justify-between items-center mb-8">
        <ul className="text-2xlc list-disc pl-7">
          <li>Win the Game, Collect the Pot</li>
          <li>Spin to Win a Bonus Prize</li>
        </ul>
        <h3 className="text-4xl font-bold">
          <span className="text-secondary">The{" "}</span>
          Reward
        </h3>
      </div>

      <div className="-ml-[61px] -mr-[67px]">
        <Image
          width={1080}
          height={941}
          alt="screenshot of game rewards"
          src="/images/game-reward.png"
        />
      </div>
    </div>
  );
};

const StepDivider = ({ stepNum }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-10 ",
        stepNum % 2 === 0 && "flex-row-reverse"
      )}
    >
      <p className="font-bold text-4xl text-nowrap">STEP {stepNum}</p>
      <div className="h-[3px] bg-secondary-100 w-full" />
    </div>
  );
};