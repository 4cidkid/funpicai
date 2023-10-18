"use client";
import Image from 'next/image'
import { useState } from 'react';
import { RiAiGenerate } from "react-icons/ri"
import { BiBrush } from "react-icons/bi"
import { LuImagePlus } from "react-icons/lu"
import { PiPaperPlaneRightDuotone } from "react-icons/pi"
import { BsThreeDotsVertical } from "react-icons/bs"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Generate from './generate';
import type { Prompts, CurrentPrompt } from '@/types/types';
export default function Home(): JSX.Element {
  const [mode, setMode] = useState<boolean>(false); // false = generate, true = edit
  const [image, setImage] = useState<{ file: File | null, url: string }>({
    file: null,
    url: ""
  });
  const [currentPrompt, setCurrentPrompt] = useState<CurrentPrompt>({
    prompt: "",
    active: true
  })
  const [prompts, setPrompts] = useState<Prompts>([])



return (
  <section className='bg-[#fafafa] w-full h-screen'>
    <ToastContainer />
    <div className='bg-[#343541] flex items-center justify-center h-screen w-full overflow-hidden'>
      <div className={`${mode ? "w-[40%]" : " w-[0px]"} h-full text-white bg-[#202123] overflow-hidden`} style={{ transition: "width 700ms ease-in-out" }}>
        <div className='w-full h-full flex items-center justify-center'>
          <span>Start uploading an image!</span>
        </div>
      </div>
      <Generate prompts={prompts} setPrompts={setPrompts} mode={mode} setMode={setMode} currentPrompt={currentPrompt} setCurrentPrompt={setCurrentPrompt} setImage={setImage} />
    </div>
  </section>

)
}
