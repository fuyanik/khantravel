'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const GreatTourTrip = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)

  const tours = [
    {
      id: 1,
      image: '/istanbul.jpg',
      title: '8 Hour Istanbul Tour with Driver',
      subtitle: 'Total Price for 1-7 People',
      price: '150€',
      popular: true,
      highlights: ['Blue Mosque', 'Hagia Sophia', 'Grand Bazaar'],
      duration: '8 hours'
    },
    {
      id: 2,
      image: '/web-banner.jpg',
      title: '12 Hour Istanbul Tour Driver',
      subtitle: 'Total Price for 1-7 People',
      price: '225€',
      popular: true,
      highlights: ['Bosphorus Cruise', 'Topkapi Palace', 'Basilica Cistern'],
      duration: '12 hours'
    },
    {
      id: 3,
      image: '/istanbul.jpg',
      title: 'Dinner Cruise on Bosphorus',
      subtitle: 'Alcohol & Entertainment Included',
      price: '50€',
      highlights: ['Turkish Show', 'Live Music', 'Traditional Dinner'],
      duration: '4 hours'
    },
    {
      id: 4,
      image: '/web-banner.jpg',
      title: 'Cappadocia Hot Air Balloon',
      subtitle: 'Sunrise Experience',
      price: '180€',
      popular: true,
      highlights: ['Fairy Chimneys', 'Champagne Toast', 'Flight Certificate'],
      duration: '1 hour flight'
    },
    {
      id: 5,
      image: '/istanbul.jpg',
      title: 'Private Ephesus Tour',
      subtitle: 'Ancient City Experience',
      price: '200€',
      highlights: ['Library of Celsus', 'Temple of Artemis', 'Virgin Mary House'],
      duration: 'Full day'
    },
    {
      id: 6,
      image: '/web-banner.jpg',
      title: 'Pamukkale Cotton Castle Tour',
      subtitle: 'Natural Thermal Pools',
      price: '120€',
      highlights: ['White Terraces', 'Hierapolis Ancient City', 'Thermal Springs'],
      duration: '6 hours'
    },
    {
      id: 7,
      image: '/istanbul.jpg',
      title: 'Troy Ancient City Tour',
      subtitle: 'Legendary City Adventure',
      price: '85€',
      highlights: ['Trojan Horse', 'Ancient Ruins', 'Archaeological Museum'],
      duration: '5 hours'
    },
    {
      id: 8,
      image: '/web-banner.jpg',
      title: 'Princes Islands Ferry Tour',
      subtitle: 'Peaceful Island Escape',
      price: '65€',
      popular: true,
      highlights: ['Horse Carriage', 'Beach Time', 'Local Cuisine'],
      duration: '7 hours'
    },
    {
      id: 9,
      image: '/istanbul.jpg',
      title: 'Antalya Waterfalls Tour',
      subtitle: 'Nature & Adventure',
      price: '90€',
      highlights: ['Duden Falls', 'Boat Trip', 'City Center'],
      duration: '4 hours'
    }
  ]

  // Counter Animation Hook
  const useCounter = (end, duration = 2000, shouldStart = false) => {
    const [count, setCount] = useState(0)
    
    useEffect(() => {
      if (!shouldStart) return
      
      let startTimestamp = null
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp
        const progress = Math.min((timestamp - startTimestamp) / duration, 1)
        setCount(Math.floor(progress * end))
        if (progress < 1) {
          window.requestAnimationFrame(step)
        }
      }
      window.requestAnimationFrame(step)
    }, [end, duration, shouldStart])
    
    return count
  }

  const clientsCount = useCounter(500, 2000, statsVisible)
  const routesCount = useCounter(50, 2000, statsVisible)
  const ratingCount = useCounter(49, 2000, statsVisible)

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

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
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Stats Section - Top */}
        <div ref={statsRef} className="bg-gradient-to-r from-blue-50 via-purple-50 to-amber-50 p-8 rounded-2xl shadow-lg mb-16">
          <div className="flex justify-center items-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {clientsCount}+
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Happy Clients</div>
            </div>
            <div className="w-px h-16 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {routesCount}+
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Tour Routes</div>
            </div>
            <div className="w-px h-16 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {(ratingCount / 10).toFixed(1)}★
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">Average Rating</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="lg:w-2/5 space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium animate-pulse">
                🔥 Most Popular Tours
              </span>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                How about a great
                <span className="text-red-600 block mt-2">tour trip?</span>
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
              <div className=" overflow-hidden pb-1 pt-4 px-1 rounded-2xl">
                <div 
                  className="flex gap-6 transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * (320 + 24)}px)`, // 320px card width + 24px gap
                    width: `${tours.length * (320 + 24)}px`
                  }}
                >
                  {tours.map((tour, index) => (
                    <div
                      key={tour.id}
                      className="w-80 flex-shrink-0 group cursor-pointer" // Fixed width
                      onClick={() => window.location.href = `/tour/${tour.id}`}
                    >
                      <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                        {/* Image Container */}
                        <div className="relative h-48 overflow-hidden"> {/* Fixed height */}
                          <Image
                            src={tour.image}
                            alt={tour.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {tour.popular && (
                            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium">
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
                        <div className="p-5 space-y-3"> {/* Restored original size */}
                          <h3 className="font-bold text-gray-900 text-lg line-clamp-2 group-hover:text-red-600 transition-colors">
                            {tour.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {tour.subtitle}
                          </p>
                          
                          {/* Highlights */}
                          <div className="flex flex-wrap gap-2">
                            {tour.highlights.slice(0, 3).map((highlight, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">
                                {highlight}
                              </span>
                            ))}
                          </div>

                          {/* Price and Action */}
                          <div className="flex items-center justify-between pt-3 border-t">
                            <div>
                              <div className="text-2xl font-bold text-gray-900">
                                {tour.price}
                              </div>
                              <div className="text-xs text-gray-500">per person</div>
                            </div>
                            <button className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
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
                        ? 'w-8 bg-red-600'
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
    </section>
  )
}

export default GreatTourTrip
