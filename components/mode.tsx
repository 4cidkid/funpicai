import { BiBrush } from "react-icons/bi";
import { RiAiGenerate } from "react-icons/ri";
import type { ModeProps } from "@/types/types";
export default function Mode({ prompts, mode, setMode }: ModeProps): JSX.Element {
    return (
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
    )
}