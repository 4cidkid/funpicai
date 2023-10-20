"use client";
import { useState,useRef } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Generate from './generate';
import type { Prompts, CurrentPrompt,ImageToEdit } from '@/types/types';
import Edit from './edit';
export default function Home(): JSX.Element {
  const [mode, setMode] = useState<boolean>(false); // false = generate, true = edit
  const [imageToEdit, setImageToEdit] = useState<ImageToEdit>({
    file: null,
    url: ""
  });
  const [currentPrompt, setCurrentPrompt] = useState<CurrentPrompt>({
    prompt: "",
    active: true
  })
  const [prompts, setPrompts] = useState<Prompts>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)



  return (
    <section className='bg-[#fafafa] w-full h-screen'>
      <ToastContainer />
      <div className='bg-[#343541] flex items-center justify-center h-screen w-full overflow-hidden'>
        <Edit mode={mode} imageToEdit={imageToEdit} canvasRef={canvasRef} />
        <Generate imageToEdit={imageToEdit}  canvasRef={canvasRef} prompts={prompts} setPrompts={setPrompts} mode={mode} setMode={setMode} currentPrompt={currentPrompt} setCurrentPrompt={setCurrentPrompt} setImageToEdit={setImageToEdit} />
      </div>
    </section>

  )
}
