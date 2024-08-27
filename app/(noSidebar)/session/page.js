import { Session } from "@/app/container/Session/Session"

export default function Page() {
  const params = { id: null }
  return <Session params={params} />
}
