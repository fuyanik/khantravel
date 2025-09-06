'use client'
import React, { useState } from 'react'
import '../app/globals.css'
import AOS from 'aos';
import 'aos/dist/aos.css';
import icons1 from "../assets/icons/icons1.png"
import icons2 from "../assets/icons/icons2.png"
import icons3 from "../assets/icons/icons3.png"
import icons4 from "../assets/icons/icons4.png"
import Image from 'next/image';

const HowWorks = ({isOutside = false}) => {
  const [activeFeature, setActiveFeature] = useState(null);

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      easing: 'ease-out-cubic',
      offset: 100,
    });
  }, []);
  
  return (
    <section className={`${isOutside ? "pt-0" : "py-20"} bg-gradient-to-b from-white via-gray-50 to-white font-product`}>
      <div className="container mx-auto px-4">
        {/* Header Section with Modern Badge */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-600 rounded-full text-sm font-medium mb-4 animate-pulse">
            🚀 Simple Process
          </span>
          <h1 data-aos-duration="400" data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How It <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Works</span>
          </h1>
          <p data-aos-duration="400" data-aos="fade-up" className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience a simple, hassle-free booking process designed for your comfort. Get your premium VIP transfer service with professional drivers and luxury vehicles.
          </p>
        </div>

        {/* Stepper Section with Modern Cards */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative">

            {/* Step 1 */}
            <div data-aos-duration="600" data-aos="fade-up" className="relative pb-8">
              <div className="absolute top-0 left-12 w-0.5 h-full bg-gradient-to-b from-purple-300 to-blue-300" />
              <div 
                className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 ml-24 transform hover:-translate-y-1"

              >
                <div className="absolute -left-12 top-6 w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                  01
                </div>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center transform transition-all duration-300">
                      <Image className="w-10 h-10" src={icons1} alt="Book Online"/>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Book Your Transfer Online
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <p>
                        We will need your pickup and drop-off locations, travel date and time, 
                        contact details, and passenger information.
                      </p>
                      <p>
                        Choose from our luxury vehicle fleet including Mercedes, BMW, and other 
                        premium vehicles. Select additional services like meet & greet, 
                        child seats, or special requests.
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-3">
                          <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">📋 Easy Booking</span>
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">🚗 Luxury Vehicles</span>
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">✓ Special Requests</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div data-aos-duration="600" data-aos="fade-up" className="relative pb-8">
              <div className="absolute top-0 left-12 w-0.5 h-full bg-gradient-to-b from-blue-300 to-green-300" />
              <div 
                className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 ml-24 transform hover:-translate-y-1"

              >
                <div className="absolute -left-12 top-6 w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                  02
                </div>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center transform transition-all duration-300">
                      <Image className="w-10 h-10" src={icons2} alt="Payment"/>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Secure Payment & Confirmation
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <p>
                        We accept all major credit cards, PayPal, and bank transfers. 
                        The prices shown are fixed rates for your transfer with no hidden fees. 
                        Get instant confirmation after payment.
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-3">
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">💳 Secure Payment</span>
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">✓ Instant Confirmation</span>
                          <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-xs font-medium">🔒 No Hidden Fees</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div data-aos-duration="600" data-aos="fade-up" className="relative pb-8">
              <div className="absolute top-0 left-12 w-0.5 h-full bg-gradient-to-b from-green-300 to-orange-300" />
              <div 
                className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 ml-24 transform hover:-translate-y-1"

              >
                <div className="absolute -left-12 top-6 w-24 h-24 bg-gradient-to-br from-green-600 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                  03
                </div>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-orange-100 rounded-2xl flex items-center justify-center transform transition-all duration-300">
                      <Image className="w-10 h-10" src={icons3} alt="Premium Transfer"/>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Enjoy Your Premium Transfer
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Your professional driver will be ready
                        </p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                          On Time, Every Time
                        </p>
                        <p className="text-sm">
                          Your driver will arrive with a luxury vehicle, assist with 
                          luggage, and ensure a comfortable, safe journey to your destination.
                        </p>
                      </div>
                      <button className="mt-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-yellow-600 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                        Track Your Ride →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div data-aos-duration="600" data-aos="fade-up" className="relative">
              <div 
                className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 ml-24 transform hover:-translate-y-1"

              >
                <div className="absolute -left-12 top-6 w-24 h-24 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                  04
                </div>
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center transform transition-all duration-300">
                      <Image className="w-10 h-10" src={icons4} alt="Support"/>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      24/7 Customer Support
                    </h3>
                    <div className="space-y-3 text-gray-600">
                      <p>
                        Our customer service team is available around the clock 
                        to assist you. Contact us anytime for booking changes, 
                        special requests, or any questions about your transfer service.
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-3">
                          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">🕐 24/7 Available</span>
                          <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium">📞 Multiple Channels</span>
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">✓ Quick Response</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>




        {/* Why Choose Khan Travel - Modern Section */}
        <div className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 rounded-3xl mt-20">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-red-100 text-red-600 rounded-full text-sm font-medium mb-4 animate-bounce">
              ⭐ Why Choose Us
            </span>
            <h2 data-aos-duration="600" data-aos="fade-up" className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Khan Travel?</span>
            </h2>
            <p data-aos-duration="600" data-aos="fade-up" className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re taking the stress out of travel. Experience the difference with our premium service and unmatched reliability.
            </p>
          </div>

          {/* Modern Comparison Table */}
          <div className="max-w-5xl mx-auto mb-16 px-4">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr data-aos="fade-up" data-aos-duration="600" className="bg-gray-50">
                    <th className="text-left py-5 px-6 text-base font-medium text-gray-900 rounded-tl-2xl w-2/5">
                      What&apos;s included in your transfer?
                    </th>
                    <th className="text-center py-5 px-4 w-1/5">
                      <span className="text-base font-semibold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        Khan Travel
                      </span>
                    </th>
                    <th className="text-center py-5 px-4 w-1/5">
                      <span className="text-base font-medium text-gray-600">
                        Regular Taxi
                      </span>
                    </th>
                    <th className="text-center py-5 px-4 rounded-tr-2xl w-1/5">
                      <span className="text-base font-medium text-gray-600">
                        Other VIP Services
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Premium Vehicle Fleet", khan: true, taxi: true, vip: true },
                    { name: "Professional Drivers", khan: true, taxi: true, vip: true },
                    { name: "Real-time Tracking", khan: true, taxi: true, vip: true },
                    { name: "Meet & Greet Service", khan: true, taxi: false, vip: false },
                    { name: "24/7 Customer Support", khan: true, taxi: false, vip: false },
                    { name: "On-time Guarantee", khan: true, taxi: false, vip: false },
                    { name: "Luxury Amenities", khan: true, taxi: false, vip: false },
                    { name: "Online Booking System", khan: true, taxi: false, vip: false }
                  ].map((feature, idx) => (
                    <tr key={idx} data-aos="fade-up" data-aos-duration="600" data-aos-delay={idx * 100} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-gray-800 font-normal text-base">
                        {feature.name}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {feature.khan ? (
                          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {feature.taxi ? (
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {feature.vip ? (
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Action Buttons */}
              <div className="bg-gray-50 py-5 px-6 border-t border-gray-100">
                <div className="grid grid-cols-4 gap-4 items-center">
                  <div></div> {/* Empty space for alignment */}
                  <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full text-base font-semibold hover:shadow-md transform hover:scale-105 transition-all duration-300">
                    Book Now
                  </button>
                  <span className="text-sm text-gray-500 text-center">Limited Service</span>
                  <span className="text-sm text-gray-500 text-center">Expensive</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Features Section */}
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12">
              <h3 className="text-3xl font-bold text-center mb-12">
                What Makes Us <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Different</span>
              </h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: "💎",
                    title: "Premium Quality",
                    description: "Luxury vehicles with professional chauffeurs",
                    color: "from-purple-500 to-blue-500"
                  },
                  {
                    icon: "🛡️",
                    title: "Safe & Secure",
                    description: "Verified drivers and insured vehicles",
                    color: "from-blue-500 to-green-500"
                  },
                  {
                    icon: "⚡",
                    title: "Fast Booking",
                    description: "Book in seconds with instant confirmation",
                    color: "from-green-500 to-yellow-500"
                  },
                  {
                    icon: "💰",
                    title: "Best Prices",
                    description: "Transparent pricing with no hidden fees",
                    color: "from-yellow-500 to-red-500"
                  }
                ].map((feature, idx) => (
                  <div 
                    key={idx}
                    data-aos="zoom-in"
                    data-aos-duration="500"
                    data-aos-delay={idx * 100}
                    className="group"
                    onMouseEnter={() => setActiveFeature(idx)}
                    onMouseLeave={() => setActiveFeature(null)}
                  >
                    <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${activeFeature === idx ? 'from-gray-50 to-gray-100 shadow-xl transform -translate-y-2' : 'from-white to-gray-50'} transition-all duration-300`}>
                      <div className={`text-5xl mb-4 transform transition-transform duration-300 ${activeFeature === idx ? 'scale-125 rotate-12' : ''}`}>
                        {feature.icon}
                      </div>
                      <h4 className={`text-xl font-bold mb-2 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-6">
                  Join thousands of satisfied customers who trust Khan Travel
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    Start Your Journey
                  </button>
                  <button className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all duration-300">
                    View All Features
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  )
}

export default HowWorks