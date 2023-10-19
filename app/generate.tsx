
import { useState } from "react";
import { BiBrush } from "react-icons/bi";
import { LuImagePlus } from "react-icons/lu";
import { PiPaperPlaneRightDuotone } from "react-icons/pi";
import { BsThreeDotsVertical, BsFillTrashFill } from "react-icons/bs";
import { RiAiGenerate } from "react-icons/ri";
import { HiSwitchHorizontal } from "react-icons/hi"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "@/modules.css/generate.module.css"
import type { GenerateProps, Prompts } from "@/types/types";
import generateImage from "@/api/generateImage";
import { Menu } from "@headlessui/react"
export default function Generate({ prompts, setPrompts, mode, setMode, currentPrompt, setCurrentPrompt, setImage }: GenerateProps): JSX.Element {
    const [showOptions, setShowOptions] = useState<boolean>(false)
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
        <div className={`${mode ? "w-[60%] " : "w-full"} relative h-full flex justify-center`} style={{ transition: "width 700ms ease-in-out" }}>
            {prompts.length > 0 && <span id={styles.generate} className='z-10 text-gray-300 text-sm  top-0 py-4 bg-[#343541] left-0  fixed flex items-center justify-center'>Generate</span>}
            <div className='z-50 absolute left-2/4 -translate-x-2/4 top-12 flex items-center text-white '>

                <div className={`${prompts.length > 0 ? "opacity-0 pointer-events-none" : "opacity-100"} transition-opacity duration-300 relative bg-[#202123] flex items-center rounded-xl p-1 w-fit child:w-[150px] child:py-3 child:flex child:items-center child:justify-center`}>

                    <div className={` ${mode ? "translate-x-[99%]" : "translate-x-[1%]"} transition-all bg-[#40414f] absolute  top-2/4 -translate-y-2/4  h-[85%] w-[95%] rounded-xl`}>

                    </div>
                    <div onClick={() => setMode(false)} className={`${prompts.length === 0 ? "opacity-100" : "opacity-0 pointer-events-none"} ${mode ? "opacity-50" : "opacity-100"} rounded-xl cursor-pointer z-10 transition-opacity`}>
                        <span>
                            <RiAiGenerate className='inline-block mr-2 text-green-400' />
                            Generate
                        </span>
                    </div>
                    <div onClick={() => setMode(true)} className={`${prompts.length === 0 ? "opacity-100" : "opacity-0 pointer-events-none"} ${mode ? "opacity-100" : "opacity-50"} rounded-xl cursor-pointer relative z-10 transition-opacity`}>
                        <BiBrush className='inline-block mr-2 text-purple-400' />
                        <span >Edit</span>
                    </div>
                </div>
            </div>
            <h1 className={`${prompts.length > 0 ? "opacity-0" : "opacity-100"} transition-opacity duration-300 font-bold text-[#565869] text-2xl absolute left-2/4 -translate-x-2/4 top-56`}>FunPic AI</h1>
            <div className=' z-1 w-full relative h-screen flex flex-col '>
                <div className='before:fixed before:bg-opacity-50 before:w-full before:bg-[#343541] before:bottom-0  before:py-2 before:content-[""] pt-16 pb-20 relative h-full overflow-y-scroll  child:min-h-[100px] child:flex child:items-center child:justify-center'>
                    <div className='w-full py-3 flex-col'>
                        {
                            prompts.map((promps, index) => {
                                return (

                                    <div className={`${promps.response ? "bg-[#444654]" : ""} w-full`}>
                                        <div key={index} className={`flex items-start gap-4 w-[500px] h-fit py-4 mx-auto`}>

                                            <img className='w-10 h-10 rounded-full' src={`${promps.response ? "https://avatars.githubusercontent.com/u/59100281?v=4" : "https://i.ibb.co/DCyLFGS/Captura-de-pantalla-2023-10-18-145501.png"} `} alt='user-icon' />

                                            <div className='w-full'>
                                                <p className={`${promps.loadingPropmt ? styles.tilt : ""} break-words text-slate-200 text-sm leading-8`}>
                                                    {promps.promp}
                                                </p>
                                                {
                                                    promps.responseImage ? <><br></br><img className='w-52 h-52' src={promps.responseImage} alt='response' /> </> : undefined
                                                }
                                            </div>
                                        </div>
                                    </div>

                                )
                            })
                        }
                    </div>
                </div>
                <div className='overflow-hidden z-10  absolute bottom-0 py-5 flex items-center justify-center text-white w-full'>
                    <div className='flex items-center justify-center gap-4 w-full'>
                        <div className='text-2xl text-gray-300 cursor-pointer z-20'>
                            <LuImagePlus onClick={() => document.getElementById("add-image")?.click()} />
                            <input
                                id='add-image'
                                type="file"
                                className="hidden"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const file: File | null = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                                    if (file) {
                                        const url = URL.createObjectURL(file);
                                        setImage({ file:file, url:url });
                                    }
                                }}
                            />
                        </div>
                        <div className='relative w-full max-w-[500px]'>
                            <input onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setCurrentPrompt({ ...currentPrompt, prompt: e.target.value })
                            }} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === "Enter") {
                                    handlePromptSubmit()
                                }
                            }} value={currentPrompt.prompt} type='text' className={`${currentPrompt.active ? "" : "cursor-not-allowed brightness-50"} bg-[#40414f] text-white p-2 rounded-xl shadow-md w-full`} placeholder='Enter a prompt to generate an image' />
                            <PiPaperPlaneRightDuotone className={`${currentPrompt.active ? "" : "cursor-not-allowed pointer-events-none"} absolute right-2 top-2/4 -translate-y-2/4 text-gray-300 z-10 cursor-pointer`} onClick={handlePromptSubmit} />
                        </div>
                        <div className="relative">
                            <Menu>
                                <Menu.Button className={"z-50"}><BsThreeDotsVertical /></Menu.Button>
                                <Menu.Items className={"bg-[#40414f] absolute bottom-[155%] flex flex-col child:p-3"}>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button className={`-${active && "bg-[#5b5c65]"} hover:bg-[#5b5c65] whitespace-nowrap flex items-center justify-center gap-2`}><BsFillTrashFill /> Clear Chat</button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button className={`-${active && "bg-[#5b5c65]"} hover:bg-[#5b5c65] whitespace-nowrap flex items-center justify-center gap-2`}><HiSwitchHorizontal /> Switch to mode {mode ? "Edite" : "Generate"}</button>
                                        )}
                                    </Menu.Item>
                                </Menu.Items>
                            </Menu>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}