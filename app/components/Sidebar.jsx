"use client"
import Image from "next/image"
import Logo from "@/public/images/brainz-logo.svg"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { socialLinks } from "@/lib/config"
import { usePrivy } from "@privy-io/react-auth"
import { PromotionTasks } from "./PromotionTasks"

export const Sidebar = () => {
  const [activeLink, setActiveLink] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { authenticated } = usePrivy()

  const pathname = usePathname()

  const navLinks = useMemo(
    () => [
      { title: "Home", url: "/" },
      { title: "Shop", url: "/shop", isProtected: true },
      { title: "Profile", url: "/profile", isProtected: true },
      { title: "How to Play", url: "/htp/rules" },
    ],
    []
  )

  useEffect(() => {
    const active = navLinks.find((link) => link.url === pathname)
    if (active) setActiveLink(active.title)
  }, [pathname, navLinks])

  const disabledClass = "opacity-50 cursor-not-allowed pointer-events-none"

  return (
    <div className="sticky top-0 h-full w-[243px] px-5 max-md:hidden">
      <div className="flex h-screen flex-col justify-between">
        <div className="mt-4 px-3">
          <div className="flex justify-center">
            <Link href={"/"} className="relative text-white">
              <Image
                src={Logo}
                alt="Logo"
                width={115}
                height={62}
                objectFit="contain"
                draggable={false}
                priority={true}
              />
              <span className="font-basement absolute bottom-1 text-[12px] leading-[1.4] tracking-wider">
                Skill Games
              </span>
            </Link>
          </div>
          <div className="mt-6">
            <ul className="flex flex-col gap-6">
              {navLinks.map(
                ({ title, url, className, isProtected = false }, index) => (
                  <li
                    key={index}
                    className={`text-xl font-semibold hover:text-secondary ${
                      title === activeLink ? "text-secondary" : "text-white"
                    } ${className ?? ""} ${
                      isProtected && !authenticated ? disabledClass : ""
                    }`}
                  >
                    <Link href={url} className="font-basement font-bold">
                      {title}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
        <PromotionTasks />
        <div className="mt-[13%] pb-[5%] text-center">
          <div className="flex justify-center gap-4 border-white">
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
                  className={"cursor-pointer text-white group-hover:text-dark"}
                />
              </Link>
            ))}
          </div>
          <p className="mt-4 text-grey-100">Brainz © 2024</p>
        </div>
      </div>
    </div>
  )
}
