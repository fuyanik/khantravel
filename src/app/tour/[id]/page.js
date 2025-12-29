'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonIcon from '@mui/icons-material/Person'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import StarIcon from '@mui/icons-material/Star'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const TourDetailPage = () => {
  const params = useParams()
  const [mounted, setMounted] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [showDateTimePicker, setShowDateTimePicker] = useState(false)
  const [peopleCount, setPeopleCount] = useState(2)
  const [activeStep, setActiveStep] = useState(0)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // People picker states
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [babies, setBabies] = useState(0)
  const [showPersonPicker, setShowPersonPicker] = useState(false)
  const [isPersonClosing, setIsPersonClosing] = useState(false)
  const [isPersonOpening, setIsPersonOpening] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    specialRequests: ''
  })
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  })
  const [cardFlipped, setCardFlipped] = useState(false)

  // Tour data - bu gerçek uygulamada API'dan gelecek
  const tours = [
    {
      id: 1,
      image: '/galata.jpeg',
      title: 'Historic Istanbul Walking Tour',
      subtitle: 'Sultanahmet District Discovery',
      price: '150€',
      originalPrice: '200€',
      popular: true,
      highlights: ['Blue Mosque', 'Hagia Sophia', 'Grand Bazaar'],
      duration: '8 hours',
      rating: 4.8,
      reviewCount: 234,
      description: 'Discover the heart of Istanbul with our comprehensive walking tour through the historic Sultanahmet district. Visit iconic landmarks including the Blue Mosque, Hagia Sophia, and the Grand Bazaar while learning about the rich Byzantine and Ottoman history.',
      included: [
        'Professional English-speaking guide',
        'Skip-the-line tickets to major attractions',
        'Traditional Turkish lunch',
        'Hotel pickup and drop-off',
        'All entrance fees'
      ],
      notIncluded: [
        'Personal expenses',
        'Tips and gratuities',
        'Drinks during lunch'
      ],
      itinerary: [
        { time: '09:00', activity: 'Hotel pickup and meeting point' },
        { time: '09:30', activity: 'Blue Mosque visit and guided tour' },
        { time: '11:00', activity: 'Hagia Sophia exploration' },
        { time: '12:30', activity: 'Traditional Turkish lunch break' },
        { time: '14:00', activity: 'Grand Bazaar shopping experience' },
        { time: '16:00', activity: 'Basilica Cistern underground tour' },
        { time: '17:00', activity: 'Return to hotel or city center' }
      ]
    },
    {
      id: 2,
      image: '/beylerbeyi.jpeg',
      title: 'Bosphorus & Palaces Tour',
      subtitle: 'Ottoman Heritage Experience',
      price: '225€',
      originalPrice: '280€',
      popular: true,
      highlights: ['Bosphorus Cruise', 'Topkapi Palace', 'Basilica Cistern'],
      duration: '12 hours',
      rating: 4.9,
      reviewCount: 189,
      description: 'Experience the grandeur of Ottoman Empire with our comprehensive tour including a scenic Bosphorus cruise and visits to magnificent palaces. Enjoy breathtaking views and learn about the imperial history of Istanbul.',
      included: [
        'Luxury Bosphorus cruise with lunch',
        'Professional guide throughout the day',
        'All palace entrance fees',
        'Traditional Ottoman dinner',
        'Transportation between locations'
      ],
      notIncluded: [
        'Hotel pickup (meeting point provided)',
        'Personal shopping expenses',
        'Additional beverages'
      ],
      itinerary: [
        { time: '08:00', activity: 'Meeting at Eminönü pier' },
        { time: '08:30', activity: 'Bosphorus cruise begins' },
        { time: '11:00', activity: 'Topkapi Palace guided tour' },
        { time: '13:00', activity: 'Traditional lunch at palace restaurant' },
        { time: '15:00', activity: 'Beylerbeyi Palace visit' },
        { time: '17:00', activity: 'Basilica Cistern exploration' },
        { time: '19:00', activity: 'Ottoman dinner experience' }
      ]
    },
    {
      id: 3,
      image: '/eminönü.jpeg',
      title: 'Eminönü Food & Culture Tour',
      subtitle: 'Traditional Flavors Experience',
      price: '50€',
      originalPrice: '70€',
      popular: false,
      highlights: ['Spice Bazaar', 'Street Food', 'Galata Bridge'],
      duration: '4 hours',
      rating: 4.7,
      reviewCount: 156,
      description: 'Immerse yourself in the authentic flavors and culture of Istanbul with our food tour through Eminönü district. Taste traditional Turkish delicacies and explore the vibrant Spice Bazaar.',
      included: [
        'Professional food guide',
        'Food tastings at 8+ locations',
        'Spice Bazaar guided tour',
        'Traditional Turkish tea',
        'Recipe cards to take home'
      ],
      notIncluded: [
        'Additional food purchases',
        'Transportation to meeting point',
        'Alcoholic beverages'
      ],
      itinerary: [
        { time: '10:00', activity: 'Meeting at Eminönü Square' },
        { time: '10:30', activity: 'Spice Bazaar exploration and tastings' },
        { time: '12:00', activity: 'Street food tour around Eminönü' },
        { time: '13:30', activity: 'Traditional Turkish lunch' },
        { time: '14:00', activity: 'Galata Bridge fish sandwich experience' }
      ]
    },
    {
      id: 4,
      image: '/kizkulesi.jpeg',
      title: 'Maiden\'s Tower & Asian Side',
      subtitle: 'Iconic Tower & Üsküdar Tour',
      price: '180€',
      originalPrice: '220€',
      popular: true,
      highlights: ['Maiden\'s Tower', 'Üsküdar Mosque', 'Çamlıca Hill'],
      duration: '6 hours',
      rating: 4.6,
      reviewCount: 198,
      description: 'Explore the Asian side of Istanbul with a visit to the iconic Maiden\'s Tower and the beautiful Üsküdar district. Enjoy panoramic views from Çamlıca Hill.',
      included: [
        'Maiden\'s Tower boat transfer',
        'Tower entrance fee',
        'Professional guide',
        'Çamlıca Hill transportation',
        'Traditional Turkish coffee'
      ],
      notIncluded: [
        'Lunch (recommendations provided)',
        'Personal shopping',
        'Additional boat trips'
      ],
      itinerary: [
        { time: '09:00', activity: 'Meeting at Üsküdar pier' },
        { time: '09:30', activity: 'Boat trip to Maiden\'s Tower' },
        { time: '11:00', activity: 'Üsküdar Mosque and district tour' },
        { time: '13:00', activity: 'Traditional lunch break' },
        { time: '14:30', activity: 'Çamlıca Hill panoramic views' },
        { time: '15:30', activity: 'Return to European side' }
      ]
    },
    {
      id: 5,
      image: '/eminönü.jpeg',
      title: 'Golden Horn Historical Tour',
      subtitle: 'Byzantine & Ottoman Heritage',
      price: '200€',
      originalPrice: '250€',
      popular: false,
      highlights: ['Chora Church', 'Fener District', 'Pierre Loti Hill'],
      duration: '7 hours',
      rating: 4.5,
      reviewCount: 87,
      description: 'Journey through the Golden Horn to discover hidden Byzantine and Ottoman treasures. Visit the stunning Chora Church and explore the historic Fener neighborhood.',
      included: [
        'Transportation throughout tour',
        'Chora Church entrance fee',
        'Professional historian guide',
        'Pierre Loti Hill cable car',
        'Traditional Turkish lunch'
      ],
      notIncluded: [
        'Hotel pickup and drop-off',
        'Additional museum entries',
        'Personal expenses'
      ],
      itinerary: [
        { time: '09:00', activity: 'Meeting at Golden Horn metro station' },
        { time: '09:30', activity: 'Chora Church Byzantine mosaics tour' },
        { time: '11:30', activity: 'Fener Greek Orthodox Patriarchate' },
        { time: '13:00', activity: 'Traditional lunch in Balat district' },
        { time: '14:30', activity: 'Pierre Loti Hill and panoramic views' },
        { time: '16:00', activity: 'Return journey with Golden Horn views' }
      ]
    },
    {
      id: 6,
      image: '/belgrad.jpeg',
      title: 'Belgrade Forest Nature Tour',
      subtitle: 'Green Escape from City Life',
      price: '120€',
      originalPrice: '150€',
      popular: false,
      highlights: ['Forest Hiking', 'Ottoman Dams', 'Picnic Areas'],
      duration: '6 hours',
      rating: 4.4,
      reviewCount: 76,
      description: 'Escape the bustling city and immerse yourself in nature at Belgrade Forest. Discover Ottoman-era water infrastructure and enjoy peaceful hiking trails.',
      included: [
        'Transportation to Belgrade Forest',
        'Professional nature guide',
        'Hiking equipment if needed',
        'Picnic lunch in forest',
        'Ottoman dam historical tour'
      ],
      notIncluded: [
        'Personal hiking gear',
        'Additional snacks',
        'Photography fees'
      ],
      itinerary: [
        { time: '08:00', activity: 'Pickup from city center' },
        { time: '09:00', activity: 'Arrival at Belgrade Forest' },
        { time: '09:30', activity: 'Guided nature walk begins' },
        { time: '11:30', activity: 'Ottoman water systems tour' },
        { time: '12:30', activity: 'Forest picnic lunch' },
        { time: '14:00', activity: 'Return to city center' }
      ]
    },
    {
      id: 7,
      image: '/bostancı.jpeg',
      title: 'Asian Side Coastal Tour',
      subtitle: 'Bostancı to Kadıköy Journey',
      price: '85€',
      originalPrice: '110€',
      popular: false,
      highlights: ['Sea Promenade', 'Local Markets', 'Moda District'],
      duration: '5 hours',
      rating: 4.3,
      reviewCount: 92,
      description: 'Discover the authentic Asian side of Istanbul with a coastal journey from Bostancı to Kadıköy. Experience local life, markets, and seaside charm.',
      included: [
        'Local transportation',
        'Market tour with tastings',
        'Moda district walking tour',
        'Seaside café break',
        'Local guide'
      ],
      notIncluded: [
        'Meals (many local options)',
        'Shopping purchases',
        'Ferry tickets if desired'
      ],
      itinerary: [
        { time: '10:00', activity: 'Meeting at Bostancı station' },
        { time: '10:30', activity: 'Coastal promenade walk' },
        { time: '12:00', activity: 'Local market exploration' },
        { time: '13:30', activity: 'Traditional lunch break' },
        { time: '14:30', activity: 'Moda district and seaside cafés' },
        { time: '15:00', activity: 'End at Kadıköy ferry terminal' }
      ]
    },
    {
      id: 8,
      image: '/rumelifeneri.jpeg',
      title: 'Rumeli Fortress & Bosphorus',
      subtitle: 'Medieval Fortress Experience',
      price: '65€',
      originalPrice: '85€',
      popular: true,
      highlights: ['Rumeli Fortress', 'Bosphorus Views', 'Fish Markets'],
      duration: '7 hours',
      rating: 4.7,
      reviewCount: 143,
      description: 'Explore the mighty Rumeli Fortress and enjoy spectacular Bosphorus views. Visit traditional fish markets and experience the northern Bosphorus charm.',
      included: [
        'Rumeli Fortress entrance',
        'Professional historical guide',
        'Bosphorus viewpoint tour',
        'Fish market visit',
        'Traditional Turkish tea'
      ],
      notIncluded: [
        'Lunch (great local options)',
        'Boat trip (optional)',
        'Personal purchases'
      ],
      itinerary: [
        { time: '09:00', activity: 'Meeting at Sarıyer ferry terminal' },
        { time: '09:30', activity: 'Rumeli Fortress historical tour' },
        { time: '11:30', activity: 'Bosphorus viewpoints and photos' },
        { time: '13:00', activity: 'Sarıyer fish market experience' },
        { time: '14:30', activity: 'Traditional seafood lunch' },
        { time: '16:00', activity: 'Return journey along Bosphorus' }
      ]
    },
    {
      id: 9,
      image: '/kuzguncuk.jpeg',
      title: 'Kuzguncuk Village Tour',
      subtitle: 'Hidden Gem of Istanbul',
      price: '90€',
      originalPrice: '115€',
      popular: false,
      highlights: ['Colorful Houses', 'Old Synagogue', 'Bosphorus Cafes'],
      duration: '4 hours',
      rating: 4.6,
      reviewCount: 67,
      description: 'Discover the charming village of Kuzguncuk with its colorful Ottoman houses, historic synagogue, and cozy Bosphorus-side cafés. A perfect half-day escape.',
      included: [
        'Village walking tour',
        'Synagogue visit (if open)',
        'Local guide with village stories',
        'Traditional Turkish coffee',
        'Photography assistance'
      ],
      notIncluded: [
        'Transportation to Kuzguncuk',
        'Lunch (lovely local cafés)',
        'Souvenir purchases'
      ],
      itinerary: [
        { time: '10:00', activity: 'Meeting at Kuzguncuk ferry stop' },
        { time: '10:30', activity: 'Colorful houses photo tour' },
        { time: '11:30', activity: 'Historic synagogue and stories' },
        { time: '12:30', activity: 'Bosphorus-side café break' },
        { time: '13:30', activity: 'Local artisan shops visit' },
        { time: '14:00', activity: 'End of tour at ferry stop' }
      ]
    }
  ]

  useEffect(() => {
    const tour = tours.find(t => t.id === parseInt(params.id))
    setSelectedTour(tour)
  }, [params.id])
  
  // Initialize AOS only on client side after mount
  useEffect(() => {
    if (mounted) {
      AOS.init({
        duration: 600,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
      })
    }
  }, [mounted])

  // Refresh AOS when activeStep changes
  useEffect(() => {
    AOS.refresh()
  }, [activeStep])

  // Close people picker when clicking outside (SearchArea style)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPersonPicker && !isPersonClosing && !event.target.closest('.person-picker-container')) {
        closePeoplePicker()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showPersonPicker, isPersonClosing])

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue)
  }

  const handlePeopleCountChange = (increment) => {
    setPeopleCount(prev => Math.max(1, Math.min(15, prev + increment)))
  }

  // People picker helper functions
  const incrementCounter = (type) => {
    if (type === 'adults') setAdults(prev => prev + 1)
    if (type === 'children') setChildren(prev => prev + 1)
    if (type === 'babies') setBabies(prev => prev + 1)
    updateTotalPeople()
  }

  const decrementCounter = (type) => {
    if (type === 'adults' && adults > 1) setAdults(prev => prev - 1) // At least 1 adult
    if (type === 'children' && children > 0) setChildren(prev => prev - 1)
    if (type === 'babies' && babies > 0) setBabies(prev => prev - 1)
    updateTotalPeople()
  }

  const getTotalPersons = () => adults + children + babies

  const updateTotalPeople = () => {
    setTimeout(() => {
      setPeopleCount(adults + children + babies)
    }, 100)
  }

  const openPeoplePicker = () => {
    if (showPersonPicker || isPersonClosing) return
    
    setShowPersonPicker(true)
    setIsPersonOpening(true)
    setTimeout(() => setIsPersonOpening(false), 500)
  }

  const closePeoplePicker = () => {
    if (!showPersonPicker || isPersonClosing) return
    
    setIsPersonClosing(true)
    setIsPersonOpening(false)
    
    setTimeout(() => {
      setShowPersonPicker(false)
      setIsPersonClosing(false)
    }, 200)
  }

  const handleUserInfoChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentInfoChange = (field, value) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '')
    }
    return v
  }

  // Get card type from card number
  const getCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    return '';
  };

  const calculateTotal = () => {
    if (!selectedTour) return 0
    const basePrice = parseInt(selectedTour.price.replace('€', ''))
    return basePrice * getTotalPersons()
  }

  // Function to get emoji and color for highlight
  const getHighlightStyle = (highlight) => {
    const highlightLower = highlight.toLowerCase()
    
    // Historical/Religious sites
    if (highlightLower.includes('church') || highlightLower.includes('mosque') || 
        highlightLower.includes('cathedral') || highlightLower.includes('basilica') ||
        highlightLower.includes('palace') || highlightLower.includes('fortress') ||
        highlightLower.includes('tower') || highlightLower.includes('temple') ||
        highlightLower.includes('museum') || highlightLower.includes('cistern') ||
        highlightLower.includes('topkapi') || highlightLower.includes('rumeli') ||
        highlightLower.includes('chora') || highlightLower.includes('hagia')) {
      return { emoji: '🏛️', bgColor: 'bg-gradient-to-r from-purple-400/70 to-purple-600/70' }
    }
    
    // Markets/Shopping
    if (highlightLower.includes('bazaar') || highlightLower.includes('market') || 
        highlightLower.includes('spice') || highlightLower.includes('grand')) {
      return { emoji: '🛍️', bgColor: 'bg-gradient-to-r from-orange-400/70 to-orange-600/70' }
    }
    
    // Nature/Outdoor
    if (highlightLower.includes('forest') || highlightLower.includes('hill') || 
        highlightLower.includes('mountain') || highlightLower.includes('park') ||
        highlightLower.includes('pierre loti') || highlightLower.includes('çamlıca') ||
        highlightLower.includes('belgrade')) {
      return { emoji: '🌲', bgColor: 'bg-gradient-to-r from-green-400/70 to-green-600/70' }
    }
    
    // Water/Bosphorus
    if (highlightLower.includes('bosphorus') || highlightLower.includes('cruise') || 
        highlightLower.includes('bridge') || highlightLower.includes('pier') ||
        highlightLower.includes('golden horn') || highlightLower.includes('maiden')) {
      return { emoji: '🌊', bgColor: 'bg-gradient-to-r from-blue-400/70 to-blue-600/70' }
    }
    
    // Districts/Neighborhoods
    if (highlightLower.includes('district') || highlightLower.includes('neighborhood') || 
        highlightLower.includes('fener') || highlightLower.includes('balat') ||
        highlightLower.includes('üsküdar') || highlightLower.includes('eminönü') ||
        highlightLower.includes('galata') || highlightLower.includes('kadıköy') ||
        highlightLower.includes('beylerbeyi') || highlightLower.includes('kuzguncuk')) {
      return { emoji: '🏘️', bgColor: 'bg-gradient-to-r from-indigo-400/70 to-indigo-600/70' }
    }
    
    // Food/Culture
    if (highlightLower.includes('food') || highlightLower.includes('restaurant') || 
        highlightLower.includes('café') || highlightLower.includes('coffee') ||
        highlightLower.includes('tea') || highlightLower.includes('lunch') ||
        highlightLower.includes('dinner')) {
      return { emoji: '🍽️', bgColor: 'bg-gradient-to-r from-red-400/70 to-red-600/70' }
    }
    
    // Asian side specific
    if (highlightLower.includes('asian') || highlightLower.includes('bostancı') || 
        highlightLower.includes('moda') || highlightLower.includes('coastal')) {
      return { emoji: '🏖️', bgColor: 'bg-gradient-to-r from-teal-400/70 to-teal-600/70' }
    }
    
    // Default fallback
    return { emoji: '📍', bgColor: 'bg-gradient-to-r from-gray-400/70 to-gray-600/70' }
  }

  const steps = ['Tour Details', 'Date & People', 'Your Information', 'Payment']

  if (!selectedTour) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tour details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Custom Styles for Calendar */}
      <style jsx global>{`
        .MuiPickersDay-root.Mui-selected {
          background-color: #1f2937 !important;
          color: white !important;
        }
        .MuiPickersDay-root.Mui-selected:hover {
          background-color: #111827 !important;
        }
        .MuiPickersDay-root:hover {
          background-color: #f3f4f6 !important;
        }
        .MuiPickersCalendarHeader-root .MuiIconButton-root {
          color: #1f2937 !important;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(10px) scale(0.95); }
        }
        .animate-slideUpMobile {
          animation: slideUpMobile 0.5s ease-out;
        }
        .animate-slideDownMobile {
          animation: slideDownMobile 0.5s ease-out;
        }
        @keyframes slideUpMobile {
          from { 
            opacity: 0; 
            transform: translateY(100%); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        @keyframes slideDownMobile {
          from { 
            opacity: 1; 
            transform: translateY(0); 
          }
          to { 
            opacity: 0; 
            transform: translateY(100%); 
          }
        }
        @keyframes slideInFromLeft {
          from { 
            opacity: 0; 
            transform: translateX(-100%) scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
          }
        }
        @keyframes buttonResize {
          from { 
            transform: scale(1); 
          }
          50% { 
            transform: scale(0.98); 
          }
          to { 
            transform: scale(1); 
          }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
      
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden ">
        <Image
          src={selectedTour.image}
          alt={selectedTour.title} 
          fill
          className="object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center">
          <div className="text-center text-white max-w-4xl px-4 pb-8">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">{selectedTour.title}</h1>
            <p className="text-lg md:text-xl lg:text-2xl opacity-90 mb-4">{selectedTour.subtitle}</p>
            <div className="flex items-center justify-center gap-4 md:gap-6">
              <div className="flex items-center gap-1">
                <StarIcon className="text-yellow-400 w-4 h-4 md:w-5 md:h-5" />
                <span className="font-semibold text-sm md:text-base">{selectedTour.rating}</span>
                <span className="opacity-75 text-sm md:text-base">({selectedTour.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <AccessTimeIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">{selectedTour.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 md:py-8">
        {/* Progress Steps */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-center overflow-x-auto px-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 ${
                  activeStep >= index 
                    ? 'bg-gradient-to-r from-gray-800 to-black border-gray-800 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {activeStep > index ? (
                    <CheckCircleIcon className="w-4 h-4 md:w-6 md:h-6" />
                  ) : (
                    <span className="font-semibold text-xs md:text-sm">{index + 1}</span>
                  )}
                </div>
                <span className={`ml-1 md:ml-2 text-xs md:text-sm font-medium hidden sm:block ${
                  activeStep >= index ? 'text-gray-800' : 'text-gray-400'
                }`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 mx-2 md:mx-4 ${
                    activeStep > index ? 'bg-gradient-to-r from-gray-800 to-black' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeStep === 0 && (
              <div className="space-y-6">
                {/* Tour Description */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4" data-aos="fade-up" data-aos-delay="100">About This Tour</h2>
                  <p className="text-gray-600 leading-relaxed mb-6" data-aos="fade-up" data-aos-delay="200">{selectedTour.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                    {selectedTour.highlights.map((highlight, index) => {
                      const { emoji, bgColor } = getHighlightStyle(highlight)
                      return (
                        <div 
                          key={index} 
                          className={`flex items-center gap-2 p-3 ${bgColor} rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                          data-aos="fade-up"
                          data-aos-delay={`${300 + (index * 100)}`}
                        >
                          <span className="text-lg">{emoji}</span>
                          <span className="text-white font-medium text-xs">{highlight}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* What's Included */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 text-start" data-aos="fade-up" data-aos-delay="400">
                    What's Included
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Included Section */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl py-6" data-aos="fade-up" data-aos-delay="500">
                      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-300">
                        <div className="bg-green-500 p-2 rounded-lg">
                          <CheckCircleIcon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-green-700">Included</h4>
                      </div>
                      <ul className="space-y-1">
                        {selectedTour.included.map((item, index) => (
                          <li 
                            key={index} 
                            className="flex items-center gap-3 text-gray-700 group hover:bg-white/50 rounded-lg p-2 transition-all duration-200"
                            data-aos="fade-up"
                            data-aos-delay={`${600 + (index * 50)}`}
                          >
                            <div className="bg-green-100 p-1 rounded-full group-hover:bg-green-200 transition-colors duration-200">
                              <CheckCircleIcon className="text-green-600 w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Not Included Section */}
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl py-6 " data-aos="fade-up" data-aos-delay="550">
                      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-300">
                        <div className="bg-red-500 p-2 rounded-lg">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <h4 className="text-xl font-bold text-red-700">Not Included</h4>
                      </div>
                      <ul className="space-y-1">
                        {selectedTour.notIncluded.map((item, index) => (
                          <li 
                            key={index} 
                            className="flex items-center gap-3 text-gray-700 group hover:bg-white/50 rounded-lg p-2 transition-all duration-200"
                            data-aos="fade-up"
                            data-aos-delay={`${650 + (index * 50)}`}
                          >
                            <div className="bg-red-100 p-1 rounded-full group-hover:bg-red-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Itinerary */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 text-start" data-aos="fade-up" data-aos-delay="800">Tour Itinerary</h3>
                  <div className="space-y-4">
                    {selectedTour.itinerary.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                        data-aos="fade-up"
                        data-aos-delay={`${900 + (index * 100)}`}
                      >
                        <div 
                          className="bg-gradient-to-r from-gray-800 to-black text-white px-3 py-1 rounded-lg text-sm font-semibold min-w-fit"
                          data-aos="slide-right"
                          data-aos-delay={`${950 + (index * 100)}`}
                        >
                          {item.time}
                        </div>
                        <p 
                          className="text-gray-700"
                          data-aos="slide-left"
                          data-aos-delay={`${1000 + (index * 100)}`}
                        >
                          {item.activity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-6">
                {/* Date Selection */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6" data-aos="fade-up" data-aos-delay="100">Select Date</h2>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {mounted && (
                      <div data-aos="fade-up" data-aos-delay="200">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <StaticDatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            minDate={dayjs()}
                            className="w-full"
                            slotProps={{
                              actionBar: {
                                actions: []
                              }
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    )}
                    
                    <div className="space-y-6">
                      <div data-aos="fade-up" data-aos-delay="300">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Date</h3>
                        <div className="p-4 bg-gray-50 rounded-lg" data-aos="fade-up" data-aos-delay="350">
                          <div className="flex items-center gap-2 text-gray-800 font-semibold">
                            <CalendarTodayIcon className="w-5 h-5" />
                            {selectedDate.format('MMMM DD, YYYY')}
                          </div>
                        </div>
                      </div>

                      {/* People Count */}
                      <div className="relative" data-aos="fade-up" data-aos-delay="400">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Number of People</h3>
                        <div 
                          onClick={openPeoplePicker}
                          className="people-picker-trigger flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-300"
                        >
                          <div className="flex items-center gap-2">
                            <PersonIcon className="text-gray-600 w-5 h-5" />
                            <span className="font-medium">
                              {getTotalPersons()} {getTotalPersons() === 1 ? 'person' : 'people'}
                              {adults > 0 && ` (${adults} adults${children > 0 ? `, ${children} children` : ''}${babies > 0 ? `, ${babies} babies` : ''})`}
                            </span>
                          </div>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>

                        {/* Desktop People Picker */}
                        {showPersonPicker && (
                          <div className="hidden md:block">
                            <div className="absolute bottom-0 left-0 mb-2 z-50">
                              <div className={`person-picker-container bg-white rounded-2xl shadow-2xl p-6 w-96 border border-gray-200 ${isPersonClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
                                <h3 className="font-semibold text-gray-800 mb-4">Select People</h3>
                                
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                  <div>
                                    <h4 className="font-medium text-gray-800 text-sm">Adults</h4>
                                    <p className="text-gray-500 text-xs">13 years and above</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button 
                                      onClick={() => decrementCounter('adults')}
                                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                      disabled={adults <= 1}
                                    >
                                      <RemoveIcon className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{adults}</span>
                                    <button 
                                      onClick={() => incrementCounter('adults')}
                                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                    >
                                      <AddIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                  <div>
                                    <h4 className="font-medium text-gray-800 text-sm">Children</h4>
                                    <p className="text-gray-500 text-xs">2-12 years</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button 
                                      onClick={() => decrementCounter('children')}
                                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                      disabled={children <= 0}
                                    >
                                      <RemoveIcon className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{children}</span>
                                    <button 
                                      onClick={() => incrementCounter('children')}
                                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                    >
                                      <AddIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between py-3">
                                  <div>
                                    <h4 className="font-medium text-gray-800 text-sm">Babies</h4>
                                    <p className="text-gray-500 text-xs">Under 2 years</p>
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button 
                                      onClick={() => decrementCounter('babies')}
                                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                      disabled={babies <= 0}
                                    >
                                      <RemoveIcon className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-medium">{babies}</span>
                                    <button 
                                      onClick={() => incrementCounter('babies')}
                                      className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                                    >
                                      <AddIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                <button 
                                  onClick={closePeoplePicker}
                                  className="w-full bg-gradient-to-r from-gray-800 to-black text-white py-3 rounded-lg font-medium hover:from-gray-700 hover:to-gray-900 transition-all duration-300 cursor-pointer mt-4"
                                >
                                  Done ({getTotalPersons()} {getTotalPersons() === 1 ? 'person' : 'people'})
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                {/* User Information */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6" data-aos="fade-up" data-aos-delay="100">Your Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div data-aos="fade-up" data-aos-delay="150">
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={userInfo.name}
                        onChange={(e) => handleUserInfoChange('name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none transition-all"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div data-aos="fade-up" data-aos-delay="200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={userInfo.surname}
                        onChange={(e) => handleUserInfoChange('surname', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none transition-all"
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div data-aos="fade-up" data-aos-delay="250">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => handleUserInfoChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div data-aos="fade-up" data-aos-delay="300">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={userInfo.phone}
                        onChange={(e) => handleUserInfoChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none transition-all"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="mt-4 md:mt-6" data-aos="fade-up" data-aos-delay="350">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                    <textarea
                      value={userInfo.specialRequests}
                      onChange={(e) => handleUserInfoChange('specialRequests', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none transition-all"
                      placeholder="Any special requests or dietary requirements..."
                    />
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                {/* Payment Information */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6" data-aos="fade-up" data-aos-delay="100">Payment Information</h2>
                  
                  {/* Interactive Credit Card */}
                  <div className="mb-8" data-aos="fade-up" data-aos-delay="150">
                    <div className="relative w-full max-w-md mx-auto h-56 perspective-1000">
                      <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${cardFlipped ? 'rotate-y-180' : ''}`}>
                        
                        {/* Card Front */}
                        <div className="absolute w-full h-full backface-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
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
                            <div className="flex items-center justify-between mb-8">
                              {/* Chip - Smaller */}
                              <div className="w-10 h-8 bg-yellow-400 rounded-md"></div>
                              
                              {/* Card Type Logo - with fade in animation */}
                              {getCardType(paymentInfo.cardNumber) && (
                                <div className="text-2xl font-bold tracking-wider transition-opacity duration-500 ease-in-out opacity-100">
                                  {getCardType(paymentInfo.cardNumber) === 'visa' ? 'VISA' : 
                                   getCardType(paymentInfo.cardNumber) === 'mastercard' ? 'Mastercard' : 
                                   getCardType(paymentInfo.cardNumber) === 'amex' ? 'AMEX' : ''}
                                </div>
                              )}
                            </div>
                            
                            {/* Card Number - Bigger */}
                            <div className="text-2xl tracking-[0.2em] mb-6 font-mono">
                              {paymentInfo.cardNumber || '•••• •••• •••• ••••'}
                            </div>
                            
                            {/* Card Holder & Expiry - Moved up */}
                            <div className="flex justify-between relative z-10">
                              <div>
                                <div className="text-[10px] opacity-70 uppercase tracking-wider">Card Holder</div>
                                <div className="text-base font-medium uppercase tracking-wide">{paymentInfo.cardHolder || 'YOUR NAME'}</div>
                              </div>
                              <div>
                                <div className="text-[10px] opacity-70 uppercase tracking-wider">Expires</div>
                                <div className="text-base font-medium">{paymentInfo.expiryDate || 'MM/YY'}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Card Back */}
                        <div className="absolute w-full h-full backface-hidden rotate-y-180">
                          <div className="w-full h-full bg-gradient-to-br from-purple-700 to-purple-600 rounded-2xl shadow-2xl relative overflow-hidden">
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
                                <span className="font-mono text-gray-800 text-lg">{paymentInfo.cvv || '•••'}</span>
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
                  
                  <div className="space-y-4 md:space-y-6">
                    <div data-aos="fade-up" data-aos-delay="200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => handlePaymentInfoChange('cardNumber', formatCardNumber(e.target.value))}
                        onFocus={() => setCardFlipped(false)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none transition-all"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>

                    <div data-aos="fade-up" data-aos-delay="250">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        value={paymentInfo.cardHolder}
                        onChange={(e) => handlePaymentInfoChange('cardHolder', e.target.value.toUpperCase())}
                        onFocus={() => setCardFlipped(false)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none transition-all"
                        placeholder="JOHN DOE"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div data-aos="fade-up" data-aos-delay="300">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => handlePaymentInfoChange('expiryDate', formatExpiryDate(e.target.value))}
                          onFocus={() => setCardFlipped(false)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none transition-all"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div data-aos="fade-up" data-aos-delay="350">
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => handlePaymentInfoChange('cvv', e.target.value.replace(/\D/g, ''))}
                          onFocus={() => setCardFlipped(true)}
                          onBlur={() => setCardFlipped(false)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-black focus:outline-none transition-all"
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 sticky top-4 md:top-8" data-aos="fade-left" data-aos-delay="200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={selectedTour.image}
                    alt={selectedTour.title}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{selectedTour.title}</h4>
                    <p className="text-gray-600 text-xs">{selectedTour.duration}</p>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {activeStep >= 1 && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{selectedDate.format('MMM DD, YYYY')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">People:</span>
                        <span className="font-medium">{getTotalPersons()} person{getTotalPersons() > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <hr className="border-gray-200" />
                  </>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per person:</span>
                    <span className="font-medium">{selectedTour.price}</span>
                  </div>
                  {selectedTour.originalPrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Original price:</span>
                      <span className="text-gray-400 line-through">{selectedTour.originalPrice}</span>
                    </div>
                  )}
                  {getTotalPersons() > 1 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">× {getTotalPersons()} people:</span>
                      <span className="font-medium">{calculateTotal()}€</span>
                    </div>
                  )}
                </div>

                <hr className="border-gray-200" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-gray-800">{calculateTotal()}€</span>
                </div>

                {selectedTour.originalPrice && (
                  <div className="text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Save {parseInt(selectedTour.originalPrice.replace('€', '')) - parseInt(selectedTour.price.replace('€', ''))}€ per person!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons - Mobile */}
      <div className="block md:hidden">
        <div 
          className="fixed bottom-0 left-0 right-0 bg-white/30 border-t border-gray-200/20 p-3 z-50"
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
        >
          <div className="max-w-7xl mx-auto flex gap-3">
            {/* Back Button - Animated */}
            <button
              onClick={() => {
                setActiveStep(activeStep - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`bg-white text-gray-800 border border-gray-800 py-3 rounded-xl font-semibold text-base hover:bg-gray-700 hover:text-white transition-all duration-700 cursor-pointer transform ${
                activeStep > 0 
                  ? 'w-[30%] opacity-100 translate-x-0 scale-100' 
                  : 'w-0 opacity-0 -translate-x-full scale-95 overflow-hidden'
              }`}
              style={{ 
                minWidth: activeStep > 0 ? 'auto' : '0',
                maxWidth: activeStep > 0 ? '30%' : '0',
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: activeStep > 0 ? 'auto' : 'none'
              }}
            >
              <span className={`transition-all duration-500 ${
                activeStep > 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
              }`}>
                Back
              </span>
            </button>
            
            {/* Continue Button - Animated */}
            <button
              key={`continue-button-${activeStep}`}
              onClick={activeStep < 3 ? () => {
                setActiveStep(activeStep + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } : () => alert('Booking confirmed! Thank you for choosing our tour.')}
              className={`bg-gradient-to-r from-gray-800 to-black text-white py-3 rounded-xl font-semibold text-base hover:from-gray-700 hover:to-gray-900 transition-all duration-700 cursor-pointer transform hover:scale-[1.02] ${
                activeStep > 0 ? 'w-[70%]' : 'w-full'
              }`}
              style={{
                transition: 'width 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: activeStep === 0 ? 'none' : 'buttonResize 0.7s ease-out'
              }}
            >
              <span className="transition-all duration-500">
                {activeStep === 0 
                  ? 'Continue to Date Selection'
                  : activeStep < 3 
                    ? (activeStep === 1 ? 'Continue to Information' : 'Continue to Payment')
                    : 'Complete Booking'
                }
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Buttons - Desktop */}
      <div className="hidden md:block">
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex gap-3 items-center">
            <button
              onClick={() => {
                setActiveStep(activeStep - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`bg-white border-gray-800 border hover:bg-gray-200 px-12 py-3 rounded-xl font-semibold text-base  transition-all duration-300 shadow-lg cursor-pointer transform ${
                activeStep > 0 
                  ? 'opacity-100 translate-x-0 scale-100' 
                  : 'opacity-0 -translate-x-full scale-95'
              }`}
              style={{ 
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: activeStep > 0 ? 'auto' : 'none'
              }}
            >
              <span className={`transition-all duration-300 ${
                activeStep > 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
              }`}>
                Back
              </span>
            </button>
            <button
              onClick={activeStep < 3 ? () => {
                setActiveStep(activeStep + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } : () => alert('Booking confirmed! Thank you for choosing our tour.')}
              className="bg-gradient-to-r from-gray-800 to-black text-white px-16 py-3 rounded-xl font-semibold text-base hover:from-gray-700 hover:to-gray-900 transition-all duration-700 shadow-lg cursor-pointer transform hover:scale-[1.02]"
              style={{
                transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <span className="transition-all duration-500">
                {activeStep === 0 
                  ? 'Continue to Date Selection'
                  : activeStep < 3 
                    ? (activeStep === 1 ? 'Continue to Information' : 'Continue to Payment')
                    : 'Complete Booking'
                }
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile People Picker */}
      {showPersonPicker && (
        <div className="block md:hidden">
          <div className="fixed inset-0 z-50 flex items-end">
            <div 
              className="fixed inset-0"
              onClick={closePeoplePicker}
            />
            <div className={`w-full bg-white rounded-t-3xl p-6 transform relative z-10 ${
              isPersonClosing 
                ? 'animate-slideDownMobile' 
                : isPersonOpening 
                  ? 'animate-slideUpMobile'
                  : 'translate-y-0 opacity-100'
            }`}>
              {/* Drag Indicator */}
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Select People</h3>
                <button 
                  onClick={closePeoplePicker}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h4 className="font-medium">Adults</h4>
                  <p className="text-sm text-gray-500">13 years and above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => decrementCounter('adults')}
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                    disabled={adults <= 1}
                  >
                    <RemoveIcon className="w-5 h-5" />
                  </button>
                  <span className="w-8 text-center font-medium text-lg">{adults}</span>
                  <button 
                    onClick={() => incrementCounter('adults')}
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                  >
                    <AddIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <h4 className="font-medium">Children</h4>
                  <p className="text-sm text-gray-500">2-12 years</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => decrementCounter('children')}
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                    disabled={children <= 0}
                  >
                    <RemoveIcon className="w-5 h-5" />
                  </button>
                  <span className="w-8 text-center font-medium text-lg">{children}</span>
                  <button 
                    onClick={() => incrementCounter('children')}
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                  >
                    <AddIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <h4 className="font-medium">Babies</h4>
                  <p className="text-sm text-gray-500">Under 2 years</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => decrementCounter('babies')}
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                    disabled={babies <= 0}
                  >
                    <RemoveIcon className="w-5 h-5" />
                  </button>
                  <span className="w-8 text-center font-medium text-lg">{babies}</span>
                  <button 
                    onClick={() => incrementCounter('babies')}
                    className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all duration-300 cursor-pointer"
                  >
                    <AddIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button 
                onClick={closePeoplePicker}
                className="w-full bg-gradient-to-r from-gray-800 to-black text-white py-3 rounded-lg font-medium mt-6 hover:from-gray-700 hover:to-gray-900 transition-all duration-300 cursor-pointer"
              >
                Done ({getTotalPersons()} people)
              </button>
            </div>
          </div>
        </div>
      )}
      <br />
      <br />
      <br />
      <br />
      <br />
    
    </div>
  )
}

export default TourDetailPage
