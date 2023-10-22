import React, { useState, useEffect, Fragment, useRef } from "react"
import { Transition, Menu, Dialog } from "@headlessui/react";
import { LuImagePlus } from "react-icons/lu";
import { PiPaperPlaneRightDuotone } from "react-icons/pi"
import { BsThreeDotsVertical, BsFillTrashFill, BsFillKeyFill } from "react-icons/bs"
import { HiSwitchHorizontal } from "react-icons/hi"
import type { PrompBarProps, Prompts, ShowNoApiKeyDialog } from "@/types/types"
import generateImage from "@/api/generateImage";
import { toast } from 'react-toastify';
import styles from "@/modules.css/generate.module.css"
import { getCookie } from "cookies-next";
import ClearChat from "@/modals/clearChat";
import ApiKeyModal from "@/modals/apikey";
import EditImage from "@/api/editImage";

export default function PromptBar({ prompts, setPrompts, mode, setMode, currentPrompt, setCurrentPrompt, setImageToEdit, canvasRef, imageToEdit,setSwitchImage }: PrompBarProps): JSX.Element {
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const apikeyCookie = useRef<string | undefined>(getCookie("api-key"))
    const [showNoApiKeyDialog, setShowNoApiKeyDialog] = useState<ShowNoApiKeyDialog>({
        state: false,
        action: null
    });
    const [showIndicatorImage, setShowIndicatorImage] = useState<{ active: boolean, stop: boolean }>({
        active: false,
        stop: false
    })

    useEffect(() => {
        setShowIndicatorImage({
            ...showIndicatorImage,
            active: mode
        });
    }, [mode]);
    const handlePromptSubmit = async (): Promise<void> => {
        if (!apikeyCookie.current) {
            setShowNoApiKeyDialog({
                state: true,
                action: true
            })
            return;
        }
        if (currentPrompt.prompt.length === 0) {
            toast.error("Please enter a prompt!")
            return
        }
        setPrompts([...prompts, { promp: currentPrompt.prompt, index: prompts.length, response: false, responseImage: null, loadingPropmt: false }])
        setCurrentPrompt({
            prompt: "",
            active: false
        })
        setPrompts((prev) => {
            const newArray = [...prev]
            newArray.push({ promp: !mode ? "generating your " : "Editing photo with prompt: " + currentPrompt.prompt + "....", index: prompts.length, response: true, responseImage: null, loadingPropmt: true })
            return newArray
        })
        let data;
        if (!mode) {
            data = await generateImage(currentPrompt.prompt, apikeyCookie.current)
        } else {
            const canvas = canvasRef?.current;
            const originalImage = imageToEdit.file
            if (canvas && originalImage) {
                const context = canvas.getContext("2d")
                const imageData = context && context.getImageData(0, 0, canvas.width, canvas.height).data;
                const isCanvasEmpty = imageData?.every((value, index) => {

                    if (index % 4 === 3) {
                        return value === 0;
                    }
                    return true;
                });
                if (isCanvasEmpty) {
                    toast.error("The edit canvas can't be empty!")
                    setPrompts((prev: Prompts) => [...prev].slice(0, prev.length - 1));
                    setCurrentPrompt({ prompt: "", active: true });
                    return;
                }
                try {
                    const canvasImage: Blob = await new Promise((resolve, reject) => {
                        return canvas.toBlob((blob) => {
                            if (blob) {
                                resolve(blob)
                            } else {
                                reject(new Error())
                            }
                        }, "image/png")
                    })
                    const formData = new FormData()
                    if (canvasImage && imageToEdit.file) {
                        formData.append("mask", canvasImage)
                        formData.append("image", originalImage)
                        formData.append("token", apikeyCookie.current)
                        formData.append("prompt", currentPrompt.prompt)
                        data = await EditImage(formData)
                    } else {
                        throw new Error("There was an error confirming the existence of canvasImage & imageToEdit")
                    }

                } catch (err) {
                    toast.error("Error generating blob of canvas");
                    return;
                }

            } else {
                toast.error("We were unable to find the streaks on the canvas or the image")
                setPrompts((prev: Prompts) => [...prev].slice(0, prev.length - 1));
                setCurrentPrompt({ prompt: "", active: true });
                return;
            }
        }

        const isOk = data?.isOk
        const message = data?.message
        const image = data?.image ? data.image : null

        if (!isOk) {
            toast.error(message);
            setPrompts((prev: Prompts) => {
                const newPrompts = [...prev]
                newPrompts[prev.length - 1].promp = message ?? "There was an error trying to " + !mode ? "generate" : "edit" + " the image";
                newPrompts[prev.length - 1].loadingPropmt = false;
                return newPrompts;
            });
            setCurrentPrompt({ prompt: "", active: true });
            return;
        }
        setPrompts((prev) => {
            var arrayToModify = [...prev];
            arrayToModify[arrayToModify.length - 1].promp = arrayToModify[arrayToModify.length - 1].promp.replace(
                "generating your ",
                !mode ? "Here's your image of: " : "Here's your edited image with the prompt: "
            );
            arrayToModify[arrayToModify.length - 1].responseImage = image;
            arrayToModify[arrayToModify.length - 1].loadingPropmt = false;
            return arrayToModify;
        });
        setCurrentPrompt({ prompt: "", active: true });
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
                                    setImageToEdit({ file: file, url: url });
                                    setSwitchImage(true)
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
                        }} value={currentPrompt.prompt} type='text' className={`${currentPrompt.active ? "" : "cursor-not-allowed brightness-50"} bg-[#40414f] text-white p-2 rounded-xl shadow-md w-full`} placeholder={`${mode && window.innerWidth > 405 ? "Enter a prompt to edit the image" : !mode && window.innerWidth > 403 ? "Enter a prompt to generate an image" : mode ? "Enter a prompt to edit" : "Enter a prompt to generate"}`} />
                        <PiPaperPlaneRightDuotone className={`${currentPrompt.active ? "" : "cursor-not-allowed pointer-events-none"} absolute right-2 top-2/4 -translate-y-2/4 text-gray-300 z-10 cursor-pointer`} onClick={handlePromptSubmit} />
                    </div>
                    <div className="relative">
                        <Menu>
                            <Menu.Button className={"z-50"}><BsThreeDotsVertical /></Menu.Button>
                            <Menu.Items className={"bg-[#40414f] absolute bottom-[155%] max-lg:right-0 flex flex-col child:p-3 z-50"}>
                                <Menu.Item>
                                    {({ active }: { active: boolean }) => (
                                        <button className={`${active && "bg-[#5b5c65]"} hover:bg-[#5b5c65] whitespace-nowrap flex items-center justify-center gap-2`} onClick={() => setShowDialog(true)}><BsFillTrashFill /> Clear Chat</button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }: { active: boolean }) => (
                                        <button onClick={() => setMode((prev) => !prev)} className={`${active && "bg-[#5b5c65]"} hover:bg-[#5b5c65] whitespace-nowrap flex items-center justify-center gap-2`}><HiSwitchHorizontal /> Switch to mode {mode ? "Generate" : "Edit"}</button>
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
            <ApiKeyModal setShowNoApiKeyDialog={setShowNoApiKeyDialog} showNoApiKeyDialog={showNoApiKeyDialog} apikeyCookie={apikeyCookie} />
        </>
    )
}