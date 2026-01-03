"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'

const blogPosts = [
  {
    id: 1,
    slug: 'top-10-places-to-visit-istanbul',
    title: 'Top 10 Places to Visit',
    excerpt: 'Discover the most iconic landmarks and hidden gems of Istanbul.',
    image: '/galata.jpeg',
    category: 'Travel Guide',
    readTime: '8 min'
  },
  {
    id: 2,
    slug: 'best-bosphorus-cruise-experience',
    title: 'Bosphorus Cruise Guide',
    excerpt: 'Everything about sunset cruises and private yacht experiences.',
    image: '/kizkulesi.jpeg',
    category: 'Activities',
    readTime: '6 min'
  },
  {
    id: 3,
    slug: 'istanbul-food-guide',
    title: 'Istanbul Food Guide',
    excerpt: 'From kebabs to baklava - explore the best local food.',
    image: '/eminönü.jpeg',
    category: 'Food & Drink',
    readTime: '10 min'
  },
  {
    id: 4,
    slug: 'hidden-neighborhoods-istanbul',
    title: 'Hidden Neighborhoods',
    excerpt: 'Discover charming local areas like Kuzguncuk and Balat.',
    image: '/kuzguncuk.jpeg',
    category: 'Local Tips',
    readTime: '7 min'
  }
]

const BlogSection = () => {
  return (
    <section className="py-8 md:py-16 bg-gray-50 font-product">
      {/* Mobile View */}
      <div className="md:hidden">
        {/* Header */}
        <div className="px-5 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-black to-gray-900 text-white rounded-full text-xs font-medium mb-2">
                Istanbul Guide
              </span>
              <h2 className="text-xl font-bold text-gray-900">
                Istanbul <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Blog</span>
              </h2>
            </div>
            <Link 
              href="/blog"
              className="text-sm font-medium text-gray-600 flex items-center gap-1"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <p className="text-sm text-gray-600">Tips, hidden gems, and travel advice from local experts.</p>
        </div>

        {/* Blog Cards Swiper */}
        <div className="pl-5">
          <Swiper
            modules={[FreeMode]}
            spaceBetween={12}
            slidesPerView="auto"
            freeMode={true}
            className="!overflow-visible"
          >
            {blogPosts.map((post) => (
              <SwiperSlide key={post.id} className="!w-[260px]">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="relative aspect-[16/10]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-black text-xs font-medium rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">{post.title}</h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{post.excerpt}</p>
                      <span className="text-xs text-gray-400">{post.readTime} read</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
            <SwiperSlide className="!w-[100px]">
              <Link 
                href="/blog" 
                className="h-full min-h-[200px] flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 rounded-2xl text-white p-4"
              >
                <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="text-xs font-medium text-center">View All</span>
              </Link>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-black to-gray-900 text-white rounded-full text-sm font-medium mb-3">
              Istanbul Guide
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Istanbul <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">Blog</span>
            </h2>
            <p className="text-gray-600 max-w-lg">
              Tips, hidden gems, and travel advice from local experts. Your ultimate guide to exploring Istanbul.
            </p>
          </div>
          <Link 
            href="/blog"
            className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"
          >
            View All Articles
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-black text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-gray-700 transition-colors">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                  <span className="text-gray-400 text-sm">{post.readTime} read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BlogSection

