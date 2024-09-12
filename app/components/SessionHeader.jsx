import Image from "next/image"
import Link from "next/link"
import logo from "@/public/images/brainz-logo.svg"

export const SessionHeader = ({ title }) => {
  return (
    <div className="relative z-30 pb-[70px]">
      <div className="fixed top-0 flex w-full bg-primary-350 px-4 py-[17px] lg:px-12">
        <div className="border-primary-375 pr-1 lg:border-r-2 lg:pr-9">
          <Link href="/" className="flex w-full items-center relative min-w-24 text-white">
            <Image
              src={logo}
              alt="Logo"
              width={74}
              height={50}
              draggable={false}
              priority={true}
            />
              <span className="font-basement absolute bottom-0 text-[12px] leading-[1.4] tracking-wider">
                Skilled Games
              </span>
          </Link>
        </div>
        <div className="flex w-full items-center justify-center md:w-[calc(100%-142px)]">
          <h1 className="font-basement text-lg font-bold text-white lg:text-xl">
            {title}
          </h1>
        </div>
      </div>
    </div>
  )
}
