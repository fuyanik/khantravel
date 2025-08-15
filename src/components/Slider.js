"use client"

import React, { useState } from "react";

const slides = [
  (
    <div key="slide-0" className="flex flex-col justify-center w-full h-full px-12">
      <span className="text-xl  mb-2">EXTRA DISCOUNT </span>
      <span className="text-4xl  ">Book your round trip reservation to <span className="font-bold">earn %10  </span>  discount</span>
    </div>
  ),
  (
    <div key="slide-1" className="flex flex-col justify-center w-full h-full px-12">
      <span className="text-xl  mb-2">EXTRA DISCOUNT </span>
      <span className="text-4xl  ">Book your round trip reservation to <span className="font-bold">earn %10  </span>  discount</span>
    </div>
  ),
  (
    <div key="slide-2" className="flex flex-col justify-center w-full h-full px-12">
      <span className="text-xl  mb-2">EXTRA DISCOUNT </span>
      <span className="text-4xl  ">Book your round trip reservation to <span className="font-bold">earn %10  </span>  discount</span>
    </div>
  ),
  (
    <div key="slide-3" className="flex flex-col justify-center w-full h-full px-12">
      <span className="text-xl  mb-2">EXTRA DISCOUNT </span>
      <span className="text-4xl  ">Book your round trip reservation to <span className="font-bold">earn %10  </span>  discount</span>
    </div>
  ),
  (
    <div key="slide-4" className="flex flex-col justify-center w-full h-full px-12">
      <span className="text-xl  mb-2">EXTRA DISCOUNT </span>
      <span className="text-4xl  ">Book your round trip reservation to <span className="font-bold">earn %10  </span>  discount</span>
    </div>
  ),
];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState("right"); // 'right' veya 'left'
  const total = slides.length;

  const prevSlide = () => {
    setDirection("left");
    setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  };
  const nextSlide = () => {
    setDirection("right");
    setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative flex items-center justify-center w-[50vw]  h-40  z-10">
      {/* Sol Ok */}
      <button
        onClick={prevSlide}
        className="  bg-white rounded-full shadow p-7 z-30 cursor-pointer hover:bg-gray-100 border-2 border-gray-200 flex items-center justify-center pointer-events-auto"
        style={{ width: 48, height: 48 }}
        aria-label="Önceki"
      >
        <span className="text-2xl flex items-center justify-center">&#x2039;</span>
      </button>

      {/* Slide */}
      <div className="relative w-full h-full z-0 flex items-center justify-center">
        <div
          key={current}
          className={`absolute w-full h-full rounded-2xl flex items-center justify-center transition-transform duration-500 pointer-events-none`}
          style={{
            transform:
              direction === "right"
                ? "translateX(0%)"
                : "translateX(0%)",
            animation:
              direction === "right"
                ? "slideInRight 0.5s forwards"
                : "slideInLeft 0.5s forwards",
          }}
        >
          {slides[current]}
        </div>
      </div>

      {/* Sağ Ok */}
      <button
        onClick={nextSlide}
        className=" bg-white rounded-full shadow p-7 cursor-pointer z-30 hover:bg-gray-100 border-2 border-gray-200 flex items-center justify-center pointer-events-auto"
        style={{ width: 48, height: 48 }}
        aria-label="Sonraki"
      >
        <span className="text-2xl flex items-center justify-center">&#x203A;</span>
      </button>


      {/* Animasyonlar için style ekle */}
      <style jsx>{`
        @keyframes slideInRight {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        @keyframes slideInLeft {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  );
} 