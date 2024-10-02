"use client"
import Image from "next/image"
import Logo from "@/public/images/brainz-logo.svg"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { socialLinks } from "@/lib/config"
import { usePrivy } from "@privy-io/react-auth"
import { PromotionTasks } from "./PromotionTasks"
import { cn } from "@/lib/utils"
import { HomeIcon, HtpIcon, ProfileIcon, ShopIcon } from "./Svgs"

export const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { authenticated } = usePrivy()

  const pathname = usePathname()

  const navLinks = useMemo(
    () => [
      { title: "Home", url: "/", icon: <HomeIcon /> },
      { title: "Shop", url: "/shop", isProtected: true, icon: <ShopIcon /> },
      {
        title: "Profile",
        url: "/profile",
        isProtected: true,
        icon: <ProfileIcon />,
      },
      { title: "How to Play", url: "/htp/rules", icon: <HtpIcon /> },
    ],
    []
  )

  useEffect(() => {
    const active = navLinks.find((link) => link.url === pathname)
    if (active) setActiveLink(active.title)
  }, [pathname, navLinks])

  const disabledClass = "opacity-50 cursor-not-allowed pointer-events-none"

  return (
    <div className="sticky top-0 h-screen w-[245px] pr-9 max-md:hidden">
      <div className=" ">
        {/* top link */}
        <div className="mt-6 flex justify-center">
          <Link href={"/"} className="relative text-white">
            <Image
              src={Logo}
              alt="Logo"
              width={91}
              height={53}
              objectFit="contain"
              draggable={false}
              priority={true}
            />
            <span className="absolute bottom-1 font-basement text-[12px] leading-[1.4] tracking-wider">
              Skill Games
            </span>
          </Link>
        </div>

        <div className="mt-10 px-3">
          <ul className="flex flex-col gap-5 text-white">
            {navLinks.map((link, index) => (
              <li key={index}>
                <SideLink
                  {...link}
                  isDisabled={link.isProtected && !authenticated}
                  isActive={activeLink === link.title}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <PromotionTasks />
      <div className="mt-auto">
        <button className="inline-flex h-12 min-w-[140px] items-center justify-center rounded-sm font-medium">
          Log Out
        </button>
        <button className="inline-flex h-12 min-w-[140px] items-center justify-center rounded-sm font-medium">
          Join Us
        </button>
      </div>
    </div>
  )
}

const SideLink = ({ icon, title, isDisabled, isActive, url }) => {
  return (
    <Link
      className={cn(
        "flex items-center gap-3 rounded-md p-[6px] text-lg font-medium transition-colors hover:text-secondary",
        isDisabled && "pointer-events-none cursor-not-allowed opacity-50",
        isActive &&
          "bg-secondary font-semibold text-primary-350 hover:text-primary"
      )}
      href={url}
    >
      {icon}
      <span>{title}</span>
    </Link>
  )
}
