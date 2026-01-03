'use client'
import React from 'react'

const HeroSection = () => {
  return (
    <>
      {/* Mobile Hero Section - Panoramic Image with Quote */}
      <div className="md:hidden relative w-full h-[180px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=2071&auto=format&fit=crop')`
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        
        {/* Quote Text */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-white text-sm font-light tracking-wider mb-1 opacity-90">
              DISCOVER
            </p>
            <h1 className="text-white text-2xl font-bold tracking-tight">
              Your Journey Starts Here
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="w-8 h-[1px] bg-white/50"></span>
              <span className="text-white/80 text-xs">Istanbul, Turkey</span>
              <span className="w-8 h-[1px] bg-white/50"></span>
            </div>
          </div>
        </div>
        
      </div>
    </>
  )
}

export default HeroSection

