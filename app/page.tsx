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
import type { Prompts, CurrentPrompt,image } from '@/types/types';
import Edit from './edit';
export default function Home(): JSX.Element {
  const [mode, setMode] = useState<boolean>(false); // false = generate, true = edit
  const [image, setImage] = useState<image>({
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
        <Edit mode={mode} image={image} />
        <Generate prompts={prompts} setPrompts={setPrompts} mode={mode} setMode={setMode} currentPrompt={currentPrompt} setCurrentPrompt={setCurrentPrompt} setImage={setImage} />
      </div>
    </section>

  )
}
