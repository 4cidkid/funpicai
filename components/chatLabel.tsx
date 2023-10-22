import Image from "next/image"
import type { Prompts } from "@/types/types"
import { BiDownload } from "react-icons/bi"
export default function ChatLabel({ prompt, tilt }: { prompt: Prompts[0], tilt: string }): JSX.Element {
    return (

        <div className={`${prompt.response ? "bg-[#444654]" : ""} w-full`}>
            <div className={`flex items-start gap-4 w-[500px] h-fit py-4 mx-auto`}>

                <Image width={50} height={50} className=' rounded-full' src={`${prompt.response ? "/bender.jpeg" : "/calamardo.png"} `} alt='user-icon' />

                <div className='w-full'>
                    <p className={`${prompt.loadingPropmt ? tilt : ""} break-words text-slate-200 text-sm leading-8`}>
                        {prompt.promp}
                    </p>
                    {
                        prompt.responseImage ? <><br></br><div className="flex items-center gap-3">
                            <Image width={208} height={208} className='w-52 h-52' src={prompt.responseImage} alt='response' />
                            <a target="_blank" href={prompt.responseImage} className="flex items-center gap-2 text-white" download={true}>
                                <BiDownload />
                                <span>Download Image</span>
                            </a>
                        </div> </> : undefined
                    }
                </div>
            </div>
        </div>
    )
}