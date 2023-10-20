
import Image from "next/image";
import { Fragment } from "react";
import 'react-toastify/dist/ReactToastify.css';
import styles from "@/modules.css/generate.module.css"
import type { GenerateProps } from "@/types/types";
import PromptBar from "@/components/promptBar";
import Mode from "@/components/mode";
import ChatLabel from "@/components/chatLabel";
import { Transition } from "@headlessui/react";
export default function Generate({ prompts, setPrompts, mode, setMode, currentPrompt, setCurrentPrompt, setImageToEdit,canvasRef,imageToEdit }: GenerateProps): JSX.Element {
    return (
        <div className={`${mode ? "w-[60%] " : "w-full"} relative h-full flex justify-center`} style={{ transition: "width 700ms ease-in-out" }}>
            <Transition as={Fragment} show={!mode && prompts.length > 0} enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <span id={styles.generate} className={` left-0 z-10 text-gray-300 text-sm  top-0 py-4 bg-[#343541]  fixed flex items-center justify-center`}>Generate</span>
            </Transition>
            <Transition as={Fragment} show={mode && prompts.length > 0} enter="transition-opacity duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <span className={`w-[60%] right-3 z-10 text-gray-300 text-sm  top-0 py-4 bg-[#343541]  fixed flex items-center justify-center`}>Edit</span>
            </Transition>

            <Mode prompts={prompts} mode={mode} setMode={setMode} />
            <h1 className={`${prompts.length > 0 ? "opacity-0" : "opacity-100"} transition-opacity duration-300 font-bold text-[#565869] text-2xl absolute left-2/4 -translate-x-2/4 top-56`}>FunPic AI</h1>
            <div className=' z-1 w-full relative h-screen flex flex-col '>
                <div className='before:fixed before:bg-opacity-50 before:w-full before:bg-[#343541] before:bottom-0  before:py-2 before:content-[""] pt-16 pb-20 relative h-full overflow-y-scroll  child:min-h-[100px] child:flex child:items-center child:justify-center'>
                    <div className='w-full py-3 flex-col'>
                        {
                            prompts.map((prompt, index) => {
                                return (
                                    <ChatLabel key={index} prompt={prompt} index={index} tilt={styles.tilt} />

                                )
                            })
                        }
                    </div>
                </div>
                <PromptBar imageToEdit={imageToEdit} prompts={prompts} setPrompts={setPrompts} mode={mode} setMode={setMode} currentPrompt={currentPrompt} setCurrentPrompt={setCurrentPrompt} setImageToEdit={setImageToEdit} canvasRef={canvasRef} />
            </div>
        </div>
    )
}