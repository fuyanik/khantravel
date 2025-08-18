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
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [passengerInfo, setPassengerInfo] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  const [corporateInvoice, setCorporateInvoice] = useState(false);
  const [campaignUpdates, setCampaignUpdates] = useState(false);
  const [corporateInfo, setCorporateInfo] = useState({
    companyName: '',
    invoiceAddress: '',
    taxAdministration: '',
    taxNumber: ''
  });
  const [selectedCountry, setSelectedCountry] = useState({
    code: '+90',
    name: 'Turkey',
    flag: '🇹🇷'
  });
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
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

  // Handle vehicle selection
  const handleVehicleSelection = (vehicle) => {
    setSelectedVehicle(vehicle);
    setActiveStep(2); // Move to step 3 (0-indexed)
    
    // Smooth scroll to top of page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Country options for phone number
  const countries = [
    { code: '+90', name: 'Turkey', flag: '🇹🇷' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+49', name: 'Germany', flag: '🇩🇪' },
    { code: '+7', name: 'Russia', flag: '🇷🇺' },
    { code: '+33', name: 'France', flag: '🇫🇷' },
    { code: '+39', name: 'Italy', flag: '🇮🇹' },
    { code: '+34', name: 'Spain', flag: '🇪🇸' },
    { code: '+31', name: 'Netherlands', flag: '🇳🇱' }
  ];

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setCountryDropdownOpen(false);
  };

  // Additional services data
  const additionalServices = [
    {
      id: 'child-seat',
      name: 'Child Seat',
      description: 'Baby or booster seat',
      price: '+$10',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h1a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h1z" />
        </svg>
      )
    },
    {
      id: 'meet-greet',
      name: 'Meet & Greet',
      description: 'Airport pickup service',
      price: '+$15',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 'extra-luggage',
      name: 'Extra Luggage',
      description: 'Additional bags',
      price: '+$5',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      id: 'wifi-hotspot',
      name: 'Wi-Fi Hotspot',
      description: 'Mobile internet access',
      price: '+$8',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      )
    },
    {
      id: 'premium-water',
      name: 'Premium Water',
      description: 'Complimentary bottled water',
      price: '+$3',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      id: 'phone-charger',
      name: 'Phone Charger',
      description: 'USB charging ports',
      price: '+$2',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'newspaper',
      name: 'Newspapers',
      description: 'Daily newspapers',
      price: '+$1',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      id: 'air-freshener',
      name: 'Air Freshener',
      description: 'Pleasant car fragrance',
      price: '+$2',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    }
  ];

  // Handle service selection
  const handleServiceToggle = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownOpen && !event.target.closest('.country-dropdown')) {
        setCountryDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [countryDropdownOpen]);

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
      // Trigger sticky state when scrolled more than 200px
      const shouldBeScrolled = scrollPosition > 80;
      
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
        {/* Main Stepper Section - Always Visible */}
        <div className="z-40 relative w-full">
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
              <div className="flex items-start justify-between relative">
                {steps.map((label, index) => {
                  const isCompleted = index < activeStep;
                  const isActive = index === activeStep;
                  
                  return (
                    <div key={label} className="flex flex-col items-center relative flex-1">
                      {/* Step Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-gray-300'
                      }`}>
                        <span className="leading-none">{isCompleted ? '✓' : index + 1}</span>
                      </div>
                      
                      {/* Step Label */}
                      <div className="flex items-start justify-center mt-3 h-12">
                        <span className={`text-center leading-tight text-sm max-w-[200px] ${
                          isActive ? 'text-blue-600 font-semibold' : isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'
                        }`}>
                          {label}
                        </span>
                      </div>
                      
                      {/* Connector Line */}
                      {index < steps.length - 1 && (
                        <div className={`absolute top-5 left-[60%] w-[80%] h-[3px] ${
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

        {/* Sticky Stepper - Appears on Scroll */}
        {isScrolled && (
          <div 
            className={`fixed z-50 w-[56%] ${
              animationState === 'toSticky' ? 'animate-slideDown' : ''
            } ${
              animationState === 'toNormal' ? 'animate-stickyToNormal' : ''
            } ${
              animationState !== 'toSticky' && animationState !== 'toNormal' ? 'transition-all duration-[350ms] ease-in-out' : ''
            }`}
            style={{
              top: '16px',
              left: '5.8%',
              transform: 'translateX(0)'
            }}>
            <div className="glass-effect shadow-2xl rounded-2xl">
              <div className="px-4 py-3">
                <div className="flex items-start justify-between relative">
                  {steps.map((label, index) => {
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;
                    
                    return (
                      <div key={label} className="flex flex-col items-center relative flex-1">
                        {/* Step Icon - Compact size */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                          isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-gray-300'
                        }`}>
                          <span className="leading-none">{isCompleted ? '✓' : index + 1}</span>
                        </div>
                        
                        {/* Step Label - Compact */}
                        <div className="flex items-start justify-center mt-1 h-auto">
                          <span className={`text-center leading-tight text-xs max-w-[100px] line-clamp-1 ${
                            isActive ? 'text-blue-600 font-semibold' : isCompleted ? 'text-green-600 font-medium' : 'text-gray-500'
                          }`}>
                            {label}
                          </span>
                        </div>
                        
                        {/* Connector Line - Compact */}
                        {index < steps.length - 1 && (
                          <div className={`absolute top-3 left-[60%] w-[80%] h-[2px] ${
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
        )}

        {/* Main Content - 90% width and centered */}
        <div className="flex-1 flex justify-center py-8">
          <div className="w-[90%] flex gap-6">
            {/* Left Column - Content based on step */}
            <div className="w-[65%] flex flex-col gap-6">
              {activeStep === 1 ? (
                <>
                  {/* Step 2: Vehicle Selection - Google Maps Section */}
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

                  {/* Step 2: Vehicle Selection Section */}
                  <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">  
                      <h3 className="text-2xl font-bold self-center text-gray-800">Select Your Vehicle</h3>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                        <span className="text-xs text-amber-700 font-medium">Total price per vehicle (all passengers included)</span>
                      </div>
                    </div>
                    <div className="space-y-6 flex flex-col">
                      
                      {/* Vehicle Cards - Loop */}
                      {vehicles.map((vehicle, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:border-gray-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-400 group">
                          <div className="flex gap-6">
                            {/* Vehicle Image Container */}
                            <div className="w-44 h-full min-h-[220px] bg-gray-100 rounded-xl flex items-center justify-center">
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
                                  <div className="flex h-16 gap-3">
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
                                  <button 
                                    onClick={() => handleVehicleSelection(vehicle)}
                                    className="bg-gray-900 cursor-pointer text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2 group ml-4"
                                  >
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
                </>
              ) : (
                <>
                  {/* Step 3: Passenger Information & Payment */}
                  {/* Passenger Information Section */}
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Passenger Information</h3>
                    
                    <div className="space-y-6">
                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            value={passengerInfo.name}
                            onChange={(e) => setPassengerInfo({...passengerInfo, name: e.target.value})}
                            className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 ${
                              passengerInfo.name 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-gray-200 focus:border-gray-400'
                            }`}
                            placeholder=" "
                          />
                          <label
                            htmlFor="name"
                            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                              passengerInfo.name
                                ? 'top-[-10px] text-sm text-green-600 bg-white px-1'
                                : 'top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-600 peer-focus:bg-white peer-focus:px-1'
                            }`}
                          >
                            Name *
                          </label>
                        </div>
                        
                        {/* Surname Field */}
                        <div className="relative">
                          <input
                            type="text"
                            id="surname"
                            value={passengerInfo.surname}
                            onChange={(e) => setPassengerInfo({...passengerInfo, surname: e.target.value})}
                            className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 ${
                              passengerInfo.surname 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-gray-200 focus:border-gray-400'
                            }`}
                            placeholder=" "
                          />
                          <label
                            htmlFor="surname"
                            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                              passengerInfo.surname
                                ? 'top-[-10px] text-sm text-green-600 bg-white px-1'
                                : 'top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-600 peer-focus:bg-white peer-focus:px-1'
                            }`}
                          >
                            Surname *
                          </label>
                        </div>
                        
                        {/* Email Field */}
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            value={passengerInfo.email}
                            onChange={(e) => setPassengerInfo({...passengerInfo, email: e.target.value})}
                            className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 ${
                              passengerInfo.email 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-gray-200 focus:border-gray-400'
                            }`}
                            placeholder=" "
                          />
                          <label
                            htmlFor="email"
                            className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                              passengerInfo.email
                                ? 'top-[-10px] text-sm text-green-600 bg-white px-1'
                                : 'top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-600 peer-focus:bg-white peer-focus:px-1'
                            }`}
                          >
                            Email Address *
                          </label>
                        </div>
                        
                        {/* Phone Field */}
                        <div className="relative">
                          <div className="flex">
                            {/* Custom Country Dropdown */}
                            <div className="relative country-dropdown">
                              <button
                                type="button"
                                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                                className={`flex items-center gap-2 px-3 py-3 border-2 border-r-0 rounded-l-lg bg-gray-50 outline-none transition-all duration-200 hover:bg-gray-100 ${
                                  passengerInfo.phone 
                                    ? 'border-green-300' 
                                    : 'border-gray-200 focus:border-gray-400'
                                }`}
                              >
                                <span className="text-lg">{selectedCountry.flag}</span>
                                <span className="text-sm font-medium text-gray-700">{selectedCountry.code}</span>
                                <svg 
                                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${countryDropdownOpen ? 'rotate-180' : ''}`} 
                                  fill="none" 
                                  viewBox="0 0 24 24" 
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              
                              {/* Dropdown Menu */}
                              {countryDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] max-h-60 overflow-y-auto">
                                  {countries.map((country) => (
                                    <button
                                      key={country.code}
                                      type="button"
                                      onClick={() => handleCountrySelect(country)}
                                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                                        selectedCountry.code === country.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                                      }`}
                                    >
                                      <span className="text-lg">{country.flag}</span>
                                      <div className="flex-1">
                                        <span className="text-sm font-medium">{country.name}</span>
                                        <span className="text-xs text-gray-500 ml-2">{country.code}</span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="relative flex-1">
                              <input
                                type="tel"
                                id="phone"
                                value={passengerInfo.phone}
                                onChange={(e) => setPassengerInfo({...passengerInfo, phone: e.target.value})}
                                className={`peer w-full px-4 py-3 border-2 border-l-0 rounded-r-lg outline-none transition-all duration-200 ${
                                  passengerInfo.phone 
                                    ? 'border-green-300 bg-green-50' 
                                    : 'border-gray-200 focus:border-gray-400'
                                }`}
                                placeholder=" "
                              />
                              <label
                                htmlFor="phone"
                                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                                  passengerInfo.phone
                                    ? 'top-[-10px] text-sm text-green-600 bg-white px-1'
                                    : 'top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-600 peer-focus:bg-white peer-focus:px-1'
                                }`}
                              >
                                Phone Number *
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Special Requests */}
                      <div className="relative">
                        <textarea
                          id="specialRequests"
                          rows={4}
                          value={passengerInfo.specialRequests}
                          onChange={(e) => setPassengerInfo({...passengerInfo, specialRequests: e.target.value})}
                          className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 resize-none ${
                            passengerInfo.specialRequests 
                              ? 'border-green-300 bg-green-50' 
                              : 'border-gray-200 focus:border-gray-400'
                          }`}
                          placeholder=" "
                        />
                        <label
                          htmlFor="specialRequests"
                          className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                            passengerInfo.specialRequests
                              ? 'top-[-10px] text-sm text-green-600 bg-white px-1'
                              : 'top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-600 peer-focus:bg-white peer-focus:px-1'
                          }`}
                        >
                          Is there any detail you would like to specify?
                        </label>
                      </div>
                      
                      {/* Checkbox Options */}
                      <div className="flex justify-between items-start gap-6 pt-4">
                        {/* Corporate Invoice */}
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={corporateInvoice}
                              onChange={(e) => setCorporateInvoice(e.target.checked)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                              corporateInvoice 
                                ? 'bg-blue-500 border-blue-500' 
                                : 'border-gray-300 hover:border-blue-400'
                            }`}>
                              {corporateInvoice && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">Corporate Invoice</span>
                        </label>
                        
                        {/* Campaign Updates */}
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={campaignUpdates}
                              onChange={(e) => setCampaignUpdates(e.target.checked)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                              campaignUpdates 
                                ? 'bg-blue-500 border-blue-500' 
                                : 'border-gray-300 hover:border-blue-400'
                            }`}>
                              {campaignUpdates && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">Be informed about campaigns</span>
                        </label>
                      </div>
                      
                      {/* Corporate Invoice Form - Collapsible */}
                      {corporateInvoice && (
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 animate-fadeIn">
                          <h4 className="text-lg font-semibold text-gray-700 mb-4">Corporate Invoice Information</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Company Name */}
                            <div className="relative">
                              <input
                                type="text"
                                id="companyName"
                                value={corporateInfo.companyName}
                                onChange={(e) => setCorporateInfo({...corporateInfo, companyName: e.target.value})}
                                className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 ${
                                  corporateInfo.companyName 
                                    ? 'border-green-300 bg-green-50' 
                                    : 'border-gray-200 focus:border-gray-400'
                                }`}
                                placeholder=" "
                              />
                              <label
                                htmlFor="companyName"
                                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                                  corporateInfo.companyName
                                    ? 'top-[-10px] text-sm text-green-600 bg-gray-50 px-1'
                                    : 'top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-600 peer-focus:bg-gray-50 peer-focus:px-1'
                                }`}
                              >
                                Company Name
                              </label>
                            </div>
                            
                            {/* Invoice Address */}
                            <div className="relative">
                              <input
                                type="text"
                                id="invoiceAddress"
                                value={corporateInfo.invoiceAddress}
                                onChange={(e) => setCorporateInfo({...corporateInfo, invoiceAddress: e.target.value})}
                                className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 ${
                                  corporateInfo.invoiceAddress 
                                    ? 'border-green-300 bg-green-50' 
                                    : 'border-gray-200 focus:border-gray-400'
                                }`}
                                placeholder=" "
                              />
                              <label
                                htmlFor="invoiceAddress"
                                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                                  corporateInfo.invoiceAddress
                                    ? 'top-[-10px] text-sm text-green-600 bg-gray-50 px-1'
                                    : 'top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-600 peer-focus:bg-gray-50 peer-focus:px-1'
                                }`}
                              >
                                Your Invoice Address
                              </label>
                            </div>
                            
                            {/* Tax Administration */}
                            <div className="relative">
                              <input
                                type="text"
                                id="taxAdministration"
                                value={corporateInfo.taxAdministration}
                                onChange={(e) => setCorporateInfo({...corporateInfo, taxAdministration: e.target.value})}
                                className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 ${
                                  corporateInfo.taxAdministration 
                                    ? 'border-green-300 bg-green-50' 
                                    : 'border-gray-200 focus:border-gray-400'
                                }`}
                                placeholder=" "
                              />
                              <label
                                htmlFor="taxAdministration"
                                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                                  corporateInfo.taxAdministration
                                    ? 'top-[-10px] text-sm text-green-600 bg-gray-50 px-1'
                                    : 'top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-600 peer-focus:bg-gray-50 peer-focus:px-1'
                                }`}
                              >
                                Tax Administration
                              </label>
                            </div>
                            
                            {/* Tax Number */}
                            <div className="relative">
                              <input
                                type="text"
                                id="taxNumber"
                                value={corporateInfo.taxNumber}
                                onChange={(e) => setCorporateInfo({...corporateInfo, taxNumber: e.target.value})}
                                className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 ${
                                  corporateInfo.taxNumber 
                                    ? 'border-green-300 bg-green-50' 
                                    : 'border-gray-200 focus:border-gray-400'
                                }`}
                                placeholder=" "
                              />
                              <label
                                htmlFor="taxNumber"
                                className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                                  corporateInfo.taxNumber
                                    ? 'top-[-10px] text-sm text-green-600 bg-gray-50 px-1'
                                    : 'top-3 text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-500 peer-focus:top-[-10px] peer-focus:text-sm peer-focus:text-gray-600 peer-focus:bg-gray-50 peer-focus:px-1'
                                }`}
                              >
                                Tax Number
                              </label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Services Section */}
                  <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Additional Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {additionalServices.map((service) => {
                        const isSelected = selectedServices.includes(service.id);
                        return (
                          <div
                            key={service.id}
                            onClick={() => handleServiceToggle(service.id)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                              isSelected 
                                ? 'border-green-300 bg-green-50 shadow-sm' 
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Icon */}
                              <div className={`p-2 rounded-lg transition-colors duration-200 ${
                                isSelected 
                                  ? 'bg-green-100 text-green-600' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {service.icon}
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <span className={`text-sm font-semibold transition-colors duration-200 ${
                                    isSelected ? 'text-green-800' : 'text-gray-800'
                                  }`}>
                                    {service.name}
                                  </span>
                                  <span className={`text-sm font-bold transition-colors duration-200 ${
                                    isSelected ? 'text-green-700' : 'text-gray-700'
                                  }`}>
                                    {service.price}
                                  </span>
                                </div>
                                <p className={`text-xs transition-colors duration-200 ${
                                  isSelected ? 'text-green-600' : 'text-gray-500'
                                }`}>
                                  {service.description}
                                </p>
                              </div>
                              
                              {/* Checkbox indicator */}
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                isSelected 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Selected Services Summary */}
                    {selectedServices.length > 0 && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-semibold text-green-800">Selected Services ({selectedServices.length})</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedServices.map(serviceId => {
                            const service = additionalServices.find(s => s.id === serviceId);
                            return (
                              <span key={serviceId} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                {service?.name} {service?.price}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
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

              {/* Selected Vehicle Info */}
              {selectedVehicle && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <DirectionsCarIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900 mb-1">{selectedVehicle.name}</p>
                      <div className="flex items-center gap-3 text-xs text-green-700 mb-2">
                        <span>{selectedVehicle.passengers}</span>
                        <span>•</span>
                        <span>{selectedVehicle.luggage}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-green-800">
                          {selectedVehicle.prices[selectedCurrency].current}
                        </div>
                        <div className="text-xs text-green-600 line-through">
                          {selectedVehicle.prices[selectedCurrency].original}
                        </div>
                      </div>
                      <div className="text-xs text-green-600 mt-1 bg-green-100 px-2 py-1 rounded-full inline-block">
                        20% Discount Applied
                      </div>
                    </div>
                  </div>
                </div>
              )}

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