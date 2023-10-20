import React, { useState, useEffect, Fragment } from "react"
import { Transition, Menu, Dialog } from "@headlessui/react";
import { LuImagePlus } from "react-icons/lu";
import { PiPaperPlaneRightDuotone } from "react-icons/pi"
import { BsThreeDotsVertical, BsFillTrashFill, BsFillKeyFill } from "react-icons/bs"
import { HiSwitchHorizontal } from "react-icons/hi"
import { PrompBarProps, Prompts } from "@/types/types"
import generateImage from "@/api/generateImage";
import { toast } from 'react-toastify';
import styles from "@/modules.css/generate.module.css"
import { getCookie } from "cookies-next";
import ClearChat from "@/modals/clearChat";
import ApiKeyModal from "@/modals/apikey";
import type { ShowNoApiKeyDialog } from "@/types/types"

export default function PromptBar({ prompts, setPrompts, mode, setMode, currentPrompt, setCurrentPrompt, setImage }: PrompBarProps): JSX.Element {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showNoApiKeyDialog, setShowNoApiKeyDialog] = useState<ShowNoApiKeyDialog>({
        state: false,
        action: null
    });
    const [showIndicatorImage, setShowIndicatorImage] = useState<{ active: boolean, stop: boolean }>({
        active: false,
        stop: false
    })

    useEffect(() => {
        !showIndicatorImage.active && setShowIndicatorImage({
            ...showIndicatorImage,
            active: mode
        });
    }, [mode]);
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
            setPrompts((prev: Prompts) => [...prev].slice(0, prev.length - 1));
            setCurrentPrompt({ prompt: "", active: true });
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
        <>
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
                                <Menu.Item>
                                    {({ active }: { active: boolean }) => (
                                        <button onClick={() => setShowNoApiKeyDialog({
                                            state: true,
                                            action: false
                                        })} className={`${active && "bg-[#5b5c65]"} hover:bg-[#5b5c65] whitespace-nowrap flex items-center justify-center gap-2`}><BsFillKeyFill /> Setup Api Key</button>
                                    )}
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>
                <ClearChat showDialog={showDialog} setShowDialog={setShowDialog} setPrompts={setPrompts} />

            </div>
            <ApiKeyModal setShowNoApiKeyDialog={setShowNoApiKeyDialog} showNoApiKeyDialog={showNoApiKeyDialog} />
        </>
    )
}