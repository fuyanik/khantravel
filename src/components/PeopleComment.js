'use client'
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

const PeopleComment = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [visibleComments, setVisibleComments] = useState(6)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef(null)

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
  const yearsCount = useCounter(9, 2000, statsVisible)

  // Intersection Observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const comments = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      rating: 5,
      date: '2 weeks ago',
      source: 'google',
      title: 'Amazing Experience!',
      comment: 'The Istanbul tour was absolutely fantastic! Our driver was knowledgeable and friendly. We visited all the major attractions and even some hidden gems. Highly recommend!',
      helpful: 45,
      location: 'New York, USA'
    },
    {
      id: 2,
      name: 'Marco Rossi',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      rating: 5,
      date: '1 month ago',
      source: 'tripadvisor',
      title: 'Professional Service',
      comment: 'Booked a private transfer from SAW airport. The driver was waiting with a sign, helped with luggage, and got us to our hotel safely. Very reasonable price.',
      helpful: 32,
      location: 'Rome, Italy'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      rating: 4,
      date: '3 weeks ago',
      source: 'google',
      title: 'Great Tour Guide',
      comment: 'We had an amazing time exploring Istanbul with Khan Travel. The 12-hour tour covered everything we wanted to see. Guide was very informative!',
      helpful: 28,
      location: 'London, UK'
    },
    {
      id: 4,
      name: 'Ahmed Hassan',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      rating: 5,
      date: '1 week ago',
      source: 'tripadvisor',
      title: 'Excellent Service!',
      comment: 'Used Khan Travel for airport transfers and city tours. Everything was perfectly organized. Modern vehicles, punctual drivers. Will use again!',
      helpful: 67,
      location: 'Dubai, UAE'
    },
    {
      id: 5,
      name: 'Lisa Chen',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      rating: 5,
      date: '2 months ago',
      source: 'google',
      title: 'Unforgettable Cappadocia',
      comment: 'The hot air balloon experience was breathtaking! Khan Travel arranged everything perfectly - from hotel pickup to the champagne celebration.',
      helpful: 89,
      location: 'Singapore'
    },
    {
      id: 6,
      name: 'David Miller',
      avatar: 'https://randomuser.me/api/portraits/men/6.jpg',
      rating: 4,
      date: '5 days ago',
      source: 'tripadvisor',
      title: 'Good Value',
      comment: 'Took the Bosphorus dinner cruise. The food was delicious, entertainment was good, and views were spectacular. Staff was friendly.',
      helpful: 23,
      location: 'Sydney, Australia'
    },
    {
      id: 7,
      name: 'Sophie Martin',
      avatar: 'https://randomuser.me/api/portraits/women/7.jpg',
      rating: 5,
      date: '3 weeks ago',
      source: 'google',
      title: 'Perfect Family Tour',
      comment: 'Traveled with family including elderly parents and kids. Khan Travel accommodated all our needs. Driver was patient and helpful!',
      helpful: 54,
      location: 'Paris, France'
    },
    {
      id: 8,
      name: 'Carlos Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/men/8.jpg',
      rating: 5,
      date: '1 month ago',
      source: 'tripadvisor',
      title: 'Highly Professional',
      comment: 'Impressed with the professionalism. Easy booking, clear communication, excellent execution. The Ephesus tour was amazing!',
      helpful: 41,
      location: 'Madrid, Spain'
    },
    {
      id: 9,
      name: 'Yuki Tanaka',
      avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
      rating: 5,
      date: '2 weeks ago',
      source: 'google',
      title: 'Seamless Experience',
      comment: 'Everything was seamless from start to finish. Online booking was easy, service exceeded expectations. Driver gave us local tips!',
      helpful: 38,
      location: 'Tokyo, Japan'
    }
  ]

  const filteredComments = activeTab === 'all' 
    ? comments 
    : comments.filter(comment => comment.source === activeTab)

  const displayedComments = filteredComments.slice(0, visibleComments)

  const averageRating = (comments.reduce((acc, comment) => acc + comment.rating, 0) / comments.length).toFixed(1)

  const ratingDistribution = {
    5: comments.filter(c => c.rating === 5).length,
    4: comments.filter(c => c.rating === 4).length,
    3: comments.filter(c => c.rating === 3).length,
    2: comments.filter(c => c.rating === 2).length,
    1: comments.filter(c => c.rating === 1).length,
  }

  return (
    <section className="py-6 md:py-20 bg-gray-50">
      <div className="md:container md:mx-auto md:px-4">
        {/* Mobile Header */}
        <div className="md:hidden px-5 mb-4">
          <span className="inline-block px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium mb-2">
            ⭐ Customer Reviews
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            What Our Clients Say
          </h2>
          <p className="text-sm text-gray-600">
            Real experiences from real travelers
          </p>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block text-center mb-10">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white rounded-full text-sm font-medium mb-4">
            Customer Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="bg-gradient-to-r from-gray-800 to-black bg-clip-text text-transparent">Clients Say</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from real travelers
          </p>
        </div>

        {/* Mobile Rating Summary - Modern Gradient Horizontal */}
        <div className="md:hidden px-5 mb-5">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-bold text-white">{averageRating}</div>
                <div>
                  <div className="flex gap-0.5 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                        className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
                  <p className="text-xs text-gray-300">Based on {comments.length} reviews</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="#00AF87" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Rating Summary - Modern Gradient Design */}
        <div className="hidden md:block mb-12 container mx-auto px-4">
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left - Rating Score */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-7xl font-bold text-white mb-2">{averageRating}</div>
                  <div className="flex justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-600'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">Based on {comments.length} reviews</p>
                </div>
                
                {/* Divider */}
                <div className="hidden lg:block w-px h-24 bg-white/20"></div>
                
                {/* Review Sources */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="text-white text-sm font-medium">Google Reviews</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full">
                    <svg className="w-5 h-5" fill="#00AF87" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                    <span className="text-white text-sm font-medium">TripAdvisor</span>
                  </div>
                </div>
              </div>

              {/* Right - Rating Distribution */}
              <div className="flex-1 max-w-md w-full">
                <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-sm text-white/70 w-8">{rating}★</span>
                      <div className="flex-1 bg-white/10 rounded-full h-3 overflow-hidden">
                      <div
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(ratingDistribution[rating] / comments.length) * 100}%`
                        }}
                      />
                    </div>
                      <span className="text-sm text-white/70 w-8 text-right">
                      {ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="md:hidden flex gap-2 px-5 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-gray-900 to-blue-900 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            All ({comments.length})
          </button>
          <button
            onClick={() => setActiveTab('google')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'google'
                ? 'bg-gradient-to-r from-gray-900 to-blue-900 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill={activeTab === 'google' ? '#fff' : '#4285F4'} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill={activeTab === 'google' ? '#fff' : '#34A853'} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill={activeTab === 'google' ? '#fff' : '#FBBC05'} d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill={activeTab === 'google' ? '#fff' : '#EA4335'} d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
          </button>
          <button
            onClick={() => setActiveTab('tripadvisor')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'tripadvisor'
                ? 'bg-gradient-to-r from-gray-900 to-blue-900 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill={activeTab === 'tripadvisor' ? '#fff' : '#00AF87'} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
            </svg>
            TripAdvisor
          </button>
        </div>

        {/* Desktop Tab Navigation */}
        <div className="hidden md:flex justify-center mb-10">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full p-1.5 shadow-lg border border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                activeTab === 'all'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({comments.length})
            </button>
            <button
              onClick={() => setActiveTab('google')}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'google'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill={activeTab === 'google' ? '#fff' : '#4285F4'} d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill={activeTab === 'google' ? '#fff' : '#34A853'} d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill={activeTab === 'google' ? '#fff' : '#FBBC05'} d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill={activeTab === 'google' ? '#fff' : '#EA4335'} d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => setActiveTab('tripadvisor')}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'tripadvisor'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-4 h-4" fill={activeTab === 'tripadvisor' ? '#fff' : '#00AF87'} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              TripAdvisor
          </button>
          </div>
        </div>

        {/* Mobile Comments Horizontal Swiper */}
        <div className="md:hidden mb-6">
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
            className="!px-5 !pb-8"
          >
            {filteredComments.map((comment) => (
              <SwiperSlide key={comment.id}>
                <div className="bg-white rounded-xl shadow-sm p-4 h-full border border-gray-100">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={comment.avatar}
                          alt={comment.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {comment.source === 'google' ? (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                          </div>
                        ) : (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <svg className="w-3 h-3" fill="#00AF87" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{comment.name}</h3>
                        <p className="text-xs text-gray-500">{comment.location}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{comment.date}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3.5 h-3.5 ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Title */}
                  <h4 className="font-semibold text-gray-900 text-sm mb-1.5">{comment.title}</h4>

                  {/* Comment */}
                  <p className="text-gray-600 text-xs leading-relaxed line-clamp-3">
                    {comment.comment}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop Comments Grid - Modern Design */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 container mx-auto px-4">
          {displayedComments.map((comment) => (
            <div
              key={comment.id}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={comment.avatar}
                      alt={comment.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    {comment.source === 'google' ? (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm ring-1 ring-gray-100">
                        <svg className="w-3 h-3" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm ring-1 ring-gray-100">
                        <svg className="w-3 h-3" fill="#00AF87" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{comment.name}</h3>
                    <p className="text-xs text-gray-500">{comment.location}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium">{comment.date}</span>
              </div>

              {/* Rating & Title */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                      className={`w-3.5 h-3.5 ${i < comment.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
                <span className="text-xs text-gray-400">•</span>
                <h4 className="font-semibold text-gray-900 text-sm">{comment.title}</h4>
              </div>

              {/* Comment */}
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                {comment.comment}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Helpful ({comment.helpful})
                </button>
                <button className="text-xs text-gray-900 group-hover:text-black transition-colors font-medium flex items-center gap-1">
                  Read More
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Stats Section - Animated Marquee */}
        <div ref={statsRef} className="md:hidden mb-6 overflow-hidden">
          <div className="flex animate-marquee">
            {/* First set */}
            <div className="flex gap-6 px-5 shrink-0">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100">
                <span className="text-lg font-bold text-gray-900">{clientsCount}+</span>
                <span className="text-xs text-gray-500">Happy Clients</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100">
                <span className="text-lg font-bold text-gray-900">{routesCount}+</span>
                <span className="text-xs text-gray-500">Tour Routes</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100">
                <span className="text-lg font-bold text-gray-900">{(ratingCount / 10).toFixed(1)}★</span>
                <span className="text-xs text-gray-500">Avg. Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100">
                <span className="text-lg font-bold text-gray-900">{yearsCount}+</span>
                <span className="text-xs text-gray-500">Years Exp.</span>
              </div>
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-6 px-5 shrink-0">
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100">
                <span className="text-lg font-bold text-gray-900">{clientsCount}+</span>
                <span className="text-xs text-gray-500">Happy Clients</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100">
                <span className="text-lg font-bold text-gray-900">{routesCount}+</span>
                <span className="text-xs text-gray-500">Tour Routes</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100">
                <span className="text-lg font-bold text-gray-900">{(ratingCount / 10).toFixed(1)}★</span>
                <span className="text-xs text-gray-500">Avg. Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full border border-gray-100">
                <span className="text-lg font-bold text-gray-900">{yearsCount}+</span>
                <span className="text-xs text-gray-500">Years Exp.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Load More */}
        {visibleComments < filteredComments.length && (
          <div className="hidden md:block text-center">
            <button
              onClick={() => setVisibleComments(prev => prev + 6)}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-gray-900 to-black text-white rounded-full font-medium hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Load More Reviews
              <svg className="w-4 h-4 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default PeopleComment
