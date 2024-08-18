import { SkeletonTheme } from "react-loading-skeleton"
import Loader from "@/app/components/Loader"

export default function RootLayout({ children }) {
  return (
    <SkeletonTheme baseColor="#5a646b" highlightColor="#858f96">
      <Loader />
      <div>
        {/* <SessionHeader /> */}
        {children}
      </div>
    </SkeletonTheme>
  )
}
