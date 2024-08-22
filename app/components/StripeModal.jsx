import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment, useEffect } from "react"
import { ModalCrossIcon } from "./Svgs"
import { useSearchParams } from "next/navigation"

const StripeModal = () => {
  const searchParams = useSearchParams()
  const [showModal, setShowModal] = React.useState(true)
  const [title, setTitle] = React.useState("")

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setTitle("Payment Successful")
      setShowModal(true)
    }
    if (searchParams.get("canceled") === "true") {
      setTitle("Payment Canceled")
      setShowModal(true)
    }
  }, [searchParams])

  if (!showModal) return null

  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setShowModal(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-black/25 fixed inset-0 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="shadow-xl mx-7 w-full max-w-[400px] transform overflow-hidden rounded-[20px] border border-secondary bg-primary-275 font-basement text-white transition-all md:mx-0 md:max-w-[600px]">
                <div className="flex min-h-[400px] items-center justify-center">
                  <p className="text-xl font-bold lg:text-3xl">{title}</p>
                </div>

                <button
                  className="absolute right-5 top-5 cursor-pointer hover:text-secondary"
                  onClick={() => setShowModal(false)}
                >
                  <ModalCrossIcon width="16" height="16" />
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default StripeModal
