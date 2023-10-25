"use client";
import Image from 'next/image';
import { ImageToEdit, EditProps } from '@/types/types';
import { FaBrush } from 'react-icons/fa'
import { useState, useRef, useEffect, Fragment, MutableRefObject, RefObject } from 'react'
import { Transition } from '@headlessui/react';
import { BsBrush, BsFillArrowLeftCircleFill, BsFillTrashFill } from "react-icons/bs"
export default function Edit({ mode, imageToEdit, setImageToEdit, canvasRef, switchImage, setSwitchImage }: EditProps): JSX.Element {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [widthOfCanvas, setWidthOfCanvas] = useState<number>(0);
  const canvasImage = useRef<HTMLImageElement>(null);
  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    let isDrawing = false;
    let brushSize = 30;

    function drawCircle(x: number, y: number) {
      if (!ctx) return;
      ctx.fillStyle = "rgba(255, 0, 0, 1)";
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!canvas) return;
    if (!ctx) return;
    //pc mouse
    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      const boundingRect = canvas.getBoundingClientRect();
      const offsetX = e.clientX - boundingRect.left;
      const offsetY = e.clientY - boundingRect.top;

      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!isDrawing) return;
      const boundingRect = canvas.getBoundingClientRect();

      const x = e.clientX - boundingRect.left;
      const y = e.clientY - boundingRect.top;
      drawCircle(x, y);
    });

    canvas.addEventListener("mouseup", () => {
      isDrawing = false;
      ctx.closePath();
    });

    canvas.addEventListener("mouseout", () => {
      isDrawing = false;
      ctx.closePath();
    });
    // mobile touch
    canvas.addEventListener("touchstart", (e) => {
      isDrawing = true;
      const boundingRect = canvas.getBoundingClientRect();
      const offsetX = e.touches[0].clientX - boundingRect.left;
      const offsetY = e.touches[0].clientY - boundingRect.top;

      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    });
    canvas.addEventListener("touchmove", (e) => {
      if (!isDrawing) return;
      const boundingRect = canvas.getBoundingClientRect();

      const x = e.touches[0].clientX - boundingRect.left;
      const y = e.touches[0].clientY - boundingRect.top;
      drawCircle(x, y);
    });
    canvas.addEventListener("touchend", () => {
      isDrawing = false;
      ctx.closePath();
    });
    canvas.addEventListener("touchcancel", () => {
      isDrawing = false;
      ctx.closePath();
    });

  }, [imageToEdit, canvasRef]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }
  }, []);
  useEffect(() => {
    if (windowWidth < 768 && switchImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [switchImage, windowWidth])
  return (
    <div className={`${switchImage ? "max-md:-translate-x-0" : "max-md:-translate-x-full"} ${mode ? "md:w-[40%]" : "md:w-[0px]"} h-full text-white bg-[#202123] overflow-hidden relative z-50 max-md:fixed max-md:top-0 max-md:h-screen max-md:left-0 max-md:w-[90dvw] max-md:z-[51]`} style={{ transition: windowWidth > 768 ? "width 700ms ease-in-out" : "transform 700ms ease-in-out" }}>
      <div className='w-full h-full flex items-center justify-center p-5'>
        <div onClick={() => setSwitchImage(false)} className='md:hidden absolute left-2/4 -translate-x-2/4 top-24 z-50'>
          <BsFillArrowLeftCircleFill className="text-5xl" />
        </div>
        <div className='flex flex-col items-center justify-center relative w-full h-full'>
          {
            imageToEdit.url && <canvas width={widthOfCanvas} height={widthOfCanvas} className=' aspect-square z-50' ref={canvasRef}></canvas>
          }
          <Transition as={Fragment} show={imageToEdit.url && mode ? true : false} enter="transition-transform duration-300" enterFrom="scale-0" enterTo="scale-100" leave="transition-transform duration-300" leaveFrom="scale-100" leaveTo="scale-0">


            <div className='w-full h-full drag-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4'>
              <Image onLoad={() => {
                if (canvasImage.current) {
                  setWidthOfCanvas(canvasImage.current.clientWidth);
                }
              }} ref={canvasImage} id='image-canvas' width={400} height={400} style={{ width: widthOfCanvas || 400, height: widthOfCanvas || 400 }} className='object-cover drag-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 z-10' src={imageToEdit.url} alt="" ></Image>
              <div className='w-full absolute left-2/4 bottom-12 -translate-x-2/4 flex flex-col child:w-full gap-2  justify-between '>
                <button onClick={() => setImageToEdit({ file: null, url: "" })} className='flex items-center justify-center gap-3 px-8 py-2 border-white border rounded-lg hover:bg-slate-600 transition-colors'><BsFillTrashFill />Remove image</button>
                <button onClick={clearCanvas} className='flex items-center justify-center gap-3 px-8 py-2 border-white border rounded-lg hover:bg-slate-600 transition-colors'><BsBrush />Clear Drawing</button>
              </div>
            </div>
          </Transition>

          {!imageToEdit.url && <div className='flex flex-col gap-2 items-center'>
            <span className=' whitespace-nowrap'>Start uploading an image!</span>
            <button className='px-12 py-2 border border-y-gray-100 rounded-xl font-semibold' onClick={() => mode && document.getElementById("add-image")?.click()}>
              Upload an image
            </button>
          </div>}
        </div>
      </div>
    </div>
  )
}