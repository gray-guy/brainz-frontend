export default function Loading() {
  return (
    <div className="bg-primary/68 fixed right-0 top-0 z-[1000000] flex h-screen w-full items-center justify-center gap-4 text-white">
      <div className="z-50 h-10 w-10 animate-spin rounded-full border-4 border-secondary border-s-secondary/20" />
      Loading
    </div>
  )
}
