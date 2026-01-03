"use client"

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isScroll, setIsScroll] = useState(false);
  const [isSideMenu, setIsSideMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const sideMenuRef = useRef(null);

  // Set mounted after first render to prevent animation flash
  useEffect(() => {
    setMounted(true);
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
      setIsSideMenu(false);
  };

  // Body scroll lock when sidebar is open
  useEffect(() => {
    if (isSideMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSideMenu]);

  const menuItems = [
    { 
      name: 'Home', 
      href: '/', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Istanbul Blog', 
      href: '/blog', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    { 
      name: 'Tours', 
      href: '/tours', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    { 
      name: 'About Us', 
      href: '/about', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      name: 'Contact', 
      href: '/contact', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScroll ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className={`text-2xl font-bold transition-colors duration-300 ${
                isScroll ? 'text-gray-900' : 'text-white'
              }`}>
                Khan<span className="font-light">Travel</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="flex items-center gap-8">
              {menuItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-300 hover:opacity-70 ${
                    isScroll ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-4">
              <a 
                href="tel:+905551234567"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                  isScroll 
                    ? 'bg-black text-white hover:bg-gray-900' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className={`md:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScroll ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Hamburger Menu Button */}
          <button 
            onClick={() => setIsSideMenu(true)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <span className="w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300"></span>
            <span className="w-5 h-0.5 bg-gray-800 rounded-full transition-all duration-300"></span>
            <span className="w-3.5 h-0.5 bg-gray-800 rounded-full self-start ml-2.5 transition-all duration-300"></span>
          </button>

          {/* Logo - Center */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              Khan<span className="font-light">Travel</span>
            </span>
          </Link>

          {/* Right side - Phone icon */}
          <a href="tel:+905551234567" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-black to-gray-900 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay - only show after mounted to prevent animation flash */}
      {mounted && (
        <div 
          className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-all duration-500 ease-out ${
            isSideMenu ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}
          onClick={closeSideMenu}
        />
      )}

      {/* Mobile Sidebar - only show after mounted to prevent animation flash */}
      {mounted && (
        <div 
          ref={sideMenuRef}
          className={`md:hidden fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[101] shadow-2xl transition-all duration-500 ease-out ${
            isSideMenu ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
        {/* Sidebar Header */}
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-black via-gray-900 to-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">
              Khan<span className="font-light">Travel</span>
            </span>
            <button 
              onClick={closeSideMenu}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Premium Transfer & Tour Services</p>
        </div>

        {/* Menu Items */}
        <div className="py-4">
          {menuItems.map((item, index) => (
            <Link 
              key={item.name}
              href={item.href}
              onClick={closeSideMenu}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-all duration-300 transform ${
                isSideMenu ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}
              style={{ 
                transitionDelay: isSideMenu ? `${index * 75 + 150}ms` : '0ms'
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700">
                {item.icon}
              </div>
              <span className="text-gray-800 font-medium">{item.name}</span>
              <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-gray-100"></div>

        {/* Quick Actions */}
        <div className="p-6 space-y-3">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Quick Actions</p>
          
          <a 
            href="tel:+905551234567"
            className={`flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-black to-gray-900 text-white rounded-xl transition-all duration-300 transform ${
              isSideMenu ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}
            style={{ transitionDelay: isSideMenu ? '500ms' : '0ms' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-medium">Call Now</span>
          </a>

          <a 
            href="https://wa.me/905551234567"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 px-4 py-3.5 bg-green-500 text-white rounded-xl transition-all duration-300 transform ${
              isSideMenu ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}
            style={{ transitionDelay: isSideMenu ? '575ms' : '0ms' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="font-medium">WhatsApp</span>
          </a>
        </div>

        </div>
      )}

      {/* Spacer for fixed navbar on mobile */}
      <div className="md:hidden h-[60px]"></div>
    </>
  );
};

export default Navbar;
