import React, { useState, useEffect, Fragment } from "react"
import { Transition, Menu, Dialog } from "@headlessui/react";
import { LuImagePlus } from "react-icons/lu";
import { PiPaperPlaneRightDuotone } from "react-icons/pi"
import { CgDanger } from "react-icons/cg"
import { BsThreeDotsVertical, BsFillTrashFill } from "react-icons/bs"
import { HiSwitchHorizontal } from "react-icons/hi"
import { PrompBarProps, Prompts } from "@/types/types"
import generateImage from "@/api/generateImage";
import { toast } from 'react-toastify';
import styles from "@/modules.css/generate.module.css"

export default function PromptBar({ prompts, setPrompts, mode, setMode, currentPrompt, setCurrentPrompt, setImage }: PrompBarProps): JSX.Element {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showIndicatorImage, setShowIndicatorImage] = useState<{ active: boolean, stop: boolean }>({
        active: false,
        stop: false
    })
    useEffect(() => { setShowIndicatorImage({ ...showIndicatorImage, active: mode }) }, [mode, showIndicatorImage])
    const handlePromptSubmit = async () => {
        if (currentPrompt.prompt.length === 0) return toast.error("Please enter a prompt!")
        setPrompts([...prompts, { promp: currentPrompt.prompt, index: prompts.length, response: false, responseImage: null, loadingPropmt: false }])
        setCurrentPrompt({
            prompt: "",
            active: false
        })
        setPrompts((prev) => {
            const newArray = [...prev]
            newArray.push({ promp: "generating your " + prompt + "....", index: prompts.length, response: true, responseImage: null, loadingPropmt: true })
            return newArray
        })

        const { isOk, image, message } = await generateImage(currentPrompt.prompt)
        if (!isOk) {
            toast.error(message);
            setPrompts((prev: Prompts) => {
                const array = [...prev];
                array.pop();
                return array as Prompts;
            });
            setCurrentPrompt((prev) => ({ ...prev, prompt: "", active: true }));
            return;
        }
        setPrompts((prev) => {
            var arrayToModify = [...prev];
            arrayToModify[arrayToModify.length - 1].promp = arrayToModify[arrayToModify.length - 1].promp.replace(
                "generating your ",
                "Here's your prompt: "
            );
            arrayToModify[arrayToModify.length - 1].responseImage = image;
            arrayToModify[arrayToModify.length - 1].loadingPropmt = false;
            return arrayToModify;
        });
        setCurrentPrompt((prev) => ({ ...prev, prompt: "", active: true }));
    }
    return (
        <div className=' z-10  absolute bottom-0 py-5 flex items-center justify-center text-white w-full'>
            <div className='flex items-center justify-center gap-4 w-full'>
                <div className={`${mode ? "cursor-pointer" : "cursor-not-allowed"} text-2xl text-gray-300  z-20 relative`}>
                    <LuImagePlus className="z-50" onClick={() => mode && document.getElementById("add-image")?.click()} />
                    <input
                        id='add-image'
                        type="file"
                        className="hidden"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setShowIndicatorImage({ active: false, stop: true })
                            const file: File | null = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                            if (file) {
                                const url = URL.createObjectURL(file);
                                setImage({ file: file, url: url });
                            }
                        }}
                    />
                    <Transition onClick={() => mode && document.getElementById("add-image")?.click()} className={"z-10"} show={showIndicatorImage.active && !showIndicatorImage.stop} enter="transition-opacity duration-150" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className={`${styles["tilt-fast"]} z-10 w-12 h-12 border-green-500 border-2 rounded-full absolute left-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4`}></div>
                    </Transition>
                </div>
                <div className='relative w-full max-w-[500px]'>
                    <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setCurrentPrompt({ ...currentPrompt, prompt: e.target.value })
                    }} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                            handlePromptSubmit()
                        }
                    }} value={currentPrompt.prompt} type='text' className={`${currentPrompt.active ? "" : "cursor-not-allowed brightness-50"} bg-[#40414f] text-white p-2 rounded-xl shadow-md w-full`} placeholder={`${mode ? "Enter a prompt to edit the image" : "Enter a prompt to generate an image"}`} />
                    <PiPaperPlaneRightDuotone className={`${currentPrompt.active ? "" : "cursor-not-allowed pointer-events-none"} absolute right-2 top-2/4 -translate-y-2/4 text-gray-300 z-10 cursor-pointer`} onClick={handlePromptSubmit} />
                </div>
                <div className="relative">
                    <Menu>
                        <Menu.Button className={"z-50"}><BsThreeDotsVertical /></Menu.Button>
                        <Menu.Items className={"bg-[#40414f] absolute bottom-[155%] flex flex-col child:p-3 z-50"}>
                            <Menu.Item>
                                {({ active }: { active: boolean }) => (
                                    <button className={`${active && "bg-[#5b5c65]"} hover:bg-[#5b5c65] whitespace-nowrap flex items-center justify-center gap-2`} onClick={() => setShowDialog(true)}><BsFillTrashFill /> Clear Chat</button>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }: { active: boolean }) => (
                                    <button onClick={() => setMode((prev) => !prev)} className={`${active && "bg-[#5b5c65]"} hover:bg-[#5b5c65] whitespace-nowrap flex items-center justify-center gap-2`}><HiSwitchHorizontal /> Switch to mode {mode ? "Edite" : "Generate"}</button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>
                </div>
            </div>
            <Transition.Root show={showDialog} as={Fragment}>
                <Dialog onClose={() => setShowDialog(false)} className={"relative z-50"}>
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
                                    <div className="flex items-center justify-center text-2xl text-red-600 bg-red-200 rounded-full w-10 h-10">
                                        <CgDanger />
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
                                        <button className="px-8 py-2 bg-[#36373b] border border-[#31323c] shadow-md font-bold rounded-lg" onClick={() => {
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