"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const blogPosts = [
  {
    id: 1,
    slug: 'top-10-places-to-visit-istanbul',
    title: 'Top 10 Places to Visit in Istanbul',
    excerpt: 'Discover the most iconic landmarks and hidden gems that make Istanbul one of the world\'s most fascinating cities.',
    image: '/galata.jpeg',
    category: 'Travel Guide',
    readTime: '8 min read',
    date: 'Dec 28, 2025',
    featured: true
  },
  {
    id: 2,
    slug: 'best-bosphorus-cruise-experience',
    title: 'Best Bosphorus Cruise Experience',
    excerpt: 'Everything you need to know about taking a Bosphorus cruise - from sunset tours to private yacht experiences.',
    image: '/kizkulesi.jpeg',
    category: 'Activities',
    readTime: '6 min read',
    date: 'Dec 25, 2025'
  },
  {
    id: 3,
    slug: 'istanbul-food-guide',
    title: 'Istanbul Food Guide: Must-Try Dishes',
    excerpt: 'From kebabs to baklava, explore the rich culinary heritage of Istanbul and where to find the best local food.',
    image: '/eminönü.jpeg',
    category: 'Food & Drink',
    readTime: '10 min read',
    date: 'Dec 22, 2025'
  },
  {
    id: 4,
    slug: 'hidden-neighborhoods-istanbul',
    title: 'Hidden Neighborhoods of Istanbul',
    excerpt: 'Escape the tourist crowds and discover Istanbul\'s charming local neighborhoods like Kuzguncuk and Balat.',
    image: '/kuzguncuk.jpeg',
    category: 'Local Tips',
    readTime: '7 min read',
    date: 'Dec 20, 2025'
  },
  {
    id: 5,
    slug: 'airport-transfer-guide',
    title: 'Istanbul Airport Transfer Guide',
    excerpt: 'Complete guide to getting from Istanbul Airport to the city center - all transport options compared.',
    image: '/istanbul.jpg',
    category: 'Transport',
    readTime: '5 min read',
    date: 'Dec 18, 2025'
  },
  {
    id: 6,
    slug: 'day-trips-from-istanbul',
    title: 'Best Day Trips from Istanbul',
    excerpt: 'Explore the beautiful destinations around Istanbul including Princes\' Islands, Şile, and Polonezköy.',
    image: '/şile.jpeg',
    category: 'Day Trips',
    readTime: '9 min read',
    date: 'Dec 15, 2025'
  }
]

const categories = ['All', 'Travel Guide', 'Activities', 'Food & Drink', 'Local Tips', 'Transport', 'Day Trips']

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    document.title = "Istanbul Blog - Khan Travel"
  }, [])

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPost = blogPosts.find(post => post.featured)

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
              Istanbul Guide
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Istanbul <span className="text-gray-400">Blog</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Your ultimate guide to exploring Istanbul. Tips, hidden gems, and travel advice from local experts.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Mobile Horizontal Scroll */}
      <section className="md:hidden bg-white border-b border-gray-100 sticky top-[60px] z-40">
        <div className="flex overflow-x-auto scrollbar-hide gap-2 px-5 py-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-gray-50 min-h-screen">
        {/* Featured Post - Mobile */}
        {featuredPost && selectedCategory === 'All' && !searchQuery && (
          <section className="md:hidden px-5 py-6">
            <Link href={`/blog/${featuredPost.slug}`} className="block">
              <div className="relative rounded-2xl overflow-hidden">
                <div className="aspect-[16/10] relative">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-block px-3 py-1 bg-white text-black text-xs font-medium rounded-full mb-3">
                    Featured
                  </span>
                  <h2 className="text-xl font-bold text-white mb-2">{featuredPost.title}</h2>
                  <p className="text-gray-300 text-sm line-clamp-2">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Blog Grid - Mobile */}
        <section className="md:hidden px-5 pb-8">
          <div className="space-y-4">
            {filteredPosts.filter(p => !p.featured || selectedCategory !== 'All' || searchQuery).map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <div className="flex gap-4 p-4">
                    <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs text-gray-500 font-medium">{post.category}</span>
                      <h3 className="font-semibold text-gray-900 text-sm mt-1 line-clamp-2">{post.title}</h3>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles found matching your criteria.</p>
            </div>
          )}
        </section>

        {/* Desktop Layout */}
        <section className="hidden md:block py-12">
          <div className="container mx-auto px-4">
            {/* Desktop Categories */}
            <div className="flex justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Featured Post - Desktop */}
            {featuredPost && selectedCategory === 'All' && !searchQuery && (
              <Link href={`/blog/${featuredPost.slug}`} className="block mb-12">
                <div className="relative rounded-3xl overflow-hidden group">
                  <div className="aspect-[21/9] relative">
                    <Image
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                  </div>
                  <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-center p-12 max-w-2xl">
                    <span className="inline-block px-4 py-1.5 bg-white text-black text-sm font-medium rounded-full mb-4 w-fit">
                      Featured Article
                    </span>
                    <h2 className="text-4xl font-bold text-white mb-4">{featuredPost.title}</h2>
                    <p className="text-gray-300 text-lg mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{featuredPost.category}</span>
                      <span>•</span>
                      <span>{featuredPost.date}</span>
                      <span>•</span>
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Blog Grid - Desktop */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.filter(p => !p.featured || selectedCategory !== 'All' || searchQuery).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{post.category}</span>
                      <h3 className="font-bold text-gray-900 text-xl mt-2 mb-3 group-hover:text-gray-700 transition-colors">{post.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

