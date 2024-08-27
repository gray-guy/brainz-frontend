"use client"

import { TicketCard } from "@/app/components/TicketCard"
import { gameData, ticketData } from "./data"
import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { apiCall } from "@/lib/utils"
import { DiamondIcon, TicketIcon } from "@/app/components/Svgs"

export const Shop = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [ticketPacks, setTicketPacks] = useState([])
  const [diamondPacks, setDiamondPacks] = useState([])
  const [bothPacks, setBothPacks] = useState([])

  useEffect(() => {
    const getShopItems = async () => {
      const packs = await apiCall("get", "/shop")
      // const packs = data.packs;
      const ticketPacks = packs.filter((pack) => pack.type === "ticket")
      const diamondPacks = packs.filter((pack) => pack.type === "diamond")
      const bothPacks = packs.filter((pack) => pack.type === "both")
      setBothPacks(bothPacks)
      setTicketPacks(ticketPacks)
      setDiamondPacks(diamondPacks)
      setIsLoading(false)
    }

    getShopItems()
  }, [])

  return (
    <div className="text-white">
      <div className="md:px-13 w-full rounded-[10px] bg-primary-350 px-6 py-8 md:pb-20">
        <h1 className="font-basement text-xl font-bold">
          Buy Tickets to enter a Session
        </h1>
        <div className="xs:grid-cols-1 mt-8 grid flex-wrap gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-14 xl:grid-cols-4">
          {isLoading
            ? [...Array(ticketData.length)].map((_, index) => (
                <Skeleton key={index} height={196} borderRadius={"1.5rem"} />
              ))
            : ticketPacks
                .toSorted((a, b) => a.price - b.price)
                .map((ticket, index) => <TicketCard key={index} {...ticket} />)}
        </div>
      </div>
      <div className="md:px-13 mb-0 mt-6 w-full rounded-[10px] bg-primary-350 px-6 py-8 md:mb-5">
        <h1 className="font-basement text-xl font-bold">
          Buy Diamonds to unlock in-game perks
        </h1>
        <div className="xs:grid-cols-1 mt-8 grid flex-wrap gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-14 xl:grid-cols-4">
          {isLoading
            ? [...Array(gameData.length)].map((_, index) => (
                <Skeleton key={index} height={196} borderRadius={"1.5rem"} />
              ))
            : diamondPacks
                .toSorted((a, b) => a.price - b.price)
                .map((diamond, index) => (
                  <TicketCard key={index} {...diamond} />
                ))}
        </div>
      </div>
      <div className="md:px-13 mb-0 mt-6 w-full rounded-[10px] bg-primary-350 px-6 py-8 md:mb-5">
        <h1 className="font-basement text-xl font-bold">Exclusive Packs</h1>
        <div className="xs:grid-cols-1 mt-8 grid flex-wrap gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-14 xl:grid-cols-4">
          {isLoading
            ? [...Array(gameData.length)].map((_, index) => (
                <Skeleton key={index} height={196} borderRadius={"1.5rem"} />
              ))
            : bothPacks
                .toSorted((a, b) => a.price - b.price)
                .map((diamond, index) => (
                  <TicketCard key={index} {...diamond} />
                ))}
        </div>
      </div>
    </div>
  )
}
