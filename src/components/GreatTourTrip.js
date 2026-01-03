'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

const GreatTourTrip = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const tours = [
    {
      id: 1,
      image: '/galata.jpeg',
      title: 'Historic Istanbul Walking Tour',
      subtitle: 'Sultanahmet District Discovery',
      price: '150€',
      popular: true,
      highlights: ['Blue Mosque', 'Hagia Sophia', 'Grand Bazaar'],
      duration: '8 hours'
    },
    {
      id: 2,
      image: '/beylerbeyi.jpeg',
      title: 'Bosphorus & Palaces Tour',
      subtitle: 'Ottoman Heritage Experience',
      price: '225€',
      popular: true,
      highlights: ['Bosphorus Cruise', 'Topkapi Palace', 'Basilica Cistern'],
      duration: '12 hours'
    },
    {
      id: 3,
      image: '/emin%C3%B6n%C3%BC.jpeg',
      title: 'Eminönü Food & Culture Tour',
      subtitle: 'Traditional Flavors Experience',
      price: '50€',
      highlights: ['Spice Bazaar', 'Street Food', 'Galata Bridge'],
      duration: '4 hours'
    },
    {
      id: 4,
      image: '/kizkulesi.jpeg',
      title: 'Maiden\'s Tower & Asian Side',
      subtitle: 'Iconic Tower & Üsküdar Tour',
      price: '180€',
      popular: true,
      highlights: ['Maiden\'s Tower', 'Üsküdar Mosque', 'Çamlıca Hill'],
      duration: '6 hours'
    },
    {
      id: 5,
      image: '/kad%C4%B1k%C3%B6y.jpeg',
      title: 'Golden Horn Historical Tour',
      subtitle: 'Byzantine & Ottoman Heritage',
      price: '200€',
      highlights: ['Chora Church', 'Fener District', 'Pierre Loti Hill'],
      duration: '7 hours'
    },
    {
      id: 6,
      image: '/belgrad.jpeg',
      title: 'Belgrade Forest Nature Tour',
      subtitle: 'Green Escape from City Life',
      price: '120€',
      highlights: ['Forest Hiking', 'Ottoman Dams', 'Picnic Areas'],
      duration: '6 hours'
    },
    {
      id: 7,
      image: '/bostanc%C4%B1.jpeg',
      title: 'Asian Side Coastal Tour',
      subtitle: 'Bostancı to Kadıköy Journey',
      price: '85€',
      highlights: ['Sea Promenade', 'Local Markets', 'Moda District'],
      duration: '5 hours'
    },
    {
      id: 8,
      image: '/rumelifeneri.jpeg',
      title: 'Rumeli Fortress & Bosphorus',
      subtitle: 'Medieval Fortress Experience',
      price: '65€',
      popular: true,
      highlights: ['Rumeli Fortress', 'Bosphorus Views', 'Fish Markets'],
      duration: '7 hours'
    },
    {
      id: 9,
      image: '/kuzguncuk.jpeg',
      title: 'Kuzguncuk Village Tour',
      subtitle: 'Hidden Gem of Istanbul',
      price: '90€',
      highlights: ['Colorful Houses', 'Old Synagogue', 'Bosphorus Cafes'],
      duration: '4 hours'
    },
    {
      id: 10,
      image: '/%C5%9File.jpeg',
      title: 'Şile Beach Day Trip',
      subtitle: 'Black Sea Coastal Escape',
      price: '110€',
      popular: true,
      highlights: ['Sandy Beaches', 'Şile Lighthouse', 'Fresh Seafood'],
      duration: '10 hours'
    },
    {
      id: 11,
      image: '/polenezk%C3%B6y.jpeg',
      title: 'Polonezköy Nature Retreat',
      subtitle: 'Polish Village in Istanbul',
      price: '95€',
      highlights: ['Horse Riding', 'Nature Walks', 'Organic Food'],
      duration: '6 hours'
    }
  ]

  // Slider logic with proper transform
  const cardsPerView = 3
  const maxSlides = tours.length - cardsPerView + 1

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        nextSlide()
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [currentSlide, isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % maxSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  return (
    <section className="py-8 md:py-20 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="md:container md:mx-auto md:px-4">
        {/* Mobile Header */}
        <div className="md:hidden px-5 mb-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium mb-2">
            🔥 Most Popular Tours
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            How about a great <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">tour trip?</span>
          </h2>
          <p className="text-sm text-gray-600">
            Create unforgettable memories with our unique tours!
          </p>
        </div>

        {/* Mobile Tours Swiper - Manual + Auto */}
        <div className="md:hidden">
          <Swiper
            modules={[FreeMode, Pagination, Autoplay]}
            spaceBetween={12}
            slidesPerView={1.3}
            centeredSlides={false}
            freeMode={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ 
              clickable: true,
              dynamicBullets: true
            }}
            className="!px-5 !pb-10"
          >
            {tours.map((tour) => (
              <SwiperSlide key={tour.id}>
                <div 
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => window.location.href = `/tour/${tour.id}`}
                >
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {tour.popular && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-black to-gray-800 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                        Popular
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px]">
                      {tour.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5 line-clamp-1">
                      {tour.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {tour.subtitle}
                    </p>
                    
                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {tour.highlights.slice(0, 2).map((highlight, idx) => (
                        <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-lg font-bold text-gray-900">{tour.price}</span>
                        <span className="text-[10px] text-gray-500 ml-1">per person</span>
                      </div>
                      <div className="w-7 h-7 bg-gradient-to-r from-black to-gray-800 text-white rounded-full flex items-center justify-center">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex flex-col lg:flex-row items-center gap-12 container mx-auto px-4">
            {/* Left Content */}
            <div className="lg:w-2/5 space-y-6">
              <div className="space-y-4">
                <span className="inline-block px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium animate-pulse">
                  🔥 Most Popular Tours
                </span>
                
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  How about a great
                  <span className="bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent block mt-2">tour trip?</span>
                </h2>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  Get ready to create unforgettable memories with our tours, filled with unique routes and personalized adventures!
                </p>
              </div>
            </div>

            {/* Right Carousel */}
            <div className="lg:w-3/5 relative">
              <div className="relative">
                {/* Carousel Container */}
                <div className="overflow-hidden pb-1 pt-4 px-1 rounded-2xl">
                  <div 
                    className="flex gap-6 transition-transform duration-700 ease-in-out"
                    style={{
                      transform: `translateX(-${currentSlide * (320 + 24)}px)`,
                      width: `${tours.length * (320 + 24)}px`
                    }}
                  >
                    {tours.map((tour) => (
                      <div
                        key={tour.id}
                        className="w-80 flex-shrink-0 group cursor-pointer"
                        onClick={() => window.location.href = `/tour/${tour.id}`}
                      >
                        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 overflow-hidden h-[420px] flex flex-col">
                          {/* Image Container */}
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={tour.image}
                              alt={tour.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              unoptimized
                            />
                            {tour.popular && (
                              <div className="absolute top-4 left-4 bg-gradient-to-r from-black to-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium">
                                Popular
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-20">
                              <div className="absolute bottom-3 left-4 text-white">
                                <div className="text-xs opacity-90">{tour.duration}</div>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col justify-between">
                            <div className="space-y-3">
                              <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-blue-900 transition-colors h-14 flex items-center">
                                {tour.title}
                              </h3>
                              <p className="text-sm text-gray-600 h-5">
                                {tour.subtitle}
                              </p>
                              
                              {/* Highlights */}
                              <div className="flex flex-wrap gap-2 h-16 content-start">
                                {tour.highlights.slice(0, 3).map((highlight, idx) => (
                                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Price and Action */}
                            <div className="flex items-center justify-between pt-3 border-t mt-auto">
                              <div>
                                <div className="text-2xl font-bold text-gray-900">
                                  {tour.price}
                                </div>
                                <div className="text-xs text-gray-500">per person</div>
                              </div>
                              <button className="w-10 h-10 bg-gradient-to-r from-black to-gray-800 text-white rounded-full flex items-center justify-center group-hover:from-gray-800 group-hover:to-gray-700 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevSlide()
                    setIsAutoPlaying(false)
                    setTimeout(() => setIsAutoPlaying(true), 5000)
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10 cursor-pointer"
                  aria-label="Previous slide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextSlide()
                    setIsAutoPlaying(false)
                    setTimeout(() => setIsAutoPlaying(true), 5000)
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10 cursor-pointer"
                  aria-label="Next slide"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Dots Indicator */}
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: maxSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? 'w-8 bg-gradient-to-r from-gray-900 to-blue-900'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default GreatTourTrip
