import Loader from "@/app/components/Loader"

export default function RootLayout({ children }) {
  return (
    <div>
      <Loader />
      {children}
    </div>
  )
}
