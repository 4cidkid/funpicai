
import Image from "next/image";
import 'react-toastify/dist/ReactToastify.css';
import styles from "@/modules.css/generate.module.css"
import type { GenerateProps } from "@/types/types";
import PromptBar from "@/components/promptBar";
import Mode from "@/components/mode";
import ChatLabel from "@/components/chatLabel";
export default function Generate({ prompts, setPrompts, mode, setMode, currentPrompt, setCurrentPrompt, setImage }: GenerateProps): JSX.Element {

    return (
        <div className={`${mode ? "w-[60%] " : "w-full"} relative h-full flex justify-center`} style={{ transition: "width 700ms ease-in-out" }}>
            {prompts.length > 0 && <span id={styles.generate} className='z-10 text-gray-300 text-sm  top-0 py-4 bg-[#343541] left-0  fixed flex items-center justify-center'>Generate</span>}
            <Mode prompts={prompts} mode={mode} setMode={setMode} />
            <h1 className={`${prompts.length > 0 ? "opacity-0" : "opacity-100"} transition-opacity duration-300 font-bold text-[#565869] text-2xl absolute left-2/4 -translate-x-2/4 top-56`}>FunPic AI</h1>
            <div className=' z-1 w-full relative h-screen flex flex-col '>
                <div className='before:fixed before:bg-opacity-50 before:w-full before:bg-[#343541] before:bottom-0  before:py-2 before:content-[""] pt-16 pb-20 relative h-full overflow-y-scroll  child:min-h-[100px] child:flex child:items-center child:justify-center'>
                    <div className='w-full py-3 flex-col'>
                        {
                            prompts.map((prompt, index) => {
                                return (
                                    <ChatLabel prompt={prompt} index={index} tilt={styles.tilt} />

                                )
                            })
                        }
                    </div>
                </div>
                <PromptBar prompts={prompts} setPrompts={setPrompts} mode={mode} setMode={setMode} currentPrompt={currentPrompt} setCurrentPrompt={setCurrentPrompt} setImage={setImage} />
            </div>
        </div>
    )
}