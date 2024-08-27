export default function Loading() {
  return (
    <div className="fixed right-0 top-0 z-[1000000] flex h-screen w-full items-center justify-center gap-4 bg-primary text-white">
      <div className="z-50 h-7 w-7 animate-spin rounded-full border-4 border-secondary border-s-secondary/20" />{" "}
      Loading...
    </div>
  )
}
