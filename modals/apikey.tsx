"use client";
import { useState, Fragment, useRef } from "react"
import type { ApiKeyModalProps } from "@/types/types"
import { Transition, Dialog } from "@headlessui/react"
import { AiOutlineInfoCircle } from "react-icons/ai"
import getToken from "@/api/getToken";
import { toast } from "react-toastify";
import { setCookie } from "cookies-next";
export default function ApiKeyModal({ showNoApiKeyDialog, setShowNoApiKeyDialog }: ApiKeyModalProps): JSX.Element {
    const [apiKey, setApiKey] = useState<string>("")
    const submitButtonRef = useRef(null)
    async function handleApiKeySubmission(): Promise<void> {
        let loadingToken = toast.loading("Loading token....")
        const { isOk, token, message } = await getToken(apiKey);

        if (!isOk) {
            toast.update(loadingToken, {
                render: message,
                type: "error",
                isLoading: false,
                autoClose: 4000
            })

            return;
        } else {
            toast.update(loadingToken, {
                render: "Token generated successfully",
                type: "success",
                isLoading: false,
                autoClose: 4000
            })
            setCookie("api-key", token)
            setShowNoApiKeyDialog({
                ...showNoApiKeyDialog,
                state: false
            })
            return;
        }
    }
    return (
        <Transition.Root show={showNoApiKeyDialog.state} as={Fragment}>
            <Dialog initialFocus={submitButtonRef} onClose={() => setShowNoApiKeyDialog({
                ...showNoApiKeyDialog,
                state: false

            })} className={"relative z-50"}>
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
                    <Dialog.Panel className={"bg-[#40414f] fixed left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 max-w-[550px] rounded-lg shadow-md"}>
                        <div className="flex flex-col text-slate-300">
                            <div className="flex p-8 gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-600 text-2xl text-slate-100">
                                    <AiOutlineInfoCircle />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Dialog.Title className={"font-bold text-lg"}>{showNoApiKeyDialog.action ? "You haven't setup your api key 😢!" : "Setup your open AI api key 😊"}</Dialog.Title>
                                    <Dialog.Description>Please copy and paste your api key on the input below:</Dialog.Description>
                                    <input className="bg-[#4d4e58] border-[#ccc] shadow-md border my-2 py-1 pl-3 rounded-md" type="password" name="apikey" autoComplete="false" autoCapitalize="false"></input>
                                    <span className="text-sm mt-3">&#40;Don&#39;t worry, we don&#39;t store this information on our servers&#41;</span>
                                </div>
                            </div>
                            <div className=" bg-[#4d4e58] rounded-br-lg rounded-bl-lg px-3" >
                                <div className="flex items-center gap-5 justify-end py-4 w-full">
                                    <button ref={submitButtonRef} className="px-8 py-2 bg-green-600 font-bold rounded-lg" onClick={handleApiKeySubmission}>Save</button>
                                    <button className="px-8 py-2 bg-[#36373b] border border-[#31323c] shadow-md font-bold rounded-lg" onClick={() => {
                                        setShowNoApiKeyDialog({ ...showNoApiKeyDialog, state: false })
                                    }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition.Root >
    )
}