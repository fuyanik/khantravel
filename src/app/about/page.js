"use client"

import React, { useEffect } from 'react'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const stats = [
  { number: "500+", label: "Happy Clients" },
  { number: "50+", label: "Tour Routes" },
  { number: "4.9", label: "Average Rating" },
  { number: "8+", label: "Years Experience" }
]

const team = [
  {
    name: "Ahmet Khan",
    role: "Founder & CEO",
    image: "/istanbul.jpg",
    bio: "With over 15 years in the tourism industry, Ahmet founded Khan Travel to provide premium transfer services in Istanbul."
  },
  {
    name: "Mehmet Yılmaz",
    role: "Operations Manager",
    image: "/galata.jpeg",
    bio: "Mehmet ensures every transfer runs smoothly, coordinating our fleet of drivers and vehicles."
  },
  {
    name: "Ayşe Demir",
    role: "Customer Relations",
    image: "/kizkulesi.jpeg",
    bio: "Ayşe leads our customer support team, ensuring every guest receives exceptional service."
  }
]

const values = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "Safety First",
    description: "All our vehicles are regularly inspected and our drivers are professionally trained."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Punctuality",
    description: "We guarantee on-time pickups and monitor all flights for delays."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: "Premium Quality",
    description: "Luxury vehicles with professional chauffeurs for a first-class experience."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Customer Focus",
    description: "Your comfort and satisfaction are our top priorities."
  }
]

export default function AboutPage() {
  useEffect(() => {
    document.title = "About Us - Khan Travel"
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
              Our Story
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              About <span className="text-gray-400">Khan Travel</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Premium transfer and tour services in Istanbul since 2015. We&apos;re passionate about making your journey unforgettable.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section - Mobile */}
      <section className="md:hidden px-5 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-gray-50">
        {/* Our Story - Mobile */}
        <section className="md:hidden px-5 py-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Our Story</h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <p>
              Khan Travel was founded in 2015 with a simple mission: to provide premium, reliable transfer services in Istanbul that exceed expectations.
            </p>
            <p>
              What started as a small operation with just two vehicles has grown into one of Istanbul's most trusted transfer companies, serving thousands of satisfied customers each year.
            </p>
            <p>
              Today, we offer a comprehensive range of services including airport transfers, hourly rentals, city tours, and inter-city transportation, all with the same commitment to quality that defined us from the start.
            </p>
          </div>
        </section>

        {/* Our Values - Mobile */}
        <section className="md:hidden px-5 pb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Our Values</h2>
          <div className="space-y-3">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-black to-gray-900 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us - Mobile */}
        <section className="md:hidden px-5 pb-10">
          <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-3">Why Choose Us?</h2>
            <p className="text-gray-400 text-sm mb-6">
              We&apos;re not just a transfer company. We&apos;re your partners in creating memorable Istanbul experiences.
            </p>
            <a 
              href="/transfer"
              className="inline-block px-6 py-3 bg-white text-black rounded-xl font-semibold text-sm"
            >
              Book a Transfer
            </a>
          </div>
        </section>

        {/* Desktop Layout */}
        <section className="hidden md:block py-20">
          <div className="container mx-auto px-4">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-8 mb-20">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center bg-white rounded-2xl p-8 shadow-sm">
                  <div className="text-4xl font-bold bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Our Story */}
            <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                  <p>
                    Khan Travel was founded in 2015 with a simple mission: to provide premium, reliable transfer services in Istanbul that exceed expectations.
                  </p>
                  <p>
                    What started as a small operation with just two vehicles has grown into one of Istanbul's most trusted transfer companies, serving thousands of satisfied customers each year.
                  </p>
                  <p>
                    Today, we offer a comprehensive range of services including airport transfers, hourly rentals, city tours, and inter-city transportation, all with the same commitment to quality that defined us from the start.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/istanbul.jpg"
                  alt="Istanbul"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Our Values */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm text-center hover:shadow-lg transition-shadow">
                    <div className="w-14 h-14 bg-gradient-to-br from-black to-gray-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                      {value.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 text-xl mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-3xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience Premium Travel?</h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Book your transfer today and discover why thousands of travelers choose Khan Travel for their Istanbul journeys.
              </p>
              <div className="flex justify-center gap-4">
                <a 
                  href="/transfer"
                  className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:shadow-lg transition-shadow"
                >
                  Book a Transfer
                </a>
                <a 
                  href="/contact"
                  className="px-8 py-4 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

