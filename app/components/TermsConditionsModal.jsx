import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment } from "react"

const TermsConditionsModal = ({ openModal, closeModal }) => {
  return (
    <Transition show={openModal}>
      <Dialog
        as="div"
        open={openModal}
        className="relative z-50 focus:outline-none"
        onClose={closeModal}
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
          <div className="bg-black/25 fixed inset-0" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="shadow-xl h-80 w-full transform overflow-hidden rounded-[20px] bg-primary-275 px-4 py-6 text-white transition-all md:h-96 md:max-w-xl md:px-6 md:py-10">
                <div className="font-basement">
                  <h1 className="text-center text-2xl font-bold text-white">
                    Referral Terms
                  </h1>
                  <div className="mt-16 flex flex-col justify-start">
                    <p className="mb-2 flex gap-2 text-sm md:text-base">
                      <span>-</span>5% Commission on Lifetime Net Revenue
                    </p>
                    <p className="mb-2 flex gap-2 text-sm md:text-base">
                      <span>-</span>Payments land on your Brainz account on the
                      first of each month
                    </p>
                    <p className="mb-2 flex gap-2 text-sm md:text-base">
                      <span>-</span>Brainz reservers the right to zero
                      commission and close accounts on detection of any sharp
                      practices.
                    </p>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default TermsConditionsModal
