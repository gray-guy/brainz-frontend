import Image from "next/image"
import { LeaderTable } from "./leader-table"
import { RankCard } from "./rank-card"

export default function Page() {
  return (
    <div>
      <div className="mx-auto mb-16 mt-20 max-w-[1100px]">
        <div className="mb-14 grid grid-cols-2 gap-7">
          <RankCard />
          <RankCard />
        </div>
        <h1 className="mb-10 text-center font-basement text-3xl font-bold text-secondary">
          SESSION RANKINGS
        </h1>
        <LeaderTable />
      </div>
      <Footer />
    </div>
  )
}

const Footer = () => {
  return (
    <div className="bg-[#03131E] p-10 pb-20 text-white flex flex-col md:flex-row justify-between md:items-center gap-4">
      <div>
        <Image
          src="/images/logo-footer.svg"
          alt="Logo"
          width={136}
          height={73}
        />
        <div className="mt-3 space-y-3 max-w-[500px]">
          <p>
            Discover Brainz, the exciting platform that blends your love for
            trivia with the thrill of winning cryptocurrency. Simply join,
            choose from a variety of quizzes, and put your knowledge to the
            test. Each correct answer brings you closer to earning real crypto
            rewards.
          </p>
          <p>
            Track your progress on real-time leaderboards and compete with
            players worldwide. With secure transactions and seamless withdrawal
            options, Brainz makes it easy to convert your quiz success into
            valuable digital currency. Start answering questions, winning
            crypto, and enjoying the best of both worlds today!
          </p>
        </div>
      </div>


      <div className=" flex gap-6 xl:gap-10">
        <div>
          <h3 className="mb-4 font-basement text-xl font-bold capitalize">
            Platform
          </h3>
          <div className="flex flex-col gap-2">
            <span>Support</span>
            <span>FAQ</span>
            <span>Partnership Program</span>
            <span>Blog</span>
            <span>Help Center</span>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-basement text-xl font-bold capitalize">
            About us
          </h3>
          <div className="flex flex-col gap-2">
            <span>AML Policy</span>
            <span>Sports Policy</span>
            <span>Responsible Gaming</span>
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </div>
        </div>
        <div>
          <h3 className="mb-4 font-basement text-xl font-bold capitalize">
            Community
          </h3>
          <div className="flex flex-col gap-2">
            <span>Facebook</span>

            <span>Twitter</span>

            <span>Instgram</span>
            <span>Discord</span>
          </div>
        </div>
      </div>
    </div>
  )
}
