'use client'
import React, { useState, useRef, useEffect } from 'react'
import '../app/globals.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import icons1 from "../assets/icons/icons1.png"
import icons2 from "../assets/icons/icons2.png"
import icons3 from "../assets/icons/icons3.png"
import icons4 from "../assets/icons/icons4.png"
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const HowWorks = ({isOutside = false}) => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic',
      offset: 100,
    });
  }, []);

  const steps = [
    {
      number: '01',
      icon: icons1,
      title: 'Book Online',
      description: 'Choose pickup, drop-off, date & vehicle type',
    },
    {
      number: '02',
      icon: icons2,
      title: 'Secure Payment',
      description: 'Pay securely with no hidden fees',
    },
    {
      number: '03',
      icon: icons3,
      title: 'Enjoy Your Ride',
      description: 'Professional driver arrives on time',
    },
    {
      number: '04',
      icon: icons4,
      title: '24/7 Support',
      description: 'We\'re here whenever you need us',
    }
  ];

  const whyChooseFeatures = [
    { name: "Premium Vehicle Fleet", khan: true, taxi: true, vip: true },
    { name: "Professional Drivers", khan: true, taxi: true, vip: true },
    { name: "Real-time Tracking", khan: true, taxi: false, vip: true },
    { name: "Meet & Greet Service", khan: true, taxi: false, vip: false },
    { name: "24/7 Customer Support", khan: true, taxi: false, vip: false },
    { name: "On-time Guarantee", khan: true, taxi: false, vip: false },
    { name: "Luxury Amenities", khan: true, taxi: false, vip: true },
    { name: "Online Booking System", khan: true, taxi: false, vip: false }
  ];

  const differenceFeatures = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: "Premium Quality",
      description: "Luxury vehicles with professional chauffeurs"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Safe & Secure",
      description: "Verified drivers and insured vehicles"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Fast Booking",
      description: "Book in seconds with instant confirmation"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Best Prices",
      description: "Transparent pricing with no hidden fees"
    }
  ];
  
  return (
    <section className={`${isOutside ? "pt-0" : "py-6 md:py-20"} bg-gradient-to-b from-white via-gray-50 to-white font-product`}>
      <div className="md:container md:mx-auto md:px-4">
        {/* Mobile Header */}
        <div className="md:hidden px-5 mb-6">
          <p className="text-xs text-gray-500 font-medium tracking-wider uppercase mb-2">
            Simple Process
          </p>
          <h2 className="text-xl font-bold text-gray-900">
            How It Works
          </h2>
        </div>

        {/* Mobile Steps - iOS Style Stepper */}
        <div className="md:hidden px-5 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`relative flex items-center gap-4 p-4 ${index !== steps.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                {/* Left - Step indicator with connecting line */}
                <div className="relative flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    index === 0 
                      ? 'bg-gradient-to-br from-gray-900 to-blue-900 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  {/* Connecting line */}
                  {index !== steps.length - 1 && (
                    <div className="absolute top-8 left-1/2 w-0.5 h-[calc(100%+16px)] -translate-x-1/2 bg-gray-200"></div>
                  )}
                        </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
                      </div>
                
                {/* Right Icon */}
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Image className="w-5 h-5 opacity-60" src={step.icon} alt={step.title}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Why Choose Khan Travel - iOS Style Comparison */}
        <div className="md:hidden px-5 mb-8">
          <p className="text-xs text-gray-500 font-medium tracking-wider uppercase mb-2">
            Comparison
          </p>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Why Choose Khan Travel?
          </h3>
          
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-3 px-4 py-3.5 bg-gray-50 border-b border-gray-100">
              <div className="text-xs text-gray-500 font-medium">Service</div>
              <div className="text-xs text-gray-900 font-semibold text-center">Khan</div>
              <div className="text-xs text-gray-500 text-center">Taxi</div>
              <div className="text-xs text-gray-500 text-center">VIP</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {whyChooseFeatures.map((feature, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-3 items-center px-4 py-3.5">
                  <span className="text-xs text-gray-700 font-medium">{feature.name}</span>
                  <div className="flex justify-center">
                    {feature.khan ? (
                      <div className="w-5 h-5 bg-gradient-to-br from-gray-900 to-blue-900 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                </div>
                    ) : (
                      <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    )}
                  </div>
                  <div className="flex justify-center">
                    {feature.taxi ? (
                      <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-gray-50 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                        </div>
                  <div className="flex justify-center">
                    {feature.vip ? (
                      <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 bg-gray-50 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    )}
                  </div>
                </div>
              ))}
              </div>

            {/* Footer */}
            <div className="px-4 py-4 bg-gray-50 border-t border-gray-100">
              <button className="w-full py-3 bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-xl font-semibold text-sm">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Mobile What Makes Us Different - iOS Style */}
        <div className="md:hidden px-5 mb-6">
          <p className="text-xs text-gray-500 font-medium tracking-wider uppercase mb-2">
            Our Advantages
          </p>
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            What Makes Us Different
          </h3>
          
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
            {differenceFeatures.map((feature, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-3 p-4"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  idx === 0 ? 'bg-gradient-to-br from-gray-900 to-blue-900 text-white' : 'bg-gray-50 text-gray-700'
                }`}>
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900">{feature.title}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Header Section - iOS Style */}
        <div className="hidden md:block text-center mb-12">
          <p className="text-sm text-gray-500 font-medium tracking-wider uppercase mb-3">
            Simple Process
          </p>
          <h1 data-aos-duration="400" data-aos="fade-up" className="text-4xl font-bold text-gray-900 mb-3">
            How It Works
          </h1>
          <p data-aos-duration="400" data-aos="fade-up" className="text-lg text-gray-600 max-w-2xl mx-auto">
            Book your premium transfer in 4 easy steps
          </p>
            </div>

        {/* Desktop Steps - iOS Style */}
        <div className="hidden md:block max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {steps.map((step, index) => (
              <div 
                key={index}
                data-aos="fade-up"
                data-aos-duration="400"
                data-aos-delay={index * 100}
                className={`flex items-center gap-6 p-6 ${index !== steps.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}
              >
                {/* Step Number */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                  index === 0 
                    ? 'bg-gradient-to-br from-gray-900 to-blue-900 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                
                {/* Content */}
                  <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{step.title}</h3>
                  <p className="text-gray-500 mt-1">{step.description}</p>
                        </div>
                
                {/* Icon */}
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Image className="w-8 h-8 opacity-60" src={step.icon} alt={step.title}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Why Choose Khan Travel - iOS Style */}
        <div className="hidden md:block mb-16">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-sm text-gray-500 font-medium tracking-wider uppercase mb-2">
                Comparison
              </p>
              <h2 data-aos-duration="400" data-aos="fade-up" className="text-3xl font-bold text-gray-900 mb-2">
                Why Choose Khan Travel?
              </h2>
              <p className="text-gray-600">Compare our services with others</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
                <div className="text-sm text-gray-500 font-medium">Service</div>
                <div className="text-sm text-gray-900 font-semibold text-center">Khan Travel</div>
                <div className="text-sm text-gray-500 text-center">Regular Taxi</div>
                <div className="text-sm text-gray-500 text-center">Other VIP</div>
          </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-100">
                {whyChooseFeatures.map((feature, idx) => (
                  <div key={idx} data-aos="fade-up" data-aos-delay={idx * 50} className="grid grid-cols-4 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                    <span className="text-gray-700 font-medium">{feature.name}</span>
                    <div className="flex justify-center">
                        {feature.khan ? (
                        <div className="w-6 h-6 bg-gradient-to-br from-gray-900 to-blue-900 rounded-full flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                    </div>
                    <div className="flex justify-center">
                        {feature.taxi ? (
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                        <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                    </div>
                    <div className="flex justify-center">
                        {feature.vip ? (
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                        <div className="w-6 h-6 bg-gray-50 rounded-full flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                    </div>
                  </div>
                  ))}
              </div>
              
              {/* Footer */}
              <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-center">
                  <button className="px-8 py-3 bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                    Book Now
                  </button>
                </div>
                </div>
              </div>
            </div>
          </div>

        {/* Desktop What Makes Us Different - iOS Style */}
        <div className="hidden md:block max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 font-medium tracking-wider uppercase mb-2">
              Our Advantages
            </p>
            <h3 className="text-3xl font-bold text-gray-900">
              What Makes Us Different
              </h3>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {differenceFeatures.map((feature, idx) => (
                  <div 
                    key={idx}
                  data-aos="fade-up"
                    data-aos-delay={idx * 100}
                  className={`flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors ${idx >= 2 ? 'border-t border-gray-100' : ''}`}
                  >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    idx === 0 ? 'bg-gradient-to-br from-gray-900 to-blue-900 text-white' : 'bg-gray-50 text-gray-700'
                  }`}>
                        {feature.icon}
                      </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-sm text-gray-500 mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                ))}
            </div>
              </div>

          <div className="mt-8 text-center">
                <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                    Start Your Journey
                  </button>
              <button className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                    View All Features
                  </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowWorks
