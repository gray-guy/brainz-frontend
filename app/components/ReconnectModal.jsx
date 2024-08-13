import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment } from "react"
import { WarningIcon } from "./Svgs"
import { Button } from "./Button"

const ReconnectModal = ({ showModal, onReconnect }) => {
  if (!showModal) return null

  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="shadow-xl w-full max-w-[724px] transform overflow-hidden rounded-[20px] bg-primary-275 px-6 pb-6 pt-[30px] text-left text-center align-middle text-white transition-all md:px-[50px] md:px-[86px] md:pb-[48px] md:pt-[90px]">
                <div className="flex items-center justify-center">
                  <div className="block md:hidden">
                    <WarningIcon width="50" height="50" />
                  </div>
                  <div className="hidden md:block">
                    <WarningIcon />
                  </div>
                </div>
                <h2 className="mt-5 font-basement text-lg font-medium md:mt-10 md:text-2xl">
                  Snap! You were disconnected.
                </h2>
                <div className="mt-5 flex w-full justify-center">
                  <Button
                    onClick={onReconnect}
                    variant={"outlinedWhite"}
                    className={"w-[232px]"}
                  >
                    Reconnect
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ReconnectModal
