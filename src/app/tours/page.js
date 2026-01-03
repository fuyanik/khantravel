"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const tours = [
  {
    id: 1,
    title: "Bosphorus Sunset Cruise",
    description: "Experience the magic of Istanbul with a sunset cruise along the Bosphorus strait. See iconic landmarks as the sun sets over the city.",
    image: "/kizkulesi.jpeg",
    duration: "3 Hours",
    price: "€75",
    rating: 4.9,
    reviews: 128,
    highlights: ["Sunset views", "Dolmabahçe Palace", "Maiden's Tower", "Galata Bridge"],
    featured: true
  },
  {
    id: 2,
    title: "Old City Walking Tour",
    description: "Explore the historic heart of Istanbul including Hagia Sophia, Blue Mosque, Topkapi Palace, and the Grand Bazaar.",
    image: "/galata.jpeg",
    duration: "6 Hours",
    price: "€95",
    rating: 4.8,
    reviews: 256,
    highlights: ["Hagia Sophia", "Blue Mosque", "Grand Bazaar", "Topkapi Palace"]
  },
  {
    id: 3,
    title: "Princes' Islands Day Trip",
    description: "Escape the city and enjoy a peaceful day on the car-free Princes' Islands with swimming, cycling, and local cuisine.",
    image: "/bostancı.jpeg",
    duration: "8 Hours",
    price: "€120",
    rating: 4.7,
    reviews: 89,
    highlights: ["Ferry ride", "Büyükada Island", "Horse carriage", "Swimming"]
  },
  {
    id: 4,
    title: "Turkish Food Tour",
    description: "Taste your way through Istanbul's culinary scene with visits to local markets, street food vendors, and traditional restaurants.",
    image: "/eminönü.jpeg",
    duration: "4 Hours",
    price: "€85",
    rating: 4.9,
    reviews: 167,
    highlights: ["Spice Bazaar", "Street food", "Turkish coffee", "Baklava tasting"]
  },
  {
    id: 5,
    title: "Asian Side Discovery",
    description: "Cross to the Asian side and explore charming neighborhoods like Kadıköy and Üsküdar with their local markets and cafes.",
    image: "/kadıköy.jpeg",
    duration: "5 Hours",
    price: "€70",
    rating: 4.6,
    reviews: 72,
    highlights: ["Kadıköy Market", "Moda coast", "Üsküdar mosque", "Local cafes"]
  },
  {
    id: 6,
    title: "Black Sea Village Tour",
    description: "Discover the natural beauty of the Black Sea coast with visits to Şile's beaches and Polonezköy's forests.",
    image: "/şile.jpeg",
    duration: "Full Day",
    price: "€150",
    rating: 4.8,
    reviews: 54,
    highlights: ["Şile Beach", "Polonezköy", "Nature walks", "Local lunch"]
  }
]

export default function ToursPage() {
  const [selectedTour, setSelectedTour] = useState(null)

  useEffect(() => {
    document.title = "Tours - Khan Travel"
  }, [])

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -ml-40 -mb-40"></div>
        </div>
        
        <div className="relative z-10 px-5 md:container md:mx-auto">
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-medium mb-4">
              Explore Istanbul
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Istanbul <span className="text-gray-400">Tours</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Discover Istanbul with our expertly guided tours. From historic landmarks to hidden gems, we have the perfect experience for you.
            </p>
          </div>
        </div>
      </section>

      {/* Tours Grid */}
      <main className="bg-gray-50 min-h-screen py-8 md:py-16">
        {/* Mobile View */}
        <div className="md:hidden px-5 space-y-4">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-[16/10]">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className="object-cover"
                />
                {tour.featured && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                    Featured
                  </span>
                )}
                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                  <span className="text-black font-bold text-sm">{tour.price}</span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{tour.rating}</span>
                    <span className="text-xs text-gray-500">({tour.reviews})</span>
                  </div>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{tour.duration}</span>
                </div>
                
                <h3 className="font-bold text-gray-900 text-lg mb-2">{tour.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {tour.highlights.slice(0, 3).map((highlight, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {highlight}
                    </span>
                  ))}
                </div>
                
                <button className="w-full py-3 bg-gradient-to-r from-black to-gray-900 text-white rounded-xl font-medium text-sm">
                  Book This Tour
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block container mx-auto px-4">
          {/* Featured Tour */}
          {tours.find(t => t.featured) && (
            <div className="mb-12">
              {(() => {
                const featuredTour = tours.find(t => t.featured)
                return (
                  <div className="relative rounded-3xl overflow-hidden bg-white shadow-lg">
                    <div className="grid md:grid-cols-2">
                      <div className="relative aspect-[4/3] md:aspect-auto">
                        <Image
                          src={featuredTour.image}
                          alt={featuredTour.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <span className="inline-block px-4 py-1.5 bg-black text-white text-sm font-medium rounded-full mb-4 w-fit">
                          Featured Tour
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredTour.title}</h2>
                        <p className="text-gray-600 text-lg mb-6">{featuredTour.description}</p>
                        
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex items-center gap-1">
                            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-semibold">{featuredTour.rating}</span>
                            <span className="text-gray-500">({featuredTour.reviews} reviews)</span>
                          </div>
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-600">{featuredTour.duration}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-8">
                          {featuredTour.highlights.map((highlight, idx) => (
                            <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                              {highlight}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <span className="text-3xl font-bold text-gray-900">{featuredTour.price}</span>
                          <span className="text-gray-500">per person</span>
                          <button className="ml-auto px-8 py-3 bg-gradient-to-r from-black to-gray-900 text-white rounded-full font-medium hover:shadow-lg transition-shadow">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Tour Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.filter(t => !t.featured).map((tour) => (
              <div key={tour.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={tour.image}
                    alt={tour.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full">
                    <span className="text-black font-bold">{tour.price}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">{tour.rating}</span>
                      <span className="text-gray-500 text-sm">({tour.reviews})</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 text-sm">{tour.duration}</span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-xl mb-2">{tour.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tour.highlights.slice(0, 3).map((highlight, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {highlight}
                      </span>
                    ))}
                  </div>
                  
                  <button className="w-full py-3 bg-gradient-to-r from-black to-gray-900 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

