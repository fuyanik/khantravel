'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

const PopularDestinations = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredCard, setHoveredCard] = useState(null)

  const destinations = [
    {
      id: 1,
      name: 'Istanbul',
      country: 'Turkey',
      image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?q=80&w=1200&auto=format&fit=crop',
      category: 'city',
      price: 'From €45',
      duration: '3-7 days',
      rating: 4.9,
      reviews: 2341,
      description: 'Where East meets West',
      highlights: ['Hagia Sophia', 'Blue Mosque', 'Grand Bazaar'],
      bestTime: 'Apr-May, Sep-Nov',
      popular: true
    },
    {
      id: 2,
      name: 'Cappadocia',
      country: 'Turkey',
      image: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?q=80&w=1200&auto=format&fit=crop',
      category: 'nature',
      price: 'From €120',
      duration: '2-4 days',
      rating: 4.8,
      reviews: 1876,
      description: 'Fairy chimneys and hot air balloons',
      highlights: ['Hot Air Balloon', 'Underground Cities', 'Göreme'],
      bestTime: 'Apr-Oct',
      popular: true
    },
    {
      id: 3,
      name: 'Antalya',
      country: 'Turkey',
      image: 'https://images.unsplash.com/photo-1507501336603-6e31db2be093?q=80&w=1200&auto=format&fit=crop',
      category: 'beach',
      price: 'From €55',
      duration: '4-7 days',
      rating: 4.7,
      reviews: 1543,
      description: 'Turkish Riviera paradise',
      highlights: ['Kaleiçi', 'Düden Waterfalls', 'Konyaaltı Beach'],
      bestTime: 'May-Oct'
    },
    {
      id: 4,
      name: 'Pamukkale',
      country: 'Turkey',
      image: 'https://images.unsplash.com/photo-1554939437-ecc492c12b0b?q=80&w=1200&auto=format&fit=crop',
      category: 'nature',
      price: 'From €75',
      duration: '1-2 days',
      rating: 4.6,
      reviews: 1234,
      description: 'Cotton castle thermal pools',
      highlights: ['Travertine Terraces', 'Hierapolis', 'Cleopatra Pool'],
      bestTime: 'Apr-Oct'
    },
    {
      id: 5,
      name: 'Ephesus',
      country: 'Turkey',
      image: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?q=80&w=1200&auto=format&fit=crop',
      category: 'history',
      price: 'From €65',
      duration: '1 day',
      rating: 4.9,
      reviews: 987,
      description: 'Ancient Greek and Roman ruins',
      highlights: ['Library of Celsus', 'Temple of Artemis', 'Terrace Houses'],
      bestTime: 'Mar-Nov',
      popular: true
    },
    {
      id: 6,
      name: 'Bodrum',
      country: 'Turkey',
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=1200&auto=format&fit=crop',
      category: 'beach',
      price: 'From €70',
      duration: '3-5 days',
      rating: 4.5,
      reviews: 876,
      description: 'Aegean coastal gem',
      highlights: ['Bodrum Castle', 'Marina', 'Beach Clubs'],
      bestTime: 'Jun-Sep'
    }
  ]

  const categories = [
    { id: 'all', name: 'All', icon: '🌍' },
    { id: 'city', name: 'Cities', icon: '🏙️' },
    { id: 'nature', name: 'Nature', icon: '🏔️' },
    { id: 'beach', name: 'Beaches', icon: '🏖️' },
    { id: 'history', name: 'Historical', icon: '🏛️' }
  ]

  const filteredDestinations = selectedCategory === 'all' 
    ? destinations 
    : destinations.filter(dest => dest.category === selectedCategory)

  return (
    <section className="py-6 md:py-10 bg-white">
      <div className="md:container md:mx-auto md:px-4">
        {/* Mobile Header */}
        <div className="md:hidden px-5 mb-4">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium mb-2">
            🗺️ Explore Turkey
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Popular Destinations
          </h2>
          <p className="text-sm text-gray-600">
            Discover the most breathtaking places in Turkey
          </p>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block text-center mb-12">
          <span className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4 animate-bounce">
            🗺️ Explore Turkey
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Popular Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the most breathtaking destinations in Turkey. From historical sites to natural wonders.
          </p>
        </div>

        {/* Mobile Category Filter */}
        <div className="md:hidden flex gap-2 px-5 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Desktop Category Filter */}
        <div className="hidden md:flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">{category.icon}</span>
                {category.name}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Destinations Horizontal Swiper */}
        <div className="md:hidden">
          <Swiper
            modules={[FreeMode, Pagination]}
            spaceBetween={12}
            slidesPerView={1.15}
            centeredSlides={false}
            freeMode={true}
            pagination={{ 
              clickable: true,
              dynamicBullets: true
            }}
            className="!px-5 !pb-10"
          >
            {filteredDestinations.map((destination) => (
              <SwiperSlide key={destination.id}>
                <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {destination.popular && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                        🔥 Popular
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-0.5 rounded-full text-[10px]">
                      📅 {destination.bestTime}
                    </div>
                    
                    <div className="absolute bottom-2 left-2 text-white">
                      <h3 className="text-lg font-bold">{destination.name}</h3>
                      <p className="text-xs opacity-80">{destination.country}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <p className="text-xs text-gray-500 italic mb-2">{destination.description}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(destination.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">{destination.rating}</span>
                      <span className="text-xs text-gray-400">({destination.reviews})</span>
                    </div>
                    
                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {destination.highlights.slice(0, 2).map((highlight, idx) => (
                        <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Price and Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div>
                        <span className="text-base font-bold text-gray-900">{destination.price}</span>
                        <span className="text-[10px] text-gray-500 ml-1">• {destination.duration}</span>
                      </div>
                      <button className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs font-medium">
                        Explore →
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Destinations Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              onMouseEnter={() => setHoveredCard(destination.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Popular Badge */}
                {destination.popular && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                    🔥 Popular
                  </div>
                )}

                {/* Best Time Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                  📅 {destination.bestTime}
                </div>

                {/* Destination Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                  <p className="text-sm opacity-90 mb-2">{destination.country}</p>
                  <p className="text-sm opacity-80 italic">{destination.description}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Rating and Reviews */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(destination.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{destination.rating}</span>
                    <span className="text-sm text-gray-500">({destination.reviews})</span>
                  </div>
                  <span className="text-sm text-gray-500">{destination.duration}</span>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Top Attractions:</p>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{destination.price}</p>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    Explore →
                  </button>
                </div>
              </div>

              {/* Hover Effect Card */}
              {hoveredCard === destination.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center text-white p-6">
                    <h3 className="text-2xl font-bold mb-4">{destination.name}</h3>
                    <p className="mb-6">{destination.description}</p>
                    <div className="space-y-3">
                      <button className="w-full px-6 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors">
                        View Tours
                      </button>
                      <button className="w-full px-6 py-3 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-gray-900 transition-all">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Map Section */}
        <div className="hidden md:block mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Explore Turkey on the Map
              </h3>
              <p className="text-gray-600 mb-6">
                Plan your perfect journey through Turkey. Click on any destination to see available tours, best times to visit, and local tips.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Interactive Map</h4>
                    <p className="text-sm text-gray-600">Click to explore each destination</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Best Times</h4>
                    <p className="text-sm text-gray-600">Know when to visit each place</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Verified Tours</h4>
                    <p className="text-sm text-gray-600">All tours are quality guaranteed</p>
                  </div>
                </div>
              </div>
              <button className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                View Interactive Map →
              </button>
            </div>
            <div className="relative h-96 bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Placeholder for map */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-24 h-24 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-600 font-medium">Interactive Map</p>
                  <p className="text-sm text-gray-500 mt-2">Coming Soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PopularDestinations
