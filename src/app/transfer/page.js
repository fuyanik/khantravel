"use client"

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';



function TransferContent() {
  const searchParams = useSearchParams();
  const [activeStep, setActiveStep] = useState(1);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Get trip details from URL params
  const fromLocation = searchParams.get('from') || 'Not selected';
  const toLocation = searchParams.get('to') || 'Not selected';
  const date = searchParams.get('date') || 'Not selected';
  const time = searchParams.get('time') || 'Not selected';
  const passengers = searchParams.get('passengers') || '0';
  const isRoundTrip = searchParams.get('roundTrip') === 'true';
  const returnDate = searchParams.get('returnDate');
  const returnTime = searchParams.get('returnTime');
  const duration = searchParams.get('duration');
  const tripType = searchParams.get('type') || 'transfer';

  const steps = [
    'Trip Information',
    'Vehicle Selection & Additional Services',
    'Passenger Information & Payment',
    'Trip Details'
  ];



  useEffect(() => {
    // Simulate map loading
    setTimeout(() => setMapLoaded(true), 1000);
  }, []);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-gray-50 pt-20 flex flex-col">
        {/* Custom Stepper Section */}
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-start justify-between relative">
              {steps.map((label, index) => {
                const isCompleted = index < activeStep;
                const isActive = index === activeStep;
                
                return (
                  <div key={label} className="flex flex-col items-center relative flex-1">
                    {/* Step Icon - Fixed size and position */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-gray-300'
                    }`}>
                      <span className="leading-none">{isCompleted ? '✓' : index + 1}</span>
                    </div>
                    
                    {/* Step Label - Fixed top margin for alignment */}
                    <div className="mt-3 h-12 flex items-start justify-center">
                      <span className={`text-sm text-center max-w-[140px] leading-tight transition-colors duration-300 ${
                        isActive ? 'text-blue-600 font-semibold' : isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'
                      }`}>
                        {label}
                      </span>
                    </div>
                    
                    {/* Connector Line */}
                    {index < steps.length - 1 && (
                      <div className={`absolute top-5 left-[60%] w-[80%] h-[3px] transition-colors duration-300 ${
                        index < activeStep ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content - 90% width and centered */}
        <div className="flex-1 flex justify-center py-8">
          <div className="w-[90%] flex gap-6">
            {/* Left Column - Maps and Additional Services */}
            <div className="w-[65%] flex flex-col gap-6">
              {/* Google Maps Section */}
              <div className="h-[500px] relative bg-white rounded-2xl shadow-xl overflow-hidden">
              {!mapLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              ) : (
                <div className="relative h-full">
                  {/* Map iframe */}
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, borderRadius: '16px' }}
                    src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${encodeURIComponent(fromLocation)}&destination=${encodeURIComponent(toLocation)}&mode=driving`}
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              </div>

              {/* Additional Services Section */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Services</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">Child Seat</span>
                      <p className="text-xs text-gray-500">Baby or booster seat</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">+$10</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">Meet & Greet</span>
                      <p className="text-xs text-gray-500">Airport pickup service</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">+$15</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">Extra Luggage</span>
                      <p className="text-xs text-gray-500">Additional bags</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">+$5</span>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-800">Wi-Fi Hotspot</span>
                      <p className="text-xs text-gray-500">Mobile internet access</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">+$8</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Trip Details Card - 35% - Sticky */}
            <div className="w-[35%] h-fit sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Trip Details</h2>
              
              {/* Trip Type Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  tripType === 'rent' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {tripType === 'rent' ? (
                    <>
                      <AccessTimeIcon className="w-4 h-4 mr-1" />
                      Rent by Hour
                    </>
                  ) : (
                    <>
                      <DirectionsCarIcon className="w-4 h-4 mr-1" />
                      Transfer
                    </>
                  )}
                </span>
              </div>

              {/* From Location */}
              <div className="mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      {tripType === 'rent' ? 'PICKUP LOCATION' : 'FROM'}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {fromLocation.split(' | ')[0]}
                    </p>
                    {fromLocation.includes(' | ') && (
                      <p className="text-xs text-gray-500 mt-1">
                        {fromLocation.split(' | ')[1]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Route Line */}
              <div className="ml-4 border-l-2 border-dashed border-gray-300 h-8"></div>

              {/* To Location */}
              <div className="mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      {tripType === 'rent' ? 'DROP OFF POINT' : 'TO'}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {toLocation.split(' | ')[0]}
                    </p>
                    {toLocation.includes(' | ') && (
                      <p className="text-xs text-gray-500 mt-1">
                        {toLocation.split(' | ')[1]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <CalendarTodayIcon className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">
                      {isRoundTrip ? 'PICKUP DATE & TIME' : tripType === 'rent' ? 'DATE' : 'DATE & TIME'}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{date} {time}</p>
                  </div>
                </div>
                
                {isRoundTrip && returnDate && (
                  <div className="flex items-center gap-3 pt-3 border-t">
                    <CalendarTodayIcon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">RETURN DATE & TIME</p>
                      <p className="text-sm font-semibold text-gray-800">{returnDate} {returnTime}</p>
                    </div>
                  </div>
                )}
                
                {duration && (
                  <div className="flex items-center gap-3 pt-3 border-t">
                    <AccessTimeIcon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">DURATION</p>
                      <p className="text-sm font-semibold text-gray-800">{duration} hour{duration > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Passengers */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <PersonIcon className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">PASSENGERS</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {passengers} {passengers === '1' ? 'Person' : 'People'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Trip Type Info */}
              {isRoundTrip && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Round Trip</p>
                      <p className="text-xs text-blue-700">Return journey included</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <button className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2 group">
                Select Vehicle
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Help Text */}
              <p className="text-xs text-gray-500 text-center mt-4">
                Need help? Contact us at +90 123 456 7890
              </p>
            </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-auto">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                <h3 className="text-lg font-bold mb-4">Khan Travel</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Premium transfer and hourly rental services for your comfortable journey.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Our Services</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Fleet</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
                </ul>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-lg font-bold mb-4">Services</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Airport Transfer</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">City Tours</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Hourly Rental</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Corporate Services</a></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-bold mb-4">Contact Info</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <LocationOnIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-400 text-sm">Istanbul, Turkey</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-400 text-sm">+90 123 456 7890</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-400 text-sm">info@khantravel.com</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Khan Travel. All rights reserved.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

export default function TransferPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transfer details...</p>
        </div>
      </div>
    }>
      <TransferContent />
    </Suspense>
  );
}
