"use client"

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
     

    </>
  );
};

export default Navbar;