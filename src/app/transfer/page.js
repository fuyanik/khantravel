"use client"

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';



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
  const [showTripDetails, setShowTripDetails] = useState(false); // Mobile trip details popup
  const [isMobile, setIsMobile] = useState(null); // null = not determined yet
  const [mounted, setMounted] = useState(false);
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState(0); // For mobile carousel
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showVehicleGallery, setShowVehicleGallery] = useState(false);
  const [galleryVehicle, setGalleryVehicle] = useState(null);
  const [showDesktopGallery, setShowDesktopGallery] = useState(false);
  const [desktopGalleryVehicle, setDesktopGalleryVehicle] = useState(null);
  
  // Payment form states
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });
  const [cardFlipped, setCardFlipped] = useState(false);
  
  // Google Maps real-time data
  const [googleMapsData, setGoogleMapsData] = useState({
    distance: null,
    duration: null,
    loading: false,
    error: null,
    polyline: null  // For Static Maps API route
  });
  
  // Validation states
  const [validationErrors, setValidationErrors] = useState({
    cardNumber: false,
    cardHolder: false,
    expiryDate: false,
    cvv: false,
    email: false,
    phone: false
  });

  // Helper function to get valid location for Google Maps
  const getValidLocation = (location) => {
    if (!location || location === 'Not selected' || location.trim() === '') {
      return 'Istanbul, Turkey';
    }
    
    // Handle complex location formats like "Name | Full Address"
    let cleanLocation = location;
    
    // If location contains "|", take the part after it (full address)
    if (location.includes('|')) {
      cleanLocation = location.split('|')[1].trim();
    }
    
    // Clean up common patterns
    cleanLocation = cleanLocation
      .replace(/\s*\([^)]*\)\s*/g, '') // Remove parentheses and content
      .replace(/\s*\|\s*.*$/g, '')     // Remove anything after |
      .trim();
    
    // Fallback to simple airport names
    if (cleanLocation.toLowerCase().includes('sabiha gök') || cleanLocation.toLowerCase().includes('saw')) {
      return 'Sabiha Gökçen Airport, Istanbul, Turkey';
    }
    if (cleanLocation.toLowerCase().includes('istanbul airport') || cleanLocation.toLowerCase().includes('ist')) {
      return 'Istanbul Airport, Istanbul, Turkey';
    }
    if (cleanLocation.toLowerCase().includes('galataport')) {
      return 'Galataport Istanbul, Beyoğlu, Istanbul, Turkey';
    }
    
    return cleanLocation || 'Istanbul, Turkey';
  };

  // Set document title on client side
  useEffect(() => {
    document.title = "Khan Travel Transfer - Book Your Premium Transfer Service";
  }, []);

  // Check if mobile - runs immediately on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check immediately on mount
    checkMobile();
    setMounted(true);
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Global script loading state to prevent multiple loads
  const [googleMapsLoading, setGoogleMapsLoading] = useState(false);

  // Fetch real-time distance and duration from Google Maps Distance Matrix API
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const loadGoogleMapsScript = () => {
      return new Promise((resolve, reject) => {
        // Check if Google Maps is already loaded
        if (typeof window.google !== 'undefined' && window.google.maps) {
          console.log('✅ Google Maps already loaded');
          setGoogleMapsLoading(false);
          resolve();
          return;
        }

        // Check if already loading
        if (googleMapsLoading) {
          console.log('🔄 Google Maps script already loading, waiting...');
          const checkInterval = setInterval(() => {
            if (typeof window.google !== 'undefined' && window.google.maps) {
              clearInterval(checkInterval);
              setGoogleMapsLoading(false);
              resolve();
            }
          }, 100);
          return;
        }

        // Check if script is already in DOM
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          console.log('🔄 Google Maps script found in DOM, waiting...');
          setGoogleMapsLoading(true);
          existingScript.addEventListener('load', () => {
            console.log('✅ Google Maps script loaded successfully (waited for existing)');
            setGoogleMapsLoading(false);
            resolve();
          });
          existingScript.addEventListener('error', (error) => {
            console.error('❌ Failed to load Google Maps script (existing):', error);
            setGoogleMapsLoading(false);
            reject(error);
          });
          return;
        }

        console.log('🔄 Loading Google Maps script...');
        setGoogleMapsLoading(true);
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC391QVA3pQwHCTknJxUmWmK07l0G1Uqzc&libraries=places,geometry`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          console.log('✅ Google Maps script loaded successfully');
          setGoogleMapsLoading(false);
          resolve();
        };
        script.onerror = (error) => {
          console.error('❌ Failed to load Google Maps script:', error);
          setGoogleMapsLoading(false);
          reject(error);
        };
        document.head.appendChild(script);
      });
    };

    const fetchGoogleMapsData = async () => {
      // Small delay to ensure searchParams are ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentFromLocation = searchParams?.get('from') || 'Not selected';
      const currentToLocation = searchParams?.get('to') || 'Not selected';
      
      console.log('🌍 From:', currentFromLocation);
      console.log('🏁 To:', currentToLocation);

      // Skip if locations are not valid
      if (!currentFromLocation || !currentToLocation || 
          currentFromLocation === 'Not selected' || currentToLocation === 'Not selected' ||
          currentFromLocation === currentToLocation) {
        console.log('⚠️ Invalid locations, skipping API call');
        setGoogleMapsData({
          distance: null,
          duration: null,
          loading: false,
          error: null
        });
        return;
      }

      // Start loading
      console.log('🔄 Starting Google Maps API call...');
      setGoogleMapsData(prev => ({ ...prev, loading: true, error: null }));

      try {
        // Load Google Maps script
        await loadGoogleMapsScript();
        console.log('✅ Google Maps script ready');

        // Create services
        const distanceService = new window.google.maps.DistanceMatrixService();
        const directionsService = new window.google.maps.DirectionsService();
        console.log('✅ Services created');
        
        // Clean and prepare locations
        const cleanFromLocation = getValidLocation(currentFromLocation);
        const cleanToLocation = getValidLocation(currentToLocation);
        
        console.log('🧹 Cleaned From:', cleanFromLocation);
        console.log('🧹 Cleaned To:', cleanToLocation);
        
        // Set timeout for API call
        const timeoutId = setTimeout(() => {
          console.log('⏰ API call timeout after 10 seconds');
          setGoogleMapsData({
            distance: null,
            duration: null,
            loading: false,
            error: 'Timeout - using static data',
            polyline: null
          });
        }, 10000);

        // Make Distance Matrix API call
        console.log('📡 Making Distance Matrix API call...');
        distanceService.getDistanceMatrix({
          origins: [cleanFromLocation],
          destinations: [cleanToLocation],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        }, (response, status) => {
          console.log('📨 Distance Matrix Response Status:', status);
          
          if (status === 'OK' && response.rows[0]?.elements[0]?.status === 'OK') {
            const element = response.rows[0].elements[0];
            console.log('✅ Distance found:', element);
            
            // Convert to readable format
            const distanceInKm = (element.distance.value / 1000).toFixed(1);
            const durationInMin = Math.round(element.duration.value / 60);
            
            const formattedDistance = `${distanceInKm} km`;
            const formattedDuration = durationInMin < 60 
              ? `${durationInMin} min` 
              : `${Math.floor(durationInMin / 60)} hr ${durationInMin % 60} min`;
            
            console.log('📏 Distance:', formattedDistance);
            console.log('⏱️ Duration:', formattedDuration);
            
            // Now get the route polyline for Static Maps
            console.log('📡 Making Directions API call for polyline...');
            directionsService.route({
              origin: cleanFromLocation,
              destination: cleanToLocation,
              travelMode: window.google.maps.TravelMode.DRIVING,
            }, (directionsResult, directionsStatus) => {
              clearTimeout(timeoutId);
              
              if (directionsStatus === 'OK' && directionsResult.routes[0]) {
                // Get the encoded polyline string from overview_path or overview_polyline
                let polylineString = null;
                
                // Try to get from overview_polyline (it's an object with 'points' property in some versions)
                if (directionsResult.routes[0].overview_polyline) {
                  polylineString = directionsResult.routes[0].overview_polyline;
                  // If it's an object, get the points property
                  if (typeof polylineString === 'object' && polylineString.points) {
                    polylineString = polylineString.points;
                  }
                }
                
                // Fallback: encode the overview_path manually
                if (!polylineString && directionsResult.routes[0].overview_path) {
                  const path = directionsResult.routes[0].overview_path;
                  polylineString = window.google.maps.geometry?.encoding?.encodePath(path);
                }
                
                console.log('✅ Polyline obtained:', polylineString ? 'Yes' : 'No');
                console.log('📍 Polyline sample:', polylineString?.substring(0, 50) + '...');
                
                setGoogleMapsData({
                  distance: formattedDistance,
                  duration: formattedDuration,
                  loading: false,
                  error: null,
                  polyline: polylineString
                });
              } else {
                console.log('⚠️ Could not get polyline, using distance data only');
                setGoogleMapsData({
                  distance: formattedDistance,
                  duration: formattedDuration,
                  loading: false,
                  error: null,
                  polyline: null
                });
              }
            });
          } else {
            clearTimeout(timeoutId);
            console.error('❌ Distance Matrix API call failed:', status, response);
            setGoogleMapsData({
              distance: null,
              duration: null,
              loading: false,
              error: `API Error: ${status}`,
              polyline: null
            });
          }
        });
      } catch (error) {
        console.error('💥 Error in fetchGoogleMapsData:', error);
        setGoogleMapsData({
          distance: null,
          duration: null,
          loading: false,
          error: error.message,
          polyline: null
        });
        // Reset loading state on error
        setGoogleMapsLoading(false);
      }
    };

    fetchGoogleMapsData();
  }, [searchParams]);

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
        'galataport': { distance: '49.5 km', duration: '55 min' },
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
        'galataport': { distance: '43.3 km', duration: '53 min' },
        'galata': { distance: '44.1 km', duration: '55 min' },
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
        'galataport': { distance: '2.2 km', duration: '10 min' },
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
        'galataport': { distance: '3.2 km', duration: '11 min' },
        'galata': { distance: '3.4 km', duration: '12 min' },
        'karakoy': { distance: '2.8 km', duration: '11 min' },
        'default': { distance: '8.5 km', duration: '20 min' }
      },
      'galataport': {
        'istanbul airport': { distance: '49.5 km', duration: '55 min' },
        'sabiha gokcen airport': { distance: '43.3 km', duration: '53 min' },
        'taksim': { distance: '2.2 km', duration: '10 min' },
        'sultanahmet': { distance: '3.2 km', duration: '11 min' },
        'kadikoy': { distance: '12.5 km', duration: '28 min' },
        'besiktas': { distance: '5.1 km', duration: '16 min' },
        'ortakoy': { distance: '8.7 km', duration: '25 min' },
        'bebek': { distance: '10.2 km', duration: '29 min' },
        'levent': { distance: '7.8 km', duration: '22 min' },
        'etiler': { distance: '9.3 km', duration: '27 min' },
        'maslak': { distance: '13.1 km', duration: '35 min' },
        'sariyer': { distance: '20.7 km', duration: '52 min' },
        'default': { distance: '6 km', duration: '15 min' }
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
      // Nispetiye / Etiler area
      'nispetiye': {
        'pendik': { distance: '74.5 km', duration: '72 min' },
        'sabiha gokcen airport': { distance: '61.2 km', duration: '65 min' },
        'istanbul airport': { distance: '39.8 km', duration: '45 min' },
        'taksim': { distance: '7.2 km', duration: '18 min' },
        'sultanahmet': { distance: '12.8 km', duration: '28 min' },
        'kadikoy': { distance: '19.5 km', duration: '35 min' },
        'besiktas': { distance: '3.5 km', duration: '10 min' },
        'ortakoy': { distance: '2.8 km', duration: '8 min' },
        'bebek': { distance: '1.9 km', duration: '6 min' },
        'levent': { distance: '2.3 km', duration: '7 min' },
        'maslak': { distance: '6.1 km', duration: '14 min' },
        'etiler': { distance: '0.8 km', duration: '3 min' },
        'galataport': { distance: '9.1 km', duration: '22 min' },
        'default': { distance: '8 km', duration: '20 min' }
      },
      'pendik': {
        'nispetiye': { distance: '74.5 km', duration: '72 min' },
        'etiler': { distance: '75.2 km', duration: '73 min' },
        'bebek': { distance: '76.1 km', duration: '75 min' },
        'besiktas': { distance: '28.7 km', duration: '45 min' },
        'taksim': { distance: '32.4 km', duration: '48 min' },
        'sultanahmet': { distance: '30.2 km', duration: '42 min' },
        'kadikoy': { distance: '18.5 km', duration: '28 min' },
        'sabiha gokcen airport': { distance: '8.3 km', duration: '12 min' },
        'istanbul airport': { distance: '85.6 km', duration: '95 min' },
        'galataport': { distance: '34.1 km', duration: '50 min' },
        'default': { distance: '30 km', duration: '45 min' }
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
        // Port and waterfront normalizations
        .replace(/galataport|galata port/g, 'galataport')
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
        // Add Nispetiye/Pendik
        .replace(/nispetiye metro.*|nisbetiye.*|etiler.*akat/gi, 'nispetiye')
        .replace(/pendik\/.*/gi, 'pendik')
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
    setActiveStep(2); // Move to step 2 (passenger information)
  };

  // Scroll to top when activeStep changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [activeStep]);

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

  // Get card type from card number
  const getCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    return '';
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      const formatted = v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
      
      // Validation: Check if date is not in the past
      if (v.length >= 4) {
        const month = parseInt(v.slice(0, 2));
        const year = parseInt('20' + v.slice(2, 4));
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        
        // Check if month is valid (01-12)
        if (month < 1 || month > 12) {
          return v.slice(0, 2);
        }
        
        // Check if date is in the past
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          return v.slice(0, 2);
        }
      }
      
      return formatted;
    }
    return v;
  };

  // Validation functions
  const validateCardNumber = (cardNumber) => {
    const numbers = cardNumber.replace(/\s/g, '');
    return numbers.length >= 13 && numbers.length <= 19;
  };

  const validateCardHolder = (cardHolder) => {
    return cardHolder.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(cardHolder.trim());
  };

  const validateExpiryDate = (expiryDate) => {
    if (expiryDate.length !== 5 || !expiryDate.includes('/')) return false;
    
    const [month, year] = expiryDate.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt('20' + year);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    // Check if month is valid (01-12)
    if (monthNum < 1 || monthNum > 12) return false;
    
    // Check if date is not in the past
    if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) return false;
    
    return true;
  };

  const validateCVV = (cvv) => {
    return cvv.length === 3 && /^\d{3}$/.test(cvv);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email.trim() !== '' && emailRegex.test(email.trim());
  };

  const validatePhone = (phone) => {
    return phone.length >= 7 && /^\d+$/.test(phone);
  };

  // Check if all fields are valid
  const isFormValid = () => {
    return validateCardNumber(cardDetails.cardNumber) &&
           validateCardHolder(cardDetails.cardHolder) &&
           validateExpiryDate(cardDetails.expiryDate) &&
           validateCVV(cardDetails.cvv);
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
  const getMapZoom = (distance, forMobile = false) => {
    if (!distance || typeof distance !== 'string') return forMobile ? 10 : 7;
    
    // Extract numeric value from distance string (e.g., "47.2 km" -> 47.2)
    const numericDistance = parseFloat(distance.replace(/[^\d.]/g, ''));
    
    if (isNaN(numericDistance)) return forMobile ? 10 : 7;
    
    // Desktop: Much more zoomed out for full route overview
    if (!forMobile) {
      if (numericDistance < 3) return 10;        // Very close (under 3km)
      else if (numericDistance < 8) return 9;    // Close (3-8km)  
      else if (numericDistance < 15) return 8;   // Medium close (8-15km)
      else if (numericDistance < 25) return 7.5; // Medium (15-25km)
      else if (numericDistance < 35) return 7;   // Medium-far (25-35km)
      else if (numericDistance < 45) return 6.5; // Far (35-45km)
      else if (numericDistance < 60) return 6;   // Very far (45-60km)
      else if (numericDistance < 80) return 5.5; // Extremely far (60-80km)
      else return 5;                             // Maximum distance (80km+)
    }
    
    // Mobile: Original zoom levels
    if (numericDistance < 3) return 13.5;      // Very close (under 3km)
    else if (numericDistance < 8) return 12.5; // Close (3-8km)  
    else if (numericDistance < 15) return 11.5; // Medium close (8-15km)
    else if (numericDistance < 25) return 10.8; // Medium (15-25km)
    else if (numericDistance < 35) return 10.2; // Medium-far (25-35km)
    else if (numericDistance < 45) return 9.8;  // Far (35-45km) - Sabiha to Galataport
    else if (numericDistance < 60) return 9.3;  // Very far (45-60km)
    else if (numericDistance < 80) return 8.8;  // Extremely far (60-80km)
    else return 8.5;                            // Maximum distance (80km+)
  };

  // Function to get vehicle image
  const getVehicleImage = (vehicleName) => {
    const imageMap = {
      'Premium Sedan': 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=1200&fit=crop&q=80',
      'SUV Private': 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=1200&fit=crop&q=80',
      'Van Private': 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&h=1200&fit=crop&q=80',
      'Sprinter & VW Private': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=1200&fit=crop&q=80',
      'Midibus Private': 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=1200&fit=crop&q=80',
      'Luxury Bus': 'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&h=1200&fit=crop&q=80'
    };
    return imageMap[vehicleName] || imageMap['Premium Sedan'];
  };

  // Function to get vehicle gallery images
  const getVehicleGalleryImages = (vehicleName) => {
    const galleryMap = {
      'Premium Sedan': [
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop&q=80'
      ],
      'SUV Private': [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop&q=80'
      ],
      'Van Private': [
        'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1609520505218-7421df70a5e5?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1621976498727-9e5d56476276?w=800&h=600&fit=crop&q=80'
      ],
      'Sprinter & VW Private': [
        'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800&h=600&fit=crop&q=80'
      ],
      'Midibus Private': [
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&h=600&fit=crop&q=80'
      ],
      'Luxury Bus': [
        'https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
        'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800&h=600&fit=crop&q=80'
      ]
    };
    return galleryMap[vehicleName] || galleryMap['Premium Sedan'];
  };

  // Vehicle badge icons as SVG components
  const badgeIcons = {
    trophy: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C13.1 2 14 2.9 14 4V5H19C19.55 5 20 5.45 20 6V9C20 11.21 18.21 13 16 13H15.72C15.35 14.22 14.5 15.27 13.35 15.87L14 22H10L10.65 15.87C9.5 15.27 8.65 14.22 8.28 13H8C5.79 13 4 11.21 4 9V6C4 5.45 4.45 5 5 5H10V4C10 2.9 10.9 2 12 2ZM6 7V9C6 10.1 6.9 11 8 11H8.08C8.03 10.67 8 10.34 8 10V7H6ZM16 7V10C16 10.34 15.97 10.67 15.92 11H16C17.1 11 18 10.1 18 9V7H16Z"/>
      </svg>
    ),
    family: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 4C16 2.9 15.1 2 14 2C12.9 2 12 2.9 12 4C12 5.1 12.9 6 14 6C15.1 6 16 5.1 16 4ZM20 13C21.1 13 22 12.1 22 11C22 9.9 21.1 9 20 9C18.9 9 18 9.9 18 11C18 12.1 18.9 13 20 13ZM20 14C18.33 14 15 14.92 15 16.5V19H17V22H23V19H25V16.5C25 14.92 21.67 14 20 14ZM9 6C10.1 6 11 5.1 11 4C11 2.9 10.1 2 9 2C7.9 2 7 2.9 7 4C7 5.1 7.9 6 9 6ZM11 18H7V14H5V22H7V20H11V22H13V14H11V18ZM14 8C12.9 8 11.96 8.47 11.33 9.2C10.6 8.47 9.67 8 8.56 8C6.56 8 5 9.56 5 11.56V13H7V11.5C7 10.67 7.67 10 8.5 10C9.33 10 10 10.67 10 11.5V13H12V11.5C12 10.67 12.67 10 13.5 10C14.33 10 15 10.67 15 11.5V13H17V11.56C17 9.56 15.56 8 14 8Z"/>
      </svg>
    ),
    discount: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.41 11.58L12.41 2.58C12.05 2.22 11.55 2 11 2H4C2.9 2 2 2.9 2 4V11C2 11.55 2.22 12.05 2.59 12.42L11.59 21.42C11.95 21.78 12.45 22 13 22C13.55 22 14.05 21.78 14.41 21.41L21.41 14.41C21.78 14.05 22 13.55 22 13C22 12.45 21.77 11.94 21.41 11.58ZM5.5 7C4.67 7 4 6.33 4 5.5C4 4.67 4.67 4 5.5 4C6.33 4 7 4.67 7 5.5C7 6.33 6.33 7 5.5 7ZM13 18.5L5.5 11L13 3.5L20.5 11L13 18.5Z"/>
      </svg>
    ),
    comfort: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
      </svg>
    ),
    corporate: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 7V3H2V21H22V7H12ZM6 19H4V17H6V19ZM6 15H4V13H6V15ZM6 11H4V9H6V11ZM6 7H4V5H6V7ZM10 19H8V17H10V19ZM10 15H8V13H10V15ZM10 11H8V9H10V11ZM10 7H8V5H10V7ZM20 19H12V17H14V15H12V13H14V11H12V9H20V19ZM18 11H16V13H18V11ZM18 15H16V17H18V15Z"/>
      </svg>
    ),
    vip: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1L9 9H2L7 14L5 22L12 17L19 22L17 14L22 9H15L12 1Z"/>
      </svg>
    )
  };

  // Vehicle badges data
  const vehicleBadges = {
    'Premium Sedan': { text: 'En Çok Tercih', color: 'from-amber-500 to-orange-600', icon: 'trophy' },
    'SUV Private': { text: 'Aileler İçin', color: 'from-blue-500 to-cyan-600', icon: 'family' },
    'Van Private': { text: 'Grup İndirimi', color: 'from-green-500 to-emerald-600', icon: 'discount' },
    'Sprinter & VW Private': { text: 'Konforlu', color: 'from-teal-500 to-cyan-600', icon: 'comfort' },
    'Midibus Private': { text: 'Kurumsal', color: 'from-purple-500 to-violet-600', icon: 'corporate' },
    'Luxury Bus': { text: 'VIP Hizmet', color: 'from-rose-500 to-pink-600', icon: 'vip' }
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
    'Vehicle Selection',
    'Passenger Information & Additional Services',
    'Trip Details & Payment'
  ];

  // Mobile step names (Turkish - short)
  const mobileStepNames = [
    'Bilgiler',
    'Araç',
    'Yolcu',
    'Ödeme'
  ];

  // Social proof counter (simulated live data)
  const [viewingCount, setViewingCount] = useState(2847);
  const [paidCount, setPaidCount] = useState(1283);
  
  useEffect(() => {
    // Simulate live viewing counter
    const interval = setInterval(() => {
      setViewingCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // FAQ Data
  const faqData = [
    {
      question: 'Rezervasyonumu nasıl iptal edebilirim?',
      answer: 'Rezervasyonunuzu uygulama üzerinden veya müşteri hizmetlerini arayarak ücretsiz olarak iptal edebilirsiniz. İptal işlemi transfer saatinden 24 saat öncesine kadar ücretsizdir.'
    },
    {
      question: 'Uçuşum rötar yaparsa ne olur?',
      answer: 'Endişelenmeyin! Uçuş takip sistemimiz sayesinde şoförünüz otomatik olarak bilgilendirilir ve yeni varış saatinize göre bekler.'
    },
    {
      question: 'Bebek koltuğu talep edebilir miyim?',
      answer: 'Evet, ek hizmetler bölümünden bebek koltuğu talebinde bulunabilirsiniz. Çocuğunuzun yaşına uygun koltuk temin edilecektir.'
    },
    {
      question: 'Ödeme yöntemleri nelerdir?',
      answer: 'Kredi kartı, banka kartı ve online ödeme yöntemlerini kabul ediyoruz. Tüm ödemeler 256-bit SSL ile güvence altındadır.'
    }
  ];

  // User Reviews Data
  const userReviews = [
    {
      id: 1,
      name: 'Ahmet Y.',
      avatar: '👨‍💼',
      rating: 5,
      vehicle: 'Premium Sedan',
      comment: 'Mükemmel hizmet! Şoför çok nazik ve profesyoneldi. Kesinlikle tekrar kullanacağım.',
      date: '2 gün önce'
    },
    {
      id: 2,
      name: 'Elif K.',
      avatar: '👩‍💻',
      rating: 5,
      vehicle: 'SUV Private',
      comment: 'Havalimanından otele transfer çok konforlu geçti. Araç tertemizdi.',
      date: '3 gün önce'
    },
    {
      id: 3,
      name: 'Mehmet S.',
      avatar: '👨‍🔧',
      rating: 4,
      vehicle: 'Van Private',
      comment: 'Aile olarak 6 kişiydik, van çok rahat ve genişti. Teşekkürler!',
      date: '1 hafta önce'
    },
    {
      id: 4,
      name: 'Zeynep A.',
      avatar: '👩‍🎨',
      rating: 5,
      vehicle: 'Premium Sedan',
      comment: 'İş seyahatlerim için vazgeçilmez. Her zaman zamanında ve güvenilir.',
      date: '1 hafta önce'
    },
    {
      id: 5,
      name: 'Can B.',
      avatar: '👨‍🏫',
      rating: 5,
      vehicle: 'Sprinter',
      comment: 'Grup transferi için ideal. Fiyat/performans oranı çok iyi.',
      date: '2 hafta önce'
    }
  ];

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(null);



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

  // Don't render until mounted to prevent flash of wrong layout
  if (!mounted || isMobile === null) {
    return (
      <div className="min-h-screen bg-white md:bg-gray-50">
        {/* Skeleton placeholder to prevent layout shift */}
      </div>
    );
  }

  return (
    <>
      {/* Promo Banner */}
      {false && (
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
                  %20 İndirim!
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
      
      <main className={`min-h-screen flex flex-col ${isMobile ? 'bg-white' : 'bg-gray-50'}`}>
        {/* ==================== MOBILE HEADER - iOS Style ==================== */}
        {isMobile && (
          <div className="sticky top-0 z-50 bg-white">
            {/* Area 1: Navigation Bar */}
            <div className="relative flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
              {/* Back Arrow */}
              <button 
                onClick={() => activeStep > 1 ? setActiveStep(activeStep - 1) : window.history.back()}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10"
              >
                <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Title - Perfectly Centered */}
              <h1 className="absolute inset-0 flex items-center justify-center text-base font-semibold text-gray-900 pointer-events-none">
                {activeStep === 1 ? 'Araç Seçimi' : activeStep === 2 ? 'Yolcu Bilgileri' : activeStep === 3 ? 'Ödeme' : 'Transfer'}
              </h1>
              
              {/* WhatsApp Support - Icon Only */}
              <a 
                href="https://wa.me/901234567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center bg-green-500 rounded-full hover:bg-green-600 transition-colors z-10"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
            
            {/* Area 2: iOS Style Stepper - Yatay düzen: Daire - Çizgi - Daire - Çizgi ... */}
            <div className="px-4 py-3 bg-white">
              <div className="flex items-start justify-center">
                {mobileStepNames.map((name, index) => {
                  const stepNum = index + 1;
                  const isCompleted = stepNum < activeStep;
                  const isActive = stepNum === activeStep;
                  
                  return (
                    <div key={index} className="flex items-start">
                      {/* Step Item: Circle + Name */}
                      <div className="flex flex-col items-center">
                        <div 
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 ${
                            isActive 
                              ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-white shadow-md' 
                              : isCompleted 
                                ? 'bg-gradient-to-br from-gray-900 to-blue-900 text-white' 
                                : 'bg-white border-2 border-gray-200 text-gray-400'
                          }`}
                        >
                          {isCompleted ? (
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            stepNum
                          )}
                        </div>
                        <span className={`mt-1 text-[10px] font-medium transition-colors whitespace-nowrap ${
                          isActive ? 'text-gray-900' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {name}
                        </span>
                      </div>
                      
                      {/* Connector Line - yuvarlaklar arasında, tam ortada */}
                      {index < mobileStepNames.length - 1 && (
                        <div className="flex items-center h-7 mx-4">
                          <div 
                            className={`w-10 h-[2px] ${
                              stepNum < activeStep ? 'bg-gradient-to-r from-gray-900 to-blue-900' : 'bg-gray-200'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Area 3: Social Proof Banner */}
            <div className="bg-gradient-to-r hidden from-gray-900 via-gray-800 to-blue-900 px-4 py-2.5">
              <div className="flex items-center justify-between">
                {/* Viewing Count */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-xs font-medium">
                    <span className="text-green-400 font-bold">{viewingCount}</span> kişi siteyi inceliyor
                  </span>
                </div>
                
                {/* Safe Payment */}
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 text-xs">•</span>
                  <span className="text-white text-xs font-medium">Güvenli Ödeme</span>
                  <span className="text-green-400 text-xs font-bold">%100</span>
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* ==================== DESKTOP HEADER ==================== */}
        {!isMobile && (
          <>
        {/* PART 1: Top Navbar - Liquid Glass */}
        <div className="z-40 relative w-full bg-white/90 backdrop-blur-2xl border-b border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Left: Back + Logo */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => activeStep > 1 ? setActiveStep(activeStep - 1) : window.history.back()}
                  className="w-11 h-11 rounded-xl bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-all shadow-lg"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <a href="/" className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    Khan<span className="font-light text-gray-600">Travel</span>
                  </span>
                </a>
              </div>
              
              {/* Center: Stepper with Labels */}
              <div className="flex items-center gap-2 bg-gray-50/80 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-gray-200/50">
                {steps.map((label, index) => {
                  const isCompleted = index < activeStep;
                  const isActive = index === activeStep;
                  const shortLabel = label.split(' ').slice(0, 2).join(' ');
                  
                  return (
                    <div key={label} className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 text-[11px] rounded-full flex items-center justify-center font-bold transition-all ${
                          isCompleted 
                            ? 'bg-green-500 text-white shadow-md shadow-green-500/30' 
                            : isActive 
                              ? 'bg-gray-900 text-white shadow-md' 
                              : 'bg-gray-200 text-gray-400'
                        }`}>
                          {isCompleted ? (
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : index + 1}
                        </div>
                        <span className={`text-xs font-semibold hidden xl:inline transition-colors ${
                          isActive ? 'text-gray-900' : isCompleted ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {shortLabel}
                        </span>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-6 h-0.5 mx-2 rounded-full ${
                          index < activeStep ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Right: Support */}
              <a 
                href="https://wa.me/905551234567" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-medium shadow-lg shadow-green-500/30"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                7/24 Destek
              </a>
            </div>
          </div>
        </div>
        
        {/* PART 2: New Year Promo Banner - Professional Winter Theme */}
        <div className="relative w-full overflow-hidden bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900">
          {/* Subtle Winter Pattern Overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
          
          {/* Heavy Snowfall - Multiple Layers */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Layer 1 - Large snowflakes */}
            {[...Array(25)].map((_, i) => (
              <div 
                key={`large-${i}`}
                className="snowflake absolute text-white/40"
                style={{
                  left: `${(i * 4) % 100}%`,
                  fontSize: `${14 + (i % 3) * 4}px`,
                  animationDelay: `${(i * 0.4) % 6}s`,
                  animationDuration: `${6 + (i % 4) * 2}s`
                }}
              >
                ❄
              </div>
            ))}
            {/* Layer 2 - Medium snowflakes */}
            {[...Array(30)].map((_, i) => (
              <div 
                key={`medium-${i}`}
                className="snowflake absolute text-white/30"
                style={{
                  left: `${(i * 3.3 + 1.5) % 100}%`,
                  fontSize: `${10 + (i % 3) * 2}px`,
                  animationDelay: `${(i * 0.35) % 8}s`,
                  animationDuration: `${7 + (i % 3) * 2}s`
                }}
              >
                ❄
              </div>
            ))}
            {/* Layer 3 - Small snowflakes */}
            {[...Array(20)].map((_, i) => (
              <div 
                key={`small-${i}`}
                className="snowflake absolute text-white/20"
                style={{
                  left: `${(i * 5 + 2) % 100}%`,
                  fontSize: `${6 + (i % 2) * 2}px`,
                  animationDelay: `${(i * 0.5) % 10}s`,
                  animationDuration: `${9 + (i % 3) * 2}s`
                }}
              >
                ❄
              </div>
            ))}
          </div>
                      
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Badge Style Title */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-amber-400/30">
                  <span className="text-xl">🎄</span>
                  <div className="flex flex-col">
                    <span className="text-amber-400 font-bold text-sm tracking-wider">YIL SONU KAMPANYASI</span>
                    <span className="text-white/60 text-xs">Sınırlı Süre</span>
                  </div>
                </div>
              </div>
              
              {/* Center: Discount Highlight */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="flex items-baseline gap-1 justify-center">
                    <span className="text-white/60 text-sm">Tüm transferlerde</span>
                    <span className="text-3xl font-black bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">%20</span>
                    <span className="text-white/60 text-sm">indirim</span>
                  </div>
                </div>
                
                {/* Separator */}
                <div className="h-8 w-px bg-white/20"></div>
                
                {/* Countdown */}
                <div className="flex items-center gap-3">
                  <span className="text-white/50 text-xs uppercase tracking-wider">Kampanya bitimine</span>
                  <div className="flex items-center gap-1.5">
                    <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="text-white font-mono font-bold text-lg">{formatTime(timeLeft).split(':')[0]}</span>
                    </div>
                    <span className="text-amber-400 font-bold text-lg">:</span>
                    <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                      <span className="text-white font-mono font-bold text-lg">{formatTime(timeLeft).split(':')[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right: CTA Style Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50">Otomatik Uygulanır</span>
                <div className="flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/30">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-medium">Aktif</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Gradient Line */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
        </div>

            {/* Sticky Header - Liquid Glass White - With Step Names */}
        {isScrolled && (
          <div 
                className={`fixed z-50 left-1/2 -translate-x-1/2 w-[85%] max-w-4xl ${
              animationState === 'toSticky' ? 'animate-slideDown' : ''
            } ${
              animationState === 'toNormal' ? 'animate-stickyToNormal' : ''
            } ${
              animationState !== 'toSticky' && animationState !== 'toNormal' ? 'transition-all duration-[350ms] ease-in-out' : ''
            }`}
            style={{
              top: '12px',
            }}>
            <div className="bg-white/95 backdrop-blur-2xl shadow-xl shadow-black/10 rounded-2xl border border-gray-200/60 px-6 py-3.5">
              <div className="flex items-center justify-between">
                {/* Left: Back Button */}
                <button 
                  onClick={() => activeStep > 1 ? setActiveStep(activeStep - 1) : window.history.back()}
                  className="w-10 h-10 rounded-xl bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {/* Center: Stepper with Names */}
                <div className="flex items-center gap-3">
                  {steps.map((label, index) => {
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;
                    const shortLabel = label.split(' ').slice(0, 2).join(' ');
                    
                    return (
                      <div key={label} className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 text-xs rounded-full flex items-center justify-center font-bold transition-all ${
                            isCompleted 
                              ? 'bg-green-500 text-white shadow-md shadow-green-500/30' 
                              : isActive 
                                ? 'bg-gray-900 text-white shadow-md shadow-gray-900/30' 
                                : 'bg-gray-100 text-gray-400'
                          }`}>
                            {isCompleted ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : index + 1}
                          </div>
                          <span className={`text-sm font-medium hidden lg:inline transition-colors ${
                            isActive ? 'text-gray-900' : isCompleted ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {shortLabel}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className={`w-10 h-0.5 mx-3 rounded-full ${
                            index < activeStep ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Right: WhatsApp Support */}
                <a 
                  href="https://wa.me/905551234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  7/24
                </a>
              </div>
            </div>
          </div>
            )}
          </>
        )}

        {/* Trip Details & Live Support Buttons - Mobile Only - Below Stepper */}
        {isMobile && (
          <div className="px-4 py-2 bg-white border-b border-gray-100">
            <div className="flex gap-2">
              {/* View Trip Details Button */}
            <button
              onClick={() => setShowTripDetails(true)}
                className="flex-1 bg-gray-100 text-gray-800 px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-medium hover:bg-gray-200 transition-colors border border-gray-200"
            >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Seyahat Detayları
            </button>
              
              {/* Live Support Button */}
              <a
                href="https://wa.me/905551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 text-white px-3 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-medium hover:bg-green-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Canlı Destek 7/24
              </a>
            </div>
          </div>
        )}

        {/* Main Content - 90% width and centered */}
        <div className={`flex-1 flex w-screen overflow-hidden justify-center ${isMobile ? 'py-0' : 'py-4 md:py-8'} ${isMobile && (activeStep === 1 || activeStep === 2 || activeStep === 3) ? 'pb-24' : ''}`}>
          <div className={`${isMobile ? 'w-full' : 'w-[90%] flex gap-6'}`}>
            {/* Left Column - Content based on step */}
            <div className={`${isMobile ? 'w-full' : 'w-[65%]'} flex flex-col ${isMobile ? 'gap-0' : 'gap-6'}`}>
              {activeStep === 1 ? (
                <>
                  {/* Step 2: Vehicle Selection - Google Maps Section */}
                  <div className={`${isMobile ? 'h-[200px]' : 'h-[500px]'} relative ${isMobile ? 'rounded-none' : 'bg-white rounded-2xl shadow-xl'} overflow-hidden`}>
                  {!mapLoaded ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading map...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full overflow-hidden">
                      {/* Static Maps API - Clean map with route, no UI */}
                      <img
                        src={(() => {
                          const origin = getValidLocation(fromLocation || 'Istanbul, Turkey');
                          const destination = getValidLocation(toLocation || 'Istanbul, Turkey');
                          // Use larger size for better quality
                          const size = isMobile ? '640x320' : '1280x800';
                          const apiKey = 'AIzaSyC391QVA3pQwHCTknJxUmWmK07l0G1Uqzc';
                          
                          // Build URL with proper encoding
                          const params = new URLSearchParams();
                          params.append('size', size);
                          params.append('scale', '2');
                          params.append('maptype', 'roadmap');
                          
                          // For desktop, use zoom parameter for more zoomed out view
                          if (!isMobile) {
                            // Calculate center point between origin and destination
                          params.append('visible', origin);
                          params.append('visible', destination);
                            // Add padding markers to force more zoom out on desktop
                            params.append('style', 'feature:poi|visibility:simplified');
                          } else {
                            // Mobile: Use visible parameter to ensure both points are visible
                            params.append('visible', origin);
                            params.append('visible', destination);
                          }
                          
                          // Path with black color - thinner for desktop
                          if (googleMapsData.polyline) {
                            const pathWeight = isMobile ? 5 : 4;
                            params.append('path', `color:0x1f2937FF|weight:${pathWeight}|enc:${googleMapsData.polyline}`);
                          }
                          
                          // Markers - Custom styled
                          params.append('markers', `size:mid|color:0x22c55e|label:A|${origin}`);
                          params.append('markers', `size:mid|color:0xef4444|label:B|${destination}`);
                          
                          params.append('key', apiKey);
                          
                          const url = `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
                          console.log('🗺️ Static Map URL generated, polyline:', googleMapsData.polyline ? 'Yes' : 'No');
                          return url;
                        })()}
                        alt="Route Map"
                        className="w-full h-full object-cover"
                        style={{ transform: isMobile ? 'scale(1.12)' : 'scale(0.95)', transformOrigin: 'center center' }}
                        onError={(e) => {
                          console.error('Static Maps failed to load:', e.target.src);
                        }}
                      />
                    </div>
                  )}
                  </div>

                  {/* Step 2: Vehicle Selection Section */}
                  <div className={`${isMobile ? 'bg-white px-4 pt-4 pb-2' : 'bg-white rounded-2xl shadow-xl p-6 pb-2 mb-6'}`}>
                    {/* Desktop Layout - Side by side */}
                    <div className="hidden md:flex items-center justify-between mb-6">  
                      <h3 className="text-2xl font-bold self-center text-gray-800">Select Your Vehicle</h3>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                        <span className="text-xs text-amber-700 font-medium">Total price per vehicle (all passengers included)</span>
                      </div>
                    </div>

                    {/* Mobile Layout - iOS Style Header */}
                    <div className="md:hidden mb-4">
                      <div className="flex items-center gap-3">
                        {/* App-style Icon */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center shadow-lg">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Aracınızı Seçin</h3>
                          <p className="text-xs text-gray-500">Kaydırarak tüm araçları inceleyin</p>
                        </div>
                      </div>
                    </div>
                    {/* Desktop Layout - Modern Cards */}
                    <div className={`${isMobile ? 'hidden' : 'space-y-6 flex flex-col'}`}>
                      {/* Vehicle Cards - Loop for Desktop */}
                      {vehicles.map((vehicle, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:border-gray-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-400 group">
                          <div className="flex">
                            {/* Vehicle Image Container with Badge */}
                            <div className="w-52 min-h-[280px] bg-gray-100 relative overflow-hidden">
                                <Image
                                  src={getVehicleImage(vehicle.name)}
                                  alt={vehicle.name}
                                  fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="208px"
                              />
                              {/* Gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                              
                              {/* Badge */}
                              {vehicleBadges[vehicle.name] && (
                                <div className={`absolute top-3 left-3 bg-gradient-to-r ${vehicleBadges[vehicle.name].color} px-2.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 text-white`}>
                                  {badgeIcons[vehicleBadges[vehicle.name].icon]}
                                  <span className="text-[10px] font-bold">{vehicleBadges[vehicle.name].text}</span>
                              </div>
                            )}
                              
                              {/* View Photos Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDesktopGalleryVehicle(vehicle);
                                  setShowDesktopGallery(true);
                                }}
                                className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Tüm Fotoğrafları Gör
                              </button>
                            </div>
                            
                            {/* Vehicle Details */}
                            <div className="flex-1 p-5 flex flex-col justify-between">
                              <div>
                                {/* Title and Capacity Row */}
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="text-xl font-bold text-gray-900">{vehicle.name}</h4>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                      </svg>
                                      <span>{vehicle.passengers}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                      </svg>
                                      <span>{vehicle.luggage}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Features Grid - Modern with Icons */}
                                <div className="grid grid-cols-4 gap-3 mb-4">
                                  {/* Sabit Fiyat */}
                                  <div className="bg-gray-50 rounded-xl p-3 text-center group/feature hover:bg-blue-50 transition-colors">
                                    <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-lg flex items-center justify-center group-hover/feature:bg-blue-200 transition-colors">
                                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      </div>
                                    <span className="text-xs font-medium text-gray-700">Sabit Fiyat</span>
                                    </div>
                                  
                                  {/* Uçuş Takibi */}
                                  <div className="bg-gray-50 rounded-xl p-3 text-center group/feature hover:bg-purple-50 transition-colors">
                                    <div className="w-8 h-8 mx-auto mb-2 bg-purple-100 rounded-lg flex items-center justify-center group-hover/feature:bg-purple-200 transition-colors">
                                      <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                      </svg>
                                </div>
                                    <span className="text-xs font-medium text-gray-700">Uçuş Takibi</span>
                              </div>
                              
                                  {/* Havalimanı Karşılama */}
                                  <div className="bg-gray-50 rounded-xl p-3 text-center group/feature hover:bg-green-50 transition-colors">
                                    <div className="w-8 h-8 mx-auto mb-2 bg-green-100 rounded-lg flex items-center justify-center group-hover/feature:bg-green-200 transition-colors">
                                      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">Karşılama</span>
                                  </div>
                                  
                                  {/* Ücretsiz İptal */}
                                  <div className="bg-gray-50 rounded-xl p-3 text-center group/feature hover:bg-orange-50 transition-colors">
                                    <div className="w-8 h-8 mx-auto mb-2 bg-orange-100 rounded-lg flex items-center justify-center group-hover/feature:bg-orange-200 transition-colors">
                                      <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                      </svg>
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">Ücretsiz İptal</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Pricing Section */}
                              <div>
                                <div className="border-t border-gray-100 pt-4">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs text-gray-500">Please select the currency you wish to pay in</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex h-16 gap-3">
                                    {Object.entries(vehicle.prices).map(([currency, price]) => (
                                      <button 
                                        key={currency}
                                        className={`text-center rounded-lg py-2 px-4 transition-all duration-300 cursor-pointer transform ${selectedCurrency === currency 
                                          ? 'bg-green-100 border-2 border-green-500 scale-105' 
                                          : 'border border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                                        onClick={() => setSelectedCurrency(currency)}
                                      >
                                        <div className={`text-lg font-bold ${selectedCurrency === currency ? 'text-green-700' : 'text-gray-800'}`}>{price.current}</div>
                                        <div className={`text-xs line-through ${selectedCurrency === currency ? 'text-green-600' : 'text-gray-500'}`}>{price.original}</div>
                                        {selectedCurrency === currency && <div className="text-[10px] text-green-600 bg-white px-2 py-1 shadow-md rounded-full font-medium mt-1">20% İndirim</div>}
                                      </button>
                                    ))}
                                  </div>
                                  <button 
                                    onClick={() => handleVehicleSelection(vehicle)}
                                    className="bg-gray-900 hover:bg-gray-800 cursor-pointer text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
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

                    {/* Mobile Layout - Liquid Glass Swiper Carousel */}
                    {isMobile && (
                      <div className="relative -mx-4 bg-white" style={{ minHeight: '58vh' }}>
                        <Swiper
                          modules={[Navigation, Pagination, EffectCoverflow]}
                          effect="coverflow"
                          grabCursor={true}
                          centeredSlides={true}
                          slidesPerView={1.33}
                          spaceBetween={-15}
                          loop={true}
                          loopedSlides={vehicles.length}
                          coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 150,
                            modifier: 1,
                            slideShadows: false,
                          }}
                          pagination={{
                            clickable: true,
                            dynamicBullets: true,
                          }}
                          navigation={false}
                          onSlideChange={(swiper) => {
                            const realIndex = swiper.realIndex;
                            setSelectedVehicleIndex(realIndex);
                          }}
                          className="vehicle-swiper"
                          style={{ paddingBottom: '35px', paddingTop: '10px' }}
                        >
                          {vehicles.map((vehicle, index) => (
                            <SwiperSlide key={index}>
                                {/* Liquid Glass Card - Taller */}
                                <div className="relative rounded-2xl overflow-hidden mx-1 shadow-xl" style={{ height: '57.5vh' }}>
                                  {/* Full Background Image */}
                                  <Image
                                    src={getVehicleImage(vehicle.name)}
                                    alt={vehicle.name}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    priority={index === 0}
                                    unoptimized
                                  />
                                  
                                  {/* Gradient Overlay for readability */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20"></div>
                                  
                                  {/* Content Overlay - Top */}
                                  <div className="absolute top-0 left-0 right-0 p-3">
                                    {/* Vehicle Name */}
                                    <h4 className="text-white text-lg font-bold mb-1.5 drop-shadow-lg">{vehicle.name}</h4>
                                    
                                    {/* Info Badges - Minimal Glass Style */}
                                    <div className="flex items-center gap-1.5">
                                      <div className="flex items-center gap-1 bg-white/15 backdrop-blur-md text-white/90 px-2 py-1 rounded-lg text-xs font-medium">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                        <span>{vehicle.passengers}</span>
                                      </div>
                                      <div className="flex items-center gap-1 bg-white/15 backdrop-blur-md text-white/90 px-2 py-1 rounded-lg text-xs font-medium">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <span>{vehicle.luggage}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Content Overlay - Bottom */}
                                  <div className="absolute bottom-0 left-0 right-0 p-3">
                                    {/* Modern Glass Info & Currency Section */}
                                    <div className="bg-white/10 backdrop-blur-xl rounded-xl p-2.5 border border-white/10">
                                      {/* Badge & Photos Row */}
                                      <div className="flex items-center justify-around mb-2 pb-2 border-b border-white/10">
                                        {/* View More Photos Button - Left */}
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setGalleryVehicle(vehicle);
                                            setShowVehicleGallery(true);
                                          }}
                                          className="flex items-center gap-1.5 bg-white/25 hover:bg-white/35 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all backdrop-blur-sm"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                          </svg>
                                          <span>Tüm Fotoğrafları Gör</span>
                                        </button>
                                        {/* Vehicle Badge - Single Feature - Right */}
                                        {vehicleBadges[vehicle.name] && (
                                          <div className={`flex items-center gap-1.5 bg-gradient-to-r ${vehicleBadges[vehicle.name].color} px-2.5 py-1.5 rounded-lg text-[10px] font-semibold text-white shadow-lg`}>
                                            {badgeIcons[vehicleBadges[vehicle.name].icon]}
                                            <span>{vehicleBadges[vehicle.name].text}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Currency Grid */}
                                      <div className="grid grid-cols-4 gap-1.5">
                                        {Object.entries(vehicle.prices).map(([currency, price]) => (
                                          <button 
                                            key={currency}
                                            className={`text-center rounded-lg px-1.5 py-2 transition-all duration-300 ${
                                              selectedCurrency === currency 
                                                ? 'bg-white text-gray-900 shadow-lg scale-[1.02]' 
                                                : 'bg-white/5 text-white hover:bg-white/15'
                                            }`}
                                            onClick={() => setSelectedCurrency(currency)}
                                          >
                                            <div className={`text-xs font-bold ${selectedCurrency === currency ? 'text-gray-900' : 'text-white'}`}>{price.current}</div>
                                            <div className={`text-[9px] line-through ${selectedCurrency === currency ? 'text-gray-400' : 'text-white/40'}`}>{price.original}</div>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                        
                      </div>
                    )}

                    
                    {/* Add custom styles for Swiper - iOS Style */}
                    <style jsx global>{`
                      .vehicle-swiper {
                        overflow: visible !important;
                      }
                      
                      .vehicle-swiper .swiper-wrapper {
                        align-items: center;
                      }
                      
                      .vehicle-swiper .swiper-slide {
                        opacity: 0.6;
                        transform: scale(0.92);
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                      }
                      
                      .vehicle-swiper .swiper-slide-active {
                        opacity: 1 !important;
                        transform: scale(1) !important;
                        z-index: 10 !important;
                      }
                      
                      .vehicle-swiper .swiper-slide-prev,
                      .vehicle-swiper .swiper-slide-next {
                        opacity: 0.75;
                        z-index: 5;
                      }
                      
                      /* Ensure proper stacking for coverflow effect */
                      .vehicle-swiper .swiper-slide-prev {
                        transform: translateX(8%) scale(0.95) !important;
                      }
                      
                      .vehicle-swiper .swiper-slide-next {
                        transform: translateX(-8%) scale(0.95) !important;
                      }
                      
                      /* Fix z-index for slides that are further away */
                      .vehicle-swiper .swiper-slide:not(.swiper-slide-active):not(.swiper-slide-prev):not(.swiper-slide-next) {
                        z-index: 0 !important;
                        pointer-events: none;
                      }
                      
                      .vehicle-swiper .swiper-pagination {
                        bottom: 8px !important;
                        left: 0 !important;
                        right: 0 !important;
                        width: 100% !important;
                        display: flex !important;
                        justify-content: center !important;
                        align-items: center !important;
                        transform: none !important;
                      }
                      
                      .vehicle-swiper .swiper-pagination-bullet {
                        background: #1f2937;
                        opacity: 0.3;
                        width: 6px;
                        height: 6px;
                        margin: 0 3px !important;
                        transition: all 0.3s ease;
                        flex-shrink: 0;
                      }
                      
                      .vehicle-swiper .swiper-pagination-bullet-active {
                        width: 20px;
                        border-radius: 3px;
                        background: linear-gradient(to right, #111827, #1e3a5f);
                        opacity: 1;
                      }
                      
                      /* Remove default shadows */
                      .vehicle-swiper .swiper-3d .swiper-slide-shadow,
                      .vehicle-swiper .swiper-3d .swiper-slide-shadow-left,
                      .vehicle-swiper .swiper-3d .swiper-slide-shadow-right,
                      .vehicle-swiper .swiper-3d .swiper-slide-shadow-top,
                      .vehicle-swiper .swiper-3d .swiper-slide-shadow-bottom {
                        background-image: none !important;
                      }
                    `}</style>
                  </div>

                  {/* FAQ Section - Mobile Only - Step 1 */}
                  {isMobile && (
                    <div className="bg-white px-4 py-5 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Sıkça Sorulan Sorular</h3>
                          <p className="text-xs text-gray-500">Merak edilenler ve cevapları</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {faqData.map((faq, index) => (
                          <div 
                            key={index} 
                            className="border border-gray-100 rounded-xl overflow-hidden"
                          >
                            <button
                              onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                              className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                              <svg 
                                className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${openFaqIndex === index ? 'rotate-180' : ''}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-40' : 'max-h-0'}`}>
                              <p className="p-4 text-sm text-gray-600 bg-white">{faq.answer}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Reviews - Mobile Only - Step 1 */}
                  {isMobile && (
                    <div className="bg-white px-4 py-5 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Müşteri Yorumları</h3>
                          <p className="text-xs text-gray-500">Gerçek kullanıcı deneyimleri</p>
                        </div>
                      </div>
                      <div className="overflow-hidden -mx-4">
                        <div className="flex gap-3 px-4 animate-scroll-x">
                          {[...userReviews, ...userReviews].map((review, index) => (
                            <div 
                              key={`step1-${review.id}-${index}`} 
                              className="flex-shrink-0 w-72 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                            >
                              <div className="flex items-start gap-3 mb-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center text-lg">
                                  {review.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-gray-900">{review.name}</h4>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <svg 
                                        key={i} 
                                        className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{review.comment}</p>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400">{review.date}</span>
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{review.vehicle}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : activeStep === 2 ? (
                <>
                  {/* Step 3: Passenger Information & Additional Services */}
                  {/* Passenger Information Section */}
                  <div className={`bg-white ${isMobile ? 'px-4 py-5' : 'rounded-2xl shadow-xl p-6'}`}>
                    <h3 className={`font-bold text-gray-900 mb-${isMobile ? '4' : '6'} ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                      {isMobile ? 'Yolcu Bilgileri' : 'Passenger Information'}
                    </h3>
                    
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
                            onChange={(e) => {
                              const value = e.target.value;
                              setPassengerInfo({...passengerInfo, email: value});
                              
                              // Update validation error
                              setValidationErrors(prev => ({
                                ...prev,
                                email: value.length > 0 && !validateEmail(value)
                              }));
                            }}
                            className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 ${
                              validationErrors.email 
                                ? 'border-red-500 focus:border-red-500' 
                                : passengerInfo.email 
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
                                className={`flex items-center gap-2 px-3 py-[10px] border-2 border-r-0 rounded-l-lg bg-gray-200 outline-none transition-all duration-200 hover:bg-gray-100 ${
                                  validationErrors.phone 
                                    ? 'border-red-500' 
                                    : passengerInfo.phone 
                                      ? 'border-green-300' 
                                      : 'border-gray-200'
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
                                onChange={(e) => {
                                  const numbersOnly = e.target.value.replace(/\D/g, '');
                                  setPassengerInfo({...passengerInfo, phone: numbersOnly});
                                  
                                  // Update validation error
                                  setValidationErrors(prev => ({
                                    ...prev,
                                    phone: numbersOnly.length > 0 && !validatePhone(numbersOnly)
                                  }));
                                }}
                                className={`peer w-full px-4 py-3 border-2 border-l-0 rounded-r-lg outline-none transition-all duration-200 ${
                                  validationErrors.phone 
                                    ? 'border-red-500 focus:border-red-500' 
                                    : passengerInfo.phone 
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
                  <div className={`bg-white ${isMobile ? 'px-4 py-5 border-t border-gray-100' : 'rounded-2xl shadow-xl p-6'}`}>
                    <h3 className={`font-bold text-gray-900 ${isMobile ? 'text-lg mb-4' : 'text-xl mb-6'}`}>
                      {isMobile ? 'Ek Hizmetler' : 'Additional Services'}
                    </h3>
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

                  {/* FAQ Section - Mobile Only */}
                  {isMobile && (
                    <div className="bg-white px-4 py-5 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Sıkça Sorulan Sorular</h3>
                          <p className="text-xs text-gray-500">Merak edilenler ve cevapları</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {faqData.map((faq, index) => (
                          <div 
                            key={index} 
                            className="border border-gray-100 rounded-xl overflow-hidden"
                          >
                            <button
                              onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                              className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                              <svg 
                                className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${openFaqIndex === index ? 'rotate-180' : ''}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-40' : 'max-h-0'}`}>
                              <p className="p-4 text-sm text-gray-600 bg-white">{faq.answer}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Reviews - Mobile Only */}
                  {isMobile && (
                    <div className="bg-white px-4 py-5 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Müşteri Yorumları</h3>
                          <p className="text-xs text-gray-500">Gerçek kullanıcı deneyimleri</p>
                        </div>
                      </div>
                      <div className="overflow-hidden -mx-4">
                        <div className="flex gap-3 px-4 animate-scroll-x">
                          {[...userReviews, ...userReviews].map((review, index) => (
                            <div 
                              key={`${review.id}-${index}`} 
                              className="flex-shrink-0 w-72 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                            >
                              <div className="flex items-start gap-3 mb-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center text-lg">
                                  {review.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-gray-900">{review.name}</h4>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <svg 
                                        key={i} 
                                        className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{review.comment}</p>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400">{review.date}</span>
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{review.vehicle}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : activeStep === 3 ? (
                <>
                  {/* Step 4: Trip Details & Payment */}
                  <div className={`bg-white ${isMobile ? 'px-4 py-5' : 'rounded-2xl shadow-xl p-6'}`}>
                    <h3 className={`font-bold text-gray-900 ${isMobile ? 'text-xl mb-4' : 'text-2xl mb-6'}`}>
                      {isMobile ? 'Ödeme Bilgileri' : 'Payment Information'}
                    </h3>
                    
                    {/* Interactive Credit Card */}
                    <div className="mb-8">
                      <div className="relative w-full max-w-md mx-auto h-56 perspective-1000">
                        <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${cardFlipped ? 'rotate-y-180' : ''}`}>
                          
                          {/* Card Front */}
                          <div className="absolute w-full h-full backface-hidden">
                            <div className={`w-full h-full rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden ${isMobile ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' : 'bg-gradient-to-br from-purple-600 to-purple-500'}`}>
                              {/* Wave decoration at bottom */}
                              <div className="absolute bottom-0 left-0 right-0">
                                <svg className="w-full h-24" viewBox="0 0 400 100" preserveAspectRatio="none">
                                  <path 
                                    d="M0,30 Q100,5 200,50 T400,50 L400,100 L0,100 Z" 
                                    fill="rgba(255,255,255,0.1)"
                                  />
                                </svg>
                              </div>
                              
                              {/* Chip and Card Type in same row */}
                              <div className="flex items-center justify-between mb-6">
                                {/* Chip - Smaller */}
                                <div className="w-9 h-7 bg-yellow-400 rounded-md"></div>
                                
                                {/* Card Type Logo - with fade in animation */}
                                {getCardType(cardDetails.cardNumber) && (
                                  <div className="text-lg font-bold tracking-wider transition-opacity duration-500 ease-in-out opacity-100">
                                    {getCardType(cardDetails.cardNumber) === 'visa' ? 'VISA' : 
                                     getCardType(cardDetails.cardNumber) === 'mastercard' ? 'Mastercard' : 
                                     getCardType(cardDetails.cardNumber) === 'amex' ? 'AMEX' : ''}
                                  </div>
                                )}
                              </div>
                              
                              {/* Card Number - Smaller to fit */}
                              <div className="text-base tracking-[0.12em] mb-6 font-mono">
                                {cardDetails.cardNumber || '•••• •••• •••• ••••'}
                              </div>
                              
                              {/* Card Holder & Expiry - Moved up */}
                              <div className="flex justify-between relative z-10">
                                <div>
                                  <div className="text-[10px] opacity-70 uppercase tracking-wider">Card Holder</div>
                                  <div className="text-base font-medium uppercase tracking-wide">{cardDetails.cardHolder || 'YOUR NAME'}</div>
                                </div>
                                <div>
                                  <div className="text-[10px] opacity-70 uppercase tracking-wider">Expires</div>
                                  <div className="text-base font-medium">{cardDetails.expiryDate || 'MM/YY'}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Card Back */}
                          <div className="absolute w-full h-full backface-hidden rotate-y-180">
                            <div className={`w-full h-full rounded-2xl shadow-2xl relative overflow-hidden ${isMobile ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-blue-800' : 'bg-gradient-to-br from-purple-700 to-purple-600'}`}>
                              {/* Wave decoration at bottom */}
                              <div className="absolute bottom-0 left-0 right-0">
                                <svg className="w-full h-24" viewBox="0 0 400 100" preserveAspectRatio="none">
                                  <path 
                                    d="M0,30 Q100,5 200,50 T400,50 L400,100 L0,100 Z" 
                                    fill="rgba(255,255,255,0.08)"
                                  />
                                </svg>
                              </div>
                              
                              {/* Magnetic Strip */}
                              <div className="w-full h-12 bg-black mt-8"></div>
                              
                              {/* CVV Area */}
                              <div className="p-6">
                                <div className="bg-white h-10 rounded flex items-center justify-end px-3 mb-4">
                                  <span className="font-mono text-gray-800 text-lg">{cardDetails.cvv || '•••'}</span>
                                </div>
                                <div className="text-white text-xs opacity-70">
                                  This card is property of issuing bank. Authorized use only.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Payment Form */}
                    <div className="space-y-4">
                      {/* Card Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          maxLength="19"
                          value={cardDetails.cardNumber}
                          onChange={(e) => {
                            const numbersOnly = e.target.value.replace(/\D/g, '');
                            const formatted = formatCardNumber(numbersOnly);
                            setCardDetails({...cardDetails, cardNumber: formatted});
                            
                            // Update validation error
                            setValidationErrors(prev => ({
                              ...prev,
                              cardNumber: formatted.length > 0 && !validateCardNumber(formatted)
                            }));
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                            validationErrors.cardNumber 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-gray-200 focus:border-blue-500'
                          }`}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      
                      {/* Card Holder */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                        <input
                          type="text"
                          value={cardDetails.cardHolder}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            setCardDetails({...cardDetails, cardHolder: value});
                            
                            // Update validation error
                            setValidationErrors(prev => ({
                              ...prev,
                              cardHolder: value.length > 0 && !validateCardHolder(value)
                            }));
                          }}
                          className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                            validationErrors.cardHolder 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-gray-200 focus:border-blue-500'
                          }`}
                          placeholder="JOHN DOE"
                        />
                      </div>
                      
                      {/* Expiry and CVV */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                          <input
                            type="text"
                            maxLength="5"
                            value={cardDetails.expiryDate}
                            onChange={(e) => {
                              const numbersOnly = e.target.value.replace(/[^0-9/]/g, '');
                              const formatted = formatExpiryDate(numbersOnly);
                              setCardDetails({...cardDetails, expiryDate: formatted});
                              
                              // Update validation error
                              setValidationErrors(prev => ({
                                ...prev,
                                expiryDate: formatted.length > 0 && !validateExpiryDate(formatted)
                              }));
                            }}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                              validationErrors.expiryDate 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-200 focus:border-blue-500'
                            }`}
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            maxLength="3"
                            value={cardDetails.cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              setCardDetails({...cardDetails, cvv: value});
                              setCardFlipped(true);
                              
                              // Update validation error
                              setValidationErrors(prev => ({
                                ...prev,
                                cvv: value.length > 0 && !validateCVV(value)
                              }));
                            }}
                            onBlur={() => setCardFlipped(false)}
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                              validationErrors.cvv 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-gray-200 focus:border-blue-500'
                            }`}
                            placeholder="123"
                          />
                        </div>
                      </div>
                      
                      {/* Complete Payment Button - Desktop Only (Mobile has fixed bottom button) */}
                      {!isMobile && (
                      <button 
                        disabled={!isFormValid()}
                          className={`w-full font-bold py-4 rounded-xl transition-all duration-200 ${
                          isFormValid() 
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-[1.02] shadow-lg cursor-pointer' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Complete Payment
                      </button>
                      )}
                    </div>
                  </div>

                  {/* FAQ Section - Mobile Only (Step 3) */}
                  {isMobile && (
                    <div className="bg-white px-4 py-5 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Sıkça Sorulan Sorular</h3>
                          <p className="text-xs text-gray-500">Merak edilenler ve cevapları</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {faqData.map((faq, index) => (
                          <div 
                            key={index} 
                            className="border border-gray-100 rounded-xl overflow-hidden"
                          >
                            <button
                              onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                              className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-900 pr-4">{faq.question}</span>
                              <svg 
                                className={`w-5 h-5 text-gray-500 transition-transform duration-300 flex-shrink-0 ${openFaqIndex === index ? 'rotate-180' : ''}`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'max-h-40' : 'max-h-0'}`}>
                              <p className="p-4 text-sm text-gray-600 bg-white">{faq.answer}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* User Reviews - Mobile Only (Step 3) */}
                  {isMobile && (
                    <div className="bg-white px-4 py-5 border-t border-gray-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">Müşteri Yorumları</h3>
                          <p className="text-xs text-gray-500">Gerçek kullanıcı deneyimleri</p>
                        </div>
                      </div>
                      <div className="overflow-hidden -mx-4">
                        <div className="flex gap-3 px-4 animate-scroll-x">
                          {[...userReviews, ...userReviews].map((review, index) => (
                            <div 
                              key={`${review.id}-${index}`} 
                              className="flex-shrink-0 w-72 bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                            >
                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center text-lg">
                                  {review.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-gray-900">{review.name}</h4>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <svg 
                                        key={i} 
                                        className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                        fill="currentColor" 
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 mb-2 line-clamp-2">{review.comment}</p>
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-gray-400">{review.date}</span>
                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{review.vehicle}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Trip Details Card - 35% - Sticky - Hide on Mobile */}
            {!isMobile && (
              <div className="w-[35%] h-fit sticky top-4">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header with gradient */}
                <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">
                {activeStep === 3 ? 'Complete Trip Summary' : 'Trip Details'}
              </h2>
                  <p className="text-sm text-white/60 mt-1">Your transfer information</p>
                </div>
            <div className="p-6">

              {/* Additional Details for Payment Step */}
              {activeStep === 3 && (
                <div className="mb-6 space-y-4">
                  {/* Passenger Info Summary */}
                  {passengerInfo.name && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Passenger Information</h4>
                      <div className="text-xs text-blue-700 space-y-1">
                        <p><span className="font-medium">Name:</span> {passengerInfo.name} {passengerInfo.surname}</p>
                        <p><span className="font-medium">Email:</span> {passengerInfo.email}</p>
                        <p><span className="font-medium">Phone:</span> {selectedCountry.code} {passengerInfo.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Selected Services Summary */}
                  {selectedServices.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <h4 className="text-sm font-semibold text-purple-900 mb-2">Additional Services</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedServices.map(serviceId => {
                          const service = additionalServices.find(s => s.id === serviceId);
                          return (
                            <span key={serviceId} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {service?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Total Price */}
                  <div className="bg-green-50 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-green-900 mb-2">Total Amount</h4>
                    <div className="text-2xl font-bold text-green-800">
                      {selectedVehicle?.prices[selectedCurrency]?.current || '₺0'}
                    </div>
                  </div>
                </div>
              )}
              
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

              {/* Distance & Duration - Gradient Style */}
              <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 rounded-xl p-4 mb-6 shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4" />
                    </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white/60 font-medium">DISTANCE</p>
                      <p className="text-base font-bold text-white">
                        {googleMapsData.loading ? (
                          <span className="text-white/40">Loading...</span>
                        ) : googleMapsData.distance ? (
                          googleMapsData.distance
                        ) : (
                          routeInfo.distance
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <AccessTimeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-white/60 font-medium">DURATION</p>
                      <p className="text-base font-bold text-white">
                        {googleMapsData.loading ? (
                          <span className="text-white/40">Loading...</span>
                        ) : googleMapsData.duration ? (
                          googleMapsData.duration
                        ) : (
                          routeInfo.duration
                        )}
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

              {/* Payment Button - Only show in Passenger Information step */}
              {activeStep === 2 && (
                <button
                  onClick={() => setActiveStep(3)}
                  className="w-full mt-6 relative group overflow-hidden"
                >
                  <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-xl p-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    
                    {/* Button content */}
                    <div className="relative flex items-center justify-center gap-3">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-white font-bold text-lg">Proceed to Payment</span>
                      <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                    
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-xl border-2 border-white/20 group-hover:border-white/40 transition-colors"></div>
                  </div>
                </button>
              )}
            </div>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* Mobile Trip Details Bottom Popup - iOS Style */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black/50 z-[60] transition-all duration-500 ease-out ${
              showTripDetails ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setShowTripDetails(false)}
          />
          
          {/* Bottom Sheet */}
          <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[61] transform transition-all duration-500 ease-out ${
            showTripDetails ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-full opacity-0 pointer-events-none'
          }`}>
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Seyahat Detayları</h3>
              <button
                onClick={() => setShowTripDetails(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <CloseIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {/* Content - Scrollable */}
            <div className="px-4 py-4 max-h-[70vh] overflow-y-auto">
              {/* Trip Type Badge */}
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                  tripType === 'rent' ? 'bg-gray-100 text-gray-800' : 'bg-gradient-to-r from-gray-900 to-blue-900 text-white'
                }`}>
                  {tripType === 'rent' ? (
                    <>
                      <AccessTimeIcon className="w-3 h-3 mr-1" />
                      Saatlik Kiralama
                    </>
                  ) : (
                    <>
                      <DirectionsCarIcon className="w-3 h-3 mr-1" />
                      Transfer
                    </>
                  )}
                </span>
              </div>

              {/* From Location */}
              <div className="mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
              <div className="ml-3 border-l-2 border-dashed border-gray-300 h-6"></div>

              {/* To Location */}
              <div className="mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
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
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarTodayIcon className="w-4 h-4 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">
                      {isRoundTrip ? 'PICKUP DATE & TIME' : tripType === 'rent' ? 'DATE' : 'DATE & TIME'}
                    </p>
                    <p className="text-sm font-semibold text-gray-800">{date} {time}</p>
                  </div>
                </div>
                
                {isRoundTrip && returnDate && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <CalendarTodayIcon className="w-4 h-4 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">RETURN DATE & TIME</p>
                      <p className="text-sm font-semibold text-gray-800">{returnDate} {returnTime}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Passengers */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="flex items-center gap-2">
                  <PersonIcon className="w-4 h-4 text-gray-600" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">PASSENGERS</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {passengers} {passengers === '1' ? 'Person' : 'People'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Distance & Duration */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500">DISTANCE</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {googleMapsData.distance || routeInfo.distance}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AccessTimeIcon className="w-4 h-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">DURATION</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {googleMapsData.duration || routeInfo.duration}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Vehicle Info */}
              {selectedVehicle && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <DirectionsCarIcon className="w-5 h-5 text-green-600 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900">{selectedVehicle.name}</p>
                      <div className="flex items-center gap-2 text-xs text-green-700 mt-1">
                        <span>{selectedVehicle.passengers}</span>
                        <span>•</span>
                        <span>{selectedVehicle.luggage}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-lg font-bold text-green-800">
                          {selectedVehicle.prices[selectedCurrency].current}
                        </span>
                        <span className="text-xs text-green-600 line-through ml-2">
                          {selectedVehicle.prices[selectedCurrency].original}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional info for payment step */}
              {activeStep === 3 && (
                <>
                  {/* Passenger Info Summary */}
                  {passengerInfo.name && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">Passenger Information</h4>
                      <div className="text-xs text-blue-700 space-y-1">
                        <p><span className="font-medium">Name:</span> {passengerInfo.name} {passengerInfo.surname}</p>
                        <p><span className="font-medium">Email:</span> {passengerInfo.email}</p>
                        <p><span className="font-medium">Phone:</span> {selectedCountry.code} {passengerInfo.phone}</p>
                      </div>
                    </div>
                  )}

                  {/* Selected Services Summary */}
                  {selectedServices.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-3">
                      <h4 className="text-sm font-semibold text-purple-900 mb-2">Additional Services</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedServices.map(serviceId => {
                          const service = additionalServices.find(s => s.id === serviceId);
                          return (
                            <span key={serviceId} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              {service?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* Vehicle Photo Gallery Popup - Mobile Only */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <div 
            className={`fixed inset-0 bg-black/60 z-[70] transition-opacity duration-300 ease-out ${
              showVehicleGallery ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setShowVehicleGallery(false)}
          />
          
          {/* Bottom Sheet Gallery */}
          <div 
            className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[71] transition-transform duration-500 ease-out ${
              showVehicleGallery ? 'translate-y-0' : 'translate-y-full'
            }`} 
            style={{ height: '84vh' }}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{galleryVehicle?.name || 'Araç'}</h3>
                <p className="text-xs text-gray-500">{galleryVehicle?.passengers} • {galleryVehicle?.luggage}</p>
              </div>
              <button
                onClick={() => setShowVehicleGallery(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95"
              >
                <CloseIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {galleryVehicle && (
            <div className="px-4 py-4 overflow-y-auto" style={{ height: 'calc(84vh - 100px)' }}>
              {/* Main Large Image */}
              <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-3 shadow-lg">
                <Image
                  src={getVehicleGalleryImages(galleryVehicle.name)[0]}
                  alt={galleryVehicle.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {vehicleBadges[galleryVehicle.name] && (
                  <div className={`absolute top-3 left-3 bg-gradient-to-r ${vehicleBadges[galleryVehicle.name].color} px-2.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 text-white`}>
                    {badgeIcons[vehicleBadges[galleryVehicle.name].icon]}
                    <span className="text-[10px] font-bold">{vehicleBadges[galleryVehicle.name].text}</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Grid */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {getVehicleGalleryImages(galleryVehicle.name).slice(1).map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={img}
                      alt={`${galleryVehicle.name} ${idx + 2}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
              
              {/* Vehicle Features - Modern iOS Style */}
              <div className="mb-5">
                <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Araç Özellikleri
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {/* Sabit Fiyat */}
                  <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                    <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                      <svg className="w-4.5 h-4.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Sabit Fiyat</p>
                      <p className="text-[10px] text-gray-500">Ek ücret yok</p>
                    </div>
                  </div>
                  
                  {/* Uçuş Takibi */}
                  <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                    <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                      <svg className="w-4.5 h-4.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Uçuş Takibi</p>
                      <p className="text-[10px] text-gray-500">Otomatik güncelleme</p>
                    </div>
                  </div>
                  
                  {/* Havalimanı Karşılama */}
                  <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                    <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
                      <svg className="w-4.5 h-4.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Karşılama</p>
                      <p className="text-[10px] text-gray-500">İsim tabelası</p>
                    </div>
                  </div>
                  
                  {/* Ücretsiz İptal */}
                  <div className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                    <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                      <svg className="w-4.5 h-4.5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">Ücretsiz İptal</p>
                      <p className="text-[10px] text-gray-500">24 saat öncesine kadar</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Price Summary */}
              <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-4 text-white shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white/80">Toplam Fiyat</span>
                  <span className="text-[10px] bg-green-500/30 text-green-400 px-2 py-0.5 rounded-full font-medium">%20 İndirim</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{galleryVehicle.prices[selectedCurrency]?.current}</span>
                  <span className="text-sm text-white/50 line-through">{galleryVehicle.prices[selectedCurrency]?.original}</span>
                </div>
              </div>
            </div>
            )}
          </div>
        </>
      )}

      {/* Mobile Fixed Select Vehicle Button - Only show in Step 1 */}
      {isMobile && activeStep === 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl py-3 px-4 z-50">
          {/* Select Button with Price */}
          <button
            onClick={() => handleVehicleSelection(vehicles[selectedVehicleIndex])}
            className="w-full relative overflow-hidden"
          >
            <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 rounded-xl p-3.5 transform transition-all duration-300 active:scale-[0.98]">
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              
              {/* Button content */}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DirectionsCarIcon className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold text-sm">Aracı Seç ve Devam Et</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-base">{vehicles[selectedVehicleIndex]?.prices[selectedCurrency]?.current}</span>
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Mobile Fixed Proceed to Payment Button - Only show in Step 2 */}
      {isMobile && activeStep === 2 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl py-3 px-4 z-50">
          <div className="flex gap-2">
            {/* Back Button - 20% */}
          <button
              onClick={() => setActiveStep(1)}
              className="w-[20%] bg-gray-100 rounded-xl p-3.5 flex items-center justify-center active:scale-[0.98] transition-all"
          >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Proceed Button - 80% */}
            <button
              onClick={() => setActiveStep(3)}
              className="w-[80%] relative overflow-hidden"
            >
              <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 rounded-xl p-3.5 transform transition-all duration-300 active:scale-[0.98]">
              {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              
              {/* Button content */}
                <div className="relative flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                  <span className="text-white font-semibold text-sm">Ödemeye Geç</span>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              </div>
            </button>
          </div>
        </div>
      )}
      
      {/* Desktop Vehicle Gallery Popup */}
      {!isMobile && (
        <>
          {/* Backdrop with animation */}
          <div 
            className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] transition-all duration-500 ease-out ${
              showDesktopGallery ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setShowDesktopGallery(false)}
          />
          
          {/* Modal with animation */}
          <div 
            className={`fixed inset-0 z-[101] flex items-center justify-center p-8 transition-all duration-500 ease-out ${
              showDesktopGallery 
                ? 'opacity-100 pointer-events-auto' 
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <div 
              className={`bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-500 ease-out ${
                showDesktopGallery ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {desktopGalleryVehicle && (
                <>
                  {/* Header - Compact with Liquid Glass badges */}
                  <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-white">{desktopGalleryVehicle.name}</h3>
                      {/* Liquid Glass Badges */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                          <svg className="w-4 h-4 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                          <span className="text-white/90 text-sm font-medium">{desktopGalleryVehicle.passengers}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                          <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className="text-white/90 text-sm font-medium">{desktopGalleryVehicle.luggage}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDesktopGallery(false)}
                      className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                      <CloseIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left: Images */}
                      <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                          <Image
                            src={getVehicleGalleryImages(desktopGalleryVehicle.name)[0]}
                            alt={desktopGalleryVehicle.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          {vehicleBadges[desktopGalleryVehicle.name] && (
                            <div className={`absolute top-4 left-4 bg-gradient-to-r ${vehicleBadges[desktopGalleryVehicle.name].color} px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 text-white`}>
                              {badgeIcons[vehicleBadges[desktopGalleryVehicle.name].icon]}
                              <span className="text-xs font-bold">{vehicleBadges[desktopGalleryVehicle.name].text}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Thumbnail Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          {getVehicleGalleryImages(desktopGalleryVehicle.name).slice(1).map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer">
                              <Image
                                src={img}
                                alt={`${desktopGalleryVehicle.name} ${idx + 2}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-300"
                                unoptimized
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Right: Details */}
                      <div className="space-y-6">
                        {/* Features */}
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            Araç Özellikleri
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {/* Sabit Fiyat */}
                            <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Sabit Fiyat</p>
                                <p className="text-xs text-gray-500">Ek ücret yok</p>
                              </div>
                            </div>
                            
                            {/* Uçuş Takibi */}
                            <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Uçuş Takibi</p>
                                <p className="text-xs text-gray-500">Otomatik güncelleme</p>
                              </div>
                            </div>
                            
                            {/* Havalimanı Karşılama */}
                            <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Karşılama</p>
                                <p className="text-xs text-gray-500">İsim tabelası ile</p>
                              </div>
                            </div>
                            
                            {/* Ücretsiz İptal */}
                            <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Ücretsiz İptal</p>
                                <p className="text-xs text-gray-500">24 saat öncesine kadar</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Price Section */}
                        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 rounded-2xl p-6 text-white shadow-xl">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-white/80">Toplam Fiyat</span>
                            <span className="text-xs bg-green-500/30 text-green-400 px-3 py-1 rounded-full font-medium">%20 İndirim</span>
                          </div>
                          <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-3xl font-bold">{desktopGalleryVehicle.prices[selectedCurrency]?.current}</span>
                            <span className="text-lg text-white/50 line-through">{desktopGalleryVehicle.prices[selectedCurrency]?.original}</span>
                          </div>
                          
                          {/* Currency Selector */}
                          <div className="flex gap-2 mb-4">
                            {Object.entries(desktopGalleryVehicle.prices).map(([currency, price]) => (
                              <button 
                                key={currency}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                  selectedCurrency === currency 
                                    ? 'bg-white text-gray-900' 
                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                                onClick={() => setSelectedCurrency(currency)}
                              >
                                {currency}
                              </button>
                            ))}
                          </div>
                          
                          {/* Select Button */}
                          <button 
                            onClick={() => {
                              handleVehicleSelection(desktopGalleryVehicle);
                              setShowDesktopGallery(false);
                            }}
                            className="w-full bg-white text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                          >
                            Bu Aracı Seç
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
      
      {/* Mobile Fixed Payment Button - Only show in Step 3 */}
      {isMobile && activeStep === 3 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl py-3 px-4 z-50">
          <div className="flex gap-2">
            {/* Back Button - 20% */}
            <button
              onClick={() => setActiveStep(2)}
              className="w-[20%] bg-gray-100 rounded-xl p-3.5 flex items-center justify-center active:scale-[0.98] transition-all"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Payment Button - 80% */}
            <button
              disabled={!isFormValid()}
              className={`w-[80%] relative overflow-hidden rounded-xl ${!isFormValid() ? 'opacity-50' : ''}`}
            >
              <div className={`relative rounded-xl p-3.5 transform transition-all duration-300 ${
                isFormValid() 
                  ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-blue-900 active:scale-[0.98]' 
                  : 'bg-gray-400'
              }`}>
                {/* Shimmer effect */}
                {isFormValid() && (
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                )}
                
                {/* Button content */}
                <div className="relative flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white font-semibold text-sm">Ödemeyi Tamamla</span>
                </div>
            </div>
          </button>
          </div>
        </div>
      )}
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