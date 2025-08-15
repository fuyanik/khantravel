"use client"

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";

const Navbar = () => {
  const [isScroll, setIsScroll] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isSideMenu, setIsSideMenu] = useState(false);
  const [sideMenuClosing, setSideMenuClosing] = useState(false);
  const sideMenuRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
    });
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Side menu kapatma fonksiyonu
  const closeSideMenu = () => {
    setSideMenuClosing(true);
    setTimeout(() => {
      setIsSideMenu(false);
      setSideMenuClosing(false);
    }, 400); // animasyon süresiyle aynı olmalı
  };

  return (
    <>
      {/* Side Menu */}
      {isSideMenu && (
        <div
          ref={sideMenuRef}
          className={`flex flex-col gap-12 w-screen h-screen fixed bg-white z-50 px-8 py-5 ${sideMenuClosing ? "animate-rightToLeft" : "animate-leftToRight"}`}
        >
          {/*  Logo & Close Button */}
          <div className='flex justify-between items-center w-full border-b border-primTrans '> 
            <Link href="/" onClick={closeSideMenu}> <img className='w-40' src='https://vitamu.imgix.net/MEDIFYRE-6.png?w=6400&h=3600&ar=6400%3A3600&auto=compress' alt='medifyre logo'/> </Link> 
            <div onClick={closeSideMenu} className=' p-2' > <svg  xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">  <path fill="#5D9695" d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>   </svg>  </div>
          </div>

          {/*  Links */}  
          <div className='flex flex-col gap-5 text-second font-bold font-product text-2xl'>
            <Link href="/sample-reports"> <p data-aos-delay="200" data-aos-duration="300" data-aos="fade-right" className='cursor-pointer hover:opacity-60 duration-300'> Sample Reports</p> </Link>
            <Link href="/why-second-opinion"> <p data-aos-delay="300" data-aos-duration="300" data-aos="fade-right"  className='cursor-pointer hover:opacity-60 duration-300'>Why Second Opinion</p> </Link>
            <Link href="/how-works"> <p data-aos-delay="400" data-aos-duration="300" data-aos="fade-right"  className='cursor-pointer hover:opacity-60 duration-300'>How It Works</p> </Link>
            <Link href="/contact"> <p data-aos-delay="500" data-aos-duration="300" data-aos="fade-right"  className='cursor-pointer hover:opacity-60 duration-300'>Contact</p> </Link>
            <Link href="/faq"> <p data-aos-delay="600" data-aos-duration="300" data-aos="fade-right"  className='cursor-pointer hover:opacity-60 duration-300'>Faq</p> </Link>
          </div>
        </div>
      )}

      {/* Navbar */}
      {!isSideMenu && (
        <div className="flex justify-center w-full fixed lg:top-8 top-4 z-40">
          <nav
            className={`flex items-center justify-between py-4 pl-2 pr-4 text-sm self-center w-[90vw] ${  isScroll ? "sm:w-[795px]" : "sm:w-[735px]"  } ${isScroll ? "bg-white/70 " : "bg-white/20 "} ${isScroll ? "shadow-lg": "shadow-sm"} lg:h-[56px] h-[62px]  rounded-lg duration-700  backdrop-filter backdrop-blur-md`} >

            <div className="flex items-center justify-center lg:gap-4 gap-2">
              <Link href="/">
                <img
                  className={`${
                    isScroll ? "lg:w-21 w-21 mb-1" : "lg:w-20 w-20"
                  } duration-500`}
                  src="https://vitamu.imgix.net/logonewgen.png"
                  alt='medifyre logo'
                />
              </Link>

              <div className="w-[1px] h-7 bg-gray-500 opacity-25"></div>

              <div className="sm:flex hidden gap-6 justify-center items-center text-black">
                <Link href="/sample-reports">
                  <p    className="cursor-pointer hover:text-second duration-300">
                    Test 
                  </p>
                </Link>
                <Link href="/why-second-opinion">
                  <p className="cursor-pointer hover:text-second duration-300">
                    Test Test 2
                  </p>
                </Link>
                <Link href="/contact">
                  <p className="cursor-pointer hover:text-second duration-300">
                  Test Test Test 3
                  </p>
                </Link>
              </div>
            </div>

            <div className="lg:flex hidden w-[1px] h-7 bg-gray-500 opacity-25"></div>

            <div className="flex items-center justify-center gap-4 text-black">
              {!isScroll && (
                <Link href="/login">
                  <div className="items-center justify-center  bg-white hover:bg-second hover:text-white duration-500 rounded-lg px-4 py-[6px] cursor-pointer border border-primTrans">
                    Dashboard
                  </div>
                </Link>
              )}
              {isScroll && (
                <Link href="/login">
                  <div className="hidden lg:flex hover:text-second items-center justify-center cursor-pointer duration-300 border-b">
                  Dashboard
                  </div>
                </Link>
              )}

              {isScroll && (
                <div className="flex relative items-center justify-center font-procut text-sm">


                  <Link href="#" onMouseMove={() => setIsHover(true)} >
                    <div  data-aos-duration="500" data-aos="fade-up"  className="items-center justify-center  bg-black hover:bg-prim text-white hover:text-white duration-500 rounded-lg px-4 py-[6px] cursor-pointer border border-primTrans">
                      Get Started
                    </div>
                  </Link>
                </div>
              )}
              {isScroll && (
                <div
               
                  onClick={() => setIsSideMenu(true)}
                  className="lg:hidden flex items-center p-2 justify-center cursor-pointer hover:opacity-60 duration-300"
                >
                  <img
                    width="19"
                    height="19"
                    src="https://img.icons8.com/ios/000000/50/menu--v1.png"
                    alt="menu--v1"
                  />
                </div>
              )}
            </div>
          </nav>
        </div>
      )}

    </>
  );
};

export default Navbar;