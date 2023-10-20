import Image from "next/image"
import type { Prompts } from "@/types/types"
export default function ChatLabel({ prompt, tilt,index }: { prompt: Prompts[0], tilt: string,index:number }): JSX.Element {
    return (

        <div className={`${prompt.response ? "bg-[#444654]" : ""} w-full`}>
            <div className={`flex items-start gap-4 w-[500px] h-fit py-4 mx-auto`}>

                <Image width={50} height={50} className=' rounded-full' src={`${prompt.response ? "/bender.jpeg" : "/calamardo.png"} `} alt='user-icon' />

                <div className='w-full'>
                    <p className={`${prompt.loadingPropmt ? tilt : ""} break-words text-slate-200 text-sm leading-8`}>
                        {prompt.promp}
                    </p>
                    {
                        prompt.responseImage ? <><br></br><Image width={208} height={208} className='w-52 h-52' src={prompt.responseImage} alt='response' /> </> : undefined
                    }
                </div>
            </div>
        </div>
    )
}