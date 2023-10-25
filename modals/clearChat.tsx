
import { Fragment, useRef } from "react"
import { Transition, Dialog } from "@headlessui/react"
import type { OptionsModalProps } from "@/types/types"
import { CgDanger } from "react-icons/cg"

export default function clearChat({ showDialog, setShowDialog, setPrompts }: OptionsModalProps) {
    const cancelButtonRef = useRef(null);
    return (
        <div>

            <Transition.Root show={showDialog} as={Fragment}>
                <Dialog initialFocus={cancelButtonRef} onClose={() => setShowDialog(false)} className={"relative z-50"}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity w-[100vw] h-screen" />
                    </Transition.Child>
                    <Transition.Child as={Fragment} enter="transition-all duration-300" enterFrom="scale-0 opacity-0" enterTo="opacity-100 scale-100" leave="transition-all duration-300" leaveFrom="scale-100 opacity-100" leaveTo="scale-0 opacity-0">
                        <Dialog.Panel className={"bg-[#40414f] fixed left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 w-3/4 max-w-[600px] min-w-[300px] rounded-lg shadow-md"}>
                            <div className="flex flex-col text-slate-300">
                                <div className="flex p-8 gap-3">
                                    <div className="w-1/5 max-sm:hidden">
                                        <div className="flex items-center justify-center text-2xl text-red-600 bg-red-200 rounded-full w-10 h-10">
                                            <CgDanger />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Dialog.Title className={"font-bold text-lg"}>Are you sure you want to do this?</Dialog.Title>
                                        <Dialog.Description>You are going to loose all the photos you are generated.</Dialog.Description>
                                    </div>
                                </div>
                                <div className=" bg-[#4d4e58] rounded-br-lg rounded-bl-lg px-3" >
                                    <div className="flex items-center gap-5 justify-end py-4 w-full">
                                        <button className="px-8 py-2 bg-red-600 font-bold rounded-lg" onClick={() => {
                                            setPrompts([])
                                            setShowDialog(false)
                                        }}>I&apos;m sure</button>
                                        <button ref={cancelButtonRef} className="px-8 py-2 bg-[#36373b] border border-[#31323c] shadow-md font-bold rounded-lg" onClick={() => {
                                            setShowDialog(false)
                                        }}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition.Root>

        </div>
    )
}