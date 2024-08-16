"use client"
import Dashboard from "@/app/container/Dashboard"
import Loader from "../components/Loader"
import { usePrivy } from "@privy-io/react-auth"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

export default function Page() {
  const { authenticated } = usePrivy()

  if (authenticated) {
    return (
      <Loader>
        <Dashboard />
      </Loader>
    )
  }

  return (
    <div>
      <Dashboard />

      <form
        action={`${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`}
        method="POST"
      >
        <button type="submit">Checkout</button>
      </form>
    </div>
  )
}
