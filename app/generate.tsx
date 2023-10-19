
"use client";
import Image from "next/image";
import { BiBrush } from "react-icons/bi";
import { RiAiGenerate } from "react-icons/ri";
import 'react-toastify/dist/ReactToastify.css';
import styles from "@/modules.css/generate.module.css"
import type { GenerateProps, Prompts } from "@/types/types";
import PromptBar from "@/components/promptBar";
export default function Generate({ prompts, setPrompts, mode, setMode, currentPrompt, setCurrentPrompt, setImage }: GenerateProps): JSX.Element {
   
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

                                    <div key={index} className={`${promps.response ? "bg-[#444654]" : ""} w-full`}>
                                        <div  className={`flex items-start gap-4 w-[500px] h-fit py-4 mx-auto`}>

                                            <Image className='w-10 h-10 rounded-full' src={`${promps.response ? "/bender.png" : "/calamardo.png"} `} alt='user-icon' />

                                            <div className='w-full'>
                                                <p className={`${promps.loadingPropmt ? styles.tilt : ""} break-words text-slate-200 text-sm leading-8`}>
                                                    {promps.promp}
                                                </p>
                                                {
                                                    promps.responseImage ? <><br></br><Image className='w-52 h-52' src={promps.responseImage} alt='response' /> </> : undefined
                                                }
                                            </div>
                                        </div>
                                    </div>

                                )
                            })
                        }
                    </div>
                </div>
               <PromptBar prompts={prompts} setPrompts={setPrompts} mode={mode} setMode={setMode} currentPrompt={currentPrompt} setCurrentPrompt={setCurrentPrompt} setImage={setImage}/>
            </div>
        </div>
    )
}