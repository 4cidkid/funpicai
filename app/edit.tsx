"use client";
import Image from 'next/image';
import { image } from '@/types/types';
import { FaBrush } from 'react-icons/fa'
import { useState, useRef, useEffect, Fragment } from 'react'
import { Transition } from '@headlessui/react';
import { BsFillTrashFill } from "react-icons/bs"
export default function Edit({ mode, image }: { mode: boolean, image: image }): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null)
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

    canvas.addEventListener("mousedown", (e) => {
      console.log("mousedown");
      isDrawing = true;

      const canvasStyle = getComputedStyle(canvas);
      const paddingLeft = parseInt(canvasStyle.getPropertyValue("padding-left"));
      const paddingTop = parseInt(canvasStyle.getPropertyValue("padding-top"));

      const boundingRect = canvas.getBoundingClientRect();
      const offsetX = e.clientX - boundingRect.left - paddingLeft;
      const offsetY = e.clientY - boundingRect.top - paddingTop;

      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY);
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!isDrawing) return;

      const canvasStyle = getComputedStyle(canvas);
      const paddingLeft = parseInt(canvasStyle.getPropertyValue("padding-left"));
      const paddingTop = parseInt(canvasStyle.getPropertyValue("padding-top"));

      const boundingRect = canvas.getBoundingClientRect();
      const offsetX = e.clientX - boundingRect.left - paddingLeft;
      const offsetY = e.clientY - boundingRect.top - paddingTop;

      const x = offsetX;
      const y = offsetY;

      console.log(x, y);
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
  }, [image]);
  return (
    <div className={`${mode ? "w-[40%]" : " w-[0px]"} h-full text-white bg-[#202123] overflow-hidden`} style={{ transition: "width 700ms ease-in-out" }}>
      <div className='w-full h-full flex items-center justify-center p-5'>
        <div className='flex flex-col items-center justify-center relative w-full h-full'>
          {
            image.url && <canvas width={500} height={500} className=' aspect-square z-50' ref={canvasRef}></canvas>
          }
          <Transition as={Fragment} show={image.url && mode ? true : false} enter="transition-transform duration-300" enterFrom="scale-0" enterTo="scale-100" leave="transition-transform duration-300" leaveFrom="scale-100" leaveTo="scale-0">


            <div className='w-full h-full drag-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4'>
              <Image width={500} height={500} className='drag-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 z-10' src={image.url} alt="" ></Image>
              <button onClick={clearCanvas} className='absolute left-2/4 bottom-0 -translate-x-2/4 flex items-center justify-center gap-3 px-12 py-2 border-white border rounded-lg hover:bg-slate-600 transition-colors'><BsFillTrashFill/>Clear</button>
            </div>
          </Transition>

          {!image.url && <span className=' whitespace-nowrap' >Start uploading an image!</span>}

        </div>
      </div>
    </div>
  )
}