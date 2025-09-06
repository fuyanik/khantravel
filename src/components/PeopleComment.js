'use client'
import React, { useState } from 'react'
import Image from 'next/image'

const PeopleComment = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [visibleComments, setVisibleComments] = useState(6)

  const comments = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      rating: 5,
      date: '2 weeks ago',
      source: 'google',
      title: 'Amazing Experience!',
      comment: 'The Istanbul tour was absolutely fantastic! Our driver was knowledgeable and friendly. We visited all the major attractions and even some hidden gems. The vehicle was comfortable and clean. Highly recommend Khan Travel!',
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
      comment: 'Booked a private transfer from SAW airport to the city center. The driver was waiting for us with a sign, helped with our luggage, and got us to our hotel safely. The price was very reasonable compared to other services.',
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
      comment: 'We had an amazing time exploring Istanbul with Khan Travel. The 12-hour tour covered everything we wanted to see. Our guide was very informative and spoke excellent English. Only minor issue was a slight delay at pickup.',
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
      comment: 'Used Khan Travel for airport transfers and city tours during our Istanbul trip. Everything was perfectly organized. The vehicles were modern and comfortable. Drivers were punctual and professional. Will definitely use again!',
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
      title: 'Unforgettable Cappadocia Trip',
      comment: 'The hot air balloon experience in Cappadocia was breathtaking! Khan Travel arranged everything perfectly - from hotel pickup to the champagne celebration. The pilot was experienced and made us feel safe throughout.',
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
      title: 'Good Value for Money',
      comment: 'Took the Bosphorus dinner cruise. The food was delicious, entertainment was good, and the views were spectacular. The boat was clean and well-maintained. Staff was friendly and attentive. Recommended!',
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
      comment: 'Traveled with my family including elderly parents and young kids. Khan Travel accommodated all our needs perfectly. The driver was patient and helpful. They even provided child seats without extra charge!',
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
      comment: 'Impressed with the level of professionalism. Easy booking process, clear communication, and excellent execution. The Ephesus tour was well-paced and informative. Our guide was an archaeology expert!',
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
      comment: 'Everything was seamless from start to finish. Online booking was easy, payment was secure, and the service exceeded expectations. The driver even gave us local tips and restaurant recommendations!',
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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-medium mb-4">
            ⭐ Customer Reviews
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from real travelers. Read what our customers have to say about their journeys with Khan Travel.
          </p>
        </div>

        {/* Rating Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-6 h-6 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">Based on {comments.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-12">{rating} ⭐</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all duration-500"
                        style={{
                          width: `${(ratingDistribution[rating] / comments.length) * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              All Reviews
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {comments.length}
              </span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('google')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'google'
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {comments.filter(c => c.source === 'google').length}
              </span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('tripadvisor')}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === 'tripadvisor'
                ? 'bg-black text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="#00AF87" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14c-2.48 0-4.71-1.23-6-3.2.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.97-3.52 3.2-6 3.2z"/>
              </svg>
              TripAdvisor
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {comments.filter(c => c.source === 'tripadvisor').length}
              </span>
            </span>
          </button>
        </div>

        {/* Comments Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayedComments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={comment.avatar}
                      alt={comment.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {comment.source === 'google' ? (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                    ) : (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4" fill="#00AF87" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{comment.name}</h3>
                    <p className="text-xs text-gray-500">{comment.location}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{comment.date}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Title */}
              <h4 className="font-semibold text-gray-900 mb-2">{comment.title}</h4>

              {/* Comment */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                {comment.comment}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  Helpful ({comment.helpful})
                </button>
                <button className="text-sm text-red-600 hover:text-red-700 transition-colors font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {visibleComments < filteredComments.length && (
          <div className="text-center">
            <button
              onClick={() => setVisibleComments(prev => prev + 6)}
              className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              Load More Reviews
            </button>
          </div>
        )}

        {/* Write Review CTA */}
        <div className="mt-12 hidden bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Share Your Experience</h3>
          <p className="mb-6 opacity-90">
            Have you traveled with Khan Travel? We'd love to hear about your journey!
          </p>
          <button className="px-8 py-3 bg-white text-red-600 rounded-full font-medium hover:bg-gray-100 transition-colors">
            Write a Review
          </button>
        </div>
      </div>
    </section>
  )
}

export default PeopleComment
