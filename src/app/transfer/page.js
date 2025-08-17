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
  const [selectedCurrency, setSelectedCurrency] = useState('TL');
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasScrolledOnce, setHasScrolledOnce] = useState(false);
  const [animationState, setAnimationState] = useState('normal'); // 'normal', 'toSticky', 'sticky', 'toNormal'
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [bannerVisible, setBannerVisible] = useState(true);

  // Set document title on client side
  useEffect(() => {
    document.title = "Khan Travel Transfer - Book Your Premium Transfer Service";
  }, []);
  
  // Helper function to get valid location for Google Maps
  const getValidLocation = (location) => {
    if (!location || location === 'Not selected' || location.trim() === '') {
      return 'Istanbul, Turkey';
    }
    return location;
  };

  // Helper function to calculate distance and duration based on locations
  const calculateRouteInfo = (from, to, type) => {
    // If same locations or not selected, return default values
    if (!from || !to || from === to || from === 'Not selected' || to === 'Not selected') {
      return {
        distance: type === 'rent' ? '~50 km' : '25 km',
        duration: type === 'rent' ? (duration ? `${duration} hour${duration > 1 ? 's' : ''}` : '4 hours') : '35 min'
      };
    }

    // Simple distance calculation based on common routes
    const routes = {
      // Airport routes
      'istanbul airport': {
        'taksim': { distance: '51.3 km', duration: '58 min' },
        'sultanahmet': { distance: '56.2 km', duration: '64 min' },
        'kadikoy': { distance: '65.8 km', duration: '75 min' },
        'besiktas': { distance: '49.7 km', duration: '55 min' },
        'galata': { distance: '50.1 km', duration: '56 min' },
        'levent': { distance: '42.8 km', duration: '48 min' },
        'ortakoy': { distance: '46.3 km', duration: '52 min' },
        'bebek': { distance: '48.9 km', duration: '55 min' },
        'etiler': { distance: '38.2 km', duration: '43 min' },
        'maslak': { distance: '35.6 km', duration: '40 min' },
        'sariyer': { distance: '52.4 km', duration: '59 min' },
        'default': { distance: '48 km', duration: '54 min' }
      },
      'sabiha gokcen airport': {
        'taksim': { distance: '48.2 km', duration: '73 min' },
        'sultanahmet': { distance: '45.8 km', duration: '68 min' },
        'kadikoy': { distance: '32.4 km', duration: '48 min' },
        'besiktas': { distance: '52.1 km', duration: '78 min' },
        'levent': { distance: '56.3 km', duration: '82 min' },
        'ortakoy': { distance: '54.7 km', duration: '79 min' },
        'bebek': { distance: '58.2 km', duration: '84 min' },
        'etiler': { distance: '59.1 km', duration: '86 min' },
        'maslak': { distance: '62.8 km', duration: '91 min' },
        'sariyer': { distance: '71.4 km', duration: '103 min' },
        'default': { distance: '52 km', duration: '75 min' }
      },
      // City center routes
      'taksim': {
        'sultanahmet': { distance: '5.8 km', duration: '22 min' },
        'kadikoy': { distance: '14.2 km', duration: '32 min' },
        'besiktas': { distance: '3.7 km', duration: '14 min' },
        'ortakoy': { distance: '7.8 km', duration: '24 min' },
        'bebek': { distance: '8.6 km', duration: '26 min' },
        'levent': { distance: '6.2 km', duration: '19 min' },
        'maslak': { distance: '11.4 km', duration: '32 min' },
        'etiler': { distance: '8.1 km', duration: '25 min' },
        'nisantasi': { distance: '2.4 km', duration: '9 min' },
        'galata': { distance: '1.8 km', duration: '8 min' },
        'karakoy': { distance: '2.1 km', duration: '9 min' },
        'eminonu': { distance: '4.3 km', duration: '18 min' },
        'yenikoy': { distance: '15.7 km', duration: '42 min' },
        'tarabya': { distance: '17.8 km', duration: '46 min' },
        'sariyer': { distance: '19.3 km', duration: '49 min' },
        'kilyos': { distance: '27.6 km', duration: '71 min' },
        'goga beach': { distance: '23.9 km', duration: '58 min' },
        'kemerburgaz': { distance: '21.7 km', duration: '52 min' },
        'default': { distance: '7.5 km', duration: '18 min' }
      },
      'sultanahmet': {
        'kadikoy': { distance: '11.8 km', duration: '26 min' },
        'besiktas': { distance: '8.2 km', duration: '22 min' },
        'taksim': { distance: '5.8 km', duration: '22 min' },
        'galata': { distance: '3.4 km', duration: '12 min' },
        'karakoy': { distance: '2.8 km', duration: '11 min' },
        'default': { distance: '8.5 km', duration: '20 min' }
      },
      // Boğaziçi area routes
      'bogazici': {
        'rumeli hisar': { distance: '3.2 km', duration: '9 min' },
        'rumeli hisari': { distance: '3.2 km', duration: '9 min' },
        'bebek': { distance: '2.1 km', duration: '6 min' },
        'etiler': { distance: '4.8 km', duration: '12 min' },
        'levent': { distance: '7.2 km', duration: '18 min' },
        'besiktas': { distance: '8.5 km', duration: '20 min' },
        'taksim': { distance: '10.2 km', duration: '25 min' },
        'default': { distance: '6 km', duration: '15 min' }
      },
      'rumeli hisar': {
        'bogazici': { distance: '3.2 km', duration: '9 min' },
        'bebek': { distance: '1.8 km', duration: '5 min' },
        'etiler': { distance: '2.9 km', duration: '8 min' },
        'levent': { distance: '5.1 km', duration: '14 min' },
        'besiktas': { distance: '6.8 km', duration: '16 min' },
        'default': { distance: '4 km', duration: '10 min' }
      },
      'rumeli hisari': {
        'bogazici': { distance: '3.2 km', duration: '9 min' },
        'bebek': { distance: '1.8 km', duration: '5 min' },
        'etiler': { distance: '2.9 km', duration: '8 min' },
        'levent': { distance: '5.1 km', duration: '14 min' },
        'besiktas': { distance: '6.8 km', duration: '16 min' },
        'default': { distance: '4 km', duration: '10 min' }
      },
      'bebek': {
        'rumeli hisar': { distance: '1.8 km', duration: '5 min' },
        'bogazici': { distance: '2.1 km', duration: '6 min' },
        'etiler': { distance: '1.5 km', duration: '4 min' },
        'levent': { distance: '3.2 km', duration: '9 min' },
        'taksim': { distance: '9.2 km', duration: '22 min' },
        'ortakoy': { distance: '3.1 km', duration: '8 min' },
        'default': { distance: '2.5 km', duration: '7 min' }
      },
      // Beach and coastal areas
      'goga beach': {
        'taksim': { distance: '23.9 km', duration: '58 min' },
        'besiktas': { distance: '21.6 km', duration: '52 min' },
        'levent': { distance: '17.8 km', duration: '46 min' },
        'maslak': { distance: '14.7 km', duration: '38 min' },
        'sariyer': { distance: '7.6 km', duration: '21 min' },
        'kilyos': { distance: '3.8 km', duration: '14 min' },
        'istanbul airport': { distance: '38.4 km', duration: '68 min' },
        'sabiha gokcen airport': { distance: '65.2 km', duration: '95 min' },
        'default': { distance: '19.5 km', duration: '48 min' }
      },
      'kilyos': {
        'taksim': { distance: '28.4 km', duration: '65 min' },
        'besiktas': { distance: '25.6 km', duration: '58 min' },
        'sariyer': { distance: '12.1 km', duration: '28 min' },
        'tarabya': { distance: '9.8 km', duration: '22 min' },
        'goga beach': { distance: '4.2 km', duration: '12 min' },
        'default': { distance: '25 km', duration: '55 min' }
      },
      // Northern areas  
      'sariyer': {
        'taksim': { distance: '20.1 km', duration: '45 min' },
        'besiktas': { distance: '17.4 km', duration: '38 min' },
        'levent': { distance: '13.2 km', duration: '30 min' },
        'tarabya': { distance: '6.5 km', duration: '15 min' },
        'yenikoy': { distance: '4.8 km', duration: '12 min' },
        'kilyos': { distance: '12.1 km', duration: '28 min' },
        'goga beach': { distance: '8.1 km', duration: '18 min' },
        'default': { distance: '15 km', duration: '35 min' }
      },
      'ortakoy': {
        'taksim': { distance: '8.5 km', duration: '20 min' },
        'besiktas': { distance: '4.2 km', duration: '10 min' },
        'bebek': { distance: '3.1 km', duration: '8 min' },
        'levent': { distance: '2.8 km', duration: '7 min' },
        'etiler': { distance: '1.9 km', duration: '5 min' },
        'default': { distance: '6 km', duration: '15 min' }
      },
      'levent': {
        'taksim': { distance: '6.8 km', duration: '16 min' },
        'besiktas': { distance: '2.9 km', duration: '8 min' },
        'ortakoy': { distance: '2.8 km', duration: '7 min' },
        'maslak': { distance: '5.4 km', duration: '12 min' },
        'etiler': { distance: '2.1 km', duration: '6 min' },
        'sariyer': { distance: '13.2 km', duration: '30 min' },
        'goga beach': { distance: '18.3 km', duration: '42 min' },
        'default': { distance: '8 km', duration: '18 min' }
      }
    };

    // Normalize location names for matching
    const normalizeLocation = (loc) => {
      return loc.toLowerCase()
        .replace(/i̇stanbul/g, 'istanbul')
        .replace(/atatürk|ataturk/g, 'ataturk airport')
        // Airport normalizations
        .replace(/istanbul airport|ist airport|new istanbul airport|yeni havalimanı|i̇stanbul havalimanı/g, 'istanbul airport')
        .replace(/sabiha gökçen|sabiha gokcen|saw airport|sabiha gökçen havalimanı/g, 'sabiha gokcen airport')
        .replace(/istanbul |turkey |airport$/g, '')
        .replace(/new|yeni/g, '')
        // Boğaziçi area normalizations
        .replace(/boğaziçi üniversitesi|bogazici universitesi|bogazici university|boun/g, 'bogazici')
        .replace(/rumeli hisarı|rumeli hisari|rumeli fortress/g, 'rumeli hisar')
        .replace(/kuzey kampüs|north campus|kuzey kampus/g, '')
        .replace(/kampüs|kampus|campus/g, '')
        .replace(/üniversitesi|universitesi|university/g, '')
        // Beach and coastal normalizations
        .replace(/goga beach club|goga beach/g, 'goga beach')
        .replace(/kilyos beach|kilyos plajı/g, 'kilyos')
        // District normalizations
        .replace(/ortaköy|ortakoy/g, 'ortakoy')
        .replace(/sarıyer|sariyer/g, 'sariyer')
        .replace(/nişantaşı|nisantasi/g, 'nisantasi')
        .replace(/beşiktaş|besiktas/g, 'besiktas')
        .replace(/kadıköy|kadikoy/g, 'kadikoy')
        .replace(/eminönü|eminonu/g, 'eminonu')
        .replace(/karaköy|karakoy/g, 'karakoy')
        .replace(/yeşilköy|yesilkoy/g, 'yesilkoy')
        .replace(/yeniköy|yenikoy/g, 'yenikoy')
        .replace(/tarabya|tarabya/g, 'tarabya')
        .trim();
    };

    const fromNorm = normalizeLocation(from);
    const toNorm = normalizeLocation(to);

    // Try to find route info
    let routeInfo = null;
    
    // Check direct route
    if (routes[fromNorm] && routes[fromNorm][toNorm]) {
      routeInfo = routes[fromNorm][toNorm];
    }
    // Check reverse route
    else if (routes[toNorm] && routes[toNorm][fromNorm]) {
      routeInfo = routes[toNorm][fromNorm];
    }
    // Check for partial matches
    else {
      for (const [startKey, destinations] of Object.entries(routes)) {
        if (fromNorm.includes(startKey) || startKey.includes(fromNorm)) {
          for (const [endKey, info] of Object.entries(destinations)) {
            if (endKey !== 'default' && (toNorm.includes(endKey) || endKey.includes(toNorm))) {
              routeInfo = info;
              break;
            }
          }
          if (!routeInfo && destinations.default) {
            routeInfo = destinations.default;
          }
          break;
        }
      }
    }

    // Return route info or defaults
    if (routeInfo) {
      return {
        distance: type === 'rent' ? `~${parseInt(routeInfo.distance) + 20} km` : routeInfo.distance,
        duration: type === 'rent' ? (duration ? `${duration} hour${duration > 1 ? 's' : ''}` : '4 hours') : routeInfo.duration
      };
    }

    // Default values if no match found
    return {
      distance: type === 'rent' ? '~45 km' : '12.5 km',
      duration: type === 'rent' ? (duration ? `${duration} hour${duration > 1 ? 's' : ''}` : '4 hours') : '28 min'
    };
  };

  // Get trip details from URL params
  const fromLocation = searchParams.get('from') || 'Istanbul, Turkey';
  const toLocation = searchParams.get('to') || 'Istanbul, Turkey';
  const date = searchParams.get('date') || 'Not selected';
  const time = searchParams.get('time') || 'Not selected';
  const passengers = searchParams.get('passengers') || '0';
  const isRoundTrip = searchParams.get('roundTrip') === 'true';
  const returnDate = searchParams.get('returnDate');
  const returnTime = searchParams.get('returnTime');
  const duration = searchParams.get('duration');
  const tripType = searchParams.get('type') || 'transfer';

  // Calculate route information
  const routeInfo = calculateRouteInfo(fromLocation, toLocation, tripType);

  // Get today's date formatted
  const getTodaysDate = () => {
    const today = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('tr-TR', options);
  };

  // Format countdown time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate appropriate zoom level based on distance
  const getMapZoom = (distance) => {
    if (!distance || typeof distance !== 'string') return 11;
    
    // Extract numeric value from distance string (e.g., "47.2 km" -> 47.2)
    const numericDistance = parseFloat(distance.replace(/[^\d.]/g, ''));
    
    if (isNaN(numericDistance)) return 11;
    
    // Balanced zoom levels - optimized for Google Maps real distances
    if (numericDistance < 3) return 14;       // Very close: 14 zoom (under 3km)
    else if (numericDistance < 8) return 13;  // Close: 13 zoom (3-8km)  
    else if (numericDistance < 15) return 12; // Medium close: 12 zoom (8-15km)
    else if (numericDistance < 25) return 11; // Medium: 11 zoom (15-25km)
    else if (numericDistance < 45) return 10; // Far: 10 zoom (25-45km)
    else if (numericDistance < 70) return 9;  // Very far: 9 zoom (45-70km)
    else return 8;                            // Extremely far: 8 zoom (70km+)
  };

  // Vehicle data array
  const vehicles = [
    {
      name: 'Premium Sedan',
      passengers: '1-4 Kişi',
      luggage: '2 Valiz',
      prices: {
        TL: { current: '₺1,850', original: '₺2,220' },
        EUR: { current: '€39', original: '€47' },
        USD: { current: '$45', original: '$54' },
        GBP: { current: '£33', original: '£40' }
      },
      features: ['Sabit Fiyat', 'Uçuş Takibi', 'Havalimanı Karşılama', 'Ücretsiz İptal']
    },
    {
      name: 'SUV Private',
      passengers: '1-7 Kişi',
      luggage: '5 Valiz',
      prices: {
        TL: { current: '₺2,340', original: '₺2,808' },
        EUR: { current: '€49', original: '€59' },
        USD: { current: '$57', original: '$68' },
        GBP: { current: '£42', original: '£50' }
      },
      features: ['Sabit Fiyat', 'Uçuş Takibi', 'Havalimanı Karşılama', 'Ücretsiz İptal']
    },
    {
      name: 'Van Private',
      passengers: '1-8 Kişi',
      luggage: '6 Valiz',
      prices: {
        TL: { current: '₺2,600', original: '₺3,120' },
        EUR: { current: '€55', original: '€66' },
        USD: { current: '$63', original: '$76' },
        GBP: { current: '£47', original: '£56' }
      },
      features: ['Sabit Fiyat', 'Uçuş Takibi', 'Havalimanı Karşılama', 'Ücretsiz İptal']
    },
    {
      name: 'Sprinter & VW Private',
      passengers: '1-16 Kişi',
      luggage: '1 - 10 Valiz',
      prices: {
        TL: { current: '₺2,918', original: '₺3,502' },
        EUR: { current: '€61', original: '€73' },
        USD: { current: '$71', original: '$85' },
        GBP: { current: '£52', original: '£62' }
      },
      features: ['Sabit Fiyat', 'Uçuş Takibi', 'Havalimanı Karşılama', 'Ücretsiz İptal']
    },
    {
      name: 'Midibus Private',
      passengers: '1-26 Kişi',
      luggage: '1 - 26 Valiz',
      prices: {
        TL: { current: '₺6,864', original: '₺8,237' },
        EUR: { current: '€144', original: '€173' },
        USD: { current: '$168', original: '$202' },
        GBP: { current: '£124', original: '£149' }
      },
      features: ['Sabit Fiyat', 'Uçuş Takibi', 'Havalimanı Karşılama', 'Ücretsiz İptal']
    },
    {
      name: 'Luxury Bus',
      passengers: '1-50 Kişi',
      luggage: '1 - 50 Valiz',
      prices: {
        TL: { current: '₺9,500', original: '₺11,400' },
        EUR: { current: '€200', original: '€240' },
        USD: { current: '$230', original: '$276' },
        GBP: { current: '£172', original: '£206' }
      },
      features: ['Sabit Fiyat', 'Uçuş Takibi', 'Havalimanı Karşılama', 'Ücretsiz İptal']
    }
  ];

  const steps = [
    'Trip Information',
    'Vehicle Selection & Additional Services',
    'Passenger Information & Payment',
    'Trip Details'
  ];



  useEffect(() => {
    // Simulate map loading
    setTimeout(() => setMapLoaded(true), 1000);
  }, [fromLocation, toLocation]);

  // Reset animation state after animation completes
  useEffect(() => {
    if (animationState === 'toSticky' || animationState === 'toNormal') {
      const timer = setTimeout(() => {
        setAnimationState(isScrolled ? 'sticky' : 'normal');
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [animationState, isScrolled]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          return 20 * 60; // Reset to 20 minutes when it reaches 0
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Handle scroll events for sticky stepper
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Trigger sticky state when scrolled more than 100px
      const shouldBeScrolled = scrollPosition > 100;
      
      if (shouldBeScrolled && !isScrolled) {
        // Going from normal to sticky
        setHasScrolledOnce(true);
        setAnimationState('toSticky');
      } else if (!shouldBeScrolled && isScrolled && hasScrolledOnce) {
        // Going from sticky to normal
        setAnimationState('toNormal');
      }
      
      setIsScrolled(shouldBeScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled, hasScrolledOnce]);

  return (
    <>
      {/* Promo Banner */}
      {bannerVisible && (
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-blue-600/90 to-pink-600/90"></div>
          <div className="relative w-full px-6 py-3">
            <div className="flex items-center justify-center gap-6 text-white">
              {/* Close Button */}
              <button 
                onClick={() => setBannerVisible(false)}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-1.5 transition-all duration-200 cursor-pointer group z-10"
                style={{ cursor: 'pointer' }}
                type="button"
              >
                <svg className="w-4 h-4 text-white group-hover:text-gray-100 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Main Promo Text */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold tracking-wider">
                  İlk Müşteriler Özel - Bugünlük %20 İndirim!
                </span>
              </div>

              {/* Date */}
              <div className="hidden md:flex items-center gap-2 text-xs opacity-90">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="tracking-wide">{getTodaysDate()}</span>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold text-yellow-100 tracking-wider">
                  {formatTime(timeLeft)}
                </span>
              </div>

              {/* CTA */}
              <div className="hidden lg:block">
                <span className="text-xs font-medium bg-yellow-400 text-gray-900 px-2 py-1 rounded-full animate-pulse tracking-wide">
                  Acele Et!
                </span>
              </div>
            </div>
          </div>

          {/* Moving Background Animation */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse"></div>
          </div>
        </div>
      )}
      
      <main className="min-h-screen bg-gray-50  flex flex-col">
        {/* Custom Stepper Section with Sticky Behavior */}
        <div 
          className={`z-50 ${
            isScrolled 
              ? 'fixed w-[56%]' 
              : 'relative w-full'
          } ${
            animationState === 'toSticky' ? 'animate-slideDown' : ''
          } ${
            animationState === 'toNormal' ? 'animate-stickyToNormal' : ''
          } ${
            animationState !== 'toSticky' && animationState !== 'toNormal' ? 'transition-all duration-[350ms] ease-in-out' : ''
          }`}
          style={{
            top: isScrolled ? '16px' : 'auto',
            left: isScrolled ? '5.8%' : 'auto',
            transform: 'translateX(0)'
          }}>
          <div className={`transition-all duration-[350ms] ease-in-out ${
            isScrolled
              ? 'glass-effect shadow-2xl rounded-2xl'
              : 'bg-white shadow-sm'
          }`}>
            <div className={`transition-all duration-[350ms] ease-in-out ${
              isScrolled 
                ? 'px-4 py-3' 
                : 'max-w-7xl mx-auto px-6 pt-6 pb-2'
            }`}>
              <div className="flex items-start justify-between relative">
                {steps.map((label, index) => {
                  const isCompleted = index < activeStep;
                  const isActive = index === activeStep;
                  
                  return (
                    <div key={label} className="flex flex-col items-center relative flex-1">
                      {/* Step Icon - Responsive size */}
                      <div className={`rounded-full flex items-center justify-center text-white font-bold transition-all duration-[350ms] ${
                        isScrolled ? 'w-6 h-6 text-xs' : 'w-10 h-10 text-sm'
                      } ${
                        isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-gray-300'
                      }`}>
                        <span className="leading-none">{isCompleted ? '✓' : index + 1}</span>
                      </div>
                      
                      {/* Step Label - Responsive size and visibility */}
                      <div className={`flex items-start justify-center transition-all duration-[350ms] ${
                        isScrolled ? 'mt-1 h-auto' : 'mt-3 h-12'
                      }`}>
                        <span className={`text-center leading-tight transition-all duration-[350ms] ${
                          isScrolled 
                            ? 'text-xs max-w-[100px] line-clamp-1' 
                            : 'text-sm max-w-[200px]'
                        } ${
                          isActive ? 'text-blue-600 font-semibold' : isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'
                        }`}>
                          {label}
                        </span>
                      </div>
                      
                      {/* Connector Line - Responsive positioning */}
                      {index < steps.length - 1 && (
                        <div className={`absolute transition-all duration-[350ms] ${
                          isScrolled 
                            ? 'top-3 left-[60%] w-[80%] h-[2px]' 
                            : 'top-5 left-[60%] w-[80%] h-[3px]'
                        } ${
                          index < activeStep ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Spacer for fixed stepper */}
        {isScrolled && <div className="h-20"></div>}

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
                  {/* Map iframe with error handling */}
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0, borderRadius: '16px', pointerEvents: 'none' }}
                    src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${encodeURIComponent(getValidLocation(fromLocation))}&destination=${encodeURIComponent(getValidLocation(toLocation))}&mode=driving&maptype=roadmap&zoom=${getMapZoom(routeInfo.distance)}&language=en&region=TR`}
                    allowFullScreen={false}
                    onError={() => {
                      console.error('Google Maps failed to load');
                      setMapLoaded(false);
                    }}
                  ></iframe>
                  
                  {/* Interaction Blocker Overlay */}
                  <div 
                    className="absolute inset-0 bg-transparent cursor-default"
                    style={{ pointerEvents: 'all' }}
                    title="Map view only - interactions disabled"
                  ></div>

                  {/* Distance Display Overlay */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-gray-200/50">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-800">{routeInfo.distance}</span>
                    </div>
                  </div>

                  {/* View Only Indicator */}
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-xs text-white/90">View Only</span>
                  </div>
                  
                </div>
              )}
              </div>

              {/* Vehicle Selection Section */}
              <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                <div className="flex items-center  justify-between mb-6">  
                  <h3 className="text-2xl font-bold self-center text-gray-800 ">Select Your Vehicle</h3>
                                       <div className="bg-amber-50 border  border-amber-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                            <span className="text-xs text-amber-700 font-medium">Total price per vehicle (all passengers included)</span>
                    </div>
                </div>
                <div className="space-y-6 flex flex-col">
                  
                  {/* Vehicle Cards - Loop */}
                  {vehicles.map((vehicle, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:border-gray-400 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                      <div className="flex gap-6">
                        {/* Vehicle Image Container */}
                        <div className="w-44 h-full min-h-[220px] bg-gray-100 rounded-xl  flex items-center justify-center">
                          <DirectionsCarIcon className="w-16 h-16 text-gray-400" />
                        </div>
                        
                        {/* Vehicle Details */}
                        <div className="flex-1 flex flex-col justify-between min-h-[112px]">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-lg font-bold text-gray-800">{vehicle.name}</h4>
                              <div className="flex items-center gap-3">
                               
                                                                  <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                    <span>{vehicle.passengers}</span>
                                  </div>
                               
                                <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm font-medium">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                  <span>{vehicle.luggage}</span>
                                </div>
                             
                              </div>
                            </div>
                            
                            {/* Features Grid */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                              {vehicle.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-700">
                                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                  <span className="font-medium">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Pricing */}
                          <div>
                            <div className="mb-4">
                              {/* Divider Line */}
                              <div className="w-full h-[1px] bg-gray-200 shadow-sm mb-3"></div>
                              
                              {/* Info Row */}
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-xs text-gray-500">Please select the currency you wish to pay in</span>
                                
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex  h-16 gap-3">
                                {Object.entries(vehicle.prices).map(([currency, price]) => (
                                  <button 
                                    key={currency}
                                    className={`text-center rounded-lg py-2 transition-all duration-300 cursor-pointer transform ${selectedCurrency === currency 
                                      ? 'bg-green-100 border-2 border-green-500 px-4 scale-105' 
                                      : 'border border-gray-200 hover:border-blue-300 hover:bg-blue-50 px-3'}`}
                                    onClick={() => setSelectedCurrency(currency)}
                                  >
                                    <div className={`text-lg font-bold ${selectedCurrency === currency ? 'text-green-700' : 'text-gray-800'}`}>{price.current}</div>
                                    <div className={`text-xs line-through ${selectedCurrency === currency ? 'text-green-600' : 'text-gray-500'}`}>{price.original}</div>
                                    {selectedCurrency === currency && <div className="text-[10px] text-green-600 bg-white px-2 py-1 shadow-md rounded-full font-medium">20% İndirim</div>}
                                  </button>
                                ))}
                              </div>
                              <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2 group ml-4">
                                Select Vehicle
                                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
            <div className="w-[35%] h-fit sticky top-4">
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
                      <p className="text-xs text-gray-500 mt-1 leading-tight max-h-8 overflow-hidden">
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
                      <p className="text-xs text-gray-500 mt-1 leading-tight max-h-8 overflow-hidden">
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
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
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

              {/* Distance & Duration */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">DISTANCE</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {routeInfo.distance}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <AccessTimeIcon className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-medium">DURATION</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {routeInfo.duration}
                      </p>
                    </div>
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