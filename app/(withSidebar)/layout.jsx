import { Sidebar } from "@/app/components/Sidebar"
import Header from "@/app/components/Header"
import { SkeletonTheme } from "react-loading-skeleton"
import { Footer } from "../components/Footer"

export default function RootLayout({ children }) {
  return (
    <SkeletonTheme baseColor="#5a646b" highlightColor="#858f96">
      <div className="relative">
        <div className="mx-auto flex p-0 md:pr-8">
          <Sidebar />
          <div className="w-full md:w-[calc(100%-243px)] md:border-l-4 md:border-primary-350 md:pl-8">
            <Header />
            <main className="mt-0">{children}</main>
            <div className="md:-mx-8 mt-7">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  )
}
