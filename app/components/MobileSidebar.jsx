"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { usePrivy } from "@privy-io/react-auth"
import { DiamondIcon, TicketIcon } from "./Svgs"
import myProfile from "@/public/images/avatar.png"
import { socialLinks } from "@/lib/config"
import SelectDropdown from "./SelectDropdown"
import { useWallet } from "../contexts/WalletContext"
import { useUser } from "../contexts/UserContext"
import { formatNumber } from "@/lib/utils"
import { PromotionTasks } from "./PromotionTasks"

export const MobileSidebar = ({ onNavLinkClick }) => {
  const [activeLink, setActiveLink] = useState("")
  const { walletBalances } = useWallet()
  const { user } = useUser()

  const pathname = usePathname()

  const navLinks = useMemo(
    () => [
      { title: "Home", url: "/" },
      { title: "Shop", url: "/shop" },
      { title: "Profile", url: "/profile" },
      { title: "How to Play", url: "/htp/rules" },
    ],
    []
  )

  useEffect(() => {
    const active = navLinks.find((link) => link.url === pathname)
    if (active) setActiveLink(active.title)
  }, [pathname, navLinks])

  const handleLinkClick = () => {
    if (onNavLinkClick) {
      onNavLinkClick()
    }
  }

  const { ready, authenticated, logout } = usePrivy()
  // Disable logout when Privy is not ready or the user is not authenticated
  const disableLogout = !ready || (ready && !authenticated)

  const handleLogout = async () => {
    // remove token from localstorage
    localStorage.clear()
    await logout()
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex w-full justify-between gap-4 rounded-full bg-primary-350 px-2 py-2 lg:hidden">
          <div className="flex items-center">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-secondary object-cover">
              <Image
                src={myProfile}
                alt="Profile"
                layout="fill"
                className="rounded-full"
                objectFit="contain"
                draggable={false}
                priority={true}
              />
            </div>
            <p className="ml-2 font-basement text-base font-normal text-white">
              {user.username}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/shop">
              <div className="flex w-fit items-center gap-1 rounded-full bg-danger/25 px-[10px] py-[8px]">
                <TicketIcon
                  width={19}
                  height={19}
                  className={"text-danger-100"}
                />
                <h1 className="font-basement text-sm font-bold text-white">
                  {user.tickets}
                </h1>
              </div>
            </Link>
            <Link href="/shop">
              <div className="flex w-fit items-center gap-1 rounded-full bg-[#58FF69]/25 px-[10px] py-[8px]">
                <DiamondIcon
                  width={19}
                  height={19}
                  className={"text-[#58FF69]"}
                />
                <h1 className="font-basement text-sm font-bold text-white">
                  {user.diamonds}
                </h1>
              </div>
            </Link>
          </div>
        </div>
        <div className="mt-6">
          {walletBalances.length > 0 && (
            <SelectDropdown options={walletBalances} />
          )}
        </div>
      </div>
      {/* nav links */}
      <ul className="mt-8 flex flex-col items-center justify-center gap-5 text-center">
        {navLinks.map(({ title, url }, index) => (
          <li
            key={index}
            className={`w-fit ${
              title === activeLink ? "text-secondary" : "text-white"
            }`}
          >
            <Link
              href={url}
              className="font-basement text-3xl font-bold hover:text-secondary"
              onClick={handleLinkClick}
            >
              {title}
            </Link>
          </li>
        ))}
        <li>
          <button
            className="font-basement text-3xl font-bold text-white hover:text-secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
      <div className="mt-8 w-full gap-2 bg-primary px-3 pb-6">
        <div>
          <div className="flex justify-center">
            <PromotionTasks />
          </div>
          <div className="mt-9 text-center">
            <div className="flex justify-center gap-5 border-white">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.url}
                  target="_blank"
                  className="group flex h-[38px] w-[36px] items-center justify-center rounded-[4px] bg-primary-350 py-[8px] transition-colors duration-200 hover:bg-secondary"
                >
                  <link.icon
                    width={21}
                    height={23}
                    className={
                      "cursor-pointer text-white group-hover:text-dark"
                    }
                  />
                </Link>
              ))}
            </div>
            <p className="mt-4 text-grey-100">
              Brainz © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
