"use client"
import Dashboard from "@/app/container/Dashboard"
import Loader from "../components/Loader"
// import { loadStripe } from "@stripe/stripe-js"

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

export default function Page() {
  return (
    <div>
      <Loader />
      <Dashboard />
    </div>
  )
}
